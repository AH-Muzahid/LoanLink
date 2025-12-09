import { Outlet } from 'react-router';
import Navbar from './../../Componets/Navbar/Navbar';
import Footer from './../../Componets/Footer/Footer';


const Root = () => {

  
    return (
        <div className='max-w-7xl mx-auto'>
            <Navbar />
            <Outlet />
            <Footer />

    
        
        </div>
    );
};

export default Root;