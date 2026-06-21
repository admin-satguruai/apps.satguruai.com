'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HeaderUser = {
  name?: string;
  email?: string;
  role?: string;
};

function initials(name?: string, email?: string) {
  const source = name || email || 'SA';
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function displayRole(role?: string) {
  return role ? role.replace('_', ' ') : 'workspace';
}

export function Header({ user }: { user: HeaderUser | null }) {
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

        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          <div className="relative w-full max-w-xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            <input
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-24 text-sm font-semibold text-slate-400 outline-none"
              placeholder="Global search coming soon"
              disabled
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white px-2 py-1 text-xs font-black text-slate-400">Ctrl + K</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 xl:inline-flex">Admin Workspace</span>
          <Link href="/profile" className="flex max-w-[260px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-emerald-50">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-orange-400">{initials(user?.name, user?.email)}</span>
            <span className="hidden min-w-0 text-left md:block">
              <span className="block truncate text-sm font-black leading-4 text-slate-950">{user?.name || 'Satguru User'}</span>
              <span className="block truncate text-xs font-semibold capitalize text-slate-500">{displayRole(user?.role)}</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
