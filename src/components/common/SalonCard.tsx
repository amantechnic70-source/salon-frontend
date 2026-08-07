"use client";

import Link from "next/link";
import { FiMapPin, FiGrid, FiScissors } from "react-icons/fi";
import { Salon } from "@/src/types/customerBooking.types";

interface SalonCardProps {
    salon: Salon;
    variant?: "default" | "compact";
}

const SalonCard = ({ salon, variant = "default" }: SalonCardProps) => {
    if (variant === "compact") {
        return (
            <Link
                href={`/customer/salons/${salon._id}`}
                className="
                shrink-0 w-44 rounded-2xl overflow-hidden
                border border-gray-200 dark:border-gray-800
                bg-white dark:bg-gray-900
                hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5
                transition-all
                "
            >
                <div className="h-28 w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                    {salon.bannerImage || salon.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={salon.bannerImage || salon.logo}
                            alt={salon.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <FiScissors size={22} className="text-gray-300 dark:text-gray-700" />
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {salon.name}
                    </p>
                    {salon.city && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                            {salon.city}
                        </p>
                    )}
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/customer/salons/${salon._id}`}
            className="
            flex gap-4 rounded-2xl p-3
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            hover:border-primary/40 hover:shadow-sm
            transition-all
            "
        >
            <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {salon.logo || salon.bannerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={salon.logo || salon.bannerImage}
                        alt={salon.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <FiScissors size={20} className="text-gray-300 dark:text-gray-700" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {salon.name}
                </p>
                {salon.address && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 truncate">
                        <FiMapPin size={11} className="shrink-0" />
                        {salon.address}
                    </p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                        <FiGrid size={12} />
                        {salon.totalBranches} branch{salon.totalBranches !== 1 ? "es" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiScissors size={12} />
                        {salon.totalServices} services
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default SalonCard;