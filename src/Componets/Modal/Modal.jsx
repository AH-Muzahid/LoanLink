import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <dialog className="modal modal-open backdrop-blur-sm z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`modal-box ${maxWidth} bg-base-100 rounded-2xl shadow-2xl p-0 overflow-hidden border border-base-200`}
                    >
                        {/* Header */}
                        <div className="bg-[#B91116] p-4 md:p-6 text-white flex justify-between items-center">
                            <h3 className="font-bold text-lg md:text-xl flex items-center gap-2">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20 transition-colors"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[80vh] overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>

                    {/* Backdrop Click to Close */}
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={onClose}>close</button>
                    </form>
                </dialog>
            )}
        </AnimatePresence>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.string,
};

export default Modal;
