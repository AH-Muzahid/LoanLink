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
                        axios.post('http://localhost:5000/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    toast.success('Registration successful!');
                                    navigate('/login');
                                }
                            })
                    })
            })
            .catch(error => toast.error(error.message));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base-200 pt-20">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">Join LoanLink!</h1>
                    <p className="text-gray-500">Start your financial journey</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="form-control">
                        <label className="label justify-start gap-2">
                            <FaUser className="text-primary" /> <span className="font-semibold">Name</span>
                        </label>
                        <input {...register('name', { required: 'Name is required' })} placeholder="Full Name" className="input input-bordered w-full" />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label justify-start gap-2">
                            <FaEnvelope className="text-primary" /> <span className="font-semibold">Email</span>
                        </label>
                        <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email" className="input input-bordered w-full" />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label justify-start gap-2">
                            <FaImage className="text-primary" /> <span className="font-semibold">Photo URL</span>
                        </label>
                        <input {...register('photoURL', { required: 'Photo URL is required' })} type="url" placeholder="Photo URL" className="input input-bordered w-full" />
                        {errors.photoURL && <span className="text-red-500 text-xs">{errors.photoURL.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label justify-start gap-2">
                            <FaUserTag className="text-primary" /> <span className="font-semibold">Role</span>
                        </label>
                        <select {...register('role', { required: true })} className="select select-bordered w-full">
                            <option value="borrower">Borrower</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <div className="form-control relative">
                        <label className="label justify-start gap-2">
                            <FaLock className="text-primary" /> <span className="font-semibold">Password</span>
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
                            className="input input-bordered w-full pr-12"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[52px] text-gray-500">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                    </div>

                    {password && (
                        <div className="text-xs p-2 bg-base-200 rounded-lg space-y-1">
                            <p className={password.length >= 6 ? 'text-green-600' : 'text-red-500'}>
                                {password.length >= 6 ? '✓' : '•'} At least 6 chars
                            </p>
                            <p className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-500'}>
                                {/[A-Z]/.test(password) ? '✓' : '•'} Uppercase letter
                            </p>
                            <p className={/[a-z]/.test(password) ? 'text-green-600' : 'text-red-500'}>
                                {/[a-z]/.test(password) ? '✓' : '•'} Lowercase letter
                            </p>
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label justify-start gap-2">
                            <FaLock className="text-primary" /> <span className="font-semibold">Confirm Password</span>
                        </label>
                        <input
                            {...register('confirmPassword', {
                                required: 'Confirm password',
                                validate: value => value === password || 'Passwords do not match'
                            })}
                            type="password"
                            placeholder="Confirm Password"
                            className="input input-bordered w-full"
                        />
                        {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
                        {confirmPassword && password === confirmPassword && (
                            <span className="text-green-600 text-xs">✓ Passwords match!</span>
                        )}
                    </div>

                    <button className="btn btn-primary w-full text-white text-lg mt-4">
                        <FaRocket /> Register
                    </button>
                </form>


                <SocialLogin />

                <p className="text-center mt-4">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;