import { motion } from 'framer-motion';
import { FaBolt, FaShieldAlt, FaHandshake, FaChartLine } from 'react-icons/fa';

const WhyChooseUs = () => {
    const features = [
        { icon: <FaBolt />, title: 'Fast Approval', desc: 'Get approved within 24 hours' },
        { icon: <FaShieldAlt />, title: 'Secure & Safe', desc: 'Your data is fully protected' },
        { icon: <FaHandshake />, title: 'Transparent Process', desc: 'No hidden fees or charges' },
        { icon: <FaChartLine />, title: 'Flexible Terms', desc: 'Customized repayment plans' }
    ];

    return (
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Why Choose Us</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-base-content/60 max-w-2xl mx-auto">Built for speed, security, and simplicity</p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                                <div className="text-2xl sm:text-3xl text-primary">{feature.icon}</div>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{feature.title}</h3>
                            <p className="text-base-content/60 text-xs sm:text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
