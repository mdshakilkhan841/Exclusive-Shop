import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Truck,
    FileText,
    Settings,
    BadgeDollarSign,
    Receipt,
} from "lucide-react";

export function Sidebar() {
    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "POS", href: "/pos", icon: ShoppingCart },
        { name: "Products", href: "/products", icon: Package },
        { name: "Sales", href: "/sales", icon: Receipt },
        { name: "Customers", href: "/customers", icon: Users },
        { name: "Suppliers", href: "/suppliers", icon: Truck },
        { name: "Expenses", href: "/expenses", icon: BadgeDollarSign },
        { name: "Reports", href: "/reports", icon: FileText },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen hidden md:flex flex-col">
            <div className="h-16 flex items-center justify-center border-b border-slate-700">
                <h1 className="text-xl font-bold tracking-wider text-emerald-400">
                    SUPER SHOP
                </h1>
            </div>
            <nav className="flex-1 py-6 px-3 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <item.icon className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-700">
                <div className="text-sm text-slate-400 text-center">
                    &copy; {new Date().getFullYear()} Exclusive Shop
                </div>
            </div>
        </aside>
    );
}
