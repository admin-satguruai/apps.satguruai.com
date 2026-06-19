'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const allowedDomains = ['satgurutravel.com', 'satguruai.com'];

function isAllowedEmail(email: string) {
  return allowedDomains.some((domain) => email.endsWith(`@${domain}`));
}

export default function Login() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();

    if (!isAllowedEmail(email)) {
      setMessage('Only official emails from approved Satguru domains can access this portal.');
      return;
    }

    router.push('/dashboard?entry=portal');
    router.refresh();
  }

  function showPendingFeature(feature: string) {
    setMessage(`${feature} will be connected after Google authentication setup.`);
  }

  return (
    <main className="relative min-h-[calc(100vh-73px)] overflow-hidden px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.35),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(246,166,35,0.28),_transparent_26%),linear-gradient(135deg,_#f8fafc_0%,_#eef6ff_45%,_#fff7ed_100%)]" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />

      <section className="relative mx-auto grid min-h-[calc(100vh-121px)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden rounded-[2rem] border border-white/60 bg-white/50 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur lg:block">
          <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-saffron">SA</span>
            Satguru AI Secure Home
          </div>
          <h1 className="mt-8 max-w-2xl text-5xl font-black leading-tight text-navy">
            One protected home for Satguru AI applications.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Access is restricted to approved official domains only. Internal portal links, documents, admin tools and AI knowledge will be visible after a valid login.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm"><div className="text-sm font-bold text-navy">Domain controlled</div><p className="mt-1 text-sm text-slate-600">Only approved company domains can enter.</p></div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm"><div className="text-sm font-bold text-navy">Role based access</div><p className="mt-1 text-sm text-slate-600">Standard user, admin and super admin views.</p></div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm"><div className="text-sm font-bold text-navy">Future SSO ready</div><p className="mt-1 text-sm text-slate-600">Built for Google login and central access.</p></div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm"><div className="text-sm font-bold text-navy">Admin managed</div><p className="mt-1 text-sm text-slate-600">Super admin can add new allowed domains later.</p></div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-2xl shadow-slate-900/15 backdrop-blur sm:p-8">
            <div className="flex flex-col items-center border-b border-slate-200 pb-6 text-center">
              <div className="flex h-20 w-44 items-center justify-center rounded-2xl bg-white text-3xl font-black shadow-sm">
                <span className="text-emerald-700">sat</span><span className="text-orange-500">guru</span>
              </div>
              <h2 className="mt-6 text-3xl font-black text-navy">Satguru AI</h2>
              <p className="mt-2 text-sm text-slate-600">Welcome back! Sign in to access your Satguru AI home.</p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button className="rounded-2xl border border-navy bg-navy p-4 text-left text-white shadow-sm" type="button">
                <div className="text-sm font-bold">Login to portal</div>
                <p className="mt-1 text-xs text-slate-200">Use existing credentials</p>
              </button>
              <button className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-saffron" onClick={() => showPendingFeature('Google login')} type="button">
                <div className="text-sm font-bold text-navy">Login with Google</div>
                <p className="mt-1 text-xs text-slate-500">Approved domains only</p>
              </button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-semibold text-navy">
                <span className="flex items-center justify-between">Username / Email ID <span className="rounded-full border border-slate-300 px-2 text-xs text-slate-500" title="Enter your official email ID from an approved Satguru domain.">i</span></span>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">@</span><input className="input pl-10" name="email" type="email" placeholder="name@satgurutravel.com" required /></div>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-navy">
                <span className="flex items-center justify-between">Password <Link className="text-xs font-bold text-emerald-700 hover:underline" href="/forgot-password">Forgot password?</Link></span>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">*</span><input className="input px-10" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" required /><button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? 'Hide' : 'Show'}</button></div>
              </label>

              {message ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{message}</p> : null}

              <button className="btn-primary bg-emerald-700 py-4 text-base hover:bg-emerald-800" type="submit">Login</button>
            </form>

            <div className="my-6 flex items-center gap-4 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />New user access<span className="h-px flex-1 bg-slate-200" /></div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link className="btn-secondary justify-center" href="/signup">Sign up with form</Link>
              <button className="btn-secondary justify-center" onClick={() => showPendingFeature('Google signup')} type="button">Sign up with Google</button>
            </div>

            <a className="mt-5 flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-navy hover:border-saffron hover:bg-amber-50" href="/contact">Need help? Contact administrator</a>

            <p className="mt-5 text-center text-xs text-slate-500">Current allowed domains: satgurutravel.com and satguruai.com. More domains will be managed by Super Admin later.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
