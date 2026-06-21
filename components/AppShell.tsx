import Link from 'next/link';
import { AppNavLink } from '@/components/AppNavLink';
import { getSessionUser } from '@/lib/auth';

const adminLinks = [
  { key: 'users', label: 'Users', icon: 'users' as const },
  { key: 'countries', label: 'Countries', icon: 'countries' as const },
  { key: 'portals', label: 'Portals', icon: 'portals' as const },
  { key: 'domains', label: 'Domains', icon: 'domains' as const },
  { key: 'categories', label: 'Categories', icon: 'categories' as const },
  { key: 'documents', label: 'Documents', icon: 'documents' as const },
  { key: 'announcements', label: 'Announcements', icon: 'announcements' as const },
  { key: 'support', label: 'Support', icon: 'support' as const },
  { key: 'settings', label: 'Settings', icon: 'settings' as const }
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
    <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {user.picture ? (
          <img src={user.picture} alt="Profile" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-sm font-black text-orange-400">
            {initials(user.name, user.email)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">{user.name}</p>
          <p className="truncate text-xs font-medium text-slate-500">{user.email}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span className="rounded-full bg-emerald-50 px-2 py-1 font-black capitalize text-emerald-700">{user.role.replace('_', ' ')}</span>
        <span className="capitalize">{user.loginMethod || 'session'}</span>
      </div>
      <Link href="/api/auth/logout" className="mt-3 block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-black text-slate-900 hover:bg-slate-100">
        Logout
      </Link>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-slate-50">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-[96px] flex max-h-[calc(100vh-112px)] flex-col overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <nav className="grid gap-2">
              <AppNavLink href="/dashboard" label="Dashboard" icon="dashboard" />
              <AppNavLink href="/portals" label="Portal directory" icon="directory" />
              <AppNavLink href="/favorites" label="Favorites" icon="favorite" />
              <AppNavLink href="/profile" label="Profile" icon="profile" />
              <AppNavLink href="/support" label="Support" icon="support" />
            </nav>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-2 px-4 text-xs font-black uppercase tracking-wide text-slate-400">Admin</p>
              <nav className="grid gap-2">
                <AppNavLink href="/admin" label="Admin console" icon="overview" />
                <AppNavLink href="/admin/countries" label="Country Master" icon="countries" />
              </nav>
            </div>
            <SessionCard />
          </div>
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-slate-50">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-[96px] flex max-h-[calc(100vh-112px)] flex-col overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Admin Workspace</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Admin console</h2>
            </div>
            <nav className="grid gap-2">
              <AppNavLink href="/admin" label="Overview" icon="overview" />
              {adminLinks.map((link) => (
                <AppNavLink key={link.key} href={`/admin/${link.key}`} label={link.label} icon={link.icon} />
              ))}
            </nav>
            <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs font-medium leading-5 text-slate-500">Admin access is controlled by the active session role.</p>
            <SessionCard />
          </div>
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}
