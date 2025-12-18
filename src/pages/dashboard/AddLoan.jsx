import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import useAuth from '../../Hooks/useAuth/useAuth';
import { useNavigate } from 'react-router-dom';

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
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Add New Loan</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Loan Title */}
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Loan Title *</span>
                            </label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                type="text"
                                placeholder="e.g., Personal Loan"
                                className="input input-bordered"
                            />
                            {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
                        </div>

                        {/* Description */}
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Description *</span>
                            </label>
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                className="textarea textarea-bordered h-24"
                                placeholder="Loan description..."
                            ></textarea>
                            {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
                        </div>

                        {/* Category */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Category *</span>
                            </label>
                            <select {...register('category', { required: 'Category is required' })} className="select select-bordered">
                                <option value="">Select Category</option>
                                <option value="Personal Loan">Personal Loan</option>
                                <option value="Home Loan">Home Loan</option>
                                <option value="Car Loan">Car Loan</option>
                                <option value="Education Loan">Education Loan</option>
                                <option value="Business Loan">Business Loan</option>
                            </select>
                            {errors.category && <span className="text-error text-sm">{errors.category.message}</span>}
                        </div>

                        {/* Interest Rate */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Interest Rate (%) *</span>
                            </label>
                            <input
                                {...register('interestRate', { required: 'Interest rate is required', min: 0 })}
                                type="number"
                                step="0.01"
                                placeholder="e.g., 8.5"
                                className="input input-bordered"
                            />
                            {errors.interestRate && <span className="text-error text-sm">{errors.interestRate.message}</span>}
                        </div>

                        {/* Max Loan Limit */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Max Loan Limit (৳) *</span>
                            </label>
                            <input
                                {...register('maxLoanLimit', { required: 'Max limit is required', min: 0 })}
                                type="number"
                                placeholder="e.g., 500000"
                                className="input input-bordered"
                            />
                            {errors.maxLoanLimit && <span className="text-error text-sm">{errors.maxLoanLimit.message}</span>}
                        </div>

                        {/* Application Fee */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Application Fee (USD) *</span>
                            </label>
                            <input
                                {...register('feeAmount', { required: 'Fee is required', min: 0 })}
                                type="number"
                                step="0.01"
                                placeholder="e.g., 10"
                                className="input input-bordered"
                            />
                            {errors.feeAmount && <span className="text-error text-sm">{errors.feeAmount.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Duration (Years)</span>
                            </label>
                            <input
                                {...register('duration')}
                                type="text"
                                placeholder="e.g., 1-5"
                                className="input input-bordered"
                            />
                        </div>

                        {/* Required Documents */}
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Required Documents</span>
                            </label>
                            <input
                                {...register('requiredDocuments')}
                                type="text"
                                placeholder="e.g., NID, Bank Statement, Salary Slip"
                                className="input input-bordered"
                            />
                        </div>

                        {/* EMI Plans */}
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">EMI Plans</span>
                            </label>
                            <input
                                {...register('emiPlans')}
                                type="text"
                                placeholder="e.g., 12 months, 24 months, 36 months"
                                className="input input-bordered"
                            />
                        </div>

                        {/* Image URL */}
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Image URL *</span>
                            </label>
                            <input
                                {...register('image', { required: 'Image URL is required' })}
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="input input-bordered"
                            />
                            {errors.image && <span className="text-error text-sm">{errors.image.message}</span>}
                        </div>

                        {/* Show on Home */}
                        <div className="form-control md:col-span-2">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input {...register('showOnHome')} type="checkbox" className="checkbox checkbox-primary" />
                                <span className="label-text font-semibold">Show on Home Page</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="card-actions justify-end mt-6">
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-ghost">Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? <span className="loading loading-spinner"></span> : 'Add Loan'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddLoan;