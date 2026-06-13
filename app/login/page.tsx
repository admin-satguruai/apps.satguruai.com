'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();

    if (!email.endsWith('@satgurutravel.com')) {
      setMessage('Login is allowed only with an official company email ID.');
      return;
    }

    router.push('/dashboard?entry=portal');
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <form className="card grid gap-4" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-black text-navy">Login</h1>
        <p className="text-sm text-slate-600">
          Use your official company email ID to enter the portal.
        </p>
        <input className="input" name="email" type="email" placeholder="Official company email" required />
        <input className="input" name="password" type="password" placeholder="Password / temporary access code" required />
        {message ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{message}</p> : null}
        <button className="btn-primary" type="submit">
          Login
        </button>
        <div className="flex justify-between text-sm">
          <Link href="/signup">Self signup</Link>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </section>
  );
}
