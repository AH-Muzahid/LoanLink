import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import axios from 'axios';
import LoanCard from '../../Componets/LoanCard/LoanCard';

const AvailableLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/all-loans?limit=6&sort=desc')
          .then(res => {
                setLoans(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
        },[]);

        if (loading) return <LoadingSpinner />;
    return (
        <div className=" max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-3 ">Available Loans for You</h1>
            <p className='text-md text-center mb-4 md:mb-10'>Browse through our comprehensive collection of loan options tailored for your needs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loans.map((loan, index) => (
                    <LoanCard loan={loan} key={index} />
                ))}
            </div>
        </div>
    );
};

export default AvailableLoans;
