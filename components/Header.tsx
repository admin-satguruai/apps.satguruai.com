'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-slate-200/80 bg-white/85 shadow-sm shadow-slate-900/5 backdrop-blur-2xl">
      <div className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-3 font-black text-slate-950">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-orange-400 shadow-lg shadow-slate-900/10">SA</span>
          <span className="hidden text-lg tracking-tight sm:block">Satguru AI</span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            <input
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-24 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              placeholder="Search anything..."
              readOnly
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-400">Ctrl + K</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 lg:inline-flex">Admin Workspace</span>
          <Link href="/profile" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-emerald-50">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-xs font-black text-orange-400">SA</span>
            <span className="hidden text-left md:block">
              <span className="block text-sm font-black leading-4 text-slate-950">Super Admin</span>
              <span className="text-xs font-semibold text-slate-500">Super Admin</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
