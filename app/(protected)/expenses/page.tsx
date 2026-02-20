"use client";

import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
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

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [monthFilter, setMonthFilter] = useState("");

    useEffect(() => {
        fetchExpenses();
    }, [monthFilter]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/expenses${monthFilter ? `?date=${monthFilter}` : ""}`,
            );
            const data = await res.json();
            if (data.success) {
                setExpenses(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Expenses
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Track operational costs and shop expenditures.
                    </p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Record Expense
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-end">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <Input
                            type="month"
                            className="w-48 text-sm text-gray-600 bg-gray-50 border-gray-200"
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-600">
                                    Category
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Description
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Date
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 text-right">
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8 text-gray-400"
                                    >
                                        Loading expenses...
                                    </TableCell>
                                </TableRow>
                            ) : expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No expenses recorded for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                expenses.map((e) => (
                                    <TableRow
                                        key={e._id}
                                        className="group hover:bg-red-50/30"
                                    >
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-orange-50 text-orange-700 border-orange-200"
                                            >
                                                {e.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-800">
                                                {e.description}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                By:{" "}
                                                {e.recordedBy?.name || "System"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {new Date(
                                                e.date,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-red-600">
                                            ${e.amount.toFixed(2)}
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
