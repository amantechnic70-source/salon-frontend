export interface CreateServicePayload {
    branchId: string;
    name: string;
    category?: string;
    description?: string;
    serviceImage?: string;
    genderType?: string;
    price: number;
    discount?: number;
    duration: number;
}

export interface UpdateServicePayload {
    branchId?: string;
    name?: string;
    category?: string;
    description?: string;
    serviceImage?: string;
    genderType?: string;
    price?: number;
    discount?: number;
    duration?: number;
}

export interface GetServicesParams {
    page?: string;
    limit?: string;
    search?: string;
    branchId?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PopulatedBranch {
    _id: string;
    branchId: string;
    name: string;
}

export interface Service {
    _id: string;
    serviceId: string;
    salonId: string;
    branchId: string | PopulatedBranch;
    name: string;
    category?: string;
    description?: string;
    serviceImage?: string;
    genderType?: string;
    price: number;
    discount: number;
    discountPrice: number;
    duration: number;
    isPopular: boolean;
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