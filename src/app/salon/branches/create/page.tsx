"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { branchService } from "@/src/services/branch/branch.service";
import { CreateBranchPayload } from "@/src/types/branch.types";
import BranchFormModal from "../components/BranchFormModal";

export default function CreateBranchPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (payload: CreateBranchPayload) => {
        setSubmitting(true);
        try {
            const res = await branchService.create(payload);
            toast.success(res.data.message || "Branch created successfully.");
            router.push("/salon/branches");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not create branch."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/salon/branches"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                <FiArrowLeft size={16} />
                Back to branches
            </Link>

            <BranchFormModal
                mode="create"
                onSubmit={handleSubmit}
                submitting={submitting}
                onCancel={() => router.push("/salon/branches")}
            />
        </div>
    );
}