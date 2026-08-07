import axiosInstance from "./axios/axiosInstance";
import {
    ApiResponse,
    CreateAppointmentOrderPayload,
    CreateAppointmentOrderResponse,
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
};