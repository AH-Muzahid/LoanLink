import { motion } from 'framer-motion';
import { FaFilter, FaEye } from 'react-icons/fa';
import { getStatusColor, getStatusIcon } from './utils.jsx';

const ApplicationTable = ({
    applications = [],
    showStatus = true,
    renderActions,
    onView,
    selectedIds = [],
    onSelect,
    onSelectAll
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
            className="hidden md:block bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-base-200/50 text-base-content/70">
                        <tr>
                            {onSelectAll && (
                                <th className="w-12 pl-6">
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-error"
                                            onChange={onSelectAll}
                                            checked={applications.length > 0 && selectedIds?.length === applications.filter(a => a.feeStatus !== 'paid').length}
                                        />
                                    </label>
                                </th>
                            )}
                            <th className={!onSelectAll ? "py-4 pl-6" : "py-4"}>Applicant</th>
                            <th>Loan Details</th>
                            <th>Amount</th>
                            <th>Date</th>
                            {showStatus && <th>Status</th>}
                            <th className="pr-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <motion.tr
                                key={app._id}
                                variants={itemVariants}
                                className={`hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none 
                                    ${app.feeStatus === 'paid' ? 'bg-green-50/30' : ''}
                                    ${selectedIds?.includes(app._id) ? 'bg-red-50/50' : ''}`}
                            >
                                {onSelect && (
                                    <td className="pl-6">
                                        <label>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm checkbox-error"
                                                checked={selectedIds?.includes(app._id) || false}
                                                onChange={() => onSelect(app._id)}
                                                disabled={app.feeStatus === 'paid'}
                                            />
                                        </label>
                                    </td>
                                )}
                                <td className={!onSelect ? "pl-6 py-4" : "py-4"}>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                {app.photoURL ? (
                                                    <img src={app.photoURL} alt={app.userName} />
                                                ) : (
                                                    <span className="text-xs">{app.userName?.charAt(0)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{app.userName}</div>
                                            <div className="text-xs text-base-content/50">{app.userEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-medium">{app.category}</div>
                                    <div className="text-xs text-base-content/50 font-mono">
                                        #{app.loanId || app._id?.slice(-6).toUpperCase()}
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold text-[#B91116]">৳{app.amount?.toLocaleString()}</div>
                                </td>
                                <td className="text-sm text-base-content/70">
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                                {showStatus && (
                                    <td>
                                        <div className={`badge gap-2 font-medium border-none py-3 px-4 ${getStatusColor(app.status, app.feeStatus)}`}>
                                            {getStatusIcon(app.status, app.feeStatus)}
                                            <span className="capitalize">{app.feeStatus === 'paid' ? 'Paid' : app.status}</span>
                                        </div>
                                    </td>
                                )}
                                <td className="pr-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {renderActions && renderActions(app)}
                                        {onView && (
                                            <button
                                                onClick={() => onView(app)}
                                                className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-[#B91116] hover:bg-red-50"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {applications.length === 0 && (
                <div className="p-12 text-center text-base-content/50">
                    <FaFilter className="mx-auto text-4xl mb-3 opacity-20" />
                    <p>No applications found.</p>
                </div>
            )}
        </motion.div>
    );
};

export default ApplicationTable;
