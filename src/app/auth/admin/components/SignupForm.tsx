'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthService } from '@/src/services/auth/signup/signup';

export default function SignupForm({ email }: { email: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminAuthService.signup({
        name: form.name,
        email,
        phone: form.phone,
        password: form.password,
      });

      if (res?.data?.accessToken) {
        document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
          Set up your account
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 break-all">
          {email} is verified. Add your details to finish.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm text-gray-700 dark:text-gray-300">
          Full name
        </label>
        <input
          id="name"
          required
          autoFocus
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Jane Doe"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm text-gray-700 dark:text-gray-300">
          Phone number
        </label>
        <input
          id="phone"
          required
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="+91 98765 43210"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="8+ characters"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm text-gray-700 dark:text-gray-300">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            placeholder="Re-enter"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
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
        {loading ? 'Creating account…' : 'Create super admin'}
      </button>
    </form>
  );
}