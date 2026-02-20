"use client";

import { useState, useEffect, useRef } from "react";
import { usePosStore } from "@/store/usePosStore";
import {
    Search,
    Scanner,
    Barcode,
    Trash2,
    Plus,
    Minus,
    Receipt,
    CreditCard,
    Banknote,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function POSPage() {
    const {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotals,
        clearCart,
    } = usePosStore();
    const [barcodeInput, setBarcodeInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [products, setProducts] = useState<any[]>([]); // Mocked or fetched list of products

    const { subtotal, taxAmount, discountAmount, total } = getTotals();

    // Keep scanner input focused when clicking around
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            // Don't steal focus if they are clicking on another input, button or link naturally
            if (
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA"
            )
                return;

            // We could re-focus inputRef here if we really wanted aggressive scanner capture
            // inputRef.current?.focus();
        };

        document.addEventListener("click", handleGlobalClick);
        return () => document.removeEventListener("click", handleGlobalClick);
    }, []);

    // Fetch initial product list for quick search (in real app, use pagination/search endpoint)
    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setProducts(data.data);
            });
    }, []);

    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcodeInput.trim()) return;

        const matchedProduct = products.find(
            (p) => p.barcode === barcodeInput || p.sku === barcodeInput,
        );

        if (matchedProduct) {
            if (matchedProduct.stock <= 0) {
                toast.error(`Out of stock: ${matchedProduct.name}`);
            } else {
                addToCart({
                    id: matchedProduct._id,
                    productId: matchedProduct._id,
                    name: matchedProduct.name,
                    sku: matchedProduct.sku,
                    price: matchedProduct.sellingPrice,
                    purchasePrice: matchedProduct.purchasePrice,
                    quantity: 1,
                    stock: matchedProduct.stock,
                });
                toast.success(`Added ${matchedProduct.name}`);
            }
        } else {
            toast.error("Product not found");
        }

        setBarcodeInput(""); // clear for next scan
    };

    const handleCheckout = () => {
        if (cart.length === 0) return toast.warning("Cart is empty!");
        toast.success("Checkout successful!");
        clearCart();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
            {/* Left side: Product List & Scanner */}
            <div className="flex-1 flex flex-col gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                {/* Scanner Input */}
                <form onSubmit={handleBarcodeSubmit} className="relative">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        ref={inputRef}
                        autoFocus
                        className="pl-12 h-14 text-lg bg-gray-50 border-gray-200 focus:bg-white"
                        placeholder="Scan barcode or enter SKU and press Enter..."
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                    />
                </form>

                <div className="flex items-center justify-between mt-2">
                    <h2 className="font-semibold text-gray-800">
                        Quick Select
                    </h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search name..."
                            className="h-9 pl-9"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 pr-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                        {products.map((p) => (
                            <div
                                key={p._id}
                                onClick={() => {
                                    if (p.stock > 0) {
                                        addToCart({
                                            id: p._id,
                                            productId: p._id,
                                            name: p.name,
                                            sku: p.sku,
                                            price: p.sellingPrice,
                                            purchasePrice: p.purchasePrice,
                                            quantity: 1,
                                            stock: p.stock,
                                        });
                                    } else {
                                        toast.error("Out of stock");
                                    }
                                }}
                                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${p.stock > 0 ? "bg-white hover:border-emerald-500 hover:shadow-md" : "bg-gray-50 opacity-60 cursor-not-allowed"}`}
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">
                                        {p.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {p.sku}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-end justify-between">
                                    <span className="text-lg font-bold text-emerald-600">
                                        ${p.sellingPrice.toFixed(2)}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={
                                            p.stock > 0
                                                ? "text-gray-600"
                                                : "text-red-500 border-red-200"
                                        }
                                    >
                                        {p.stock} in stock
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right side: Cart */}
            <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShoppingCartIcon className="w-5 h-5" />
                        <h2 className="font-semibold text-lg">Current Order</h2>
                    </div>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                        {cart.reduce((a, b) => a + b.quantity, 0)} Items
                    </Badge>
                </div>

                <ScrollArea className="flex-1 p-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 mt-20">
                            <Receipt className="w-16 h-16 opacity-20" />
                            <p>Scan an item to start</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 pr-2">
                                            <h4 className="font-medium text-gray-900">
                                                {item.name}
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                {item.sku}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-500">
                                            ${item.price.toFixed(2)} /ea
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7 rounded-full"
                                                onClick={() => {
                                                    if (item.quantity > 1)
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1,
                                                        );
                                                    else
                                                        removeFromCart(item.id);
                                                }}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="font-medium text-sm w-4 text-center">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7 rounded-full"
                                                onClick={() => {
                                                    if (
                                                        item.quantity <
                                                        item.stock
                                                    )
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1,
                                                        );
                                                    else
                                                        toast.error(
                                                            "Max stock reached",
                                                        );
                                                }}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-red-500 hover:bg-red-50 ml-1"
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Totals & Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Discount</span>
                            <span className="text-emerald-600">
                                -${discountAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tax (0%)</span>
                            <span>${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold text-xl text-gray-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="h-12 border-gray-300 gap-2 font-medium"
                            onClick={() => clearCart()}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" /> Clear
                        </Button>
                        <Button
                            className="h-12 bg-emerald-600 hover:bg-emerald-700 font-medium text-white shadow-md gap-2"
                            onClick={handleCheckout}
                        >
                            <Banknote className="w-5 h-5" /> Pay Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline SVG helper component for missing lucide import
function ShoppingCartIcon(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    );
}
