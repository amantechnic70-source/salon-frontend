"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FiCreditCard } from "react-icons/fi";

import { appointmentPaymentService } from "@/src/services/appointmentPaymentService";
import { Payment } from "@/src/types/customerBooking.types";

import PaymentCard from "@/src/components/common/PaymentCard";
import LoadingSkeleton from "@/src/components/common/LoadingSkeleton";
import EmptyState from "@/src/components/common/EmptyState";
import Pagination from "@/src/components/common/Pagination";

const STATUS_FILTERS = ["All", "SUCCESS", "PENDING", "FAILED", "REFUNDED"] as const;
const METHOD_FILTERS = ["All", "ONLINE", "OFFLINE"] as const;
const LIMIT = 10;

export default function PaymentsHistoryPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] =
        useState<(typeof STATUS_FILTERS)[number]>("All");
    const [methodFilter, setMethodFilter] =
        useState<(typeof METHOD_FILTERS)[number]>("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchPayments = useCallback(
        async (
            pageNum: number,
            status: (typeof STATUS_FILTERS)[number],
            method: (typeof METHOD_FILTERS)[number]
        ) => {
            try {
                setLoading(true);
                const res = await appointmentPaymentService.getHistory({
                    page: pageNum,
                    limit: LIMIT,
                    paymentStatus: status !== "All" ? status : undefined,
                    paymentMethod: method !== "All" ? method : undefined,
                });
                setPayments(res.data.data ?? []);
                setTotalPages(res.data.pagination?.totalPages ?? 1);
                setTotal(res.data.pagination?.total ?? 0);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load payment history."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        setPage(1);
        fetchPayments(1, statusFilter, methodFilter);
    }, [statusFilter, methodFilter, fetchPayments]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchPayments(newPage, statusFilter, methodFilter);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const totalSpent = payments
        .filter((p) => p.paymentStatus === "SUCCESS")
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-5">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Payments
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {loading
                            ? "Loading..."
                            : `${total} payment${total !== 1 ? "s" : ""} on this page`}
                    </p>
                </div>

                {/* Summary */}
                {!loading && payments.length > 0 && (
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total spent (this page)
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{totalSpent.toLocaleString("en-IN")}
                        </span>
                    </div>
                )}

                {/* Filters */}
                <div className="space-y-2">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {STATUS_FILTERS.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`
                                shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold
                                transition-all whitespace-nowrap
                                ${
                                    statusFilter === s
                                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300"
                                }
                                `}
                            >
                                {s === "All" ? "All statuses" : s}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {METHOD_FILTERS.map((m) => (
                            <button
                                key={m}
                                onClick={() => setMethodFilter(m)}
                                className={`
                                shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium
                                transition-all whitespace-nowrap
                                ${
                                    methodFilter === m
                                        ? "bg-primary/10 text-primary border border-primary/30"
                                        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
                                }
                                `}
                            >
                                {m === "All" ? "All methods" : m === "ONLINE" ? "Online" : "Offline"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <LoadingSkeleton variant="salon-row" count={5} />
                ) : payments.length === 0 ? (
                    <EmptyState
                        icon={FiCreditCard}
                        title="No payments found"
                        description={
                            statusFilter !== "All" || methodFilter !== "All"
                                ? "Try a different filter."
                                : "Your appointment payments will show up here."
                        }
                    />
                ) : (
                    <>
                        <div className="space-y-3">
                            {payments.map((p) => (
                                <PaymentCard key={p._id} payment={p} />
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