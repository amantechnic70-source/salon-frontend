import {
    CreateOrderPayload,
    CreateOrderResponse,
    VerifyPaymentPayload,
    VerifyPaymentResponse,
} from "@/src/types/payment.types";
import axiosInstance from "../axios/axiosInstance";

export const paymentService = {
    createOrder: async (
        payload: CreateOrderPayload
    ): Promise<CreateOrderResponse> => {
        const { data } = await axiosInstance.post(
            "/payments/create-order",
            payload
        );
        return data;
    },

    verifyPayment: async (
        payload: VerifyPaymentPayload
    ): Promise<VerifyPaymentResponse> => {
        const { data } = await axiosInstance.post(
            "/payments/verify-payment",
            payload
        );
        return data;
    },

    paymentHistory: async () => {
        const { data } = await axiosInstance.get("/payments/history");
        return data;
    },
};