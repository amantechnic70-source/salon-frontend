"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { customerService } from "@/src/services/customer/customer.service";
import { CreateCustomerPayload } from "@/src/types/customer.types";
import CustomerFormModal from "./components/CustomerFormModal";

export default function CreateCustomerPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (payload: CreateCustomerPayload) => {
        setSubmitting(true);
        try {
            const res = await customerService.create(payload);
            toast.success(res.data.message || "Customer added successfully.");
            router.push("/salon/customers");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not add customer."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/salon/customers"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                <FiArrowLeft size={16} />
                Back to customers
            </Link>

            <CustomerFormModal
                mode="create"
                onSubmit={handleSubmit}
                submitting={submitting}
                onCancel={() => router.push("/salon/customers")}
            />
        </div>
    );
}