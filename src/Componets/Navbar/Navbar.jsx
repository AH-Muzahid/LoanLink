import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth/useAuth"
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, User, HandCoins } from "lucide-react"; // Removed Bell
import { MdLightMode, MdDarkMode } from "react-icons/md";
import NotificationBell from "../Shared/NotificationBell"; // Added Import

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Removed redundant notification fetching logic

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.success('See you soon!');
            })
            .catch(error => console.error(error))
    }

    // Theme Controller Logic
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleToggle = (e) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    }

    const navLinks = [
        { path: '/', title: 'Home' },
        { path: '/all-loans', title: 'Start Loan' },
        { path: '/about', title: 'About' },
        { path: '/contact', title: 'Support' },
        ...(user ? [{ path: '/dashboard', title: 'Dashboard' }] : [])
    ];

    const closeDropdown = () => {
        const elem = document.activeElement;
        if (elem) {
            elem.blur();
        }
    };

    return (
        <nav
            className={`sticky top-0 w-full z-[999] transition-all duration-500 bg-base-100 shadow-md ${isScrolled ? 'py-2' : 'py-4'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <HandCoins className="w-6 h-6" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight text-base-content`}>
                            LoanLink
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2 bg-base-200/50 p-1.5 rounded-full backdrop-blur-sm border border-base-300/20">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `
                                    px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                                    ${isActive
                                        ? 'bg-base-100 text-red-600 shadow-sm'
                                        : 'text-base-content/70 hover:text-red-600 hover:bg-base-100/50'
                                    }
                                `}
                            >
                                {link.title}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Section - Unified for Mobile & Desktop */}
                    <div className="flex items-center gap-2 lg:gap-4">

                        {/* Notification Bell (Visible on both) */}
                        {user && (
                            <NotificationBell />
                        )}

                        {/* Theme Toggle (Visible on both) */}
                        <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm hover:bg-base-200 text-base-content/70">
                            <input
                                type="checkbox"
                                onChange={handleToggle}
                                checked={theme === 'dark'}
                            />
                            <MdLightMode className="swap-off w-5 h-5 text-amber-500" />
                            <MdDarkMode className="swap-on w-5 h-5 text-blue-500" />
                        </label>

                        {/* Desktop User Dropdown / Login Buttons */}
                        <div className="hidden lg:block">
                            {user ? (
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-red-100 ring-offset-2 hover:ring-red-300 transition-all">
                                        <div className="w-10 rounded-full">
                                            <img alt="User" src={user?.photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} />
                                        </div>
                                    </div>
                                    <ul tabIndex={0} className="mt-4 p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-64 border border-base-200 z-[1000]">
                                        <li className="px-4 py-3 border-b border-base-200 mb-2">
                                            <p className="font-bold text-base-content truncate">{user.displayName}</p>
                                            <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/profile" onClick={closeDropdown} className="py-2.5 hover:bg-red-50 hover:text-red-700 rounded-lg">
                                                <User className="w-4 h-4" /> Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard" onClick={closeDropdown} className="py-2.5 hover:bg-red-50 hover:text-red-700 rounded-lg">
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </Link>
                                        </li>
                                        <div className="divider my-1"></div>
                                        <li>
                                            <button onClick={() => { handleLogOut(); closeDropdown(); }} className="py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg">
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-red-600 transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-full shadow-lg hover:bg-red-700 hover:shadow-red-300 transition-all"
                                        >
                                            Get Started
                                        </motion.button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button - Moved Inside Group */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-base-content/70 hover:bg-base-200 rounded-full transition-colors"
                        >
                            {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-base-100 border-t border-base-200 overflow-hidden shadow-xl"
                    >
                        <div className="px-4 py-6 space-y-3">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) => `
                                        block px-4 py-3 rounded-xl font-medium transition-all duration-300
                                        ${isActive
                                            ? 'bg-red-50 text-red-700'
                                            : 'text-base-content/70 hover:bg-base-200'
                                        }
                                    `}
                                >
                                    {link.title}
                                </NavLink>
                            ))}

                            <div className="h-px bg-base-200 my-4"></div>

                            {!user ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" className="btn btn-ghost w-full">Login</Link>
                                    <Link to="/register" className="btn bg-red-600 text-white w-full hover:bg-red-700 border-none">Get Started</Link>
                                </div>
                            ) : (
                                <div className="p-4 bg-base-200/50 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <img src={user?.photoURL} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-base-content">{user.displayName}</p>
                                            <p className="text-xs text-base-content/60">{user.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleLogOut} className="w-full py-2 bg-base-100 text-red-600 rounded-xl text-sm font-medium border border-base-200 hover:bg-red-50">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;