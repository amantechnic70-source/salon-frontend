"use client";

import { FiCheck } from "react-icons/fi";
import { Service } from "@/src/types/service.types";

interface ServiceSelectorProps {
    services: Service[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

const ServiceSelector = ({
    services,
    selectedIds,
    onToggle,
}: ServiceSelectorProps) => {
    if (services.length === 0) {
        return (
            <p className="text-sm text-gray-400 dark:text-gray-500 py-3">
                No services available for this branch yet.
            </p>
        );
    }

    return (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {services.map((s) => {
                const selected = selectedIds.includes(s._id);
                const finalPrice = s.discount > 0 ? s.discountPrice : s.price;

                return (
                    <button
                        key={s._id}
                        type="button"
                        onClick={() => onToggle(s._id)}
                        className={`
                        w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3
                        text-left transition-colors
                        ${
                            selected
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                        }
                        `}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={`
                                flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
                                ${
                                    selected
                                        ? "bg-primary border-primary text-white"
                                        : "border-gray-300 dark:border-gray-600"
                                }
                                `}
                            >
                                {selected && <FiCheck size={13} />}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {s.name}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {s.duration} mins
                                </p>
                            </div>
                        </div>

                        <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
                            ₹{finalPrice}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ServiceSelector;