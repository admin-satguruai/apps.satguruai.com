import Link from 'next/link';

const userLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/portals', label: 'Portal directory' },
  { href: '/favorites', label: 'Favorites' },
  { href: '/profile', label: 'Profile' },
  { href: '/support', label: 'Support' }
];

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/portals', label: 'Portals' },
  { href: '/admin/domains', label: 'Domains' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/documents', label: 'Documents' },
  { href: '/admin/announcements', label: 'Announcements' },
  { href: '/admin/support', label: 'Support' },
  { href: '/admin/audit-logs', label: 'Audit logs' },
  { href: '/admin/settings', label: 'Settings' }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
      <aside className="card h-fit">
        <nav className="grid gap-2 text-sm font-medium">
          {userLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
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
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs text-slate-500">Server-side role checks are required when auth is connected.</p>
      </aside>
      <section>{children}</section>
    </div>
  );
}
