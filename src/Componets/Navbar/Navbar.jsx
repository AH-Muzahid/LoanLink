import { Link, NavLink } from "react-router-dom";
import useAuth from "../../Hooks/useAuth/useAuth"
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.success('User logged out successfully');
            })
            .catch(error => console.error(error))
    }

    // Theme Controller Logic
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'loanlink');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);

    const handleToggle = (e) => {
        setTheme(e.target.checked ? 'dark' : 'loanlink');
    }

    return (
        <div className="navbar bg-base-100/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-base-300">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <HiMenu className="h-5 w-5" />
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 gap-1">
                        <li><NavLink to="/" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>Home</NavLink></li>
                        <li><NavLink to="/all-loans" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>All Loans</NavLink></li>
                        <li><NavLink to="/about" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>About Us</NavLink></li>
                        <li><NavLink to="/contact" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>Contact</NavLink></li>
                        {user && <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'bg-primary text-white' : ''}>Dashboard</NavLink></li>}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform">
                    Loan<span className="text-accent">Link</span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    <li><NavLink to="/" className={({isActive}) => isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-primary/10'}>Home</NavLink></li>
                    <li><NavLink to="/all-loans" className={({isActive}) => isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-primary/10'}>All Loans</NavLink></li>
                    <li><NavLink to="/about" className={({isActive}) => isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-primary/10'}>About Us</NavLink></li>
                    <li><NavLink to="/contact" className={({isActive}) => isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-primary/10'}>Contact</NavLink></li>
                    {user && <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-primary/10'}>Dashboard</NavLink></li>}
                </ul>
            </div>

            <div className="navbar-end gap-3">
                <label className="swap swap-rotate btn btn-ghost btn-circle">
                    <input
                        type="checkbox"
                        onChange={handleToggle}
                        checked={theme === 'dark'}
                    />
                    <MdLightMode className="swap-off fill-current w-6 h-6 text-yellow-500" />
                    <MdDarkMode className="swap-on fill-current w-6 h-6 text-blue-500" />
                </label>


                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform">
                            <div className="w-10 rounded-full border-2 border-primary ring ring-primary ring-offset-2">
                                <img alt="User" src={user?.photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-56">
                            <li className="mb-2 px-3 py-2 font-bold text-primary border-b border-base-300">{user.displayName}</li>
                            <li><Link to="/dashboard/profile" className="hover:bg-primary/10">Profile</Link></li>
                            <li><button onClick={handleLogOut} className="text-red-500 font-bold hover:bg-red-50">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-outline btn-primary hover:scale-105 transition-transform">Login</Link>
                        
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default Navbar;