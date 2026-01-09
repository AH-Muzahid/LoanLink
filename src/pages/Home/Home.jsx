import { useEffect } from 'react';
import Banner from './Banner';
import AvailableLoans from './AvailableLoans';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import Statistics from './Statistics';
import Feedback from './Feedback';
import EmiCalculator from './EmiCalculator';

const Home = () => {
    useEffect(() => {
        document.title = 'Home - LoanLink | Your Trusted Loan Partner';
    }, []);

    return (
        <div className="bg-dot-pattern min-h-screen">
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
