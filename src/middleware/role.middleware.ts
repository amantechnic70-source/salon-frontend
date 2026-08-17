import {
    NextRequest,
} from "next/server";

import {
    getAuthPayload,
} from "./auth.middleware";

export type UserRole =
    | "SUPER_ADMIN"
    | "SALON_OWNER"
    | "STAFF"
    | "CUSTOMER";

// ==========================================
// GET USER ROLE
// ==========================================

export const getUserRole = async (
    request: NextRequest,
): Promise<UserRole | null> => {

    const payload =
        await getAuthPayload(
            request,
        );

    if (!payload) {
        return null;
    }

    const role =
        payload.role;

    if (
        role !== "SUPER_ADMIN" &&
        role !== "SALON_OWNER" &&
        role !== "STAFF" &&
        role !== "CUSTOMER"
    ) {

        return null;

    }

    return role;

};

// ==========================================
// CHECK ROLE
// ==========================================

export const hasRole = async (
    request: NextRequest,
    allowedRoles: UserRole[],
): Promise<boolean> => {

    const role =
        await getUserRole(
            request,
        );

    if (!role) {
        return false;
    }

    return allowedRoles.includes(
        role,
    );

};