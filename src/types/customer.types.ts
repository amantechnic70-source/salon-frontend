export interface CreateCustomerPayload {
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    profileImage?: string;
}

export interface UpdateCustomerPayload {
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    profileImage?: string;
}

export interface UpdateCustomerStatusPayload {
    isActive?: boolean;
    isDeleted?: boolean;
}

export interface GetCustomersParams {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface Customer {
    _id: string;
    customerId: string;
    salonId: string;
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    profileImage?: string;
    loyaltyPoints: number;
    totalVisits: number;
    totalSpent: number;
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