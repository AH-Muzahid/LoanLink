import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner'; 

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
                        }, 3000);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [sessionId, loanId, axiosSecure, navigate]);

    if(loading) return <LoadingSpinner />

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="card w-96 bg-base-100 shadow-xl text-center p-8">
                <div className="text-5xl text-success mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                <p className="py-4 text-gray-600">
                    Thank you for your payment. Your application fee status has been updated.
                </p>
                <p className="text-sm text-gray-400">Transaction ID: {sessionId}</p>
                <div className="mt-6">
                    <button onClick={() => navigate('/dashboard/my-loans')} className="btn btn-primary w-full">
                        Go to My Loans
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;