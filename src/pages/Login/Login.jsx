import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth/useAuth";
import SocialLogin from "../../Componets/SocialLogin/SocialLogin";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import SEO from "../../Componets/Shared/SEO";



const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();


    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        const { email, password } = data;

        signIn(email, password)
            .then(() => {
                toast.success("Welcome Back!");
                navigate("/dashboard", { replace: true });
            })
            .catch(error => {
                console.error(error);
                toast.error("Invalid Email or Password");
            });
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 relative overflow-hidden">
            <SEO
                title="Login"
                description="Securely log in to your LoanLinks account to manage your loans, applications, and profile."
                keywords="Login, Secure Access, Loan Dashboard, User Account"
            />
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-100/40 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -z-10" />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
            >
                <div className="p-8 md:p-12">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <div className="w-16 h-16 bg-red-50 text-[#B91116] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <FaSignInAlt className="text-3xl" />
                            </div>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                        <p className="text-gray-500">Sign in to continue to your dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="form-control">
                            <label className="label pl-1 pt-0">
                                <span className="label-text font-medium text-gray-700">Email Address</span>
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={`input input-bordered w-full pl-11 h-12 rounded-xl bg-gray-50 focus:bg-white focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] transition-all ${errors.email ? 'input-error' : ''}`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && <span className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label pl-1 pt-0">
                                <span className="label-text font-medium text-gray-700">Password</span>
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={`input input-bordered w-full pl-11 h-12 rounded-xl bg-gray-50 focus:bg-white focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] transition-all ${errors.password ? 'input-error' : ''}`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                />
                            </div>
                            {errors.password && <span className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</span>}
                            <label className="label px-1 pb-0">
                                <a href="#" className="label-text-alt text-[#B91116] hover:underline ml-auto font-medium">Forgot Password?</a>
                            </label>
                        </div>

                        <button
                            className="btn w-full bg-[#B91116] hover:bg-[#900d11] text-white text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all border-none"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Demo Login Buttons */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => signIn('test@gmail.com', 'Asdfgh').then(() => { toast.success("Welcome Back!"); navigate("/dashboard", { replace: true }); }).catch(err => toast.error(err.message))}
                            className="btn btn-outline btn-sm h-10 rounded-lg hover:bg-gray-100 hover:text-gray-800 border-gray-300 font-normal normal-case"
                        >
                            Demo User
                        </button>
                        <button
                            type="button"
                            onClick={() => signIn('manager@gmail.com', 'Manager').then(() => { toast.success("Welcome Back!"); navigate("/dashboard", { replace: true }); }).catch(err => toast.error(err.message))}
                            className="btn btn-outline btn-sm h-10 rounded-lg hover:bg-gray-100 hover:text-gray-800 border-gray-300 font-normal normal-case"
                        >
                            Demo Manager
                        </button>
                    </div>

                    {/* Social Login */}
                    <div className="mt-8">
                        <SocialLogin />
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 text-gray-500 text-sm">
                        Don't have an account yet? <Link to="/register" className="text-[#B91116] font-bold hover:underline">Create Account</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );

};

export default Login;