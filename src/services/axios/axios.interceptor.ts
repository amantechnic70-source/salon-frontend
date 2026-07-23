import { axiosInstance } from "./axios.instance";


axiosInstance.interceptors.request.use(

    (config) => {

        if (
            typeof window !== "undefined"
        ) {

            const authData =
                localStorage.getItem(
                    "persist:auth",
                );

            if (authData) {

                const parsedAuth =
                    JSON.parse(authData);

                const accessToken =
                    JSON.parse(
                        parsedAuth.accessToken ||
                        null,
                    );

                if (accessToken) {

                    config.headers.Authorization =
                        `Bearer ${accessToken}`;

                }

            }

        }

        return config;

    },

    (error) => {

        return Promise.reject(
            error,
        );

    },

);


axiosInstance.interceptors.response.use(

    (response) => response,

    (error) => {

        if (
            error?.response?.status === 401
        ) {

            localStorage.clear();

            window.location.href =
                "/auth/login";

        }

        return Promise.reject(
            error,
        );

    },

);


export default axiosInstance;