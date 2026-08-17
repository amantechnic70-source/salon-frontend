export const USER_ROLES = [
    "SUPER_ADMIN",
    "SALON_OWNER",
    "STAFF",
    "CUSTOMER",
] as const;

export type UserRole =
    typeof USER_ROLES[number];

export interface CurrentUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    salonId?: string | null;
    avatar?: string;
}