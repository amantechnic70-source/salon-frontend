import Cookies from "js-cookie";

// ==========================================
// ACCESS TOKEN
// ==========================================

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

            path: "/",
        },
    );

};

// ==========================================
// GET ACCESS TOKEN
// ==========================================

export const getAccessToken = () => {

    return Cookies.get(
        "accessToken",
    );

};

// ==========================================
// REMOVE ACCESS TOKEN
// ==========================================

export const removeAccessToken = () => {

    Cookies.remove(
        "accessToken",
        {
            path: "/",
        },
    );

};

// ==========================================
// ROLE
// ==========================================

export const setRole = (
    role: string,
) => {

    Cookies.set(
        "role",
        role,
        {
            expires: 7,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite: "strict",

            path: "/",
        },
    );

};

// ==========================================
// GET ROLE
// ==========================================

export const getRole = () => {

    return Cookies.get(
        "role",
    );

};

// ==========================================
// REMOVE ROLE
// ==========================================

export const removeRole = () => {

    Cookies.remove(
        "role",
        {
            path: "/",
        },
    );

};

// ==========================================
// LOGOUT
// ==========================================

export const clearAuthCookies = () => {

    removeAccessToken();

    removeRole();

};