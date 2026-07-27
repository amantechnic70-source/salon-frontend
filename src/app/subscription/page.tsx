"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiPackage } from "react-icons/fi";

import { paymentService } from "@/src/services/payment/payment.service";
import { loadRazorpayScript } from "@/src/lib/loadRazorpayScript";
import { SubscriptionPlan } from "@/src/types/subscription.types";
import { subscriptionService } from "@/src/services/subscrption/subscrption.service";
import SubscriptionPlanCard from "./components/SubscriptionPlanCard";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PlanCardSkeleton = () => (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 animate-pulse">
        <div className="h-5 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-8 w-32 mt-3 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full mt-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-2/3 mt-2 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-32 w-full mt-5 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-11 w-full mt-6 bg-gray-200 dark:bg-gray-800 rounded-xl" />
    </div>
);

export default function SubscriptionPage() {
    const router = useRouter();

    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await subscriptionService.getPlans();
            setPlans(res.data ?? []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Could not load plans."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = async (plan: SubscriptionPlan) => {
        setSelectedPlanId(plan._id);
        setProcessing(true);

        try {
            // 1. Load Razorpay checkout script
            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                toast.error("Could not load payment gateway. Check your connection.");
                setProcessing(false);
                return;
            }

            // 2. Create order on backend
            const orderRes = await paymentService.createOrder({
                planId: plan._id,
            });

            const { orderId, amount, currency, razorpayKeyId } = orderRes.data;

            // 3. Open Razorpay checkout
            const razorpay = new window.Razorpay({
                key: razorpayKeyId,
                amount,
                currency,
                order_id: orderId,
                name: "Salon Marketplace",
                description: `${plan.name} Subscription`,
                theme: {
                    color: "#1C1B19",
                },
                handler: async (response: any) => {
                    await handleVerifyPayment(response, plan._id);
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                        setSelectedPlanId(null);
                        toast("Payment cancelled.", { icon: "ℹ️" });
                    },
                },
            });

            razorpay.on("payment.failed", (response: any) => {
                setProcessing(false);
                setSelectedPlanId(null);
                toast.error(
                    response?.error?.description || "Payment failed. Try again."
                );
            });

            razorpay.open();
        } catch (err: any) {
            setProcessing(false);
            setSelectedPlanId(null);
            toast.error(
                err?.response?.data?.message || "Could not start payment."
            );
        }
    };

    const handleVerifyPayment = async (
        razorpayResponse: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
        },
        planId: string
    ) => {
        try {
            await paymentService.verifyPayment({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                planId,
            });

            toast.success("Payment successful! Setting up your salon...");
            router.push("/salon-onboarding/create");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ||
                    "Payment verification failed. Contact support if amount was deducted."
            );
        } finally {
            setProcessing(false);
            setSelectedPlanId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 py-10 sm:py-14">
            <div className="max-w-5xl mx-auto">
                <div className="text-center max-w-xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Choose your plan
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        Pick a subscription to unlock your salon dashboard. You can
                        upgrade anytime as you grow.
                    </p>
                </div>

                <div className="mt-10">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <PlanCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <FiPackage
                                size={32}
                                className="text-gray-300 dark:text-gray-600"
                            />
                            <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                No plans available right now
                            </p>
                            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                                Please check back shortly, or contact support.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
                            {plans.map((plan) => (
                                <SubscriptionPlanCard
                                    key={plan._id}
                                    plan={plan}
                                    onSelect={handleSelectPlan}
                                    processing={processing}
                                    selectedPlanId={selectedPlanId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}