"use client";

import Link from "next/link";
import {
    FiCreditCard,
    FiHome,
    FiCalendar,
    FiChevronRight,
} from "react-icons/fi";
import { Payment, PopulatedAppointmentRef } from "@/src/types/customerBooking.types";

interface PaymentCardProps {
    payment: Payment;
}

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    SUCCESS: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    FAILED: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    REFUNDED: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
};

const PaymentCard = ({ payment }: PaymentCardProps) => {
    const appointment =
        typeof payment.appointmentId === "object" && payment.appointmentId !== null
            ? (payment.appointmentId as PopulatedAppointmentRef)
            : null;

    const salonName = appointment?.salonId?.name || "Appointment payment";

    return (
        <Link
            href={`/customer/payments/${payment._id}`}
            className="
            flex items-center gap-4 rounded-2xl p-4
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            hover:border-primary/40 hover:shadow-sm
            transition-all
            "
        >
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {payment.paymentMethod === "OFFLINE" ? (
                    <FiHome size={18} className="text-primary" />
                ) : (
                    <FiCreditCard size={18} className="text-primary" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {salonName}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    <span>{payment.paymentId}</span>
                    <span className="flex items-center gap-1">
                        <FiCalendar size={11} />
                        {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                        })}
                    </span>
                </div>
            </div>

            <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                    ₹{payment.amount}
                </p>
                <span
                    className={`
                    inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium
                    ${
                        STATUS_STYLE[payment.paymentStatus] ||
                        "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }
                    `}
                >
                    {payment.paymentStatus}
                </span>
            </div>

            <FiChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
        </Link>
    );
};

export default PaymentCard;