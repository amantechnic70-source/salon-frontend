export const hasRole = (
    role: string,
    allowedRoles: string[],
): boolean => {

    return allowedRoles.includes(
        role,
    );

};