import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFileAlt, FaCheckCircle, FaClock, FaCheckDouble, FaDownload, FaList, FaColumns, FaGripVertical, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ApplicationTable from '../../Componets/Dashboard/Shared/ApplicationTable';
import ApplicationCard from '../../Componets/Dashboard/Shared/ApplicationCard';
import ApplicationDetailsModal from '../../Componets/Dashboard/Shared/ApplicationDetailsModal';

const LoanApplications = () => {
    useEffect(() => {
        document.title = 'Loan Applications - Dashboard | LoanLink';
    }, []);

    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // Sorting State
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('board'); // 'list' or 'board'
    const [selectedApp, setSelectedApp] = useState(null);
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['loan-applications'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/applications');
            return data;
        }
    });

    // Statistics Calculation (Memoized)
    const stats = useMemo(() => {
        return {
            total: applications.length,
            totalValue: applications.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
            pending: applications.filter(app => app.status === 'pending').length,
            approved: applications.filter(app => app.status === 'approved').length
        };
    }, [applications]);

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const { data } = await axiosSecure.patch(`/applications/${id}`, { status });
            return data;
        },
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['loan-applications'] });
            const previousApplications = queryClient.getQueryData(['loan-applications']);
            queryClient.setQueryData(['loan-applications'], (old = []) => {
                return old.map(app =>
                    app._id === id ? { ...app, status: status } : app
                );
            });
            return { previousApplications };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['loan-applications'], context.previousApplications);
            toast.error("Failed to update status");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['loan-applications'] });
        },
        onSuccess: () => {
            toast.success('Status updated successfully');
        }
    });

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId;
        updateStatusMutation.mutate({ id: draggableId, status: newStatus });
    };

    const filteredApps = useMemo(() => {
        let result = applications.filter(app => {
            const matchesFilter = filter === 'all' || app.status === filter;
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                (app.userName || '').toLowerCase().includes(searchLower) ||
                (app.userEmail || '').toLowerCase().includes(searchLower) ||
                (app.category || '').toLowerCase().includes(searchLower) ||
                (app.loanId || '').toLowerCase().includes(searchLower);
            return matchesFilter && matchesSearch;
        });

        if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        else if (sortBy === 'highest_amount') result.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
        else if (sortBy === 'lowest_amount') result.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));

        return result;
    }, [applications, filter, searchTerm, sortBy]);

    // Grouping for Kanban (Memoized)
    const columns = useMemo(() => {
        return {
            pending: filteredApps.filter(app => app.status === 'pending' || !app.status),
            approved: filteredApps.filter(app => app.status === 'approved'),
            rejected: filteredApps.filter(app => app.status === 'rejected'),
        };
    }, [filteredApps]);

    // Export Functionality
    const handleExport = () => {
        if (!filteredApps.length) return toast.error('No data to export');

        const headers = ['Application ID', 'Applicant', 'Email', 'Category', 'Amount', 'Fee Status', 'Loan Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...filteredApps.map(app => {
                const row = [
                    app.loanId || 'N/A',
                    `"${app.userName || ''}"`,
                    app.userEmail || '',
                    app.category || '',
                    app.amount || 0,
                    app.feeStatus || 'unpaid',
                    app.status || 'pending',
                    new Date(app.createdAt).toLocaleDateString()
                ];
                return row.join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `loan_applications_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Exported to CSV');
    };

    const renderActions = (app) => (
        <>
            {app.feeStatus === 'paid' ? (
                <div className="badge badge-success gap-1 py-3 px-3 opacity-90 cursor-not-allowed text-white" title="Status Locked">
                    <FaCheckDouble className="text-xs" /> Locked
                </div>
            ) : (
                <select
                    value={app.status || 'pending'}
                    onChange={(e) => updateStatusMutation.mutate({ id: app._id, status: e.target.value })}
                    className="select select-bordered select-xs w-28 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                </select>
            )}
        </>
    );

    const renderModalActions = (app) => (
        <>
            {app.feeStatus === 'paid' ? (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm px-2">
                    <FaCheckDouble /> Application Locked (Paid)
                </div>
            ) : (
                <>
                    {app.status !== 'approved' && (
                        <button
                            onClick={() => {
                                updateStatusMutation.mutate({ id: app._id, status: 'approved' });
                                setSelectedApp(null);
                            }}
                            className="btn btn-success btn-sm text-white"
                        >
                            <FaCheck /> Approve
                        </button>
                    )}
                    {app.status !== 'rejected' && (
                        <button
                            onClick={() => {
                                updateStatusMutation.mutate({ id: app._id, status: 'rejected' });
                                setSelectedApp(null);
                            }}
                            className="btn btn-error btn-sm text-white"
                        >
                            <FaTimes /> Reject
                        </button>
                    )}
                </>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-base-200/30 p-4 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-linear-to-r from-[#B91116] to-[#ff4d4d] bg-clip-text text-transparent flex items-center gap-3">
                        <FaFileAlt className="text-[#B91116]" /> Loan Applications
                    </h2>
                    <p className="text-base-content/60 mt-1">Manage, review, and drag to update status</p>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full md:w-64">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search by name, email, category..."
                            className="input input-bordered pl-10 w-full focus:border-[#B91116] focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort Dropdown */}
                        <div className="relative hidden sm:block">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="select select-bordered select-sm w-full max-w-xs focus:border-[#B91116] focus:outline-none"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest_amount">Highest Amount</option>
                                <option value="lowest_amount">Lowest Amount</option>
                            </select>
                        </div>


                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-[#B91116] hover:border-[#B91116] btn-sm gap-2"
                            title="Export to CSV"
                        >
                            <FaDownload />
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        {/* View Toggle */}
                        <div className="join bg-base-100 shadow-sm border border-base-200">
                            <button
                                className={`join-item btn btn-sm ${viewMode === 'list' ? 'btn-active bg-[#B91116] text-white' : 'btn-ghost'}`}
                                onClick={() => setViewMode('list')}
                                title="List View"
                            >
                                <FaList />
                            </button>
                            <button
                                className={`join-item btn btn-sm ${viewMode === 'board' ? 'btn-active bg-[#B91116] text-white' : 'btn-ghost'}`}
                                onClick={() => setViewMode('board')}
                                title="Board View"
                            >
                                <FaColumns />
                            </button>
                        </div>

                        {/* Filter Tabs */}
                        {viewMode === 'list' && (
                            <div className="hidden md:flex flex-nowrap gap-2 bg-base-100 p-1 rounded-xl shadow-sm border border-base-200">
                                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 capitalize ${filter === status
                                            ? 'bg-[#B91116] text-white shadow-md'
                                            : 'text-base-content/70 hover:bg-base-200 hover:text-[#B91116]'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <FaFileAlt className="text-xl" />
                    </div>
                    <div>
                        <p className="text-xs text-base-content/60 font-medium">Total Apps</p>
                        <h4 className="text-2xl font-bold">{stats.total}</h4>
                    </div>
                </div>
                <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                        <span className="text-xl font-bold">৳</span>
                    </div>
                    <div>
                        <p className="text-xs text-base-content/60 font-medium">Total Value</p>
                        <h4 className="text-2xl font-bold">{(stats.totalValue / 100000).toFixed(1)}L</h4>
                    </div>
                </div>
                <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                        <FaClock className="text-xl" />
                    </div>
                    <div>
                        <p className="text-xs text-base-content/60 font-medium">Pending</p>
                        <h4 className="text-2xl font-bold">{stats.pending}</h4>
                    </div>
                </div>
                <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                        <FaCheckCircle className="text-xl" />
                    </div>
                    <div>
                        <p className="text-xs text-base-content/60 font-medium">Approved</p>
                        <h4 className="text-2xl font-bold">{stats.approved}</h4>
                    </div>
                </div>
            </div>

            {
                isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {viewMode === 'list' ? (
                            <ApplicationTable
                                applications={filteredApps}
                                onView={setSelectedApp}
                                renderActions={renderActions}
                                showStatus={true}
                            />
                        ) : (
                            /* Kanban Board View */
                            <DragDropContext onDragEnd={onDragEnd}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
                                    {['pending', 'approved', 'rejected'].map(statusId => (
                                        <div key={statusId} className="flex flex-col h-full min-w-[300px]">
                                            {/* Column Header */}
                                            <div className={`p-4 rounded-t-xl border-b-4 bg-base-100 shadow-sm flex justify-between items-center
                                        ${statusId === 'pending' ? 'border-yellow-400' :
                                                    statusId === 'approved' ? 'border-green-500' : 'border-red-500'}`}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full 
                                                ${statusId === 'pending' ? 'bg-yellow-400' :
                                                            statusId === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <h3 className="font-bold text-lg capitalize">{statusId}</h3>
                                                </div>
                                                <span className="badge badge-sm">{columns[statusId]?.length || 0}</span>
                                            </div>

                                            {/* Droppable Area */}
                                            <Droppable droppableId={statusId}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className={`flex-1 bg-base-200/50 p-3 rounded-b-xl transition-colors min-h-[500px]
                                                    ${snapshot.isDraggingOver ? 'bg-base-200 ring-2 ring-inset ring-base-300' : ''}`}
                                                    >
                                                        {columns[statusId]?.map((app, index) => (
                                                            <Draggable
                                                                key={app._id}
                                                                draggableId={app._id}
                                                                index={index}
                                                                isDragDisabled={app.feeStatus === 'paid'}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{ ...provided.draggableProps.style }}
                                                                        className={`bg-base-100 p-4 rounded-xl shadow-sm border border-base-200 mb-3 group hover:shadow-md transition-all
                                                                    ${snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105 ring-2 ring-[#B91116] z-50' : ''}
                                                                    ${app.feeStatus === 'paid' ? 'opacity-70 cursor-not-allowed bg-green-50/50 dark:bg-green-900/10' : ''}
                                                                    `}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-3">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="avatar placeholder">
                                                                                    <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 text-xs">
                                                                                        <span>{app.userName?.charAt(0)}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-bold text-sm line-clamp-1">{app.userName}</p>
                                                                                    <p className="text-[10px] text-base-content/50">{new Date(app.createdAt).toLocaleDateString()}</p>
                                                                                </div>
                                                                            </div>

                                                                            {/* Drag Status/Lock Icon */}
                                                                            {app.feeStatus === 'paid' ? (
                                                                                <div className="p-1 rounded text-green-600 bg-green-100" title="Paid & Locked">
                                                                                    <FaCheckDouble />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-base-200 text-base-content/30">
                                                                                    <FaGripVertical />
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="space-y-2 mb-3">
                                                                            <div className="flex justify-between items-center">
                                                                                <span className="text-xs text-base-content/60">{app.category}</span>
                                                                                <span className="font-bold text-[#B91116]">৳{app.amount?.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="pt-3 border-t border-base-200 flex justify-between items-center">
                                                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded
                                                                        ${app.feeStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                                {app.feeStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                                                            </span>
                                                                            <button
                                                                                onClick={() => setSelectedApp(app)}
                                                                                className="btn btn-ghost btn-xs text-base-content/50 hover:text-[#B91116]"
                                                                            >
                                                                                View Details
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    ))}
                                </div >
                            </DragDropContext >
                        )}

                        {/* Mobile Card View - Only for List mode */}
                        <div className={viewMode === 'board' ? 'hidden' : 'block'}>
                            <ApplicationCard
                                applications={filteredApps}
                                onView={setSelectedApp}
                                renderActions={renderActions}
                                showStatus={true}
                            />
                        </div>
                    </>
                )
            }
            <ApplicationDetailsModal
                application={selectedApp}
                onClose={() => setSelectedApp(null)}
                renderActions={renderModalActions}
            />
        </div >
    );
};

export default LoanApplications;
