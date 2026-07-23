"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {

    const {
        theme,
        setTheme,
    } = useTheme();

    return (

        <div className="flex gap-2">

            <button
                onClick={() => setTheme("light")}
            >
                Light
            </button>

            <button
                onClick={() => setTheme("dark")}
            >
                Dark
            </button>

            <button
                onClick={() => setTheme("system")}
            >
                System
            </button>

        </div>

    );

}