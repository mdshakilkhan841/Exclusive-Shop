"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch mock settings
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSettings(data.data);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app this would POST/PUT to /api/settings
        toast.success("Settings saved successfully!");
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-2xl">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    App Settings
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Configure global store preferences and defaults.
                </p>
            </div>

            <form
                onSubmit={handleSave}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8"
            >
                {/* General Info */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="shopName">Shop Name</Label>
                            <Input
                                id="shopName"
                                defaultValue={settings?.shopName}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Contact Phone</Label>
                            <Input id="phone" defaultValue={settings?.phone} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                defaultValue={settings?.address}
                            />
                        </div>
                    </div>
                </div>

                {/* Financials & POS */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Financials & POS
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency Code</Label>
                            <Input
                                id="currency"
                                defaultValue={settings?.currency}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currencySymbol">Symbol</Label>
                            <Input
                                id="currencySymbol"
                                defaultValue={settings?.currencySymbol}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxRate">Global Tax Rate (%)</Label>
                            <Input
                                id="taxRate"
                                type="number"
                                defaultValue={settings?.taxRate}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
