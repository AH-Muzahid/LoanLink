import { Link, Outlet, NavLink } from "react-router-dom";
import useUserData from "../../Hooks/useUserData";
import useAuth from "../../Hooks/useAuth/useAuth";
import { FaHome, FaUsers, FaMoneyBillWave, FaFileAlt, FaPlus, FaList, FaUser, FaBars } from "react-icons/fa";

const DashboardLayout = () => {
    const userData = useUserData(); 
    const { user } = useAuth();
    const role = userData?.role;

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col">
                {/* Top Navbar */}
                <div className="navbar bg-gradient-to-r from-[#E31E24] to-[#B91116] text-white shadow-lg">
                    <div className="flex-1">
                        <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden">
                            <FaBars className="text-xl" />
                        </label>
                        <h1 className="text-xl md:text-2xl font-bold ml-4">Dashboard</h1>
                    </div>
                    <div className="flex-none gap-2">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full border-2 border-[#FDB913]">
                                    <img src={user?.photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} alt="User" />
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-base-content">
                                <li className="px-4 py-2 font-bold border-b">{user?.displayName}</li>
                                <li><Link to="/dashboard/profile">Profile</Link></li>
                                <li><Link to="/">Home</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full p-4 md:p-6 lg:p-8 min-h-screen bg-base-200">
                    <Outlet />
                </div>
            </div>
            
            <div className="drawer-side z-10">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="w-64 md:w-72 min-h-full bg-base-100 shadow-xl">
                    {/* User Profile Section */}
                    <div className="bg-gradient-to-br from-[#E31E24] to-[#B91116] p-6 text-white">
                        <div className="flex flex-col items-center">
                            <div className="avatar">
                                <div className="w-20 rounded-full ring ring-[#FDB913] ring-offset-2">
                                    <img src={user?.photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} alt="User" />
                                </div>
                            </div>
                            <h3 className="mt-3 font-bold text-lg">{user?.displayName}</h3>
                            <p className="text-sm opacity-90">{user?.email}</p>
                            <div className="badge badge-warning mt-2 font-bold uppercase">
                                {role || 'Loading...'}
                            </div>
                        </div>
                    </div>

                    {/* Menu */}
                    <ul className="menu p-4 gap-1">
                        <li>
                            <NavLink to="/dashboard" end className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                <FaHome /> Dashboard
                            </NavLink>
                        </li>
                        <div className="divider my-1"></div>

                        {/* Admin Menu */}
                        {role === 'admin' && (
                            <>
                                <li>
                                    <NavLink to="/dashboard/manage-users" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaUsers /> Manage Users
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/all-loans" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaMoneyBillWave /> All Loans
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/loan-applications" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaFileAlt /> Loan Applications
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {/* Manager Menu */}
                        {role === 'manager' && (
                            <>
                                <li>
                                    <NavLink to="/dashboard/add-loan" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaPlus /> Add Loan
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/manage-loans" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaList /> Manage Loans
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/pending-loans" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaFileAlt /> Pending Applications
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/approved-loans" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaMoneyBillWave /> Approved Applications
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {/* Borrower Menu */}
                        {role === 'borrower' && (
                            <>
                                <li>
                                    <NavLink to="/dashboard/my-loans" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaMoneyBillWave /> My Loans
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/apply-loan" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                        <FaPlus /> Apply for Loan
                                    </NavLink>
                                </li>
                            </>
                        )}

                        <div className="divider"></div>
                        
                        <li>
                            <NavLink to="/dashboard/profile" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>
                                <FaUser /> My Profile
                            </NavLink>
                        </li>
                        <li>
                            <Link to="/">
                                <FaHome /> Home
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;