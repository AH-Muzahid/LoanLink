import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { FaEye, FaTimes, FaMoneyBillWave, FaFileInvoiceDollar, FaCalendarAlt, FaCheckCircle, FaClock, FaBan, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const MyLoans = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
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
    const handlePay = async (loan) => {
        let fee = loan.feeAmount;
        if (!fee || fee <= 0) {
            toast.warning('Fee amount is missing. Using a temporary fee of ৳10 for testing.', { duration: 5000 });
            fee = 10;
        }

        const toastId = toast.loading('Processing payment...');

        try {
            const paymentInfo = {
                loanId: loan._id,
                loanTitle: loan.loanTitle,
                amount: fee,
                userName: user?.displayName,
                userEmail: user?.email
            };
            const { data } = await axiosSecure.post('/create-checkout-session', paymentInfo);

            if (data && data.url) {
                toast.success('Redirecting to payment gateway...', { id: toastId });
                window.location.href = data.url;
            } else {
                toast.error('Failed to get payment URL.', { id: toastId });
            }

        } catch (error) {
            console.error('Payment Error:', error);
            toast.error(error.message || 'Failed to process payment.', { id: toastId });
        }
    };

    //Handle Paid Badge Click
    const handleShowDetails = (loan) => {
        setSelectedTransaction(loan);
        document.getElementById('payment_modal').showModal();
    };

    if (isLoading) return <LoadingSpinner />;

    if (isError) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center p-8  rounded-2xl border border-red-100 max-w-md">
                    <FaBan className="text-4xl text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold  mb-2">Failed to load loans</h3>
                    <p className="">{error.message}</p>
                </div>
            </div>
        )
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge bg-green-100 text-green-700 border-green-200 gap-1 p-3"><FaCheckCircle /> Approved</span>;
            case 'rejected':
                return <span className="badge bg-red-100 text-red-700 border-red-200 gap-1 p-3"><FaBan /> Rejected</span>;
            default:
                return <span className="badge bg-yellow-100 text-yellow-700 border-yellow-200 gap-1 p-3"><FaClock /> Pending</span>;
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold ">My Applications</h2>
                        <p className="t mt-1">Track and manage your loan requests</p>
                    </div>
                    <div className=" px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                        <span className="t text-sm">Total Applications:</span>
                        <span className="text-[#B91116] font-bold text-lg ml-2">{myLoans.length}</span>
                    </div>
                </div>

                {myLoans.length === 0 ? (
                    <div className="text-center py-20  rounded-3xl shadow-sm border border-gray-100">
                        <div className=" w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaFileInvoiceDollar className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold  mb-2">No Applications Found</h3>
                        <p className="t max-w-md mx-auto">You haven't applied for any loans yet. Browse our available loans and start your journey today.</p>
                    </div>
                ) : (
                    <div className=" rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className=" text-gray-600 uppercase text-xs tracking-wider">
                                        <th className="py-4 px-6">Loan Info</th>
                                        <th className="py-4 px-6">Amount</th>
                                        <th className="py-4 px-6">Date</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Fee</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {myLoans.map((loan) => (
                                        <tr key={loan._id} className="hover:/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className=" text-[#B91116] rounded-xl w-10 h-10 flex items-center justify-center">
                                                            <span className="text-xs font-bold">{loan.loanTitle?.substring(0, 2).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold ">{loan.loanTitle}</div>
                                                        <div className="text-xs t badge badge-ghost badge-sm">{loan.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold ">৳{loan.amount?.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm t">
                                                    <FaCalendarAlt className="text-gray-400" />
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
                                                        className="badge bg-green-50 text-green-600 border-green-100 cursor-pointer hover:bg-green-100 transition-colors p-3 font-medium"
                                                    >
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="badge  text-red-600 border-red-100 p-3 font-medium">Unpaid</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedLoan(loan)}
                                                        className="btn btn-sm btn-ghost rounded-full hover:bg-blue-50 text-blue-600 tooltip"
                                                        data-tip="View Details"
                                                    >
                                                        <FaEye className="text-lg" />
                                                    </button>

                                                    {loan.status === 'pending' && (
                                                        <button
                                                            onClick={() => { setSelectedLoan(loan); setCancelModal(true); }}
                                                            className="btn btn-sm btn-ghost hover: text-red-600 tooltip"
                                                            data-tip="Cancel Application"
                                                        >
                                                            <FaTimes className="text-lg" />
                                                        </button>
                                                    )}

                                                    {loan.status === 'approved' && loan.feeStatus !== 'paid' && (
                                                        <button
                                                            onClick={() => handlePay(loan)}
                                                            className="btn btn-sm bg-[#B91116] hover:bg-[#900d11]  border-none shadow-md "
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
                    </div>
                )}
            </motion.div>

            {/* View Details Modal */}
            <AnimatePresence>
                {selectedLoan && !cancelModal && (
                    <dialog open className="modal modal-open backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="modal-box max-w-2xl  rounded-2xl shadow-2xl p-0 overflow-hidden"
                        >
                            <div className="bg-[#B91116] p-6  flex justify-between items-center">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <FaInfoCircle /> Application Details
                                </h3>
                                <button onClick={() => setSelectedLoan(null)} className="btn btn-sm btn-circle btn-ghost  hover:/20">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs t uppercase font-bold tracking-wider">Loan Title</p>
                                        <p className="font-semibold  text-lg">{selectedLoan.loanTitle}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs t uppercase font-bold tracking-wider">Amount</p>
                                        <p className="font-semibold text-[#B91116] text-lg">৳{selectedLoan.amount?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs t uppercase font-bold tracking-wider">Category</p>
                                        <span className="badge badge-ghost mt-1">{selectedLoan.category}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs t uppercase font-bold tracking-wider">Status</p>
                                        <div className="mt-1">{getStatusBadge(selectedLoan.status)}</div>
                                    </div>
                                    <div>
                                        <p className="text-xs t uppercase font-bold tracking-wider">Applied On</p>
                                        <p className="font-medium ">{new Date(selectedLoan.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs t uppercase font-bold tracking-wider">Fee Status</p>
                                        <p className={`font-bold ${selectedLoan.feeStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
                                            {selectedLoan.feeStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2  p-4 rounded-xl">
                                    <p className="text-xs t uppercase font-bold tracking-wider mb-2">Purpose</p>
                                    <p className=" italic">"{selectedLoan.purpose}"</p>
                                </div>
                            </div>
                            <div className="p-4  border-t border-gray-100 flex justify-end">
                                <button onClick={() => setSelectedLoan(null)} className="btn btn-ghost t hover:bg-gray-200">Close</button>
                            </div>
                        </motion.div>
                    </dialog>
                )}
            </AnimatePresence>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {cancelModal && (
                    <dialog open className="modal modal-open backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="modal-box  rounded-2xl shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaTimes className="text-3xl text-red-500" />
                                </div>
                                <h3 className="font-bold text-xl  mb-2">Cancel Application?</h3>
                                <p className="t mb-6">Are you sure you want to cancel this loan application? This action cannot be undone.</p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => { setCancelModal(false); setSelectedLoan(null); }} className="btn btn-ghost t">No, Keep It</button>
                                    <button onClick={handleCancel} className="btn 0 hover:bg-red-600  border-none">Yes, Cancel Application</button>
                                </div>
                            </div>
                        </motion.div>
                    </dialog>
                )}
            </AnimatePresence>

            {/* Payment Details Modal  */}
            <dialog id="payment_modal" className="modal backdrop-blur-sm">
                <div className="modal-box  rounded-2xl shadow-2xl">
                    <h3 className="font-bold text-xl text-[#B91116] mb-6 flex items-center gap-2">
                        <FaFileInvoiceDollar /> Payment Receipt
                    </h3>
                    {selectedTransaction && (
                        <div className="space-y-4  p-6 rounded-xl border border-gray-100">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="t">Loan Title</span>
                                <span className="font-semibold ">{selectedTransaction.loanTitle}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="t">Transaction ID</span>
                                <span className="font-mono text-green-600 font-bold text-sm">{selectedTransaction.transactionId}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="t">Amount Paid</span>
                                <span className="font-bold ">৳{selectedTransaction.feeAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="t">Payer Email</span>
                                <span className="text-sm ">{selectedTransaction.userEmail}</span>
                            </div>
                        </div>
                    )}
                    <div className="modal-action mt-6">
                        <form method="dialog">
                            <button className="btn bg-gray-800 hover:bg-gray-900  border-none w-full">Close Receipt</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MyLoans;