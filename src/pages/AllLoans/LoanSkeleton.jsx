import React from 'react';

const LoanSkeleton = () => {
    return (
        <div className="card bg-base-100 shadow-xl animate-pulse rounded-2xl overflow-hidden border border-base-200">
            {/* Image Skeleton */}
            <div className="h-48 bg-base-300"></div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <div className="h-6 bg-base-300 rounded w-3/4"></div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-base-300 rounded w-full"></div>
                    <div className="h-4 bg-base-300 rounded w-5/6"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-base-300 rounded-lg"></div>
                    <div className="h-16 bg-base-300 rounded-lg"></div>
                </div>

                {/* Button */}
                <div className="h-12 bg-base-300 rounded-lg w-full mt-4"></div>
            </div>
        </div>
    );
};

export default LoanSkeleton;
