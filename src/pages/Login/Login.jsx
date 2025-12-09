import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth/useAuth";
import SocialLogin from "../../Componets/SocialLogin/SocialLogin";
import toast from "react-hot-toast";
// import loginImg from "../assets/login-illustration.svg"; 

const Login = () => {
    const { signIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        signIn(email, password)
            .then(result => {
                console.log(result.user);
                toast.success("Welcome Back!");
                navigate(from, { replace: true });
            })
            .catch(error => 
                console.error(error),
                toast.error("Invalid Email or Password", 
                { duration: 3000 }));

    };

    return (
        <> 
        <div className=" bg-base-200  text-center justify-center">
             <h1 className="text-5xl font-bold text-primary py-4">Login now!</h1>
                    <p className="py-6 text-gray-600">
                        Access your loan status, manage payments, and explore new opportunities. 
                        Your financial journey continues here.
                    </p>
        </div>
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                {/* Right Side: Attractive Illustration */}
                <div className="text-center lg:text-left lg:w-1/2">
                    {/* <img src={loginImg} 
                    alt="Login Illustration" 
                    className="rounded-xl shadow-lg w-full max-w-md mx-auto"
                     /> */}
                    <img 
                        src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg" 
                        alt="Login Illustration" 
                        className="rounded-xl shadow-lg w-full max-w-md mx-auto"
                    />
                </div>

                {/* Left Side: The Form */}
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleLogin} className="card-body pb-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email</span>
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Enter your email" 
                                className="input input-bordered focus:border-primary focus:outline-none" 
                                required 
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Enter your password" 
                                className="input input-bordered focus:border-primary focus:outline-none" 
                                required 
                            />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary text-white text-lg">Login</button>
                        </div>
                    </form>
                    
                    {/* Social Login Component  */}
                    <SocialLogin />

                    <p className="text-center pb-6 text-sm">
                        New here? <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
        </>
        // <div className="he
    );
};

export default Login;