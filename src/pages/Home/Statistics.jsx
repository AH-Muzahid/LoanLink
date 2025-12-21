import { motion } from 'framer-motion';
import { FaUsers, FaMoneyBillWave, FaCheckCircle, FaClock } from 'react-icons/fa';

const Statistics = () => {
    const stats = [
        {
            icon: <FaUsers />,
            value: '5000+',
            label: 'Happy Customers',
            desc: 'Trusted by thousands'
        },
        {
            icon: <FaMoneyBillWave />,
            value: '$10M+',
            label: 'Loans Disbursed',
            desc: 'Helping dreams come true'
        },
        {
            icon: <FaCheckCircle />,
            value: '98%',
            label: 'Approval Rate',
            desc: 'Hassle-free process'
        },
        {
            icon: <FaClock />,
            value: '24hrs',
            label: 'Fast Approval',
            desc: 'Quick turnaround time'
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background with linear and Pattern */}
            <div className="absolute inset-0 bg-linear-to-r from-[#B91116] to-[#900d11]">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="text-center group"
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center text-3xl text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                                    {stat.value}
                                </div>
                                <h3 className="text-lg font-bold text-white/90 mb-1">
                                    {stat.label}
                                </h3>
                                <p className="text-sm text-white/70">
                                    {stat.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
