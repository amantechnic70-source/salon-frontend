"use client";

import { FiCheck, FiStar, FiUsers, FiMapPin, FiCalendar } from "react-icons/fi";
import { SubscriptionPlan } from "@/src/types/subscription.types";

interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
    onSelect: (plan: SubscriptionPlan) => void;
    processing: boolean;
    selectedPlanId: string | null;
}

const SubscriptionPlanCard = ({
    plan,
    onSelect,
    processing,
    selectedPlanId,
}: SubscriptionPlanCardProps) => {
    const isThisProcessing = processing && selectedPlanId === plan._id;

    return (
        <div
            className={`
            relative flex flex-col rounded-2xl border p-6 sm:p-7
            bg-white dark:bg-gray-900
            transition-shadow
            ${plan.isPopular
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-gray-200 dark:border-gray-800"
                }
            `}
        >
            {plan.isPopular && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white">
                    <FiStar size={11} />
                    Most Popular
                </span>
            )}

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {plan.name}
            </h3>

            <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{plan.amount.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                    / {plan.durationInDays} days
                </span>
            </div>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {plan.description}
            </p>

            <div className="mt-5 space-y-2.5 flex-1">
                <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <FiUsers size={15} className="text-primary shrink-0" />
                    Up to {plan.maxStaff} staff members
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <FiMapPin size={15} className="text-primary shrink-0" />
                    Up to {plan.maxBranches} branches
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <FiCalendar size={15} className="text-primary shrink-0" />
                    Up to {plan.maxBookings} bookings/month
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <FiCheck size={15} className="text-primary shrink-0" />
                    {plan.durationInDays}-day validity
                </div>
            </div>

            <button
                onClick={() => onSelect(plan)}
                disabled={processing}
                className={`
                mt-6 w-full rounded-xl py-3 text-sm font-semibold
                transition-all disabled:cursor-not-allowed disabled:opacity-60
                ${plan.isPopular
                        ? "bg-primary text-white hover:opacity-90"
                        : "border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    }
                `}
            >
                {isThisProcessing ? "Processing..." : `Choose ${plan.name}`}
            </button>
        </div>
    );
};

export default SubscriptionPlanCard;