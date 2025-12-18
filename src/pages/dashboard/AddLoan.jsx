import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import useAuth from '../../Hooks/useAuth/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaMoneyBillWave, FaFileAlt, FaImage, FaList, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AddLoan = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = 'Add Loan - Dashboard | LoanLink';
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const loanData = {
                ...data,
                interestRate: parseFloat(data.interestRate),
                maxLoanLimit: parseFloat(data.maxLoanLimit),
                feeAmount: parseFloat(data.feeAmount) || 10,
                showOnHome: data.showOnHome || false,
                addedBy: user?.email,
                createdAt: new Date().toISOString()
            };

            await axiosSecure.post('/loans', loanData);
            toast.success('Loan added successfully!');
            reset();
            navigate('/dashboard/manage-loans');
        } catch (error) {
            toast.error('Failed to add loan');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200/30 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent inline-flex items-center gap-3">
                        <FaPlus className="text-[#B91116]" /> Add New Loan Package
                    </h2>
                    <p className="text-base-content/60 mt-2">Create a new loan option for your customers</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-base-100 rounded-3xl shadow-xl border border-base-200 overflow-hidden">
                    <div className="p-8 md:p-10 space-y-8">

                        {/* Section 1: Basic Information */}
                        <div>
                            <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2 border-b border-base-200 pb-2">
                                <FaFileAlt className="text-[#B91116]" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control md:col-span-2">
                                    <label className="label font-semibold">Loan Title *</label>
                                    <input
                                        {...register('title', { required: 'Title is required' })}
                                        type="text"
                                        placeholder="e.g., Personal Loan"
                                        className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                    />
                                    {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
                                </div>

                                <div className="form-control md:col-span-2">
                                    <label className="label font-semibold">Description *</label>
                                    <textarea
                                        {...register('description', { required: 'Description is required' })}
                                        className="textarea textarea-bordered h-24 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                        placeholder="Detailed description of the loan..."
                                    ></textarea>
                                    {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label font-semibold">Category *</label>
                                    <select
                                        {...register('category', { required: 'Category is required' })}
                                        className="select select-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Personal Loan">Personal Loan</option>
                                        <option value="Home Loan">Home Loan</option>
                                        <option value="Car Loan">Car Loan</option>
                                        <option value="Education Loan">Education Loan</option>
                                        <option value="Business Loan">Business Loan</option>
                                    </select>
                                    {errors.category && <span className="text-red-500 text-xs mt-1">{errors.category.message}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label font-semibold">Image URL *</label>
                                    <div className="relative">
                                        <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                        <input
                                            {...register('image', { required: 'Image URL is required' })}
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            className="input input-bordered pl-10 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                        />
                                    </div>
                                    {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image.message}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Financial Details */}
                        <div>
                            <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2 border-b border-base-200 pb-2">
                                <FaMoneyBillWave className="text-[#B91116]" /> Financial Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="form-control">
                                    <label className="label font-semibold">Interest Rate (%) *</label>
                                    <input
                                        {...register('interestRate', { required: 'Interest rate is required', min: 0 })}
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g., 8.5"
                                        className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                    />
                                    {errors.interestRate && <span className="text-red-500 text-xs mt-1">{errors.interestRate.message}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label font-semibold">Max Loan Limit (৳) *</label>
                                    <input
                                        {...register('maxLoanLimit', { required: 'Max limit is required', min: 0 })}
                                        type="number"
                                        placeholder="e.g., 500000"
                                        className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                    />
                                    {errors.maxLoanLimit && <span className="text-red-500 text-xs mt-1">{errors.maxLoanLimit.message}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label font-semibold">Application Fee (USD) *</label>
                                    <input
                                        {...register('feeAmount', { required: 'Fee is required', min: 0 })}
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g., 10"
                                        className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                    />
                                    {errors.feeAmount && <span className="text-red-500 text-xs mt-1">{errors.feeAmount.message}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Additional Details */}
                        <div>
                            <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2 border-b border-base-200 pb-2">
                                <FaList className="text-[#B91116]" /> Additional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label font-semibold">Duration (Years)</label>
                                    <input
                                        {...register('duration')}
                                        type="text"
                                        placeholder="e.g., 1-5"
                                        className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label font-semibold">Required Documents</label>
                                    <input
                                        {...register('requiredDocuments')}
                                        type="text"
                                        placeholder="e.g., NID, Bank Statement"
                                        className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                    />
                                </div>

                                <div className="form-control md:col-span-2">
                                    <label className="label font-semibold">EMI Plans</label>
                                    <input
                                        {...register('emiPlans')}
                                        type="text"
                                        placeholder="e.g., 12 months, 24 months, 36 months"
                                        className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full"
                                    />
                                </div>

                                <div className="form-control md:col-span-2">
                                    <label className="label cursor-pointer justify-start gap-4 p-4 border border-base-200 rounded-xl hover:bg-base-200/50 transition-colors">
                                        <input
                                            {...register('showOnHome')}
                                            type="checkbox"
                                            className="checkbox checkbox-error"
                                        />
                                        <span className="label-text font-semibold">Show on Home Page</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-base-200">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-ghost btn-lg rounded-xl"
                            >
                                <FaTimesCircle /> Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn bg-[#B91116] hover:bg-[#900d11] text-white btn-lg px-8 rounded-xl shadow-lg border-none transition-all transform hover:-translate-y-1"
                            >
                                {loading ? <span className="loading loading-spinner"></span> : <><FaCheckCircle /> Add Loan</>}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddLoan;