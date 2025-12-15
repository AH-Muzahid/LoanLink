import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaEdit, FaBan, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ManageUsers = () => {
    useEffect(() => {
        document.title = 'Manage Users - Dashboard | LoanLink';
    }, []);
    const [selectedUser, setSelectedUser] = useState(null);
    const [suspendModal, setSuspendModal] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');
    const [suspendFeedback, setSuspendFeedback] = useState('');
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:5000/users');
            return data;
        }
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ id, updates }) => {
            const { data } = await axios.patch(`http://localhost:5000/users/${id}`, updates);
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

    if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="font-semibold">{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role || 'borrower'}
                                        onChange={(e) => handleRoleChange(user, e.target.value)}
                                        className="select select-bordered select-sm"
                                    >
                                        <option value="borrower">Borrower</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`badge ${user.status === 'suspended' ? 'badge-error' : 'badge-success'}`}>
                                        {user.status || 'active'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleStatusToggle(user)}
                                        className={`btn btn-sm ${user.status === 'suspended' ? 'btn-success' : 'btn-error'}`}
                                    >
                                        {user.status === 'suspended' ? <FaCheckCircle /> : <FaBan />}
                                        {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Suspend Modal */}
            {suspendModal && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Suspend User: {selectedUser?.name}</h3>
                        
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-semibold">Suspend Reason *</span>
                            </label>
                            <select 
                                value={suspendReason} 
                                onChange={(e) => setSuspendReason(e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="">Select reason</option>
                                <option value="Fraudulent Activity">Fraudulent Activity</option>
                                <option value="Policy Violation">Policy Violation</option>
                                <option value="Payment Default">Payment Default</option>
                                <option value="Suspicious Behavior">Suspicious Behavior</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-semibold">Feedback/Details *</span>
                            </label>
                            <textarea 
                                value={suspendFeedback}
                                onChange={(e) => setSuspendFeedback(e.target.value)}
                                className="textarea textarea-bordered h-24"
                                placeholder="Provide detailed feedback about the suspension..."
                            ></textarea>
                        </div>

                        <div className="modal-action">
                            <button onClick={() => setSuspendModal(false)} className="btn btn-ghost">Cancel</button>
                            <button onClick={handleSuspendSubmit} className="btn btn-error">Suspend User</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default ManageUsers;
