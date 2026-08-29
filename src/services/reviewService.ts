import axiosInstance from "./axios/axiosInstance";
import {
    ApiResponse,
    CreateReviewPayload,
    GetReviewsParams,
    Review,
    UpdateReviewPayload,
} from "@/src/types/review.types";

export const reviewService = {
    create: (
        data: CreateReviewPayload
    ): Promise<{ data: ApiResponse<Review> }> => {
        return axiosInstance.post("/reviews/create", data);
    },

    getAll: (
        params?: GetReviewsParams
    ): Promise<{ data: ApiResponse<Review[]> }> => {
        return axiosInstance.get("/reviews", { params });
    },

    getById: (
        id: string
    ): Promise<{ data: ApiResponse<Review> }> => {
        return axiosInstance.get(`/reviews/${id}`);
    },

    update: (
        id: string,
        data: UpdateReviewPayload
    ): Promise<{ data: ApiResponse<Review> }> => {
        return axiosInstance.patch(`/reviews/${id}`, data);
    },

    deleteReview: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/reviews/${id}`);
    },

    getSalonReviews: (
        salonId: string
    ): Promise<{ data: ApiResponse<Review[]> }> => {
        return axiosInstance.get(`/reviews/salon/${salonId}`);
    },
};