import Modal from '../../Modal/Modal';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const PaymentReceiptModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <Modal
            isOpen={!!transaction}
            onClose={onClose}
            title={
                <span className="flex items-center gap-2">
                    <FaFileInvoiceDollar /> Payment Receipt
                </span>
            }
            maxWidth="max-w-md"
        >
            <>
                <div className="space-y-4 bg-base-200/50 p-6 m-6 rounded-xl border border-base-200">
                    <div className="flex justify-between border-b border-base-300 pb-2">
                        <span className="text-base-content/60">Loan ID</span>
                        <span className="font-mono text-xs text-base-content">{transaction._id}</span>
                    </div>
                    <div className="flex justify-between border-b border-base-300 pb-2">
                        <span className="text-base-content/60">Loan Title</span>
                        <span className="font-semibold text-base-content">{transaction.loanTitle}</span>
                    </div>
                    <div className="flex justify-between border-b border-base-300 pb-2">
                        <span className="text-base-content/60 mr-10">Transaction ID</span>
                        <span className="font-mono text-success font-bold text-sm break-all">{transaction.transactionId}</span>
                    </div>
                    <div className="flex justify-between border-b border-base-300 pb-2">
                        <span className="text-base-content/60">Amount Paid</span>
                        <span className="font-bold text-base-content">$10.00</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-base-content/60">Payer Email</span>
                        <span className="text-sm text-base-content/80">{transaction.userEmail}</span>
                    </div>
                </div>

                <div className="p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="btn bg-neutral text-neutral-content hover:bg-neutral-focus border-none w-full"
                    >
                        Close Receipt
                    </button>
                </div>
            </>
        </Modal>
    );
};

export default PaymentReceiptModal;
