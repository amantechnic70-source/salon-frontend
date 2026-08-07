import {
    ApiResponse,
    Appointment,
    GetMyBookingsParams,
    GetSalonsParams,
    GetSalonServicesParams,
    Salon,
    SalonDetails,
    ServiceItem,
    StaffMember,
    CreateBookingPayload,
    CancelBookingPayload,
    RescheduleBookingPayload,
} from "@/src/types/customerBooking.types";
import axiosInstance from "../axios/axiosInstance";

export const customerBookingService = {
    getSalons: (
        params?: GetSalonsParams
    ): Promise<{ data: ApiResponse<Salon[]> }> => {
        return axiosInstance.get("/customer-booking/salons", { params });
    },

    getSalonDetails: (
        salonId: string
    ): Promise<{ data: ApiResponse<SalonDetails> }> => {
        return axiosInstance.get(`/customer-booking/salon/${salonId}`);
    },

    getSalonServices: (
        params: GetSalonServicesParams
    ): Promise<{ data: ApiResponse<ServiceItem[]> }> => {
        return axiosInstance.get("/customer-booking/services", { params });
    },

    getMyBookings: (
        params?: GetMyBookingsParams
    ): Promise<{ data: ApiResponse<Appointment[]> }> => {
        return axiosInstance.get("/customer-booking/my-bookings", { params });
    },

    getBranchStaff: (
        branchId: string
    ): Promise<{ data: ApiResponse<StaffMember[]> }> => {
        return axiosInstance.get("/customer-booking/staff", {
            params: { branchId },
        });
    },

    getAvailableSlots: (params: {
        branchId: string;
        staffId: string;
        appointmentDate: string;
    }): Promise<{ data: ApiResponse<string[]> }> => {
        return axiosInstance.get("/customer-booking/available-slots", { params });
    },

    createBooking: (
        data: CreateBookingPayload
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.post("/customer-booking/create", data);
    },

    cancelBooking: (
        data: CancelBookingPayload
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.patch("/customer-booking/cancel", data);
    },

    rescheduleBooking: (
        data: RescheduleBookingPayload
    ): Promise<{ data: ApiResponse<Appointment> }> => {
        return axiosInstance.patch("/customer-booking/reschedule", data);
    },
};