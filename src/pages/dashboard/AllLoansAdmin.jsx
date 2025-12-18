import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaMoneyBillWave, FaSearch, FaTimesCircle, FaSave, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { useForm } from 'react-hook-form';

const AllLoansAdmin = () => {
    useEffect(() => {
        document.title = 'All Loans - Dashboard | LoanLink';
    }, []);

    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingLoan, setEditingLoan] = useState(null);
    const [deletingLoan, setDeletingLoan] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['admin-loans'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/all-loans');
            return data;
        }
    });

    // Toggle Home Visibility
    const toggleHomeMutation = useMutation({
        mutationFn: async ({ id, showOnHome }) => {
            const { data } = await axiosSecure.patch(`/loans/${id}`, { showOnHome });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-loans']);
            toast.success('Visibility updated successfully');
        }
    });

    // Delete Loan
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.delete(`/loans/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-loans']);
            toast.success('Loan deleted successfully');
            setDeletingLoan(null);
        }
    });

    // Update Loan
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const { _id, ...updateData } = data;
            const res = await axiosSecure.patch(`/loans/${_id}`, updateData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-loans']);
            toast.success('Loan updated successfully');
            setEditingLoan(null);
            reset();
        }
    });

    const handleEditClick = (loan) => {
        setEditingLoan(loan);
        reset(loan); // Pre-fill form with loan data
    };

    const onUpdateSubmit = (data) => {
        updateMutation.mutate({ ...data, _id: editingLoan._id });
    };

    const filteredLoans = loans.filter(loan =>
        loan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-base-200/30 p-4 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent flex items-center gap-3">
                        <FaMoneyBillWave className="text-[#B91116]" /> All Loans
                    </h2>
                    <p className="text-base-content/60 mt-1">Manage all available loan packages</p>
                </div>
                <Link to="/dashboard/add-loan" className="btn bg-[#B91116] hover:bg-[#900d11] text-white border-none shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 rounded-xl">
                    <FaPlus /> Add New Loan
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search loans by title or category..."
                        className="input input-bordered w-full pl-10 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {/* Desktop Table View */}
                    <motion.div
                        variants={containerVariants}
                        // initial="hidden"
                        animate="visible"
                        className="hidden md:block bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-base-200/50 text-base-content/70">
                                    <tr>
                                        <th className="py-4 pl-6">Loan Package</th>
                                        <th>Interest Rate</th>
                                        <th>Category</th>
                                        <th>Created By</th>
                                        <th>Show on Home</th>
                                        <th className="pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLoans.map((loan) => (
                                        <motion.tr
                                            key={loan._id}
                                            variants={itemVariants}
                                            className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none"
                                        >
                                            <td className="pl-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-xl ring-1 ring-base-200 ring-offset-1">
                                                            <img src={loan.image} alt={loan.title} className="object-cover" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base">{loan.title}</div>
                                                        <div className="text-xs text-base-content/50">ID: {loan._id.slice(-6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-bold text-[#B91116] text-lg">{loan.interestRate}%</div>
                                            </td>
                                            <td>
                                                <span className="badge badge-ghost font-medium">{loan.category}</span>
                                            </td>
                                            <td>
                                                <div className="text-sm font-medium">{loan.addedBy || 'Admin'}</div>
                                            </td>
                                            <td>
                                                <label className="cursor-pointer label justify-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={loan.showOnHome || false}
                                                        onChange={(e) => toggleHomeMutation.mutate({ id: loan._id, showOnHome: e.target.checked })}
                                                        className="toggle toggle-error toggle-sm"
                                                    />
                                                    <span className="label-text text-xs text-base-content/60">
                                                        {loan.showOnHome ? 'Visible' : 'Hidden'}
                                                    </span>
                                                </label>
                                            </td>
                                            <td className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(loan)}
                                                        className="btn btn-circle btn-ghost btn-sm text-blue-500 hover:bg-blue-50"
                                                        title="Edit Loan"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingLoan(loan)}
                                                        className="btn btn-circle btn-ghost btn-sm text-red-500 hover:bg-red-50"
                                                        title="Delete Loan"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredLoans.length === 0 && (
                            <div className="p-12 text-center text-base-content/50">
                                <FaSearch className="mx-auto text-4xl mb-3 opacity-20" />
                                <p>No loans found matching your search.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Mobile Card View */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="md:hidden space-y-4"
                    >
                        {filteredLoans.map((loan) => (
                            <motion.div
                                key={loan._id}
                                variants={itemVariants}
                                className="bg-base-100 p-5 rounded-2xl shadow-lg border border-base-200"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <img src={loan.image} alt={loan.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg truncate">{loan.title}</h3>
                                        <span className="badge badge-ghost badge-sm mt-1">{loan.category}</span>
                                    </div>
                                    <div className="font-bold text-[#B91116] text-lg">{loan.interestRate}%</div>
                                </div>

                                <div className="flex items-center justify-between py-3 border-t border-b border-base-100 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-base-content/60">Home Display:</span>
                                        <input
                                            type="checkbox"
                                            checked={loan.showOnHome || false}
                                            onChange={(e) => toggleHomeMutation.mutate({ id: loan._id, showOnHome: e.target.checked })}
                                            className="toggle toggle-error toggle-xs"
                                        />
                                    </div>
                                    <div className="text-xs text-base-content/50">
                                        By: {loan.addedBy || 'Admin'}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEditClick(loan)}
                                        className="btn btn-sm flex-1 btn-outline border-base-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeletingLoan(loan)}
                                        className="btn btn-sm flex-1 btn-outline border-base-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {editingLoan && (
                    <dialog className="modal modal-open backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="modal-box w-11/12 max-w-3xl bg-base-100 shadow-2xl border border-base-200 p-0 overflow-hidden"
                        >
                            <div className="bg-[#B91116] p-4 text-white flex justify-between items-center">
                                <h3 className="font-bold text-lg">Edit Loan Package</h3>
                                <button onClick={() => setEditingLoan(null)} className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20">
                                    <FaTimesCircle className="text-xl" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onUpdateSubmit)} className="p-6 max-h-[80vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-semibold">Loan Title</span></label>
                                        <input {...register('title', { required: true })} className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-semibold">Category</span></label>
                                        <select {...register('category', { required: true })} className="select select-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]">
                                            <option value="Personal Loan">Personal Loan</option>
                                            <option value="Business Loan">Business Loan</option>
                                            <option value="Home Loan">Home Loan</option>
                                            <option value="Car Loan">Car Loan</option>
                                            <option value="Education Loan">Education Loan</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-semibold">Interest Rate (%)</span></label>
                                        <input type="number" step="0.1" {...register('interestRate', { required: true })} className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-semibold">Max Loan Limit</span></label>
                                        <input type="number" {...register('maxLoanLimit', { required: true })} className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]" />
                                    </div>
                                    <div className="form-control md:col-span-2">
                                        <label className="label"><span className="label-text font-semibold">Image URL</span></label>
                                        <input type="url" {...register('image', { required: true })} className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]" />
                                    </div>
                                    <div className="form-control md:col-span-2">
                                        <label className="label"><span className="label-text font-semibold">Description</span></label>
                                        <textarea {...register('description', { required: true })} className="textarea textarea-bordered h-24 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"></textarea>
                                    </div>
                                </div>
                                <div className="modal-action">
                                    <button type="button" onClick={() => setEditingLoan(null)} className="btn btn-ghost">Cancel</button>
                                    <button type="submit" className="btn bg-[#B91116] hover:bg-[#900d11] text-white gap-2">
                                        <FaSave /> Update Loan
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </dialog>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingLoan && (
                    <dialog className="modal modal-open backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="modal-box max-w-sm bg-base-100 shadow-2xl border border-base-200 text-center p-8"
                        >
                            <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                                <FaExclamationTriangle className="text-3xl" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Delete Loan?</h3>
                            <p className="text-base-content/60 mb-6">
                                Are you sure you want to delete <span className="font-bold text-base-content">{deletingLoan.title}</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button onClick={() => setDeletingLoan(null)} className="btn btn-ghost">Cancel</button>
                                <button
                                    onClick={() => deleteMutation.mutate(deletingLoan._id)}
                                    className="btn btn-error text-white"
                                >
                                    Yes, Delete It
                                </button>
                            </div>
                        </motion.div>
                    </dialog>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllLoansAdmin;
