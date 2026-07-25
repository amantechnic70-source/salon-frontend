"use client";

import { FiEdit2, FiTrash2, FiUsers, FiMapPin, FiCalendar } from "react-icons/fi";
import { SubscriptionPlan } from "@/src/types/subscription.types";

interface PlanCardProps {
    plan: SubscriptionPlan;
    onEdit: () => void;
    onDelete: () => void;
}

const PlanCard = ({ plan, onEdit, onDelete }: PlanCardProps) => {
    return (
        <div
            className="
            rounded-2xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            p-5 sm:p-6
            flex flex-col
            "
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                        {plan.planId}
                    </p>
                    <h3 className="mt-0.5 text-lg font-semibold text-gray-900 dark:text-white">
                        {plan.name}
                    </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={onEdit}
                        className="p-2 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10"
                        aria-label="Edit plan"
                    >
                        <FiEdit2 size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        aria-label="Delete plan"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{plan.amount.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                    / {plan.durationInDays} days
                </span>
            </div>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {plan.description}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col items-center text-center gap-1">
                    <FiUsers size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {plan.maxStaff}
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        Staff
                    </span>
                </div>

                <div className="flex flex-col items-center text-center gap-1">
                    <FiMapPin size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {plan.maxBranches}
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        Branches
                    </span>
                </div>

                <div className="flex flex-col items-center text-center gap-1">
                    <FiCalendar size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {plan.maxBookings}
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        Bookings
                    </span>
                </div>
            </div>

            <span
                className={`
                mt-4 self-start rounded-full px-2.5 py-1 text-[11px] font-medium
                ${
                    plan.isActive
                        ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }
                `}
            >
                {plan.isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
};

export default PlanCard;