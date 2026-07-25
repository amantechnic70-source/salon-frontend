'use client';

import { adminAuthService } from '@/src/services/auth/signup/signup';
import { useState, FormEvent } from 'react';

export default function SendOtpForm({
    onSent,
}: {
    onSent: (email: string) => void;
}) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await adminAuthService.sendOtp({ email });
            onSent(email);
        } catch (err: any) {
            setError(
                err?.response?.data?.message || 'Could not send the code.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
                <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                    Create super admin
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter the email that will own this platform. We'll send a 6-digit
                    code to verify it.
                </p>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm text-gray-700 dark:text-gray-300">
                    Email address
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yourcompany.com"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 dark:bg-red-950/50 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? 'Sending code…' : 'Send verification code'}
            </button>
        </form>
    );
}