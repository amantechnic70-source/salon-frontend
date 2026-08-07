"use client";

export type AppointmentTab = "upcoming" | "completed" | "cancelled";

interface AppointmentTabsProps {
    active: AppointmentTab;
    onChange: (tab: AppointmentTab) => void;
    counts: Record<AppointmentTab, number>;
}

const TABS: { key: AppointmentTab; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
];

const AppointmentTabs = ({ active, onChange, counts }: AppointmentTabsProps) => {
    return (
        <div className="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
            {TABS.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`
                    flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs sm:text-sm font-medium
                    transition-colors
                    ${
                        active === tab.key
                            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }
                    `}
                >
                    {tab.label}
                    {counts[tab.key] > 0 && (
                        <span
                            className={`
                            text-[10px] rounded-full px-1.5 py-0.5
                            ${
                                active === tab.key
                                    ? "bg-primary/10 text-primary"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            }
                            `}
                        >
                            {counts[tab.key]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default AppointmentTabs;