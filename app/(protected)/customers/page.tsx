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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    });

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

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Customer added successfully");
                setIsAddOpen(false);
                setFormData({ name: "", phone: "", email: "", address: "" });
                fetchCustomers();
            } else {
                toast.error(data.error || "Failed to add customer");
            }
        } catch (error: any) {
            toast.error(error.message);
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
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" /> Add Customer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleAddCustomer}>
                            <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="phone"
                                        className="text-right"
                                    >
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        required
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="email"
                                        className="text-right"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="address"
                                        className="text-right"
                                    >
                                        Address
                                    </Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                address: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
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
