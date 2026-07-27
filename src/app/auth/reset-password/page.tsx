import { Suspense } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center font-sans bg-gray-100 dark:bg-black px-4 py-8">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                <Suspense fallback={<div className="h-40" />}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}