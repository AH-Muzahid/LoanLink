import Modal from '../../Modal/Modal';
import { FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { calculateAmortizationSchedule, formatCurrency } from '../../../utils/loanUtils';

const RepaymentScheduleModal = ({ loan, onClose, isOpen }) => {
    if (!loan) return null;

    // Default values if not present in loan object
    const principal = loan.amount || 0;
    const rate = loan.interestRate || 0;
    const durationYears = loan.durationYears || 1; // Default to 1 year if not specified
    const startDate = new Date(loan.createdAt || Date.now());

    // Calculate Schedule
    const schedule = calculateAmortizationSchedule(principal, rate, durationYears);

    // Calculate dates
    const scheduleWithDates = schedule.map((item) => {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + item.month);
        return {
            ...item,
            date: date.toLocaleDateString(),
            dateObj: date // Keep object for comparison
        };
    });

    // Check for alerts (next upcoming payment)
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const nextPayment = scheduleWithDates.find(item => item.dateObj > today);
    const isDueSoon = nextPayment && nextPayment.dateObj <= threeDaysFromNow;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <span className="flex items-center gap-2">
                    <FaCalendarAlt /> Repayment Schedule
                </span>
            }
            maxWidth="max-w-4xl"
        >
            <div className="p-6">
                {/* Alert Section */}
                {isDueSoon && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <FaExclamationTriangle className="text-amber-500 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-800">Payment Due Soon!</h4>
                            <p className="text-sm text-amber-700">
                                Your next installment of <span className="font-bold">{formatCurrency(nextPayment.emi)}</span> is due on {nextPayment.date}.
                            </p>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold uppercase">Total Loan</p>
                        <p className="text-lg font-bold text-gray-800">{formatCurrency(principal)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold uppercase">Interest Rate</p>
                        <p className="text-lg font-bold text-[#B91116]">{rate}% / Year</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold uppercase">Duration</p>
                        <p className="text-lg font-bold text-gray-800">{durationYears} Years</p>
                    </div>
                </div>

                {/* Schedule Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th>#</th>
                                <th>Due Date</th>
                                <th className="text-right">Principal</th>
                                <th className="text-right">Interest</th>
                                <th className="text-right">Installment</th>
                                <th className="text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleWithDates.map((row) => (
                                <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                                    <td className="font-mono text-xs">{row.month}</td>
                                    <td className="text-sm font-medium">{row.date}</td>
                                    <td className="text-right text-sm text-gray-500">{formatCurrency(row.principalPayment)}</td>
                                    <td className="text-right text-sm text-gray-500">{formatCurrency(row.interestPayment)}</td>
                                    <td className="text-right font-bold text-gray-800">{formatCurrency(row.emi)}</td>
                                    <td className="text-right text-sm text-gray-500">{formatCurrency(row.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RepaymentScheduleModal;
