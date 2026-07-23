import { CustomerSignupPayload, GetUsersPayload, SalonSignupPayload, SendOtpPayload, UpdateProfilePayload, VerifyOtpPayload } from "@/src/types/user.types";
import axiosInstance from "../axios/axios.interceptor";

export const userService = {

    // OTP APIs

    sendOtp: (
        data: SendOtpPayload,
    ) => {

        return axiosInstance.post(
            "/users/send-otp",
            data,
        );

    },


    verifyOtp: (
        data: VerifyOtpPayload,
    ) => {

        return axiosInstance.post(
            "/users/verify-otp",
            data,
        );

    },


    // Signup APIs

    customerSignup: (
        data: CustomerSignupPayload,
    ) => {

        return axiosInstance.post(
            "/users/customer-signup",
            data,
        );

    },


    salonSignup: (
        data: SalonSignupPayload,
    ) => {

        return axiosInstance.post(
            "/users/salon-signup",
            data,
        );

    },


    // Profile APIs

    getProfile: () => {

        return axiosInstance.get(
            "/users/profile",
        );

    },


    updateProfile: (
        data: UpdateProfilePayload,
    ) => {

        return axiosInstance.patch(
            "/users/update-profile",
            data,
        );

    },


    deleteAccount: () => {

        return axiosInstance.delete(
            "/users/delete-account",
        );

    },


    // Admin APIs

    getAllUsers: (
        params?: GetUsersPayload,
    ) => {

        return axiosInstance.get(
            "/users",
            {
                params,
            },
        );

    },


    getUserById: (
        id: string,
    ) => {

        return axiosInstance.get(
            `/users/${id}`,
        );

    },


    updateUserStatus: (
        id: string,
        data: {
            isActive?: boolean;
            isVerified?: boolean;
            role?: string;
        },
    ) => {

        return axiosInstance.patch(
            `/users/${id}/status`,
            data,
        );

    },


    deleteUser: (
        id: string,
    ) => {

        return axiosInstance.delete(
            `/users/${id}`,
        );

    },

};