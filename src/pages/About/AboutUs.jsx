import React from 'react';
import { FaHandshake, FaLightbulb, FaUsers, FaAward, FaCheckCircle } from 'react-icons/fa';
import Reveal from '../../Componets/Shared/Reveal';

const AboutUs = () => {
    const stats = [
        { label: 'Years Experience', value: '10+' },
        { label: 'Happy Clients', value: '50k+' },
        { label: 'Loan Approved', value: '$100M+' },
        { label: 'Team Members', value: '200+' },
    ];

    const values = [
        {
            icon: <FaHandshake />,
            title: "Trust & Integrity",
            desc: "We build relationships based on transparency, honesty, and mutual respect."
        },
        {
            icon: <FaLightbulb />,
            title: "Innovation",
            desc: "Constantly evolving our technology to provide the fastest and easiest loan solutions."
        },
        {
            icon: <FaUsers />,
            title: "Customer First",
            desc: "Your financial well-being is our top priority. We are here to support your growth."
        },
        {
            icon: <FaAward />,
            title: "Excellence",
            desc: "Striving for the highest standards in service delivery and financial products."
        }
    ];

    return (
        <div className="min-h-screen max-w-8xl mx-auto bg-base-100">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-base-200/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-[#B91116]/5 to-transparent -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B91116]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 -z-10"></div>

                <div className="container mx-auto px-4 text-center">
                    <Reveal>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Empowering Your <span className="text-[#B91116]">Financial Future</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
                            At LoanLink, we believe that access to capital should be simple, transparent, and fast.
                            We are bridging the gap between dreams and reality with modern financial solutions.
                        </p>
                    </Reveal>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 bg-[#B91116] max-w-8xl mx-auto text-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <Reveal key={index} delay={index * 0.1}>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-white/80 font-medium">{stat.label}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="py-20 container max-w-6xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="lg:w-1/2">
                        <Reveal>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
                                    alt="Our Team"
                                    className="rounded-2xl shadow-2xl w-full object-cover h-[400px] lg:h-[500px]"
                                />
                                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                                            <FaCheckCircle className="text-2xl" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-gray-900">Certified</div>
                                            <div className="text-sm text-gray-500">Financial Institution</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    <div className="lg:w-1/2">
                        <Reveal delay={0.2}>
                            <span className="text-[#B91116] font-bold tracking-wider uppercase text-sm mb-2 block">Our Story</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Building a Better Financial Ecosystem</h2>
                            <p className="text-base-content/70 mb-6 leading-relaxed">
                                Founded in 2015, LoanLink started with a simple mission: to make loans accessible to everyone, regardless of their background. We saw the frustration people faced with traditional banks—endless paperwork, hidden fees, and long waiting times.
                            </p>
                            <p className="text-base-content/70 mb-8 leading-relaxed">
                                Today, we are proud to have helped thousands of individuals and small businesses achieve their goals. Our technology-driven approach ensures that you get the best rates and the fastest approval times in the industry.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Instant Approval', 'Low Interest Rates', 'Secure & Private', '24/7 Support'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <FaCheckCircle className="text-[#B91116]" />
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="py-20 bg-base-200/30">
                <div className="container max-w-6xl mx-auto px-4">
                    <Reveal>
                        <div className="text-center mb-16">
                            <span className="text-[#B91116] font-bold tracking-wider uppercase text-sm mb-2 block">Our Values</span>
                            <h2 className="text-3xl md:text-4xl font-bold">What Drives Us</h2>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((val, index) => (
                            <Reveal key={index} delay={index * 0.1}>
                                <div className="bg-base-100 p-8 rounded-2xl shadow-lg border border-base-200 hover:border-[#B91116]/30 hover:shadow-xl transition-all group h-full">
                                    <div className="w-14 h-14 bg-[#B91116]/10 rounded-xl flex items-center justify-center text-[#B91116] text-2xl mb-6 group-hover:bg-[#B91116] group-hover:text-white transition-colors">
                                        {val.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                                    <p className="text-base-content/70 text-sm leading-relaxed">
                                        {val.desc}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;