'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Verify() {
  const router = useRouter();
  const [emailFromQuery, setEmailFromQuery] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmailFromQuery(params.get('email') ?? '');
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();
    const otp = String(form.get('otp') ?? '').trim();
    const verificationToken = sessionStorage.getItem('satguru_verification_token') ?? '';

    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, verificationToken })
    });

    const data = await response.json().catch(() => ({ message: 'Verification failed.' }));
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? 'Verification failed.');
      return;
    }

    sessionStorage.removeItem('satguru_verification_token');
    router.push(data.redirectTo || '/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 px-4 py-12">
      <section className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-900/10">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-black text-slate-950">Verify email code</h1>
          <p className="text-sm leading-6 text-slate-600">Enter the six-digit verification code sent to your approved official email ID.</p>
          <input className="input" name="email" type="email" value={emailFromQuery} onChange={(event) => setEmailFromQuery(event.target.value)} placeholder="Official email" required />
          <input className="input" name="otp" inputMode="numeric" maxLength={6} placeholder="6-digit code" required />
          {message ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{message}</p> : null}
          <button className="btn-primary disabled:cursor-wait disabled:opacity-70" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Verifying...' : 'Verify and continue'}
          </button>
        </form>
      </section>
    </div>
  );
}
