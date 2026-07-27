export interface CreateSalonPayload {
    name: string;
    logo?: string;
    bannerImage?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    gstNumber?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
}

export interface UpdateSalonPayload {
    name?: string;
    logo?: string;
    bannerImage?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    gstNumber?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
}

export interface UpdateSalonStatusPayload {
    isActive?: boolean;
    isVerified?: boolean;
    isDeleted?: boolean;
}

export interface GetSalonsParams {
    page?: string;
    limit?: string;
    search?: string;
    city?: string;
    isActive?: string;
    isVerified?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface Salon {
    _id: string;
    salonId: string;
    ownerId: string;
    name: string;
    logo?: string;
    bannerImage?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    gstNumber?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    isSubscriptionActive: boolean;
    isActive: boolean;
    isVerified: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}