import Link from 'next/link';

const adminLinks = [
  'users',
  'portals',
  'domains',
  'categories',
  'documents',
  'announcements',
  'support',
  'settings',
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
      <aside className="card h-fit">
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
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr]">
      <aside className="card h-fit">
        <h2 className="font-bold text-navy">Admin console</h2>
        <nav className="mt-4 grid gap-2 text-sm font-medium">
          <Link href="/admin">Overview</Link>
          {adminLinks.map((link) => (
            <Link key={link} href={`/admin/${link}`}>
              {link[0].toUpperCase() + link.slice(1)}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs text-slate-500">
          Server-side role checks are required when auth is connected.
        </p>
      </aside>
      <section>{children}</section>
    </div>
  );
}
