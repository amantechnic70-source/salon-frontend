"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiUser,
    FiScissors,
    FiTag,
    FiX,
} from "react-icons/fi";

import { appointmentService } from "@/src/services/appointment/appointment.service";
import { Appointment } from "@/src/types/appointment.types";
import { Customer } from "@/src/types/customer.types";
import { Staff } from "@/src/types/staff.types";
import { PopulatedBranch, Service } from "@/src/types/service.types";

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    CONFIRMED: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    COMPLETED: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    CANCELLED: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    RESCHEDULED: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
};

const NEXT_STATUS_OPTIONS = ["PENDING", "CONFIRMED", "COMPLETED"];

export default function AppointmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const appointmentId = params.id as string;

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [rescheduling, setRescheduling] = useState(false);

    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);

    const fetchAppointment = async () => {
        try {
            const res = await appointmentService.getById(appointmentId);
            setAppointment(res.data.data);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load appointment."
            );
            router.push("/salon/appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId]);

    const handleStatusChange = async (status: string) => {
        setUpdatingStatus(true);
        try {
            const res = await appointmentService.updateStatus(appointmentId, {
                appointmentStatus: status,
                isCompleted: status === "COMPLETED",
            });
            setAppointment(res.data.data);
            toast.success(res.data.message || "Status updated.");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not update status."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleReschedule = async () => {
        if (!rescheduleDate || !rescheduleTime) {
            toast.error("Select a new date and time.");
            return;
        }

        setRescheduling(true);
        try {
            const res = await appointmentService.reschedule(appointmentId, {
                appointmentDate: rescheduleDate,
                appointmentTime: rescheduleTime,
            });
            setAppointment(res.data.data);
            toast.success(res.data.message || "Appointment rescheduled.");
            setRescheduleOpen(false);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not reschedule."
            );
        } finally {
            setRescheduling(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a cancellation reason.");
            return;
        }

        setCancelling(true);
        try {
            const res = await appointmentService.cancel(appointmentId, {
                reason: cancelReason.trim(),
            });
            setAppointment(res.data.data);
            toast.success(res.data.message || "Appointment cancelled.");
            setCancelOpen(false);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not cancel appointment."
            );
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 animate-pulse space-y-4">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
            </div>
        );
    }

    if (!appointment) return null;

    const customer =
        typeof appointment.customerId === "object"
            ? (appointment.customerId as Customer)
            : null;
    const staff =
        typeof appointment.staffId === "object"
            ? (appointment.staffId as Staff)
            : null;
    const branch =
        typeof appointment.branchId === "object"
            ? (appointment.branchId as PopulatedBranch)
            : null;
    const services = Array.isArray(appointment.serviceIds)
        ? (appointment.serviceIds.filter(
              (s) => typeof s === "object"
          ) as Service[])
        : [];

    const isLocked = appointment.isCompleted || appointment.isCancelled;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/salon/appointments"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                <FiArrowLeft size={16} />
                Back to appointments
            </Link>

            {/* Header card */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-8">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {appointment.appointmentId}
                        </p>
                        <h1 className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            {customer?.name || "Unknown customer"}
                        </h1>
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            STATUS_STYLE[appointment.appointmentStatus] ||
                            "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                    >
                        {appointment.appointmentStatus}
                    </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2.5">
                        <FiCalendar size={16} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Date
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(appointment.appointmentDate).toLocaleDateString(
                                    "en-IN",
                                    { weekday: "short", day: "numeric", month: "short" }
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                        <FiClock size={16} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Time
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {appointment.appointmentTime}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                        <FiUser size={16} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Staff
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {staff?.name || "—"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                        <FiTag size={16} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Branch
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {branch?.name || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Services
                    </p>
                    <div className="space-y-2">
                        {services.map((s) => (
                            <div
                                key={s._id}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <FiScissors size={13} className="text-gray-400" />
                                    {s.name}
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    ₹{s.discount > 0 ? s.discountPrice : s.price}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>₹{appointment.totalAmount}</span>
                        </div>
                        {appointment.discountAmount > 0 && (
                            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                <span>Discount</span>
                                <span>-₹{appointment.discountAmount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-1">
                            <span>Total</span>
                            <span>₹{appointment.finalAmount}</span>
                        </div>
                    </div>
                </div>

                {appointment.notes && (
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Notes
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {appointment.notes}
                        </p>
                    </div>
                )}
            </div>

            {/* Actions */}
            {!isLocked && (
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-6 space-y-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Manage appointment
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {NEXT_STATUS_OPTIONS.map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                disabled={
                                    updatingStatus ||
                                    appointment.appointmentStatus === status
                                }
                                className={`
                                rounded-lg px-3.5 py-2 text-xs font-medium transition-colors
                                disabled:cursor-not-allowed disabled:opacity-50
                                ${
                                    appointment.appointmentStatus === status
                                        ? "bg-primary text-white"
                                        : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }
                                `}
                            >
                                Mark as {status}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={() => {
                                setRescheduleDate(
                                    appointment.appointmentDate.slice(0, 10)
                                );
                                setRescheduleTime(appointment.appointmentTime);
                                setRescheduleOpen(true);
                            }}
                            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Reschedule
                        </button>
                        <button
                            onClick={() => setCancelOpen(true)}
                            className="flex-1 rounded-lg border border-red-200 dark:border-red-900 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                            Cancel appointment
                        </button>
                    </div>
                </div>
            )}

            {/* Reschedule modal */}
            {rescheduleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setRescheduleOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                Reschedule appointment
                            </h3>
                            <button
                                onClick={() => setRescheduleOpen(false)}
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
                                min={new Date().toISOString().slice(0, 10)}
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                New time
                            </label>
                            <input
                                type="text"
                                value={rescheduleTime}
                                onChange={(e) => setRescheduleTime(e.target.value)}
                                placeholder="e.g. 03:00 PM"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setRescheduleOpen(false)}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReschedule}
                                disabled={rescheduling}
                                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {rescheduling ? "Saving..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel modal */}
            {cancelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setCancelOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 space-y-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Cancel this appointment?
                        </h3>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                rows={3}
                                placeholder="Why is this being cancelled?"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelOpen(false)}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Go back
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {cancelling ? "Cancelling..." : "Confirm cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}