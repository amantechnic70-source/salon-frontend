"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

import { serviceService } from "@/src/services/service/service.service";
import { branchService } from "@/src/services/branch/branch.service";
import { Branch } from "@/src/types/branch.types";
import { Service, UpdateServicePayload } from "@/src/types/service.types";
import ServiceFormModal from "../create/components/ServiceFormModal";

export default function EditServicePage() {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;

    const [service, setService] = useState<Service | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [serviceRes, branchRes] = await Promise.all([
                    serviceService.getById(serviceId),
                    branchService.getAll(),
                ]);
                setService(serviceRes.data.data);
                setBranches(branchRes.data.data ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load service."
                );
                router.push("/salon/services");
            } finally {
                setLoading(false);
            }
        })();
    }, [serviceId, router]);

    const handleSubmit = async (payload: UpdateServicePayload) => {
        setSubmitting(true);
        try {
            const res = await serviceService.update(serviceId, payload);
            toast.success(res.data.message || "Service updated successfully.");
            router.push("/salon/services");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not update service."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await serviceService.deleteService(serviceId);
            toast.success(res.data.message || "Service deleted successfully.");
            router.push("/salon/services");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not delete service."
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

    if (!service) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/salon/services"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <FiArrowLeft size={16} />
                    Back to services
                </Link>

                <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                    <FiTrash2 size={15} />
                    Delete service
                </button>
            </div>

            <ServiceFormModal
                mode="edit"
                initialData={service}
                branches={branches}
                onSubmit={handleSubmit}
                submitting={submitting}
                onCancel={() => router.push("/salon/services")}
            />

            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setDeleteConfirmOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Delete {service.name}?
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            This service will no longer be bookable by customers.
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
                                {deleting ? "Deleting..." : "Delete service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}