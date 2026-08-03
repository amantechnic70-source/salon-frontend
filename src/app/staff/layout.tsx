import DashboardLayout from "@/src/components/layout/DashboardLayout";

export default function SalonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}