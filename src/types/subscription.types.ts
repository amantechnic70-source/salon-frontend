export interface SubscriptionPlan {
    _id: string;
    planId: string;
    name: string;
    amount: number;
    durationInDays: number;
    maxStaff: number;
    maxBranches: number;
    maxBookings: number;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePlanPayload {
    name: string;
    amount: number;
    durationInDays: number;
    maxStaff: number;
    maxBranches: number;
    maxBookings: number;
    description: string;
}

export interface UpdatePlanPayload {
    name?: string;
    amount?: number;
    durationInDays?: number;
    maxStaff?: number;
    maxBranches?: number;
    maxBookings?: number;
    description?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}