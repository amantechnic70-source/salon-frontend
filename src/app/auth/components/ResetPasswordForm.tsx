"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

import { authService } from "@/src/services/auth/auth.service";

const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Reset link is invalid or missing a token.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await authService.resetPassword({
                token,
                password,
            });

            setSuccess(true);

            toast.success("Password reset successfully.");

            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    "Could not reset password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Invalid reset link
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        This password reset link is missing or malformed. Please
                        request a new one.
                    </p>
                </div>

                <Link
                    href="/auth/forgot-password"
                    className="
                    inline-flex items-center justify-center
                    rounded-xl bg-primary px-5 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90
                    "
                >
                    Request new link
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
                    <FiCheckCircle size={26} className="text-green-600 dark:text-green-400" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Password reset
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Your password has been changed. Redirecting you to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Reset your password
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose a new password for your account.
                </p>
            </div>

            {/* New Password */}
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    pr-12
                    text-gray-900
                    dark:text-white
                    outline-none
                    "
                    required
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                    dark:text-gray-400
                    "
                >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    pr-12
                    text-gray-900
                    dark:text-white
                    outline-none
                    "
                    required
                />

                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                    dark:text-gray-400
                    "
                >
                    {showConfirmPassword ? (
                        <FiEyeOff size={20} />
                    ) : (
                        <FiEye size={20} />
                    )}
                </button>
            </div>

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
                {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordForm;