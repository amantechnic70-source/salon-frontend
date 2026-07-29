export interface CreateBranchPayload {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    openingTime?: string;
    closingTime?: string;
}

export interface UpdateBranchPayload {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    openingTime?: string;
    closingTime?: string;
}

export interface UpdateBranchStatusPayload {
    isActive?: boolean;
    isDeleted?: boolean;
}

export interface GetBranchesParams {
    page?: string;
    limit?: string;
    search?: string;
    city?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface Branch {
    _id: string;
    branchId: string;
    salonId: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    openingTime?: string;
    closingTime?: string;
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