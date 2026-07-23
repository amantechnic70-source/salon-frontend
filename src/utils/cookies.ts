import Cookies from "js-cookie";

export const setAccessToken = (
    token: string,
) => {

    Cookies.set(
        "accessToken",
        token,
        {

            expires: 7,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite: "strict",

        },
    );

};


export const getAccessToken = () => {

    return Cookies.get(
        "accessToken",
    );

};


export const removeAccessToken =
    () => {

        Cookies.remove(
            "accessToken",
        );

    };