import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaEye, FaSearch, FaCalendarAlt, FaUser, FaMoneyBillWave, FaTimesCircle, FaFileAlt } from 'react-icons/fa';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';

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

    const filteredApps = applications.filter(app =>
        app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                        <th>Approved Date</th>
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
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaCalendarAlt className="text-base-content/40" />
                                                    {app.approvedAt ? new Date(app.approvedAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="pr-6 text-right">
                                                <button
                                                    onClick={() => setSelectedApp(app)}
                                                    className="btn btn-circle btn-ghost btn-sm text-blue-500 hover:bg-blue-50"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredApps.length === 0 && (
                            <div className="p-12 text-center text-base-content/50">
                                <FaSearch className="mx-auto text-4xl mb-3 opacity-20" />
                                <p>No approved applications found matching your search.</p>
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
                                            <p className="text-xs text-base-content/60">{app.userEmail}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs opacity-50">#{app._id?.slice(-6).toUpperCase()}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-t border-b border-base-100 mb-4">
                                    <div className="text-sm">Amount</div>
                                    <div className="font-bold text-[#B91116] text-lg">৳{app.amount?.toLocaleString()}</div>
                                </div>

                                <div className="flex justify-between items-center text-sm text-base-content/60 mb-4">
                                    <span>Approved Date:</span>
                                    <span className="font-medium text-base-content">
                                        {app.approvedAt ? new Date(app.approvedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setSelectedApp(app)}
                                    className="btn btn-sm w-full btn-outline border-base-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    <FaEye /> View Details
                                </button>
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
                                                    <span className="text-sm">Approved Date:</span>
                                                    <span className="font-medium">{selectedApp.approvedAt ? new Date(selectedApp.approvedAt).toLocaleDateString() : 'N/A'}</span>
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
                                    <button onClick={() => setSelectedApp(null)} className="btn btn-ghost">Close</button>
                                </div>
                            </div>
                        </motion.div>
                    </dialog>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApprovedLoans;
