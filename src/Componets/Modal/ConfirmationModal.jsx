import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass = 'btn-error',
    icon: Icon = FaExclamationTriangle
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <dialog className="modal modal-open backdrop-blur-sm z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="modal-box max-w-sm bg-base-100 rounded-2xl shadow-2xl border border-base-200 text-center p-8"
                    >
                        <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <Icon className="text-3xl" />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-base-content">{title}</h3>
                        <p className="text-base-content/60 mb-8">
                            {message}
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={onClose}
                                className="btn btn-ghost text-base-content/70 hover:bg-base-200"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`btn ${confirmButtonClass} text-white border-none shadow-md`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={onClose}>close</button>
                    </form>
                </dialog>
            )}
        </AnimatePresence>
    );
};

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.node.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    confirmButtonClass: PropTypes.string,
    icon: PropTypes.elementType,
};

export default ConfirmationModal;
