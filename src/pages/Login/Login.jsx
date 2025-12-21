import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth/useAuth";
import SocialLogin from "../../Componets/SocialLogin/SocialLogin";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
    const { signIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        const { email, password } = data;

        signIn(email, password)
            .then(result => {
                console.log(result.user);
                toast.success("Welcome Back!");
                navigate(from, { replace: true });
            })
            .catch(error => {
                console.error(error);
                toast.error("Invalid Email or Password");
            });
    };

    return (
        <div className="min-h-screen py-10 flex items-center justify-center relative overflow-hidden bg-linear-to-br from-base-200 via-base-100 to-base-200">
            {/* Animated Background Shapes */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#B91116]/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#B91116]/10 rounded-full blur-3xl"
            />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md shadow-2xl bg-base-100/80 backdrop-blur-xl border border-white/20 z-10"
            >
                <div className="card-body p-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-16 h-16 bg-[#B91116]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B91116]"
                        >
                            <FaSignInAlt className="text-2xl" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-base-content mb-2">Welcome Back</h1>
                        <p className="text-base-content/60">Enter your details to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="form-control">
                            <label className="label pl-0">
                                <span className="label-text font-semibold text-base">Email Address</span>
                            </label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-[#B91116] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={`input input-bordered w-full pl-11 h-12 bg-base-200/50 focus:bg-base-100 focus:border-[#B91116] focus:outline-none transition-all duration-300 ${errors.email ? 'input-error' : ''}`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && <span className="text-error text-xs mt-1 ml-1">{errors.email.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label pl-0">
                                <span className="label-text font-semibold text-base">Password</span>
                            </label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-[#B91116] transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className={`input input-bordered w-full pl-11 h-12 bg-base-200/50 focus:bg-base-100 focus:border-[#B91116] focus:outline-none transition-all duration-300 ${errors.password ? 'input-error' : ''}`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                />
                            </div>
                            {errors.password && <span className="text-error text-xs mt-1 ml-1">{errors.password.message}</span>}
                            <label className="label px-0">
                                <a href="#" className="label-text-alt link link-hover text-[#B91116] ml-auto font-medium">Forgot password?</a>
                            </label>
                        </div>

                        <div className="form-control mt-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn w-full bg-[#B91116] hover:bg-[#900d11] text-white text-lg border-none shadow-lg shadow-[#B91116]/20 h-12"
                            >
                                Login
                            </motion.button>
                        </div>
                    </form>

                    <SocialLogin />

                    <p className="text-center mt-6 text-base-content/70">
                        Don't have an account? <Link to="/register" className="text-[#B91116] font-bold hover:underline ml-1">Create Account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;