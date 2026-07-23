export const hasPermission = (
    permissions: string[],
    requiredPermission: string,
): boolean => {

    return permissions.includes(
        requiredPermission,
    );

};