"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FiScissors,
    FiFeather,
    FiDroplet,
    FiSmile,
    FiStar,
    FiChevronRight,
    FiCalendar,
} from "react-icons/fi";

import { Appointment, Salon } from "@/src/types/customerBooking.types";

import SearchBar from "@/src/components/common/SearchBar";
import SalonCard from "@/src/components/common/SalonCard";
import AppointmentBanner from "@/src/components/common/AppointmentBanner";
import LoadingSkeleton from "@/src/components/common/LoadingSkeleton";
import EmptyState from "@/src/components/common/EmptyState";
import { customerBookingService } from "@/src/services/service/customerBookingService";
import CategoryPill from "@/src/components/common/CategoryPill";

const CATEGORIES = [
    { label: "Hair", icon: FiScissors },
    { label: "Skin Care", icon: FiDroplet },
    { label: "Nail Care", icon: FiFeather },
    { label: "Spa & Massage", icon: FiSmile },
    { label: "Makeup", icon: FiStar },
];

export default function CustomerHomePage() {
    const [nearbySalons, setNearbySalons] = useState<Salon[]>([]);
    const [popularSalons, setPopularSalons] = useState<Salon[]>([]);
    const [upcoming, setUpcoming] = useState<Appointment | null>(null);
    const [recent, setRecent] = useState<Appointment[]>([]);
    const [locationLabel, setLocationLabel] = useState<string>("");

    const [loadingSalons, setLoadingSalons] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        // Best-effort browser geolocation just for a friendly label;
        // no reverse-geocoding endpoint exists on the backend yet, so
        // this only shows coordinates-derived text if permission is granted.
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => setLocationLabel("Current location"),
                () => setLocationLabel(""),
                { timeout: 3000 }
            );
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setLoadingSalons(true);
                const res = await customerBookingService.getSalons({
                    page: 1,
                    limit: 10,
                });
                const salons = res.data.data ?? [];
                setNearbySalons(salons);
                // "Popular" proxy: sort by combined branch+service count
                setPopularSalons(
                    [...salons].sort(
                        (a, b) =>
                            b.totalBranches + b.totalServices -
                            (a.totalBranches + a.totalServices)
                    )
                );
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load salons."
                );
            } finally {
                setLoadingSalons(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setLoadingBookings(true);
                const res = await customerBookingService.getMyBookings({
                    page: 1,
                    limit: 5,
                });
                const bookings = res.data.data ?? [];

                const nextUpcoming = bookings
                    .filter(
                        (b) =>
                            !b.isCancelled &&
                            !b.isCompleted &&
                            new Date(b.appointmentDate).getTime() >=
                                new Date().setHours(0, 0, 0, 0)
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.appointmentDate).getTime() -
                            new Date(b.appointmentDate).getTime()
                    )[0];

                setUpcoming(nextUpcoming || null);
                setRecent(bookings.slice(0, 5));
            } catch {
                // Silently ignore — a logged-in customer without a
                // Customer profile yet (pre-first-booking) would 400 here;
                // that's expected on a first-ever visit, not a real error.
            } finally {
                setLoadingBookings(false);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
                {/* Search */}
                <SearchBar location={locationLabel} />

                {/* Upcoming appointment */}
                {loadingBookings ? (
                    <LoadingSkeleton variant="banner" />
                ) : upcoming ? (
                    <AppointmentBanner appointment={upcoming} />
                ) : null}

                {/* Categories */}
                <section>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Categories
                    </h2>
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                        {CATEGORIES.map((c) => (
                            <CategoryPill
                                key={c.label}
                                label={c.label}
                                icon={c.icon}
                                href={`/customer/salons?category=${encodeURIComponent(c.label)}`}
                            />
                        ))}
                    </div>
                </section>

                {/* Nearby salons */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Nearby Salons
                        </h2>
                        <Link
                            href="/customer/salons"
                            className="text-xs font-medium text-primary flex items-center gap-0.5"
                        >
                            See all
                            <FiChevronRight size={14} />
                        </Link>
                    </div>

                    {loadingSalons ? (
                        <LoadingSkeleton variant="salon-row" count={3} />
                    ) : nearbySalons.length === 0 ? (
                        <EmptyState
                            icon={FiScissors}
                            title="No salons found nearby"
                            description="Try searching a different city."
                        />
                    ) : (
                        <div className="space-y-3">
                            {nearbySalons.slice(0, 4).map((s) => (
                                <SalonCard key={s._id} salon={s} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Popular salons */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Popular Salons
                        </h2>
                        <Link
                            href="/customer/salons"
                            className="text-xs font-medium text-primary flex items-center gap-0.5"
                        >
                            See all
                            <FiChevronRight size={14} />
                        </Link>
                    </div>

                    {loadingSalons ? (
                        <LoadingSkeleton variant="salon-compact" count={4} />
                    ) : popularSalons.length === 0 ? (
                        <EmptyState
                            icon={FiStar}
                            title="No popular salons yet"
                        />
                    ) : (
                        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                            {popularSalons.slice(0, 6).map((s) => (
                                <SalonCard key={s._id} salon={s} variant="compact" />
                            ))}
                        </div>
                    )}
                </section>

                {/* Recently booked */}
                <section>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Recently Booked
                    </h2>

                    {loadingBookings ? (
                        <LoadingSkeleton variant="salon-row" count={2} />
                    ) : recent.length === 0 ? (
                        <EmptyState
                            icon={FiCalendar}
                            title="No bookings yet"
                            description="Book your first appointment to see it here."
                        />
                    ) : (
                        <div className="space-y-3">
                            {recent.map((a) => {
                                const salon =
                                    typeof a.salonId === "object"
                                        ? a.salonId
                                        : null;
                                return (
                                    <Link
                                        key={a._id}
                                        href="/customer/appointments"
                                        className="
                                        flex items-center justify-between gap-3 rounded-2xl p-4
                                        border border-gray-200 dark:border-gray-800
                                        bg-white dark:bg-gray-900
                                        hover:border-primary/40 transition-colors
                                        "
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {salon?.name || "Salon"}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                {new Date(a.appointmentDate).toLocaleDateString(
                                                    "en-IN",
                                                    { day: "numeric", month: "short" }
                                                )}{" "}
                                                · {a.appointmentTime}
                                            </p>
                                        </div>
                                        <span
                                            className={`
                                            shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium
                                            ${
                                                a.isCancelled
                                                    ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                                    : a.isCompleted
                                                    ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                            }
                                            `}
                                        >
                                            {a.appointmentStatus}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}