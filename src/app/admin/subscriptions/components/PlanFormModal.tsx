"use client";

import { useEffect, useState, FormEvent } from "react";
import { FiX } from "react-icons/fi";
import {
    CreatePlanPayload,
    SubscriptionPlan,
    UpdatePlanPayload,
} from "@/src/types/subscription.types";

interface PlanFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: CreatePlanPayload | UpdatePlanPayload) => Promise<void>;
    initialData?: SubscriptionPlan | null;
    submitting: boolean;
}

const EMPTY_FORM: CreatePlanPayload = {
    name: "",
    amount: 0,
    durationInDays: 30,
    maxStaff: 1,
    maxBranches: 1,
    maxBookings: 100,
    description: "",
};

const FIELD_LABELS: Record<keyof CreatePlanPayload, string> = {
    name: "Plan name",
    amount: "Amount (₹)",
    durationInDays: "Duration (days)",
    maxStaff: "Max staff",
    maxBranches: "Max branches",
    maxBookings: "Max bookings",
    description: "Description",
};

const PlanFormModal = ({
    open,
    onClose,
    onSubmit,
    initialData,
    submitting,
}: PlanFormModalProps) => {
    const [form, setForm] = useState<CreatePlanPayload>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = Boolean(initialData);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name,
                amount: initialData.amount,
                durationInDays: initialData.durationInDays,
                maxStaff: initialData.maxStaff,
                maxBranches: initialData.maxBranches,
                maxBookings: initialData.maxBookings,
                description: initialData.description,
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
    }, [initialData, open]);

    if (!open) return null;

    const updateField = (key: keyof CreatePlanPayload, value: string) => {
        const isNumeric = key !== "name" && key !== "description";
        setForm((prev) => ({
            ...prev,
            [key]: isNumeric ? Number(value) : value,
        }));
    };

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!form.name.trim()) nextErrors.name = "Plan name is required.";
        if (!form.description.trim())
            nextErrors.description = "Description is required.";
        if (form.amount < 0) nextErrors.amount = "Amount cannot be negative.";
        if (form.durationInDays <= 0)
            nextErrors.durationInDays = "Duration must be at least 1 day.";
        if (form.maxStaff < 0) nextErrors.maxStaff = "Cannot be negative.";
        if (form.maxBranches < 0) nextErrors.maxBranches = "Cannot be negative.";
        if (form.maxBookings < 0) nextErrors.maxBookings = "Cannot be negative.";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/50"
            />

            <div
                className="
                relative w-full sm:max-w-lg
                max-h-[92vh] overflow-y-auto
                rounded-t-2xl sm:rounded-2xl
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                shadow-xl
                "
            >
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {isEdit ? "Edit plan" : "Create new plan"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        aria-label="Close"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            {FIELD_LABELS.name}
                        </label>
                        <input
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="Gold Plan"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                {FIELD_LABELS.amount}
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.amount}
                                onChange={(e) => updateField("amount", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.amount && (
                                <p className="text-xs text-red-500">{errors.amount}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                {FIELD_LABELS.durationInDays}
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={form.durationInDays}
                                onChange={(e) =>
                                    updateField("durationInDays", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.durationInDays && (
                                <p className="text-xs text-red-500">
                                    {errors.durationInDays}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                {FIELD_LABELS.maxStaff}
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.maxStaff}
                                onChange={(e) => updateField("maxStaff", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                {FIELD_LABELS.maxBranches}
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.maxBranches}
                                onChange={(e) =>
                                    updateField("maxBranches", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                {FIELD_LABELS.maxBookings}
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.maxBookings}
                                onChange={(e) =>
                                    updateField("maxBookings", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            {FIELD_LABELS.description}
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                updateField("description", e.target.value)
                            }
                            rows={3}
                            placeholder="What this plan includes..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">{errors.description}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
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
                                : "Create plan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlanFormModal;