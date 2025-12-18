import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { FaEdit, FaBan, FaCheckCircle, FaUsers, FaSearch, FaUserShield, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';

const ManageUsers = () => {
    useEffect(() => {
        document.title = 'Manage Users - Dashboard | LoanLink';
    }, []);
    const [selectedUser, setSelectedUser] = useState(null);
    const [suspendModal, setSuspendModal] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');
    const [suspendFeedback, setSuspendFeedback] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/users');
            return data;
        }
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ id, updates }) => {
            const { data } = await axiosSecure.patch(`/users/${id}`, updates);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User updated successfully');
            setSelectedUser(null);
            setSuspendModal(false);
            setSuspendReason('');
            setSuspendFeedback('');
        }
    });

    const handleRoleChange = (user, newRole) => {
        updateUserMutation.mutate({ id: user._id, updates: { role: newRole } });
    };

    const handleStatusToggle = (user) => {
        if (user.status === 'active') {
            setSelectedUser(user);
            setSuspendModal(true);
        } else {
            updateUserMutation.mutate({ id: user._id, updates: { status: 'active', suspendReason: null, suspendFeedback: null } });
        }
    };

    const handleSuspendSubmit = () => {
        if (!suspendReason || !suspendFeedback) {
            toast.error('Please provide reason and feedback');
            return;
        }
        updateUserMutation.mutate({
            id: selectedUser._id,
            updates: { status: 'suspended', suspendReason, suspendFeedback }
        });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent flex items-center gap-3">
                        <FaUsers className="text-[#B91116]" /> Manage Users
                    </h2>
                    <p className="text-base-content/60 mt-1">Monitor and manage user accounts and roles</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
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
                                        <th className="py-4 pl-6">User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th className="pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <motion.tr
                                            key={user._id}
                                            variants={itemVariants}
                                            className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none"
                                        >
                                            <td className="pl-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                            <img src={user?.photoURL || ""} alt={user?.name} />
                                                            <span className="text-xs">{user.name?.charAt(0)}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base">{user.name}</div>
                                                        <div className="text-xs text-base-content/50">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <select
                                                    value={user.role || 'borrower'}
                                                    onChange={(e) => handleRoleChange(user, e.target.value)}
                                                    className="select select-bordered select-sm w-32 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                                >
                                                    <option value="borrower">Borrower</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td>
                                                <span className={`badge font-medium border-none py-3 px-4 ${user.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {user.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="pr-6 text-right">
                                                <button
                                                    onClick={() => handleStatusToggle(user)}
                                                    className={`btn btn-sm gap-2 ${user.status === 'suspended' ? 'btn-success text-white' : 'btn-outline btn-error'}`}
                                                >
                                                    {user.status === 'suspended' ? <FaCheckCircle /> : <FaBan />}
                                                    {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredUsers.length === 0 && (
                            <div className="p-12 text-center text-base-content/50">
                                <FaSearch className="mx-auto text-4xl mb-3 opacity-20" />
                                <p>No users found matching your search.</p>
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
                        {filteredUsers.map((user) => (
                            <motion.div
                                key={user._id}
                                variants={itemVariants}
                                className="bg-base-100 p-5 rounded-2xl shadow-lg border border-base-200"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                                            <span>{user.name?.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{user.name}</h3>
                                        <p className="text-sm text-base-content/60">{user.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-base-content/50 mb-1">Role</p>
                                        <select
                                            value={user.role || 'borrower'}
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                            className="select select-bordered select-sm w-full focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                        >
                                            <option value="borrower">Borrower</option>
                                            <option value="manager">Manager</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-xs text-base-content/50 mb-1">Status</p>
                                        <span className={`badge font-medium border-none w-full py-3 ${user.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {user.status || 'active'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleStatusToggle(user)}
                                    className={`btn btn-sm w-full gap-2 ${user.status === 'suspended' ? 'btn-success text-white' : 'btn-outline btn-error'}`}
                                >
                                    {user.status === 'suspended' ? <FaCheckCircle /> : <FaBan />}
                                    {user.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}

            {/* Suspend Modal */}
            <AnimatePresence>
                {suspendModal && (
                    <dialog className="modal modal-open backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="modal-box bg-base-100 shadow-2xl border border-base-200 p-0 overflow-hidden"
                        >
                            <div className="bg-red-500 p-4 text-white flex justify-between items-center">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <FaUserShield /> Suspend User
                                </h3>
                                <button onClick={() => setSuspendModal(false)} className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20">
                                    <FaTimesCircle className="text-xl" />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="mb-4 text-base-content/70">
                                    You are about to suspend <span className="font-bold text-base-content">{selectedUser?.name}</span>. Please provide a reason.
                                </p>

                                <div className="form-control mb-4">
                                    <label className="label font-semibold">Suspend Reason *</label>
                                    <select
                                        value={suspendReason}
                                        onChange={(e) => setSuspendReason(e.target.value)}
                                        className="select select-bordered focus:border-red-500 focus:ring-1 focus:ring-red-500 w-full"
                                    >
                                        <option value="">Select reason</option>
                                        <option value="Fraudulent Activity">Fraudulent Activity</option>
                                        <option value="Policy Violation">Policy Violation</option>
                                        <option value="Payment Default">Payment Default</option>
                                        <option value="Suspicious Behavior">Suspicious Behavior</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-control mb-6">
                                    <label className="label font-semibold">Feedback/Details *</label>
                                    <textarea
                                        value={suspendFeedback}
                                        onChange={(e) => setSuspendFeedback(e.target.value)}
                                        className="textarea textarea-bordered h-24 focus:border-red-500 focus:ring-1 focus:ring-red-500 w-full"
                                        placeholder="Provide detailed feedback about the suspension..."
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setSuspendModal(false)} className="btn btn-ghost">Cancel</button>
                                    <button onClick={handleSuspendSubmit} className="btn btn-error text-white">
                                        <FaBan /> Confirm Suspension
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

export default ManageUsers;
