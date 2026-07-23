import axiosInstance from "../axios/axios.interceptor";


export const salonService = {

    createSalon: (
        data: any,
    ) => {

        return axiosInstance.post(

            "/salons/create",

            data,

        );

    },


    getProfile: () => {

        return axiosInstance.get(

            "/salons/profile",

        );

    },


    updateSalon: (
        data: any,
    ) => {

        return axiosInstance.patch(

            "/salons/update",

            data,

        );

    },


    deleteSalon: () => {

        return axiosInstance.delete(

            "/salons/delete",

        );

    },


    getAllSalons: (
        params?: any,
    ) => {

        return axiosInstance.get(

            "/salons",

            {

                params,

            },

        );

    },


    searchSalons: (
        params?: any,
    ) => {

        return axiosInstance.get(

            "/salons/search",

            {

                params,

            },

        );

    },


    getSalonById: (
        id: string,
    ) => {

        return axiosInstance.get(

            `/salons/${id}`,

        );

    },

};