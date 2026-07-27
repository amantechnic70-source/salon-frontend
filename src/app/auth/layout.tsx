import AuthNavbar from "./components/AuthNavbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-black">
            <AuthNavbar />
            <div className="flex flex-1 flex-col">{children}</div>
        </div>
    );
}