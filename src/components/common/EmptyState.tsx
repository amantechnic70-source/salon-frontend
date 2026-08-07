import { IconType } from "react-icons";

interface EmptyStateProps {
    icon: IconType;
    title: string;
    description?: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <Icon size={20} className="text-primary" />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
            </p>
            {description && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 max-w-xs">
                    {description}
                </p>
            )}
        </div>
    );
};

export default EmptyState;