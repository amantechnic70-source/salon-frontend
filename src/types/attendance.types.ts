export interface CheckInPayload {
    remarks?: string;
}

export interface CheckOutPayload {
    remarks?: string;
}

export interface Attendance {
    _id: string;
    attendanceId: string;
    salonId: string;
    branchId: string;
    staffId: string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    workingHours: number;
    status: string;
    isLate: boolean;
    isHalfDay: boolean;
    remarks?: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}