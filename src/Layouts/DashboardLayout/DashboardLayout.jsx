import { useState, useEffect } from "react";
import { Link, Outlet, NavLink, useLocation } from "react-router-dom";
import useUserData from "../../Hooks/useUserData";
import useAuth from "../../Hooks/useAuth/useAuth";
import {
    FaHome, FaUsers, FaMoneyBillWave, FaFileAlt, FaPlus,
    FaList, FaUser, FaBars, FaChevronLeft, FaChevronRight,
    FaSignOutAlt, FaCog
} from "react-icons/fa";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
    const userData = useUserData();
    const { user, logOut } = useAuth();
    const role = userData?.role;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const location = useLocation();

    // Theme Controller Logic
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'loanlink');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);

    const handleToggle = (e) => {
        setTheme(e.target.checked ? 'dark' : 'loanlink');
    }

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar on route change for mobile
    useEffect(() => {
        if (isMobile) {
            document.getElementById('my-drawer-2').checked = false;
        }
    }, [location, isMobile]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const sidebarVariants = {
        expanded: { width: "280px" },
        collapsed: { width: "80px" }
    };

    const NavItem = ({ to, icon: Icon, label, end = false }) => (
        <li>
            <NavLink
                to={to}
                end={end}
                className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive
                        ? 'bg-[#B91116] text-white shadow-md shadow-red-200'
                        : 'text-base-content/70 hover:bg-base-200 hover:text-[#B91116]'
                    }
                    ${isCollapsed && !isMobile ? 'justify-center px-2' : ''}
                `}
            >
                <Icon className={`text-xl ${isCollapsed && !isMobile ? 'text-2xl' : ''}`} />
                {(!isCollapsed || isMobile) && (
                    <span className="font-medium whitespace-nowrap">{label}</span>
                )}
            </NavLink>
        </li>
    );

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col min-h-screen bg-base-200/50 transition-all duration-300">
                {/* Top Navbar */}
                <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-30 border-b border-base-200 px-4 sm:px-6">
                    <div className="flex-1 flex items-center gap-4">
                        <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle lg:hidden">
                            <FaBars className="text-xl text-base-content" />
                        </label>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[#B91116] to-[#E31E24] bg-clip-text text-transparent hidden sm:block">
                            LoanLink Dashboard
                        </h1>
                    </div>
                    <div className="flex-none gap-8">
                        <label className="swap swap-rotate btn btn-ghost btn-circle">
                            <input
                                type="checkbox"
                                onChange={handleToggle}
                                checked={theme === 'dark'}
                            />
                            <MdLightMode className="swap-off fill-current w-6 h-6 text-yellow-500" />
                            <MdDarkMode className="swap-on fill-current w-6 h-6 text-blue-500" />
                        </label>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-base-200 ring-offset-2 ring-offset-base-100">
                                <div className="w-10 rounded-full">
                                    <img src={user?.photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} alt="User" />
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
                                <li className="px-4 py-2 font-bold border-b border-base-200 text-base-content">{user?.displayName}</li>
                                <li><Link to="/dashboard/profile" className="py-2"><FaUser /> Profile</Link></li>
                                <li><Link to="/" className="py-2"><FaHome /> Home</Link></li>
                                <li><button onClick={logOut} className="py-2 text-error"><FaSignOutAlt /> Logout</button></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-x-hidden">
                    <Outlet />
                </div>
            </div>

            <div className="drawer-side z-40">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

                <motion.div
                    initial="expanded"
                    animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                    variants={sidebarVariants}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full bg-base-100 shadow-2xl border-r border-base-200 flex flex-col overflow-hidden"
                >
                    {/* Sidebar Header */}
                    <div className={`h-16 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between px-6'} border-b border-base-200 bg-base-100`}>
                        {(!isCollapsed || isMobile) && (
                            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-[#B91116]">
                                <h1 className="text-3xl">LoanLink</h1>
                            </Link>
                        )}
                        {!isMobile && (
                            <button
                                onClick={toggleSidebar}
                                className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:bg-base-200 hover:text-[#B91116]"
                            >
                                {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                            </button>
                        )}
                    </div>

                    {/* User Profile Summary */}
                    <div className={`p-4 border-b border-base-200 bg-base-50/50 ${isCollapsed && !isMobile ? 'flex justify-center' : ''}`}>
                        <div className={`flex items-center gap-3 ${isCollapsed && !isMobile ? 'flex-col' : ''}`}>
                            <div className="avatar placeholder">
                                <div className="bg-[#B91116] text-white rounded-full w-10 h-10 ring ring-red-100 ring-offset-2">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="user" />
                                    ) : (
                                        <span className="text-xl font-bold">{user?.displayName?.charAt(0) || 'U'}</span>
                                    )}
                                </div>
                            </div>
                            {(!isCollapsed || isMobile) && (
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-sm text-base-content truncate">{user?.displayName}</h3>
                                    <span className="badge badge-xs bg-red-100 text-[#B91116] border-none font-bold uppercase mt-1">
                                        {role || 'User'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                        <ul className="space-y-1">
                            <NavItem to="/dashboard" icon={FaHome} label="Dashboard" end />

                            <div className={`divider my-2 ${isCollapsed && !isMobile ? 'opacity-0 h-0' : 'opacity-100'}`}></div>

                            {/* Admin Menu */}
                            {role === 'admin' && (
                                <>
                                    {(!isCollapsed || isMobile) && <li className="menu-title text-xs font-bold text-base-content/40 uppercase px-4 mb-2">Admin</li>}
                                    <NavItem to="/dashboard/manage-users" icon={FaUsers} label="Manage Users" />
                                    <NavItem to="/dashboard/all-loans" icon={FaMoneyBillWave} label="All Loans" />
                                    <NavItem to="/dashboard/loan-applications" icon={FaFileAlt} label="Applications" />
                                </>
                            )}

                            {/* Manager Menu */}
                            {role === 'manager' && (
                                <>
                                    {(!isCollapsed || isMobile) && <li className="menu-title text-xs font-bold text-base-content/40 uppercase px-4 mb-2">Manager</li>}
                                    <NavItem to="/dashboard/add-loan" icon={FaPlus} label="Add Loan" />
                                    <NavItem to="/dashboard/manage-loans" icon={FaList} label="Manage Loans" />
                                    <NavItem to="/dashboard/pending-loans" icon={FaFileAlt} label="Pending" />
                                    <NavItem to="/dashboard/approved-loans" icon={FaMoneyBillWave} label="Approved" />
                                </>
                            )}

                            {/* Borrower Menu */}
                            {role === 'borrower' && (
                                <>
                                    {(!isCollapsed || isMobile) && <li className="menu-title text-xs font-bold text-base-content/40 uppercase px-4 mb-2">Borrower</li>}
                                    <NavItem to="/dashboard/my-loans" icon={FaMoneyBillWave} label="My Loans" />
                                    <NavItem to="/dashboard/apply-loan" icon={FaPlus} label="Apply Loan" />
                                </>
                            )}

                            <div className={`divider my-2 ${isCollapsed && !isMobile ? 'opacity-0 h-0' : 'opacity-100'}`}></div>

                            <NavItem to="/dashboard/profile" icon={FaUser} label="My Profile" />
                            <NavItem to="/" icon={FaHome} label="Back Home" />
                        </ul>
                    </div>

                    {/* Footer / Logout */}
                    <div className="p-4 border-t border-base-200">
                        <button
                            onClick={logOut}
                            className={`btn btn-ghost w-full hover:bg-red-50 hover:text-[#B91116] transition-colors flex items-center gap-3 ${isCollapsed && !isMobile ? 'justify-center px-0' : 'justify-start'}`}
                        >
                            <FaSignOutAlt className="text-xl" />
                            {(!isCollapsed || isMobile) && <span>Logout</span>}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardLayout;