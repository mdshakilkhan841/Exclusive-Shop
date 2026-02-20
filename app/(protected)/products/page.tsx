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

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchProducts();
    }, [search]);

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
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
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
