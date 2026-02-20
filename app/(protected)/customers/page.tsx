"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, ShieldAlert } from "lucide-react";
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

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, [search]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/customers${search ? `?search=${search}` : ""}`,
            );
            const data = await res.json();
            if (data.success) {
                setCustomers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Customers
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage profiles, loyalty points, and dues.
                    </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Add Customer
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by name or phone..."
                            className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-600">
                                    Customer Details
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Contact
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 text-center">
                                    Loyalty Points
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 text-right">
                                    Dues
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
                                        colSpan={5}
                                        className="text-center py-8 text-gray-400"
                                    >
                                        Loading customers...
                                    </TableCell>
                                </TableRow>
                            ) : customers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((c) => (
                                    <TableRow
                                        key={c._id}
                                        className="group hover:bg-emerald-50/30"
                                    >
                                        <TableCell>
                                            <div className="font-medium text-gray-900">
                                                {c.name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                                {c.address ||
                                                    "No address provided"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-700">
                                                {c.phone}
                                            </div>
                                            {c.email && (
                                                <div className="text-xs text-gray-500">
                                                    {c.email}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="secondary"
                                                className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                                            >
                                                {c.loyaltyPoints} pts
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {c.dueAmount > 0 ? (
                                                <div className="flex items-center justify-end gap-1 text-red-600 font-semibold">
                                                    <ShieldAlert className="w-4 h-4" />{" "}
                                                    ${c.dueAmount.toFixed(2)}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    No Dues
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
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
