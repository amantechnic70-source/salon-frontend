export interface CreateStaffPayload {
    branchId: string;
    name: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    designation?: string;
    salary?: number;
    commissionPercentage?: number;
    experience?: number;
    joiningDate?: string;
    gender?: string;
    description?: string;
}

export interface UpdateStaffPayload {
    branchId?: string;
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    designation?: string;
    salary?: number;
    commissionPercentage?: number;
    experience?: number;
    joiningDate?: string;
    gender?: string;
    description?: string;
}

export interface UpdateStaffStatusPayload {
    isActive?: boolean;
    isDeleted?: boolean;
}

export interface GetStaffParams {
    page?: string;
    limit?: string;
    search?: string;
    branchId?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface Staff {
    _id: string;
    staffId: string;
    salonId: string;
    branchId: string;
    name: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    designation?: string;
    salary?: number;
    commissionPercentage?: number;
    experience?: number;
    joiningDate?: string;
    gender?: string;
    description?: string;
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