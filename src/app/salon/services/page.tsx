"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiPlus, FiScissors, FiSearch, FiClock, FiStar } from "react-icons/fi";

import { serviceService } from "@/src/services/service/service.service";
import { Service } from "@/src/types/service.types";

const CATEGORY_FILTERS = [
    "All",
    "Hair",
    "Skin Care",
    "Nail Care",
    "Spa & Massage",
    "Makeup",
    "Waxing",
    "Grooming",
];

export default function ServicesListPage() {
    const router = useRouter();

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const fetchServices = useCallback(
        async (searchTerm?: string, categoryFilter?: string) => {
            try {
                setLoading(true);
                const res = await serviceService.getAll({
                    search: searchTerm || undefined,
                    category:
                        categoryFilter && categoryFilter !== "All"
                            ? categoryFilter
                            : undefined,
                });
                setServices(res.data.data ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load services."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchServices(search, category);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, category, fetchServices]);

    const getBranchName = (branchId: Service["branchId"]) =>
        typeof branchId === "object" ? branchId.name : "";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                        Services
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage what customers can book at your salon.
                    </p>
                </div>

                <Link
                    href="/salon/services/create"
                    className="
                    inline-flex items-center justify-center gap-2
                    rounded-lg bg-primary px-4 py-2.5
                    text-sm font-medium text-white
                    hover:opacity-90
                    "
                >
                    <FiPlus size={18} />
                    Add service
                </Link>
            </div>

            {/* Search + category filters */}
            <div className="space-y-3">
                <div className="relative max-w-sm">
                    <FiSearch
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search services by name..."
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                    {CATEGORY_FILTERS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`
                            shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium
                            transition-colors whitespace-nowrap
                            ${
                                category === c
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }
                            `}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 animate-pulse space-y-3"
                        >
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
                        </div>
                    ))}
                </div>
            ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <FiScissors size={32} className="text-gray-300 dark:text-gray-600" />
                    <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {search || category !== "All"
                            ? "No services match your filters"
                            : "No services yet"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                        {search || category !== "All"
                            ? "Try a different search or category."
                            : "Add your first service to start taking bookings."}
                    </p>
                    {!search && category === "All" && (
                        <Link
                            href="/salon/services/create"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                        >
                            <FiPlus size={18} />
                            Add service
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((s) => {
                        const hasDiscount = s.discount > 0;

                        return (
                            <button
                                key={s._id}
                                onClick={() => router.push(`/salon/services/${s._id}`)}
                                className="
                                relative text-left rounded-2xl border border-gray-200 dark:border-gray-800
                                bg-white dark:bg-gray-900 p-5 sm:p-6
                                hover:border-primary/40 hover:shadow-sm
                                transition-all
                                "
                            >
                                {s.isPopular && (
                                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2 py-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                        <FiStar size={10} />
                                        Popular
                                    </span>
                                )}

                                <div className="flex items-start justify-between gap-3 pr-16">
                                    <div>
                                        {s.category && (
                                            <p className="text-xs font-medium text-primary">
                                                {s.category}
                                            </p>
                                        )}
                                        <h3 className="mt-0.5 text-base font-semibold text-gray-900 dark:text-white">
                                            {s.name}
                                        </h3>
                                    </div>
                                </div>

                                {s.description && (
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {s.description}
                                    </p>
                                )}

                                <div className="mt-4 flex items-center gap-2">
                                    {hasDiscount ? (
                                        <>
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                ₹{s.discountPrice}
                                            </span>
                                            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                                ₹{s.price}
                                            </span>
                                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                                {s.discount}% off
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            ₹{s.price}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FiClock size={12} />
                                        {s.duration} mins
                                    </span>
                                    {getBranchName(s.branchId) && (
                                        <span>{getBranchName(s.branchId)}</span>
                                    )}
                                </div>

                                <span
                                    className={`
                                    mt-3 inline-block rounded-full px-2 py-1 text-[10px] font-medium
                                    ${
                                        s.isActive
                                            ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                    }
                                    `}
                                >
                                    {s.isActive ? "Active" : "Inactive"}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}