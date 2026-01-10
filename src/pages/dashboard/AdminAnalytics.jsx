import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

const AdminAnalytics = ({ applications = [] }) => {
    // 1. Calculate Status Distribution
    const statusData = useMemo(() => {
        const counts = { pending: 0, approved: 0, rejected: 0 };
        applications.forEach(app => {
            const status = app.status?.toLowerCase() || 'pending';
            if (counts[status] !== undefined) {
                counts[status]++;
            } else {
                // handle unexpected statuses if any
                counts['pending']++;
            }
        });

        return [
            { name: 'Pending', value: counts.pending, color: '#FBBF24' }, // Amber
            { name: 'Approved', value: counts.approved, color: '#10B981' }, // Emerald
            { name: 'Rejected', value: counts.rejected, color: '#EF4444' }  // Red
        ];
    }, [applications]);

    // 2. Calculate Monthly Trends
    const monthlyData = useMemo(() => {
        const months = {};
        applications.forEach(app => {
            if (!app.createdAt) return;
            const date = new Date(app.createdAt);
            const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (!months[monthYear]) {
                months[monthYear] = { name: monthYear, applications: 0, amount: 0 };
            }
            months[monthYear].applications++;
            months[monthYear].amount += (app.amount || 0);
        });

        // Convert to array and sort (logic for sorting by date might be needed if not chronological)
        // For simplicity, we assume data comes in roughly chronological or just display as is.
        // A better sort would parse the date key.
        return Object.values(months);
    }, [applications]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (!applications.length) {
        return (
            <div className="p-8 text-center bg-base-100 rounded-2xl border border-base-200 shadow-sm mt-8">
                <p className="text-base-content/60">Not enough data for analytics.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
            {/* Status Distribution Chart */}
            <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-200">
                <h3 className="text-lg font-bold mb-6 text-base-content flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#B91116] rounded-full"></span>
                    Application Status
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Trends Chart */}
            <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-200">
                <h3 className="text-lg font-bold mb-6 text-base-content flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#B91116] rounded-full"></span>
                    Monthly Volume
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={monthlyData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="applications"
                                fill="#B91116"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                                name="Applications"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminAnalytics;
