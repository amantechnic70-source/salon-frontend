"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiLogOut,
    FiChevronRight,
    FiCalendar,
    FiCreditCard,
    FiShield,
} from "react-icons/fi";

import { authService } from "@/src/services/auth/auth.service";
import { clearAuthCookies } from "@/src/utils/cookies";

interface ProfileData {
    _id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
}

const QUICK_LINKS = [
    { label: "My Appointments", href: "/customer/appointments", icon: FiCalendar },
    { label: "Payments", href: "/customer/payments", icon: FiCreditCard },
];

export default function CustomerProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await authService.getProfile();
                setProfile(res.data.data);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load your profile."
                );
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await authService.logout();
        } catch {
            // Even if the server call fails (e.g. token already expired),
            // still clear local session so the user isn't stuck.
        } finally {
            clearAuthCookies();
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("user");
            toast.success("Logged out successfully.");
            router.push("/auth/login");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="max-w-lg mx-auto px-4 sm:px-6 pt-6 space-y-4">
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 animate-pulse space-y-4">
                        <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto" />
                        <div className="h-5 w-40 bg-gray-100 dark:bg-gray-800 rounded mx-auto" />
                        <div className="h-4 w-56 bg-gray-100 dark:bg-gray-800 rounded mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Could not load your profile. Please try logging in again.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            <div className="max-w-lg mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Profile
                </h1>

                {/* Identity card */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
                        {profile.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        {profile.name}
                    </h2>

                    <div className="mt-2 flex items-center justify-center gap-2">
                        <span
                            className={`
                            inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium
                            ${
                                profile.isVerified
                                    ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                            }
                            `}
                        >
                            <FiShield size={11} />
                            {profile.isVerified ? "Verified" : "Not verified"}
                        </span>
                    </div>
                </div>

                {/* Contact info */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                    <div className="flex items-center gap-3 p-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <FiUser size={16} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Full name
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {profile.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <FiMail size={16} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Email address
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {profile.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <FiPhone size={16} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Phone number
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {profile.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick links */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                    {QUICK_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                            <button
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Icon size={16} className="text-primary" />
                                </div>
                                <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white">
                                    {link.label}
                                </span>
                                <FiChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                            </button>
                        );
                    })}
                </div>

                {/* Logout */}
                <button
                    onClick={() => setLogoutConfirmOpen(true)}
                    className="
                    w-full flex items-center justify-center gap-2 rounded-2xl border border-red-200 dark:border-red-900
                    py-3.5 text-sm font-semibold text-red-600 dark:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-950/30
                    transition-colors
                    "
                >
                    <FiLogOut size={16} />
                    Logout
                </button>
            </div>

            {/* Logout confirm modal */}
            {logoutConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setLogoutConfirmOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 space-y-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Log out of your account?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            You'll need to sign in again to book or view appointments.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setLogoutConfirmOpen(false)}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {loggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}