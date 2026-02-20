"use client";

import {
    Download,
    TrendingUp,
    DollarSign,
    Package,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Reports
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Generate dynamic PDF and CSV reports for business
                        analytics.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sales Report Card */}
                <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                        Sales Report
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 mb-6 h-10">
                        Export detailed records of daily, monthly, and yearly
                        sales totals, grouped by invoice.
                    </p>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                            variant="default"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-gray-300"
                        >
                            CSV
                        </Button>
                    </div>
                </div>

                {/* Profitability Card */}
                <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                        Profitability
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 mb-6 h-10">
                        Analyze cost against retail price with calculated net
                        profit margins.
                    </p>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                            variant="default"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-gray-300"
                        >
                            CSV
                        </Button>
                    </div>
                </div>

                {/* Inventory Card */}
                <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between hover:border-orange-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                        Inventory Status
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 mb-6 h-10">
                        Get a snapshot of current stock valuation, SKUs, and
                        warehouse status.
                    </p>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                            variant="default"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-gray-300"
                        >
                            CSV
                        </Button>
                    </div>
                </div>

                {/* Low Stock Card */}
                <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between hover:border-red-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-lg text-red-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                        Low Stock Alerts
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 mb-6 h-10">
                        Export items that have fallen below the configured
                        minimum stock threshold.
                    </p>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                            variant="default"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-gray-300"
                        >
                            CSV
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
