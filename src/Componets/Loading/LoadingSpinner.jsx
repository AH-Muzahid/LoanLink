import { motion } from "framer-motion";
import { FaHandHoldingUsd } from "react-icons/fa";

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-base-100 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-96 h-96 bg-[#B91116]/10 rounded-full blur-3xl"
            />

            {/* Logo Animation */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-4 border-base-200 border-t-[#B91116] border-r-[#B91116]"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <FaHandHoldingUsd className="text-3xl text-[#B91116]" />
                    </motion.div>
                </div>

                <motion.h2
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-6 text-xl font-bold text-[#B91116] tracking-widest"
                >
                    LOANLINK
                </motion.h2>
            </div>
        </div>
    );
};

export default LoadingSpinner;