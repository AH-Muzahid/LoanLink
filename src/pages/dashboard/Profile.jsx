import { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth/useAuth';
import useUserData from '../../Hooks/useUserData';
import { FaEnvelope, FaUser, FaShieldAlt, FaSignOutAlt, FaEdit, FaCamera, FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, logOut } = useAuth();
    const userData = useUserData();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

    useEffect(() => {
        document.title = 'My Profile - Dashboard | LoanLink';
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setName(user?.displayName || '');
        setPhotoURL(user?.photoURL || '');
    }, [user]);

    const handleLogout = () => {
        logOut()
            .then(() => {
                toast.success('Logged out successfully');
                navigate('/');
            })
            .catch(error => {
                toast.error('Logout failed');
                console.error(error);
            });
    };

    const handleUpdateProfile = async () => {
        try {
            await updateProfile(user, {
                displayName: name,
                photoURL: photoURL
            });
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-base-200/30 pb-20">
            {/* Hero Background */}
            <div className="relative h-[280px] w-full bg-gradient-to-r from-gray-900 via-[#1a1a1a] to-[#2d0506] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-200/30 to-transparent"></div>

                <div className="container mx-auto px-4 h-full flex items-center justify-between relative z-10 pb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-white"
                    >
                        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                        <p className="text-white/60 text-lg">Manage your personal account details</p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        onClick={handleLogout}
                        className="btn bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-red-600 hover:border-red-600 transition-all gap-2"
                    >
                        <FaSignOutAlt /> Sign Out
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 -mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar - Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="lg:col-span-4"
                    >
                        <div className="bg-base-100 rounded-3xl shadow-xl border border-base-200 overflow-hidden sticky top-24">
                            <div className="h-32 bg-gradient-to-r from-[#B91116] to-[#900d11]"></div>
                            <div className="px-8 pb-8 text-center -mt-16">
                                <div className="relative inline-block group">
                                    <div className="avatar">
                                        <div className="w-32 rounded-full ring-4 ring-base-100 shadow-2xl bg-base-100">
                                            <img
                                                src={photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"}
                                                alt="Profile"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <div className="absolute bottom-2 right-2 bg-[#B91116] text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                            <FaCamera size={14} />
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold mt-4 text-base-content">{user?.displayName}</h2>
                                <p className="text-base-content/60 font-medium">{user?.email}</p>

                                <div className="flex flex-wrap justify-center gap-2 mt-6">
                                    <span className="badge badge-lg bg-red-50 text-[#B91116] border-red-100 p-4 font-bold uppercase tracking-wider text-xs">
                                        {userData?.role || 'borrower'}
                                    </span>
                                    <span className={`badge badge-lg ${userData?.status === 'suspended' ? 'badge-error' : 'badge-success'} p-4 text-white font-bold uppercase tracking-wider text-xs`}>
                                        {userData?.status || 'active'}
                                    </span>
                                </div>

                                <div className="divider my-6"></div>

                                <div className="space-y-4 text-left">
                                    <div className="flex items-center gap-3 text-base-content/70">
                                        <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-[#B91116]">
                                            <FaCalendarAlt />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-base-content/40">Member Since</p>
                                            <p className="font-medium text-sm">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-base-content/70">
                                        <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-[#B91116]">
                                            <FaIdCard />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-base-content/40">User ID</p>
                                            <p className="font-medium text-sm truncate w-48" title={user?.uid}>{user?.uid}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Details Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-base-100 rounded-3xl shadow-xl border border-base-200 p-8">
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-base-200">
                                <div>
                                    <h3 className="text-2xl font-bold text-base-content">Profile Details</h3>
                                    <p className="text-base-content/60 mt-1">Update your personal information</p>
                                </div>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn bg-[#B91116] hover:bg-[#900d11] text-white border-none shadow-md shadow-red-200 gap-2"
                                    >
                                        <FaEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="btn btn-ghost hover:bg-base-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateProfile}
                                            className="btn bg-[#B91116] hover:bg-[#900d11] text-white border-none shadow-md shadow-red-200"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="form-control space-y-2">
                                    <label className="label pl-0">
                                        <span className="label-text font-bold text-base-content/70">Full Name</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaUser className={`transition-colors ${isEditing ? 'text-[#B91116]' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            readOnly={!isEditing}
                                            className={`input w-full pl-11 h-12 transition-all ${isEditing ? 'input-bordered border-[#B91116] focus:ring-4 focus:ring-red-50 bg-base-100' : 'input-ghost bg-base-200/40 font-medium'}`}
                                        />
                                    </div>
                                </div>

                                <div className="form-control space-y-2">
                                    <label className="label pl-0">
                                        <span className="label-text font-bold text-base-content/70">Email Address</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            readOnly
                                            className="input input-ghost bg-base-200/40 w-full pl-11 h-12 font-medium opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="form-control space-y-2 md:col-span-2">
                                    <label className="label pl-0">
                                        <span className="label-text font-bold text-base-content/70">Photo URL</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaCamera className={`transition-colors ${isEditing ? 'text-[#B91116]' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            value={photoURL}
                                            onChange={(e) => setPhotoURL(e.target.value)}
                                            readOnly={!isEditing}
                                            className={`input w-full pl-11 h-12 transition-all ${isEditing ? 'input-bordered border-[#B91116] focus:ring-4 focus:ring-red-50 bg-base-100' : 'input-ghost bg-base-200/40 font-medium'}`}
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="form-control space-y-2">
                                    <label className="label pl-0">
                                        <span className="label-text font-bold text-base-content/70">Phone Number</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaPhone className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value="Not Set"
                                            readOnly
                                            className="input input-ghost bg-base-200/40 w-full pl-11 h-12 font-medium opacity-70"
                                        />
                                    </div>
                                </div>

                                <div className="form-control space-y-2">
                                    <label className="label pl-0">
                                        <span className="label-text font-bold text-base-content/70">Location</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaMapMarkerAlt className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value="Not Set"
                                            readOnly
                                            className="input input-ghost bg-base-200/40 w-full pl-11 h-12 font-medium opacity-70"
                                        />
                                    </div>
                                </div>
                            </div>

                            {userData?.status === 'suspended' && (
                                <div className="mt-8 bg-error/10 border border-error/20 rounded-2xl p-6 flex items-start gap-4">
                                    <FaShieldAlt className="text-error text-2xl mt-1" />
                                    <div>
                                        <h4 className="font-bold text-error text-lg">Account Suspended</h4>
                                        <p className="text-base-content/70 mt-1">
                                            Your account has been suspended. Please contact support for more information.
                                            <br />
                                            <span className="font-semibold">Reason:</span> {userData.suspendReason || 'Violation of terms of service.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;