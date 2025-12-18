import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaStar, FaQuoteRight } from 'react-icons/fa';

const Feedback = () => {
    const testimonials = [
        {
            name: 'John Doe',
            role: 'Small Business Owner',
            feedback: 'LoanLink helped me get funding quickly for my business expansion. The process was incredibly smooth and the support team was very helpful throughout.',
            rating: 5,
            img: 'https://i.pravatar.cc/150?img=1'
        },
        {
            name: 'Sarah Khan',
            role: 'Entrepreneur',
            feedback: 'The process was smooth and transparent. Got my loan approved within 24 hours! I highly recommend their services to anyone looking for quick financial support.',
            rating: 5,
            img: 'https://i.pravatar.cc/150?img=5'
        },
        {
            name: 'Mike Johnson',
            role: 'Freelancer',
            feedback: 'Best microloan service I have used. Simple application and fast approval process. The interest rates are also very competitive compared to other lenders.',
            rating: 4,
            img: 'https://i.pravatar.cc/150?img=3'
        },
        {
            name: 'Ayesha Rahman',
            role: 'Shop Owner',
            feedback: 'Great customer support and flexible repayment options make LoanLink a top choice. It really helped me stock up my inventory for the festive season.',
            rating: 5,
            img: 'https://i.pravatar.cc/150?img=2'
        },
        {
            name: 'David Wilson',
            role: 'Teacher',
            feedback: 'I needed a personal loan for a medical emergency and LoanLink came through instantly. The minimal documentation required was a lifesaver.',
            rating: 5,
            img: 'https://i.pravatar.cc/150?img=11'
        },
    ];

    return (
        <section className="py-20 lg:py-28 bg-base-200/30 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#B91116]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#B91116]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <span className="text-[#B91116] font-bold tracking-wider uppercase text-sm mb-2 block">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        What Our <span className="bg-gradient-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent">Clients Say</span>
                    </h2>
                    <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
                        Trusted by thousands of satisfied customers who have achieved their financial goals with LoanLink.
                    </p>
                </motion.div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{
                        clickable: true,
                        bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#B91116]'
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 30 },
                        1024: { slidesPerView: 3, spaceBetween: 30 }
                    }}
                    className="pb-16 !px-4"
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={index} className="h-auto">
                            <div className="rounded-3xl p-8 border border-base-200 shadow-lg hover:shadow-xl hover:shadow-[#B91116]/5 transition-all duration-300 h-full flex flex-col relative group mb-8">
                                <div className="absolute top-8 right-8 text-[#B91116]/10 text-5xl group-hover:text-[#B91116]/20 transition-colors">
                                    <FaQuoteRight />
                                </div>

                                <div className="flex gap-1 text-yellow-400 mb-6 text-lg">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < item.rating ? "fill-current" : "text-base-300"} />
                                    ))}
                                </div>

                                <p className="text-base-content/70 mb-8 flex-grow leading-relaxed italic relative z-10">
                                    "{item.feedback}"
                                </p>

                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-base-100">
                                    <div className="avatar">
                                        <div className="w-12 h-12 rounded-full ring ring-[#B91116]/20 ring-offset-2 ring-offset-base-100">
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{item.name}</h4>
                                        <p className="text-sm text-[#B91116] font-medium">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Feedback;
