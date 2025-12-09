import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth/useAuth';
import SocialLogin from '../../Componets/SocialLogin/SocialLogin';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaImage, FaRocket } from 'react-icons/fa';
import axios from 'axios';

const Register = () => {
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        length: false, capital: false, lowercase: false, match: false
    });

    useEffect(() => {
        setPasswordValidation({
            length: password.length >= 6,
            capital: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            match: password === confirmPassword && confirmPassword !== ''
        });
    }, [password, confirmPassword]);


    const handleRegister = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const photoURL = form.photoURL.value;

        // Validation Check
        if (!passwordValidation.length || !passwordValidation.capital || !passwordValidation.lowercase) {
            return toast.error('Password must meet all requirements.');
        }
        if (!passwordValidation.match) {
            return toast.error('Passwords do not match.');
        }

        // Create User in Firebase
        createUser(email, password)
            .then(result => {
                console.log(result.user);
                // Update Profile
                updateUserProfile(name, photoURL)
                    .then(() => {
                        // Save User to MongoDB Server
                        const userInfo = {
                            name: name,
                            email: email,
                            role: 'borrower', // default role
                            photoURL: photoURL,
                            status: 'active',
                        }
                        console.log(userInfo.name);


                        axios.post('http://localhost:5000/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    toast.success('Registration successful!');
                                    navigate('/login');
                                }
                            })
                    })
            })
            .catch(error => {
                toast.error(error.message);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base-200 pt-20">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">Join LoanLink!</h1>
                    <p className="text-gray-500">Start your financial journey</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Name Field */}
                    <div className="form-control">
                        <label className="label justify-start gap-2 cursor-pointer">
                            <FaUser className="text-primary" /> <span className="font-semibold">Name</span>
                        </label>
                        <input type="text" name="name" placeholder="Full Name" className="input input-bordered w-full" required />
                    </div>

                    {/* Email Field */}
                    <div className="form-control">
                        <label className="label justify-start gap-2 cursor-pointer">
                            <FaEnvelope className="text-primary" /> <span className="font-semibold">Email</span>
                        </label>
                        <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" required />
                    </div>

                    {/* Photo URL Field */}
                    <div className="form-control">
                        <label className="label justify-start gap-2 cursor-pointer">
                            <FaImage className="text-primary" /> <span className="font-semibold">Photo URL</span>
                        </label>
                        <input type="url" name="photoURL" placeholder="Photo URL" className="input input-bordered w-full" required />
                    </div>

                    {/* Password Field */}
                    <div className="form-control relative">
                        <label className="label justify-start gap-2 cursor-pointer">
                            <FaLock className="text-primary" /> <span className="font-semibold">Password</span>
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            placeholder="Password"
                            className="input input-bordered w-full pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[52px] text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Live Validation Feedback UI */}
                    {password && (
                        <div className="text-xs p-2 bg-base-200 rounded-lg space-y-1">
                            <p className={passwordValidation.length ? 'text-green-600' : 'text-red-500'}>
                                {passwordValidation.length ? '✓' : '•'} At least 6 chars
                            </p>
                            <p className={passwordValidation.capital ? 'text-green-600' : 'text-red-500'}>
                                {passwordValidation.capital ? '✓' : '•'} Uppercase letter
                            </p>
                            <p className={passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}>
                                {passwordValidation.lowercase ? '✓' : '•'} Lowercase letter
                            </p>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div className="form-control">
                        <label className="label justify-start gap-2 cursor-pointer">
                            <FaLock className="text-primary" /> <span className="font-semibold">Confirm Password</span>
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="input input-bordered w-full"
                            required
                        />
                        {confirmPassword && (
                            <p className={`text-xs mt-1 ${passwordValidation.match ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordValidation.match ? '✓ Passwords match!' : '• Passwords do not match'}
                            </p>
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