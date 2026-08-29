"use client";

import { FiStar } from "react-icons/fi";

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    size?: number;
    readOnly?: boolean;
}

const StarRating = ({ value, onChange, size = 22, readOnly = false }: StarRatingProps) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onChange?.(star)}
                    className={readOnly ? "cursor-default" : "cursor-pointer"}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                    <FiStar
                        size={size}
                        className={
                            star <= value
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-gray-700"
                        }
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;