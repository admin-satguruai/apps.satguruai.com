'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

import { SatguruLogo } from '@/components/BrandLogo';

const allowedDomains = ['satgurutravel.com', 'satguruai.com'];

function isAllowedEmail(email: string) {
  return allowedDomains.some((domain) => email.endsWith(`@${domain}`));
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function MailIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M4.5 6.5h15v11h-15z" rx="2" /><path d="m5 7 7 5.5L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function LockIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M7 10V8a5 5 0 0 1 10 0v2" strokeLinecap="round" /><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M12 14v2" strokeLinecap="round" /></svg>;
}

function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.5" /></svg>;
}

function UserPlusIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M15 19a6 6 0 0 0-12 0" strokeLinecap="round" /><circle cx="9" cy="8" r="4" /><path d="M19 8v6M22 11h-6" strokeLinecap="round" /></svg>;
}

function HelpIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.5 2.5 0 0 1 4.8 1c0 1.7-1.9 2.1-2.4 3.5" strokeLinecap="round" /><path d="M12 17h.01" strokeLinecap="round" /></svg>;
}

function Spinner() {
  return <span className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />;
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
      body: JSON.stringify({ email, rememberMe })
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
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-3 py-3 sm:px-4">
      {isSubmitting ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white/80 backdrop-blur-md">
          <div className="flex w-[min(92vw,360px)] flex-col items-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-2xl shadow-slate-900/15">
            <Spinner />
            <p className="mt-5 text-lg font-black text-slate-950">Signing you in</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Please wait while we verify your access and open your workspace.</p>
          </div>
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_18%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(16,185,129,0.18),transparent_26%),radial-gradient(circle_at_50%_94%,rgba(246,166,35,0.14),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#edf8ff_46%,#fff7ed_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100svh-1.5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[1.45rem] border border-white/80 bg-white/90 shadow-2xl shadow-slate-900/12 backdrop-blur-xl lg:max-h-[calc(100svh-2rem)] lg:min-h-[500px] lg:grid-cols-[0.94fr_1.06fr]">
          <aside className="hidden border-r border-slate-200/80 bg-gradient-to-br from-white/45 via-emerald-50/35 to-sky-50/30 p-8 lg:flex lg:flex-col lg:items-center lg:justify-center">
            <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
              <div className="relative grid w-full place-items-center rounded-[2rem] border border-emerald-100/70 bg-white/35 px-7 py-8 shadow-inner shadow-white/60 backdrop-blur-sm">
                <div className="absolute inset-x-8 bottom-5 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
                <SatguruLogo className="relative h-16 w-auto max-w-[300px] object-contain mix-blend-multiply" />
              </div>
              <h1 className="mt-8 text-[clamp(1.35rem,1.85vw,1.85rem)] font-black leading-tight text-slate-950">Welcome back to Satguru AI</h1>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">Secure access to your internal AI applications and tools.</p>
            </div>
          </aside>

          <div className="flex min-h-0 items-center justify-center p-5 sm:p-6 lg:p-8">
            <div className="w-full max-w-[460px]">
              <div className="mb-5 text-center lg:hidden">
                <SatguruLogo className="mx-auto h-14 w-auto max-w-[220px] object-contain" />
                <p className="mt-2 text-sm text-slate-600">Welcome back! Sign in to access your Satguru AI home.</p>
              </div>

              <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50" onClick={startGoogleLogin} type="button">
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="my-3 flex items-center gap-4 text-sm text-slate-500"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>

              <form className="grid gap-2.5" onSubmit={handleSubmit}>
                <label className="grid gap-1 text-[13px] font-bold text-slate-800">
                  Email ID
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"><MailIcon /></span>
                    <input className="w-full rounded-xl border border-slate-300 bg-white/90 py-2.5 pl-11 pr-4 text-[15px] font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" name="email" type="email" placeholder="you@company.com" required />
                  </div>
                </label>

                <label className="grid gap-1 text-[13px] font-bold text-slate-800">
                  Password
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"><LockIcon /></span>
                    <input className="w-full rounded-xl border border-slate-300 bg-white/90 py-2.5 pl-11 pr-14 text-[15px] font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-emerald-700" onClick={() => setShowPassword((value) => !value)} type="button" aria-label="Toggle password visibility"><EyeIcon /></button>
                  </div>
                </label>

                <div className="flex items-center justify-between gap-3 text-[12px]">
                  <label className="flex items-center gap-2 font-medium text-slate-500"><input className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-700" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />Remember me</label>
                  <Link className="font-semibold text-emerald-700 hover:underline" href="/forgot-password">Forgot password?</Link>
                </div>

                {message ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800">{message}</p> : null}
                <button className="rounded-xl bg-emerald-700 px-5 py-2.5 text-base font-black text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-emerald-700" disabled={isSubmitting} type="submit">Login</button>
              </form>

              <div className="my-3 flex items-center gap-3 text-sm text-slate-500"><span className="h-px flex-1 bg-slate-200" /><span className="whitespace-nowrap font-medium">New here? Create your access</span><span className="h-px flex-1 bg-slate-200" /></div>
              <Link className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50" href="/signup"><span className="text-emerald-600"><UserPlusIcon /></span>Sign up with Email</Link>
              <a className="mt-3 flex items-center justify-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/35 px-4 py-2.5 text-center text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50" href="mailto:admin@satguruai.com?subject=Satguru AI Portal Login Help"><span className="text-emerald-600"><HelpIcon /></span><span><span className="block text-sm font-bold">Need help? Contact administrator</span><span className="text-xs text-slate-500">Support for access and login queries.</span></span></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
