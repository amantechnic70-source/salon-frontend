"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiPlus, FiUsers, FiSearch, FiGift, FiPhone } from "react-icons/fi";

import { customerService } from "@/src/services/customer/customer.service";
import { Customer } from "@/src/types/customer.types";

export default function CustomersListPage() {
    const router = useRouter();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchCustomers = useCallback(async (searchTerm?: string) => {
        try {
            setLoading(true);
            const res = await customerService.getAll({
                search: searchTerm || undefined,
            });
            setCustomers(res.data.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load customers."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCustomers(search);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, fetchCustomers]);

    const totalLoyaltyPoints = customers.reduce(
        (sum, c) => sum + (c.loyaltyPoints || 0),
        0
    );
    const totalRevenue = customers.reduce(
        (sum, c) => sum + (c.totalSpent || 0),
        0
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Customers
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Everyone who's visited or booked at your salon.
                    </p>
                </div>

                <Link
                    href="/salon/customers/create"
                    className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-2.5
                    text-sm font-semibold text-white
                    shadow-sm shadow-primary/20
                    hover:opacity-90 active:scale-[0.98]
                    transition-all
                    "
                >
                    <FiPlus size={18} />
                    Add customer
                </Link>
            </div>

            {/* Stats bar */}
            {!loading && customers.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            Total customers
                        </p>
                        <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {customers.length}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            Total revenue
                        </p>
                        <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            ₹{totalRevenue.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            Loyalty pts issued
                        </p>
                        <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {totalLoyaltyPoints}
                        </p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-sm">
                <FiSearch
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers by name..."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-shadow"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 animate-pulse">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-14 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"
                        />
                    ))}
                </div>
            ) : customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <FiUsers size={24} className="text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {search ? "No customers match your search" : "No customers yet"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                        {search
                            ? "Try a different name."
                            : "Add your first customer to start tracking visits and loyalty."}
                    </p>
                    {!search && (
                        <Link
                            href="/salon/customers/create"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                        >
                            <FiPlus size={18} />
                            Add customer
                        </Link>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-500 dark:text-gray-400">
                                    <th className="px-5 py-3 font-medium">Customer</th>
                                    <th className="px-5 py-3 font-medium">Contact</th>
                                    <th className="px-5 py-3 font-medium">Visits</th>
                                    <th className="px-5 py-3 font-medium">Total spent</th>
                                    <th className="px-5 py-3 font-medium">Loyalty</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((c) => (
                                    <tr
                                        key={c._id}
                                        onClick={() =>
                                            router.push(`/salon/customers/${c._id}`)
                                        }
                                        className="border-b border-gray-100 dark:border-gray-800/60 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {c.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                        {c.customerId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">
                                            <p>{c.phone || "—"}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {c.email || ""}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">
                                            {c.totalVisits}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">
                                            ₹{c.totalSpent.toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                <FiGift size={13} />
                                                {c.loyaltyPoints}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`
                                                rounded-full px-2.5 py-1 text-[11px] font-medium
                                                ${
                                                    c.isActive
                                                        ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                                }
                                                `}
                                            >
                                                {c.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {customers.map((c) => (
                            <button
                                key={c._id}
                                onClick={() => router.push(`/salon/customers/${c._id}`)}
                                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                                            {c.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {c.name}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                <FiPhone size={11} />
                                                {c.phone || "No phone"}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`
                                        rounded-full px-2 py-1 text-[10px] font-medium shrink-0
                                        ${
                                            c.isActive
                                                ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                        }
                                        `}
                                    >
                                        {c.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{c.totalVisits} visits</span>
                                    <span>₹{c.totalSpent.toLocaleString("en-IN")} spent</span>
                                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                        <FiGift size={12} />
                                        {c.loyaltyPoints}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}