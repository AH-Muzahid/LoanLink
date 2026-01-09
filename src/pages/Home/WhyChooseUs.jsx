import React from 'react';
import { FaUniversity, FaAward, FaCalendarAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import down from '../../assets/downwad.png'
import Container from '../../Componets/Shared/Container';
import SectionTitle from '../../Componets/Shared/SectionTitle';
import Reveal from '../../Componets/Shared/Reveal';

const WhyChooseUs = () => {


    const features = [
        {
            id: 1,
            icon: <FaUniversity className="text-5xl mb-4" />,
            title: "LARGEST NON-BANKING FINANCIAL INSTITUTION",
            description: "40 branches across the country serving your every need"
        },
        {
            id: 2,
            icon: <FaAward className="text-5xl mb-4" />,
            title: "AAA CREDIT-RATING",
            description: "Certified AAA long-term credit rating based on audited financials since 2012"
        },
        {
            id: 3,
            icon: <FaCalendarAlt className="text-5xl mb-4" />,
            title: "40 YEARS OF LEGACY",
            description: "Individual to institutional and capital market services to suit your every need"
        },
        {
            id: 4,
            icon: <FaFileInvoiceDollar className="text-5xl mb-4" />,
            title: "WIDE RANGE OF FINANCIAL PRODUCTS",
            description: "One of the oldest and most prestigious financial institutions of the country"
        }
    ];

    return (
        <div className="relative py-8 md:py-12   bg-[#B21F1F] text-white overflow-hidden">
            <div className='-mt-12
            
            '>
                <img src={down} alt="" />
            </div>



            <Container className="relative z-10">
                {/* --- Title --- */}
                <Reveal>
                    <SectionTitle
                        style={{ paddingTop: '5rem' }}
                        heading={<span className="text-white ">Why Choose LoanLink?</span>}
                        align="center"
                    />
                </Reveal>

                {/* --- Grid Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Reveal key={feature.id} delay={index * 0.1}>
                            <div
                                className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-lg p-8 flex flex-col items-center text-center border border-white/10 shadow-lg h-full"
                            >
                                {/* Icon */}
                                <div className="text-white opacity-90">
                                    {feature.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold uppercase mt-4  leading-tight min-h-[50px] flex items-center justify-center">
                                    {feature.title}
                                </h3>

                                {/* Divider Line */}
                                <div className="w-full h-1 bg-white/50 rounded my-3"></div>

                                {/* Description */}
                                <p className="text-sm text-gray-100 font-light leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Container>


            {/* --- Bottom Curve) --- */}
            <div className='mt-12 -mb-13 rotate-180'>
                <img src={down} alt="" />
            </div>
        </div >
    );
};

export default WhyChooseUs;