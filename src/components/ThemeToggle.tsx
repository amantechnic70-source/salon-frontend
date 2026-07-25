"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

const ORDER = ["light", "dark", "system"] as const;
type ThemeValue = (typeof ORDER)[number];

const ICONS: Record<ThemeValue, typeof FiSun> = {
    light: FiSun,
    dark: FiMoon,
    system: FiMonitor,
};

const LABELS: Record<ThemeValue, string> = {
    light: "Light mode",
    dark: "Dark mode",
    system: "System theme",
};

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch — next-themes only knows the real
    // theme after mount (it reads localStorage on the client).
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
        );
    }

    const current = (theme as ThemeValue) ?? "system";

    const handleClick = () => {
        const currentIndex = ORDER.indexOf(current);
        const next = ORDER[(currentIndex + 1) % ORDER.length];
        setTheme(next);
    };

    const Icon = ICONS[current];

    return (
        <button
            onClick={handleClick}
            aria-label={`Current: ${LABELS[current]}. Click to change.`}
            title={LABELS[current]}
            className="
            flex items-center justify-center
            h-9 w-9 rounded-full
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800
            hover:text-gray-700 dark:hover:text-gray-200
            transition-colors
            "
        >
            <Icon size={18} />
        </button>
    );
}