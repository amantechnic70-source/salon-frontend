import { ApiResponse, CreatePlanPayload, SubscriptionPlan, UpdatePlanPayload } from "@/src/types/subscription.types";
import axiosInstance from "../axios/axiosInstance";


export const subscriptionService = {
    // PUBLIC
    getPlans: async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
        const { data } = await axiosInstance.get("/subscriptions/plans");
        return data;
    },

    // SUPER ADMIN
    createPlan: async (
        payload: CreatePlanPayload
    ): Promise<ApiResponse<SubscriptionPlan>> => {
        const { data } = await axiosInstance.post(
            "/subscriptions/create-plan",
            payload
        );
        return data;
    },

    updatePlan: async (
        id: string,
        payload: UpdatePlanPayload
    ): Promise<ApiResponse<SubscriptionPlan>> => {
        const { data } = await axiosInstance.patch(
            `/subscriptions/update-plan/${id}`,
            payload
        );
        return data;
    },

    deletePlan: async (id: string): Promise<ApiResponse<null>> => {
        const { data } = await axiosInstance.delete(
            `/subscriptions/delete-plan/${id}`
        );
        return data;
    },
};