import Banner from './Banner';
import AvailableLoans from './AvailableLoans';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import Statistics from './Statistics';
import Feedback from './Feedback';

const Home = () => {
    return (
        <div>
            <Banner />
            <AvailableLoans />
            <HowItWorks />
            <WhyChooseUs />
            <Statistics />
            <Feedback />
        </div>
    );
};

export default Home;