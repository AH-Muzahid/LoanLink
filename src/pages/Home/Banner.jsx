import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

import img1 from '../../assets/imgi_57_personal-loan-2021-01-19-6006ad2e395df.jpg'
import img2 from '../../assets/imgi_58_personal-loan-2021-01-19-6006d02d87f79.jpg'
import img3 from '../../assets/imgi_59_personal-loan-2021-01-19-6006d03f86010.jpg'

const Banner = () => {
    return (
        <div className='relative mb-8 md:mb-16'>


            <div
                className="bg-linear-to-r from-[#cf2829] via-[#d62e2f] to-[#B21F1F] min-h-[350px] md:min-h-[500px] w-full pt-24 md:pt-30 pb-10"
                style={{
                    clipPath: "ellipse(100% 100% at 50% 0%)"
                }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-5xl text-white font-bold text-center md:text-left">
                            Welcome to LoanLinks
                        </h1>
                        <p className="mt-2  text-sm md:text-lg text-center md:text-left text-white max-w-2xl  px-2">
                            Your trusted partner for seamless loan management and financial solutions.
                        </p>
                    </div>
                    <div className="-mt-3 md:mt-0 flex gap-4">
                        <Link to="/dashboard/apply-loan">
                            <button className="mt-4 md:mt-8 bg-[#cf7171] text-white text-sm md:text-lg font-medium py-2 px-4 rounded-full hover:bg-[#B21F1F] transition-all">Apply Now</button>
                        </Link>
                        <a href="#emi-calculator">
                            <button className="mt-4 md:mt-8 bg-[#cf7171] text-white text-sm md:text-lg font-medium py-2 px-4 rounded-full hover:bg-[#B21F1F] transition-all" >EMI Calculator</button>
                        </a>
                    </div>
                </div>
            </div>


            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-25 md:-mt-67">
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
                            <img src={img1} alt="Loan Banner 1" className="w-full h-full object-cover" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="w-full h-full overflow-hidden rounded-xl">
                            <img src={img2} alt="Loan Banner 2" className="w-full h-full object-cover" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="w-full h-full overflow-hidden rounded-xl">
                            <img src={img3} alt="Loan Banner 3" className="w-full h-full object-cover" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

        </div>
    );
};

export default Banner;
