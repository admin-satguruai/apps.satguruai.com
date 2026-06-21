'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function Forgot() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim().toLowerCase();

    const response = await fetch('/api/auth/request-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json().catch(() => ({ message: 'If this email is registered, a reset link has been sent.' }));
    setMessage(data.message || 'If this email is registered, a reset link has been sent.');
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 px-4 py-12">
      <section className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-900/10">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-black text-slate-950">Account recovery</h1>
          <p className="text-sm leading-6 text-slate-600">Enter your approved official email. If the account exists, a secure reset link will be sent to your inbox.</p>
          <input className="input" name="email" type="email" placeholder="Official email" required />
          {message ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
          <button className="btn-primary disabled:cursor-wait disabled:opacity-70" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Sending secure link...' : 'Send recovery link'}
          </button>
          <Link className="text-center text-sm font-bold text-emerald-700" href="/login">Back to login</Link>
        </form>
      </section>
    </main>
  );
}
