import axiosInstance from "../axios/axiosInstance";
import {
    ApiResponse,
    Appointment,
    CancelAppointmentPayload,
    CreateAppointmentPayload,
    GetAppointmentsParams,
    RescheduleAppointmentPayload,
    UpdateAppointmentPayload,
    UpdateAppointmentStatusPayload,
} from "@/src/types/appointment.types";

export const appointmentService = {
    // SALON OWNER

    create: (
        data: CreateAppointmentPayload
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.post("/appointments/create", data);
    },

    getAll: (
        params?: GetAppointmentsParams
    ): Promise<{ data: ApiResponse<Appointment[]> }> => {
        return axiosInstance.get("/appointments", { params });
    },

    getById: (
        id: string
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.get(`/appointments/${id}`);
    },

    update: (
        id: string,
        data: UpdateAppointmentPayload
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.patch(`/appointments/update/${id}`, data);
    },

    reschedule: (
        id: string,
        data: RescheduleAppointmentPayload
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.patch(`/appointments/reschedule/${id}`, data);
    },

    updateStatus: (
        id: string,
        data: UpdateAppointmentStatusPayload
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.patch(`/appointments/status/${id}`, data);
    },

    cancel: (
        id: string,
        data: CancelAppointmentPayload
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.delete(`/appointments/cancel/${id}`, { data });
    },

    // PUBLIC

    getTodayAppointments: (): Promise<{ data: ApiResponse<Appointment[]> }> => {
        return axiosInstance.get("/appointments/today/all");
    },

    getUpcomingAppointments: (): Promise<{ data: ApiResponse<Appointment[]> }> => {
        return axiosInstance.get("/appointments/upcoming/all");
    },
};