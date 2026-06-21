'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const rules = ['Minimum 8 characters', 'Uppercase and lowercase letters', 'At least one number', 'At least one special character'];

export default function SetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
    setToken(sessionStorage.getItem('satguru_password_setup_token') || '');
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const first = String(form.get('first') || '');
    const second = String(form.get('second') || '');

    const response = await fetch('/api/auth/complete-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, first, second, setupToken: token })
    });

    const data = await response.json().catch(() => ({ message: 'Unable to complete registration.' }));
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message || 'Unable to complete registration.');
      return;
    }

    sessionStorage.removeItem('satguru_password_setup_token');
    router.push('/dashboard?welcome=1');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 px-4 py-12">
      <section className="mx-auto max-w-xl rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-900/10">
        <h1 className="text-3xl font-black text-slate-950">Set your password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Create a strong password to complete registration for your official account.</p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <input className="input" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Official email" required />
          <input className="input" name="first" type="password" placeholder="New password" required />
          <input className="input" name="second" type="password" placeholder="Confirm password" required />
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-black text-slate-800">Password standard</p>
            <ul className="mt-2 grid gap-1">
              {rules.map((rule) => <li key={rule}>• {rule}</li>)}
            </ul>
          </div>
          {message ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{message}</p> : null}
          <button className="btn-primary disabled:cursor-wait disabled:opacity-70" disabled={isSubmitting || !token} type="submit">
            {isSubmitting ? 'Completing registration...' : 'Complete registration'}
          </button>
        </form>
      </section>
    </main>
  );
}
