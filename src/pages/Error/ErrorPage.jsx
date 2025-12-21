import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ErrorPage = () => {
    useEffect(() => {
        document.title = '404 - Page Not Found | LoanLink';
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-br from-base-200 via-base-100 to-base-200">
            {/* Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#B91116]/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#B91116]/10 rounded-full blur-3xl"
            />

            <div className="text-center space-y-8 p-8 relative z-10 max-w-lg mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <h1 className="text-9xl font-extrabold text-[#B91116] opacity-20 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 2
                            }}
                        >
                            <FaExclamationTriangle className="text-6xl text-[#B91116]" />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h2 className="text-4xl font-bold text-base-content">Page Not Found</h2>
                    <p className="text-lg text-base-content/70">
                        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link
                        to="/"
                        className="btn bg-[#B91116] hover:bg-[#900d11] text-white btn-lg border-none shadow-lg shadow-[#B91116]/20 gap-3 px-8"
                    >
                        <FaHome /> Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default ErrorPage;