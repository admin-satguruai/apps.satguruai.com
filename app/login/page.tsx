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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-orange-100 px-4 py-10 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(249,115,22,0.16),transparent_28%),radial-gradient(circle_at_35%_88%,rgba(16,185,129,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-[115%] -rotate-3 rounded-[50%] bg-emerald-100/45" />
      <div className="pointer-events-none absolute -bottom-28 right-[-10%] h-72 w-3/4 -rotate-6 rounded-[50%] bg-orange-200/45" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <form
          className="w-full rounded-[1.75rem] border border-slate-300/80 bg-white/95 px-7 py-8 shadow-2xl shadow-slate-300/60 backdrop-blur sm:px-8"
          onSubmit={handleSubmit}
        >
          <div className="mx-auto grid w-36 place-items-center bg-white px-4 py-3 shadow-lg shadow-slate-200/80">
            <div className="text-center leading-none">
              <p className="text-3xl font-bold tracking-tight text-emerald-700">
                sat<span className="text-orange-500">guru</span>
              </p>
              <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-600">Travel</p>
            </div>
          </div>

          <div className="mx-auto mt-5 h-px w-11/12 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          <div className="mt-5 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">Satguru CRM Login</h1>
            <p className="mt-2 text-xs text-slate-500">Welcome back! Sign in to access your CRM dashboard.</p>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-xs font-bold text-slate-900">
              Username / Email <span className="text-orange-500">*</span>
              <input
                className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                name="email"
                type="email"
                placeholder="superadmin@satguru.com"
                required
              />
            </label>

            <label className="grid gap-2 text-xs font-bold text-slate-900">
              Password <span className="text-orange-500">*</span>
              <input
                className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                name="password"
                type="password"
                placeholder="••••••••••"
                required
              />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs font-semibold">
            <label className="flex items-center gap-2 text-slate-700">
              <input className="h-4 w-4 rounded border-slate-300" type="checkbox" />
              Remember me
            </label>
            <Link className="text-emerald-700 hover:text-emerald-800" href="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          {message ? <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{message}</p> : null}

          <button
            className="mt-4 w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
            type="submit"
          >
            Log In
          </button>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-xs font-semibold text-slate-700">
            New user? <Link className="text-orange-500 hover:text-orange-600" href="/signup">Request access</Link> from admin
          </p>

          <div className="mt-5 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
            Protected login <span className="mx-2 text-slate-300">|</span> Authorized users only
          </div>
        </form>
      </section>
    </main>
  );
}
