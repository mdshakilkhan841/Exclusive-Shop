"use client";

import { useState, useEffect } from "react";
import { Download, Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SalesPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        fetchSales();
    }, [dateFilter]);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/sales${dateFilter ? `?date=${dateFilter}` : ""}`,
            );
            const data = await res.json();
            if (data.success) {
                setSales(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Sales History
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View past orders, receipts and checkout logs.
                    </p>
                </div>
                <Button variant="outline" className="border-gray-300">
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by Invoice ID..."
                            className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <Input
                            type="date"
                            className="w-40 text-sm text-gray-600 bg-gray-50 border-gray-200"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-600">
                                    Invoice
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Date
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Customer
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Total
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Status
                                </TableHead>
                                <TableHead className="text-right font-semibold text-gray-600">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-gray-400"
                                    >
                                        Loading sales data...
                                    </TableCell>
                                </TableRow>
                            ) : sales.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No sales transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sales.map((sale) => (
                                    <TableRow
                                        key={sale._id}
                                        className="group cursor-pointer hover:bg-emerald-50/50"
                                    >
                                        <TableCell>
                                            <div className="font-medium text-emerald-700">
                                                {sale.invoiceNumber}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-600">
                                                {new Date(
                                                    sale.createdAt,
                                                ).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(
                                                    sale.createdAt,
                                                ).toLocaleTimeString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium text-gray-800">
                                                {sale.customer?.name ||
                                                    "Walk-in Customer"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {sale.paymentMethod}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-gray-900">
                                                ${sale.total.toFixed(2)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    sale.status === "COMPLETED"
                                                        ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                                                        : sale.status ===
                                                            "REFUNDED"
                                                          ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                                                          : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
                                                }
                                            >
                                                {sale.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-emerald-700 hover:bg-emerald-100"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />{" "}
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
