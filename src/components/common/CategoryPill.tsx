"use client";

import Link from "next/link";
import { IconType } from "react-icons";

interface CategoryPillProps {
    label: string;
    icon: IconType;
    href: string;
}

const CategoryPill = ({ label, icon: Icon, href }: CategoryPillProps) => {
    return (
        <Link
            href={href}
            className="
            flex flex-col items-center gap-2 shrink-0 w-20
            group
            "
        >
            <div
                className="
                flex h-14 w-14 items-center justify-center rounded-2xl
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                shadow-sm shadow-gray-200/50 dark:shadow-black/20
                text-primary
                group-hover:border-primary/40 group-hover:-translate-y-0.5
                transition-all
                "
            >
                <Icon size={22} />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 text-center leading-tight">
                {label}
            </span>
        </Link>
    );
};

export default CategoryPill;