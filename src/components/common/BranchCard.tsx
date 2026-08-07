"use client";

import { FiMapPin, FiClock, FiPhone } from "react-icons/fi";
import { Branch } from "@/src/types/customerBooking.types";

interface BranchCardProps {
    branch: Branch;
    selected: boolean;
    onSelect: () => void;
}

const isOpenNow = (openingTime?: string, closingTime?: string): boolean | null => {
    if (!openingTime || !closingTime) return null;

    const parseTime = (t: string) => {
        const d = new Date(`2000-01-01 ${t}`);
        return isNaN(d.getTime()) ? null : d;
    };

    const now = new Date();
    const open = parseTime(openingTime);
    const close = parseTime(closingTime);
    if (!open || !close) return null;

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = open.getHours() * 60 + open.getMinutes();
    const closeMinutes = close.getHours() * 60 + close.getMinutes();

    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
};

const BranchCard = ({ branch, selected, onSelect }: BranchCardProps) => {
    const open = isOpenNow(branch.openingTime, branch.closingTime);

    return (
        <button
            onClick={onSelect}
            className={`
            w-full text-left rounded-2xl border p-4 transition-all
            ${
                selected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            }
            `}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-gray-900 dark:text-white">
                    {branch.name}
                </p>
                {open !== null && (
                    <span
                        className={`
                        shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium
                        ${
                            open
                                ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }
                        `}
                    >
                        {open ? "Open now" : "Closed"}
                    </span>
                )}
            </div>

            {branch.address && (
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <FiMapPin size={12} className="mt-0.5 shrink-0" />
                    {branch.address}
                </p>
            )}

            <div className="mt-2 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                {branch.openingTime && branch.closingTime && (
                    <span className="flex items-center gap-1">
                        <FiClock size={11} />
                        {branch.openingTime} - {branch.closingTime}
                    </span>
                )}
                {branch.phone && (
                    <span className="flex items-center gap-1">
                        <FiPhone size={11} />
                        {branch.phone}
                    </span>
                )}
            </div>
        </button>
    );
};

export default BranchCard;