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
      setMessage('Only approved Satguru domains can access this portal.');
      return;
    }

    router.push('/dashboard?entry=portal');
    router.refresh();
  }

  function pending(feature: string) {
    setMessage(`${feature} will be connected in the next authentication phase.`);
  }

  return (
    <main className="relative min-h-[calc(100vh-73px)] overflow-hidden px-4 py-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.28),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.28),transparent_25%),radial-gradient(circle_at_50%_95%,rgba(246,166,35,0.28),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef6ff_45%,#fff7ed_100%)]" />
      <div className="absolute left-[8%] top-[12%] h-36 w-36 animate-pulse rounded-full border border-sky-300/50" />
      <div className="absolute right-[10%] top-[18%] h-24 w-24 animate-pulse rounded-full border border-emerald-300/60" />
      <div className="absolute bottom-[8%] left-[35%] h-44 w-44 animate-pulse rounded-full bg-saffron/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <section className="relative mx-auto flex min-h-[calc(100vh-105px)] w-full max-w-lg items-center justify-center">
        <div className="w-full rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:p-7">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-36 items-center justify-center rounded-2xl bg-white text-2xl font-black shadow-sm ring-1 ring-slate-100">
              <span className="text-emerald-700">sat</span><span className="text-orange-500">guru</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">Welcome back! Sign in to access your Satguru AI home.</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-navy px-4 py-3 text-left text-white shadow-sm" type="button">
              <span className="block text-sm font-bold">Login</span>
              <span className="mt-1 block text-xs text-slate-200">Use credentials</span>
            </button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:border-emerald-500" onClick={() => pending('Google login')} type="button">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900"><span className="grid h-6 w-6 place-items-center rounded-full border bg-white text-blue-600">G</span>Google</span>
              <span className="mt-1 block text-xs text-slate-500">Approved domains</span>
            </button>
          </div>

          <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
            <label className="grid gap-1.5 text-xs font-bold text-slate-700">
              <span className="flex items-center justify-between">Username / Email ID <span className="rounded-full border border-slate-300 px-1.5 text-[10px] text-slate-500" title="Enter your official email ID from an approved Satguru domain.">i</span></span>
              <input className="input bg-slate-50 py-2.5" name="email" type="email" placeholder="name@satgurutravel.com" required />
            </label>

            <label className="grid gap-1.5 text-xs font-bold text-slate-700">
              <span className="flex items-center justify-between">Password <Link className="text-[11px] font-bold text-emerald-700 hover:underline" href="/forgot-password">Forgot password?</Link></span>
              <div className="relative">
                <input className="input bg-slate-50 py-2.5 pr-16" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" required />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
            </label>

            {message ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{message}</p> : null}

            <button className="rounded-xl bg-navy px-4 py-3 text-sm font-bold text-white shadow-lg shadow-navy/10 hover:bg-slate-800" type="submit">Login</button>
          </form>

          <div className="my-4 flex items-center gap-3 text-[11px] text-slate-400"><span className="h-px flex-1 bg-slate-200" />New user access<span className="h-px flex-1 bg-slate-200" /></div>

          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:border-emerald-500" onClick={() => pending('Signup form')} type="button">Sign up with form</button>
            <button className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:border-emerald-500" onClick={() => pending('Google signup')} type="button"><span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-black text-blue-600">G</span>Sign up with Google</button>
          </div>

          <a className="mt-4 block rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-center text-xs font-bold text-navy hover:border-saffron hover:bg-amber-50" href="mailto:admin@satguruai.com?subject=Satguru AI Portal Login Help">Need help? Contact administrator</a>
          <p className="mt-3 text-center text-[11px] text-slate-500">Allowed domains: satgurutravel.com and satguruai.com.</p>
        </div>
      </section>
    </main>
  );
}
