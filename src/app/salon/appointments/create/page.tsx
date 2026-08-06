"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";

import { appointmentService } from "@/src/services/appointment/appointment.service";
import { branchService } from "@/src/services/branch/branch.service";
import { customerService } from "@/src/services/customer/customer.service";
import { staffService } from "@/src/services/staff/staff.service";
import { serviceService } from "@/src/services/service/service.service";

import { Branch } from "@/src/types/branch.types";
import { Customer } from "@/src/types/customer.types";
import { Staff } from "@/src/types/staff.types";
import { Service } from "@/src/types/service.types";
import { CreateAppointmentPayload } from "@/src/types/appointment.types";

import ServiceSelector from "./components/ServiceSelector";

const TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
];

export default function CreateAppointmentPage() {
    const router = useRouter();

    const [branches, setBranches] = useState<Branch[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [branchId, setBranchId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [staffId, setStaffId] = useState("");
    const [serviceIds, setServiceIds] = useState<string[]>([]);
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        (async () => {
            try {
                const [branchRes, customerRes, staffRes, serviceRes] =
                    await Promise.all([
                        branchService.getAll(),
                        customerService.getAll({ limit: "200" }),
                        staffService.getAll({ limit: "200" }),
                        serviceService.getAll({ limit: "200" }),
                    ]);
                setBranches(branchRes.data.data ?? []);
                setCustomers(customerRes.data.data ?? []);
                setStaff(staffRes.data.data ?? []);
                setAllServices(serviceRes.data.data ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load booking data."
                );
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Filter dependent lists by selected branch
    const branchStaff = useMemo(
        () =>
            staff.filter((s) =>
                typeof s.branchId === "string"
                    ? s.branchId === branchId
                    : (s.branchId as any)?._id === branchId
            ),
        [staff, branchId]
    );

    const branchServices = useMemo(
        () =>
            allServices.filter((s) =>
                typeof s.branchId === "string"
                    ? s.branchId === branchId
                    : (s.branchId as any)?._id === branchId
            ),
        [allServices, branchId]
    );

    const selectedServices = allServices.filter((s) =>
        serviceIds.includes(s._id)
    );
    const totalAmount = selectedServices.reduce(
        (sum, s) => sum + (s.discount > 0 ? s.discountPrice : s.price),
        0
    );
    const totalDuration = selectedServices.reduce(
        (sum, s) => sum + s.duration,
        0
    );

    const handleBranchChange = (id: string) => {
        setBranchId(id);
        setStaffId("");
        setServiceIds([]);
    };

    const toggleService = (id: string) => {
        setServiceIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
        if (errors.serviceIds) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.serviceIds;
                return next;
            });
        }
    };

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!branchId) nextErrors.branchId = "Select a branch.";
        if (!customerId) nextErrors.customerId = "Select a customer.";
        if (!staffId) nextErrors.staffId = "Select a staff member.";
        if (serviceIds.length === 0)
            nextErrors.serviceIds = "Select at least one service.";
        if (!appointmentDate) nextErrors.appointmentDate = "Select a date.";
        if (!appointmentTime) nextErrors.appointmentTime = "Select a time slot.";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please complete all required fields.");
            return;
        }

        const payload: CreateAppointmentPayload = {
            branchId,
            customerId,
            staffId,
            serviceIds,
            appointmentDate,
            appointmentTime,
        };

        if (notes.trim()) payload.notes = notes.trim();

        setSubmitting(true);
        try {
            const res = await appointmentService.create(payload);
            toast.success(res.data.message || "Appointment booked successfully.");
            router.push("/salon/appointments");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not create appointment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().slice(0, 10);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 animate-pulse space-y-4">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/salon/appointments"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                <FiArrowLeft size={16} />
                Back to appointments
            </Link>

            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-8 space-y-6">
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        Book an appointment
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Choose a branch, staff, services, and time slot.
                    </p>
                </div>

                {/* Branch */}
                <div className="space-y-1.5">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={branchId}
                        onChange={(e) => handleBranchChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Select a branch</option>
                        {branches.map((b) => (
                            <option key={b._id} value={b._id}>
                                {b.name} {b.city ? `— ${b.city}` : ""}
                            </option>
                        ))}
                    </select>
                    {errors.branchId && (
                        <p className="text-xs text-red-500">{errors.branchId}</p>
                    )}
                </div>

                {/* Customer + Staff */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select customer</option>
                            {customers.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name} {c.phone ? `— ${c.phone}` : ""}
                                </option>
                            ))}
                        </select>
                        {errors.customerId && (
                            <p className="text-xs text-red-500">{errors.customerId}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Staff <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                            disabled={!branchId}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                        >
                            <option value="">
                                {branchId ? "Select staff" : "Select a branch first"}
                            </option>
                            {branchStaff.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.name} {s.designation ? `— ${s.designation}` : ""}
                                </option>
                            ))}
                        </select>
                        {errors.staffId && (
                            <p className="text-xs text-red-500">{errors.staffId}</p>
                        )}
                    </div>
                </div>

                {/* Services */}
                <div className="space-y-1.5">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Services <span className="text-red-500">*</span>
                    </label>
                    {!branchId ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 py-3">
                            Select a branch to see available services.
                        </p>
                    ) : (
                        <ServiceSelector
                            services={branchServices}
                            selectedIds={serviceIds}
                            onToggle={toggleService}
                        />
                    )}
                    {errors.serviceIds && (
                        <p className="text-xs text-red-500">{errors.serviceIds}</p>
                    )}
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <FiCalendar size={14} />
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        {errors.appointmentDate && (
                            <p className="text-xs text-red-500">
                                {errors.appointmentDate}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <FiClock size={14} />
                            Time slot <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select time</option>
                            {TIME_SLOTS.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        {errors.appointmentTime && (
                            <p className="text-xs text-red-500">
                                {errors.appointmentTime}
                            </p>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Notes (optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Any special instructions..."
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    />
                </div>

                {/* Summary */}
                {selectedServices.length > 0 && (
                    <div className="rounded-xl bg-primary/5 px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {selectedServices.length} service
                                {selectedServices.length > 1 ? "s" : ""} · {totalDuration} mins
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                ₹{totalAmount}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => router.push("/salon/appointments")}
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? "Booking..." : "Book appointment"}
                    </button>
                </div>
            </div>
        </div>
    );
}