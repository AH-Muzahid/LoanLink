import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AccessRestricted = ({ role, message, redirectPath = '/dashboard' }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8 bg-base-100">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <FaLock className="text-5xl text-[#B91116]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Restricted</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg">
                {message || (
                    <>
                        As an <span className="font-bold capitalize text-[#B91116]">{role}</span>, you are not eligible to access this feature. It is reserved for Borrowers only.
                    </>
                )}
            </p>
            <button
                onClick={() => navigate(redirectPath)}
                className="btn bg-[#B91116] hover:bg-[#900d11] text-white btn-lg px-8 border-none rounded-xl"
            >
                Return to Dashboard
            </button>
        </div>
    );
};

export default AccessRestricted;
