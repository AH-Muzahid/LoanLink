import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';

const ApprovedLoans = () => {
    useEffect(() => {
        document.title = 'Approved Applications - Dashboard | LoanLink';
    }, []);

    const axiosSecure = useAxiosSecure();

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['approved-applications'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/applications?status=approved');
            return data;
        }
    });

    if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Approved Loan Applications</h2>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>User Info</th>
                            <th>Amount</th>
                            <th>Approved Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td className="font-mono text-sm">{app._id?.slice(0, 8)}...</td>
                                <td>
                                    <div>
                                        <div className="font-semibold">{app.userName}</div>
                                        <div className="text-sm text-base-content/60">{app.userEmail}</div>
                                    </div>
                                </td>
                                <td className="font-bold">৳{app.amount?.toLocaleString()}</td>
                                <td>{app.approvedAt ? new Date(app.approvedAt).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {applications.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-base-content/60">No approved applications</p>
                </div>
            )}
        </div>
    );
};

export default ApprovedLoans;
