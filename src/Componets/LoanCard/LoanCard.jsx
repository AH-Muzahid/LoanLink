import React from 'react';
import { FaArrowRight, FaHandHoldingUsd } from "react-icons/fa";
import { HiStar } from "react-icons/hi";
import { ShieldCheck } from "lucide-react";
import { Link } from 'react-router-dom';

const LoanCard = ({ loan }) => {
    const { _id, title, category, image, interestRate, maxLoanLimit, description } = loan;

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-all z-10"></div>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-800 rounded-full shadow-sm border border-slate-100">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-red-700 transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                        <HiStar className="text-sm" />
                        <span className="text-xs font-bold text-slate-600">4.8</span>
                    </div>
                </div>

                <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10 leading-relaxed">
                    {description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                        <p className="text-xs text-slate-500 font-medium mb-1">Interest</p>
                        <p className="text-lg font-bold text-red-700">{interestRate}%</p>
                    </div>
                    <div className="bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                        <p className="text-xs text-slate-500 font-medium mb-1">Max Limit</p>
                        <p className="text-lg font-bold text-green-700">৳{(maxLoanLimit / 1000).toFixed(0)}K</p>
                    </div>
                </div>

                {/* Footer / Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Secure</span>
                    </div>

                    <Link to={`/loans/${_id}`}>
                        <button className="flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800 transition-colors group/btn">
                            View Details
                            <FaArrowRight className="text-xs transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoanCard;
