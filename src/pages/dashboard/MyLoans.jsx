import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaEye, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth/useAuth';

const MyLoans = () => {
    const { user } = useAuth();
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [cancelModal, setCancelModal] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        document.title = 'My Loans - Dashboard | LoanLink';
    }, []);

    const { data: myLoans = [], isLoading } = useQuery({
        queryKey: ['my-loans', user?.email],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:5000/my-applications/${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    const cancelMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axios.delete(`http://localhost:5000/applications/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-loans']);
            toast.success('Loan application cancelled');
            setCancelModal(false);
            setSelectedLoan(null);
        }
    });

    const handleCancel = () => {
        if (selectedLoan) {
            cancelMutation.mutate(selectedLoan._id);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Loan Applications</h2>

            {myLoans.length === 0 ? (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <p className="text-lg text-base-content/60">You haven't applied for any loans yet.</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Loan ID</th>
                                <th>Loan Info</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Fee Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myLoans.map((loan) => (
                                <tr key={loan._id}>
                                    <td className="font-mono text-sm">{loan._id?.slice(0, 8)}...</td>
                                    <td>
                                        <div>
                                            <div className="font-semibold">{loan.loanTitle}</div>
                                            <div className="text-sm text-base-content/60">{loan.category}</div>
                                        </div>
                                    </td>
                                    <td className="font-bold">৳{loan.amount?.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${
                                            loan.status === 'approved' ? 'badge-success' : 
                                            loan.status === 'rejected' ? 'badge-error' : 'badge-warning'
                                        }`}>
                                            {loan.status || 'pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {loan.feeStatus === 'paid' ? (
                                            <span className="badge badge-success">Paid</span>
                                        ) : (
                                            <span className="badge badge-error">Unpaid</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setSelectedLoan(loan)}
                                                className="btn btn-sm btn-info"
                                            >
                                                <FaEye />
                                            </button>
                                            {loan.status === 'pending' && (
                                                <button 
                                                    onClick={() => { setSelectedLoan(loan); setCancelModal(true); }}
                                                    className="btn btn-sm btn-error"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                            {loan.feeStatus !== 'paid' && (
                                                <button className="btn btn-sm btn-success">
                                                    <FaMoneyBillWave /> Pay
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Details Modal */}
            {selectedLoan && !cancelModal && (
                <dialog open className="modal">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Loan Application Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><strong>Loan ID:</strong> {selectedLoan._id}</div>
                            <div><strong>Loan Title:</strong> {selectedLoan.loanTitle}</div>
                            <div><strong>Category:</strong> {selectedLoan.category}</div>
                            <div><strong>Amount:</strong> ৳{selectedLoan.amount?.toLocaleString()}</div>
                            <div><strong>Status:</strong> <span className="badge">{selectedLoan.status}</span></div>
                            <div><strong>Fee Status:</strong> <span className="badge">{selectedLoan.feeStatus}</span></div>
                            <div className="col-span-2"><strong>Purpose:</strong> {selectedLoan.purpose}</div>
                            <div className="col-span-2"><strong>Applied On:</strong> {new Date(selectedLoan.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="modal-action">
                            <button onClick={() => setSelectedLoan(null)} className="btn">Close</button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* Cancel Confirmation Modal */}
            {cancelModal && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Cancel Loan Application?</h3>
                        <p className="mb-4">Are you sure you want to cancel this loan application? This action cannot be undone.</p>
                        <div className="modal-action">
                            <button onClick={() => { setCancelModal(false); setSelectedLoan(null); }} className="btn btn-ghost">No, Keep It</button>
                            <button onClick={handleCancel} className="btn btn-error">Yes, Cancel</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default MyLoans;