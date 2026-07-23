"use client";

import { SignupType } from "./SignupContainer";

interface SignupTabsProps {
    signupType: SignupType;
    setSignupType: (
        type: SignupType,
    ) => void;
}

const SignupTabs = ({
    signupType,
    setSignupType,
}: SignupTabsProps) => {
    return (
        <div
            className="
                grid
                grid-cols-2
                rounded-2xl
                bg-gray-100
                dark:bg-gray-700
                p-1
            "
        >
            {/* Customer Tab */}
            <button
                type="button"
                onClick={() =>
                    setSignupType(
                        "customer",
                    )
                }
                className={`
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    cursor-pointer

                    ${
                        signupType ===
                        "customer"
                            ? `
                            bg-white
                            dark:bg-gray-900
                            text-gray-900
                            dark:text-white
                            shadow-md
                            `
                            : `
                            text-gray-600
                            dark:text-gray-300
                            hover:text-gray-900
                            dark:hover:text-white
                            `
                    }
                `}
            >
                Customer
            </button>

            {/* Salon Owner Tab */}
            <button
                type="button"
                onClick={() =>
                    setSignupType(
                        "salon",
                    )
                }
                className={`
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    cursor-pointer

                    ${
                        signupType ===
                        "salon"
                            ? `
                            bg-white
                            dark:bg-gray-900
                            text-gray-900
                            dark:text-white
                            shadow-md
                            `
                            : `
                            text-gray-600
                            dark:text-gray-300
                            hover:text-gray-900
                            dark:hover:text-white
                            `
                    }
                `}
            >
                Salon Owner
            </button>
        </div>
    );
};

export default SignupTabs;