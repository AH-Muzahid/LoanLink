import { motion } from 'framer-motion';

const Statistics = () => {
    const stats = [
        { value: '5000+', label: 'Happy Customers' },
        { value: '$10M+', label: 'Million Disbursed' },
        { value: '98%', label: 'Approval Rate' },
        { value: '24hrs', label: 'Fast Approval' }
    ];

    return (
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-[#cf2829] via-[#d62e2f] to-[#B21F1F] text-white relative overflow-hidden">
            
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                            <p className="text-sm sm:text-base text-white/80">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
