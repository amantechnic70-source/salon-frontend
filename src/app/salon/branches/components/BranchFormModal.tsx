"use client";

import { useEffect, useState, FormEvent } from "react";
import {
    Branch,
    CreateBranchPayload,
    UpdateBranchPayload,
} from "@/src/types/branch.types";

interface BranchFormModalProps {
    mode: "create" | "edit";
    initialData?: Branch | null;
    onSubmit: any;
    submitting: boolean;
    onCancel: () => void;
}

const EMPTY_FORM: CreateBranchPayload = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    description: "",
    openingTime: "",
    closingTime: "",
};

const PHONE_REGEX = /^[6-9]\d{9}$/;

const BranchFormModal = ({
    mode,
    initialData,
    onSubmit,
    submitting,
    onCancel,
}: BranchFormModalProps) => {
    const [form, setForm] = useState<CreateBranchPayload>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = mode === "edit";

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name,
                email: initialData.email || "",
                phone: initialData.phone || "",
                address: initialData.address || "",
                city: initialData.city || "",
                state: initialData.state || "",
                country: initialData.country || "",
                pincode: initialData.pincode || "",
                description: initialData.description || "",
                openingTime: initialData.openingTime || "",
                closingTime: initialData.closingTime || "",
                latitude: initialData.latitude,
                longitude: initialData.longitude,
            });
        }
    }, [initialData]);

    const updateField = (
        key: keyof CreateBranchPayload,
        value: string
    ) => {
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

        if (!form.name.trim()) {
            nextErrors.name = "Branch name is required.";
        }

        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (form.phone && !PHONE_REGEX.test(form.phone)) {
            nextErrors.phone = "Enter a valid 10-digit mobile number.";
        }

        if (form.pincode && !/^[0-9]{4,10}$/.test(form.pincode)) {
            nextErrors.pincode = "Enter a valid pincode.";
        }

        if (
            form.openingTime &&
            form.closingTime &&
            form.openingTime >= form.closingTime
        ) {
            nextErrors.closingTime = "Closing time must be after opening time.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Strip empty optional strings so backend @IsOptional validators
        // don't choke on "" for fields like email/phone.
        const payload: any = { ...form };
        Object.keys(payload).forEach((key) => {
            if (payload[key] === "") {
                delete payload[key];
            }
        });

        await onSubmit(payload);
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-8">
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {isEdit ? "Edit branch" : "Add new branch"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {isEdit
                        ? "Update this branch's details."
                        : "Add a new location for your salon."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Basic Information
                    </h3>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Branch name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="DLF Phase 4 Branch"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Branch email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                placeholder="branch@salon.com"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Branch phone
                            </label>
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
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
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
                            rows={2}
                            placeholder="What makes this branch unique..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Location
                    </h3>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Address
                        </label>
                        <input
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="Shop no, street, area"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
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
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                                placeholder="122009"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Timings */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Operating Hours
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Opening time
                            </label>
                            <input
                                type="time"
                                value={form.openingTime}
                                onChange={(e) =>
                                    updateField("openingTime", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Closing time
                            </label>
                            <input
                                type="time"
                                value={form.closingTime}
                                onChange={(e) =>
                                    updateField("closingTime", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.closingTime && (
                                <p className="text-xs text-red-500">
                                    {errors.closingTime}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting
                            ? isEdit
                                ? "Saving..."
                                : "Creating..."
                            : isEdit
                            ? "Save changes"
                            : "Create branch"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BranchFormModal;