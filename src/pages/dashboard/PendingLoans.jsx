import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';

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
        onSuccess: () => {
            queryClient.invalidateQueries(['pending-applications']);
            toast.success('Application status updated');
        }
    });

    if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Pending Loan Applications</h2>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>User Info</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td className="font-mono text-sm">{app._id?.slice(0, 8)}...</td>
                                <td>
                                    <div>
                                        <div className="font-semibold">{app.userName}</div>
                                        <div className="text-sm text-base-content/60">{app.userEmail}</div>
                                    </div>
                                </td>
                                <td className="font-bold">৳{app.amount?.toLocaleString()}</td>
                                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="btn btn-sm btn-info"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'approved' })}
                                            className="btn btn-sm btn-success"
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'rejected' })}
                                            className="btn btn-sm btn-error"
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {applications.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-base-content/60">No pending applications</p>
                </div>
            )}

            {/* View Modal */}
            {selectedApp && (
                <dialog open className="modal">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Application Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><strong>Loan ID:</strong> {selectedApp._id}</div>
                            <div><strong>User:</strong> {selectedApp.userName}</div>
                            <div><strong>Email:</strong> {selectedApp.userEmail}</div>
                            <div><strong>Category:</strong> {selectedApp.category}</div>
                            <div><strong>Amount:</strong> ৳{selectedApp.amount?.toLocaleString()}</div>
                            <div><strong>Status:</strong> <span className="badge">{selectedApp.status}</span></div>
                            <div className="col-span-2"><strong>Purpose:</strong> {selectedApp.purpose}</div>
                            <div className="col-span-2"><strong>Applied On:</strong> {new Date(selectedApp.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="modal-action">
                            <button onClick={() => setSelectedApp(null)} className="btn">Close</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default PendingLoans;
