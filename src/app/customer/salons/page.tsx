"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiScissors, FiX } from "react-icons/fi";

import { Salon } from "@/src/types/customerBooking.types";

import Pagination from "@/src/components/common/Pagination";
import { customerBookingService } from "@/src/services/service/customerBookingService";
import LoadingSkeleton from "@/src/components/common/LoadingSkeleton";
import EmptyState from "@/src/components/common/EmptyState";
import SalonCard from "@/src/components/common/SalonCard";

const LIMIT = 10;

function SalonsListContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialSearch = searchParams.get("search") || searchParams.get("category") || "";
    const initialCity = searchParams.get("city") || "";

    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(initialSearch);
    const [city, setCity] = useState(initialCity);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchSalons = useCallback(
        async (pageNum: number, searchTerm: string, cityTerm: string) => {
            try {
                setLoading(true);
                const res = await customerBookingService.getSalons({
                    page: pageNum,
                    limit: LIMIT,
                    search: searchTerm || undefined,
                    city: cityTerm || undefined,
                });
                setSalons(res.data.data ?? []);
                setTotalPages(res.data.pagination?.totalPages ?? 1);
                setTotal(res.data.pagination?.total ?? 0);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load salons."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchSalons(1, initialSearch, initialCity);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            fetchSalons(1, search, city);
        }, 400);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, city]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchSalons(newPage, search, city);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleClearFilters = () => {
        setSearch("");
        setCity("");
        router.replace("/customer/salons");
    };

    const hasActiveFilters = Boolean(search || city);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-5">
                {/* Header */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Find a salon
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {loading
                            ? "Searching..."
                            : `${total} salon${total !== 1 ? "s" : ""} available`}
                    </p>
                </div>

                {/* Search + city filter */}
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search salons by name..."
                            className="
                            w-full rounded-2xl border border-gray-200 dark:border-gray-800
                            bg-white dark:bg-gray-900
                            pl-4 pr-4 py-3.5
                            text-sm text-gray-900 dark:text-white placeholder:text-gray-400
                            shadow-sm shadow-gray-200/50 dark:shadow-black/20
                            outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                            transition-shadow
                            "
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="
                            flex-1 sm:flex-none sm:w-48 rounded-xl border border-gray-200 dark:border-gray-800
                            bg-white dark:bg-gray-900
                            px-3.5 py-2.5
                            text-sm text-gray-900 dark:text-white placeholder:text-gray-400
                            outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                            transition-shadow
                            "
                        />

                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 shrink-0"
                            >
                                <FiX size={13} />
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <LoadingSkeleton variant="salon-row" count={5} />
                ) : salons.length === 0 ? (
                    <EmptyState
                        icon={FiScissors}
                        title="No salons found"
                        description={
                            hasActiveFilters
                                ? "Try a different search or clear your filters."
                                : "Check back soon for new salons in your area."
                        }
                    />
                ) : (
                    <>
                        <div className="space-y-3">
                            {salons.map((s) => (
                                <SalonCard key={s._id} salon={s} />
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default function SalonsListPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
                        <LoadingSkeleton variant="salon-row" count={5} />
                    </div>
                </div>
            }
        >
            <SalonsListContent />
        </Suspense>
    );
}