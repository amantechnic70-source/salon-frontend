"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiStar } from "react-icons/fi";

import { reviewService } from "@/src/services/reviewService";
import { Review, UpdateReviewPayload } from "@/src/types/review.types";

import ReviewCard from "@/src/components/common/ReviewCard";
import StarRating from "@/src/components/common/StarRating";
import LoadingSkeleton from "@/src/components/common/LoadingSkeleton";
import EmptyState from "@/src/components/common/EmptyState";

export default function MyReviewsPage() {
    const router = useRouter();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const [editTarget, setEditTarget] = useState<Review | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editText, setEditText] = useState("");
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await reviewService.getAll({ limit: "50" });
            setReviews(res.data.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load your reviews."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const openEdit = (review: Review) => {
        setEditTarget(review);
        setEditRating(review.rating);
        setEditText(review.review || "");
    };

    const handleSaveEdit = async () => {
        if (!editTarget) return;
        if (editRating < 1) {
            toast.error("Please select a rating.");
            return;
        }

        setSaving(true);
        try {
            const payload: UpdateReviewPayload = {
                rating: editRating,
                review: editText.trim() || undefined,
            };
            const res = await reviewService.update(editTarget._id, payload);
            setReviews((prev) =>
                prev.map((r) => (r._id === editTarget._id ? res.data.data : r))
            );
            toast.success(res.data.message || "Review updated.");
            setEditTarget(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not update review."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await reviewService.deleteReview(deleteTarget._id);
            setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
            toast.success(res.data.message || "Review deleted.");
            setDeleteTarget(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not delete review."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-5">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        My Reviews
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Reviews you've left for completed appointments.
                    </p>
                </div>

                {loading ? (
                    <LoadingSkeleton variant="salon-row" count={3} />
                ) : reviews.length === 0 ? (
                    <EmptyState
                        icon={FiStar}
                        title="No reviews yet"
                        description="Complete an appointment to leave your first review."
                    />
                ) : (
                    <div className="space-y-3">
                        {reviews.map((r) => (
                            <ReviewCard
                                key={r._id}
                                review={r}
                                onEdit={() => openEdit(r)}
                                onDelete={() => setDeleteTarget(r)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit modal */}
            {editTarget && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
                    <div
                        onClick={() => setEditTarget(null)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 space-y-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Edit your review
                        </h3>

                        <div className="flex justify-center">
                            <StarRating value={editRating} onChange={setEditRating} size={30} />
                        </div>

                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={4}
                            placeholder="Share your experience..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditTarget(null)}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        onClick={() => setDeleteTarget(null)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 space-y-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Delete this review?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This can't be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}