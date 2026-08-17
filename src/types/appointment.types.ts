import { Customer } from "./customer.types";
import { Staff } from "./staff.types";
import { PopulatedBranch, Service } from "./service.types";

export interface CreateAppointmentPayload {
    branchId: string;
    customerId: string;
    staffId: string;
    serviceIds: string[];
    appointmentDate: string;
    appointmentTime: string;
    membershipId?: string;
    couponId?: string;
    notes?: string;
}

export interface UpdateAppointmentPayload {
    branchId?: string;
    customerId?: string;
    staffId?: string;
    serviceIds?: string[];
    appointmentDate?: string;
    appointmentTime?: string;
    membershipId?: string;
    couponId?: string;
    notes?: string;
}

export interface RescheduleAppointmentPayload {
    appointmentDate: string;
    appointmentTime: string;
}

export interface UpdateAppointmentStatusPayload {
    appointmentStatus?: string;
    isCompleted?: boolean;
    isCancelled?: boolean;
}

export interface CancelAppointmentPayload {
    reason: string;
}

export interface GetAppointmentsParams {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface Appointment {
    customerPhone: any;
    paymentMethod: any;
    customerName: string;
    cancelReason: any;
    cancelledBy: any;
    bookingSource: any;
    _id: string;
    appointmentId: string;
    salonId: string;
    branchId: string | PopulatedBranch;
    customerId: string | Customer;
    staffId: string | Staff;
    serviceIds: string[] | Service[];
    membershipId?: string | null;
    couponId?: string | null;
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