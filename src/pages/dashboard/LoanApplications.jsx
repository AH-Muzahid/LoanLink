import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';

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


    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Loan Applications</h2>

            {/* Filter */}
            <div className="mb-6 flex gap-2">
                <button onClick={() => setFilter('all')} className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}>All</button>
                <button onClick={() => setFilter('pending')} className={`btn btn-sm ${filter === 'pending' ? 'btn-warning' : 'btn-outline'}`}>Pending</button>
                <button onClick={() => setFilter('approved')} className={`btn btn-sm ${filter === 'approved' ? 'btn-success' : 'btn-outline'}`}>Approved</button>
                <button onClick={() => setFilter('rejected')} className={`btn btn-sm ${filter === 'rejected' ? 'btn-error' : 'btn-outline'}`}>Rejected</button>
            </div>


            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>User</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.map((app) => (
                            <tr key={app._id}>
                                <td className="font-mono text-sm">{app.loanId?.slice(0, 8)}...</td>
                                <td>
                                    <div>
                                        <div className="font-semibold">{app.userName}</div>
                                        <div className="text-sm text-base-content/60">{app.userEmail}</div>
                                    </div>
                                </td>
                                <td><span className="badge badge-primary">{app.category}</span></td>
                                <td className="font-bold">৳{app.amount?.toLocaleString()}</td>
                                <td>
                                    <select
                                        value={app.status || 'pending'}
                                        onChange={(e) => updateStatusMutation.mutate({ id: app._id, status: e.target.value })}
                                        className={`select select-bordered select-sm ${app.status === 'approved' ? 'select-success' :
                                                app.status === 'rejected' ? 'select-error' : 'select-warning'
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="btn btn-sm btn-info"
                                    >
                                        <FaEye /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isLoading && <LoadingSpinner />}
            </div>

            {/* View Modal */}
            {selectedApp && (
                <dialog open className="modal">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Application Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><strong>Loan ID:</strong> {selectedApp.loanId}</div>
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

export default LoanApplications;
