import { Link, NavLink } from "react-router-dom";
import useAuth from "../../Hooks/useAuth/useAuth"
import { toast } from "react-hot-toast";

const Navbar = () => {
    const { user, logOut } = useAuth(); 
    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.success('User logged out successfully');
            })
            .catch(error => console.error(error))
    }

    return (
        <div className="navbar bg-base-100 shadow-sm container mx-auto px-4">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 gap-2">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/all-loans">All Loans</NavLink></li>
                        {user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl font-bold text-primary gap-0">
                    Loan<span className="text-secondary">Link</span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/all-loans">All Loans</NavLink></li>
                    {user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
                </ul>
            </div>

            <div className="navbar-end gap-2">
                
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full border border-primary">
                                <img alt="User" src={user?.photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li className="mb-2 pl-3 font-bold text-primary">{user.displayName}</li>
                            <li><Link to="/dashboard/profile">Profile</Link></li>
                            
                          
                            <li><button onClick={handleLogOut} className="text-red-500 font-bold">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-outline btn-primary">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;