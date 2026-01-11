import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useMemo } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { FaCheckCircle, FaSearch, FaFileAlt, FaCheckDouble } from 'react-icons/fa';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import ApplicationTable from '../../Componets/Dashboard/Shared/ApplicationTable';
import ApplicationCard from '../../Componets/Dashboard/Shared/ApplicationCard';
import ApplicationDetailsModal from '../../Componets/Dashboard/Shared/ApplicationDetailsModal';

const ApprovedLoans = () => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        document.title = 'Approved Applications - Dashboard | LoanLink';
    }, []);

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['approved-applications'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/applications?status=approved');
            return data;
        }
    });

    const filteredApps = useMemo(() => {
        if (!searchTerm) return applications;
        const lowerTerm = searchTerm.toLowerCase();
        return applications.filter(app =>
            (app.userName || '').toLowerCase().includes(lowerTerm) ||
            (app.userEmail || '').toLowerCase().includes(lowerTerm) ||
            (app._id || '').toLowerCase().includes(lowerTerm) ||
            (app.loanId || '').toLowerCase().includes(lowerTerm)
        );
    }, [applications, searchTerm]);

    const renderActions = (app) => (
        <>
            {app.feeStatus === 'paid' && (
                <div className="badge badge-success gap-1 py-3 px-3 opacity-90 text-white" title="Paid">
                    <FaCheckDouble className="text-xs" /> Paid
                </div>
            )}
        </>
    );

    const renderModalActions = (app) => (
        <>
            {app.feeStatus === 'paid' && (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm px-2">
                    <FaCheckDouble /> Loan Paid
                </div>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-base-200/30 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-linear-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent flex items-center gap-3">
                    <FaCheckCircle className="text-[#B91116]" /> Approved Applications
                </h2>
                <p className="text-base-content/60 mt-1">View history of all approved loan requests</p>
            </div>

            {/* Search Bar */}
            <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or loan ID..."
                        className="input input-bordered w-full pl-10 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <ApplicationTable
                        applications={filteredApps}
                        onView={setSelectedApp}
                        renderActions={renderActions}
                        showStatus={true}
                    />

                    <ApplicationCard
                        applications={filteredApps}
                        onView={setSelectedApp}
                        renderActions={renderActions}
                        showStatus={true}
                    />
                </>
            )}

            <ApplicationDetailsModal
                application={selectedApp}
                onClose={() => setSelectedApp(null)}
                renderModalActions={renderModalActions}
            />
        </div>
    );
};

export default ApprovedLoans;
