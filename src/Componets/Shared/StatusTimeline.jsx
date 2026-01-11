import { FaClipboardCheck, FaSearchDollar, FaUserCheck, FaCheckCircle, FaHandHoldingUsd, FaTimesCircle } from 'react-icons/fa';

const StatusTimeline = ({ status, feeStatus }) => {
    // Determine current processing stage based on status
    let currentStepIndex = 0;

    // Logic for progress
    // 0: Applied (Always true)
    // 1: Under Review (Always active if created)
    // 2: Documents Verified (Active if decision is made - approved/rejected)
    // 3: Approved/Rejected
    // 4: Disbursed (Active if Approved AND Paid)

    if (status === 'pending') {
        currentStepIndex = 1; // Highlight "Under Review"
    } else if (status === 'approved') {
        currentStepIndex = 3; // Approved means Verified(2) and Approved(3) are done
        if (feeStatus === 'paid') {
            currentStepIndex = 4; // Disbursed
        }
    } else if (status === 'rejected') {
        currentStepIndex = 3; // Stops at decision
    }

    const steps = [
        {
            id: 'applied',
            label: 'Applied',
            icon: FaClipboardCheck,
            description: 'Application received'
        },
        {
            id: 'review',
            label: 'Under Review',
            icon: FaSearchDollar,
            description: 'Analyzing financial data'
        },
        {
            id: 'verification',
            label: 'Verified',
            icon: FaUserCheck,
            description: 'Documents checked'
        },
        {
            id: 'decision',
            label: status === 'rejected' ? 'Rejected' : 'Approved',
            icon: status === 'rejected' ? FaTimesCircle : FaCheckCircle,
            description: status === 'rejected' ? 'Loan declined' : 'Sanction letter ready'
        },
        {
            id: 'disbursed',
            label: 'Disbursed',
            icon: FaHandHoldingUsd,
            description: 'Funds transferred'
        }
    ];

    return (
        <div className="w-full py-8 px-2 overflow-x-auto">
            <ul className="steps steps-vertical md:steps-horizontal w-full min-w-[500px] md:min-w-0">
                {steps.map((step, index) => {
                    // Logic to determine if step is completed or active
                    const isRejected = status === 'rejected' && step.id === 'decision';

                    // Special case: If rejected, steps after decision don't light up, but 'Verified' should be marked done.
                    // If status is 'pending', we are at index 1 (Review). 0 is done.

                    let stepClass = 'step-neutral';
                    let content = "●";

                    if (index < currentStepIndex) {
                        stepClass = 'step-primary'; // Past steps
                        content = "✓";
                    } else if (index === currentStepIndex) {
                        stepClass = 'step-primary'; // Current step
                        if (isRejected) stepClass = 'step-error';
                    }

                    // Handle Rejected path: disable 'Disbursed' completely
                    if (status === 'rejected' && index > 3) {
                        stepClass = 'step-neutral opacity-50';
                    }

                    return (
                        <li
                            key={step.id}
                            className={`step ${stepClass} transition-all duration-300`}
                            data-content={content}
                        >
                            <div className="flex flex-col items-center gap-1 p-2 pt-4">
                                <div className={`p-3 rounded-full ${index <= currentStepIndex ? (isRejected ? 'bg-error text-white' : 'bg-primary text-primary-content') : 'bg-base-200 text-base-content/40'} transition-colors duration-300`}>
                                    <step.icon className="text-xl" />
                                </div>
                                <span className={`font-bold text-sm mt-2 ${index <= currentStepIndex ? 'text-base-content' : 'text-base-content/40'}`}>
                                    {step.label}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-base-content/60 font-semibold hidden md:block">
                                    {step.description}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default StatusTimeline;
