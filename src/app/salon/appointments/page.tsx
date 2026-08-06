"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiPlus, FiCalendar, FiSearch, FiClock } from "react-icons/fi";

import { appointmentService } from "@/src/services/appointment/appointment.service";
import { Appointment } from "@/src/types/appointment.types";
import { Customer } from "@/src/types/customer.types";
import { Staff } from "@/src/types/staff.types";

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    CONFIRMED: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    COMPLETED: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    CANCELLED: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    RESCHEDULED: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
};

const getCustomerName = (c: Appointment["customerId"]) =>
    typeof c === "object" ? (c as Customer).name : "Unknown";

const getStaffName = (s: Appointment["staffId"]) =>
    typeof s === "object" ? (s as Staff).name : "Unknown";

export default function AppointmentsListPage() {
    const router = useRouter();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchAppointments = useCallback(async (searchTerm?: string) => {
        try {
            setLoading(true);
            const res = await appointmentService.getAll({
                search: searchTerm || undefined,
            });
            setAppointments(res.data.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load appointments."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchAppointments(search);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, fetchAppointments]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Appointments
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        All bookings across your branches.
                    </p>
                </div>

                <Link
                    href="/salon/appointments/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    <FiPlus size={18} />
                    Book appointment
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
                    placeholder="Search by appointment ID..."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-shadow"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 animate-pulse">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-16 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"
                        />
                    ))}
                </div>
            ) : appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <FiCalendar size={24} className="text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {search ? "No appointments match your search" : "No appointments yet"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                        {search
                            ? "Try a different appointment ID."
                            : "Book your first appointment to get started."}
                    </p>
                    {!search && (
                        <Link
                            href="/salon/appointments/create"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                        >
                            <FiPlus size={18} />
                            Book appointment
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {appointments.map((a) => (
                        <button
                            key={a._id}
                            onClick={() => router.push(`/salon/appointments/${a._id}`)}
                            className="w-full text-left rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                                        {getCustomerName(a.customerId).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {getCustomerName(a.customerId)}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {a.appointmentId} · with {getStaffName(a.staffId)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                                    <div className="text-right sm:text-left">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                                            <FiClock size={13} />
                                            {new Date(a.appointmentDate).toLocaleDateString(
                                                "en-IN",
                                                { day: "numeric", month: "short" }
                                            )}{" "}
                                            · {a.appointmentTime}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                                            ₹{a.finalAmount}
                                        </p>
                                    </div>

                                    <span
                                        className={`
                                        shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium
                                        ${
                                            STATUS_STYLE[a.appointmentStatus] ||
                                            "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                        }
                                        `}
                                    >
                                        {a.appointmentStatus}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}