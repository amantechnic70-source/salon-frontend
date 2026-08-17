import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    getAccessToken,
} from "./auth.middleware";

import {
    getUserRole,
} from "./role.middleware";

// ==========================================
// HANDLE GUEST ROUTE
// ==========================================

export const handleGuestRoute = async (
    request: NextRequest,
): Promise<NextResponse | null> => {

    // ==========================================
    // GET ACCESS TOKEN
    // ==========================================

    const token =
        getAccessToken(
            request,
        );

    // ==========================================
    // USER IS NOT LOGGED IN
    // ALLOW GUEST ROUTE
    // ==========================================

    if (!token) {

        return null;

    }

    // ==========================================
    // GET USER ROLE
    // IMPORTANT: await because getUserRole()
    // verifies JWT asynchronously
    // ==========================================

    const role =
        await getUserRole(
            request,
        );

    // ==========================================
    // TOKEN EXISTS BUT ROLE IS MISSING/INVALID
    // ==========================================

    if (!role) {

        return NextResponse.redirect(
            new URL(
                "/auth/login",
                request.url,
            ),
        );

    }

    // ==========================================
    // REDIRECT BASED ON ROLE
    // ==========================================

    switch (role) {

        // ======================================
        // CUSTOMER
        // ======================================

        case "CUSTOMER":

            return NextResponse.redirect(
                new URL(
                    "/customer/home",
                    request.url,
                ),
            );

        // ======================================
        // SALON OWNER
        // ======================================

        case "SALON_OWNER":

            return NextResponse.redirect(
                new URL(
                    "/salon/dashboard",
                    request.url,
                ),
            );

        // ======================================
        // STAFF
        // ======================================

        case "STAFF":

            return NextResponse.redirect(
                new URL(
                    "/staff/dashboard",
                    request.url,
                ),
            );

        // ======================================
        // SUPER ADMIN
        // ======================================

        case "SUPER_ADMIN":

            return NextResponse.redirect(
                new URL(
                    "/admin/dashboard",
                    request.url,
                ),
            );

        // ======================================
        // UNKNOWN ROLE
        // ======================================

        default:

            return NextResponse.redirect(
                new URL(
                    "/auth/login",
                    request.url,
                ),
            );

    }

};