"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiPlus, FiUsers, FiSearch, FiEdit2 } from "react-icons/fi";

import { staffService } from "@/src/services/staff/staff.service";
import { Staff } from "@/src/types/staff.types";

export default function StaffListPage() {
    const router = useRouter();

    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchStaff = useCallback(async (searchTerm?: string) => {
        try {
            setLoading(true);
            const res = await staffService.getAll({
                search: searchTerm || undefined,
            });
            setStaff(res.data.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load staff."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchStaff(search);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, fetchStaff]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                        Staff
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage the people working across your branches.
                    </p>
                </div>

                <Link
                    href="/salon/staff/create"
                    className="
                    inline-flex items-center justify-center gap-2
                    rounded-lg bg-primary px-4 py-2.5
                    text-sm font-medium text-white
                    hover:opacity-90
                    "
                >
                    <FiPlus size={18} />
                    Add staff
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
                    placeholder="Search staff by name..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 animate-pulse">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"
                        />
                    ))}
                </div>
            ) : staff.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <FiUsers size={32} className="text-gray-300 dark:text-gray-600" />
                    <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {search ? "No staff match your search" : "No staff yet"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                        {search
                            ? "Try a different name."
                            : "Add your first staff member to get started."}
                    </p>
                    {!search && (
                        <Link
                            href="/salon/staff/create"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                        >
                            <FiPlus size={18} />
                            Add staff
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
                                    <th className="px-5 py-3 font-medium">Staff</th>
                                    <th className="px-5 py-3 font-medium">Designation</th>
                                    <th className="px-5 py-3 font-medium">Contact</th>
                                    <th className="px-5 py-3 font-medium">Salary</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map((s) => (
                                    <tr
                                        key={s._id}
                                        className="border-b border-gray-100 dark:border-gray-800/60 last:border-0"
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                                                    {s.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {s.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                        {s.staffId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">
                                            {s.designation || "—"}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">
                                            <p>{s.phone || "—"}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {s.email || ""}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">
                                            {s.salary
                                                ? `₹${s.salary.toLocaleString("en-IN")}`
                                                : "—"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`
                                                rounded-full px-2.5 py-1 text-[11px] font-medium
                                                ${
                                                    s.isActive
                                                        ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                                }
                                                `}
                                            >
                                                {s.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() =>
                                                        router.push(`/salon/staff/${s._id}`)
                                                    }
                                                    className="p-2 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10"
                                                    aria-label="Edit staff"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {staff.map((s) => (
                            <button
                                key={s._id}
                                onClick={() => router.push(`/salon/staff/${s._id}`)}
                                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                                            {s.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {s.name}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {s.designation || s.staffId}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`
                                        rounded-full px-2 py-1 text-[10px] font-medium shrink-0
                                        ${
                                            s.isActive
                                                ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                        }
                                        `}
                                    >
                                        {s.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    <p>{s.phone || "No phone"}</p>
                                    <p>
                                        {s.salary
                                            ? `₹${s.salary.toLocaleString("en-IN")}/mo`
                                            : ""}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}