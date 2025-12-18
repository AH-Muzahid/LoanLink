import React from 'react';
import { FaArrowRight, FaHandHoldingUsd, FaPercent, FaClock } from "react-icons/fa";
import { HiStar } from "react-icons/hi";
import { Link } from 'react-router-dom';

const LoanCard = ({ loan }) => {
    const { _id, title, category, image, interestRate, maxLoanLimit, description } = loan;

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-base-300 hover:border-[#B91116]/50">

            {/* Image */}
            <figure className="relative h-44 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <span className="badge badge-warning font-bold shadow-lg">
                        {category}
                    </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-base-100/95 px-2 py-1 rounded-full">
                    <HiStar className="text-warning text-sm" />
                    <span className="text-xs font-bold">4.5</span>
                </div>
            </figure>

            {/* Content */}
            <div className="card-body p-5">

                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-[#cf282] transition-colors">{title}</h3>
                <p className="text-sm text-base-content/70 mb-2 h-10 overflow-auto">{description}</p>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-base-200 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">

                            <p className="text-xs text-base-content/60 font-semibold">Interest Rate</p>
                        </div>
                        <p className="text-xl font-bold text-[#cf2829]">{interestRate}%</p>
                    </div>
                    <div className="bg-base-200 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                            <FaHandHoldingUsd className="text-success text-xs" />
                            <p className="text-xs text-base-content/60 font-semibold">Max Loan Limit</p>
                        </div>
                        <p className="text-xl font-bold text-success">৳{(maxLoanLimit / 1000).toFixed(0)}K</p>
                    </div>
                </div>

                {/* Button */}
                <Link to={`/loans/${_id}`}>
                    <button className="btn bg-[#B91116] text-white w-full group/btn">
                        View Details
                        <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default LoanCard;
