import { motion } from 'framer-motion';
import { FaUserPlus, FaFileAlt, FaCheckCircle, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaUserPlus />,
            title: 'Register Account',
            desc: 'Create your secure account in less than 2 minutes with basic details.'
        },
        {
            icon: <FaFileAlt />,
            title: 'Apply for Loan',
            desc: 'Choose your loan type and fill out the simple application form.'
        },
        {
            icon: <FaCheckCircle />,
            title: 'Get Approved',
            desc: 'Our system verifies your details quickly for instant approval status.'
        },
        {
            icon: <FaMoneyBillWave />,
            title: 'Receive Funds',
            desc: 'Once approved, funds are transferred directly to your bank account.'
        }
    ];

    return (
        <section className="py-20 lg:py-28 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#B91116]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#B91116]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-[#B91116] font-bold tracking-wider uppercase text-sm mb-2 block">Simple Process</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        How It <span className="bg-gradient-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent">Works</span>
                    </h2>
                    <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
                        Get your loan approved and funded in 4 simple steps. We've streamlined the process to be fast, transparent, and hassle-free.
                    </p>
                </motion.div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-base-300 via-[#B91116]/30 to-base-300 -z-10"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="relative group"
                        >
                            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-lg hover:shadow-2xl hover:shadow-[#B91116]/10 transition-all duration-300 h-full text-center relative z-10">
                                {/* Step Number Badge */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#B91116] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-base-100">
                                    {index + 1}
                                </div>

                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#B91116]/5 to-[#B91116]/10 rounded-2xl flex items-center justify-center text-[#B91116] text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#B91116] transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-base-content/60 leading-relaxed">
                                    {step.desc}
                                </p>

                                {/* Mobile Arrow (except last item) */}
                                {index < steps.length - 1 && (
                                    <div className="lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 text-base-content/20 text-2xl">
                                        <FaArrowRight className="rotate-90" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;