"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import { attendanceService } from "@/src/services/attendance/attendance.service";
import { Attendance } from "@/src/types/attendance.types";
import AttendanceStatusCard from "./components/AttendanceStatusCard";
import AttendanceHistoryList from "./components/AttendanceHistoryList";

export default function StaffAttendancePage() {
    const [today, setToday] = useState<Attendance | null>(null);
    const [history, setHistory] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const [todayRes, historyRes] = await Promise.all([
                attendanceService.getMyToday(),
                attendanceService.getMyHistory(),
            ]);
            setToday(todayRes.data.data);
            setHistory(historyRes.data.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load attendance."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleCheckIn = async () => {
        setSubmitting(true);
        try {
            // No staffId here — the backend identifies the staff member
            // from the JWT (req.user.sub), not from the request body.
            const res = await attendanceService.checkIn({});
            setToday(res.data.data);
            toast.success(res.data.message || "Checked in successfully.");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not check in."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckOut = async () => {
        setSubmitting(true);
        try {
            // No attendanceId here — the backend finds today's open
            // attendance record for this staff member automatically.
            const res = await attendanceService.checkOut({});
            setToday(res.data.data);
            setHistory((prev) => [res.data.data, ...prev]);
            toast.success(res.data.message || "Checked out successfully.");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not check out."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-lg mx-auto space-y-6">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 animate-pulse space-y-4">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
                    <div className="h-16 w-16 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto" />
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
                    <div className="h-11 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    My Attendance
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Mark your check-in and check-out for the day.
                </p>
            </div>

            <AttendanceStatusCard
                today={today}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                submitting={submitting}
            />

            <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
                    Recent history
                </h2>
                <AttendanceHistoryList history={history} />
            </div>
        </div>
    );
}