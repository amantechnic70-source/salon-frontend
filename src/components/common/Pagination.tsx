"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
    );

    return (
        <div className="flex items-center justify-center gap-1.5 pt-2">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="
                flex h-9 w-9 items-center justify-center rounded-lg
                border border-gray-200 dark:border-gray-800
                text-gray-500 dark:text-gray-400
                hover:bg-gray-50 dark:hover:bg-gray-800
                disabled:opacity-40 disabled:cursor-not-allowed
                "
                aria-label="Previous page"
            >
                <FiChevronLeft size={16} />
            </button>

            {pages.map((p, idx) => {
                const prev = pages[idx - 1];
                const showEllipsis = prev !== undefined && p - prev > 1;

                return (
                    <div key={p} className="flex items-center gap-1.5">
                        {showEllipsis && (
                            <span className="text-gray-400 dark:text-gray-600 text-sm px-1">
                                …
                            </span>
                        )}
                        <button
                            onClick={() => onPageChange(p)}
                            className={`
                            h-9 w-9 rounded-lg text-sm font-medium transition-colors
                            ${
                                p === page
                                    ? "bg-primary text-white"
                                    : "border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }
                            `}
                        >
                            {p}
                        </button>
                    </div>
                );
            })}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="
                flex h-9 w-9 items-center justify-center rounded-lg
                border border-gray-200 dark:border-gray-800
                text-gray-500 dark:text-gray-400
                hover:bg-gray-50 dark:hover:bg-gray-800
                disabled:opacity-40 disabled:cursor-not-allowed
                "
                aria-label="Next page"
            >
                <FiChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;