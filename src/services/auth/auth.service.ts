import axiosInstance from "../axios/axios.interceptor";

export const authService = {

    register: (data: any) => {

        return axiosInstance.post(

            "/auth/register",

            data,

        );

    },


    login: (data: any) => {

        return axiosInstance.post(

            "/auth/login",

            data,

        );

    },


    logout: () => {

        return axiosInstance.post(

            "/auth/logout",

        );

    },


    refreshToken: (data: any) => {

        return axiosInstance.post(

            "/auth/refresh-token",

            data,

        );

    },


    forgotPassword: (
        data: any,
    ) => {

        return axiosInstance.post(

            "/auth/forgot-password",

            data,

        );

    },


    resetPassword: (
        data: any,
    ) => {

        return axiosInstance.post(

            "/auth/reset-password",

            data,

        );

    },


    changePassword: (
        data: any,
    ) => {

        return axiosInstance.post(

            "/auth/change-password",

            data,

        );

    },


    getProfile: () => {

        return axiosInstance.get(

            "/auth/profile",

        );

    },

};