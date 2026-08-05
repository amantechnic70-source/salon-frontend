"use client";

import { useEffect, useState, FormEvent } from "react";
import {
    CreateServicePayload,
    Service,
    UpdateServicePayload,
} from "@/src/types/service.types";
import { Branch } from "@/src/types/branch.types";

interface ServiceFormModalProps {
    mode: "create" | "edit";
    initialData?: Service | null;
    branches: Branch[];
    onSubmit: any;
    submitting: boolean;
    onCancel: () => void;
}

const CATEGORY_OPTIONS = [
    "Hair",
    "Skin Care",
    "Nail Care",
    "Spa & Massage",
    "Makeup",
    "Waxing",
    "Grooming",
    "Other",
];

interface FormState {
    branchId: string;
    name: string;
    category: string;
    description: string;
    serviceImage: string;
    genderType: string;
    price: string;
    discount: string;
    duration: string;
}

const EMPTY_FORM: FormState = {
    branchId: "",
    name: "",
    category: "",
    description: "",
    serviceImage: "",
    genderType: "",
    price: "",
    discount: "",
    duration: "",
};

const ServiceFormModal = ({
    mode,
    initialData,
    branches,
    onSubmit,
    submitting,
    onCancel,
}: ServiceFormModalProps) => {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = mode === "edit";

    useEffect(() => {
        if (initialData) {
            setForm({
                branchId:
                    typeof initialData.branchId === "string"
                        ? initialData.branchId
                        : initialData.branchId._id,
                name: initialData.name,
                category: initialData.category || "",
                description: initialData.description || "",
                serviceImage: initialData.serviceImage || "",
                genderType: initialData.genderType || "",
                price: String(initialData.price ?? ""),
                discount: String(initialData.discount ?? ""),
                duration: String(initialData.duration ?? ""),
            });
        }
    }, [initialData]);

    const updateField = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const priceNum = Number(form.price) || 0;
    const discountNum = Number(form.discount) || 0;
    const finalPrice = discountNum
        ? Math.round(priceNum - (priceNum * discountNum) / 100)
        : priceNum;

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!form.branchId) nextErrors.branchId = "Please select a branch.";
        if (!form.name.trim()) nextErrors.name = "Service name is required.";

        if (!form.price || Number(form.price) <= 0) {
            nextErrors.price = "Enter a valid price.";
        }

        if (!form.duration || Number(form.duration) <= 0) {
            nextErrors.duration = "Enter a valid duration in minutes.";
        }

        if (form.discount && (Number(form.discount) < 0 || Number(form.discount) > 100)) {
            nextErrors.discount = "Discount must be between 0 and 100.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: any = {
            branchId: form.branchId,
            name: form.name,
            price: Number(form.price),
            duration: Number(form.duration),
        };

        if (form.category) payload.category = form.category;
        if (form.description) payload.description = form.description;
        if (form.serviceImage) payload.serviceImage = form.serviceImage;
        if (form.genderType) payload.genderType = form.genderType;
        if (form.discount) payload.discount = Number(form.discount);

        await onSubmit(payload);
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-8">
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {isEdit ? "Edit service" : "Add new service"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {isEdit
                        ? "Update this service's details."
                        : "Add a service that customers can book."}
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
                            Branch <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.branchId}
                            onChange={(e) => updateField("branchId", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select a branch</option>
                            {branches.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.name} {b.city ? `— ${b.city}` : ""}
                                </option>
                            ))}
                        </select>
                        {errors.branchId && (
                            <p className="text-xs text-red-500">{errors.branchId}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Service name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="Haircut & Styling"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Category
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => updateField("category", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Select category</option>
                                {CATEGORY_OPTIONS.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Gender
                            </label>
                            <select
                                value={form.genderType}
                                onChange={(e) =>
                                    updateField("genderType", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                                <option value="">All genders</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="UNISEX">Unisex</option>
                            </select>
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
                            placeholder="What's included in this service..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        />
                    </div>
                </div>

                {/* Pricing & Duration */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Pricing & Duration
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.price}
                                onChange={(e) => updateField("price", e.target.value)}
                                placeholder="500"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.price && (
                                <p className="text-xs text-red-500">{errors.price}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={form.discount}
                                onChange={(e) =>
                                    updateField("discount", e.target.value)
                                }
                                placeholder="0"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.discount && (
                                <p className="text-xs text-red-500">
                                    {errors.discount}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Duration (mins) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.duration}
                                onChange={(e) =>
                                    updateField("duration", e.target.value)
                                }
                                placeholder="45"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.duration && (
                                <p className="text-xs text-red-500">
                                    {errors.duration}
                                </p>
                            )}
                        </div>
                    </div>

                    {priceNum > 0 && discountNum > 0 && (
                        <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                ₹{priceNum}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                                ₹{finalPrice}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                after {discountNum}% off
                            </span>
                        </div>
                    )}
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
                            : "Create service"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceFormModal;