"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        sku: "",
        barcode: "",
        purchasePrice: "",
        sellingPrice: "",
        stock: "",
        minStockAlert: "",
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [search]);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/products${search ? `?search=${search}` : ""}`,
            );
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    categoryId: formData.categoryId || undefined,
                    sku: formData.sku || undefined,
                    barcode: formData.barcode || undefined,
                    purchasePrice: Number(formData.purchasePrice),
                    sellingPrice: Number(formData.sellingPrice),
                    stock: Number(formData.stock),
                    minStockAlert: Number(formData.minStockAlert),
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Product added successfully");
                setIsAddOpen(false);
                setFormData({
                    name: "",
                    categoryId: "",
                    sku: "",
                    barcode: "",
                    purchasePrice: "",
                    sellingPrice: "",
                    stock: "",
                    minStockAlert: "",
                });
                fetchProducts();
            } else {
                toast.error(data.error || "Failed to add product");
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
                        Products
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage inventory, variations, and stock.
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleAddProduct}>
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
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
                                        htmlFor="category"
                                        className="text-right"
                                    >
                                        Category
                                    </Label>
                                    <Select
                                        value={formData.categoryId}
                                        onValueChange={(val) =>
                                            setFormData({
                                                ...formData,
                                                categoryId: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c: any) => (
                                                <SelectItem
                                                    key={c._id}
                                                    value={c._id}
                                                >
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                            <SelectItem
                                                value="new_disabled"
                                                disabled
                                            >
                                                Add Category (coming soon)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="purchasePrice"
                                        className="text-right"
                                    >
                                        Cost
                                    </Label>
                                    <Input
                                        id="purchasePrice"
                                        type="number"
                                        required
                                        value={formData.purchasePrice}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                purchasePrice: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="sellingPrice"
                                        className="text-right"
                                    >
                                        Price
                                    </Label>
                                    <Input
                                        id="sellingPrice"
                                        type="number"
                                        required
                                        value={formData.sellingPrice}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                sellingPrice: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="stock"
                                        className="text-right"
                                    >
                                        Stock
                                    </Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stock: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="minStockAlert"
                                        className="text-right"
                                    >
                                        Min Stock
                                    </Label>
                                    <Input
                                        id="minStockAlert"
                                        type="number"
                                        required
                                        value={formData.minStockAlert}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                minStockAlert: e.target.value,
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
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, SKU, or barcode..."
                            className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Export
                        </Button>
                        <Button variant="outline" size="sm">
                            Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-600">
                                    Product Info
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Category
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Price
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600">
                                    Stock
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
                                        Loading products...
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((p) => (
                                    <TableRow key={p._id} className="group">
                                        <TableCell>
                                            <div className="font-medium text-gray-900">
                                                {p.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                SKU: {p.sku}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                            >
                                                {p.category?.name || "General"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">
                                                ${p.sellingPrice?.toFixed(2)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Cost: $
                                                {p.purchasePrice?.toFixed(2)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`w-2 h-2 rounded-full ${p.stock <= p.minStockAlert ? "bg-red-500" : "bg-emerald-500"}`}
                                                ></span>
                                                <span className="font-medium">
                                                    {p.stock}
                                                </span>
                                            </div>
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
