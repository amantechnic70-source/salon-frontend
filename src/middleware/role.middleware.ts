import {
    NextRequest,
} from "next/server";

import {
    getAccessToken,
} from "./auth.middleware";

export type UserRole =
    | "SUPER_ADMIN"
    | "SALON_OWNER"
    | "STAFF"
    | "CUSTOMER";

interface JwtPayload {

    sub?: string;

    email?: string;

    role?: UserRole;

    salonId?: string;

    iat?: number;

    exp?: number;

}

export const getUserRole = (
    request: NextRequest,
): UserRole | null => {

    const token =
        getAccessToken(
            request,
        );

    if (!token) {

        return null;

    }

    try {

        const parts =
            token.split(".");

        if (
            parts.length !== 3
        ) {

            return null;

        }

        const payload =
            JSON.parse(
                Buffer
                    .from(
                        parts[1],
                        "base64url",
                    )
                    .toString(),
            ) as JwtPayload;

        // ==========================================
        // CHECK EXPIRATION
        // ==========================================

        if (
            payload.exp &&
            payload.exp <
                Math.floor(
                    Date.now() / 1000,
                )
        ) {

            return null;

        }

        // ==========================================
        // CHECK ROLE
        // ==========================================

        if (
            !payload.role
        ) {

            return null;

        }

        const validRoles: UserRole[] = [

            "SUPER_ADMIN",

            "SALON_OWNER",

            "STAFF",

            "CUSTOMER",

        ];

        if (
            !validRoles.includes(
                payload.role,
            )
        ) {

            return null;

        }

        return payload.role;

    } catch {

        return null;

    }

};