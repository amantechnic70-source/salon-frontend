"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiArrowLeft,
    FiMapPin,
    FiGrid,
    FiUsers,
    FiScissors,
    FiCalendar,
} from "react-icons/fi";

import { Branch, SalonDetails, ServiceItem } from "@/src/types/customerBooking.types";

import BranchCard from "@/src/components/common/BranchCard";
import ServiceCard from "@/src/components/common/ServiceCard";
import LoadingSkeleton from "@/src/components/common/LoadingSkeleton";
import EmptyState from "@/src/components/common/EmptyState";
import { customerBookingService } from "@/src/services/service/customerBookingService";

export default function SalonDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const salonId = params.id as string;

    const [details, setDetails] = useState<SalonDetails | null>(null);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);
    const [selectedBranchId, setSelectedBranchId] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await customerBookingService.getSalonDetails(salonId);
                setDetails(res.data.data);
                if (res.data.data.branches.length === 1) {
                    setSelectedBranchId(res.data.data.branches[0]._id);
                }
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load salon details."
                );
                router.push("/customer/salons");
            } finally {
                setLoading(false);
            }
        })();
    }, [salonId, router]);

    useEffect(() => {
        (async () => {
            try {
                setLoadingServices(true);
                const res = await customerBookingService.getSalonServices({
                    salonId,
                    branchId: selectedBranchId || undefined,
                });
                setServices(res.data.data ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load services."
                );
            } finally {
                setLoadingServices(false);
            }
        })();
    }, [salonId, selectedBranchId]);

    const groupedServices = useMemo(() => {
        const groups: Record<string, ServiceItem[]> = {};
        services.forEach((s) => {
            const key = s.category || "Other";
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });
        return groups;
    }, [services]);

    const handleBookAppointment = () => {
        const query = selectedBranchId ? `?branchId=${selectedBranchId}` : "";
        router.push(`/customer/salons/${salonId}/book${query}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="h-48 sm:h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 space-y-4">
                    <div className="h-24 w-full rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    <LoadingSkeleton variant="salon-row" count={3} />
                </div>
            </div>
        );
    }

    if (!details) return null;

    const { salon, branches, totalBranches, totalServices, totalStaff } = details;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">
            {/* Banner */}
            <div className="relative h-48 sm:h-64 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {salon.bannerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={salon.bannerImage}
                        alt={salon.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <FiScissors size={40} className="text-gray-400 dark:text-gray-600" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <button
                    onClick={() => router.back()}
                    className="
                    absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full
                    bg-white/90 dark:bg-gray-900/90 backdrop-blur
                    text-gray-700 dark:text-gray-200
                    "
                    aria-label="Go back"
                >
                    <FiArrowLeft size={18} />
                </button>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative space-y-6">
                {/* Info card */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-900 -mt-10 overflow-hidden">
                            {salon.logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={salon.logo}
                                    alt={salon.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <FiScissors size={22} className="text-gray-300 dark:text-gray-700" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                                {salon.name}
                            </h1>
                            {salon.address && (
                                <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    <FiMapPin size={13} className="mt-0.5 shrink-0" />
                                    {salon.address}
                                </p>
                            )}
                        </div>
                    </div>

                    {salon.description && (
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {salon.description}
                        </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-3 text-center">
                        <div>
                            <FiGrid size={16} className="mx-auto text-primary" />
                            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                                {totalBranches}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                Branches
                            </p>
                        </div>
                        <div>
                            <FiScissors size={16} className="mx-auto text-primary" />
                            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                                {totalServices}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                Services
                            </p>
                        </div>
                        <div>
                            <FiUsers size={16} className="mx-auto text-primary" />
                            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                                {totalStaff}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                Staff
                            </p>
                        </div>
                    </div>
                </div>

                {/* Branches */}
                <section>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Branches
                    </h2>
                    {branches.length === 0 ? (
                        <EmptyState icon={FiMapPin} title="No branches available" />
                    ) : (
                        <div className="space-y-3">
                            {branches.map((b) => (
                                <BranchCard
                                    key={b._id}
                                    branch={b}
                                    selected={selectedBranchId === b._id}
                                    onSelect={() =>
                                        setSelectedBranchId(
                                            selectedBranchId === b._id ? "" : b._id
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}
                    {branches.length > 1 && !selectedBranchId && (
                        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                            Select a branch to see services specific to that location.
                        </p>
                    )}
                </section>

                {/* Services */}
                <section>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Services
                    </h2>

                    {loadingServices ? (
                        <LoadingSkeleton variant="salon-row" count={3} />
                    ) : services.length === 0 ? (
                        <EmptyState
                            icon={FiScissors}
                            title="No services available"
                            description={
                                selectedBranchId
                                    ? "Try selecting a different branch."
                                    : undefined
                            }
                        />
                    ) : (
                        <div className="space-y-5">
                            {Object.entries(groupedServices).map(([category, items]) => (
                                <div key={category}>
                                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                                        {category}
                                    </p>
                                    <div className="space-y-2">
                                        {items.map((s) => (
                                            <ServiceCard key={s._id} service={s} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Sticky book button */}
            <div
                className="
                fixed bottom-0 left-0 right-0 z-30
                bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800
                px-4 sm:px-6 py-3
                "
            >
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={handleBookAppointment}
                        className="
                        w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5
                        text-sm font-semibold text-white
                        hover:opacity-90 active:scale-[0.98] transition-all
                        "
                    >
                        <FiCalendar size={18} />
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    );
}