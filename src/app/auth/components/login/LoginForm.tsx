"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { authService } from "@/src/services/auth/auth.service";
import { setAccessToken } from "@/src/utils/cookies";
import { subscriptionService } from "@/src/services/subscrption/subscrption.service";

const LoginForm = () => {
    const router = useRouter();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const handleLogin = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response =
                await authService.login({
                    email,
                    password,
                });

            const {
                accessToken,
                user,
            } = response.data;

            // Save Access Token

            setAccessToken(
                accessToken,
            );

            // Save Role

            sessionStorage.setItem(
                "role",
                user.role,
            );

            // Save User Details

            sessionStorage.setItem(
                "user",
                JSON.stringify(user),
            );

            toast.success(
                "Login successful.",
            );

            // Role Based Navigation

            switch (user.role) {
                case "CUSTOMER":

                    router.push(
                        "/customer/home",
                    );

                    break;

                case "STAFF":

                    router.push(
                        "/staff/dashboard",
                    );

                    break;

                case "SUPER_ADMIN":

                    router.push(
                        "/admin/dashboard",
                    );

                    break;

                case "SALON_OWNER":

                    if (user.role === "SALON_OWNER") {

                        if (user.salonId) {
                            router.replace("/salon/dashboard");
                            return;
                        }

                        const subscription =
                            await subscriptionService.getPlans();

                        if (subscription?.status === "ACTIVE") {
                            router.replace("/salon-onboarding/create");
                            return;
                        }

                        router.replace("/subscription");
                    }

                    break;

                default:

                    router.push(
                        "/",
                    );

                    break;
            }

        } catch (error: any) {

            toast.error(

                error?.response?.data?.message ||

                "Invalid email or password.",

            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <form
            onSubmit={handleLogin}
            className="space-y-4"
        >

            {/* Email */}
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                    setEmail(
                        e.target.value,
                    )
                }
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

            {/* Password */}

            <div className="relative">

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value,
                        )
                    }
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
                    onClick={() =>
                        setShowPassword(
                            !showPassword,
                        )
                    }
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                    dark:text-gray-400
                    "
                >
                    {
                        showPassword
                            ? <FiEyeOff size={20} />
                            : <FiEye size={20} />
                    }
                </button>

            </div>

            {/* Forgot Password */}

            <div className="flex justify-end">

                <Link
                    href="/auth/forgot-password"
                    className="
                    text-sm
                    font-medium
                    text-primary
                    hover:underline
                    "
                >
                    Forgot Password?
                </Link>

            </div>

            {/* Login Button */}

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

                {
                    loading
                        ? "Signing In..."
                        : "Login"
                }

            </button>

        </form>

    );
};

export default LoginForm;