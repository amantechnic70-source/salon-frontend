"use client";

import { userService } from "@/src/services/user/user.service";
import { useState } from "react";
import toast from "react-hot-toast";


const CustomerSignupForm = () => {

    const [step, setStep] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [formData, setFormData] =
        useState({

            name: "",

            phone: "",

            password: "",

            confirmPassword: "",

        });

    const handleSendOtp =
        async () => {

            try {

                setLoading(true);

                await userService.sendOtp({
                    email,
                });

                toast.success(
                    "OTP sent successfully",
                );

                setStep(2);

            } catch (error: any) {

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to send OTP",
                );

            } finally {

                setLoading(false);

            }

        };

    const handleVerifyOtp =
        async () => {

            try {

                setLoading(true);

                await userService.verifyOtp({

                    email,

                    otp,

                });

                toast.success(
                    "OTP verified successfully",
                );

                setStep(3);

            } catch (error: any) {

                toast.error(
                    error?.response?.data?.message ||
                    "Invalid OTP",
                );

            } finally {

                setLoading(false);

            }

        };

    const handleSignup =
        async (
            e: React.FormEvent,
        ) => {

            e.preventDefault();

            if (
                formData.password !==
                formData.confirmPassword
            ) {

                toast.error(
                    "Passwords do not match",
                );

                return;

            }

            try {

                setLoading(true);

                await userService.customerSignup({

                    name:
                        formData.name,

                    email,

                    phone:
                        formData.phone,

                    password:
                        formData.password,

                });

                toast.success(
                    "Account created successfully",
                );

                window.location.href =
                    "/auth/login";

            } catch (error: any) {

                toast.error(
                    error?.response?.data?.message ||
                    "Signup failed",
                );

            } finally {

                setLoading(false);

            }

        };

    return (

        <div>

            {/* Step 1 */}

            {step === 1 && (

                <div className="space-y-4">

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
                    />

                    <button
                        type="button"
                        disabled={loading}
                        onClick={
                            handleSendOtp
                        }
                        className="
                        w-full
                        rounded-xl
                        bg-primary
                        py-3
                        text-white
                        font-semibold
                        "
                    >

                        {loading
                            ? "Sending..."
                            : "Send OTP"}

                    </button>

                </div>

            )}

            {/* Step 2 */}

            {step === 2 && (

                <div className="space-y-4">

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        maxLength={6}
                        onChange={(e) =>
                            setOtp(
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
                    />

                    <button
                        type="button"
                        disabled={loading}
                        onClick={
                            handleVerifyOtp
                        }
                        className="
                        w-full
                        rounded-xl
                        bg-primary
                        py-3
                        text-white
                        font-semibold
                        "
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}

                    </button>

                </div>

            )}

            {/* Step 3 */}

            {step === 3 && (

                <form
                    onSubmit={
                        handleSignup
                    }
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={
                            formData.name
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name:
                                    e.target.value,
                            })
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
                        "
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={
                            formData.phone
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                phone:
                                    e.target.value,
                            })
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
                        "
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={
                            formData.password
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password:
                                    e.target.value,
                            })
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
                        "
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={
                            formData.confirmPassword
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                confirmPassword:
                                    e.target.value,
                            })
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
                        "
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                        w-full
                        rounded-xl
                        bg-primary
                        py-3
                        text-white
                        font-semibold
                        "
                    >

                        {loading
                            ? "Creating..."
                            : "Create Account"}

                    </button>

                </form>

            )}

        </div>

    );

};

export default CustomerSignupForm;