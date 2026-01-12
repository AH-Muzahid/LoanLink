import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth/useAuth';
import SocialLogin from '../../Componets/SocialLogin/SocialLogin';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaImage, FaRocket, FaUserTag } from 'react-icons/fa';
import axios from 'axios';
import SEO from '../../Componets/Shared/SEO';

const Register = () => {
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    const password = watch('password', '');


    const onSubmit = (data) => {
        const { name, email, photoURL, password } = data;

        createUser(email, password)
            .then(_result => {
                updateUserProfile(name, photoURL)
                    .then(() => {
                        const userInfo = { name, email, role: 'borrower', photoURL, status: 'active' };
                        axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    toast.success('Registration successful!');
                                    navigate('/dashboard');
                                }
                            })
                    })
            })
            .catch(error => toast.error(error.message));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 relative overflow-hidden">
            <SEO
                title="Create Account"
                description="Join LoanLinks today to access quick and easy loan solutions tailored for you."
                keywords="Register, Sign Up, Loan Account, Create Account, Join LoanLinks"
            />
            {/* Background Decorations */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-100/40 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -z-10" />

            <div className="card w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
                <div className="p-8 md:p-12">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <div className="w-16 h-16 bg-red-50 text-[#B91116] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <FaRocket className="text-3xl" />
                            </div>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-500">Join LoanLink to start your journey</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="form-control">
                            <label className="label pl-1 pt-0">
                                <span className="label-text font-medium text-gray-700">Full Name</span>
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder="John Doe"
                                    className={`input input-bordered w-full pl-11 h-12 rounded-xl bg-gray-50 focus:bg-white focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] transition-all ${errors.name ? 'input-error' : ''}`}
                                />
                            </div>
                            {errors.name && <span className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label pl-1 pt-0">
                                <span className="label-text font-medium text-gray-700">Email Address</span>
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...register('email', { required: 'Email is required' })}
                                    type="email"
                                    placeholder="john@example.com"
                                    className={`input input-bordered w-full pl-11 h-12 rounded-xl bg-gray-50 focus:bg-white focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] transition-all ${errors.email ? 'input-error' : ''}`}
                                />
                            </div>
                            {errors.email && <span className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label pl-1 pt-0">
                                <span className="label-text font-medium text-gray-700">Photo URL</span>
                            </label>
                            <div className="relative">
                                <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...register('photoURL', { required: 'Photo URL is required' })}
                                    type="url"
                                    placeholder="https://example.com/photo.jpg"
                                    className={`input input-bordered w-full pl-11 h-12 rounded-xl bg-gray-50 focus:bg-white focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] transition-all ${errors.photoURL ? 'input-error' : ''}`}
                                />
                            </div>
                            {errors.photoURL && <span className="text-red-500 text-xs mt-1 ml-1">{errors.photoURL.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label pl-1 pt-0">
                                <span className="label-text font-medium text-gray-700">Password</span>
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                                    placeholder="••••••••"
                                    className={`input input-bordered w-full pl-11 pr-12 h-12 rounded-xl bg-gray-50 focus:bg-white focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] transition-all ${errors.password ? 'input-error' : ''}`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B91116] transition-colors">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</span>}
                        </div>

                        {password && (
                            <div className="text-xs p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                                <p className={password.length >= 6 ? 'text-green-600 flex items-center gap-2 font-medium' : 'text-gray-400 flex items-center gap-2'}>
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${password.length >= 6 ? 'bg-green-100' : 'bg-gray-200'}`}>{password.length >= 6 ? '✓' : '•'}</span> At least 6 characters
                                </p>
                                <p className={/[A-Z]/.test(password) ? 'text-green-600 flex items-center gap-2 font-medium' : 'text-gray-400 flex items-center gap-2'}>
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${/[A-Z]/.test(password) ? 'bg-green-100' : 'bg-gray-200'}`}>{/[A-Z]/.test(password) ? '✓' : '•'}</span> Uppercase letter
                                </p>
                                <p className={/[a-z]/.test(password) ? 'text-green-600 flex items-center gap-2 font-medium' : 'text-gray-400 flex items-center gap-2'}>
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${/[a-z]/.test(password) ? 'bg-green-100' : 'bg-gray-200'}`}>{/[a-z]/.test(password) ? '✓' : '•'}</span> Lowercase letter
                                </p>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label pl-1 pt-0">
                                <span className="label-text font-medium text-gray-700">Confirm Password</span>
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Confirm password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    type="password"
                                    placeholder="••••••••"
                                    className={`input input-bordered w-full pl-11 h-12 rounded-xl bg-gray-50 focus:bg-white focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] transition-all ${errors.confirmPassword ? 'input-error' : ''}`}
                                />
                            </div>
                            {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</span>}
                        </div>

                        <button className="btn w-full bg-[#B91116] hover:bg-[#900d11] text-white text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all border-none mt-2">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8">
                        <SocialLogin />
                    </div>

                    <p className="text-center mt-6 text-gray-500 text-sm">
                        Already have an account? <Link to="/login" className="text-[#B91116] font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;