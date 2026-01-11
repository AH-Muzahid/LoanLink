import { motion } from 'framer-motion';
import { FaEye, FaCheckDouble } from 'react-icons/fa';
import { getStatusColor, getStatusIcon } from './utils.jsx';

const ApplicationCard = ({
    applications = [],
    showStatus = true,
    renderActions,
    onView
}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:hidden space-y-4"
        >
            {applications.map((app) => (
                <motion.div
                    key={app._id}
                    variants={itemVariants}
                    className={`bg-base-100 p-5 rounded-2xl shadow-lg border border-base-200 
                        ${app.feeStatus === 'paid' ? 'bg-green-50/40 border-green-200' : ''}`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                    {app.photoURL ? (
                                        <img src={app.photoURL} alt={app.userName} />
                                    ) : (
                                        <span>{app.userName?.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold">{app.userName}</h3>
                                <p className="text-xs text-base-content/50">{app.category}</p>
                            </div>
                        </div>
                        {showStatus && (
                            <div className={`badge gap-1 font-medium border-none ${getStatusColor(app.status, app.feeStatus)}`}>
                                {getStatusIcon(app.status, app.feeStatus)}
                                <span className="capitalize text-xs">{app.feeStatus === 'paid' ? 'Paid' : app.status}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="bg-base-200/50 p-3 rounded-xl">
                            <p className="text-xs text-base-content/50 mb-1">Amount</p>
                            <p className="font-bold text-[#B91116]">৳{app.amount?.toLocaleString()}</p>
                        </div>
                        <div className="bg-base-200/50 p-3 rounded-xl">
                            <p className="text-xs text-base-content/50 mb-1">Date</p>
                            <p className="font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <div className="flex-1 flex gap-2">
                            {renderActions && renderActions(app)}
                        </div>

                        {onView && (
                            <button
                                onClick={() => onView(app)}
                                className="btn btn-sm btn-ghost border border-base-300"
                            >
                                <FaEye />
                            </button>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ApplicationCard;
