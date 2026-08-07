"use client";

import { useState } from "react";
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiChevronDown,
    FiChevronUp,
    FiScissors,
} from "react-icons/fi";
import {
    Appointment,
    PopulatedBranchRef,
    PopulatedSalonRef,
    PopulatedServiceRef,
    PopulatedStaffRef,
} from "@/src/types/customerBooking.types";
import { AppointmentTab } from "./AppointmentTabs";

interface AppointmentCardProps {
    appointment: Appointment;
    tab: AppointmentTab;
    onCancel: () => void;
    onReschedule: () => void;
}

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    CONFIRMED: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    COMPLETED: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    CANCELLED: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    RESCHEDULED: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
};

const AppointmentCard = ({
    appointment,
    tab,
    onCancel,
    onReschedule,
}: AppointmentCardProps) => {
    const [expanded, setExpanded] = useState(false);

    const salon =
        typeof appointment.salonId === "object"
            ? (appointment.salonId as PopulatedSalonRef)
            : null;
    const branch =
        typeof appointment.branchId === "object"
            ? (appointment.branchId as PopulatedBranchRef)
            : null;
    const staff =
        typeof appointment.staffId === "object"
            ? (appointment.staffId as PopulatedStaffRef)
            : null;
    const services = Array.isArray(appointment.serviceIds)
        ? (appointment.serviceIds.filter(
              (s) => typeof s === "object"
          ) as PopulatedServiceRef[])
        : [];

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full text-left p-4 sm:p-5"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {salon?.logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={salon.logo}
                                    alt={salon.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <FiScissors size={18} className="text-primary" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                                {salon?.name || "Salon"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {appointment.appointmentId}
                            </p>
                        </div>
                    </div>

                    <span
                        className={`
                        shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium
                        ${
                            STATUS_STYLE[appointment.appointmentStatus] ||
                            "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }
                        `}
                    >
                        {appointment.appointmentStatus}
                    </span>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                        <FiCalendar size={12} />
                        {new Date(appointment.appointmentDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short" }
                        )}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FiClock size={12} />
                        {appointment.appointmentTime}
                    </span>
                    {branch?.name && (
                        <span className="flex items-center gap-1.5 truncate">
                            <FiMapPin size={12} />
                            {branch.name}
                        </span>
                    )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ₹{appointment.finalAmount}
                    </p>
                    {expanded ? (
                        <FiChevronUp size={16} className="text-gray-400" />
                    ) : (
                        <FiChevronDown size={16} className="text-gray-400" />
                    )}
                </div>
            </button>

            {expanded && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    {staff?.name && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Staff
                            </span>
                            <span className="text-gray-900 dark:text-white font-medium">
                                {staff.name}
                            </span>
                        </div>
                    )}

                    {services.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                                Services
                            </p>
                            <div className="space-y-1">
                                {services.map((s) => (
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

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Subtotal
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                                ₹{appointment.totalAmount}
                            </span>
                        </div>
                        {appointment.discountAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-green-600 dark:text-green-400">
                                    Discount
                                </span>
                                <span className="text-green-600 dark:text-green-400">
                                    -₹{appointment.discountAmount}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-semibold pt-1">
                            <span className="text-gray-900 dark:text-white">
                                Total
                            </span>
                            <span className="text-gray-900 dark:text-white">
                                ₹{appointment.finalAmount}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs pt-1">
                            <span className="text-gray-400 dark:text-gray-500">
                                Payment status
                            </span>
                            <span
                                className={
                                    appointment.paymentStatus === "SUCCESS" ||
                                    appointment.paymentStatus === "PENDING"
                                        ? "text-gray-500 dark:text-gray-400"
                                        : "text-red-500"
                                }
                            >
                                {appointment.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {appointment.notes && (
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                Notes
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {appointment.notes}
                            </p>
                        </div>
                    )}

                    {tab === "upcoming" && (
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReschedule();
                                }}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Reschedule
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancel();
                                }}
                                className="flex-1 rounded-lg border border-red-200 dark:border-red-900 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;