import { ReactNode } from 'react';
import type { AdminStep } from '../page';

const STEPS: { key: AdminStep; label: string }[] = [
  { key: 'email', label: 'Email' },
  { key: 'otp', label: 'Verify' },
  { key: 'details', label: 'Details' },
];

export default function AuthCard({
  step,
  children,
}: {
  step: AdminStep;
  children: ReactNode;
}) {
  const activeIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-gray-900 dark:bg-amber-500 text-amber-500 dark:text-gray-900 text-lg font-semibold tracking-tight">
            S
          </div>
          <h1 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Salon Marketplace
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Super Admin Setup
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 sm:p-8 shadow-lg shadow-gray-200/50 dark:shadow-black/30 ring-1 ring-gray-200 dark:ring-gray-700">
          {/* Step rail */}
          <div className="mb-6 sm:mb-8 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={[
                      'h-1.5 w-full rounded-full transition-colors duration-300',
                      i <= activeIndex
                        ? 'bg-amber-500'
                        : 'bg-gray-200 dark:bg-gray-700',
                    ].join(' ')}
                  />
                  <span
                    className={[
                      'text-[10px] sm:text-[11px] tracking-wide uppercase',
                      i === activeIndex
                        ? 'text-amber-600 dark:text-amber-400 font-medium'
                        : i < activeIndex
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-300 dark:text-gray-600',
                    ].join(' ')}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {children}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500 px-4">
          This flow only runs once — a super admin already existing will
          disable it.
        </p>
      </div>
    </div>
  );
}