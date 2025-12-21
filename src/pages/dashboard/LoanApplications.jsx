import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { useState, useEffect } from 'react';
import { FaEye, FaSearch, FaFilter, FaFileAlt, FaCheckCircle, FaTimesCircle, FaClock, FaUser } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { motion } from 'framer-motion';
import Modal from '../../Componets/Modal/Modal';

const LoanApplications = () => {
    useEffect(() => {
        document.title = 'Loan Applications - Dashboard | LoanLink';
    }, []);

    const [filter, setFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['loan-applications'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/applications');
            return data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const { data } = await axiosSecure.patch(`/applications/${id}`, { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['loan-applications']);
            toast.success('Status updated successfully');
        }
    });

    const filteredApps = filter === 'all'
        ? applications
        : applications.filter(app => app.status === filter);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const getStatusColor = (status, feeStatus) => {
        if (feeStatus === 'paid') return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
        switch (status) {
            case 'approved': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            case 'rejected': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
            default: return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
        }
    };

    const getStatusIcon = (status, feeStatus) => {
        if (feeStatus === 'paid') return <FaCheckCircle />;
        switch (status) {
            case 'approved': return <FaCheckCircle />;
            case 'rejected': return <FaTimesCircle />;
            default: return <FaClock />;
        }
    };

    return (
        <div className="min-h-screen bg-base-200/30 p-4 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-linear-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent flex items-center gap-3">
                        <FaFileAlt className="text-[#B91116]" /> Loan Applications
                    </h2>
                    <p className="text-base-content/60 mt-1">Manage and review all loan requests</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 bg-base-100 p-1.5 rounded-xl shadow-sm border border-base-200">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${filter === status
                                ? 'bg-[#B91116] text-white shadow-md'
                                : 'text-base-content/70 hover:bg-base-200 hover:text-[#B91116]'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {/* Desktop Table View */}
                    <motion.div
                        variants={containerVariants}
                        initial=""
                        animate="visible"
                        className="hidden md:block bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-base-200/50 text-base-content/70">
                                    <tr>
                                        <th className="py-4 pl-6">Applicant</th>
                                        <th>Loan Details</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th className="pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApps.map((app) => (
                                        <motion.tr
                                            key={app._id}
                                            variants={itemVariants}
                                            className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none"
                                        >
                                            <td className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                            <img src={app.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=${app.userName}"} alt="" />
                                                            <span className="text-xs">{app.userName?.charAt(0)}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{app.userName}</div>
                                                        <div className="text-xs text-base-content/50">{app.userEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-medium">{app.category}</div>
                                                <div className="text-xs text-base-content/50 font-mono">{app.loanId?.slice(0, 8)}...</div>
                                            </td>
                                            <td>
                                                <div className="font-bold text-[#B91116]">৳{app.amount?.toLocaleString()}</div>
                                            </td>
                                            <td className="text-sm text-base-content/70">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className={`badge gap-2 font-medium  border-none py-3 px-4 ${getStatusColor(app.status, app.feeStatus)}`}>
                                                    {getStatusIcon(app.status, app.feeStatus)}
                                                    <span className="capitalize">{app.feeStatus === 'paid' ? 'Paid' : app.status}</span>
                                                </div>
                                            </td>
                                            <td className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <select
                                                        value={app.status || 'pending'}
                                                        onChange={(e) => updateStatusMutation.mutate({ id: app._id, status: e.target.value })}
                                                        className="select select-bordered select-xs w-28 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approve</option>
                                                        <option value="rejected">Reject</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-[#B91116] hover:bg-red-50"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredApps.length === 0 && (
                            <div className="p-12 text-center text-base-content/50">
                                <FaFilter className="mx-auto text-4xl mb-3 opacity-20" />
                                <p>No applications found for this filter.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Mobile Card View */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="md:hidden space-y-4"
                    >
                        {filteredApps.map((app) => (
                            <motion.div
                                key={app._id}
                                variants={itemVariants}
                                className="bg-base-100 p-5 rounded-2xl shadow-lg border border-base-200"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                <span>{app.userName?.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{app.userName}</h3>
                                            <p className="text-xs text-base-content/50">{app.category}</p>
                                        </div>
                                    </div>
                                    <div className={`badge gap-1 font-medium border-none ${getStatusColor(app.status, app.feeStatus)}`}>
                                        {getStatusIcon(app.status, app.feeStatus)}
                                        <span className="capitalize text-xs">{app.feeStatus === 'paid' ? 'Paid' : app.status}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div className="bg-base-200/50 p-3 rounded-xl">
                                        <p className="text-xs text-base-content/50 mb-1">Amount</p>
                                        <p className="font-bold text-[#B91116]">৳{app.amount?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-base-200/50 p-3 rounded-xl">
                                        <p className="text-xs text-base-content/50 mb-1">Date</p>
                                        <p className="font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <select
                                        value={app.status || 'pending'}
                                        onChange={(e) => updateStatusMutation.mutate({ id: app._id, status: e.target.value })}
                                        className="select select-bordered select-sm flex-1 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approve</option>
                                        <option value="rejected">Reject</option>
                                    </select>
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="btn btn-sm btn-ghost border border-base-300"
                                    >
                                        <FaEye />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}

            {/* Enhanced Modal */}
            {/* Enhanced Modal */}
            <Modal
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                title={
                    <div>
                        <h3 className="font-bold text-xl">Application Details</h3>
                        {selectedApp && <p className="text-white/80 text-sm mt-1">ID: {selectedApp.loanId}</p>}
                    </div>
                }
            >
                {selectedApp && (
                    <>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                    <div className="bg-white p-2 rounded-full shadow-sm">
                                        <FaUser className="text-[#B91116]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-base-content/50 uppercase font-bold">Applicant</p>
                                        <p className="font-medium">{selectedApp.userName}</p>
                                        <p className="text-xs text-base-content/60">{selectedApp.userEmail}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Loan Category</p>
                                    <p className="text-lg font-medium">{selectedApp.category}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Requested Amount</p>
                                    <p className="text-2xl font-bold text-[#B91116]">৳{selectedApp.amount?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Current Status</p>
                                    <div className={`badge gap-2 font-medium border-none py-3 px-4 ${getStatusColor(selectedApp.status, selectedApp.feeStatus)}`}>
                                        {getStatusIcon(selectedApp.status, selectedApp.feeStatus)}
                                        <span className="capitalize">{selectedApp.feeStatus === 'paid' ? 'Paid' : selectedApp.status}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Application Date</p>
                                    <p className="font-medium">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Purpose</p>
                                    <div className="bg-base-200/50 p-3 rounded-xl text-sm leading-relaxed">
                                        {selectedApp.purpose || "No purpose specified."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-base-200/30 border-t border-base-200 flex justify-end gap-2">
                            <button onClick={() => setSelectedApp(null)} className="btn btn-ghost hover:bg-base-200">Close</button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default LoanApplications;
