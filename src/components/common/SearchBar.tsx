"use client";

import { FiSearch, FiMapPin } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

interface SearchBarProps {
    location?: string;
}

const SearchBar = ({ location }: SearchBarProps) => {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.push(
            `/customer/salons${query ? `?search=${encodeURIComponent(query)}` : ""}`
        );
    };

    return (
        <div className="space-y-2">
            {location && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <FiMapPin size={14} className="text-primary" />
                    <span className="truncate">{location}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="relative">
                <FiSearch
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search salons, services..."
                    className="
                    w-full rounded-2xl border border-gray-200 dark:border-gray-800
                    bg-white dark:bg-gray-900
                    pl-11 pr-4 py-3.5
                    text-sm text-gray-900 dark:text-white placeholder:text-gray-400
                    shadow-sm shadow-gray-200/50 dark:shadow-black/20
                    outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                    transition-shadow
                    "
                />
            </form>
        </div>
    );
};

export default SearchBar;