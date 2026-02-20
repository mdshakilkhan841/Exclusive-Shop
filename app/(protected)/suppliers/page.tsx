"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
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

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
    });

    useEffect(() => {
        fetchSuppliers();
    }, [search]);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/suppliers${search ? `?search=${search}` : ""}`,
            );
            const data = await res.json();
            if (data.success) {
                setSuppliers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch suppliers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Supplier added successfully");
                setIsAddOpen(false);
                setFormData({
                    name: "",
                    contactPerson: "",
                    phone: "",
                    email: "",
                    address: "",
                });
                fetchSuppliers();
            } else {
                toast.error(data.error || "Failed to add supplier");
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
                        Suppliers
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage vendor accounts and balances.
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" /> Add Supplier
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleAddSupplier}>
                            <DialogHeader>
                                <DialogTitle>Add New Supplier</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        Company
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
                                        htmlFor="contactPerson"
                                        className="text-right"
                                    >
                                        Contact
                                    </Label>
                                    <Input
                                        id="contactPerson"
                                        required
                                        value={formData.contactPerson}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                contactPerson: e.target.value,
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
                            placeholder="Search by name or contact..."
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
                                    Company
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Contact Person
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 text-right">
                                    Balance Due
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center py-8 text-gray-400"
                                    >
                                        Loading suppliers...
                                    </TableCell>
                                </TableRow>
                            ) : suppliers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No suppliers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                suppliers.map((s) => (
                                    <TableRow
                                        key={s._id}
                                        className="group hover:bg-emerald-50/30"
                                    >
                                        <TableCell>
                                            <div className="font-medium text-gray-900">
                                                {s.name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                                {s.address ||
                                                    "No address provided"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium text-gray-800">
                                                {s.contactPerson}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {s.phone}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {s.balanceDue > 0 ? (
                                                <div className="text-red-600 font-semibold">
                                                    ${s.balanceDue.toFixed(2)}
                                                </div>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="text-emerald-600 border-emerald-200"
                                                >
                                                    Settled
                                                </Badge>
                                            )}
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
