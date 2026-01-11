import Modal from '../../Modal/Modal';
import { FaInfoCircle } from 'react-icons/fa';
import StatusTimeline from '../../Shared/StatusTimeline';
import { getStatusBadge } from '../Shared/utils';

const LoanDetailsModal = ({ loan, onClose }) => {
    if (!loan) return null;

    return (
        <Modal
            isOpen={!!loan}
            onClose={onClose}
            title={
                <span className="flex items-center gap-2">
                    <FaInfoCircle /> Application Details
                </span>
            }
        >
            <div>
                {/* Status Timeline */}
                <div className="px-6 pt-4">
                    <StatusTimeline status={loan.status} feeStatus={loan.feeStatus} />
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Loan Title</p>
                            <p className="font-semibold text-base-content text-lg">{loan.loanTitle}</p>
                        </div>
                        <div>
                            <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Amount</p>
                            <p className="font-semibold text-[#B91116] text-lg">৳{loan.amount?.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Category</p>
                            <span className="badge badge-ghost mt-1">{loan.category}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Status</p>
                            <div className="mt-1">{getStatusBadge(loan.status)}</div>
                        </div>
                        <div>
                            <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Applied On</p>
                            <p className="font-medium text-base-content/80">{new Date(loan.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Fee Status</p>
                            <p className={`font-bold ${loan.feeStatus === 'paid' ? 'text-success' : 'text-error'}`}>
                                {loan.feeStatus === 'paid' ? 'Paid' : 'Unpaid'}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 bg-base-200 p-4 rounded-xl">
                        <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider mb-2">Purpose</p>
                        <p className="text-base-content italic">"{loan.purpose}"</p>
                    </div>
                </div>
                <div className="p-4 bg-base-200/50 border-t border-base-200 flex justify-end gap-2">
                    <button onClick={onClose} className="btn btn-ghost text-base-content/70 hover:bg-base-200">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default LoanDetailsModal;
