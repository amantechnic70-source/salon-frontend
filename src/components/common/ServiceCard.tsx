"use client";

import { FiClock, FiStar } from "react-icons/fi";
import { ServiceItem } from "@/src/types/customerBooking.types";

interface ServiceCardProps {
    service: ServiceItem;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
    const hasDiscount = service.discount > 0;

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {service.serviceImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={service.serviceImage}
                        alt={service.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300 dark:text-gray-700 text-xs">
                        —
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {service.name}
                    </p>
                    {service.isPopular && (
                        <FiStar size={12} className="text-amber-500 shrink-0" />
                    )}
                </div>
                {service.category && (
                    <p className="text-xs text-primary mt-0.5">{service.category}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                    <FiClock size={11} />
                    {service.duration} mins
                </p>
            </div>

            <div className="text-right shrink-0">
                {hasDiscount ? (
                    <>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            ₹{service.discountPrice}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 line-through">
                            ₹{service.price}
                        </p>
                    </>
                ) : (
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ₹{service.price}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ServiceCard;