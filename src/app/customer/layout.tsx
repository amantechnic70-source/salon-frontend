import DashboardLayout from "@/src/components/layout/DashboardLayout";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}