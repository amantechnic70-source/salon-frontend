"use client";

import { SubscriptionPlan } from "@/src/types/subscription.types";

interface DeletePlanDialogProps {
    open: boolean;
    plan: SubscriptionPlan | null;
    onClose: () => void;
    onConfirm: () => void;
    deleting: boolean;
}

const DeletePlanDialog = ({
    open,
    plan,
    onClose,
    onConfirm,
    deleting,
}: DeletePlanDialogProps) => {
    if (!open || !plan) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div onClick={onClose} className="absolute inset-0 bg-black/50" />

            <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Delete “{plan.name}”?
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    This deactivates the plan. Salons already subscribed to it
                    won't be affected, but new salons won't be able to select it.
                </p>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete plan"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePlanDialog;