import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';

const adminLinks = [
  'users',
  'countries',
  'portals',
  'domains',
  'categories',
  'documents',
  'announcements',
  'support',
  'settings',
];

function initials(name?: string, email?: string) {
  const source = name || email || 'SA';
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function SessionCard() {
  const user = getSessionUser();

  if (!user) {
    return null;
  }

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        {user.picture ? (
          <img src={user.picture} alt="Profile" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-bold text-white">
            {initials(user.name, user.email)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span className="rounded-full bg-white px-2 py-1 font-semibold capitalize text-slate-600">{user.role.replace('_', ' ')}</span>
        <span className="capitalize">{user.loginMethod || 'session'}</span>
      </div>
      <Link href="/api/auth/logout" className="mt-3 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-navy hover:bg-slate-100">
        Logout
      </Link>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr]">
      <aside className="card h-fit">
        <SessionCard />
        <nav className="grid gap-2 text-sm font-medium">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/portals">Portal directory</Link>
          <Link href="/favorites">Favorites</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/support">Support</Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[280px_1fr]">
      <aside className="card h-fit">
        <SessionCard />
        <h2 className="font-bold text-navy">Admin console</h2>
        <nav className="mt-4 grid gap-2 text-sm font-medium">
          <Link href="/admin">Overview</Link>
          {adminLinks.map((link) => (
            <Link key={link} href={`/admin/${link}`}>
              {link[0].toUpperCase() + link.slice(1)}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs text-slate-500">Admin access is controlled by the active session role.</p>
      </aside>
      <section>{children}</section>
    </div>
  );
}
