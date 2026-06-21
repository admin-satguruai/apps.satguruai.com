'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

import { SatguruLogo } from '@/components/BrandLogo';

const allowedDomains = ['satgurutravel.com', 'satguruai.com'];

function isAllowedEmail(email: string) {
  return allowedDomains.some((domain) => email.endsWith(`@${domain}`));
}

export default function Login() {
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) setMessage(error);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();

    if (!isAllowedEmail(email)) {
      setMessage('Only approved Satguru domains can access this portal.');
      setIsSubmitting(false);
      return;
    }

    const response = await fetch('/api/auth/email-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({ message: 'Unable to create login session.' }));
      setMessage(result.message || 'Unable to create login session.');
      setIsSubmitting(false);
      return;
    }

    window.location.href = '/dashboard';
  }

  function startGoogleLogin() {
    window.location.href = '/api/auth/google';
  }

  return (
    <main className="relative min-h-screen overflow-y-auto overflow-x-hidden bg-slate-50 px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_18%,rgba(14,165,233,0.22),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(16,185,129,0.22),transparent_26%),radial-gradient(circle_at_50%_94%,rgba(246,166,35,0.18),transparent_36%),linear-gradient(135deg,#f8fafc_0%,#eef6ff_46%,#fff7ed_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[4%] top-[9%] h-44 w-44 rounded-full border border-emerald-300/45 motion-safe:animate-[spin_30s_linear_infinite]" />
        <div className="absolute right-[9%] top-[18%] h-48 w-48 rounded-full border border-sky-300/45 motion-safe:animate-[spin_26s_linear_infinite_reverse]" />
        <div className="absolute left-[38%] top-[28%] h-60 w-60 rounded-full border border-emerald-200/40 motion-safe:animate-[spin_40s_linear_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:46px_46px]" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/94 shadow-2xl shadow-slate-900/14 backdrop-blur-xl lg:max-h-[calc(100svh-2.5rem)] lg:min-h-[560px] lg:grid-cols-[0.96fr_1.04fr]">
          <aside className="hidden border-r border-slate-200/80 bg-white/45 p-5 lg:flex lg:flex-col lg:items-center lg:justify-center xl:p-6">
            <div className="w-full max-w-lg text-center">
              <div className="relative mx-auto mb-4 h-44 w-full xl:h-48">
                <div className="absolute inset-x-8 top-3 h-32 rounded-full border border-emerald-200/70 xl:h-36" />
                <div className="absolute left-14 top-6 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.75)]" />
                <div className="absolute right-16 top-20 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.75)]" />
                <div className="absolute left-1/2 top-7 h-32 w-32 -translate-x-1/2 rounded-full border border-emerald-100 xl:h-36 xl:w-36" />
                <div className="absolute inset-x-0 top-14 flex justify-center xl:top-16">
                  <SatguruLogo className="h-24 w-auto max-w-[360px] object-contain" />
                </div>
              </div>
              <h1 className="text-[clamp(1.45rem,2vw,2rem)] font-black leading-tight text-slate-950">Welcome back to Satguru AI</h1>
              <p className="mt-2 text-sm text-slate-600 xl:text-base">Secure access to your internal AI applications and tools.</p>
            </div>
          </aside>

          <div className="flex min-h-0 items-center justify-center p-4 sm:p-5 lg:p-5 xl:p-6">
            <div className="w-full max-w-[520px]">
              <div className="mb-2 text-center lg:hidden">
                <SatguruLogo className="mx-auto h-14 w-auto max-w-[220px] object-contain" />
                <p className="mt-1 text-sm text-slate-600">Welcome back! Sign in to access your Satguru AI home.</p>
              </div>

              <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm hover:border-emerald-500 hover:bg-emerald-50 xl:py-2.5" onClick={startGoogleLogin} type="button">
                <img src="/brand/google-g.svg" alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
                Continue with Google
              </button>

              <div className="my-3 flex items-center gap-4 text-sm text-slate-500"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>

              <form className="grid gap-2.5" onSubmit={handleSubmit}>
                <label className="grid gap-1 text-sm font-extrabold text-slate-900">
                  Email ID
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-emerald-700">✉</span>
                    <input className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-11 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 xl:py-2.5" name="email" type="email" placeholder="you@company.com" required />
                  </div>
                </label>

                <label className="grid gap-1 text-sm font-extrabold text-slate-900">
                  Password
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-emerald-700">▣</span>
                    <input className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-11 pr-14 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 xl:py-2.5" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••••" required />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-600 hover:text-emerald-700" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? '◌' : '◉'}</button>
                  </div>
                </label>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 text-slate-700"><input className="h-4 w-4 rounded border-slate-300 text-emerald-700" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />Remember me</label>
                  <Link className="font-extrabold text-emerald-700 hover:underline" href="/forgot-password">Forgot password?</Link>
                </div>

                {message ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800">{message}</p> : null}
                <button className="rounded-xl bg-emerald-700 px-5 py-2.5 text-base font-black text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isSubmitting} type="submit">{isSubmitting ? 'Creating session...' : 'Login →'}</button>
              </form>

              <div className="my-3 flex items-center gap-3 text-sm text-slate-700"><span className="h-px flex-1 bg-slate-200" /><span className="whitespace-nowrap font-medium">New here? Create your access</span><span className="h-px flex-1 bg-slate-200" /></div>
              <Link className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm hover:border-emerald-500 hover:bg-emerald-50 xl:py-2.5" href="/signup"><span className="text-lg text-emerald-700">✉</span>Sign up with Email</Link>
              <a className="mt-3 flex items-center justify-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2 text-center text-slate-900 hover:border-emerald-500 hover:bg-emerald-50 xl:py-2.5" href="mailto:admin@satguruai.com?subject=Satguru AI Portal Login Help"><span className="text-xl text-emerald-700">☏</span><span><span className="block text-sm font-black">Need help? Contact administrator</span><span className="text-xs text-slate-600 xl:text-sm">We are here to help you with access or any queries.</span></span></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
