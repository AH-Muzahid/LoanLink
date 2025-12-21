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
    const [updateRoleModal, setUpdateRoleModal] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [suspendReason, setSuspendReason] = useState('');
    const [suspendFeedback, setSuspendFeedback] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
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

    const handleOpenRoleModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.role || 'borrower');
        setUpdateRoleModal(true);
    };

    const handleRoleUpdate = () => {
        if (!newRole) {
            toast.error('Please select a role');
            return;
        }
        updateUserMutation.mutate({ id: selectedUser._id, updates: { role: newRole } });
        setUpdateRoleModal(false);
        setNewRole('');
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

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? (user.role || 'borrower') === roleFilter : true;
        const matchesStatus = statusFilter ? (user.status || 'active') === statusFilter : true;
        return matchesSearch && matchesRole && matchesStatus;
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
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-linear-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent flex items-center gap-3">
                        <FaUsers className="text-[#B91116]" /> Manage Users
                    </h2>
                    <p className="text-base-content/60 mt-1">Monitor and manage user accounts and roles</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 mb-6 flex flex-col lg:flex-row gap-4">
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
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        className="select select-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] rounded-xl w-full sm:w-auto"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="borrower">Borrower</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select
                        className="select select-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] rounded-xl w-full sm:w-auto"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
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
                                        <th className="pr-6 text-center">Actions</th>
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
                                                <span className="badge badge-ghost font-medium py-3 px-4 capitalize">
                                                    {user.role || 'borrower'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge font-medium border-none py-3 px-4 ${user.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {user.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="pr-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenRoleModal(user)}
                                                        className="btn btn-sm btn-ghost  hover:bg-[#B12A11]/80"
                                                        title="Update Role"
                                                    >
                                                        <FaEdit /> Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusToggle(user)}
                                                        className={`btn btn-sm gap-2 ${user.status === 'suspended' ? 'btn-success text-white' : 'btn-outline btn-error'}`}
                                                    >
                                                        {user.status === 'suspended' ? <FaCheckCircle /> : <FaBan />}
                                                        {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                                                    </button>
                                                </div>
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
                                        <span className="badge badge-ghost font-medium w-full py-3 capitalize">
                                            {user.role || 'borrower'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-base-content/50 mb-1">Status</p>
                                        <span className={`badge font-medium border-none w-full py-3 ${user.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {user.status || 'active'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenRoleModal(user)}
                                        className="btn btn-sm flex-1 btn-ghost text-blue-500 border border-blue-200 hover:bg-blue-50"
                                    >
                                        <FaEdit /> Update Role
                                    </button>
                                    <button
                                        onClick={() => handleStatusToggle(user)}
                                        className={`btn btn-sm flex-1 gap-2 ${user.status === 'suspended' ? 'btn-success text-white' : 'btn-outline btn-error'}`}
                                    >
                                        {user.status === 'suspended' ? <FaCheckCircle /> : <FaBan />}
                                        {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}

            {/* Update Role Modal */}
            <AnimatePresence>
                {updateRoleModal && (
                    <dialog className="modal modal-open backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="modal-box bg-base-100 shadow-2xl border border-base-200 p-0 overflow-hidden"
                        >
                            <div className="bg-[#B12A11] p-4 text-white flex justify-between items-center">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <FaEdit /> Update User Role
                                </h3>
                                <button onClick={() => setUpdateRoleModal(false)} className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20">
                                    <FaTimesCircle className="text-xl" />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="mb-4 text-base-content/70">
                                    You are updating the role for <span className="font-bold text-base-content">{selectedUser?.name}</span>.
                                </p>

                                <div className="form-control mb-6">
                                    <label className="label font-semibold">Select New Role *</label>
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="select select-bordered focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                                    >
                                        <option value="borrower">Borrower</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setUpdateRoleModal(false)} className="btn btn-ghost">Cancel</button>
                                    <button onClick={handleRoleUpdate} className="btn bg-[#B12A11] hover:bg-[#B12A11]/80 text-white border-none">
                                        <FaCheckCircle /> Update Role
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </dialog>
                )}
            </AnimatePresence>

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
