"use client";

import { FiEdit2, FiTrash2, FiClock } from "react-icons/fi";
import { Review } from "@/src/types/review.types";
import StarRating from "./StarRating";

interface ReviewCardProps {
    review: Review;
    onEdit: () => void;
    onDelete: () => void;
}

const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
    const salonName =
        typeof review.salonId === "object" ? review.salonId.name : "Salon";
    const canModify = !review.isApproved;

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                        {salonName}
                    </p>
                    <div className="mt-1.5">
                        <StarRating value={review.rating} readOnly size={16} />
                    </div>
                </div>

                <span
                    className={`
                    shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium
                    ${
                        review.isApproved
                            ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                    }
                    `}
                >
                    {review.isApproved ? "Published" : "Pending review"}
                </span>
            </div>

            {review.review && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {review.review}
                </p>
            )}

            <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <FiClock size={11} />
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </span>

                {canModify && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onEdit}
                            className="p-2 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10"
                            aria-label="Edit review"
                        >
                            <FiEdit2 size={14} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            aria-label="Delete review"
                        >
                            <FiTrash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {review.isApproved && (
                <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                    Published reviews can no longer be edited or deleted.
                </p>
            )}
        </div>
    );
};

export default ReviewCard;