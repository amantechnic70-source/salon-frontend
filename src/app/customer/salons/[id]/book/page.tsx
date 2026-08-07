"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCheck, FiCreditCard, FiHome } from "react-icons/fi";

import { appointmentPaymentService } from "@/src/services/appointmentPaymentService";
import {
    Branch,
    ServiceItem,
    StaffMember,
} from "@/src/types/customerBooking.types";

import BookingStepper from "@/src/components/common/BookingStepper";
import BranchCard from "@/src/components/common/BranchCard";
import ServiceCard from "@/src/components/common/ServiceCard";
import StaffCard from "@/src/components/common/StaffCard";
import TimeSlotPicker from "@/src/components/common/TimeSlotPicker";
import LoadingSkeleton from "@/src/components/common/LoadingSkeleton";
import EmptyState from "@/src/components/common/EmptyState";
import { customerBookingService } from "@/src/services/service/customerBookingService";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const STEPS = ["Branch", "Services", "Staff", "Date", "Time", "Payment"];

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === "undefined") return resolve(false);
        if (window.Razorpay) return resolve(true);

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

function BookingFlowContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const salonId = params.id as string;
    const preselectedBranchId = searchParams.get("branchId") || "";

    const [step, setStep] = useState(preselectedBranchId ? 2 : 1);
    const [loadingInitial, setLoadingInitial] = useState(true);

    const [branches, setBranches] = useState<Branch[]>([]);
    const [branchId, setBranchId] = useState(preselectedBranchId);

    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [serviceIds, setServiceIds] = useState<string[]>([]);

    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [staffId, setStaffId] = useState("");

    const [appointmentDate, setAppointmentDate] = useState("");

    const [slots, setSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [appointmentTime, setAppointmentTime] = useState("");

    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "OFFLINE">("ONLINE");
    const [submitting, setSubmitting] = useState(false);

    // Load salon branches on mount
    useEffect(() => {
        (async () => {
            try {
                setLoadingInitial(true);
                const res = await customerBookingService.getSalonDetails(salonId);
                setBranches(res.data.data.branches ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load salon."
                );
                router.push(`/customer/salons/${salonId}`);
            } finally {
                setLoadingInitial(false);
            }
        })();
    }, [salonId, router]);

    // Load services when branch changes
    useEffect(() => {
        if (!branchId) return;
        (async () => {
            try {
                setLoadingServices(true);
                const res = await customerBookingService.getSalonServices({
                    salonId,
                    branchId,
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
    }, [salonId, branchId]);

    // Load staff when moving to step 3
    useEffect(() => {
        if (step !== 3 || !branchId) return;
        (async () => {
            try {
                setLoadingStaff(true);
                const res = await customerBookingService.getBranchStaff(branchId);
                setStaff(res.data.data ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load staff."
                );
            } finally {
                setLoadingStaff(false);
            }
        })();
    }, [step, branchId]);

    // Load slots when date is chosen
    useEffect(() => {
        if (step !== 5 || !appointmentDate || !staffId || !branchId) return;
        (async () => {
            try {
                setLoadingSlots(true);
                setAppointmentTime("");
                const res = await customerBookingService.getAvailableSlots({
                    branchId,
                    staffId,
                    appointmentDate,
                });
                setSlots(res.data.data ?? []);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Could not load time slots."
                );
            } finally {
                setLoadingSlots(false);
            }
        })();
    }, [step, appointmentDate, staffId, branchId]);

    const selectedServices = useMemo(
        () => services.filter((s) => serviceIds.includes(s._id)),
        [services, serviceIds]
    );

    const totalAmount = selectedServices.reduce(
        (sum, s) => sum + (s.discount > 0 ? s.discountPrice : s.price),
        0
    );
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

    const toggleService = (id: string) => {
        setServiceIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const goNext = () => {
        if (step === 1 && !branchId) {
            toast.error("Please select a branch.");
            return;
        }
        if (step === 2 && serviceIds.length === 0) {
            toast.error("Please select at least one service.");
            return;
        }
        if (step === 3 && !staffId) {
            toast.error("Please select a staff member.");
            return;
        }
        if (step === 4 && !appointmentDate) {
            toast.error("Please select a date.");
            return;
        }
        if (step === 5 && !appointmentTime) {
            toast.error("Please select a time slot.");
            return;
        }
        setStep((s) => Math.min(s + 1, STEPS.length));
    };

    const goBack = () => {
        if (step === 1) {
            router.back();
            return;
        }
        setStep((s) => Math.max(s - 1, 1));
    };

    // ==========================================
    // CASE 1: OFFLINE PAYMENT
    // ==========================================
    const handleOfflineBooking = async () => {
        setSubmitting(true);
        try {
            const res = await customerBookingService.createBooking({
                salonId,
                branchId,
                staffId,
                serviceIds,
                appointmentDate,
                appointmentTime,
                notes: notes.trim() || undefined,
                paymentMethod: "OFFLINE",
            });
            toast.success(res.data.message || "Appointment booked successfully.");
            router.push("/customer/appointments");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not book appointment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // CASE 2: ONLINE PAYMENT
    // ==========================================
    const handleOnlineBooking = async () => {
        setSubmitting(true);
        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Could not load payment gateway. Check your connection.");
                setSubmitting(false);
                return;
            }

            const orderRes = await appointmentPaymentService.createOrder({
                salonId,
                branchId,
                staffId,
                serviceIds,
                appointmentDate,
                appointmentTime,
                notes: notes.trim() || undefined,
            });

            const { orderId, amount, currency, key } = orderRes.data.data;

            const razorpay = new window.Razorpay({
                key,
                amount,
                currency,
                order_id: orderId,
                name: "Salon Marketplace",
                description: "Appointment booking",
                theme: { color: "#1C1B19" },
                handler: async (response: any) => {
                    try {
                        const verifyRes = await appointmentPaymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast.success(
                            verifyRes.data.message || "Appointment booked successfully."
                        );
                        router.push("/customer/appointments");
                    } catch (err: any) {
                        toast.error(
                            err?.response?.data?.message ||
                                "Payment verification failed. Contact support if amount was deducted."
                        );
                    } finally {
                        setSubmitting(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setSubmitting(false);
                        toast("Payment cancelled.", { icon: "ℹ️" });
                    },
                },
            });

            razorpay.on("payment.failed", (response: any) => {
                setSubmitting(false);
                toast.error(
                    response?.error?.description || "Payment failed. Try again."
                );
            });

            razorpay.open();
        } catch (err: any) {
            setSubmitting(false);
            toast.error(
                err?.response?.data?.message || "Could not start payment."
            );
        }
    };

    const handleConfirmBooking = () => {
        if (paymentMethod === "OFFLINE") {
            handleOfflineBooking();
        } else {
            handleOnlineBooking();
        }
    };

    const today = new Date().toISOString().slice(0, 10);
    const selectedBranch = branches.find((b) => b._id === branchId);
    const selectedStaff = staff.find((s) => s._id === staffId);

    if (loadingInitial) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
                    <LoadingSkeleton variant="salon-row" count={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={goBack}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Go back"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        Book appointment
                    </h1>
                </div>

                {/* Stepper */}
                <BookingStepper steps={STEPS} currentStep={step} />

                {/* Step content */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-6 min-h-70">
                    {/* Step 1: Branch */}
                    {step === 1 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Choose a branch
                            </h2>
                            {branches.length === 0 ? (
                                <EmptyState icon={FiHome} title="No branches available" />
                            ) : (
                                branches.map((b) => (
                                    <BranchCard
                                        key={b._id}
                                        branch={b}
                                        selected={branchId === b._id}
                                        onSelect={() => {
                                            setBranchId(b._id);
                                            setServiceIds([]);
                                            setStaffId("");
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {/* Step 2: Services */}
                    {step === 2 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Choose services
                            </h2>
                            {loadingServices ? (
                                <LoadingSkeleton variant="salon-row" count={3} />
                            ) : services.length === 0 ? (
                                <EmptyState title="No services at this branch" icon={FiHome} />
                            ) : (
                                <div className="space-y-2">
                                    {services.map((s) => (
                                        <button
                                            key={s._id}
                                            onClick={() => toggleService(s._id)}
                                            className={`
                                            w-full rounded-2xl border transition-all
                                            ${
                                                serviceIds.includes(s._id)
                                                    ? "border-primary"
                                                    : "border-transparent"
                                            }
                                            `}
                                        >
                                            <ServiceCard service={s} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Staff */}
                    {step === 3 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Choose a staff member
                            </h2>
                            {loadingStaff ? (
                                <LoadingSkeleton variant="salon-row" count={2} />
                            ) : staff.length === 0 ? (
                                <EmptyState title="No staff available" icon={FiHome} />
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {staff.map((s) => (
                                        <StaffCard
                                            key={s._id}
                                            staff={s}
                                            selected={staffId === s._id}
                                            onSelect={() => setStaffId(s._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Date */}
                    {step === 4 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Choose a date
                            </h2>
                            <input
                                type="date"
                                min={today}
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    )}

                    {/* Step 5: Time */}
                    {step === 5 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Choose a time slot
                            </h2>
                            {loadingSlots ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <TimeSlotPicker
                                    slots={slots}
                                    selected={appointmentTime}
                                    onSelect={setAppointmentTime}
                                />
                            )}
                        </div>
                    )}

                    {/* Step 6: Payment */}
                    {step === 6 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    Payment method
                                </h2>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button
                                        onClick={() => setPaymentMethod("ONLINE")}
                                        className={`
                                        flex flex-col items-center gap-2 rounded-2xl border p-4
                                        ${
                                            paymentMethod === "ONLINE"
                                                ? "border-primary bg-primary/5"
                                                : "border-gray-200 dark:border-gray-800"
                                        }
                                        `}
                                    >
                                        <FiCreditCard
                                            size={20}
                                            className={
                                                paymentMethod === "ONLINE"
                                                    ? "text-primary"
                                                    : "text-gray-400"
                                            }
                                        />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            Pay Online
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod("OFFLINE")}
                                        className={`
                                        flex flex-col items-center gap-2 rounded-2xl border p-4
                                        ${
                                            paymentMethod === "OFFLINE"
                                                ? "border-primary bg-primary/5"
                                                : "border-gray-200 dark:border-gray-800"
                                        }
                                        `}
                                    >
                                        <FiHome
                                            size={20}
                                            className={
                                                paymentMethod === "OFFLINE"
                                                    ? "text-primary"
                                                    : "text-gray-400"
                                            }
                                        />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            Pay at Salon
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    Notes (optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Any special requests..."
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* Summary */}
                            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-4 space-y-2">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Booking summary
                                </p>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Branch</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {selectedBranch?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Staff</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {selectedStaff?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Date & time</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {new Date(appointmentDate).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                        })}{" "}
                                        · {appointmentTime}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {selectedServices.length} service
                                        {selectedServices.length > 1 ? "s" : ""} · {totalDuration} mins
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        ₹{totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky footer */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    {selectedServices.length > 0 && step < 6 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
                            ₹{totalAmount}
                        </div>
                    )}

                    {step < STEPS.length ? (
                        <button
                            onClick={goNext}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleConfirmBooking}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <FiCheck size={18} />
                            {submitting
                                ? "Processing..."
                                : paymentMethod === "ONLINE"
                                ? `Pay ₹${totalAmount}`
                                : "Confirm booking"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BookAppointmentPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6">
                        <LoadingSkeleton variant="salon-row" count={3} />
                    </div>
                </div>
            }
        >
            <BookingFlowContent />
        </Suspense>
    );
}