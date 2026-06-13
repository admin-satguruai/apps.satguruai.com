'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();
    const otp = String(form.get('otp') ?? '').trim();
    const verificationToken = sessionStorage.getItem('satguru_verification_token') ?? '';

    if (!email.endsWith('@satgurutravel.com')) {
      setMessage('Verification is allowed only with an official @satgurutravel.com email ID.');
      setIsSubmitting(false);
      return;
    }

    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, verificationToken })
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? 'OTP verification failed.');
      return;
    }

    sessionStorage.removeItem('satguru_verification_token');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <form className="card grid gap-4" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-black text-navy">Verify email OTP</h1>
        <p className="text-sm text-slate-600">
          Enter the OTP sent to your official @satgurutravel.com email ID.
        </p>
        <input className="input" name="email" type="email" defaultValue={emailFromQuery} placeholder="Official email" required />
        <input className="input" name="otp" inputMode="numeric" maxLength={6} placeholder="6-digit OTP" required />
        {message ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{message}</p> : null}
        <button className="btn-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Verifying...' : 'Verify and enter portal'}
        </button>
      </form>
    </section>
  );
}
