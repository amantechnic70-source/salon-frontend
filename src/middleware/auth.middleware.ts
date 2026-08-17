import {
    NextRequest,
} from "next/server";

import {
    jwtVerify,
    JWTPayload,
} from "jose";

export interface AuthPayload
    extends JWTPayload {

    sub?: string;

    email?: string;

    role?:
        | "SUPER_ADMIN"
        | "SALON_OWNER"
        | "STAFF"
        | "CUSTOMER";

    salonId?: string;
}

// ==========================================
// GET ACCESS TOKEN
// ==========================================

export const getAccessToken = (
    request: NextRequest,
): string | null => {

    return (
        request.cookies.get(
            "accessToken",
        )?.value || null
    );

};

// ==========================================
// VERIFY JWT
// ==========================================

export const getAuthPayload = async (
    request: NextRequest,
): Promise<AuthPayload | null> => {

    const token =
        getAccessToken(
            request,
        );

    if (!token) {
        return null;
    }

    try {

        const secret =
            process.env.JWT_ACCESS_SECRET;

        if (!secret) {

            console.error(
                "JWT_ACCESS_SECRET is not configured.",
            );

            return null;

        }

        const encodedSecret =
            new TextEncoder().encode(
                secret,
            );

        const {
            payload,
        } = await jwtVerify(
            token,
            encodedSecret,
        );

        return payload as AuthPayload;

    } catch (error) {

        console.error(
            "JWT verification failed:",
            error,
        );

        return null;

    }

};

// ==========================================
// AUTHENTICATED
// ==========================================

export const isAuthenticated = async (
    request: NextRequest,
): Promise<boolean> => {

    const payload =
        await getAuthPayload(
            request,
        );

    return !!payload;

};