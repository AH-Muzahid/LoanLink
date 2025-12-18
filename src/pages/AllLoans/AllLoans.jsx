import { Link } from 'react-router-dom';
import { HiArrowRight, HiStar } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import LoanCard from '../../Componets/LoanCard/LoanCard';
import LoanSkeleton from './LoanSkeleton';

import img4 from '../../assets/imgi_57_home-loan-2021-01-19-6006ae651fe5c.jpg'
import img5 from '../../assets/imgi_58_home-loan-2021-01-19-6006ae7bd1c58.jpg'
import img6 from '../../assets/imgi_57_car-loan-2021-01-21-60096723c3137.jpg'

const AllLoans = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const loansPerPage = 12;

    useEffect(() => {
        document.title = 'All Loans - LoanLink';
    }, []);

    const { data: loans = [], isLoading, isError } = useQuery({
        queryKey: ['loans'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:5000/all-loans');
            return data;
        }
    });

    const totalPages = Math.ceil(loans.length / loansPerPage);
    const startIndex = (currentPage - 1) * loansPerPage;
    const currentLoans = loans.slice(startIndex, startIndex + loansPerPage);

    if (isLoading) {
        return (
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-base-100">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <LoanSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">Failed to load loans</p>
            </div>
        );
    }

    return (
        <section className=" mb-8 md:mb-12 relative overflow-hidden">
            <div className='relative mb-8 md:mb-16'>
                <div
                    className=" bg-linear-to-r from-[#cf2829] via-[#d62e2f] to-[#B21F1F] h-[250px] md:h-[400px]  w-full pt-5 md:pt-10"
                    style={{
                        clipPath: "ellipse(100% 100% at 50% 0%)"
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
                            All Available Loans
                        </h1>
                        <p className="text-lg text-white max-w-2xl mx-auto">
                            Browse through our comprehensive collection of loan options tailored for your needs
                        </p>
                    </motion.div>

                </div>
                <div className="max-w-7xl mx-auto px-4 ">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 absolte z-10 -mt-30 md:-mt-60">
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={16}
                            slidesPerView={1}
                            autoplay={{ delay: 4000 }}
                            pagination={{ clickable: true }}
                            loop={true}
                            className="rounded-xl shadow-2xl h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
                        >
                            <SwiperSlide>
                                <div className="w-full h-full overflow-hidden rounded-xl">
                                    <img src={img4} alt="Loan Banner 1" className="w-full h-full object-cover" />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-full h-full overflow-hidden rounded-xl">
                                    <img src={img5} alt="Loan Banner 2" className="w-full h-full object-cover" />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-full h-full overflow-hidden rounded-xl">
                                    <img src={img6} alt="Loan Banner 3" className="w-full h-full object-cover" />
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className=' mb-4 md:mb-6 '>
                    <h1 className='text-2xl text-[#B21F1F] md:text-3xl font-extrabold'>
                        Available Loan ( {loans.length} )
                    </h1>
                </div>
                {/* Loans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentLoans.map((loan, index) => (
                        <motion.div
                            key={loan._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <LoanCard loan={loan} />
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {loans.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-idlc-text/60">No loans available at the moment</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="btn btn-sm bg-[#b61e1e] text-white hover:bg-[#cf2829] disabled:bg-gray-300"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`btn btn-sm ${currentPage === i + 1
                                    ? 'bg-[#B21F1E] text-white'
                                    : 'bg-white text-[#B21F1E] hover:bg-[#b61e1e] hover:text-white'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="btn btn-sm bg-[#b61e1e] text-white hover:bg-[#cf2829] disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllLoans;
