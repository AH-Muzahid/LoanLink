import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(true);

    // 
    const sessionId = searchParams.get('session_id');
    const loanId = searchParams.get('loanId');

    useEffect(() => {
        if (sessionId && loanId) {
            // 
            axiosSecure.patch(`/payments/success/${loanId}`, { transactionId: sessionId })
                .then(res => {
                    if (res.data.modifiedCount > 0) {
                        setLoading(false);

                        setTimeout(() => {
                            navigate('/dashboard/my-loans');
                        }, 5000);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [sessionId, loanId, axiosSecure, navigate]);

    if (loading) return <LoadingSpinner />

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#B91116]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200 relative z-10"
            >
                <div className="card-body items-center text-center p-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6"
                    >
                        <div className="text-6xl text-success">✓</div>
                    </motion.div>

                    <h2 className="text-3xl font-bold text-base-content mb-2">Payment Successful!</h2>
                    <p className="text-base-content/60 mb-8">
                        Your application fee has been securely processed. The loan status has been updated to <span className="font-bold text-success">Paid</span>.
                    </p>

                    <div className="w-full bg-base-200/50 rounded-xl p-4 mb-8 border border-base-300 text-left">
                        <p className="text-xs uppercase tracking-wider text-base-content/50 mb-1">Transaction ID</p>
                        <p className="font-mono text-xs md:text-sm text-base-content break-all">{sessionId}</p>
                    </div>

                    <div className="w-full space-y-3">
                        <button
                            onClick={() => navigate('/dashboard/my-loans')}
                            className="btn bg-[#B91116] hover:bg-[#900d11] text-white w-full shadow-lg  border-none"
                        >
                            Go to My Loans
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-ghost w-full"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;