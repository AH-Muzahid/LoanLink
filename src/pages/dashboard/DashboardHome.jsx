import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth/useAuth';
import useUserData from '../../Hooks/useUserData';
import { FaUsers, FaMoneyBillWave, FaFileAlt, FaCheckCircle, FaPlus, FaList, FaArrowRight, FaChartLine } from 'react-icons/fa';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { motion } from 'framer-motion';

const DashboardHome = () => {
    useEffect(() => {
        document.title = 'Dashboard - LoanLink';
    }, []);
    const { user } = useAuth();
    const userData = useUserData();
    const role = userData?.role;
    const axiosSecure = useAxiosSecure();

    const { data: stats = {} } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const [users, loans, applications] = await Promise.all([
                axiosSecure.get('/users'),
                axiosSecure.get('/all-loans'),
                axiosSecure.get('/applications')
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <motion.div
            variants={itemVariants}
            className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200 overflow-hidden relative group"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
                <Icon className={`text-9xl ${color}`} />
            </div>
            <div className="stat-figure text-secondary">
                <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')}/10`}>
                    <Icon className={`text-3xl ${color}`} />
                </div>
            </div>
            <div className="stat-title font-medium text-base-content/60">{title}</div>
            <div className="stat-value text-4xl font-bold text-base-content my-2">{value}</div>
            <div className="stat-desc text-base-content/50 flex items-center gap-1">
                <FaChartLine /> Updated just now
            </div>
        </motion.div>
    );

    const ActionCard = ({ to, icon: Icon, title, desc, color }) => (
        <motion.div variants={itemVariants}>
            <Link to={to} className="group block h-full">
                <div className="bg-base-100 rounded-xl p-4 shadow-md border border-base-200 hover:shadow-lg hover:border-red-200 transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${color} text-white shadow-md mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="text-xl" />
                    </div>
                    <h3 className="font-bold text-base text-base-content group-hover:text-[#B91116] transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-base-content/50 mt-1 line-clamp-1">
                        {desc}
                    </p>
                </div>
            </Link>
        </motion.div>
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-[80vh]"
        >
            {/* Welcome Section */}
            <motion.div variants={itemVariants} className="mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#B91116] to-[#900d11] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">
                            Welcome back, {user?.displayName?.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-red-100 text-lg max-w-xl">
                            Here's what's happening with your account today. Check your stats and manage your activities.
                        </p>
                    </div>
                    <div className="relative z-10 hidden md:block">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                            <p className="text-sm font-medium text-red-100">Current Role</p>
                            <p className="text-xl font-bold uppercase tracking-wider">{role}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards - Admin Only */}
            {role === 'admin' && (
                <div className="mb-12">
                    <motion.h3 variants={itemVariants} className="text-xl font-bold mb-6 flex items-center gap-2 text-base-content">
                        <FaChartLine className="text-[#B91116]" /> Overview Statistics
                    </motion.h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Users"
                            value={stats.totalUsers || 0}
                            icon={FaUsers}
                            color="text-blue-500"
                        />
                        <StatCard
                            title="Total Loans"
                            value={stats.totalLoans || 0}
                            icon={FaMoneyBillWave}
                            color="text-green-500"
                        />
                        <StatCard
                            title="Applications"
                            value={stats.totalApplications || 0}
                            icon={FaFileAlt}
                            color="text-orange-500"
                        />
                        <StatCard
                            title="Approved"
                            value={stats.approvedApplications || 0}
                            icon={FaCheckCircle}
                            color="text-purple-500"
                        />
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <motion.h3 variants={itemVariants} className="text-xl font-bold mb-6 flex items-center gap-2 text-base-content">
                    <FaList className="text-[#B91116]" /> Quick Actions
                </motion.h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {role === 'admin' && (
                        <>
                            <ActionCard
                                to="/dashboard/manage-users"
                                icon={FaUsers}
                                title="Manage Users"
                                desc="View, update, or remove users from the system."
                                color="bg-blue-500"
                            />
                            <ActionCard
                                to="/dashboard/all-loans"
                                icon={FaMoneyBillWave}
                                title="View All Loans"
                                desc="Monitor all loan listings and their details."
                                color="bg-green-500"
                            />
                            <ActionCard
                                to="/dashboard/loan-applications"
                                icon={FaFileAlt}
                                title="Loan Applications"
                                desc="Review and process incoming loan applications."
                                color="bg-orange-500"
                            />
                        </>
                    )}
                    {role === 'manager' && (
                        <>
                            <ActionCard
                                to="/dashboard/add-loan"
                                icon={FaPlus}
                                title="Add New Loan"
                                desc="Create a new loan package for borrowers."
                                color="bg-[#B91116]"
                            />
                            <ActionCard
                                to="/dashboard/manage-loans"
                                icon={FaList}
                                title="My Loans"
                                desc="Manage the loans you have created."
                                color="bg-blue-500"
                            />
                            <ActionCard
                                to="/dashboard/pending-loans"
                                icon={FaFileAlt}
                                title="Pending Applications"
                                desc="Review applications waiting for approval."
                                color="bg-orange-500"
                            />
                        </>
                    )}
                    {role === 'borrower' && (
                        <>
                            <ActionCard
                                to="/dashboard/apply-loan"
                                icon={FaPlus}
                                title="Apply for Loan"
                                desc="Browse available loans and submit an application."
                                color="bg-[#B91116]"
                            />
                            <ActionCard
                                to="/dashboard/my-loans"
                                icon={FaMoneyBillWave}
                                title="My Applications"
                                desc="Track the status of your loan applications."
                                color="bg-green-500"
                            />
                            <ActionCard
                                to="/dashboard/profile"
                                icon={FaUsers}
                                title="My Profile"
                                desc="Update your personal information and settings."
                                color="bg-blue-500"
                            />
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;
