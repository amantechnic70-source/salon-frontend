import axiosInstance from "./axios/axiosInstance";
import {
    ApiResponse,
    CreateAppointmentOrderPayload,
    CreateAppointmentOrderResponse,
    GetAppointmentPaymentsParams,
    Payment,
    VerifyAppointmentPaymentPayload,
} from "@/src/types/customerBooking.types";

export const appointmentPaymentService = {
    createOrder: (
        data: CreateAppointmentOrderPayload
    ): Promise<{ data: ApiResponse<CreateAppointmentOrderResponse> }> => {
        return axiosInstance.post("/appointment-payment/create-order", data);
    },

    verifyPayment: (
        data: VerifyAppointmentPaymentPayload
    ): Promise<{ data: ApiResponse<any> }> => {
        return axiosInstance.post("/appointment-payment/verify-payment", data);
    },

    getHistory: (
        params?: GetAppointmentPaymentsParams
    ): Promise<{ data: ApiResponse<Payment[]> }> => {
        return axiosInstance.get("/appointment-payment/history", { params });
    },

    getDetails: (
        id: string
    ): Promise<{ data: ApiResponse<Payment> }> => {
        return axiosInstance.get(`/appointment-payment/${id}`);
    },
};