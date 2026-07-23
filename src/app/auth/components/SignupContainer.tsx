"use client";

import { useState } from "react";
import Link from "next/link";

import SignupTabs from "./SignupTabs";
import CustomerSignupForm from "./CustomerSignupForm";
import SalonSignupForm from "./SalonSignupForm";

export type SignupType = "customer" | "salon";

const SignupContainer = () => {
    const [signupType, setSignupType] =
        useState<SignupType>("customer");

    return (
        <div
            className="
                min-h-screen
                bg-gray-100
                dark:bg-gray-900
                flex
                items-center
                justify-center
                px-4
                py-10
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    bg-white
                    dark:bg-gray-800
                    shadow-xl
                    p-6
                    md:p-8
                "
            >
                {/* Logo */}
                <div className="mb-4 text-center">
                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Salon Marketplace
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-gray-600
                            dark:text-gray-300
                        "
                    >
                        Create your account and start
                        managing your salon business.
                    </p>
                </div>

                {/* Signup Tabs */}
                <SignupTabs
                    signupType={signupType}
                    setSignupType={setSignupType}
                />

                {/* Form */}
                <div className="mt-6">
                    {signupType === "customer" ? (
                        <CustomerSignupForm />
                    ) : (
                        <SalonSignupForm />
                    )}
                </div>

                {/* Login */}
                <div className="mt-6 text-center">
                    <p
                        className="
                            text-sm
                            text-gray-600
                            dark:text-gray-300
                        "
                    >
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="
                                font-semibold
                                text-primary
                                hover:underline
                            "
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupContainer;