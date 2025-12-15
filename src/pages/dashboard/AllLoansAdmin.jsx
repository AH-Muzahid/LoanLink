import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AllLoansAdmin = () => {
    useEffect(() => {
        document.title = 'All Loans - Dashboard | LoanLink';
    }, []);

    const queryClient = useQueryClient();

    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['admin-loans'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:5000/all-loans');
            return data;
        }
    });

    const toggleHomeMutation = useMutation({
        mutationFn: async ({ id, showOnHome }) => {
            const { data } = await axios.patch(`http://localhost:5000/loans/${id}`, { showOnHome });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-loans']);
            toast.success('Updated successfully');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axios.delete(`http://localhost:5000/loans/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-loans']);
            toast.success('Loan deleted successfully');
        }
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this loan?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">All Loans</h2>
                <Link to="/dashboard/add-loan" className="btn btn-primary">Add New Loan</Link>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Interest</th>
                            <th>Category</th>
                            <th>Created By</th>
                            <th>Show on Home</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan._id}>
                                <td>
                                    <img src={loan.image} alt={loan.title} className="w-16 h-16 object-cover rounded" />
                                </td>
                                <td className="font-semibold">{loan.title}</td>
                                <td className="text-primary font-bold">{loan.interestRate}%</td>
                                <td><span className="badge badge-primary">{loan.category}</span></td>
                                <td>{loan.addedBy || 'Admin'}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={loan.showOnHome || false}
                                        onChange={(e) => toggleHomeMutation.mutate({ id: loan._id, showOnHome: e.target.checked })}
                                        className="checkbox checkbox-primary"
                                    />
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <Link to={`/dashboard/edit-loan/${loan._id}`} className="btn btn-sm btn-info">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(loan._id)} className="btn btn-sm btn-error">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllLoansAdmin;
