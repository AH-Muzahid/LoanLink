import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { FaEye, FaTimes, FaMoneyBillWave, FaFileInvoiceDollar, FaCalendarAlt, FaCheckCircle, FaClock, FaBan, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../../Componets/Modal/Modal';
import ConfirmationModal from '../../Componets/Modal/ConfirmationModal';

const MyLoans = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [cancelModal, setCancelModal] = useState(false);
    const queryClient = useQueryClient();
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        document.title = 'My Loans - Dashboard | LoanLink';
    }, []);

    const { data: myLoans = [], isLoading, isError, error } = useQuery({
        queryKey: ['my-loans', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/my-applications/${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    // Cancel Loan Application 
    const cancelMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.delete(`/applications/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-loans']);
            toast.success('Loan application cancelled');
            setCancelModal(false);
            setSelectedLoan(null);
        }
    });

    // Handle Cancel Loan Application
    const handleCancel = () => {
        if (selectedLoan) {
            cancelMutation.mutate(selectedLoan._id);
        }
    };

    // Handle Pay Loan Application
    const handlePay = (loan) => {
        navigate('/dashboard/payment/checkout', { state: { loan } });
    };

    //Handle Paid Badge Click
    const handleShowDetails = (loan) => {
        setSelectedTransaction(loan);
    };

    if (isLoading) return <LoadingSpinner />;

    if (isError) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center p-8 bg-base-100 rounded-2xl border border-error/20 max-w-md shadow-lg">
                    <FaBan className="text-4xl text-error mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-base-content mb-2">Failed to load loans</h3>
                    <p className="text-base-content/70">{error.message}</p>
                </div>
            </div>
        )
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge badge-success gap-1 p-3 text-white"><FaCheckCircle /> Approved</span>;
            case 'rejected':
                return <span className="badge badge-error gap-1 p-3 text-white"><FaBan /> Rejected</span>;
            default:
                return <span className="badge badge-warning gap-1 p-3 text-white"><FaClock /> Pending</span>;
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-base-200/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-base-content">My Applications</h2>
                        <p className="text-base-content/60 mt-1">Track and manage your loan requests</p>
                    </div>
                    <div className="bg-base-100 px-4 py-2 rounded-lg shadow-sm border border-base-300">
                        <span className="text-base-content/70 text-sm">Total Applications:</span>
                        <span className="text-[#B91116] font-bold text-lg ml-2">{myLoans.length}</span>
                    </div>
                </div>

                {myLoans.length === 0 ? (
                    <div className="text-center py-20 bg-base-100 rounded-3xl shadow-sm border border-base-200">
                        <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaFileInvoiceDollar className="text-3xl text-base-content/40" />
                        </div>
                        <h3 className="text-xl font-bold text-base-content mb-2">No Applications Found</h3>
                        <p className="text-base-content/60 max-w-md mx-auto">You haven't applied for any loans yet. Browse our available loans and start your journey today.</p>
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-200">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-base-200 text-base-content/70 uppercase text-xs tracking-wider">
                                        <th className="py-4 px-6">Loan Info</th>
                                        <th className="py-4 px-6">Amount</th>
                                        <th className="py-4 px-6">Date</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Fee</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-200">
                                    {myLoans.map((loan) => (
                                        <tr key={loan._id} className="hover:bg-base-200/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-red-50 text-[#B91116] rounded-xl w-10 h-10 flex items-center justify-center">
                                                            <span className="text-xs font-bold">{loan.loanTitle?.substring(0, 2).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base-content">{loan.loanTitle}</div>
                                                        <div className="text-xs text-base-content/60 badge badge-ghost badge-sm">{loan.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-base-content">৳{loan.amount?.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-base-content/60">
                                                    <FaCalendarAlt className="text-base-content/40" />
                                                    {new Date(loan.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(loan.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {loan.feeStatus === 'paid' ? (
                                                    <span
                                                        onClick={() => handleShowDetails(loan)}
                                                        className="badge badge-success badge-outline cursor-pointer hover:bg-success hover:text-white transition-colors p-3 font-medium"
                                                    >
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-error badge-outline p-3 font-medium">Unpaid</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedLoan(loan)}
                                                        className="btn btn-sm btn-ghost hover:bg-info/10 text-info tooltip"
                                                        data-tip="View Details"
                                                    >
                                                        <FaEye className="text-lg" />
                                                    </button>

                                                    {loan.status === 'pending' && (
                                                        <button
                                                            onClick={() => { setSelectedLoan(loan); setCancelModal(true); }}
                                                            className="btn btn-sm btn-ghost hover:bg-error/10 text-error tooltip"
                                                            data-tip="Cancel Application"
                                                        >
                                                            <FaTimes className="text-lg" />
                                                        </button>
                                                    )}

                                                    {loan.status === 'approved' && loan.feeStatus !== 'paid' && (
                                                        <button
                                                            onClick={() => handlePay(loan)}
                                                            className="btn btn-sm bg-[#B91116] hover:bg-[#900d11] text-white border-none shadow-md shadow-red-200"
                                                        >
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

                        {/* Mobile Card View */}
                        <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                            {myLoans.map((loan) => (
                                <div key={loan._id} className="bg-base-100 rounded-xl border border-base-200 shadow-sm p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-50 text-[#B91116] rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold">{loan.loanTitle?.substring(0, 2).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base-content">{loan.loanTitle}</h3>
                                                <span className="text-xs text-base-content/60 bg-base-200 px-2 py-0.5 rounded-full">{loan.category}</span>
                                            </div>
                                        </div>
                                        {getStatusBadge(loan.status)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-base-content/60 text-xs uppercase">Amount</p>
                                            <p className="font-bold text-base-content">৳{loan.amount?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-base-content/60 text-xs uppercase">Date</p>
                                            <p className="font-medium text-base-content/80">{new Date(loan.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-base-content/60 text-xs uppercase">Fee Status</p>
                                            {loan.feeStatus === 'paid' ? (
                                                <span onClick={() => handleShowDetails(loan)} className="text-success font-bold text-xs cursor-pointer underline">Paid (View)</span>
                                            ) : (
                                                <span className="text-error font-bold text-xs">Unpaid</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t border-base-200">
                                        <button
                                            onClick={() => setSelectedLoan(loan)}
                                            className="btn btn-sm flex-1 btn-ghost  text-base-content/70"
                                        >
                                            <FaEye /> Details
                                        </button>

                                        {loan.status === 'pending' && (
                                            <button
                                                onClick={() => { setSelectedLoan(loan); setCancelModal(true); }}
                                                className="btn btn-sm flex-1 btn-ghost text-error"
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        )}

                                        {loan.status === 'approved' && loan.feeStatus !== 'paid' && (
                                            <button
                                                onClick={() => handlePay(loan)}
                                                className="btn btn-sm flex-1 text-[#B91116]"
                                            >
                                                <FaMoneyBillWave /> Pay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* View Details Modal */}
            {/* View Details Modal */}
            <Modal
                isOpen={!!selectedLoan && !cancelModal}
                onClose={() => setSelectedLoan(null)}
                title={
                    <span className="flex items-center gap-2">
                        <FaInfoCircle /> Application Details
                    </span>
                }
            >
                {selectedLoan && (
                    <>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Loan Title</p>
                                    <p className="font-semibold text-base-content text-lg">{selectedLoan.loanTitle}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Amount</p>
                                    <p className="font-semibold text-[#B91116] text-lg">৳{selectedLoan.amount?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Category</p>
                                    <span className="badge badge-ghost mt-1">{selectedLoan.category}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Status</p>
                                    <div className="mt-1">{getStatusBadge(selectedLoan.status)}</div>
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Applied On</p>
                                    <p className="font-medium text-base-content/80">{new Date(selectedLoan.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Fee Status</p>
                                    <p className={`font-bold ${selectedLoan.feeStatus === 'paid' ? 'text-success' : 'text-error'}`}>
                                        {selectedLoan.feeStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 bg-base-200 p-4 rounded-xl">
                                <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider mb-2">Purpose</p>
                                <p className="text-base-content italic">"{selectedLoan.purpose}"</p>
                            </div>
                        </div>
                        <div className="p-4 bg-base-200/50 border-t border-base-200 flex justify-end">
                            <button onClick={() => setSelectedLoan(null)} className="btn btn-ghost text-base-content/70 hover:bg-base-200">Close</button>
                        </div>
                    </>
                )}
            </Modal>

            {/* Cancel Confirmation Modal */}
            <ConfirmationModal
                isOpen={cancelModal}
                onClose={() => { setCancelModal(false); setSelectedLoan(null); }}
                onConfirm={handleCancel}
                title="Cancel Application?"
                message="Are you sure you want to cancel this loan application? This action cannot be undone."
                confirmText="Yes, Cancel Application"
                cancelText="No, Keep It"
                icon={FaTimes}
            />

            {/* Payment Details Modal  */}
            <Modal
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                title={
                    <span className="flex items-center gap-2">
                        <FaFileInvoiceDollar /> Payment Receipt
                    </span>
                }
                maxWidth="max-w-md"
            >
                {selectedTransaction && (
                    <>
                        <div className="space-y-4 bg-base-200/50 p-6 m-6 rounded-xl border border-base-200">
                            <div className="flex justify-between border-b border-base-300 pb-2">
                                <span className="text-base-content/60">Loan ID</span>
                                <span className="font-mono text-xs text-base-content">{selectedTransaction._id}</span>
                            </div>
                            <div className="flex justify-between border-b border-base-300 pb-2">
                                <span className="text-base-content/60">Loan Title</span>
                                <span className="font-semibold text-base-content">{selectedTransaction.loanTitle}</span>
                            </div>
                            <div className="flex justify-between border-b border-base-300 pb-2">
                                <span className="text-base-content/60 mr-10">Transaction ID</span>
                                <span className="font-mono text-success font-bold text-sm break-all">{selectedTransaction.transactionId}</span>
                            </div>
                            <div className="flex justify-between border-b border-base-300 pb-2">
                                <span className="text-base-content/60">Amount Paid</span>
                                <span className="font-bold text-base-content">$10.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-base-content/60">Payer Email</span>
                                <span className="text-sm text-base-content/80">{selectedTransaction.userEmail}</span>
                            </div>
                        </div>

                        <div className="p-6 pt-0">
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="btn bg-neutral text-neutral-content hover:bg-neutral-focus border-none w-full"
                            >
                                Close Receipt
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
    

};

export default MyLoans;
