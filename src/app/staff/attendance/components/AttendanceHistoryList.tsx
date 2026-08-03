"use client";

import { FiClock } from "react-icons/fi";
import { Attendance } from "@/src/types/attendance.types";

interface AttendanceHistoryListProps {
    history: Attendance[];
}

const statusStyle: Record<string, string> = {
    PRESENT: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    HALF_DAY: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    ABSENT: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
};

const AttendanceHistoryList = ({ history }: AttendanceHistoryListProps) => {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-12 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <FiClock size={28} className="text-gray-300 dark:text-gray-600" />
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    No attendance history yet
                </p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                    Your past check-ins will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {history.map((record) => (
                <div
                    key={record._id}
                    className="flex items-center justify-between px-5 py-4"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(record.date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                            })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {record.checkInTime || "—"} – {record.checkOutTime || "—"}
                            {record.isLate && (
                                <span className="ml-1.5 text-amber-600 dark:text-amber-400">
                                    (Late)
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <span
                            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                statusStyle[record.status] ||
                                "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                        >
                            {record.status}
                        </span>
                        {record.workingHours > 0 && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {record.workingHours}h
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceHistoryList;