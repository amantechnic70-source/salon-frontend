"use client";

import { useEffect, useState } from "react";
import { CurrentUser } from "@/src/types/auth.types";

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem("user");
            if (raw) {
                setUser(JSON.parse(raw));
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return { user, loading };
}