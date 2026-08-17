import { NextRequest } from "next/server";

export const getPermissions = (
    request: NextRequest,
): string[] => {

    const permissionsCookie =
        request.cookies.get(
            "permissions",
        )?.value;

    if (!permissionsCookie) {
        return [];
    }

    try {

        const permissions =
            JSON.parse(
                permissionsCookie,
            );

        if (
            !Array.isArray(
                permissions,
            )
        ) {
            return [];
        }

        return permissions;

    } catch {

        return [];

    }
};

export const hasPermission = (
    request: NextRequest,
    requiredPermission: string,
): boolean => {

    const permissions =
        getPermissions(
            request,
        );

    return permissions.includes(
        requiredPermission,
    );
};