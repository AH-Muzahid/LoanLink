import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';

const ManageLoans = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        document.title = 'Manage Loans - Dashboard | LoanLink';
    }, []);

    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['manager-loans', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/my-added-loans/${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.delete(`/loans/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['manager-loans']);
            toast.success('Loan deleted successfully');
        }
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this loan?')) {
            deleteMutation.mutate(id);
        }
    };

    const filteredLoans = loans.filter(loan =>
        loan.title?.toLowerCase().includes(search.toLowerCase()) ||
        loan.category?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Manage Loans</h2>
                <Link to="/dashboard/add-loan" className="btn btn-primary">Add New Loan</Link>
            </div>

            {/* Search */}
            <div className="form-control mb-6">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        className="input input-bordered w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-square btn-primary">
                        <FaSearch />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Interest</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLoans.map((loan) => (
                            <tr key={loan._id}>
                                <td>
                                    <img src={loan.image} alt={loan.title} className="w-16 h-16 object-cover rounded" />
                                </td>
                                <td className="font-semibold">{loan.title}</td>
                                <td className="text-primary font-bold">{loan.interestRate}%</td>
                                <td><span className="badge badge-primary">{loan.category}</span></td>
                                <td>
                                    <div className="flex gap-2">
                                        <Link to={`/dashboard/update-loan/${loan._id}`} className="btn btn-sm btn-info">
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

            {filteredLoans.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-base-content/60">No loans found</p>
                </div>
            )}
        </div>
    );
};

export default ManageLoans;
