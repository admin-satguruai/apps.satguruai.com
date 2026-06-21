'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

export function Header({ user = null }: { user?: HeaderUser | null }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  return (
    <header className="fixed left-[var(--satguru-sidebar-width,72px)] right-0 top-0 z-50 h-[64px] border-b border-slate-200/80 bg-white/88 shadow-sm shadow-slate-900/5 backdrop-blur-2xl transition-all duration-300 max-lg:left-0">
      <div className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden min-w-0 flex-1 justify-start lg:flex">
          <div className="relative w-full max-w-xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            <input className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-24 text-sm font-semibold text-slate-400 outline-none" placeholder="Global search coming soon" disabled />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white px-2 py-1 text-xs font-black text-slate-400">Ctrl + K</span>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 xl:inline-flex">Admin Workspace</span>
          <div className="relative">
            <button className="flex max-w-[280px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-emerald-50" onClick={() => setProfileOpen((value) => !value)} type="button">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-orange-400">{initials(user?.name, user?.email)}</span>
              <span className="hidden min-w-0 text-left md:block">
                <span className="block truncate text-sm font-black leading-4 text-slate-950">{user?.name || 'Satguru Workspace'}</span>
                <span className="block truncate text-xs font-semibold capitalize text-slate-500">{displayRole(user?.role)}</span>
              </span>
              <span className="text-xs text-slate-400">⌄</span>
            </button>

            {profileOpen ? (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15">
                <div className="border-b border-slate-100 p-3">
                  <p className="truncate text-sm font-black text-slate-950">{user?.name || 'Satguru Workspace'}</p>
                  <p className="truncate text-xs font-semibold text-slate-500">{user?.email || 'admin@satguruai.com'}</p>
                  <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-black capitalize text-emerald-700">{displayRole(user?.role)}</p>
                </div>
                <Link className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50" href="/profile">My Profile</Link>
                <Link className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50" href="/admin/settings">Preferences</Link>
                <Link className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50" href="/support">Help Center</Link>
                <Link className="block rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50" href="/api/auth/logout">Logout</Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
