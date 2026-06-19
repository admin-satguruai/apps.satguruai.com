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
  const [rememberMe, setRememberMe] = useState(false);

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
    <main className="relative min-h-[calc(100vh-73px)] overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.28),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.28),transparent_25%),radial-gradient(circle_at_50%_95%,rgba(246,166,35,0.28),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef6ff_45%,#fff7ed_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[7%] top-[9%] h-72 w-72 rounded-full border border-sky-300/40 motion-safe:animate-[spin_26s_linear_infinite]" />
        <div className="absolute right-[8%] top-[12%] h-60 w-60 rounded-full border border-emerald-300/40 motion-safe:animate-[spin_22s_linear_infinite_reverse]" />
        <div className="absolute bottom-[10%] left-[18%] h-80 w-80 rounded-full border border-amber-300/35 motion-safe:animate-[spin_34s_linear_infinite]" />
        <div className="absolute left-[12%] top-[24%] h-3 w-3 rounded-full bg-sky-500 shadow-[0_0_35px_rgba(14,165,233,0.9)] motion-safe:animate-ping" />
        <div className="absolute right-[22%] top-[28%] h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.9)] motion-safe:animate-ping" />
        <div className="absolute bottom-[22%] left-[38%] h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_35px_rgba(246,166,35,0.9)] motion-safe:animate-ping" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:48px_48px] motion-safe:animate-[pulse_5s_ease-in-out_infinite]" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-121px)] w-full items-center justify-center">
        <div className="w-full max-w-3xl rounded-[2.5rem] border border-white/80 bg-white/95 px-6 py-8 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:px-10 lg:px-14">
          <div className="text-center">
            <div className="mx-auto flex h-24 items-center justify-center text-6xl font-black tracking-tight sm:text-7xl">
              <span className="text-emerald-700">Sat</span><span className="text-orange-500">guru</span><span className="text-orange-500">AI</span>
            </div>
            <div className="mt-3 flex items-center justify-center gap-5">
              <span className="h-px w-28 bg-slate-200 sm:w-44" />
              <span className="text-2xl font-black leading-none text-emerald-700">...</span>
              <span className="h-px w-28 bg-slate-200 sm:w-44" />
            </div>
            <p className="mt-5 text-base text-slate-700 sm:text-lg">Welcome back! Sign in to access your Satguru AI home.</p>
          </div>

          <button className="mt-8 flex w-full items-center justify-center gap-4 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-lg font-bold text-slate-900 shadow-sm hover:border-emerald-500 hover:bg-emerald-50" onClick={() => pending('Google login')} type="button">
            <span className="text-2xl font-black text-blue-600">G</span>
            Continue with Google
          </button>

          <div className="my-8 flex items-center gap-5 text-sm text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-base font-bold text-slate-900">
              Email ID
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-emerald-50 p-2 text-emerald-700">✉</span>
                <input className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-16 pr-5 text-base text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" name="email" type="email" placeholder="Enter your official email ID" required />
              </div>
            </label>

            <label className="grid gap-2 text-base font-bold text-slate-900">
              Password
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-emerald-50 p-2 text-emerald-700">▣</span>
                <input className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-16 pr-16 text-base text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required />
                <button className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-slate-500" onClick={() => setShowPassword((value) => !value)} type="button">◉</button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
              <label className="flex items-center gap-3 text-slate-700">
                <input className="h-5 w-5 rounded border-slate-300 text-emerald-700" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />
                Remember me
              </label>
              <Link className="font-bold text-emerald-700 hover:underline" href="/forgot-password">Forgot password?</Link>
            </div>

            {message ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{message}</p> : null}

            <button className="rounded-2xl bg-emerald-700 px-5 py-4 text-xl font-black text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800" type="submit">Login →</button>
          </form>

          <div className="my-8 flex items-center gap-4 text-base text-slate-700 sm:text-xl">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="whitespace-nowrap">New here? Create your account</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link className="flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-bold text-slate-900 shadow-sm hover:border-emerald-500 hover:bg-emerald-50" href="/signup">
              <span className="text-xl text-emerald-700">✉</span>
              Sign up with Email
            </Link>
            <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-bold text-slate-900 shadow-sm hover:border-emerald-500 hover:bg-emerald-50" onClick={() => pending('Google signup')} type="button">
              <span className="text-xl font-black text-blue-600">G</span>
              Sign up with Google
            </button>
          </div>

          <a className="mt-6 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-6 py-5 text-slate-900 hover:border-emerald-500 hover:bg-emerald-50" href="mailto:admin@satguruai.com?subject=Satguru AI Portal Login Help">
            <span className="text-3xl text-emerald-700">☏</span>
            <span><span className="block text-lg font-black">Need help? Contact administrator</span><span className="text-sm text-slate-600">We are here to help you with access or any queries.</span></span>
          </a>

          <p className="mt-6 text-center text-base text-slate-600">🛡 Allowed domains: satgurutravel.com and satguruai.com.</p>
        </div>
      </section>
    </main>
  );
}
