import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaCreditCard, FaLock, FaArrowLeft } from 'react-icons/fa';
import useAuth from '../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import toast from 'react-hot-toast';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    // Get loan data passed from navigation state
    const loan = location.state?.loan;

    useEffect(() => {
        if (!loan) {
            toast.error("No loan selected for payment");
            navigate('/dashboard/my-loans');
        }
    }, [loan, navigate]);

    if (!loan) return null;

    const handlePayment = async () => {
        setLoading(true);
        const toastId = toast.loading('Initiating secure payment...');

        try {
            const paymentInfo = {
                loanId: loan._id,
                loanTitle: loan.loanTitle,
                loanAmount: loan.amount,
                loanCategory: loan.category,
                loanImage: loan.loanImage,
                userName: user?.displayName,
                userEmail: user?.email
            };

            const { data } = await axiosSecure.post('/create-checkout-session', paymentInfo);

            if (data && data.url) {
                toast.success('Redirecting to Stripe...', { id: toastId });
                window.location.href = data.url;
            } else {
                toast.error('Failed to create payment session', { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error('Payment initiation failed', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card bg-base-100 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side - Order Summary */}
                <div className="md:w-1/2 bg-[#B91116] text-white p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 left-10 w-40 h-40 bg-black rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <button onClick={() => navigate(-1)} className="btn btn-sm btn-ghost text-white mb-6 gap-2 pl-0 hover:bg-white/10">
                            <FaArrowLeft /> Back
                        </button>
                        <h2 className="text-3xl font-bold mb-2">Order Summary</h2>
                        <p className="opacity-80">Review your payment details before proceeding.</p>
                    </div>

                    <div className="relative z-10 mt-8 space-y-6">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Loan Application</p>
                            <h3 className="text-xl font-bold">{loan.loanTitle}</h3>
                            <span className="badge badge-warning mt-2 text-xs font-bold">{loan.category}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                <span className="opacity-80">Application Fee</span>
                                <span className="font-bold text-xl">$10.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="opacity-80">Total to Pay</span>
                                <span className="font-bold text-3xl">$10.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8 text-xs opacity-60">
                        <p>* This fee is non-refundable and covers the administrative costs of processing your loan application.</p>
                    </div>
                </div>

                {/* Right Side - Payment Action */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B91116]">
                            <FaCreditCard className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-base-content">Secure Checkout</h2>
                        <p className="text-base-content/60 mt-2">Complete your payment securely with Stripe.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="alert alert-info shadow-sm">
                            <FaLock />
                            <span className="text-sm">Your payment information is encrypted and secure.</span>
                        </div>

                        <div className="bg-base-200 p-4 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-base-content/70">Payer Name</span>
                                <span className="text-sm font-medium">{user?.displayName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-base-content/70">Payer Email</span>
                                <span className="text-sm font-medium">{user?.email}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="btn bg-[#B91116] hover:bg-[#900d11] text-white w-full btn-lg shadow-lg shadow-red-200 border-none"
                        >
                            {loading ? <span className="loading loading-spinner"></span> : (
                                <>
                                    Pay $10.00 Now <FaMoneyBillWave />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center gap-4 opacity-50 grayscale">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
