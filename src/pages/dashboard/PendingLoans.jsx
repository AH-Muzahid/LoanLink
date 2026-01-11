import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { FaClock, FaSearch, FaSortAmountDown, FaCheckDouble, FaCheck, FaTimes, FaLayerGroup, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import ApplicationTable from '../../Componets/Dashboard/Shared/ApplicationTable';
import ApplicationCard from '../../Componets/Dashboard/Shared/ApplicationCard';
import ApplicationDetailsModal from '../../Componets/Dashboard/Shared/ApplicationDetailsModal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const PendingLoans = () => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedIds, setSelectedIds] = useState([]); // Array of selected ID strings
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        document.title = 'Pending Applications - Dashboard | LoanLink';
    }, []);

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['pending-applications'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/applications?status=pending');
            return data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const updates = {
                status,
                ...(status === 'approved' && { approvedAt: new Date().toISOString() })
            };
            const { data } = await axiosSecure.patch(`/applications/${id}`, updates);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['pending-applications']);
            toast.success(`Application ${variables.status} successfully`);
            setSelectedApp(null);
        }
    });

    const bulkUpdateMutation = useMutation({
        mutationFn: async ({ ids, status }) => {
            const promises = ids.map(id => {
                const updates = {
                    status,
                    ...(status === 'approved' && { approvedAt: new Date().toISOString() })
                };
                return axiosSecure.patch(`/applications/${id}`, updates);
            });
            await Promise.all(promises);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['pending-applications']);
            toast.success(`${variables.ids.length} applications ${variables.status} successfully`);
            setSelectedIds([]); // Clear selection
        },
        onError: () => {
            toast.error("Failed to update some applications");
        }
    });

    // Filter and Sort Logic
    const filteredApps = useMemo(() => {
        let result = [...applications];

        // Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(app =>
                (app.userName || '').toLowerCase().includes(lowerTerm) ||
                (app.userEmail || '').toLowerCase().includes(lowerTerm) ||
                (app.category || '').toLowerCase().includes(lowerTerm) ||
                (app.loanId || '').toLowerCase().includes(lowerTerm)
            );
        }

        // Date Range Filter
        if (startDate && endDate) {
            result = result.filter(app => {
                const appDate = new Date(app.createdAt);
                // Ensure endDate includes the full day by setting it to end of day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                return appDate >= startDate && appDate <= end;
            });
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'highest_amount') return b.amount - a.amount;
            if (sortBy === 'lowest_amount') return a.amount - b.amount;
            return 0;
        });

        return result;
    }, [applications, searchTerm, sortBy, startDate, endDate]);

    // Selection Handlers
    const handleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id)
            ? prev.filter(item => item !== id)
            : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const selectableApps = filteredApps.filter(app => app.feeStatus !== 'paid');
        const selectableIds = selectableApps.map(app => app._id);

        // If all selectable provided are already selected, deselect all.
        const allSelected = selectableIds.length > 0 && selectableIds.every(id => selectedIds.includes(id));

        if (allSelected) {
            setSelectedIds([]); // Deselect all
        } else {
            setSelectedIds(selectableIds); // Select all selectable
        }
    };

    const handleBulkAction = (status) => {
        if (!selectedIds.length) return;
        if (confirm(`Are you sure you want to ${status} ${selectedIds.length} applications?`)) {
            bulkUpdateMutation.mutate({ ids: selectedIds, status });
        }
    };

    // Shared Action Buttons
    const renderActions = (app) => (
        <>
            {app.feeStatus === 'paid' ? (
                <div className="tooltip tooltip-left" data-tip="Locked (Paid)">
                    <button className="btn btn-circle btn-ghost btn-sm text-green-300 cursor-not-allowed">
                        <FaCheckDouble />
                    </button>
                </div>
            ) : (
                <>
                    <button
                        onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'approved' })}
                        className="btn btn-circle btn-ghost btn-sm text-green-500 hover:bg-green-50"
                        title="Approve"
                    >
                        <FaCheck />
                    </button>
                    <button
                        onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'rejected' })}
                        className="btn btn-circle btn-ghost btn-sm text-red-500 hover:bg-red-50"
                        title="Reject"
                    >
                        <FaTimes />
                    </button>
                </>
            )}
        </>
    );

    // Modal Actions (Buttons inside the modal)
    const renderModalActions = (app) => (
        <>
            {app.feeStatus === 'paid' ? (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm px-4 bg-green-50 rounded-lg">
                    <FaCheckDouble /> Application Pending (Locked)
                </div>
            ) : (
                <>
                    <button
                        onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'rejected' })}
                        className="btn btn-outline btn-error btn-sm gap-2"
                    >
                        <FaTimes /> Reject
                    </button>
                    <button
                        onClick={() => updateStatusMutation.mutate({ id: app._id, status: 'approved' })}
                        className="btn bg-[#B91116] hover:bg-[#900d11] text-white border-none btn-sm gap-2"
                    >
                        <FaCheck /> Approve
                    </button>
                </>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-base-200/30 p-4 md:p-8">
            {/* Header Section with Search & Sort */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-3xl font-bold bg-linear-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent flex items-center gap-3">
                        <FaClock className="text-[#B91116]" /> Pending Applications
                    </h2>
                    <p className="text-base-content/60 mt-1">Review and manage loan requests awaiting approval</p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                    {/* Date Picker */}
                    <div className="relative z-20">
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 z-10 pointer-events-none" />
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                isClearable={true}
                                placeholderText="Filter by Date Range"
                                className="input input-bordered w-full md:w-56 pl-10 focus:border-[#B91116] rounded-xl cursor-pointer"
                                wrapperClassName="w-full"
                            />
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered w-full pl-10 focus:border-[#B91116] rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Action Bar - Only shows when items are selected */}
            {selectedIds.length > 0 && (
                <div className="bg-[#B91116]/5 border border-[#B91116]/20 p-3 rounded-xl flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 text-[#B91116] font-medium px-2">
                        <FaLayerGroup />
                        <span>{selectedIds.length} Selected</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkAction('approved')}
                            className="btn btn-sm bg-[#B91116] hover:bg-[#900d11] text-white border-none"
                        >
                            <FaCheck /> Approve Selected
                        </button>
                        <button
                            onClick={() => handleBulkAction('rejected')}
                            className="btn btn-sm btn-outline btn-error hover:text-white"
                        >
                            <FaTimes /> Reject Selected
                        </button>
                        <button
                            onClick={() => setSelectedIds([])}
                            className="btn btn-sm btn-ghost"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Sort & Filter (Moved below bulk to prevent layout shift) */}
            <div className="flex justify-end mb-4">
                <div className="relative">
                    <select
                        className="select select-bordered select-sm w-full md:w-48 pl-3 focus:border-[#B91116] rounded-xl appearance-none"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest_amount">Highest Amount</option>
                        <option value="lowest_amount">Lowest Amount</option>
                    </select>
                    <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <ApplicationTable
                        applications={filteredApps}
                        onView={setSelectedApp}
                        renderActions={renderActions}
                        showStatus={false}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                    />

                    {/* Mobile Card View (Selection not yet supported on mobile cards, can be added later) */}
                    <div className="md:hidden">
                        <div className="alert alert-info shadow-sm mb-4">
                            <span className="text-xs">Switch to desktop to use Bulk Actions</span>
                        </div>
                        <ApplicationCard
                            applications={filteredApps}
                            onView={setSelectedApp}
                            renderActions={renderActions}
                            showStatus={false}
                        />
                    </div>
                </>
            )}

            <ApplicationDetailsModal
                application={selectedApp}
                onClose={() => setSelectedApp(null)}
                renderActions={renderModalActions}
            />
        </div>
    );
};

export default PendingLoans;
