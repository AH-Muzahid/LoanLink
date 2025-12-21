import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaUser, FaIdCard, FaMapMarkerAlt, FaFileAlt, FaPhone, FaBriefcase } from 'react-icons/fa';

const ApplyLoan = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = 'Apply for Loan - Dashboard | LoanLink';
    }, []);

    const { data: loans = [] } = useQuery({
        queryKey: ['available-loans'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/all-loans');
            return data;
        }
    });

    useEffect(() => {
        if (location.state?.loanId && loans.length > 0) {
            const loan = loans.find(l => l._id === location.state.loanId);
            if (loan) setSelectedLoan(loan);
        }
    }, [location.state, loans]);

    const handleLoanSelect = (e) => {
        const loan = loans.find(l => l._id === e.target.value);
        setSelectedLoan(loan);
    };

    const onSubmit = async (data) => {
        if (!selectedLoan) {
            toast.error('Please select a loan');
            return;
        }

        if (parseFloat(data.amount) > selectedLoan.maxLoanLimit) {
            toast.error(`Maximum limit for this loan is ${selectedLoan.maxLoanLimit} BDT`);
            return;
        }

        setLoading(true);
        try {
            const applicationData = {
                ...data,
                userEmail: user.email,
                userName: `${data.firstName} ${data.lastName}`,
                loanId: selectedLoan._id,
                loanTitle: selectedLoan.title,
                category: selectedLoan.category,
                interestRate: selectedLoan.interestRate,
                amount: parseFloat(data.amount),
                monthlyIncome: parseFloat(data.monthlyIncome),
                status: 'pending',
                feeStatus: 'unpaid',
                feeAmount: selectedLoan.feeAmount || 10,
                createdAt: new Date().toISOString(),
            };

            await axiosSecure.post('/applications', applicationData);
            toast.success('Loan application submitted successfully!');
            navigate('/dashboard/my-loans');
        } catch (error) {
            toast.error('Failed to submit application');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#B91116] rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500 rounded-full blur-3xl"></div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto relative z-10"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Loan Application</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Fill out the form below to apply for your desired loan. Please ensure all information is accurate to speed up the approval process.</p>
                    <div className="h-1 w-24 bg-[#B91116] mx-auto mt-6 rounded-full"></div>

                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-base-200">
                    {/* Header / Loan Selection */}
                    <div className="bg-gray-50 p-8 border-b border-gray-100">
                        <div className="form-control max-w-md mx-auto w-full">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700 text-lg">Select Loan Type *</span>
                            </label>
                            <select
                                onChange={handleLoanSelect}
                                className="select select-bordered select-lg w-full focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] transition-all"
                                required
                                value={selectedLoan?._id || ''}
                            >
                                <option value="">-- Choose a Loan --</option>
                                {loans.map(loan => (
                                    <option key={loan._id} value={loan._id}>
                                        {loan.title} - {loan.interestRate}% Interest
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Auto-filled Info Card */}
                        {selectedLoan && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 rounded-2xl p-6 mb-10 border border-red-100"
                            >
                                <h3 className="text-[#B91116] font-bold mb-4 flex items-center gap-2">
                                    <FaFileAlt /> Loan Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Loan Title</p>
                                        <p className="font-semibold text-gray-800">{selectedLoan.title}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Interest Rate</p>
                                        <p className="font-semibold text-[#B91116]">{selectedLoan.interestRate}%</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Max Limit</p>
                                        <p className="font-semibold text-green-600">৳{selectedLoan.maxLoanLimit.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Application Fee</p>
                                        <p className="font-semibold text-gray-800">${selectedLoan.feeAmount || 10} USD</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="md:col-span-2">
                                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                                    <FaUser className="text-[#B91116]" /> Personal Information
                                </h4>
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">First Name *</span>
                                </label>
                                <input
                                    {...register('firstName', { required: 'First name is required' })}
                                    type="text"
                                    placeholder="e.g. John"
                                    className="input input-bordered input-md w-full focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                />
                                {errors.firstName && <span className="text-red-500 text-sm mt-1">{errors.firstName.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">Last Name *</span>
                                </label>
                                <input
                                    {...register('lastName', { required: 'Last name is required' })}
                                    type="text"
                                    placeholder="e.g. Doe"
                                    className="input input-bordered input-md w-full focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                />
                                {errors.lastName && <span className="text-red-500 text-sm mt-1">{errors.lastName.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">Contact Number *</span>
                                </label>
                                <div className="relative w-full">
                                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        {...register('contactNumber', { required: 'Contact number is required' })}
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        className="input input-bordered input-md w-full pl-10 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                    />
                                </div>
                                {errors.contactNumber && <span className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">National ID / Passport *</span>
                                </label>
                                <div className="relative w-full">
                                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        {...register('nationalId', { required: 'ID is required' })}
                                        type="text"
                                        placeholder="Enter NID or Passport Number"
                                        className="input input-bordered input-md w-full pl-10 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                    />
                                </div>
                                {errors.nationalId && <span className="text-red-500 text-sm mt-1">{errors.nationalId.message}</span>}
                            </div>

                            {/* Financial Information */}
                            <div className="md:col-span-2 mt-6">
                                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                                    <FaMoneyBillWave className="text-[#B91116]" /> Financial Details
                                </h4>
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">Income Source *</span>
                                </label>
                                <div className="relative w-full">
                                    <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select {...register('incomeSource', { required: 'Income source is required' })} className="select select-bordered select-md w-full pl-10 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]">
                                        <option value="">Select source</option>
                                        <option value="Salary">Salary</option>
                                        <option value="Business">Business</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {errors.incomeSource && <span className="text-red-500 text-sm mt-1">{errors.incomeSource.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">Monthly Income (BDT) *</span>
                                </label>
                                <input
                                    {...register('monthlyIncome', { required: 'Monthly income is required', min: 0 })}
                                    type="number"
                                    placeholder="e.g. 50000"
                                    className="input input-bordered input-md w-full focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                    onWheel={(e) => e.target.blur()}
                                />
                                {errors.monthlyIncome && <span className="text-red-500 text-sm mt-1">{errors.monthlyIncome.message}</span>}
                            </div>

                            <div className="form-control md:col-span-2 w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">Loan Amount Requested (BDT) *</span>
                                </label>
                                <input
                                    {...register('amount', {
                                        required: 'Loan amount is required',
                                    })}
                                    type="number"
                                    placeholder="Enter amount"
                                    className="input input-bordered input-lg w-full font-bold text-[#B91116] focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                    onWheel={(e) => e.target.blur()}
                                />
                                {errors.amount && <span className="text-red-500 text-sm mt-1">{errors.amount.message}</span>}
                            </div>

                            {/* Additional Info */}
                            <div className="md:col-span-2 mt-6">
                                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                                    <FaMapMarkerAlt className="text-[#B91116]" /> Additional Information
                                </h4>
                            </div>

                            <div className="form-control md:col-span-2 w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">Reason for Loan *</span>
                                </label>
                                <textarea
                                    {...register('purpose', { required: 'Reason is required' })}
                                    className="textarea textarea-bordered h-24 w-full focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                    placeholder="Please explain why you need this loan..."
                                ></textarea>
                                {errors.purpose && <span className="text-red-500 text-sm mt-1">{errors.purpose.message}</span>}
                            </div>

                            <div className="form-control md:col-span-2 w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">Present Address *</span>
                                </label>
                                <textarea
                                    {...register('address', { required: 'Address is required' })}
                                    className="textarea textarea-bordered h-24 w-full focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                    placeholder="Enter your full present address..."
                                ></textarea>
                                {errors.address && <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>}
                            </div>

                            <div className="form-control md:col-span-2 w-full">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-600">Extra Notes (Optional)</span>
                                </label>
                                <textarea
                                    {...register('notes')}
                                    className="textarea textarea-bordered h-20 w-full focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                    placeholder="Any additional information you want to share..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse md:flex-row justify-end gap-4 mt-12 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-ghost btn-lg text-gray-500 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !selectedLoan}
                                className="btn bg-[#B91116] hover:bg-[#900d11] text-white btn-lg px-10 shadow-lg shadow-red-200 hover:shadow-red-300 border-none rounded-xl transition-all transform hover:-translate-y-1"
                            >
                                {loading ? <span className="loading loading-spinner"></span> : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ApplyLoan;