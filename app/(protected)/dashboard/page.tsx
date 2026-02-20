"use client";

import { useEffect, useState } from "react";
import {
    DailyRevenueChart,
    ProfitDistributionChart,
} from "@/components/charts/DashboardCharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/dashboard/stats");
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                } else {
                    setError(data.error || "Failed to fetch stats");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[400px] w-full rounded-xl lg:col-span-2" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-lg">
                <h2 className="font-semibold text-lg">
                    Error loading dashboard
                </h2>
                <p>{error}</p>
            </div>
        );
    }

    const { todayStats, monthlySales, topSelling, lowStock } = stats || {};

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Dashboard
                </h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                        Today's Revenue
                    </h3>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        ${todayStats?.totalRevenue?.toFixed(2) || "0.00"}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                        Today's Profit
                    </h3>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                        ${todayStats?.totalProfit?.toFixed(2) || "0.00"}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                        Sales Count
                    </h3>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {todayStats?.count || 0}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                        Low Stock Items
                    </h3>
                    <div className="mt-2 text-3xl font-bold text-red-500">
                        {lowStock?.length || 0}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm lg:col-span-2 min-h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Monthly Revenue
                    </h3>
                    {monthlySales?.length > 0 ? (
                        <DailyRevenueChart data={monthlySales} />
                    ) : (
                        <div className="flex h-[300px] items-center justify-center text-gray-400">
                            No data available
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Top Selling Products
                    </h3>
                    <div className="space-y-4 mt-4">
                        {topSelling?.length > 0 ? (
                            topSelling.map((item: any) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate max-w-[150px]">
                                            {item.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {item.totalQuantity} Sold
                                        </span>
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                        ${item.totalRevenue.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500 text-center py-4">
                                No sales data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
