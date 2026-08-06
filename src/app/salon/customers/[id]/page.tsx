"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiArrowLeft, FiTrash2, FiGift, FiCalendar, FiDollarSign } from "react-icons/fi";

import { customerService } from "@/src/services/customer/customer.service";
import { Customer, UpdateCustomerPayload } from "@/src/types/customer.types";
import CustomerFormModal from "../create/components/CustomerFormModal";

export default function EditCustomerPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id as string;

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await customerService.getById(customerId);
                setCustomer(res.data.data);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load customer."
                );
                router.push("/salon/customers");
            } finally {
                setLoading(false);
            }
        })();
    }, [customerId, router]);

    const handleSubmit = async (payload: UpdateCustomerPayload) => {
        setSubmitting(true);
        try {
            const res = await customerService.update(customerId, payload);
            toast.success(res.data.message || "Customer updated successfully.");
            router.push("/salon/customers");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not update customer."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await customerService.deleteCustomer(customerId);
            toast.success(res.data.message || "Customer deleted successfully.");
            router.push("/salon/customers");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not delete customer."
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

    if (!customer) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/salon/customers"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <FiArrowLeft size={16} />
                    Back to customers
                </Link>

                <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                    <FiTrash2 size={15} />
                    Delete customer
                </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
                    <FiCalendar size={16} className="mx-auto text-primary" />
                    <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                        {customer.totalVisits}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        Visits
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
                    <FiDollarSign size={16} className="mx-auto text-primary" />
                    <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                        ₹{customer.totalSpent}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        Total spent
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
                    <FiGift size={16} className="mx-auto text-primary" />
                    <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                        {customer.loyaltyPoints}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        Loyalty pts
                    </p>
                </div>
            </div>

            <CustomerFormModal
                mode="edit"
                initialData={customer}
                onSubmit={handleSubmit}
                submitting={submitting}
                onCancel={() => router.push("/salon/customers")}
            />

            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setDeleteConfirmOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Delete {customer.name}?
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            This customer's record will be removed from your
                            active list. Loyalty and visit history won't be
                            recoverable from here.
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
                                {deleting ? "Deleting..." : "Delete customer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}