import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export const getStatusColor = (status, feeStatus) => {
    if (feeStatus === 'paid') return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
    switch (status) {
        case 'approved': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
        case 'rejected': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
        default: return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    }
};

export const getStatusIcon = (status, feeStatus) => {
    if (feeStatus === 'paid') return <FaCheckCircle />;
    switch (status) {
        case 'approved': return <FaCheckCircle />;
        case 'rejected': return <FaTimesCircle />;
        default: return <FaClock />;
    }
};
