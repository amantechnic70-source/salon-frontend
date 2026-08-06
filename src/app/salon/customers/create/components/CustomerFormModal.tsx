"use client";

import { useEffect, useState, FormEvent } from "react";
import {
    Customer,
    CreateCustomerPayload,
    UpdateCustomerPayload,
} from "@/src/types/customer.types";

interface CustomerFormModalProps {
    mode: "create" | "edit";
    initialData?: Customer | null;
    onSubmit: any;
    submitting: boolean;
    onCancel: () => void;
}

const EMPTY_FORM: CreateCustomerPayload = {
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
};

const PHONE_REGEX = /^[6-9]\d{9}$/;

const CustomerFormModal = ({
    mode,
    initialData,
    onSubmit,
    submitting,
    onCancel,
}: CustomerFormModalProps) => {
    const [form, setForm] = useState<CreateCustomerPayload>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = mode === "edit";

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name,
                email: initialData.email || "",
                phone: initialData.phone || "",
                gender: initialData.gender || "",
                dateOfBirth: initialData.dateOfBirth
                    ? initialData.dateOfBirth.slice(0, 10)
                    : "",
                address: initialData.address || "",
            });
        }
    }, [initialData]);

    const updateField = (key: keyof CreateCustomerPayload, value: string) => {
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

        if (!form.name.trim()) nextErrors.name = "Customer name is required.";

        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (form.phone && !PHONE_REGEX.test(form.phone)) {
            nextErrors.phone = "Enter a valid 10-digit mobile number.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

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
                    {isEdit ? "Edit customer" : "Add new customer"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {isEdit
                        ? "Update this customer's details."
                        : "Add a walk-in or returning customer to your records."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Anjali Verma"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder="anjali@email.com"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Phone
                        </label>
                        <input
                            value={form.phone}
                            onChange={(e) =>
                                updateField("phone", e.target.value.replace(/\D/g, ""))
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Gender
                        </label>
                        <select
                            value={form.gender}
                            onChange={(e) => updateField("gender", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Date of birth
                        </label>
                        <input
                            type="date"
                            value={form.dateOfBirth}
                            onChange={(e) =>
                                updateField("dateOfBirth", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Address
                    </label>
                    <textarea
                        value={form.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        rows={2}
                        placeholder="Street, area, city..."
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    />
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
                                : "Adding..."
                            : isEdit
                            ? "Save changes"
                            : "Add customer"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerFormModal;