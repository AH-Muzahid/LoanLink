import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const EMICalculator = () => {
    // Initial States
    const [amount, setAmount] = useState(100000);
    const [years, setYears] = useState(1);
    const [rate, setRate] = useState(10);

    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    // Calculation Logic (Formula)
    useEffect(() => {
        const principal = amount;
        const calculateInterest = rate / 12 / 100;
        const calculatePayments = years * 12;

        // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
        const x = Math.pow(1 + calculateInterest, calculatePayments);
        const monthly = (principal * x * calculateInterest) / (x - 1);

        if (isFinite(monthly)) {
            setEmi(monthly.toFixed(0));
            setTotalPayment((monthly * calculatePayments).toFixed(0));
            setTotalInterest(((monthly * calculatePayments) - principal).toFixed(0));
        }
    }, [amount, years, rate]);

    //  Chart Data
    const data = [
        { name: 'Principal', value: parseInt(amount) },
        { name: 'Interest', value: parseInt(totalInterest) },
    ];
    const COLORS = ['#E31E24', '#D1D5DB']; // Red & Gray

    return (
        <div className="container max-w-6xl mx-auto px-4 py-16 md:py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase">
                EMI Calculator
            </h2>

            <div className="flex flex-col lg:flex-row gap-8  p-6 rounded-lg shadow-xl">

                {/*  Left Side: Input Sliders  */}
                <div className="flex-1 space-y-8">
                    {/* Amount Input */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-bold ">Loan Amount (BDT)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border border-red-300 rounded p-1 text-right w-32 font-bold text-[#E31E24]"
                            />
                        </div>
                        <input
                            type="range" min="10000" max="2000000" value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="range range-xs range-error w-full"
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span>10,000 BDT</span>
                            <span>20,00,000 BDT</span>
                        </div>
                    </div>

                    {/* Loan Tenure  Input */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-bold ">Loan Tenure (Year)</label>
                            <input
                                type="number"
                                value={years}
                                onChange={(e) => setYears(e.target.value)}
                                className="border border-gray-300 rounded p-1 text-right w-32 font-bold text-[#E31E24]"
                            />
                        </div>
                        <input
                            type="range" min="1" max="20" value={years}
                            onChange={(e) => setYears(e.target.value)}
                            className="range range-xs range-error w-full"
                        />
                        <div className="flex justify-between text-xs  mt-1">
                            <span>1 Year</span>
                            <span>20 Years</span>
                        </div>
                    </div>

                    {/* Interest Rate Input */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-bold ">Rate of Interest (%)</label>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="border border-gray-300 rounded p-1 text-right w-32 font-bold text-[#E31E24]"
                            />
                        </div>
                        <input
                            type="range" min="1" max="20" step="0.5" value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            className="range range-xs range-error w-full"
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span>1 %</span>
                            <span>20 %</span>
                        </div>
                    </div>
                </div>

                {/* Middle: EMI Result Box  */}
                <div className="w-full lg:w-64 bg-gray-200 rounded-lg flex flex-col justify-center items-center p-6 text-center space-y-4">
                    <h3 className="text-gray-800 font-bold text-lg">Equal Monthly Installment (EMI)</h3>
                    <p className="text-3xl font-bold text-[#E31E24]">{parseInt(emi).toLocaleString()} BDT</p>
                    <a href="">
                        <button className="btn bg-[#E31E24] hover:bg-[#B91116] text-white border-none px-8 rounded">
                            Apply Now
                        </button>
                    </a>
                </div>

                {/*  Right: Breakdown Chart  */}
                <div className="flex-1 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl  mb-4">Break-down of <span className="font-light">Total Payment</span></h3>

                    {/* Donut Chart */}
                    <div className="h-40 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="100%" // Half circle look
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={0}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats Table */}
                    <div className="space-y-3 mt-4 text-sm">
                        <div className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#E31E24]"></div>
                                <span className="">Principal Amount</span>
                            </div>
                            <span className="font-bold text-[#E31E24]">{parseInt(amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-300"></div>
                                <span className="">Interest Amount</span>
                            </div>
                            <span className="font-bold ">{parseInt(totalInterest).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className=" font-bold">Total Payable Amount</span>
                            <span className="font-bold ">{parseInt(totalPayment).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EMICalculator;