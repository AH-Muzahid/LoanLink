import React from 'react';

const SectionTitle = ({ heading, subHeading, align = 'center' }) => {
    return (
        <div className={`mb-10 ${align === 'center' ? 'text-center' : 'text-left'}`}>
            {subHeading && (
                <p className="text-[#cf7171] font-semibold tracking-wider uppercase mb-2 text-sm md:text-base">
                    {subHeading}
                </p>
            )}
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {heading}
            </h2>
            <div className={`mt-4 h-1 w-20 bg-[#cf2829] rounded-full ${align === 'center' ? 'mx-auto' : ''}`}></div>
        </div>
    );
};

export default SectionTitle;
