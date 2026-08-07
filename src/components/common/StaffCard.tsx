"use client";

import { FiUser, FiAward } from "react-icons/fi";
import { StaffMember } from "@/src/types/customerBooking.types";

interface StaffCardProps {
    staff: StaffMember;
    selected: boolean;
    onSelect: () => void;
}

const StaffCard = ({ staff, selected, onSelect }: StaffCardProps) => {
    return (
        <button
            onClick={onSelect}
            className={`
            flex flex-col items-center gap-2 rounded-2xl border p-4 w-full transition-all
            ${
                selected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            }
            `}
        >
            <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                {staff.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={staff.profileImage}
                        alt={staff.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <FiUser size={22} className="text-gray-300 dark:text-gray-600" />
                )}
            </div>

            <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {staff.name}
                </p>
                {staff.designation && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {staff.designation}
                    </p>
                )}
                {typeof staff.experience === "number" && staff.experience > 0 && (
                    <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-primary">
                        <FiAward size={11} />
                        {staff.experience} yrs exp
                    </p>
                )}
            </div>
        </button>
    );
};

export default StaffCard;