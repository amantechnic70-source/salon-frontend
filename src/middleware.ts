import {
    NextRequest,
    NextResponse,
} from "next/server";
import { getAccessToken } from "./middleware/auth.middleware";
import { getUserRole } from "./middleware/role.middleware";


// ==========================================
// ROLE REDIRECT
// ==========================================

const redirectByRole = (
    role: string,
    request: NextRequest,
) => {

    switch (role) {

        case "CUSTOMER":

            return NextResponse.redirect(
                new URL(
                    "/customer/home",
                    request.url,
                ),
            );

        case "SALON_OWNER":

            return NextResponse.redirect(
                new URL(
                    "/salon/dashboard",
                    request.url,
                ),
            );

        case "STAFF":

            return NextResponse.redirect(
                new URL(
                    "/staff/dashboard",
                    request.url,
                ),
            );

        case "SUPER_ADMIN":

            return NextResponse.redirect(
                new URL(
                    "/admin/dashboard",
                    request.url,
                ),
            );

        default:

            return NextResponse.redirect(
                new URL(
                    "/auth/login",
                    request.url,
                ),
            );
    }
};

// ==========================================
// GUEST ROUTES
// ==========================================

const guestRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
];

const isGuestRoute = (
    pathname: string,
): boolean => {

    return guestRoutes.some(
        route =>
            pathname === route ||
            pathname.startsWith(
                `${route}/`,
            ),
    );
};

// ==========================================
// PROTECTED ROUTES
// ==========================================

const protectedRoutes = [
    {
        prefix: "/customer",
        roles: ["CUSTOMER"],
    },

    {
        prefix: "/salon",
        roles: ["SALON_OWNER"],
    },

    {
        prefix: "/salon-onboarding",
        roles: ["SALON_OWNER"],
    },

    {
        prefix: "/staff",
        roles: ["STAFF"],
    },

    {
        prefix: "/admin",
        roles: ["SUPER_ADMIN"],
    },
];

const getProtectedRoute = (
    pathname: string,
) => {

    return protectedRoutes.find(
        route =>
            pathname === route.prefix ||
            pathname.startsWith(
                `${route.prefix}/`,
            ),
    );
};

// ==========================================
// MAIN MIDDLEWARE
// ==========================================

export function middleware(
    request: NextRequest,
) {

    const pathname =
        request.nextUrl.pathname;

    const token =
        getAccessToken(
            request,
        );

    const role =
        getUserRole(
            request,
        );

    // ==========================================
    // DEBUG
    // ==========================================

    console.log(
        "================================",
    );

    console.log(
        "MIDDLEWARE PATH:",
        pathname,
    );

    console.log(
        "TOKEN:",
        !!token,
    );

    console.log(
        "ROLE:",
        role,
    );

    console.log(
        "================================",
    );

    // ==========================================
    // ROOT PAGE
    // ==========================================

    if (
        pathname === "/"
    ) {

        // Not logged in
        if (!token) {

            return NextResponse.redirect(
                new URL(
                    "/auth/login",
                    request.url,
                ),
            );

        }

        // Token exists but role missing
        if (!role) {

            return NextResponse.redirect(
                new URL(
                    "/auth/login",
                    request.url,
                ),
            );

        }

        // Logged in
        return redirectByRole(
            role,
            request,
        );
    }

    // ==========================================
    // GUEST ROUTES
    // ==========================================

    if (
        isGuestRoute(
            pathname,
        )
    ) {

        // Already logged in
        if (
            token &&
            role
        ) {

            return redirectByRole(
                role,
                request,
            );

        }

        return NextResponse.next();
    }

    // ==========================================
    // PROTECTED ROUTES
    // ==========================================

    const protectedRoute =
        getProtectedRoute(
            pathname,
        );

    if (
        protectedRoute
    ) {

        // No token
        if (!token) {

            const loginUrl =
                new URL(
                    "/auth/login",
                    request.url,
                );

            loginUrl.searchParams.set(
                "redirect",
                pathname,
            );

            return NextResponse.redirect(
                loginUrl,
            );
        }

        // Token exists but role missing
        if (!role) {

            return NextResponse.redirect(
                new URL(
                    "/auth/login",
                    request.url,
                ),
            );
        }

        // Wrong role
        if (
            !protectedRoute.roles.includes(
                role,
            )
        ) {

            return redirectByRole(
                role,
                request,
            );
        }

        return NextResponse.next();
    }

    // ==========================================
    // OTHER ROUTES
    // ==========================================

    return NextResponse.next();
}

// ==========================================
// MATCHER
// ==========================================

export const config = {

    matcher: [
        "/",
        "/auth/:path*",
        "/customer/:path*",
        "/salon/:path*",
        "/salon-onboarding/:path*",
        "/staff/:path*",
        "/admin/:path*",
    ],

};