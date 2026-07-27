"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMail } from "react-icons/fi";

import { authService } from "@/src/services/auth/auth.service";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await authService.forgotPassword({ email });

            setSent(true);

            toast.success("Reset link sent to your email.");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    "Could not send reset link. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <FiMail size={26} className="text-primary" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Check your email
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        We sent a password reset link to{" "}
                        <span className="text-gray-700 dark:text-gray-300 break-all">
                            {email}
                        </span>
                        . The link expires in 15 minutes.
                    </p>
                </div>

                <button
                    onClick={() => setSent(false)}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Didn't get it? Send again
                </button>

                <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 pt-2"
                >
                    <FiArrowLeft size={16} />
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Forgot password?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter the email linked to your account and we'll send you a
                    link to reset it.
                </p>
            </div>

            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-gray-600
                bg-white
                dark:bg-gray-900
                px-4
                py-3
                text-gray-900
                dark:text-white
                outline-none
                "
                required
            />

            <button
                type="submit"
                disabled={loading}
                className="
                w-full
                rounded-xl
                bg-primary
                py-3
                font-semibold
                text-white
                transition-all
                duration-300
                hover:opacity-90
                disabled:opacity-50
                "
            >
                {loading ? "Sending link..." : "Send reset link"}
            </button>

            <Link
                href="/auth/login"
                className="flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                <FiArrowLeft size={16} />
                Back to login
            </Link>
        </form>
    );
};

export default ForgotPasswordForm;