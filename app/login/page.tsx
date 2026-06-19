'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const allowedDomains = ['satgurutravel.com', 'satguruai.com'];

function isAllowedEmail(email: string) {
  return allowedDomains.some((domain) => email.endsWith(`@${domain}`));
}

function GoogleMark() {
  return (
    <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-white text-[16px] font-black shadow-sm">
      <span className="text-[#4285F4]">G</span>
    </span>
  );
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
    <main className="relative h-[calc(100svh-73px)] overflow-hidden bg-slate-50 px-3 py-3 sm:px-4 lg:px-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_18%,rgba(14,165,233,0.22),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(16,185,129,0.22),transparent_26%),radial-gradient(circle_at_50%_94%,rgba(246,166,35,0.18),transparent_36%),linear-gradient(135deg,#f8fafc_0%,#eef6ff_46%,#fff7ed_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[4%] top-[9%] h-44 w-44 rounded-full border border-emerald-300/45 motion-safe:animate-[spin_30s_linear_infinite]" />
        <div className="absolute right-[9%] top-[18%] h-48 w-48 rounded-full border border-sky-300/45 motion-safe:animate-[spin_26s_linear_infinite_reverse]" />
        <div className="absolute left-[38%] top-[28%] h-60 w-60 rounded-full border border-emerald-200/40 motion-safe:animate-[spin_40s_linear_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:46px_46px]" />
      </div>

      <section className="relative mx-auto flex h-full w-full max-w-7xl items-center justify-center">
        <div className="grid max-h-full w-full overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/94 shadow-2xl shadow-slate-900/14 backdrop-blur-xl lg:h-full lg:max-h-[610px] lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="hidden border-r border-slate-200/80 bg-white/45 p-6 lg:flex lg:flex-col lg:items-center lg:justify-center xl:p-7">
            <div className="w-full max-w-lg text-center">
              <div className="relative mx-auto mb-4 h-48 w-full">
                <div className="absolute inset-x-8 top-3 h-36 rounded-full border border-emerald-200/70" />
                <div className="absolute left-14 top-6 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.75)]" />
                <div className="absolute right-16 top-20 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.75)]" />
                <div className="absolute left-1/2 top-8 h-36 w-36 -translate-x-1/2 rounded-full border border-emerald-100" />
                <div className="absolute inset-x-0 top-16 text-[clamp(2.7rem,5vw,4.3rem)] font-black leading-none tracking-tight">
                  <span className="text-emerald-700">Satguru</span><span className="text-orange-500">AI</span>
                </div>
              </div>
              <h1 className="text-[clamp(1.5rem,2vw,2rem)] font-black leading-tight text-slate-950">Welcome back to Satguru AI</h1>
              <p className="mt-2 text-base text-slate-600">Secure access to your internal AI applications and tools.</p>
            </div>
          </aside>

          <div className="flex min-h-0 items-center justify-center p-3 sm:p-4 lg:p-6 xl:p-7">
            <div className="w-full max-w-[600px]">
              <div className="mb-2 text-center lg:hidden">
                <div className="text-3xl font-black leading-none sm:text-4xl"><span className="text-emerald-700">Satguru</span><span className="text-orange-500">AI</span></div>
                <p className="mt-1 text-sm text-slate-600">Welcome back! Sign in to access your Satguru AI home.</p>
              </div>

              <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base font-extrabold text-slate-900 shadow-sm hover:border-emerald-500 hover:bg-emerald-50" onClick={() => pending('Google login')} type="button">
                <GoogleMark />
                Continue with Google
              </button>

              <div className="my-3 flex items-center gap-4 text-base text-slate-500 lg:my-4">
                <span className="h-px flex-1 bg-slate-200" />
                or
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <form className="grid gap-2.5" onSubmit={handleSubmit}>
                <label className="grid gap-1 text-base font-extrabold text-slate-900">
                  Email ID
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-emerald-700">✉</span>
                    <input className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-12 pr-4 text-lg font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" name="email" type="email" placeholder="you@company.com" required />
                  </div>
                </label>

                <label className="grid gap-1 text-base font-extrabold text-slate-900">
                  Password
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-emerald-700">▣</span>
                    <input className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-12 pr-14 text-lg font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••••" required />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-600 hover:text-emerald-700" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? '◌' : '◉'}</button>
                  </div>
                </label>

                <div className="flex items-center justify-between gap-3 text-base">
                  <label className="flex items-center gap-2 text-slate-700">
                    <input className="h-4 w-4 rounded border-slate-300 text-emerald-700" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />
                    Remember me
                  </label>
                  <Link className="font-extrabold text-emerald-700 hover:underline" href="/forgot-password">Forgot password?</Link>
                </div>

                {message ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-base text-amber-800">{message}</p> : null}

                <button className="rounded-xl bg-emerald-700 px-5 py-2.5 text-lg font-black text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800" type="submit">Login →</button>
              </form>

              <div className="my-3 flex items-center gap-3 text-base text-slate-700 lg:my-4">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="whitespace-nowrap font-medium">New here? Create your access</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base font-extrabold text-slate-900 shadow-sm hover:border-emerald-500 hover:bg-emerald-50" href="/signup">
                  <span className="text-xl text-emerald-700">✉</span>
                  Sign up with Email
                </Link>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base font-extrabold text-slate-900 shadow-sm hover:border-emerald-500 hover:bg-emerald-50" onClick={() => pending('Google signup')} type="button">
                  <GoogleMark />
                  Sign up with Google
                </button>
              </div>

              <a className="mt-3 flex items-center justify-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2.5 text-center text-slate-900 hover:border-emerald-500 hover:bg-emerald-50" href="mailto:admin@satguruai.com?subject=Satguru AI Portal Login Help">
                <span className="text-2xl text-emerald-700">☏</span>
                <span><span className="block text-base font-black">Need help? Contact administrator</span><span className="text-sm text-slate-600">We are here to help you with access or any queries.</span></span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
