"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiX } from "react-icons/fi";
import { NAVIGATION } from "@/src/config/navigation.config";
import { UserRole } from "@/src/types/auth.types";

interface SidebarProps {
    role: UserRole;
    open: boolean;
    onClose: () => void;
}

const Sidebar = ({ role, open, onClose }: SidebarProps) => {
    const pathname = usePathname();
    const items = NAVIGATION[role] ?? [];

    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                />
            )}

            <aside
                className={`
                fixed top-0 left-0 z-50 h-full w-64
                bg-white dark:bg-gray-900
                border-r border-gray-200 dark:border-gray-800
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:z-0
                ${open ? "translate-x-0" : "-translate-x-full"}
                flex flex-col
                `}
            >
                {/* Logo row */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                            S
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Salon 
                        </span>
                    </Link>

                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-500 dark:text-gray-400"
                        aria-label="Close sidebar"
                    >
                        <FiX size={22} />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {items.map((item) => {
                        const active = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`
                                flex items-center gap-3 rounded-xl px-3 py-2.5
                                text-sm font-medium transition-colors
                                ${
                                    active
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }
                                `}
                            >
                                <Icon
                                    size={18}
                                    className={active ? "text-primary" : "text-gray-400 dark:text-gray-500"}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-800 px-5 py-4">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        © {new Date().getFullYear()} Salon SaaS
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;