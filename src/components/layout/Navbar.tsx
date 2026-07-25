"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiMenu,
    FiBell,
    FiChevronDown,
    FiLogOut,
    FiUser,
} from "react-icons/fi";
import { CurrentUser } from "@/src/types/auth.types";
import { removeAccessToken } from "@/src/utils/cookies";
import ThemeToggle from "../ThemeToggle";

interface NavbarProps {
    user: CurrentUser | null;
    onMenuClick: () => void;
}

const ROLE_LABEL: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    SALON_OWNER: "Salon Owner",
    RECEPTIONIST: "Receptionist",
    STAFF: "Staff",
    CUSTOMER: "Customer",
};

const Navbar = ({ user, onMenuClick }: NavbarProps) => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        removeAccessToken();
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("user");
        toast.success("Logged out successfully.");
        router.push("/auth/login");
    };

    return (
        <header
            className="
            sticky top-0 z-30
            flex items-center justify-between
            h-16 px-4 sm:px-6
            bg-white dark:bg-gray-900
            border-b border-gray-200 dark:border-gray-800
            "
        >
            {/* Left: hamburger (mobile only) */}
            <button
                onClick={onMenuClick}
                className="lg:hidden text-gray-600 dark:text-gray-300"
                aria-label="Open sidebar"
            >
                <FiMenu size={22} />
            </button>

            <div className="hidden lg:block" />

            {/* Right: notifications + profile */}
            <div className="flex items-center gap-3 sm:gap-4">

                <ThemeToggle />

                <button
                    className="
                    relative p-2 rounded-full
                    text-gray-500 dark:text-gray-400
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    "
                    aria-label="Notifications"
                >
                    <FiBell size={20} />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                                {user?.name ?? "User"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
                                {user?.role ? ROLE_LABEL[user.role] : ""}
                            </p>
                        </div>
                        <FiChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div
                            className="
                            absolute right-0 mt-2 w-48
                            rounded-xl border border-gray-200 dark:border-gray-800
                            bg-white dark:bg-gray-900
                            shadow-lg py-1.5
                            "
                        >
                            <button
                                onClick={() => router.push("/profile")}
                                className="
                                w-full flex items-center gap-2 px-4 py-2
                                text-sm text-gray-700 dark:text-gray-300
                                hover:bg-gray-100 dark:hover:bg-gray-800
                                "
                            >
                                <FiUser size={16} />
                                My Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="
                                w-full flex items-center gap-2 px-4 py-2
                                text-sm text-red-600 dark:text-red-400
                                hover:bg-red-50 dark:hover:bg-red-950/40
                                "
                            >
                                <FiLogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;