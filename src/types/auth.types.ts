export type UserRole =
    | "SUPER_ADMIN"
    | "SALON_OWNER"
    | "STAFF"
    | "CUSTOMER";

export interface CurrentUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    salonId?: string | null;
    avatar?: string;
}