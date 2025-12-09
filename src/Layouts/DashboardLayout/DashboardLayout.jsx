import { Link, Outlet, NavLink } from "react-router-dom";
import useUserData from "../../Hooks/useUserData"; 

const DashboardLayout = () => {
    const userData = useUserData(); 
    const role = userData?.role;

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col items-center justify-center">
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden absolute top-4 left-4">
                    Open Menu
                </label>
                <div className="w-full p-10 min-h-screen">
                    <Outlet />
                </div>
            </div>
            
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content gap-2">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-primary">LoanLink</h2>
                        {/* Show Role Badge */}
                        <div className="badge badge-secondary badge-outline uppercase text-xs mt-2">
                            {role || 'Loading...'}
                        </div>
                    </div>

                    {/* Role Based Links */}
                    
                    {/* Admin Menu */}
                    {role === 'admin' && (
                        <>
                            <li><NavLink to="/dashboard/manage-users">Manage Users</NavLink></li>
                            <li><NavLink to="/dashboard/all-loans">All Loans</NavLink></li>
                        </>
                    )}

                    {/* Manager Menu */}
                    {role === 'manager' && (
                        <>
                            <li><NavLink to="/dashboard/add-loan">Add Loan</NavLink></li>
                            <li><NavLink to="/dashboard/my-added-loans">My Added Loans</NavLink></li>
                        </>
                    )}

                    {/* Borrower (User) Menu */}
                    {role === 'borrower' && (
                        <>
                            <li><NavLink to="/dashboard/my-loans">My Loans</NavLink></li>
                            <li><NavLink to="/dashboard/apply-loan">Apply for Loan</NavLink></li>
                        </>
                    )}

                    <div className="divider"></div>
                    
                    {/* Common Links */}
                    <li><NavLink to="/dashboard/profile">My Profile</NavLink></li>
                    <li><Link to="/">Home</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;