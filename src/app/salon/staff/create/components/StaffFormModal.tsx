"use client";

import { useEffect, useState, FormEvent } from "react";
import {
    CreateStaffPayload,
    Staff,
    UpdateStaffPayload,
} from "@/src/types/staff.types";
import { Branch } from "@/src/types/branch.types";

interface StaffFormModalProps {
    mode: "create" | "edit";
    initialData?: Staff | null;
    branches: Branch[];
    onSubmit: any;
    submitting: boolean;
    onCancel: () => void;
}

const EMPTY_FORM: CreateStaffPayload = {
    branchId: "",
    name: "",
    email: "",
    phone: "",
    designation: "",
    salary: undefined,
    commissionPercentage: undefined,
    experience: undefined,
    joiningDate: "",
    gender: "",
    description: "",
};

const PHONE_REGEX = /^[6-9]\d{9}$/;

const StaffFormModal = ({
    mode,
    initialData,
    branches,
    onSubmit,
    submitting,
    onCancel,
}: StaffFormModalProps) => {
    const [form, setForm] = useState<CreateStaffPayload>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = mode === "edit";

    useEffect(() => {
        if (initialData) {
            setForm({
                branchId:
                    typeof initialData.branchId === "string"
                        ? initialData.branchId
                        : "",
                name: initialData.name,
                email: initialData.email || "",
                phone: initialData.phone || "",
                designation: initialData.designation || "",
                salary: initialData.salary,
                commissionPercentage: initialData.commissionPercentage,
                experience: initialData.experience,
                joiningDate: initialData.joiningDate
                    ? initialData.joiningDate.slice(0, 10)
                    : "",
                gender: initialData.gender || "",
                description: initialData.description || "",
            });
        }
    }, [initialData]);

    const updateField = (key: keyof CreateStaffPayload, value: string) => {
        const numericFields: (keyof CreateStaffPayload)[] = [
            "salary",
            "commissionPercentage",
            "experience",
        ];

        setForm((prev) => ({
            ...prev,
            [key]: numericFields.includes(key)
                ? value === ""
                    ? undefined
                    : Number(value)
                : value,
        }));

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

        if (!form.branchId) nextErrors.branchId = "Please select a branch.";
        if (!form.name.trim()) nextErrors.name = "Staff name is required.";

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

        // Strip empty optional strings so backend @IsOptional validators
        // don't choke on "" for fields like email/phone/gender.
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
                    {isEdit ? "Edit staff member" : "Add staff member"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {isEdit
                        ? "Update this team member's details."
                        : "Add a new team member to one of your branches."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Priya Sharma"
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
                            placeholder="priya@salon.com"
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
                            Designation
                        </label>
                        <input
                            value={form.designation}
                            onChange={(e) =>
                                updateField("designation", e.target.value)
                            }
                            placeholder="Senior Stylist"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

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
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Salary (₹)
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={form.salary ?? ""}
                            onChange={(e) => updateField("salary", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Commission %
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            value={form.commissionPercentage ?? ""}
                            onChange={(e) =>
                                updateField("commissionPercentage", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Experience (yrs)
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={form.experience ?? ""}
                            onChange={(e) => updateField("experience", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Joining date
                    </label>
                    <input
                        type="date"
                        value={form.joiningDate}
                        onChange={(e) => updateField("joiningDate", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Description
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        rows={2}
                        placeholder="Notes about this staff member..."
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
                            : "Add staff"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StaffFormModal;