'use client';

import { useState } from 'react';
import AuthCard from './components/AuthCard';
import SendOtpForm from './components/SendOtpForm';
import VerifyOtpForm from './components/VerifyOtpForm';
import SignupForm from './components/SignupForm';

export type AdminStep = 'email' | 'otp' | 'details';

export default function AdminAuthPage() {
  const [step, setStep] = useState<AdminStep>('email');
  const [email, setEmail] = useState('');

  return (
    <AuthCard step={step}>
      {step === 'email' && (
        <SendOtpForm
          onSent={(sentEmail) => {
            setEmail(sentEmail);
            setStep('otp');
          }}
        />
      )}

      {step === 'otp' && (
        <VerifyOtpForm
          email={email}
          onVerified={() => setStep('details')}
          onBack={() => setStep('email')}
        />
      )}

      {step === 'details' && <SignupForm email={email} />}
    </AuthCard>
  );
}