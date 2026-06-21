'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type IconName =
  | 'dashboard'
  | 'directory'
  | 'favorite'
  | 'profile'
  | 'support'
  | 'overview'
  | 'users'
  | 'countries'
  | 'portals'
  | 'domains'
  | 'categories'
  | 'documents'
  | 'announcements'
  | 'settings';

function Icon({ name }: { name: IconName }) {
  const common = 'h-4 w-4 shrink-0';
  const paths: Record<IconName, string[]> = {
    dashboard: ['M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z'],
    directory: ['M4 6h16M4 12h16M4 18h10'],
    favorite: ['M12 4l2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 19.2l.9-5.5-4-3.9 5.5-.8L12 4Z'],
    profile: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0'],
    support: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5h.01M10 9a2 2 0 1 1 3.3 1.5c-.8.6-1.3 1.1-1.3 2.5'],
    overview: ['M4 19V5m0 14h16M8 16V9m4 7V7m4 9v-4'],
    users: ['M16 11a4 4 0 1 0-8 0m8 0a4 4 0 1 1-8 0m8 0c2.5.8 4 2.5 4 5v1H4v-1c0-2.5 1.5-4.2 4-5'],
    countries: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.3 2.8 3.5 5.8 3.5 9S14.3 18.2 12 21c-2.3-2.8-3.5-5.8-3.5-9S9.7 5.8 12 3Z'],
    portals: ['M4 5h16v14H4V5Zm4 4h8M8 13h5'],
    domains: ['M4 6h16M4 12h16M4 18h16M7 6c2 4 2 8 0 12m10-12c-2 4-2 8 0 12'],
    categories: ['M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v5H4v-5Zm9 0h7v5h-7v-5Z'],
    documents: ['M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h6M10 17h6'],
    announcements: ['M4 12h4l10-5v10L8 12H4Zm4 0v6'],
    settings: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 4h-2M6 12H4m12.2-5.2-1.4 1.4M9.2 16.8l-1.4 1.4m0-11.4 1.4 1.4m5.6 5.6 1.4 1.4']
  };

  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {paths[name].map((path) => (
        <path key={path} d={path} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

export function AppNavLink({ href, label, icon }: { href: string; label: string; icon: IconName }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={`group relative flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-black transition ${
        isActive ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
      }`}
    >
      {isActive ? <span className="absolute left-0 top-2 h-7 w-1 rounded-r-full bg-emerald-700" /> : null}
      <Icon name={icon} />
      <span className="truncate">{label}</span>
    </Link>
  );
}
