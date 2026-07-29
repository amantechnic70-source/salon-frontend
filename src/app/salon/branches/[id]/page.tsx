"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

import { branchService } from "@/src/services/branch/branch.service";
import { Branch, UpdateBranchPayload } from "@/src/types/branch.types";
import BranchFormModal from "../components/BranchFormModal";

export default function EditBranchPage() {
    const params = useParams();
    const router = useRouter();
    const branchId = params.id as string;

    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await branchService.getById(branchId);
                setBranch(res.data.data);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load branch."
                );
                router.push("/salon/branches");
            } finally {
                setLoading(false);
            }
        })();
    }, [branchId, router]);

    const handleSubmit = async (payload: UpdateBranchPayload) => {
        setSubmitting(true);
        try {
            const res = await branchService.update(branchId, payload);
            toast.success(res.data.message || "Branch updated successfully.");
            router.push("/salon/branches");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not update branch."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await branchService.deleteBranch(branchId);
            toast.success(res.data.message || "Branch deleted successfully.");
            router.push("/salon/branches");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not delete branch."
            );
        } finally {
            setDeleting(false);
            setDeleteConfirmOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 animate-pulse space-y-4">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
            </div>
        );
    }

    if (!branch) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/salon/branches"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <FiArrowLeft size={16} />
                    Back to branches
                </Link>

                <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                    <FiTrash2 size={15} />
                    Delete branch
                </button>
            </div>

            <BranchFormModal
                mode="edit"
                initialData={branch}
                onSubmit={handleSubmit}
                submitting={submitting}
                onCancel={() => router.push("/salon/branches")}
            />

            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setDeleteConfirmOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Delete {branch.name}?
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Staff assigned to this branch will remain, but this
                            branch will no longer be listed. This can affect
                            appointments tied to it.
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setDeleteConfirmOpen(false)}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete branch"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}