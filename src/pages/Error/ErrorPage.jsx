import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const ErrorPage = () => {
    useEffect(() => {
        document.title = '404 - Page Not Found | LoanLink';
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <div className="space-y-2">
                    <h2 className="text-4xl font-semibold">Page Not Found</h2>
                    <p className="text-base-content/60">Sorry, we couldn't find the page you're looking for.</p>
                </div>
                <Link 
                    to="/" 
                    className="btn btn-primary btn-lg"
                >
                    <FaHome /> Go to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;