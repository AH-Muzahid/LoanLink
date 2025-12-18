import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaClock, FaUser, FaMoneyBillWave, FaTimesCircle, FaCheckCircle, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';

const PendingLoans = () => {
    const [selectedApp, setSelectedApp] = useState(null);
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        document.title = 'Pending Applications - Dashboard | LoanLink';
    }, []);

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['pending-applications'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/applications?status=pending');
            return data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const updates = {
                status,
                ...(status === 'approved' && { approvedAt: new Date().toISOString() })
            };
            const { data } = await axiosSecure.patch(`/applications/${id}`, updates);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['pending-applications']);
            toast.success(`Application ${variables.status} successfully`);
            setSelectedApp(null);
        }
    });

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

    return (
        <div className="min-h-screen bg-base-200/30 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent flex items-center gap-3">
                    <FaClock className="text-[#B91116]" /> Pending Applications
                </h2>
                <p className="text-base-content/60 mt-1">Review and manage loan requests awaiting approval</p>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {/* Desktop Table View */}
                    <motion.div
                        variants={containerVariants}
                        // initial="hidden"
                        animate="visible"
                        className="hidden md:block bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-base-200/50 text-base-content/70">
                                    <tr>
                                        <th className="py-4 pl-6">Loan ID</th>
                                        <th>User Info</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th className="pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app) => (
                                        <motion.tr
                                            key={app._id}
                                            variants={itemVariants}
                                            className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none"
                                        >
                                            <td className="pl-6 py-4 font-mono text-sm opacity-70">
                                                #{app._id?.slice(-6).toUpperCase()}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
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
                                                <div className="font-bold text-[#B91116]">৳{app.amount?.toLocaleString()}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm">{new Date(app.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="btn btn-circle btn-ghost btn-sm text-blue-500 hover:bg-blue-50"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'approved' })}
                                                        className="btn btn-circle btn-ghost btn-sm text-green-500 hover:bg-green-50"
                                                        title="Approve"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'rejected' })}
                                                        className="btn btn-circle btn-ghost btn-sm text-red-500 hover:bg-red-50"
                                                        title="Reject"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {applications.length === 0 && (
                            <div className="p-12 text-center text-base-content/50">
                                <FaCheckCircle className="mx-auto text-4xl mb-3 opacity-20" />
                                <p>No pending applications found.</p>
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
                        {applications.map((app) => (
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
                                            <p className="text-xs text-base-content/60">{app.userEmail}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs opacity-50">#{app._id?.slice(-6).toUpperCase()}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-t border-b border-base-100 mb-4">
                                    <div className="text-sm">Amount</div>
                                    <div className="font-bold text-[#B91116] text-lg">৳{app.amount?.toLocaleString()}</div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="btn btn-sm flex-1 btn-ghost border border-base-200"
                                    >
                                        <FaEye /> View
                                    </button>
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'approved' })}
                                        className="btn btn-sm flex-1 btn-success text-white"
                                    >
                                        <FaCheck /> Approve
                                    </button>
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'rejected' })}
                                        className="btn btn-sm flex-1 btn-error text-white"
                                    >
                                        <FaTimes /> Reject
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}

            {/* Details Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <dialog className="modal modal-open backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="modal-box w-11/12 max-w-2xl bg-base-100 shadow-2xl border border-base-200 p-0 overflow-hidden"
                        >
                            <div className="bg-[#B91116] p-4 text-white flex justify-between items-center">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <FaFileAlt /> Application Details
                                </h3>
                                <button onClick={() => setSelectedApp(null)} className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20">
                                    <FaTimesCircle className="text-xl" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-1">Applicant</h4>
                                            <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                        <span>{selectedApp.userName?.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{selectedApp.userName}</div>
                                                    <div className="text-xs text-base-content/60">{selectedApp.userEmail}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-1">Loan Details</h4>
                                            <div className="p-3 bg-base-200/50 rounded-xl space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Amount:</span>
                                                    <span className="font-bold text-[#B91116]">৳{selectedApp.amount?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Category:</span>
                                                    <span className="font-medium">{selectedApp.category}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Date:</span>
                                                    <span className="font-medium">{new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-1">Purpose</h4>
                                            <div className="p-3 bg-base-200/50 rounded-xl min-h-[100px]">
                                                <p className="text-sm">{selectedApp.purpose || "No purpose specified."}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-action mt-8 border-t border-base-200 pt-4">
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ id: selectedApp._id, status: 'rejected' })}
                                        className="btn btn-outline btn-error gap-2"
                                    >
                                        <FaTimes /> Reject Application
                                    </button>
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ id: selectedApp._id, status: 'approved' })}
                                        className="btn bg-[#B91116] hover:bg-[#900d11] text-white border-none gap-2"
                                    >
                                        <FaCheck /> Approve Application
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </dialog>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PendingLoans;
