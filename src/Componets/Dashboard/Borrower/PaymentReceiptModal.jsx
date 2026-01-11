import Modal from '../../Modal/Modal';
import { FaFileInvoiceDollar, FaDownload, FaCheckCircle, FaTimes } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const PaymentReceiptModal = ({ transaction, onClose }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!transaction) return null;

    const handleDownloadPDF = () => {
        setIsDownloading(true);

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Themes
            const brandRed = [185, 17, 22];    // #B91116
            const textDark = [31, 41, 55];     // Gray-800
            const textLight = [107, 114, 128]; // Gray-500
            const borderGray = [229, 231, 235]; // Gray-200
            const successGreen = [21, 128, 61]; // Green-700

            // --- 1. Top Decorative Bar ---
            doc.setFillColor(...brandRed);
            doc.rect(0, 0, pageWidth, 4, 'F');

            // --- 2. Header ---
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.setTextColor(...brandRed);
            doc.text('LoanLinks', 20, 25);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textLight);
            doc.text('Payment Receipt', 20, 31);

            // Date (Right Side)
            doc.setFontSize(9);
            doc.text('Date Paid', pageWidth - 20, 25, { align: 'right' });
            doc.setTextColor(...textDark);
            doc.setFont('helvetica', 'bold');
            doc.text(new Date().toLocaleDateString(), pageWidth - 20, 31, { align: 'right' });

            // Line
            doc.setDrawColor(...borderGray);
            doc.line(20, 40, pageWidth - 20, 40);

            // --- 3. Hero Amount Section ---
            const heroY = 60;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...textLight);
            doc.text('Total Amount Paid', pageWidth / 2, heroY, { align: 'center' });

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(32);
            doc.setTextColor(...successGreen);
            doc.text('$10.00', pageWidth / 2, heroY + 15, { align: 'center' });

            // Success Badge (drawn as text/shape combo)
            doc.setFillColor(220, 252, 231); // Light green bg
            doc.roundedRect(pageWidth / 2 - 25, heroY + 22, 50, 8, 4, 4, 'F');
            doc.setFontSize(8);
            doc.setTextColor(...successGreen);
            doc.text('SUCCESSFUL', pageWidth / 2, heroY + 27, { align: 'center' });


            // --- 4. Details Table ---
            let currentY = 110;
            const leftX = 25;
            const rightX = pageWidth - 25;
            const maxValWidth = 90; // Max width for value column in mm

            const drawDetailRow = (label, value) => {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(...textLight);
                doc.text(label, leftX, currentY);

                doc.setFont('helvetica', 'medium');
                doc.setTextColor(...textDark);

                const valueStr = String(value || 'N/A');
                // Split text to wrap if it exceeds width
                const lines = doc.splitTextToSize(valueStr, maxValWidth);

                // Draw each line right-aligned
                const lineHeight = 5;
                lines.forEach((line, i) => {
                    doc.text(line, rightX, currentY + (i * lineHeight), { align: 'right' });
                });

                // Calculate total height of this row (min 1 line)
                const rowHeight = Math.max(lines.length * lineHeight, lineHeight);

                // Dotted Separator positioned below the content
                const lineY = currentY + rowHeight + 3;
                doc.setDrawColor(...borderGray);
                doc.setLineDash([1, 2], 0);
                doc.line(leftX, lineY, rightX, lineY);
                doc.setLineDash([]); // Reset

                // Update Y for next row
                currentY = lineY + 8;
            };

            drawDetailRow('Transaction ID', transaction.transactionId || transaction._id);
            drawDetailRow('Application Reference', transaction._id);
            drawDetailRow('Payment For', transaction.loanTitle);
            drawDetailRow('Payer Email', transaction.userEmail);
            drawDetailRow('Payment Method', transaction.paymentMethod || 'Online Transfer');


            // --- 5. Footer ---
            const footerY = pageHeight - 20;
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175); // Light gray
            doc.text('LoanLinks Inc. | Automated Receipt', pageWidth / 2, footerY, { align: 'center' });
            doc.text('For support contact: support@loanlinks.com', pageWidth / 2, footerY + 5, { align: 'center' });

            // Save
            const safeTitle = transaction.loanTitle.replace(/[^a-z0-9]/gi, '_');
            doc.save(`Receipt_${safeTitle}.pdf`);
            toast.success('Receipt downloaded successfully');

        } catch (error) {
            console.error('PDF Error:', error);
            toast.error('Could not generate receipt');
        } finally {
            setIsDownloading(false);
        }
    };



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
            <div className="p-4">
                {/* Modern Receipt Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative mb-6">
                    {/* Top Decorative Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#B91116]"></div>

                    <div className="p-6 md:p-8 pt-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-xl font-bold text-[#B91116] flex items-center gap-2">
                                    LoanLinks
                                </h1>
                                <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wide">
                                    Official Receipt
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 mb-1">Date Paid</p>
                                <p className="text-sm font-semibold text-gray-700">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Hero Amount Section */}
                        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-gray-100 border-dashed mb-8">
                            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Total Amount Paid</span>
                            <span className="text-4xl font-extrabold text-[#15803d] tracking-tight">$10.00</span>

                            <div className="flex items-center gap-1.5 mt-3 px-3 py-1 bg-green-100/50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                                <FaCheckCircle size={10} /> Payment Successful
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-start text-sm group">
                                <span className="text-gray-500 shrink-0 mt-0.5">Transaction ID</span>
                                <span
                                    className="font-mono text-gray-700 font-medium bg-gray-50 px-2 py-0.5 rounded text-xs select-all text-right break-all max-w-[70%]"
                                >
                                    {transaction.transactionId || transaction._id}
                                </span>
                            </div>
                            <div className="border-b border-gray-50"></div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Payment For</span>
                                <span className="text-gray-900 font-semibold text-right">{transaction.loanTitle}</span>
                            </div>
                            <div className="border-b border-gray-50"></div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Payer Email</span>
                                <span className="text-gray-700 text-right truncate max-w-[180px]" title={transaction.userEmail}>
                                    {transaction.userEmail}
                                </span>
                            </div>
                            <div className="border-b border-gray-50"></div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="text-gray-700 text-right">Online Transfer</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50/50 p-4 text-center border-t border-gray-50">
                        <p className="text-[10px] text-gray-400">
                            Reference ID: {transaction._id}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex-1 py-2.5 rounded-lg bg-[#B91116] hover:bg-[#900d11] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-red-100"
                    >
                        {isDownloading ? (
                            <span className="loading loading-spinner loading-xs text-white"></span>
                        ) : (
                            <>
                                <FaDownload size={14} /> Download Receipt
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentReceiptModal;
