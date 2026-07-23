"use client";

import Link from "next/link";

import LoginForm from "./LoginForm";

const LoginContainer = () => {
    return (
        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                px-4
                py-10
                bg-gray-100
                dark:bg-gray-900
                transition-all
                duration-300
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    bg-white
                    dark:bg-gray-800
                    shadow-2xl
                    p-6
                    md:p-8
                "
            >
                {/* Logo */}

                <div className="flex justify-center mb-4">
                    <div
                        className="
                            h-16
                            w-16
                            rounded-2xl
                            bg-primary
                            flex
                            items-center
                            justify-center
                            text-white
                            text-2xl
                            font-bold
                        "
                    >
                        SM
                    </div>
                </div>

                {/* Heading */}

                <div className="text-center mb-8">
                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Welcome Back
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-gray-600
                            dark:text-gray-300
                        "
                    >
                        Login to your Salon Marketplace
                        account and continue managing your
                        business seamlessly.
                    </p>
                </div>

                {/* Login Form */}

                <LoginForm />

                {/* Divider */}

                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600" />

                    <span
                        className="
                            px-4
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                        "
                    >
                        OR
                    </span>

                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
                </div>

                {/* Signup */}

                <div className="text-center">
                    <p
                        className="
                            text-sm
                            text-gray-600
                            dark:text-gray-300
                        "
                    >
                        Don't have an account?
                    </p>

                    <Link
                        href="/auth/signup"
                        className="
                            mt-2
                            inline-block
                            font-semibold
                            text-primary
                            hover:underline
                        "
                    >
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginContainer;