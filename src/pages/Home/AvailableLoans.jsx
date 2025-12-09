import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import axios from 'axios';

const AvailableLoans = () => {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/loans?limit=6')
            .then(res => setLoans(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl"></div>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Available Loan Options</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-base-content/60 max-w-2xl mx-auto">Choose the perfect loan that fits your needs</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {loans.map((loan, index) => (
                        <motion.div
                            key={loan._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
                                <div className="relative h-40 sm:h-48 overflow-hidden">
                                    <img 
                                        src={loan.image} 
                                        alt={loan.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-3 right-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                                        ${loan.maxAmount}
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-bold mb-2">{loan.title}</h3>
                                    <p className="text-sm sm:text-base text-base-content/60 mb-4 line-clamp-2">{loan.description}</p>
                                    <Link 
                                        to={`/loan/${loan._id}`} 
                                        className="inline-flex items-center gap-2 text-sm sm:text-base text-indigo-600 font-semibold hover:gap-3 transition-all">
                                    >
                                        Learn more <HiArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link to="/all-loans" className="btn btn-md sm:btn-lg gap-2 group bg-linear-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-xl shadow-indigo-500/50">
                        View All Loans
                        <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default AvailableLoans;
