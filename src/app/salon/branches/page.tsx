"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiPlus, FiMapPin, FiSearch, FiClock, FiPhone } from "react-icons/fi";

import { branchService } from "@/src/services/branch/branch.service";
import { Branch } from "@/src/types/branch.types";

export default function BranchesListPage() {
    const router = useRouter();

    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchBranches = useCallback(async (searchTerm?: string) => {
        try {
            setLoading(true);
            const res = await branchService.getAll({
                search: searchTerm || undefined,
            });
            setBranches(res.data.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load branches."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchBranches(search);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, fetchBranches]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                        Branches
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage the physical locations under your salon.
                    </p>
                </div>

                <Link
                    href="/salon/branches/create"
                    className="
                    inline-flex items-center justify-center gap-2
                    rounded-lg bg-primary px-4 py-2.5
                    text-sm font-medium text-white
                    hover:opacity-90
                    "
                >
                    <FiPlus size={18} />
                    Add branch
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <FiSearch
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search branches by name..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 animate-pulse space-y-3"
                        >
                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
                        </div>
                    ))}
                </div>
            ) : branches.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <FiMapPin size={32} className="text-gray-300 dark:text-gray-600" />
                    <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {search ? "No branches match your search" : "No branches yet"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                        {search
                            ? "Try a different name."
                            : "Add your first branch to start assigning staff and services."}
                    </p>
                    {!search && (
                        <Link
                            href="/salon/branches/create"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                        >
                            <FiPlus size={18} />
                            Add branch
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {branches.map((b) => (
                        <button
                            key={b._id}
                            onClick={() => router.push(`/salon/branches/${b._id}`)}
                            className="
                            text-left rounded-2xl border border-gray-200 dark:border-gray-800
                            bg-white dark:bg-gray-900 p-5 sm:p-6
                            hover:border-primary/40 hover:shadow-sm
                            transition-all
                            "
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                        {b.branchId}
                                    </p>
                                    <h3 className="mt-0.5 text-base font-semibold text-gray-900 dark:text-white">
                                        {b.name}
                                    </h3>
                                </div>

                                <span
                                    className={`
                                    shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium
                                    ${
                                        b.isActive
                                            ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                    }
                                    `}
                                >
                                    {b.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            {(b.address || b.city) && (
                                <div className="mt-4 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FiMapPin size={14} className="mt-0.5 shrink-0" />
                                    <span className="line-clamp-2">
                                        {[b.address, b.city, b.state]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </span>
                                </div>
                            )}

                            {b.phone && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FiPhone size={14} className="shrink-0" />
                                    {b.phone}
                                </div>
                            )}

                            {(b.openingTime || b.closingTime) && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FiClock size={14} className="shrink-0" />
                                    {b.openingTime || "—"} – {b.closingTime || "—"}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}