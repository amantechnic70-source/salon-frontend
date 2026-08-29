"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiStar } from "react-icons/fi";

import { reviewService } from "@/src/services/reviewService";
import StarRating from "@/src/components/common/StarRating";

function CreateReviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("appointmentId") || "";

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!appointmentId) {
            toast.error("Missing appointment reference.");
            return;
        }
        if (rating < 1) {
            toast.error("Please select a rating.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await reviewService.create({
                appointmentId,
                rating,
                review: reviewText.trim() || undefined,
            });
            toast.success(res.data.message || "Review submitted successfully.");
            router.push("/customer/reviews");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not submit review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!appointmentId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    No appointment selected. Please open this page from a
                    completed appointment.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            <div className="max-w-lg mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <FiArrowLeft size={16} />
                    Back
                </button>

                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <FiStar size={24} className="text-primary" />
                    </div>

                    <h1 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        How was your experience?
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Your feedback helps other customers and the salon.
                    </p>

                    <div className="mt-6 flex justify-center">
                        <StarRating value={rating} onChange={setRating} size={36} />
                    </div>

                    <div className="mt-6 text-left space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Write a review (optional)
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            placeholder="Tell us about your visit..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {submitting ? "Submitting..." : "Submit review"}
                    </button>

                    <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                        Your review will be visible after it's approved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CreateReviewPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />
            }
        >
            <CreateReviewContent />
        </Suspense>
    );
}