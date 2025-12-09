import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiCheckCircle, HiUsers, HiStar } from 'react-icons/hi';

const Banner = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            Fast & Secure Approval
                        </motion.div>
                        
                        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Microloans Made
                            <span className="block text-primary">Simple & Fast</span>
                        </motion.h1>
                        
                        <motion.p variants={itemVariants} className="text-base sm:text-lg lg:text-xl text-base-content/70 mb-6 lg:mb-8 leading-relaxed">
                            Get approved within 24 hours. Transparent process, flexible terms, and dedicated support for your financial needs.
                        </motion.p>
                        
                        <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3 mb-6 lg:mb-8">
                            {['No hidden fees', 'Quick approval process', 'Flexible repayment terms'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <HiCheckCircle className="text-secondary text-xl flex-shrink-0" />
                                    <span className="text-sm sm:text-base text-base-content/80">{item}</span>
                                </div>
                            ))}
                        </motion.div>
                        
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Link to="/dashboard/apply-loan" className="btn btn-primary btn-md sm:btn-lg gap-2 group w-full sm:w-auto">
                                Apply Now
                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/all-loans" className="btn btn-outline btn-md sm:btn-lg w-full sm:w-auto">
                                View Loans
                            </Link>
                        </motion.div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative mt-12 lg:mt-0"
                    >
                        <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4 sm:p-8 animate-float">
                            <img
                                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800"
                                alt="Financial Growth"
                                className="w-full h-full object-cover rounded-xl shadow-2xl"
                            />
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="absolute bottom-4 left-4 sm:-bottom-6 sm:-left-6 bg-base-100/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-5 border border-primary/20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                                    <HiUsers className="text-white text-2xl sm:text-3xl" />
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">5,000+</p>
                                    <p className="text-xs sm:text-sm text-base-content/60 font-medium">Happy Customers</p>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.7, type: "spring" }}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="absolute top-4 right-4 sm:-top-6 sm:-right-6 bg-base-100/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-accent/20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <HiStar className="text-white text-xl sm:text-2xl" />
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl font-bold text-accent">4.9/5</p>
                                    <p className="text-[10px] sm:text-xs text-base-content/60 font-medium">Rating</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
