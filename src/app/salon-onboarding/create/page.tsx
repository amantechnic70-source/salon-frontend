"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiHome,
    FiMail,
    FiPhone,
    FiMapPin,
    FiFileText,
    FiHash,
} from "react-icons/fi";

import { salonService } from "@/src/services/salon/salon.service";
import { CreateSalonPayload } from "@/src/types/salon.types";

const INITIAL_FORM: CreateSalonPayload = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    gstNumber: "",
    description: "",
};

const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export default function CreateSalonPage() {
    const router = useRouter();

    const [form, setForm] = useState<CreateSalonPayload>(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const updateField = (key: keyof CreateSalonPayload, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!form.name?.trim()) {
            nextErrors.name = "Salon name is required.";
        }

        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (form.phone && !INDIAN_PHONE_REGEX.test(form.phone)) {
            nextErrors.phone =
                "Enter a valid 10-digit mobile number (starting with 6-9).";
        }

        if (form.pincode && !/^[0-9]{4,10}$/.test(form.pincode)) {
            nextErrors.pincode = "Enter a valid pincode.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        setLoading(true);
        try {
            const res = await salonService.createSalon(form);
            toast.success(res.data.message || "Salon created successfully.");
            router.push("/salon/dashboard");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not create salon."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <FiHome size={22} className="text-primary" />
                    </div>
                    <h1 className="mt-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Set up your salon
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Tell us about your business. You can update these details
                        anytime from your dashboard.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-8 space-y-6"
                >
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                            Basic Information
                        </h2>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Salon name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FiHome
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    placeholder="Glow & Glam Salon"
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    Business email
                                </label>
                                <div className="relative">
                                    <FiMail
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            updateField("email", e.target.value)
                                        }
                                        placeholder="contact@salon.com"
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    Phone number
                                </label>
                                <div className="relative">
                                    <FiPhone
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        value={form.phone}
                                        onChange={(e) =>
                                            updateField(
                                                "phone",
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        maxLength={10}
                                        inputMode="numeric"
                                        placeholder="9876543210"
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-xs text-red-500">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    updateField("description", e.target.value)
                                }
                                rows={3}
                                placeholder="A short description of your salon and services..."
                                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide pt-4">
                            Location
                        </h2>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Address
                            </label>
                            <div className="relative">
                                <FiMapPin
                                    size={16}
                                    className="absolute left-3.5 top-3.5 text-gray-400"
                                />
                                <input
                                    value={form.address}
                                    onChange={(e) =>
                                        updateField("address", e.target.value)
                                    }
                                    placeholder="Shop no, street, area"
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    City
                                </label>
                                <input
                                    value={form.city}
                                    onChange={(e) => updateField("city", e.target.value)}
                                    placeholder="Gurugram"
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    State
                                </label>
                                <input
                                    value={form.state}
                                    onChange={(e) => updateField("state", e.target.value)}
                                    placeholder="Haryana"
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    Pincode
                                </label>
                                <input
                                    value={form.pincode}
                                    onChange={(e) =>
                                        updateField(
                                            "pincode",
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    inputMode="numeric"
                                    placeholder="122001"
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                {errors.pincode && (
                                    <p className="text-xs text-red-500">
                                        {errors.pincode}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Country
                            </label>
                            <input
                                value={form.country}
                                onChange={(e) => updateField("country", e.target.value)}
                                placeholder="India"
                                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide pt-4">
                            Business Details
                        </h2>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                GST number (optional)
                            </label>
                            <div className="relative">
                                <FiHash
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    value={form.gstNumber}
                                    onChange={(e) =>
                                        updateField("gstNumber", e.target.value)
                                    }
                                    placeholder="22AAAAA0000A1Z5"
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                        w-full rounded-xl bg-primary py-3.5
                        text-sm font-semibold text-white
                        transition-all hover:opacity-90
                        disabled:cursor-not-allowed disabled:opacity-50
                        flex items-center justify-center gap-2
                        "
                    >
                        <FiFileText size={16} />
                        {loading ? "Creating salon..." : "Create my salon"}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                    Your salon will be reviewed and verified before appearing in
                    public search results.
                </p>
            </div>
        </div>
    );
}