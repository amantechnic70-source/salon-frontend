"use client";

import ThemeToggle from "@/src/components/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AuthNavbar = () => {
    const pathname = usePathname();

    const isLogin = pathname === "/auth/login";
    const isSignup = pathname === "/auth/signup";

    return (
        <header
            className="
            sticky top-0 z-30
            flex items-center justify-between
            h-16 px-4 sm:px-6 lg:px-10
            bg-white dark:bg-gray-900
            border-b border-gray-200 dark:border-gray-800
            "
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                    S
                </div>
                <span className="hidden sm:block font-semibold text-gray-900 dark:text-white">
                    Salon SaaS
                </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />

                <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200 dark:border-gray-800">
                    <Link
                        href="/auth/login"
                        className={`
                        rounded-lg px-3 sm:px-4 py-2
                        text-sm font-medium
                        transition-colors
                        ${isLogin
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }
                        `}
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/auth/signup"
                        className={`
                        rounded-lg px-3 sm:px-4 py-2
                        text-sm font-medium
                        transition-colors
                        ${isSignup
                                ? "bg-primary text-white"
                                : "bg-primary/90 text-white hover:bg-primary"
                            }
                        `}
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default AuthNavbar;