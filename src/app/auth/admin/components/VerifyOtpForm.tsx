'use client';

import { adminAuthService } from '@/src/services/auth/signup/signup';
import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';

export default function VerifyOtpForm({
  email,
  onVerified,
  onBack,
}: {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const otp = digits.join('');

  function updateDigit(index: number, value: string) {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    e.preventDefault();
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify() {
    setError(null);

    if (otp.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }

    setLoading(true);
    try {
      await adminAuthService.verifyOtp({ email, otp });
      onVerified();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Verification failed.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    try {
      await adminAuthService.sendOtp({ email });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Could not resend the code.'
      );
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
          Enter the code
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          We sent a 6-digit code to{' '}
          <span className="text-gray-700 dark:text-gray-300 break-all">{email}</span>.
          It expires in 5 minutes.
        </p>
      </div>

      <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            value={d}
            onChange={(e) => updateDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="h-11 w-9 sm:h-12 sm:w-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-center text-base sm:text-lg font-medium text-gray-900 dark:text-white outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-950/50 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Verifying…' : 'Verify code'}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button
          onClick={onBack}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          ← Change email
        </button>
        <button
          onClick={handleResend}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}