"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiArrowLeft,
    FiCreditCard,
    FiHome,
    FiCalendar,
    FiClock,
    FiHash,
} from "react-icons/fi";

import { appointmentPaymentService } from "@/src/services/appointmentPaymentService";
import { Payment, PopulatedAppointmentRef } from "@/src/types/customerBooking.types";
import LoadingSkeleton from "@/src/components/common/LoadingSkeleton";

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    SUCCESS: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    FAILED: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    REFUNDED: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
};

export default function PaymentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const paymentId = params.id as string;

    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await appointmentPaymentService.getDetails(paymentId);
                setPayment(res.data.data);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load payment details."
                );
                router.push("/customer/payments");
            } finally {
                setLoading(false);
            }
        })();
    }, [paymentId, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="max-w-lg mx-auto px-4 sm:px-6 pt-6 space-y-4">
                    <LoadingSkeleton variant="salon-row" count={3} />
                </div>
            </div>
        );
    }

    if (!payment) return null;

    const appointment =
        typeof payment.appointmentId === "object" && payment.appointmentId !== null
            ? (payment.appointmentId as PopulatedAppointmentRef)
            : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            <div className="max-w-lg mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <FiArrowLeft size={16} />
                    Back to payments
                </button>

                {/* Amount card */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        {payment.paymentMethod === "OFFLINE" ? (
                            <FiHome size={24} className="text-primary" />
                        ) : (
                            <FiCreditCard size={24} className="text-primary" />
                        )}
                    </div>

                    <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{payment.amount}
                    </p>

                    <span
                        className={`
                        inline-block mt-3 rounded-full px-3 py-1 text-xs font-semibold
                        ${
                            STATUS_STYLE[payment.paymentStatus] ||
                            "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }
                        `}
                    >
                        {payment.paymentStatus}
                    </span>

                    {payment.paymentStatus === "FAILED" && payment.failureReason && (
                        <p className="mt-3 text-xs text-red-500">
                            {payment.failureReason}
                        </p>
                    )}

                    {payment.isRefunded && payment.refundedAt && (
                        <p className="mt-2 text-xs text-blue-500">
                            Refunded on{" "}
                            {new Date(payment.refundedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    )}
                </div>

                {/* Payment info */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-6 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Payment info
                    </p>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <FiHash size={13} />
                            Payment ID
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {payment.paymentId}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Method</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {payment.paymentMethod === "OFFLINE"
                                ? "Pay at Salon"
                                : "Online (Razorpay)"}
                        </span>
                    </div>

                    {payment.razorpayPaymentId && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Transaction ID
                            </span>
                            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[60%]">
                                {payment.razorpayPaymentId}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <FiCalendar size={13} />
                            Date
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>

                {/* Appointment info */}
                {appointment && (
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-6 space-y-3">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Appointment
                        </p>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Appointment ID
                            </span>
                            <span className="text-gray-900 dark:text-white font-medium">
                                {appointment.appointmentId}
                            </span>
                        </div>

                        {appointment.salonId?.name && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Salon
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {appointment.salonId.name}
                                </span>
                            </div>
                        )}

                        {appointment.staffId?.name && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Staff
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {appointment.staffId.name}
                                </span>
                            </div>
                        )}

                        {appointment.serviceIds && appointment.serviceIds.length > 0 && (
                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">
                                    Services
                                </p>
                                <div className="space-y-1">
                                    {appointment.serviceIds.map((s) => (
                                        <div
                                            key={s._id}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {s.name}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                ₹{s.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}