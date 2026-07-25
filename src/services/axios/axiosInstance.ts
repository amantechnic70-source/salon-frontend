import { getAccessToken } from "@/src/utils/cookies";
import axios from "axios";

const axiosInstance = axios.create({

    baseURL: process.env.NEXT_PUBLIC_BASE_URL,

    headers: {

        "Content-Type": "application/json",

    },

});

axiosInstance.interceptors.request.use(

    (config) => {

        const token = getAccessToken();

        if (token) {

            config.headers.Authorization =

                `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error),

);

export default axiosInstance;