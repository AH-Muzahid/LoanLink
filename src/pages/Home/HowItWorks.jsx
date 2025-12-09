import { motion } from 'framer-motion';
import { FaUserPlus, FaFileAlt, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        { icon: <FaUserPlus />, title: 'Register', desc: 'Create your account in minutes' },
        { icon: <FaFileAlt />, title: 'Apply', desc: 'Fill out the loan application form' },
        { icon: <FaCheckCircle />, title: 'Get Approved', desc: 'Quick verification and approval' },
        { icon: <FaMoneyBillWave />, title: 'Receive Funds', desc: 'Money transferred to your account' }
    ];

    return (
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-base-200">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">How It Works</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-base-content/60 max-w-2xl mx-auto">Get your loan in 4 simple steps</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="bg-base-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-base-300 hover:border-primary/50 hover:shadow-lg transition-all">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center text-primary text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                                    {index + 1}
                                </div>
                                <div className="text-3xl sm:text-4xl text-primary mb-3 sm:mb-4">{step.icon}</div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-sm sm:text-base text-base-content/60">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;