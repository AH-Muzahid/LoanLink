import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../Componets/Loading/LoadingSpinner';
import { useState, useEffect, useMemo } from 'react';
import { FaEye, FaSearch, FaFilter, FaFileAlt, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaList, FaColumns, FaGripVertical, FaCheckDouble, FaDownload, FaSortAmountDown, FaPrint } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { motion } from 'framer-motion';
import Modal from '../../Componets/Modal/Modal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['loan-applications'] });

            // Snapshot the previous value
            const previousApplications = queryClient.getQueryData(['loan-applications']);

            // Optimistically update to the new value
            queryClient.setQueryData(['loan-applications'], (old = []) => {
                return old.map(app =>
                    app._id === id ? { ...app, status: status } : app
                );
            });

            // Return a context object with the snapshotted value
            return { previousApplications };
        },
        onError: (err, newTodo, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(['loan-applications'], context.previousApplications);
            toast.error("Failed to update status");
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ['loan-applications'] });
        },
        onSuccess: () => {
            toast.success('Status updated successfully');
        }
    });

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // Dropped outside or into same position
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Status update
        const newStatus = destination.droppableId;

        // Optimistic UI Update handled by Query invalidation in background, 
        // but for smoother feel we could implement optimistic context updates.
        // For now, straight API call is sufficient.
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

        // Sorting Logic
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

    const getStatusColor = (status, feeStatus) => {
        if (feeStatus === 'paid') return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
        switch (status) {
            case 'approved': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            case 'rejected': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
            default: return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
        }
    };

    const getStatusIcon = (status, feeStatus) => {
        if (feeStatus === 'paid') return <FaCheckCircle />;
        switch (status) {
            case 'approved': return <FaCheckCircle />;
            case 'rejected': return <FaTimesCircle />;
            default: return <FaClock />;
        }
    };

    // Export Functionality
    const handleExport = () => {
        if (!filteredApps.length) return toast.error('No data to export');

        const headers = ['Application ID', 'Applicant', 'Email', 'Category', 'Amount', 'Fee Status', 'Loan Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...filteredApps.map(app => {
                const row = [
                    app.loanId || 'N/A',
                    `"${app.userName || ''}"`, // Quote to handle commas in names
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

    // Print Functionality
    const handlePrint = () => {
        if (!selectedApp) return;

        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
                <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #B91116; padding-bottom: 20px;">
                    <h1 style="color: #B91116; margin: 0;">LoanLink</h1>
                    <p style="margin: 5px 0; color: #666;">Application Details</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Application ID:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${selectedApp.loanId || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Applicant Name:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${selectedApp.userName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${selectedApp.userEmail}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Category:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${selectedApp.category}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Requested Amount:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 1.2em; color: #B91116;">৳${selectedApp.amount?.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Status:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-transform: capitalize;">${selectedApp.status || 'pending'}</td>
                    </tr>
                     <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Fee Status:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-transform: capitalize;">${selectedApp.feeStatus || 'unpaid'}</td>
                    </tr>
                     <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Date:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(selectedApp.createdAt).toLocaleDateString()}</td>
                    </tr>
                </table>

                 <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">Purpose</h3>
                    <p style="line-height: 1.6; background: #f9f9f9; padding: 15px; border-radius: 5px;">
                        ${selectedApp.purpose || 'No purpose specified.'}
                    </p>
                </div>

                <div style="margin-top: 50px; text-align: center; font-size: 0.8em; color: #999;">
                    <p>Generated by LoanLink System on ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Print Application</title></head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

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
                            /* Desktop Table View */
                            <motion.div
                                variants={containerVariants}
                                initial=""
                                animate="visible"
                                className="hidden md:block bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
                            >
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead className="bg-base-200/50 text-base-content/70">
                                            <tr>
                                                <th className="py-4 pl-6">Applicant</th>
                                                <th>Loan Details</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th className="pr-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApps.map((app) => (
                                                <motion.tr
                                                    key={app._id}
                                                    variants={itemVariants}
                                                    className={`hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none 
                                                        ${app.feeStatus === 'paid' ? 'bg-green-50/30' : ''}`}
                                                >
                                                    <td className="pl-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="avatar placeholder">
                                                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                                    <img src={app.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.userName}`} alt="" />
                                                                    <span className="text-xs">{app.userName?.charAt(0)}</span>
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
                                                        <div className="text-xs text-base-content/50 font-mono">{app.loanId?.slice(0, 8)}...</div>
                                                    </td>
                                                    <td>
                                                        <div className="font-bold text-[#B91116]">৳{app.amount?.toLocaleString()}</div>
                                                    </td>
                                                    <td className="text-sm text-base-content/70">
                                                        {new Date(app.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <div className={`badge gap-2 font-medium  border-none py-3 px-4 ${getStatusColor(app.status, app.feeStatus)}`}>
                                                            {getStatusIcon(app.status, app.feeStatus)}
                                                            <span className="capitalize">{app.feeStatus === 'paid' ? 'Paid' : app.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
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
                                                            <button
                                                                onClick={() => setSelectedApp(app)}
                                                                className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-[#B91116] hover:bg-red-50"
                                                                title="View Details"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredApps.length === 0 && (
                                    <div className="p-12 text-center text-base-content/50">
                                        <FaFilter className="mx-auto text-4xl mb-3 opacity-20" />
                                        <p>No applications found.</p>
                                    </div>
                                )}
                            </motion.div>
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

                        {/* Mobile Card View (Only shown in list mode on mobile, or fallback) */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className={`md:hidden space-y-4 ${viewMode === 'board' ? 'hidden' : 'block'}`}
                        >
                            {filteredApps.map((app) => (
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
                                                    <span>{app.userName?.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{app.userName}</h3>
                                                <p className="text-xs text-base-content/50">{app.category}</p>
                                            </div>
                                        </div>
                                        <div className={`badge gap-1 font-medium border-none ${getStatusColor(app.status, app.feeStatus)}`}>
                                            {getStatusIcon(app.status, app.feeStatus)}
                                            <span className="capitalize text-xs">{app.feeStatus === 'paid' ? 'Paid' : app.status}</span>
                                        </div>
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

                                    <div className="flex gap-2">
                                        {app.feeStatus === 'paid' ? (
                                            <div className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold py-2 border border-green-200 opacity-80 cursor-not-allowed">
                                                <FaCheckDouble /> Paid & Locked
                                            </div>
                                        ) : (
                                            <select
                                                value={app.status || 'pending'}
                                                onChange={(e) => updateStatusMutation.mutate({ id: app._id, status: e.target.value })}
                                                className="select select-bordered select-sm flex-1 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116]"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approve</option>
                                                <option value="rejected">Reject</option>
                                            </select>
                                        )}
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="btn btn-sm btn-ghost border border-base-300"
                                        >
                                            <FaEye />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )
            }
            <Modal
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                title={
                    <div>
                        <h3 className="font-bold text-xl">Application Details</h3>
                        {selectedApp && <p className="text-white/80 text-sm mt-1">ID: {selectedApp.loanId}</p>}
                    </div>
                }
            >
                {selectedApp && (
                    <>
                        {/* ... modal content ... */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                    <div className="bg-white p-2 rounded-full shadow-sm">
                                        <FaUser className="text-[#B91116]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-base-content/50 uppercase font-bold">Applicant</p>
                                        <p className="font-medium">{selectedApp.userName}</p>
                                        <p className="text-xs text-base-content/60">{selectedApp.userEmail}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Loan Category</p>
                                    <p className="text-lg font-medium">{selectedApp.category}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Requested Amount</p>
                                    <p className="text-2xl font-bold text-[#B91116]">৳{selectedApp.amount?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Current Status</p>
                                    <div className={`badge gap-2 font-medium border-none py-3 px-4 ${getStatusColor(selectedApp.status, selectedApp.feeStatus)}`}>
                                        {getStatusIcon(selectedApp.status, selectedApp.feeStatus)}
                                        <span className="capitalize">{selectedApp.feeStatus === 'paid' ? 'Paid' : selectedApp.status}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Application Date</p>
                                    <p className="font-medium">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold mb-1">Purpose</p>
                                    <div className="bg-base-200/50 p-3 rounded-xl text-sm leading-relaxed">
                                        {selectedApp.purpose || "No purpose specified."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-base-200/30 border-t border-base-200 flex justify-between gap-2"> {/* Changed justify-end to justify-between */}

                            {/* Print Button */}
                            <button
                                onClick={handlePrint}
                                className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-[#B91116]"
                            >
                                <FaPrint /> Print
                            </button>

                            <div className="flex gap-2"> {/* Wrapped actions in a div */}
                                {/* Quick Actions in Modal for easy access */}
                                {selectedApp.feeStatus === 'paid' ? (
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm px-2">
                                        <FaCheckDouble /> Application Locked (Paid)
                                    </div>
                                ) : (
                                    <>
                                        {selectedApp.status !== 'approved' && (
                                            <button
                                                onClick={() => {
                                                    updateStatusMutation.mutate({ id: selectedApp._id, status: 'approved' });
                                                    setSelectedApp(null);
                                                }}
                                                className="btn btn-success btn-sm text-white"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {selectedApp.status !== 'rejected' && (
                                            <button
                                                onClick={() => {
                                                    updateStatusMutation.mutate({ id: selectedApp._id, status: 'rejected' });
                                                    setSelectedApp(null);
                                                }}
                                                className="btn btn-error btn-sm text-white"
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </>
                                )}
                                <button onClick={() => setSelectedApp(null)} className="btn btn-ghost btn-sm hover:bg-base-200">Close</button>
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </div >
    );
};

export default LoanApplications;
