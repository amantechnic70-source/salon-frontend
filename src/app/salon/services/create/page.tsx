"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { serviceService } from "@/src/services/service/service.service";
import { branchService } from "@/src/services/branch/branch.service";
import { Branch } from "@/src/types/branch.types";
import { CreateServicePayload } from "@/src/types/service.types";
import ServiceFormModal from "./components/ServiceFormModal";

export default function CreateServicePage() {
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

    const handleSubmit = async (payload: CreateServicePayload) => {
        setSubmitting(true);
        try {
            const res = await serviceService.create(payload);
            toast.success(res.data.message || "Service created successfully.");
            router.push("/salon/services");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not create service."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/salon/services"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                <FiArrowLeft size={16} />
                Back to services
            </Link>

            {loadingBranches ? (
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 animate-pulse space-y-4">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
            ) : branches.length === 0 ? (
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        You need a branch first
                    </p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                        Services are assigned to a branch. Add one before creating services.
                    </p>
                    <Link
                        href="/salon/branches/create"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                    >
                        Add a branch
                    </Link>
                </div>
            ) : (
                <ServiceFormModal
                    mode="create"
                    branches={branches}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    onCancel={() => router.push("/salon/services")}
                />
            )}
        </div>
    );
}