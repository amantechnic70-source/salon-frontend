export interface CreateOrderPayload {
    planId: string;
}

export interface CreateOrderResponse {
    success: boolean;
    message: string;
    data: {
        paymentId: string;
        amount: number;
        currency: string;
        orderId: string;
        razorpayKeyId: string;
    };
}

export interface VerifyPaymentPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    data: {
        subscription: Record<string, any>;
    };
}