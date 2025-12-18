import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth/useAuth';
import SocialLogin from '../../Componets/SocialLogin/SocialLogin';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaImage, FaRocket, FaUserTag } from 'react-icons/fa';
import axios from 'axios';

const Register = () => {
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    const password = watch('password', '');
    const confirmPassword = watch('confirmPassword', '');


    const onSubmit = (data) => {
        const { name, email, photoURL, role, password } = data;

        createUser(email, password)
            .then(result => {
                updateUserProfile(name, photoURL)
                    .then(() => {
                        const userInfo = { name, email, role, photoURL, status: 'active' };
                        axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    toast.success('Registration successful!');
                                    navigate('/');
                                }
                            })
                    })
            })
            .catch(error => toast.error(error.message));
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#B91116] rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#B91116] rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

                {/* Left Side: Text & Illustration (Hidden on mobile for better focus) */}
                <div className="hidden lg:block lg:w-1/2 space-y-6 text-center lg:text-left">
                    <h1 className="text-5xl font-bold">
                        Join <span className="text-[#B91116]">LoanLink</span> Today
                    </h1>
                    <p className="text-lg text-base-content/70">
                        Start your financial journey with us. Create an account to apply for loans, track your progress, and achieve your dreams.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="p-4 bg-base-100 rounded-xl shadow-md border border-base-200">
                            <div className="text-[#B91116] text-2xl font-bold mb-1">Fast</div>
                            <div className="text-sm opacity-70">Application Process</div>
                        </div>
                        <div className="p-4 bg-base-100 rounded-xl shadow-md border border-base-200">
                            <div className="text-[#B91116] text-2xl font-bold mb-1">Secure</div>
                            <div className="text-sm opacity-70">Data Protection</div>
                        </div>
                        <div className="p-4 bg-base-100 rounded-xl shadow-md border border-base-200">
                            <div className="text-[#B91116] text-2xl font-bold mb-1">24/7</div>
                            <div className="text-sm opacity-70">Support Access</div>
                        </div>
                        <div className="p-4 bg-base-100 rounded-xl shadow-md border border-base-200">
                            <div className="text-[#B91116] text-2xl font-bold mb-1">Low</div>
                            <div className="text-sm opacity-70">Interest Rates</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-200 lg:w-1/2">
                    <div className="card-body">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Create Account</h2>
                            <p className="text-sm text-base-content/60">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="form-control">
                                <label className="label justify-start gap-2">
                                    <FaUser className="text-[#B91116]" /> <span className="font-semibold">Name</span>
                                </label>
                                <input {...register('name', { required: 'Name is required' })} placeholder="Full Name" className="input input-bordered w-full focus:border-[#B91116] focus:outline-none" />
                                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label justify-start gap-2">
                                    <FaEnvelope className="text-[#B91116]" /> <span className="font-semibold">Email</span>
                                </label>
                                <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email" className="input input-bordered w-full focus:border-[#B91116] focus:outline-none" />
                                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label justify-start gap-2">
                                    <FaImage className="text-[#B91116]" /> <span className="font-semibold">Photo URL</span>
                                </label>
                                <input {...register('photoURL', { required: 'Photo URL is required' })} type="url" placeholder="Photo URL" className="input input-bordered w-full focus:border-[#B91116] focus:outline-none" />
                                {errors.photoURL && <span className="text-red-500 text-xs mt-1">{errors.photoURL.message}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label justify-start gap-2">
                                    <FaUserTag className="text-[#B91116]" /> <span className="font-semibold">Role</span>
                                </label>
                                <select {...register('role', { required: true })} className="select select-bordered w-full focus:border-[#B91116] focus:outline-none">
                                    <option value="borrower">Borrower</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>

                            <div className="form-control relative">
                                <label className="label justify-start gap-2">
                                    <FaLock className="text-[#B91116]" /> <span className="font-semibold">Password</span>
                                </label>
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'At least 6 characters' },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                                            message: 'Must have uppercase and lowercase'
                                        }
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="input input-bordered w-full pr-12 focus:border-[#B91116] focus:outline-none"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[39px] text-gray-500 hover:text-[#B91116]">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                            </div>

                            {password && (
                                <div className="text-xs p-3 bg-base-200 rounded-lg space-y-1">
                                    <p className={password.length >= 6 ? 'text-green-600 flex items-center gap-1' : 'text-base-content/60 flex items-center gap-1'}>
                                        {password.length >= 6 ? '✓' : '•'} At least 6 chars
                                    </p>
                                    <p className={/[A-Z]/.test(password) ? 'text-green-600 flex items-center gap-1' : 'text-base-content/60 flex items-center gap-1'}>
                                        {/[A-Z]/.test(password) ? '✓' : '•'} Uppercase letter
                                    </p>
                                    <p className={/[a-z]/.test(password) ? 'text-green-600 flex items-center gap-1' : 'text-base-content/60 flex items-center gap-1'}>
                                        {/[a-z]/.test(password) ? '✓' : '•'} Lowercase letter
                                    </p>
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label justify-start gap-2">
                                    <FaLock className="text-[#B91116]" /> <span className="font-semibold">Confirm Password</span>
                                </label>
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Confirm password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="input input-bordered w-full focus:border-[#B91116] focus:outline-none"
                                />
                                {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>}
                            </div>

                            <button className="btn bg-[#B91116] hover:bg-[#900d11] w-full text-white text-lg mt-4 border-none shadow-lg shadow-[#B91116]/20">
                                <FaRocket /> Register
                            </button>
                        </form>

                        <SocialLogin />

                        <p className="text-center mt-4 text-sm">
                            Already have an account? <Link to="/login" className="text-[#B91116] font-bold hover:underline">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;