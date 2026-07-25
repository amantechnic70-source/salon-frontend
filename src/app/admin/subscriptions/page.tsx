"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiPackage } from "react-icons/fi";
import {
    CreatePlanPayload,
    SubscriptionPlan,
    UpdatePlanPayload,
} from "@/src/types/subscription.types";
import PlanCard from "./components/PlanCard";
import PlanFormModal from "./components/PlanFormModal";
import DeletePlanDialog from "./components/DeletePlanDialog";
import { subscriptionService } from "@/src/services/subscrption/subscrption.service";


const PlanCardSkeleton = () => (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 animate-pulse">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-5 w-32 mt-2 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-8 w-24 mt-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full mt-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-2/3 mt-2 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-16 w-full mt-5 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
);

export default function SubscriptionPlansPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(
        null
    );

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            const res = await subscriptionService.getPlans();
            setPlans(res.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load plans."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleOpenCreate = () => {
        setEditingPlan(null);
        setFormOpen(true);
    };

    const handleOpenEdit = (plan: SubscriptionPlan) => {
        setEditingPlan(plan);
        setFormOpen(true);
    };

    const handleFormSubmit = async (
        payload: CreatePlanPayload | UpdatePlanPayload
    ) => {
        setSubmitting(true);
        try {
            if (editingPlan) {
                const res = await subscriptionService.updatePlan(
                    editingPlan._id,
                    payload
                );
                setPlans((prev) =>
                    prev.map((p) => (p._id === editingPlan._id ? res.data : p))
                );
                toast.success(res.message || "Plan updated successfully.");
            } else {
                const res = await subscriptionService.createPlan(
                    payload as CreatePlanPayload
                );
                setPlans((prev) => [res.data, ...prev]);
                toast.success(res.message || "Plan created successfully.");
            }
            setFormOpen(false);
            setEditingPlan(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ||
                (editingPlan ? "Could not update plan." : "Could not create plan.")
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenDelete = (plan: SubscriptionPlan) => {
        setPlanToDelete(plan);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!planToDelete) return;
        setDeleting(true);
        try {
            const res = await subscriptionService.deletePlan(planToDelete._id);
            setPlans((prev) =>
                prev.map((p) =>
                    p._id === planToDelete._id ? { ...p, isActive: false } : p
                )
            );
            toast.success(res.message || "Plan deleted successfully.");
            setDeleteOpen(false);
            setPlanToDelete(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not delete plan."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                        Subscription Plans
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Create and manage the plans salon owners can subscribe to.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="
                    inline-flex items-center justify-center gap-2
                    rounded-lg bg-primary px-4 py-2.5
                    text-sm font-medium text-white
                    hover:opacity-90
                    "
                >
                    <FiPlus size={18} />
                    New plan
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <PlanCardSkeleton key={i} />
                    ))}
                </div>
            ) : plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <FiPackage size={32} className="text-gray-300 dark:text-gray-600" />
                    <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        No plans yet
                    </p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                        Create your first subscription plan for salon owners to select.
                    </p>
                    <button
                        onClick={handleOpenCreate}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                    >
                        <FiPlus size={18} />
                        Create plan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan._id}
                            plan={plan}
                            onEdit={() => handleOpenEdit(plan)}
                            onDelete={() => handleOpenDelete(plan)}
                        />
                    ))}
                </div>
            )}

            <PlanFormModal
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingPlan(null);
                }}
                onSubmit={handleFormSubmit}
                initialData={editingPlan}
                submitting={submitting}
            />

            <DeletePlanDialog
                open={deleteOpen}
                plan={planToDelete}
                onClose={() => {
                    setDeleteOpen(false);
                    setPlanToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                deleting={deleting}
            />
        </div>
    );
}