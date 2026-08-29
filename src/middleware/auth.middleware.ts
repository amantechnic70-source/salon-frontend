import {
    NextRequest,
} from "next/server";

export const getAccessToken = (
    request: NextRequest,
): string | null => {

    const token =
        request.cookies.get(
            "accessToken",
        )?.value;

    return token || null;
};