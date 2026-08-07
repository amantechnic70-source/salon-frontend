"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiCalendar, FiX } from "react-icons/fi";

import { Appointment } from "@/src/types/customerBooking.types";

import AppointmentTabs, { AppointmentTab } from "@/src/components/common/AppointmentTabs";
import AppointmentCard from "@/src/components/common/AppointmentCard";
import LoadingSkeleton from "@/src/components/common/LoadingSkeleton";
import EmptyState from "@/src/components/common/EmptyState";
import { customerBookingService } from "@/src/services/service/customerBookingService";

export default function MyAppointmentsPage() {
    const router = useRouter();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<AppointmentTab>("upcoming");

    const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);

    const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [loadingRescheduleSlots, setLoadingRescheduleSlots] = useState(false);
    const [rescheduling, setRescheduling] = useState(false);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await customerBookingService.getMyBookings({
                page: 1,
                limit: 100,
            });
            setAppointments(res.data.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load appointments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const { upcoming, completed, cancelled } = useMemo(() => {
        const now = new Date().setHours(0, 0, 0, 0);

        const upcoming: Appointment[] = [];
        const completed: Appointment[] = [];
        const cancelled: Appointment[] = [];

        appointments.forEach((a) => {
            if (a.isCancelled) {
                cancelled.push(a);
            } else if (a.isCompleted) {
                completed.push(a);
            } else if (new Date(a.appointmentDate).getTime() >= now) {
                upcoming.push(a);
            } else {
                // Past, not explicitly completed/cancelled — treat as completed
                // for display purposes since salon owner may not have marked it.
                completed.push(a);
            }
        });

        upcoming.sort(
            (a, b) =>
                new Date(a.appointmentDate).getTime() -
                new Date(b.appointmentDate).getTime()
        );
        completed.sort(
            (a, b) =>
                new Date(b.appointmentDate).getTime() -
                new Date(a.appointmentDate).getTime()
        );
        cancelled.sort(
            (a, b) =>
                new Date(b.appointmentDate).getTime() -
                new Date(a.appointmentDate).getTime()
        );

        return { upcoming, completed, cancelled };
    }, [appointments]);

    const activeList =
        tab === "upcoming" ? upcoming : tab === "completed" ? completed : cancelled;

    const handleCancelConfirm = async () => {
        if (!cancelTarget) return;
        setCancelling(true);
        try {
            const res = await customerBookingService.cancelBooking({
                appointmentId: cancelTarget._id,
                reason: cancelReason.trim() || undefined,
            });
            toast.success(res.data.message || "Appointment cancelled.");
            setAppointments((prev) =>
                prev.map((a) => (a._id === cancelTarget._id ? res.data.data : a))
            );
            setCancelTarget(null);
            setCancelReason("");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not cancel appointment."
            );
        } finally {
            setCancelling(false);
        }
    };

    const openReschedule = (appointment: Appointment) => {
        setRescheduleTarget(appointment);
        setRescheduleDate("");
        setRescheduleTime("");
        setRescheduleSlots([]);
    };

    useEffect(() => {
        if (!rescheduleTarget || !rescheduleDate) return;

        const staffId =
            typeof rescheduleTarget.staffId === "object"
                ? rescheduleTarget.staffId._id
                : rescheduleTarget.staffId;
        const branchId =
            typeof rescheduleTarget.branchId === "object"
                ? rescheduleTarget.branchId._id
                : rescheduleTarget.branchId;

        (async () => {
            try {
                setLoadingRescheduleSlots(true);
                setRescheduleTime("");
                const res = await customerBookingService.getAvailableSlots({
                    branchId,
                    staffId,
                    appointmentDate: rescheduleDate,
                });
                setRescheduleSlots(res.data.data ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load time slots."
                );
            } finally {
                setLoadingRescheduleSlots(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rescheduleDate, rescheduleTarget]);

    const handleRescheduleConfirm = async () => {
        if (!rescheduleTarget || !rescheduleDate || !rescheduleTime) {
            toast.error("Please select a date and time.");
            return;
        }

        setRescheduling(true);
        try {
            const res = await customerBookingService.rescheduleBooking({
                appointmentId: rescheduleTarget._id,
                appointmentDate: rescheduleDate,
                appointmentTime: rescheduleTime,
            });
            toast.success(res.data.message || "Appointment rescheduled.");
            setAppointments((prev) =>
                prev.map((a) =>
                    a._id === rescheduleTarget._id ? res.data.data : a
                )
            );
            setRescheduleTarget(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not reschedule."
            );
        } finally {
            setRescheduling(false);
        }
    };

    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-5">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        My Appointments
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Track, reschedule, or cancel your bookings.
                    </p>
                </div>

                <AppointmentTabs
                    active={tab}
                    onChange={setTab}
                    counts={{
                        upcoming: upcoming.length,
                        completed: completed.length,
                        cancelled: cancelled.length,
                    }}
                />

                {loading ? (
                    <LoadingSkeleton variant="salon-row" count={4} />
                ) : activeList.length === 0 ? (
                    <EmptyState
                        icon={FiCalendar}
                        title={`No ${tab} appointments`}
                        description={
                            tab === "upcoming"
                                ? "Book a salon appointment to see it here."
                                : undefined
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {activeList.map((a) => (
                            <AppointmentCard
                                key={a._id}
                                appointment={a}
                                tab={tab}
                                onCancel={() => setCancelTarget(a)}
                                onReschedule={() => openReschedule(a)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel modal */}
            {cancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setCancelTarget(null)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 space-y-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Cancel this appointment?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {cancelTarget.appointmentId} on{" "}
                            {new Date(cancelTarget.appointmentDate).toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" }
                            )}{" "}
                            at {cancelTarget.appointmentTime}
                        </p>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Reason (optional)
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                rows={2}
                                placeholder="Let us know why..."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelTarget(null)}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Go back
                            </button>
                            <button
                                onClick={handleCancelConfirm}
                                disabled={cancelling}
                                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {cancelling ? "Cancelling..." : "Confirm cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule modal */}
            {rescheduleTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setRescheduleTarget(null)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                Reschedule appointment
                            </h3>
                            <button
                                onClick={() => setRescheduleTarget(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                New date
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {rescheduleDate && (
                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    New time
                                </label>
                                {loadingRescheduleSlots ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : rescheduleSlots.length === 0 ? (
                                    <p className="text-sm text-gray-400 dark:text-gray-500 py-2">
                                        No slots available for this date.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {rescheduleSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setRescheduleTime(slot)}
                                                className={`
                                                rounded-lg border py-2 text-xs font-medium transition-colors
                                                ${
                                                    rescheduleTime === slot
                                                        ? "bg-primary text-white border-primary"
                                                        : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                                                }
                                                `}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setRescheduleTarget(null)}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRescheduleConfirm}
                                disabled={rescheduling || !rescheduleTime}
                                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {rescheduling ? "Saving..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}