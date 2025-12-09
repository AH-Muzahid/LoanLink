import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth/useAuth";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Redirect
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log(result.user);
                toast.success("Login Successful!");
                navigate(from, { replace: true });
            })
            .catch(error => {
                toast.error(error.message);
            });
    };

    return (
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
    );
};

export default SocialLogin;