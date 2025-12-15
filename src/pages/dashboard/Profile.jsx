import { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth/useAuth';
import useUserData from '../../Hooks/useUserData';
import { FaEnvelope, FaUser, FaShieldAlt, FaSignOutAlt, FaEdit, FaCamera } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
    const { user, logOut } = useAuth();
    const userData = useUserData();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

    useEffect(() => {
        document.title = 'My Profile - Dashboard | LoanLink';
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
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">My Profile</h2>
                <button onClick={handleLogout} className="btn btn-error">
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card - Profile Picture */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                        <div className="relative">
                            <div className="avatar">
                                <div className="w-40 rounded-full ring ring-primary ring-offset-4">
                                    <img src={photoURL || "https://i.ibb.co/hYSMYwX/placeholder.jpg"} alt="Profile" />
                                </div>
                            </div>
                            {isEditing && (
                                <button className="btn btn-circle btn-primary btn-sm absolute bottom-0 right-0">
                                    <FaCamera />
                                </button>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold mt-4">{user?.displayName}</h3>
                        <p className="text-base-content/60">{user?.email}</p>
                        <div className="badge badge-primary badge-lg mt-2 font-bold uppercase">
                            {userData?.role || 'borrower'}
                        </div>
                    </div>
                </div>

                {/* Right Card - Profile Info */}
                <div className="lg:col-span-2 card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Profile Information</h3>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm">
                                    <FaEdit /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm">Cancel</button>
                                    <button onClick={handleUpdateProfile} className="btn btn-primary btn-sm">Save</button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold"><FaUser className="inline mr-2" />Full Name</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    readOnly={!isEditing}
                                    className="input input-bordered" 
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold"><FaEnvelope className="inline mr-2" />Email</span>
                                </label>
                                <input 
                                    type="email" 
                                    value={user?.email || ''} 
                                    readOnly 
                                    className="input input-bordered bg-base-200" 
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold"><FaCamera className="inline mr-2" />Photo URL</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={photoURL} 
                                    onChange={(e) => setPhotoURL(e.target.value)}
                                    readOnly={!isEditing}
                                    className="input input-bordered" 
                                    placeholder="Enter photo URL"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold"><FaShieldAlt className="inline mr-2" />Role</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={userData?.role || 'borrower'} 
                                    readOnly 
                                    className="input input-bordered bg-base-200 uppercase" 
                                />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold">Account Status</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className={`badge ${userData?.status === 'suspended' ? 'badge-error' : 'badge-success'} badge-lg`}>
                                        {userData?.status || 'active'}
                                    </span>
                                    {userData?.status === 'suspended' && userData?.suspendReason && (
                                        <div className="text-sm text-error">
                                            Reason: {userData.suspendReason}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;