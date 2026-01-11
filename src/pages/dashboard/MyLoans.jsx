import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { FaEye, FaTimes, FaMoneyBillWave, FaCalendarAlt, FaBan } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth/useAuth';
import useRole from '../../Hooks/useRole/useRole';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../Componets/Modal/ConfirmationModal';
import AccessRestricted from '../../Componets/Shared/AccessRestricted';
import LoanDetailsModal from '../../Componets/Dashboard/Borrower/LoanDetailsModal';
import PaymentReceiptModal from '../../Componets/Dashboard/Borrower/PaymentReceiptModal';
import { motion } from 'framer-motion';
import { getStatusBadge } from '../../Componets/Dashboard/Shared/utils';

const MyLoans = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [role, isRoleLoading] = useRole();
    const navigate = useNavigate();
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [cancelModal, setCancelModal] = useState(false);
    const queryClient = useQueryClient();
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loanToCancel, setLoanToCancel] = useState(null);

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
            setLoanToCancel(null);
        }
    });

    // Handle Cancel Loan Application
    const handleCancel = () => {
        if (loanToCancel) {
            cancelMutation.mutate(loanToCancel._id);
        }
    };

    // Handle Pay Loan Application
    const handlePay = (loan) => {
        navigate('/dashboard/payment/checkout', { state: { loan } });
    };

    //Handle Paid Badge Click
    const handleShowReceipt = (loan) => {
        setSelectedTransaction(loan);
    };

    // Redirect or block irrelevant roles
    if (isRoleLoading) return <LoadingSpinner />;

    if (role === 'admin' || role === 'manager') {
        return <AccessRestricted role={role} message="As an Admin/Manager, you are not eligible to view this page. This feature is reserved for Borrowers only." />;
    }

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
                            <FaBan className="text-3xl text-base-content/40" />
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
                                    <tr className="bg-base-200/50 text-base-content/70 uppercase text-xs tracking-wider border-b border-base-200">
                                        <th className="py-5 px-6 text-left">Loan Info</th>
                                        <th className="py-5 px-6 text-left">Amount</th>
                                        <th className="py-5 px-6 text-left">Date</th>
                                        <th className="py-5 px-6 text-left">Status</th>
                                        <th className="py-5 px-6 text-left">Fee</th>
                                        <th className="py-5 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-200">
                                    {myLoans.map((loan) => (
                                        <tr key={loan._id} className="hover:bg-base-200/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-red-50 text-[#B91116] rounded-xl w-12 h-12 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                                            <span className="text-sm font-bold">{loan.loanTitle?.substring(0, 2).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="max-w-[200px]">
                                                        <div className="font-bold text-base-content truncate" title={loan.loanTitle}>{loan.loanTitle}</div>
                                                        <div className="text-xs text-base-content/60 badge badge-ghost badge-sm mt-1">{loan.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-bold text-base-content">৳{loan.amount?.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-base-content/60">
                                                    <FaCalendarAlt className="text-base-content/40" />
                                                    {new Date(loan.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(loan.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {loan.feeStatus === 'paid' ? (
                                                    <span
                                                        onClick={() => handleShowReceipt(loan)}
                                                        className="badge badge-success badge-outline cursor-pointer hover:bg-success hover:text-white transition-colors p-3 font-medium gap-1"
                                                    >
                                                        <FaMoneyBillWave className="text-xs" /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-error badge-outline p-3 font-medium">Unpaid</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedLoan(loan)}
                                                        className="btn btn-sm btn-ghost btn-square hover:bg-info/10 text-info tooltip tooltip-left"
                                                        data-tip="View Details"
                                                    >
                                                        <FaEye className="text-lg" />
                                                    </button>

                                                    {loan.status === 'pending' && (
                                                        <button
                                                            onClick={() => { setLoanToCancel(loan); setCancelModal(true); }}
                                                            className="btn btn-sm btn-ghost btn-square hover:bg-error/10 text-error tooltip tooltip-left"
                                                            data-tip="Cancel Application"
                                                        >
                                                            <FaTimes className="text-lg" />
                                                        </button>
                                                    )}

                                                    {loan.status === 'approved' && loan.feeStatus !== 'paid' && (
                                                        <button
                                                            onClick={() => handlePay(loan)}
                                                            className="btn btn-sm bg-[#B91116] hover:bg-[#900d11] text-white border-none shadow-md shadow-red-200 px-4"
                                                        >
                                                            Pay Now
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
                                                <span onClick={() => handleShowReceipt(loan)} className="text-success font-bold text-xs cursor-pointer underline">Paid (View)</span>
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
                                                onClick={() => { setLoanToCancel(loan); setCancelModal(true); }}
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
            <LoanDetailsModal
                loan={selectedLoan}
                onClose={() => setSelectedLoan(null)}
            />

            {/* Cancel Confirmation Modal */}
            <ConfirmationModal
                isOpen={cancelModal}
                onClose={() => { setCancelModal(false); setLoanToCancel(null); }}
                onConfirm={handleCancel}
                title="Cancel Application?"
                message="Are you sure you want to cancel this loan application? This action cannot be undone."
                confirmText="Yes, Cancel Application"
                cancelText="No, Keep It"
                icon={FaTimes}
            />

            {/* Payment Details Modal  */}
            <PaymentReceiptModal
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
            />
        </div>
    );
};

export default MyLoans;
