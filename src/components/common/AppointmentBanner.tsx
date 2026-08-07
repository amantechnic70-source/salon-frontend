"use client";

import Link from "next/link";
import { FiCalendar, FiClock, FiChevronRight } from "react-icons/fi";
import { Appointment, PopulatedSalonRef, PopulatedStaffRef } from "@/src/types/customerBooking.types";

interface AppointmentBannerProps {
    appointment: Appointment;
}

const AppointmentBanner = ({ appointment }: AppointmentBannerProps) => {
    const salon =
        typeof appointment.salonId === "object"
            ? (appointment.salonId as PopulatedSalonRef)
            : null;
    const staff =
        typeof appointment.staffId === "object"
            ? (appointment.staffId as PopulatedStaffRef)
            : null;

    return (
        <Link
            href={`/customer/appointments`}
            className="
            block rounded-2xl p-4 sm:p-5
            bg-linear-to-br from-primary to-primary/80
            text-white
            hover:opacity-95 transition-opacity
            "
        >
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-white/80">
                        Upcoming appointment
                    </p>
                    <p className="mt-1 font-semibold truncate">
                        {salon?.name || "Your salon"}
                        {staff?.name ? ` · ${staff.name}` : ""}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-white/90">
                        <span className="flex items-center gap-1">
                            <FiCalendar size={12} />
                            {new Date(appointment.appointmentDate).toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" }
                            )}
                        </span>
                        <span className="flex items-center gap-1">
                            <FiClock size={12} />
                            {appointment.appointmentTime}
                        </span>
                    </div>
                </div>
                <FiChevronRight size={20} className="shrink-0 text-white/80" />
            </div>
        </Link>
    );
};

export default AppointmentBanner;