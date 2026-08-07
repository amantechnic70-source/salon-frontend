export interface Salon {
    _id: string;
    salonId: string;
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
    description?: string;
    latitude?: number;
    longitude?: number;
    totalBranches: number;
    totalServices: number;
}

export interface GetSalonsParams {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    state?: string;
}

export interface PopulatedSalonRef {
    _id: string;
    salonId: string;
    name: string;
    logo?: string;
    phone?: string;
    address?: string;
    city?: string;
}

export interface PopulatedBranchRef {
    _id: string;
    branchId: string;
    name: string;
    address?: string;
}

export interface PopulatedStaffRef {
    _id: string;
    staffId: string;
    name: string;
    profileImage?: string;
    designation?: string;
}

export interface PopulatedServiceRef {
    _id: string;
    serviceId: string;
    name: string;
    price: number;
    duration: number;
}

export interface Appointment {
    _id: string;
    appointmentId: string;
    salonId: PopulatedSalonRef | string;
    branchId: PopulatedBranchRef | string;
    staffId: PopulatedStaffRef | string;
    serviceIds: PopulatedServiceRef[] | string[];
    appointmentDate: string;
    appointmentTime: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    paymentStatus: string;
    appointmentStatus: string;
    notes?: string;
    isCompleted: boolean;
    isCancelled: boolean;
    createdAt: string;
}

export interface GetMyBookingsParams {
    page?: number;
    limit?: number;
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

export interface Branch {
    _id: string;
    branchId: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    openingTime?: string;
    closingTime?: string;
    latitude?: number;
    longitude?: number;
}

export interface SalonDetails {
    salon: Salon & {
        gstNumber?: string;
        isVerified?: boolean;
    };
    branches: Branch[];
    totalBranches: number;
    totalServices: number;
    totalStaff: number;
}

export interface ServiceItem {
    _id: string;
    serviceId: string;
    branchId: Branch | string;
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
}

export interface GetSalonServicesParams {
    salonId: string;
    branchId?: string;
    category?: string;
}


export interface StaffMember {
    _id: string;
    staffId: string;
    name: string;
    profileImage?: string;
    designation?: string;
    experience?: number;
}

export interface CreateBookingPayload {
    salonId: string;
    branchId: string;
    staffId: string;
    serviceIds: string[];
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
    paymentMethod: "OFFLINE";
}

export interface CreateAppointmentOrderPayload {
    salonId: string;
    branchId: string;
    staffId: string;
    serviceIds: string[];
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
}

export interface CreateAppointmentOrderResponse {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    key: string;
}

export interface VerifyAppointmentPaymentPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface CancelBookingPayload {
    appointmentId: string;
    reason?: string;
}

export interface RescheduleBookingPayload {
    appointmentId: string;
    appointmentDate: string;
    appointmentTime: string;
}