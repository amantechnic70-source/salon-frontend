import {
    FiHome,
    FiUsers,
    FiCalendar,
    FiSettings,
    FiBarChart2,
    FiDollarSign,
    FiScissors,
    FiGrid,
    FiClipboard,
    FiPercent,
    FiUser,
    FiStar,
    FiGift,
    FiCreditCard,
    FiPieChart,
    FiMapPin,
    FiTag,
    FiFileText,
    FiShield,
    FiBell,
    FiClock,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { UserRole } from "@/src/types/auth.types";

export interface NavItem {
    label: string;
    href: string;
    icon: IconType;
}

export const NAVIGATION: Record<UserRole, NavItem[]> = {
    SUPER_ADMIN: [
        { label: "Dashboard", href: "/admin/dashboard", icon: FiHome },
        { label: "Subscriptions", href: "/admin/subscriptions", icon: FiCreditCard },
        { label: "Analytics", href: "/admin/analytics", icon: FiBarChart2 },
        { label: "Reports", href: "/admin/reports", icon: FiPieChart },
        { label: "Salons", href: "/admin/salons", icon: FiGrid },
        { label: "Platform Settings", href: "/admin/settings", icon: FiSettings },
    ],

    SALON_OWNER: [
        { label: "Dashboard", href: "/salon/dashboard", icon: FiHome },
        { label: "Branches", href: "/salon/branches", icon: FiMapPin },
        { label: "Staff", href: "/salon/staff", icon: FiUsers },
        { label: "Services", href: "/salon/services", icon: FiScissors },
        { label: "Appointments", href: "/salon/appointments", icon: FiCalendar },
        { label: "Customers", href: "/salon/customers", icon: FiUser },
        { label: "Coupons", href: "/salon/coupons", icon: FiTag },
        { label: "Invoices", href: "/salon/invoices", icon: FiFileText },
        { label: "Reviews", href: "/salon/reviews", icon: FiStar },
        { label: "Subscription", href: "/salon/subscriptions", icon: FiCreditCard },
        { label: "Reports", href: "/salon/reports", icon: FiPieChart },
        { label: "Salon Settings", href: "/salon/settings", icon: FiSettings },
    ],

    STAFF: [
        { label: "Dashboard", href: "/staff/dashboard", icon: FiHome },
        { label: "Appointments", href: "/staff/appointments", icon: FiCalendar },
        { label: "Attendance", href: "/staff/attendance", icon: FiClipboard },
        { label: "Commission", href: "/staff/commission", icon: FiPercent },
    ],

    CUSTOMER: [
        { label: "Home", href: "/customer/home", icon: FiHome },
        { label: "My Bookings", href: "/customer/bookings", icon: FiCalendar },
        // { label: "Reward Points", href: "/customer/rewards", icon: FiGift },
        { label: "Reviews", href: "/customer/reviews", icon: FiStar },
        { label: "Profile", href: "/customer/profile", icon: FiUser },
    ],
};