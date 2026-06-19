'use client';

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
    <section className="mx-auto flex min-h-[calc(100vh-145px)] max-w-md items-center px-4 py-16">
      <form className="card grid w-full gap-4" onSubmit={handleSubmit}>
        <div>
          <p className="font-semibold text-saffron">app.satguruai.com</p>
          <h1 className="mt-2 text-3xl font-black text-navy">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your official company email ID and password to access the internal portal.
          </p>
        </div>

        <input className="input" name="email" type="email" placeholder="Official company email" required />
        <input className="input" name="password" type="password" placeholder="Password" required />

        {message ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{message}</p> : null}

        <button className="btn-primary" type="submit">
          Login
        </button>
      </form>
    </section>
  );
}
