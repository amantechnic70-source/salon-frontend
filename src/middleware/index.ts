import {
    NextRequest,
    NextResponse,
} from "next/server";
import { getAccessToken, getAuthPayload } from "./auth.middleware";


type RouteConfig = {
    prefix: string;
    roles: string[];
};

// ==========================================
// PROTECTED ROUTES
// ==========================================

const protectedRoutes: RouteConfig[] = [

    {
        prefix: "/customer",
        roles: [
            "CUSTOMER",
        ],
    },

    {
        prefix: "/salon",
        roles: [
            "SALON_OWNER",
        ],
    },

    {
        prefix: "/salon-onboarding",
        roles: [
            "SALON_OWNER",
        ],
    },

    {
        prefix: "/staff",
        roles: [
            "STAFF",
        ],
    },

    {
        prefix: "/admin",
        roles: [
            "SUPER_ADMIN",
        ],
    },

];

// ==========================================
// GUEST ROUTES
// ==========================================

const guestRoutes = [

    "/auth/login",

    "/auth/register",

    "/auth/forgot-password",

    "/auth/reset-password",

];

// ==========================================
// PUBLIC ROUTES
// ==========================================

const publicRoutes = [

    "/about",

    "/contact",

    "/services",

];

// ==========================================
// MATCH PROTECTED ROUTE
// ==========================================

const getMatchingRoute = (
    pathname: string,
): RouteConfig | undefined => {

    return protectedRoutes.find(
        route =>
            pathname === route.prefix ||
            pathname.startsWith(
                `${route.prefix}/`,
            ),
    );

};

// ==========================================
// CHECK GUEST ROUTE
// ==========================================

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
// CHECK PUBLIC ROUTE
// ==========================================

const isPublicRoute = (
    pathname: string,
): boolean => {

    return publicRoutes.some(
        route =>
            pathname === route ||
            pathname.startsWith(
                `${route}/`,
            ),
    );

};

// ==========================================
// ROLE REDIRECT
// ==========================================

const getRoleRedirect = (
    role: string,
    request: NextRequest,
): NextResponse => {

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
// MAIN MIDDLEWARE
// ==========================================

export async function middleware(
    request: NextRequest,
) {

    const pathname =
        request.nextUrl.pathname;

    const token =
        getAccessToken(
            request,
        );

    // ==========================================
    // GET VERIFIED JWT PAYLOAD
    // ==========================================

    const authPayload =
        await getAuthPayload(
            request,
        );

    const role =
        authPayload?.role;

    console.log(
        "MIDDLEWARE:",
        {
            pathname,
            hasToken: !!token,
            role,
        },
    );

    // ==========================================
    // ROOT "/"
    // ==========================================

    if (
        pathname === "/"
    ) {

        // --------------------------------------
        // NOT AUTHENTICATED
        // --------------------------------------

        if (
            !token ||
            !authPayload ||
            !role
        ) {

            return NextResponse.redirect(
                new URL(
                    "/auth/login",
                    request.url,
                ),
            );

        }

        // --------------------------------------
        // AUTHENTICATED
        // --------------------------------------

        return getRoleRedirect(
            role,
            request,
        );

    }

    // ==========================================
    // PUBLIC ROUTES
    // ==========================================

    if (
        isPublicRoute(
            pathname,
        )
    ) {

        return NextResponse.next();

    }

    // ==========================================
    // GUEST ROUTES
    // ==========================================

    if (
        isGuestRoute(
            pathname,
        )
    ) {

        // --------------------------------------
        // ALREADY LOGGED IN
        // --------------------------------------

        if (
            token &&
            authPayload &&
            role
        ) {

            return getRoleRedirect(
                role,
                request,
            );

        }

        // --------------------------------------
        // NOT LOGGED IN
        // --------------------------------------

        return NextResponse.next();

    }

    // ==========================================
    // PROTECTED ROUTE
    // ==========================================

    const matchedRoute =
        getMatchingRoute(
            pathname,
        );

    if (
        matchedRoute
    ) {

        // --------------------------------------
        // NO TOKEN
        // --------------------------------------

        if (
            !token
        ) {

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

        // --------------------------------------
        // INVALID TOKEN
        // --------------------------------------

        if (
            !authPayload ||
            !role
        ) {

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

        // --------------------------------------
        // WRONG ROLE
        // --------------------------------------

        if (
            !matchedRoute.roles.includes(
                role,
            )
        ) {

            return getRoleRedirect(
                role,
                request,
            );

        }

        // --------------------------------------
        // AUTHORIZED
        // --------------------------------------

        return NextResponse.next();

    }

    // ==========================================
    // UNKNOWN ROUTE
    // ==========================================

    if (
        !token ||
        !authPayload ||
        !role
    ) {

        return NextResponse.redirect(
            new URL(
                "/auth/login",
                request.url,
            ),
        );

    }

    return NextResponse.next();

}

// ==========================================
// MATCHER
// ==========================================

export const config = {

    matcher: [

        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",

    ],

};