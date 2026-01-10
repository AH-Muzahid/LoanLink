import { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheckDouble, FaTrash } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import toast from 'react-hot-toast';

const NotificationBell = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [prevCount, setPrevCount] = useState(0);
    const isInitialized = useRef(false);

    // Fetch Notifications Polling every 5 seconds
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/notifications/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        refetchInterval: 5000,
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (isLoading) return;

        if (!isInitialized.current) {
            setPrevCount(notifications.length);
            isInitialized.current = true;
            return;
        }

        if (notifications.length > prevCount) {
            // New notification arrived
            const newNotif = notifications[0];

            // Play "Cool" Notification Sound (Modern Pop/Pluck)
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3');
                audio.volume = 0.5;
                audio.play().catch(error => console.log('Audio play failed', error));
            } catch (error) {
                console.error('Error playing notification sound:', error);
            }

            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 border border-white/20 dark:border-gray-700 overflow-hidden transform transition-all hover:scale-102`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#B91116] to-[#FF4D4D] flex items-center justify-center shadow-lg text-white animate-pulse-slow">
                                    <FaBell className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    New Update!
                                </p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                    {newNotif?.message || "You have a new notification"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#B91116] hover:text-red-700 focus:outline-none hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ), {
                duration: 3000,
                position: 'top-right',
            });
        }

        // Always sync prevCount to current length to handle deletions/updates
        setPrevCount(notifications.length);

    }, [notifications, prevCount, isLoading]);

    const markReadMutation = useMutation({
        mutationFn: async (id) => {
            await axiosSecure.patch(`/notifications/mark-read/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', user?.email]);
        }
    });

    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            await axiosSecure.patch(`/notifications/mark-all-read/${user?.email}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', user?.email]);
            toast.success('All notifications marked as read', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axiosSecure.delete(`/notifications/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', user?.email]);
            toast.success('Notification Deleted', {
                icon: <FaTrash />,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    });

    const handleMarkRead = (id, e) => {
        e.stopPropagation(); // Prevent closing dropdown if we decide to keep it open, but default behavior clicks inside might not close it unless logic says so.
        markReadMutation.mutate(id);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        deleteMutation.mutate(id);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <FaBell className="text-xl text-base-content/70" />
                    {unreadCount > 0 && (
                        <span className="badge badge-sm badge-error indicator-item text-white border-none animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </div>

            <div
                tabIndex={0}
                className="dropdown-content z-[999] menu p-0 shadow-2xl bg-base-100 rounded-box w-96 border border-base-200 mt-4 overflow-hidden"
            >
                <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-200/50">
                    <h3 className="font-bold text-lg text-base-content">Notifications</h3>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllReadMutation.mutate()}
                                className="btn btn-xs btn-ghost text-[#B91116] hover:bg-red-50"
                                disabled={markAllReadMutation.isPending}
                                title="Mark all as read"
                            >
                                <FaCheckDouble />
                            </button>
                        )}
                    </div>

                </div>

                <div className="overflow-y-auto max-h-[60vh] custom-scrollbar bg-base-100">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-base-content/50 flex flex-col items-center">
                            <FaBell className="text-4xl mb-3 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <ul className="flex flex-col">
                            {notifications.map((notif) => (
                                <li key={notif._id} className={`border-b border-base-200 last:border-none hover:bg-base-200/50 transition-colors ${!notif.read ? 'bg-red-50/10' : ''}`}>
                                    <div className="flex gap-3 p-4 items-start relative group">
                                        <div className={`mt-2 h-2.5 w-2.5 rounded-full shrink-0 ${!notif.read ? 'bg-[#B91116]' : 'bg-transparent'}`}></div>
                                        <div className="flex-1 space-y-1">
                                            <p className={`text-sm leading-snug ${!notif.read ? 'font-semibold text-base-content' : 'text-base-content/70'}`}>
                                                {notif.message}
                                            </p>
                                            <div className="flex justify-between items-center pt-1">
                                                <span className="text-xs text-base-content/50">{formatDate(notif.timestamp)}</span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notif.read && (
                                                        <button
                                                            onClick={(e) => handleMarkRead(notif._id, e)}
                                                            className="text-[#B91116] text-xs hover:underline font-medium bg-red-50 px-2 py-1 rounded-md"
                                                        >
                                                            Mark Read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDelete(notif._id, e)}
                                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="p-2 border-t border-base-200 bg-base-200/50 text-center">
                    <span className="text-xs text-base-content/40">Real-time updates active</span>
                </div>
            </div>
        </div>
    );
};

export default NotificationBell;
