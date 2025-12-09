import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaStar } from 'react-icons/fa';

const Feedback = () => {
    const testimonials = [
        { name: 'John Doe', role: 'Small Business Owner', feedback: 'LoanLink helped me get funding quickly for my business expansion. Highly recommended!', rating: 5, img: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Sarah Khan', role: 'Entrepreneur', feedback: 'The process was smooth and transparent. Got my loan approved within 24 hours!', rating: 5, img: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Mike Johnson', role: 'Freelancer', feedback: 'Best microloan service I have used. Simple application and fast approval.', rating: 4, img: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Ayesha Rahman', role: 'Shop Owner', feedback: 'Great customer support and flexible repayment options. Thank you LoanLink!', rating: 5, img: 'https://i.pravatar.cc/150?img=9' }
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
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">What Our Clients Say</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-base-content/60 max-w-2xl mx-auto">Trusted by thousands of satisfied customers</p>
                </motion.div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={16}
                    slidesPerView={1}
                    autoplay={{ delay: 4000 }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 }
                    }}
                    className="pb-10 sm:pb-12"
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-base-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-base-300 h-full">
                                <div className="flex gap-1 text-yellow-500 mb-3 sm:mb-4 text-sm sm:text-base">
                                    {[...Array(item.rating)].map((_, i) => <FaStar key={i} />)}
                                </div>
                                <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6">"{item.feedback}"</p>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <img src={item.img} alt={item.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                                    <div>
                                        <h4 className="text-sm sm:text-base font-semibold">{item.name}</h4>
                                        <p className="text-xs sm:text-sm text-base-content/60">{item.role}</p>
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
