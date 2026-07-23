"use client";

import { userService } from "@/src/services/user/user.service";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SalonSignupForm = () => {

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
            ownerName: "",
            phone: "",
            password: "",
            confirmPassword: "",

        });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // SEND OTP
    const handleSendOtp =
        async () => {

            try {

                setLoading(true);

                await userService.sendOtp({

                    email,

                });

                toast.success(
                    "OTP sent successfully."
                );

                setStep(2);

            } catch (error: any) {

                toast.error(

                    error?.response?.data?.message ||

                    "Failed to send OTP."

                );

            } finally {

                setLoading(false);

            }

        };


    // VERIFY OTP

    const handleVerifyOtp =
        async () => {

            try {

                setLoading(true);

                await userService.verifyOtp({

                    email,

                    otp,

                });

                toast.success(
                    "OTP verified successfully."
                );

                setStep(3);

            } catch (error: any) {

                toast.error(

                    error?.response?.data?.message ||

                    "Invalid OTP."

                );

            } finally {

                setLoading(false);

            }

        };


    // CREATE ACCOUNT

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
                    "Passwords do not match."
                );

                return;

            }

            try {

                setLoading(true);

                await userService.salonSignup({

                    ownerName:
                        formData.ownerName,

                    email,

                    phone:
                        formData.phone,

                    password:
                        formData.password,

                });


                toast.success(
                    "Salon Owner account created successfully."
                );

                window.location.href =
                    "/auth/login";

            } catch (error: any) {

                toast.error(

                    error?.response?.data?.message ||

                    "Signup failed."

                );

            } finally {

                setLoading(false);

            }

        };


    return (

        <div>

            {/* STEP 1 */}

            {

                step === 1 && (

                    <div
                        className="space-y-4"
                    >

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>

                                setEmail(
                                    e.target.value
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
                            font-semibold
                            text-white
                            "
                        >

                            {

                                loading

                                    ? "Sending..."

                                    : "Send OTP"

                            }

                        </button>

                    </div>

                )

            }


            {/* STEP 2 */}

            {

                step === 2 && (

                    <div
                        className="space-y-4"
                    >

                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) =>

                                setOtp(
                                    e.target.value
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
                            font-semibold
                            text-white
                            "
                        >

                            {

                                loading

                                    ? "Verifying..."

                                    : "Verify OTP"

                            }

                        </button>

                    </div>

                )

            }


            {/* STEP 3 */}

            {

                step === 3 && (

                    <form
                        onSubmit={
                            handleSignup
                        }
                        className="
                        space-y-4
                        "
                    >

                        <input
                            type="text"
                            placeholder="Owner Name"
                            value={
                                formData.ownerName
                            }
                            onChange={(e) =>

                                setFormData({

                                    ...formData,

                                    ownerName:
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


                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
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
        pr-12
        text-gray-900
        dark:text-white
        outline-none
        "
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
                                {showPassword ? (
                                    <FiEyeOff size={20} />
                                ) : (
                                    <FiEye size={20} />
                                )}
                            </button>

                        </div>


                        <div className="relative">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
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
        pr-12
        text-gray-900
        dark:text-white
        outline-none
        "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword,
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
                            "
                        >

                            {

                                loading

                                    ? "Creating..."

                                    : "Create Account"

                            }

                        </button>

                    </form>

                )

            }

        </div>

    );

};

export default SalonSignupForm;