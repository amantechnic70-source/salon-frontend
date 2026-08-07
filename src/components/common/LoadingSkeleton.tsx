interface LoadingSkeletonProps {
    variant?: "salon-row" | "salon-compact" | "banner";
    count?: number;
}

const LoadingSkeleton = ({ variant = "salon-row", count = 3 }: LoadingSkeletonProps) => {
    if (variant === "banner") {
        return (
            <div className="h-24 w-full rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        );
    }

    if (variant === "salon-compact") {
        return (
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className="shrink-0 w-44 h-40 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="h-24 w-full rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                />
            ))}
        </div>
    );
};

export default LoadingSkeleton;