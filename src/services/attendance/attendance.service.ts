import axiosInstance from "../axios/axiosInstance";
import {
    ApiResponse,
    Attendance,
    CheckInPayload,
    CheckOutPayload,
} from "@/src/types/attendance.types";

export const attendanceService = {
    // STAFF — self-service, no staffId/attendanceId needed;
    // backend resolves both from the logged-in user's token.

    getMyToday: (): Promise<{ data: ApiResponse<Attendance | null> }> => {
        return axiosInstance.get("/attendance/me/today");
    },

    checkIn: (
        data: CheckInPayload
    ): Promise<{ data: ApiResponse<Attendance> }> => {
        return axiosInstance.post("/attendance/check-in", data);
    },

    checkOut: (
        data: CheckOutPayload
    ): Promise<{ data: ApiResponse<Attendance> }> => {
        return axiosInstance.post("/attendance/check-out", data);
    },

    getMyHistory: (): Promise<{ data: ApiResponse<Attendance[]> }> => {
        return axiosInstance.get("/attendance/me/history");
    },
};