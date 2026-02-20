"use client";
import { Menu, Search, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Topbar() {
    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Global Search concept */}
                <div className="hidden lg:flex items-center bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-lg w-96 focus-within:ring-2 focus-within:ring-emerald-500 transition-shadow">
                    <Search className="w-4 h-4 text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search products, orders, customers..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                {/* Placeholder for Shadcn Dropdown/Avatar */}
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors border dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Admin User
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            ADMIN
                        </p>
                    </div>
                </div>

                <button
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
