"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

import { staffService } from "@/src/services/staff/staff.service";
import { CreateStaffPayload } from "@/src/types/staff.types";
import StaffFormModal from "./components/StaffFormModal";
import { branchService } from "@/src/services/branch/branch.service";
import { Branch } from "@/src/types/branch.types";

export default function CreateStaffPage() {
    const router = useRouter();

    const [branches, setBranches] = useState<Branch[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await branchService.getAll();
                setBranches(res.data.data ?? []);
            } catch {
                toast.error("Could not load branches.");
            } finally {
                setLoadingBranches(false);
            }
        })();
    }, []);

    const handleSubmit = async (payload: CreateStaffPayload) => {
        setSubmitting(true);
        try {
            const res = await staffService.create(payload);
            toast.success(res.data.message || "Staff added successfully.");
            router.push("/salon/staff");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not add staff."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/salon/staff"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                <FiArrowLeft size={16} />
                Back to staff
            </Link>

            {loadingBranches ? (
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 animate-pulse space-y-4">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
            ) : (
                <StaffFormModal
                    mode="create"
                    branches={branches}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    onCancel={() => router.push("/salon/staff")}
                />
            )}
        </div>
    );
}