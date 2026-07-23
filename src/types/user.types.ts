export interface SendOtpPayload {
    email: string;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface CustomerSignupPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface SalonSignupPayload {
    ownerName: string;
    email: string;
    phone: string;
    password: string;
}

export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    gender?: string;
    dateOfBirth?: string;
}

export interface GetUsersPayload {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
    isActive?: string;
    isVerified?: string;
    sortBy?: string;
    sortOrder?: string;
}