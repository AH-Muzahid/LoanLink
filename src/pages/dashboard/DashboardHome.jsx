import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth/useAuth';
import useUserData from '../../Hooks/useUserData';
import { FaUsers, FaMoneyBillWave, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

const DashboardHome = () => {
    useEffect(() => {
        document.title = 'Dashboard - LoanLink';
    }, []);
    const { user } = useAuth();
    const userData = useUserData();
    const role = userData?.role;

    const { data: stats = {} } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const [users, loans, applications] = await Promise.all([
                axios.get('http://localhost:5000/users'),
                axios.get('http://localhost:5000/all-loans'),
                axios.get('http://localhost:5000/applications')
            ]);
            return {
                totalUsers: users.data.length,
                totalLoans: loans.data.length,
                totalApplications: applications.data.length,
                approvedApplications: applications.data.filter(app => app.status === 'approved').length
            };
        },
        enabled: role === 'admin'
    });

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName}!</h2>
                <p className="text-base-content/60">Here's what's happening with your account today.</p>
            </div>

            {/* Stats Cards - Admin Only */}
            {role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stat bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg">
                        <div className="stat-figure text-white/30">
                            <FaUsers className="text-5xl" />
                        </div>
                        <div className="stat-title text-white/80">Total Users</div>
                        <div className="stat-value">{stats.totalUsers || 0}</div>
                    </div>

                    <div className="stat bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg">
                        <div className="stat-figure text-white/30">
                            <FaMoneyBillWave className="text-5xl" />
                        </div>
                        <div className="stat-title text-white/80">Total Loans</div>
                        <div className="stat-value">{stats.totalLoans || 0}</div>
                    </div>

                    <div className="stat bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg">
                        <div className="stat-figure text-white/30">
                            <FaFileAlt className="text-5xl" />
                        </div>
                        <div className="stat-title text-white/80">Applications</div>
                        <div className="stat-value">{stats.totalApplications || 0}</div>
                    </div>

                    <div className="stat bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg">
                        <div className="stat-figure text-white/30">
                            <FaCheckCircle className="text-5xl" />
                        </div>
                        <div className="stat-title text-white/80">Approved</div>
                        <div className="stat-value">{stats.approvedApplications || 0}</div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h3 className="card-title text-2xl mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {role === 'admin' && (
                            <>
                                <Link to="/dashboard/manage-users" className="btn btn-primary btn-lg">
                                    <FaUsers /> Manage Users
                                </Link>
                                <Link to="/dashboard/all-loans" className="btn btn-primary btn-lg">
                                    <FaMoneyBillWave /> View All Loans
                                </Link>
                                <Link to="/dashboard/loan-applications" className="btn btn-primary btn-lg">
                                    <FaFileAlt /> Applications
                                </Link>
                            </>
                        )}
                        {role === 'manager' && (
                            <>
                                <Link to="/dashboard/add-loan" className="btn btn-primary btn-lg">Add New Loan</Link>
                                <Link to="/dashboard/manage-loans" className="btn btn-primary btn-lg">My Loans</Link>
                            </>
                        )}
                        {role === 'borrower' && (
                            <>
                                <Link to="/dashboard/apply-loan" className="btn btn-primary btn-lg">Apply for Loan</Link>
                                <Link to="/dashboard/my-loans" className="btn btn-primary btn-lg">My Loans</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
