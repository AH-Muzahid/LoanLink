import Banner from './Banner';
import AvailableLoans from './AvailableLoans';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import Statistics from './Statistics';
import Feedback from './Feedback';
import EmiCalculator from './EmiCalculator';
import SEO from '../../Componets/Shared/SEO';

const Home = () => {
    return (
        <div className="bg-dot-pattern min-h-screen">
            <SEO
                title="Home | Advanced Loan Management System"
                description="LoanLinks is a portfolio project by AH Muzahid. A comprehensive Loan Management System featuring secure authentication, role-based dashboards, and AI integration."
                keywords="AH Muzahid, MUzahid, Ali Hasan Muzahid, LoanLinks, Muzahid Project, Web Developer Portfolio, MERN Stack Project, Loan Management System, React Developer, LoanLinks, Fintech App"
            />
            <Banner />
            <Statistics />
            <AvailableLoans />
            <WhyChooseUs />
            <HowItWorks />
            <EmiCalculator />
            <Feedback />
        </div>
    );
};

export default Home;
