"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

import { staffService } from "@/src/services/staff/staff.service";
import { Staff, UpdateStaffPayload } from "@/src/types/staff.types";
import StaffFormModal from "../create/components/StaffFormModal";
import { Branch } from "@/src/types/branch.types";
import { branchService } from "@/src/services/branch/branch.service";

export default function EditStaffPage() {
    const params = useParams();
    const router = useRouter();
    const staffId = params.id as string;

    const [staff, setStaff] = useState<Staff | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [staffRes, branchRes] = await Promise.all([
                    staffService.getById(staffId),
                    branchService.getAll(),
                ]);
                setStaff(staffRes.data.data);
                setBranches(branchRes.data.data ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load staff member."
                );
                router.push("/salon/staff");
            } finally {
                setLoading(false);
            }
        })();
    }, [staffId, router]);

    const handleSubmit = async (payload: UpdateStaffPayload) => {
        setSubmitting(true);
        try {
            const res = await staffService.update(staffId, payload);
            toast.success(res.data.message || "Staff updated successfully.");
            router.push("/salon/staff");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not update staff."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await staffService.deleteStaff(staffId);
            toast.success(res.data.message || "Staff removed successfully.");
            router.push("/salon/staff");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not remove staff."
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

    if (!staff) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/salon/staff"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <FiArrowLeft size={16} />
                    Back to staff
                </Link>

                <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                    <FiTrash2 size={15} />
                    Remove staff
                </button>
            </div>

            <StaffFormModal
                mode="edit"
                initialData={staff}
                branches={branches}
                onSubmit={handleSubmit}
                submitting={submitting}
                onCancel={() => router.push("/salon/staff")}
            />

            {/* Delete confirmation */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setDeleteConfirmOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Remove {staff.name}?
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            This staff member will be removed from your active
                            staff list. Their past records won't be affected.
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
                                {deleting ? "Removing..." : "Remove staff"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}