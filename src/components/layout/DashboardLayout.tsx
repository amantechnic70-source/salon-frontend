"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useCurrentUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Session expired. Please log in again.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar
                role={user.role}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;