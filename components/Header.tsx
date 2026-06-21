'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { SatguruLogo } from '@/components/BrandLogo';

type HeaderUser = { name?: string; email?: string; role?: string };

function initials(name?: string, email?: string) {
  const source = name || email || 'SA';
  return source.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

function displayRole(role?: string) {
  return role ? role.replace('_', ' ') : 'workspace';
}

function HeaderLogo() {
  return (
    <Link href="/dashboard" className="flex h-12 w-[190px] shrink-0 items-center rounded-2xl px-1 transition hover:bg-white/80" aria-label="Go to dashboard">
      <SatguruLogo className="h-10 w-auto max-w-[180px] object-contain" />
    </Link>
  );
}

function SearchIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m21 21-4-4M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" strokeLinecap="round" /></svg>;
}

export function Header({ user = null }: { user?: HeaderUser | null }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    const applySidebarState = () => setSidebarExpanded(document.documentElement.dataset.satguruSidebar !== 'collapsed');
    applySidebarState();
    window.addEventListener('satguru-sidebar-change', applySidebarState);
    return () => window.removeEventListener('satguru-sidebar-change', applySidebarState);
  }, []);

  if (pathname === '/' || pathname === '/login') return null;

  return (
    <header className="fixed left-[var(--satguru-sidebar-width,220px)] right-0 top-0 z-50 h-[64px] border-b border-emerald-900/10 bg-gradient-to-r from-emerald-50/95 via-white/95 to-orange-50/95 shadow-sm shadow-slate-900/5 backdrop-blur-2xl transition-all duration-300 max-lg:left-0">
      <div className="flex h-full w-full items-center gap-4 px-4 sm:px-5 lg:px-6">
        {!sidebarExpanded ? <HeaderLogo /> : null}
        <div className="hidden min-w-0 flex-1 justify-start md:flex">
          <div className={`relative w-full ${sidebarExpanded ? 'max-w-4xl' : 'max-w-3xl'}`}>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
            <input className="h-10 w-full rounded-2xl border border-slate-200 bg-white/90 pl-11 pr-24 text-sm font-semibold text-slate-400 outline-none shadow-inner shadow-slate-100/80 ring-1 ring-white/70" placeholder="Global search coming soon" disabled />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-50 px-2 py-1 text-xs font-black text-slate-400 ring-1 ring-slate-200">Ctrl + K</span>
          </div>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-white/80 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 xl:inline-flex">Admin Workspace</span>
          <div className="relative">
            <button className="flex max-w-[280px] items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm shadow-slate-900/5 transition hover:bg-emerald-50" onClick={() => setProfileOpen((value) => !value)} type="button">
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
