export interface CreateReviewPayload {
    appointmentId: string;
    rating: number;
    review?: string;
}

export interface UpdateReviewPayload {
    rating?: number;
    review?: string;
}

export interface GetReviewsParams {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PopulatedRef {
    _id: string;
    name: string;
}

export interface Review {
    _id: string;
    reviewId: string;
    customerId: string | PopulatedRef;
    appointmentId: string | { _id: string; appointmentId: string };
    salonId: string | PopulatedRef;
    staffId?: string | PopulatedRef;
    serviceId?: string | PopulatedRef;
    rating: number;
    review?: string;
    isApproved: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    pagination?: Pagination;
}