import { FaUsers, FaMoneyBillWave, FaCheckCircle, FaClock } from 'react-icons/fa';
import CountUp from 'react-countup';
import Container from '../../Componets/Shared/Container';
import Reveal from '../../Componets/Shared/Reveal';

const Statistics = () => {
    const stats = [
        {
            icon: FaUsers,
            count: 5000,
            suffix: '+',
            label: 'Happy Customers',
            desc: 'Trusted by thousands'
        },
        {
            icon: FaMoneyBillWave,
            count: 10,
            prefix: '$',
            suffix: 'M+',
            label: 'Loans Disbursed',
            desc: 'Helping dreams come true'
        },
        {
            icon: FaCheckCircle,
            count: 98,
            suffix: '%',
            label: 'Approval Rate',
            desc: 'Hassle-free process'
        },
        {
            icon: FaClock,
            count: 24,
            suffix: 'hrs',
            label: 'Fast Approval',
            desc: 'Quick turnaround time'
        }
    ];

    return (
        <section className="py-10 relative overflow-hidden">

            <Container className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Reveal key={index} delay={index * 0.1}>
                            <div className="bg-base-100/80 backdrop-blur-md rounded-2xl p-6 border border-base-200 shadow-sm hover:shadow-xl hover:border-[#B91116]/20 transition-all duration-300 h-full relative z-10 group text-center">
                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-b from-[#B91116]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#B91116]/10 text-[#B91116] mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <stat.icon className="text-2xl" />
                                    </div>

                                    <div className="text-3xl md:text-4xl font-bold text-base-content mb-2 font-['Outfit'] tracking-tight">
                                        <CountUp
                                            end={stat.count}
                                            duration={3}
                                            separator=","
                                            prefix={stat.prefix}
                                            suffix={stat.suffix}
                                            enableScrollSpy
                                            scrollSpyOnce
                                        />
                                    </div>

                                    <h3 className="text-base font-semibold text-base-content/80 mb-1">
                                        {stat.label}
                                    </h3>

                                    <p className="text-xs text-base-content/50">
                                        {stat.desc}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Statistics;
