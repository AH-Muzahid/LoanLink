import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth/useAuth"
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.success('User logged out successfully');
            })
            .catch(error => console.error(error))
    }

    // Theme Controller Logic
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);

    const handleToggle = (e) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    }

    const navLinks = [
        { path: '/', title: 'Home' },
        { path: '/all-loans', title: 'All Loans' },
        { path: '/about', title: 'About Us' },
        { path: '/contact', title: 'Contact' },
        ...(user ? [{ path: '/dashboard', title: 'Dashboard' }] : [])
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-base-100/90 backdrop-blur-lg shadow-lg py-2'
                : 'bg-base-100 py-2 shadow-sm'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#B91116] to-[#ff4d4d] flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-[#B91116]/30 transition-all duration-300">
                            L
                        </div>
                        <span className="text-2xl font-bold bg-linear-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent">
                            LoanLink
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `
                                    px-4 py-2 rounded-full font-medium transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#B91116] text-white shadow-md shadow-[#B91116]/20'
                                        : 'hover:bg-[#B91116]/10 hover:text-[#B91116]'
                                    }
                                `}
                            >
                                {link.title}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Theme Toggle */}
                        <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm hover:bg-base-200">
                            <input
                                type="checkbox"
                                onChange={handleToggle}
                                checked={theme === 'dark'}
                            />
                            <MdLightMode className="swap-off w-5 h-5 text-amber-500" />
                            <MdDarkMode className="swap-on w-5 h-5 text-blue-500" />
                        </label>

                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-[#B91116] ring-offset-2 ring-offset-base-100">
                                    <div className="w-10 rounded-full">
                                        <img alt="User" src={user?.photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-60 border border-base-200">
                                    <li className="px-4 py-3 border-b border-base-200">
                                        <p className="font-bold text-[#B91116] truncate">{user.displayName}</p>
                                        <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                                    </li>
                                    <li className="mt-2">
                                        <Link to="/dashboard/profile" className="py-2 hover:bg-[#B91116]/10 hover:text-[#B91116]">
                                            <FaUserCircle /> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogOut} className="py-2 text-red-500 hover:bg-red-50">
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn btn-ghost hover:bg-[#B91116]/10 hover:text-[#B91116]">
                                    <FaSignInAlt /> Login
                                </Link>
                                <Link to="/register" className="btn bg-[#B91116] hover:bg-[#900d11] text-white border-none shadow-lg shadow-[#B91116]/20 rounded-xl px-6">
                                    <FaUserPlus /> Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden btn btn-ghost btn-circle text-[#B91116]"
                    >
                        {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-base-100 border-t border-base-200 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) => `
                                        block px-4 py-3 rounded-xl font-medium transition-all duration-300
                                        ${isActive
                                            ? 'bg-[#B91116] text-white shadow-md'
                                            : 'hover:bg-base-200'
                                        }
                                    `}
                                >
                                    {link.title}
                                </NavLink>
                            ))}

                            <div className="divider my-2"></div>

                            <div className="flex justify-between items-center px-4">
                                <span className="font-medium">Theme</span>
                                <label className="swap swap-rotate">
                                    <input
                                        type="checkbox"
                                        onChange={handleToggle}
                                        checked={theme === 'dark'}
                                    />
                                    <MdLightMode className="swap-off w-6 h-6 text-amber-500" />
                                    <MdDarkMode className="swap-on w-6 h-6 text-blue-500" />
                                </label>
                            </div>

                            {!user && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Link to="/login" className="btn btn-outline border-[#B91116] text-[#B91116] hover:bg-[#B91116] hover:border-[#B91116] hover:text-white">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn bg-[#B91116] hover:bg-[#900d11] text-white border-none">
                                        Register
                                    </Link>
                                </div>
                            )}

                            {user && (
                                <div className="mt-4 p-4 bg-base-200/50 rounded-xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="avatar">
                                            <div className="w-10 rounded-full ring ring-[#B91116] ring-offset-2">
                                                <img src={user?.photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold">{user.displayName}</p>
                                            <p className="text-xs opacity-60">{user.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleLogOut} className="btn btn-error btn-sm w-full text-white">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;