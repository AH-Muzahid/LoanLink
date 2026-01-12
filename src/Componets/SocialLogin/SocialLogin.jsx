import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";



const SocialLogin = () => {
    const axiosSecure = useAxiosSecure();
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            // Check if user exists in database
            const { data: existingUser } = await axiosSecure.get(`/user/${user.email}`);

            if (!existingUser) {
                // New user - automatically register as borrower
                await axiosSecure.post('/users', {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    role: 'borrower',
                    status: 'active'
                });

                toast.success("Registration Successful!");
                navigate("/dashboard", { replace: true });
            } else {
                // Existing user - login directly
                toast.success("Login Successful!");
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full px-8 pb-4">
            <div className="divider text-sm text-gray-500">OR</div>
            <button
                onClick={handleGoogleSignIn}
                className="btn btn-outline w-full flex items-center gap-2 hover:bg-[#B91116] hover:text-white transition-all"
            >
                <FcGoogle className="text-2xl" />
                Continue with Google
            </button>
        </div>
    );
};

export default SocialLogin;