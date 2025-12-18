import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const ApplyLoan = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
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
                // max: selectedLoan.maxLoanLimit,
                // min: selectedLoan.minLoanLimit,

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
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Apply for Loan</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {/* Select Loan */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Select Loan *</span>
                        </label>
                        <select
                            onChange={handleLoanSelect}
                            className="select select-bordered"
                            required
                        >
                            <option value="">Choose a loan</option>
                            {loans.map(loan => (
                                <option key={loan._id} value={loan._id}>
                                    {loan.title} - {loan.interestRate}% Interest
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Auto-filled Fields */}
                    {selectedLoan && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-base-200 rounded-lg">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">User Email</span>
                                </label>
                                <input type="email" value={user?.email} readOnly className="input input-bordered bg-base-300" />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Loan Title</span>
                                </label>
                                <input type="text" value={selectedLoan.title} readOnly className="input input-bordered bg-base-300" />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Interest Rate</span>
                                </label>
                                <input type="text" value={`${selectedLoan.interestRate}%`} readOnly className="input input-bordered bg-base-300" />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Application Fee</span>
                                </label>
                                <input type="text" value={`$${selectedLoan.feeAmount || 10} USD`} readOnly className="input input-bordered bg-base-300" />
                            </div>
                        </div>
                    )}
                    {/* Max Loan Limit */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Max Limit (BDT)</span></label>
                        <input type="text" value={selectedLoan?.maxLoanLimit || ''} readOnly className="input input-bordered bg-base-300 text-error font-bold" />
                    </div>

                    {/* User Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">First Name *</span>
                            </label>
                            <input
                                {...register('firstName', { required: 'First name is required' })}
                                type="text"
                                placeholder="Enter first name"
                                className="input input-bordered"
                            />
                            {errors.firstName && <span className="text-error text-sm">{errors.firstName.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Last Name *</span>
                            </label>
                            <input
                                {...register('lastName', { required: 'Last name is required' })}
                                type="text"
                                placeholder="Enter last name"
                                className="input input-bordered"
                            />
                            {errors.lastName && <span className="text-error text-sm">{errors.lastName.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Contact Number *</span>
                            </label>
                            <input
                                {...register('contactNumber', { required: 'Contact number is required' })}
                                type="tel"
                                placeholder="01XXXXXXXXX"
                                className="input input-bordered"
                            />
                            {errors.contactNumber && <span className="text-error text-sm">{errors.contactNumber.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">National ID / Passport *</span>
                            </label>
                            <input
                                {...register('nationalId', { required: 'ID is required' })}
                                type="text"
                                placeholder="Enter NID or Passport"
                                className="input input-bordered"
                            />
                            {errors.nationalId && <span className="text-error text-sm">{errors.nationalId.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Income Source *</span>
                            </label>
                            <select {...register('incomeSource', { required: 'Income source is required' })} className="select select-bordered">
                                <option value="">Select source</option>
                                <option value="Salary">Salary</option>
                                <option value="Business">Business</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.incomeSource && <span className="text-error text-sm">{errors.incomeSource.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Monthly Income (৳) *</span>
                            </label>
                            <input
                                {...register('monthlyIncome', { required: 'Monthly income is required', min: 0 })}
                                type="number"
                                placeholder="Enter monthly income"
                                className="input input-bordered"
                                onWheel={(e) => e.target.blur()}
                            />
                            {errors.monthlyIncome && <span className="text-error text-sm">{errors.monthlyIncome.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Loan Amount (৳) *</span>
                            </label>
                            <input
                                {...register('amount', {
                                    required: 'Loan amount is required',
                                })}

                                type="number"
                                placeholder="Enter loan amount"
                                className="input input-bordered"
                                onWheel={(e) => e.target.blur()}
                            />
                            {errors.amount && <span className="text-error text-sm">{errors.amount.message}</span>}
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Reason for Loan *</span>
                            </label>
                            <textarea
                                {...register('purpose', { required: 'Reason is required' })}
                                className="textarea textarea-bordered h-20"
                                placeholder="Explain why you need this loan..."
                            ></textarea>
                            {errors.purpose && <span className="text-error text-sm">{errors.purpose.message}</span>}
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Address *</span>
                            </label>
                            <textarea
                                {...register('address', { required: 'Address is required' })}
                                className="textarea textarea-bordered h-20"
                                placeholder="Enter your full address..."
                            ></textarea>
                            {errors.address && <span className="text-error text-sm">{errors.address.message}</span>}
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Extra Notes</span>
                            </label>
                            <textarea
                                {...register('notes')}
                                className="textarea textarea-bordered h-20"
                                placeholder="Any additional information..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="card-actions justify-end mt-6">
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-ghost">Cancel</button>
                        <button type="submit" disabled={loading || !selectedLoan} className="btn btn-primary">
                            {loading ? <span className="loading loading-spinner"></span> : 'Submit Application'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ApplyLoan;