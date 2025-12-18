import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { FaCheckCircle, FaMoneyBillWave, FaPercent, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PersonalLoanDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data: loan, isLoading } = useQuery({
        queryKey: ['loan', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/loans/${id}`);
            return data;
        }
    });

    useEffect(() => {
        if (loan?.title) {
            document.title = `${loan.title} - Loan Details | LoanLink`;
        }
    }, [loan]);

    if (isLoading) return <LoadingSpinner />;

    if (!loan) return <div className="text-center py-20 text-2xl font-bold text-error">Loan not found</div>;

    return (
        <div className="min-h-screen bg-base-100 pb-20">
            {/* Hero Section */}
            <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10" />
                <img
                    src={loan.image}
                    alt={loan.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl text-white"
                    >
                        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-[#B91116] mb-8 transition-colors w-fit group font-medium">
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Loans
                        </Link>
                        <span className="bg-[#B91116] text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 inline-block shadow-lg">
                            {loan.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">{loan.title}</h1>
                        <div className="flex flex-wrap gap-4 md:gap-6 text-lg">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                                <FaPercent className="text-[#B91116] text-xl" />
                                <span className="font-semibold tracking-wide">{loan.interestRate}% Interest Rate</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                                <FaMoneyBillWave className="text-green-400 text-xl" />
                                <span className="font-semibold tracking-wide">Max: ৳{(loan.maxLoanLimit / 1000).toFixed(0)}K</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="lg:col-span-2 bg-base-100 rounded-3xl shadow-2xl p-6 md:p-10 border border-base-200"
                    >
                        <h2 className="text-3xl font-bold mb-6 border-b border-base-200 pb-4 text-gray-800">Loan Overview</h2>
                        <p className="text-base-content/80 leading-loose text-lg mb-10 text-justify">
                            {loan.description}
                        </p>

                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Key Features & Benefits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {[
                                'Quick Approval Process',
                                'Flexible Repayment Terms',
                                'No Hidden Charges',
                                'Competitive Interest Rates',
                                'Minimal Documentation',
                                '24/7 Customer Support'
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-300 group">
                                    <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                        <FaCheckCircle className="text-[#B91116] text-xl" />
                                    </div>
                                    <span className="font-semibold text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sidebar / Action Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-base-100 rounded-3xl shadow-2xl p-8 border border-base-200 sticky top-28">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-800">Loan Summary</h3>
                                <div className="h-1 w-20 bg-[#B91116] mx-auto mt-2 rounded-full"></div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors">
                                    <span className="text-gray-600 font-medium">Interest Rate</span>
                                    <span className="font-bold text-xl text-[#B91116]">{loan.interestRate}%</span>
                                </div>
                                <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors">
                                    <span className="text-gray-600 font-medium">Processing Fee</span>
                                    <span className="font-bold text-xl text-gray-800">1% - 2%</span>
                                </div>
                                <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors">
                                    <span className="text-gray-600 font-medium">Tenure</span>
                                    <span className="font-bold text-xl text-gray-800">12 - 60 Months</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/dashboard/apply-loan', { state: { loanId: loan._id } })}
                                className="btn bg-[#B91116] hover:bg-[#900d11] text-white w-full btn-lg text-lg shadow-xl shadow-red-200 hover:shadow-red-300 transition-all transform hover:-translate-y-1 rounded-xl border-none"
                            >
                                Apply Now
                            </button>
                            <p className="text-xs text-center mt-6 text-gray-400 leading-relaxed">
                                * Terms and conditions apply. Subject to credit approval. Interest rates may vary based on credit score.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PersonalLoanDetails;
