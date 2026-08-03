"use client";

import { FiClock, FiLogIn, FiLogOut, FiCheckCircle } from "react-icons/fi";
import { Attendance } from "@/src/types/attendance.types";
import { useElapsedTime } from "@/src/hooks/useElapsedTime";

interface AttendanceStatusCardProps {
    today: Attendance | null;
    onCheckIn: () => void;
    onCheckOut: () => void;
    submitting: boolean;
}

const parseTimeToday = (timeStr?: string): Date | null => {
    if (!timeStr) return null;

    // timeStr comes as "09:15 AM" style from backend's toLocaleTimeString
    const today = new Date();
    const parsed = new Date(`${today.toDateString()} ${timeStr}`);
    return isNaN(parsed.getTime()) ? null : parsed;
};

const AttendanceStatusCard = ({
    today,
    onCheckIn,
    onCheckOut,
    submitting,
}: AttendanceStatusCardProps) => {
    const checkInDate = today ? parseTimeToday(today.checkInTime) : null;
    const isCheckedIn = Boolean(today && today.checkInTime && !today.checkOutTime);
    const isCompleted = Boolean(today && today.checkOutTime);

    const elapsed = useElapsedTime(isCheckedIn ? checkInDate : null);

    const currentDate = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</p>

            {/* Not checked in yet */}
            {!today && (
                <>
                    <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <FiClock size={28} className="text-primary" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        You haven't checked in yet
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Mark your attendance to start your shift.
                    </p>

                    <button
                        onClick={onCheckIn}
                        disabled={submitting}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto"
                    >
                        <FiLogIn size={18} />
                        {submitting ? "Checking in..." : "Check In"}
                    </button>
                </>
            )}

            {/* Checked in, not yet out */}
            {isCheckedIn && (
                <>
                    <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
                        <FiClock size={28} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        You're checked in
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Since {today?.checkInTime}
                        {today?.isLate && (
                            <span className="ml-1.5 text-amber-600 dark:text-amber-400">
                                (Late)
                            </span>
                        )}
                    </p>

                    <p className="mt-4 font-mono text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                        {elapsed}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        elapsed time
                    </p>

                    <button
                        onClick={onCheckOut}
                        disabled={submitting}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto"
                    >
                        <FiLogOut size={18} />
                        {submitting ? "Checking out..." : "Check Out"}
                    </button>
                </>
            )}

            {/* Completed the day */}
            {isCompleted && (
                <>
                    <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <FiCheckCircle size={28} className="text-primary" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Shift completed
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {today?.checkInTime} — {today?.checkOutTime}
                    </p>

                    <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                        {today?.workingHours}h
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        total hours worked
                    </p>

                    {today?.isHalfDay && (
                        <span className="mt-4 inline-block rounded-full bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                            Marked as half day
                        </span>
                    )}
                </>
            )}
        </div>
    );
};

export default AttendanceStatusCard;