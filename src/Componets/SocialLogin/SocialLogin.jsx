import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";


const SocialLogin = () => {
    const axiosSecure = useAxiosSecure();
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('borrower');
    const [tempUser, setTempUser] = useState(null);
    
    // Redirect
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;
            
            // Check if user exists in database
            const { data: existingUser } = await axiosSecure.get(`/user/${user.email}`);
            
            if (!existingUser) {
                // New user - show role selection modal
                setTempUser(user);
                setShowRoleModal(true);
            } else {
                // Existing user - login directly
                toast.success("Login Successful!");
                navigate(from, { replace: true });
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleRoleSubmit = async () => {
        if (!selectedRole) {
            toast.error('Please select a role');
            return;
        }
        
        try {
            // Save user to database with role
            await axiosSecure.post('/users', {
                name: tempUser.displayName,
                email: tempUser.email,
                photoURL: tempUser.photoURL,
                role: selectedRole,
                status: 'active'
            });
            
            toast.success("Registration Successful!");
            setShowRoleModal(false);
            navigate(from, { replace: true });
        } catch (error) {
            toast.error('Failed to complete registration');
            console.error(error);
        }
    };

    return (
        <>
            <div className="w-full px-8 pb-4">
                <div className="divider text-sm text-gray-500">OR</div>
                <button 
                    onClick={handleGoogleSignIn}
                    className="btn btn-outline w-full flex items-center gap-2 hover:bg-gray-100 transition-all"
                >
                    <FcGoogle className="text-2xl" />
                    Continue with Google
                </button>
            </div>

            {/* Role Selection Modal */}
            {showRoleModal && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Complete Your Registration</h3>
                        <p className="mb-4">Welcome! Please select your role to continue:</p>
                        
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Borrower (Apply for loans)</span>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="borrower" 
                                    checked={selectedRole === 'borrower'}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="radio radio-primary" 
                                />
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Manager (Manage loans)</span>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="manager" 
                                    checked={selectedRole === 'manager'}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="radio radio-primary" 
                                />
                            </label>
                        </div>

                        <div className="modal-action">
                            <button onClick={handleRoleSubmit} className="btn btn-primary">Continue</button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default SocialLogin;