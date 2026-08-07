"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiPlus,
    FiScissors,
    FiSearch,
    FiClock,
    FiStar,
    FiTag,
    FiImage,
} from "react-icons/fi";

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

    const activeCount = services.filter((s) => s.isActive).length;
    const avgPrice =
        services.length > 0
            ? Math.round(
                  services.reduce((sum, s) => sum + (s.discountPrice || s.price), 0) /
                      services.length
              )
            : 0;
    const categoriesInUse = new Set(services.map((s) => s.category).filter(Boolean))
        .size;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
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
                    rounded-xl bg-primary px-4 py-2.5
                    text-sm font-semibold text-white
                    shadow-sm shadow-primary/20
                    hover:opacity-90 active:scale-[0.98]
                    transition-all
                    "
                >
                    <FiPlus size={18} />
                    Add service
                </Link>
            </div>

            {/* Stats bar */}
            {!loading && services.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            Total services
                        </p>
                        <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {services.length}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            Active
                        </p>
                        <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {activeCount}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            Avg. price
                        </p>
                        <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            ₹{avgPrice}
                        </p>
                    </div>
                </div>
            )}

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
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-shadow"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                    {CATEGORY_FILTERS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`
                            shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold
                            transition-all whitespace-nowrap
                            ${
                                category === c
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
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
                            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden animate-pulse"
                        >
                            <div className="h-36 bg-gray-100 dark:bg-gray-800" />
                            <div className="p-5 space-y-3">
                                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                                <div className="h-5 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
                                <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                                <div className="h-6 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <FiScissors size={24} className="text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
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
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
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
                        const branchName = getBranchName(s.branchId);

                        return (
                            <button
                                key={s._id}
                                onClick={() => router.push(`/salon/services/${s._id}`)}
                                className="
                                group text-left rounded-2xl overflow-hidden
                                border border-gray-200 dark:border-gray-800
                                bg-white dark:bg-gray-900
                                hover:border-primary/40 hover:shadow-lg hover:shadow-gray-200/60 dark:hover:shadow-black/30
                                hover:-translate-y-0.5
                                transition-all duration-200
                                "
                            >
                                {/* Image / placeholder */}
                                <div className="relative h-36 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    {s.serviceImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={s.serviceImage}
                                            alt={s.name}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <FiImage
                                                size={28}
                                                className="text-gray-300 dark:text-gray-700"
                                            />
                                        </div>
                                    )}

                                    {/* Gradient overlay for badge legibility */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

                                    {/* Top badges */}
                                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                                        {s.category ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
                                                <FiTag size={10} />
                                                {s.category}
                                            </span>
                                        ) : (
                                            <span />
                                        )}

                                        {s.isPopular && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                                                <FiStar size={10} />
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
                                            {s.name}
                                        </h3>
                                        <span
                                            className={`
                                            shrink-0 mt-0.5 h-2 w-2 rounded-full
                                            ${s.isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}
                                            `}
                                            title={s.isActive ? "Active" : "Inactive"}
                                        />
                                    </div>

                                    {s.description && (
                                        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                            {s.description}
                                        </p>
                                    )}

                                    <div className="mt-4 flex items-end justify-between">
                                        <div className="flex items-baseline gap-2">
                                            {hasDiscount ? (
                                                <>
                                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                        ₹{s.discountPrice}
                                                    </span>
                                                    <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                                        ₹{s.price}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                    ₹{s.price}
                                                </span>
                                            )}
                                        </div>

                                        {hasDiscount && (
                                            <span className="text-[11px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full">
                                                {s.discount}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <FiClock size={13} />
                                            {s.duration} mins
                                        </span>
                                        {branchName && (
                                            <span className="truncate max-w-[45%]">
                                                {branchName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}