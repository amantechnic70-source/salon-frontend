import DashboardLayout from "@/src/components/layout/DashboardLayout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}