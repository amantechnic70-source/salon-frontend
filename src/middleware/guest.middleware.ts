export const isGuest = (
    token?: string,
): boolean => {

    return !token;

};