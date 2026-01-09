import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import axios from 'axios';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import LoanCard from '../../Componets/LoanCard/LoanCard';
import Container from '../../Componets/Shared/Container';
import SectionTitle from '../../Componets/Shared/SectionTitle';
import Reveal from '../../Componets/Shared/Reveal';

const AvailableLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/all-loans?limit=6&sort=desc`)
            .then(res => {
                setLoans(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <LoadingSpinner />;
    return (
        <Container className="py-16 md:py-24">
            <Reveal>
                <SectionTitle
                    heading="Available Loans for You"
                    subHeading="Loan Options"
                />
            </Reveal>
            <Reveal delay={0.1}>
                <p className='text-md text-center max-w-2xl mx-auto mb-10 md:mb-16 -mt-10 text-base-content/60'>Browse through our comprehensive collection of loan options tailored for your needs</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loans.map((loan, index) => (
                    <Reveal key={index} delay={index * 0.1}>
                        <LoanCard loan={loan} />
                    </Reveal>
                ))}
            </div>
            <Reveal delay={0.2} className="flex justify-center mt-12">
                <Link to="/all-loans">
                    <button className="btn bg-[#B91116] hover:bg-[#900d11] text-white gap-2 px-8 rounded-full shadow-lg shadow-[#B91116]/20">
                        View All Loans <HiArrowRight />
                    </button>
                </Link>
            </Reveal>
        </Container>
    );
};

export default AvailableLoans;
