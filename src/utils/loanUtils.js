/**
 * Calculates the monthly amortization schedule for a loan.
 * 
 * @param {number} principal - The total loan amount.
 * @param {number} annualRate - The annual interest rate (in percent).
 * @param {number} years - The loan tenure in years.
 * @returns {Array} An array of objects representing the monthly schedule.
 */
export const calculateAmortizationSchedule = (principal, annualRate, years) => {
    const schedule = [];
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;

    // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const x = Math.pow(1 + monthlyRate, totalMonths);
    const emi = (principal * x * monthlyRate) / (x - 1);

    let outstandingBalance = principal;

    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = outstandingBalance * monthlyRate;
        const principalPayment = emi - interestPayment;

        // Adjust final month to handle rounding errors
        let newBalance = outstandingBalance - principalPayment;
        if (month === totalMonths && newBalance !== 0) {
            newBalance = 0;
        }

        schedule.push({
            month,
            emi: emi,
            principalPayment,
            interestPayment,
            balance: newBalance > 0 ? newBalance : 0
        });

        outstandingBalance = newBalance;
    }

    return schedule;
};

/**
 * Formats a number as currency (BDT).
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
