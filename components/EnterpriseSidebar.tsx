'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

type SidebarUser = { name?: string; email?: string; role?: string; branch?: string; picture?: string; loginMethod?: string };
type IconName = 'dashboard' | 'crm' | 'sales' | 'marketing' | 'ops' | 'master' | 'clients' | 'contacts' | 'leads' | 'campaigns' | 'activities' | 'reports' | 'analytics' | 'ai' | 'users' | 'settings' | 'audit' | 'country' | 'region' | 'branch' | 'industry' | 'supplier' | 'currency' | 'mail' | 'template' | 'sequence' | 'chevron' | 'menu' | 'search' | 'profile' | 'support' | 'portal';
type NavItem = { label: string; href: string; icon: IconName; badge?: string; ai?: boolean; children?: NavItem[] };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
      { label: 'Portal Directory', href: '/portals', icon: 'portal' },
      { label: 'CRM', href: '/crm', icon: 'crm' },
      { label: 'Sales', href: '/sales', icon: 'sales' },
      { label: 'Operations', href: '/operations', icon: 'ops' }
    ]
  },
  {
    title: 'Business Modules',
    items: [
      {
        label: 'Master Data',
        href: '/admin/countries',
        icon: 'master',
        children: [
          { label: 'Country', href: '/admin/countries', icon: 'country' },
          { label: 'Region', href: '/admin/regions', icon: 'region' },
          { label: 'Branch', href: '/admin/branches', icon: 'branch' },
          { label: 'Industry', href: '/admin/industries', icon: 'industry' },
          { label: 'Supplier', href: '/admin/suppliers', icon: 'supplier' },
          { label: 'Currency', href: '/admin/currencies', icon: 'currency' }
        ]
      },
      {
        label: 'CRM Data',
        href: '/clients',
        icon: 'crm',
        children: [
          { label: 'Clients', href: '/clients', icon: 'clients' },
          { label: 'Contacts', href: '/contacts', icon: 'contacts' },
          { label: 'Leads', href: '/leads', icon: 'leads' },
          { label: 'Activities', href: '/activities', icon: 'activities' }
        ]
      },
      {
        label: 'Marketing',
        href: '/campaigns',
        icon: 'marketing',
        children: [
          { label: 'Campaigns', href: '/campaigns', icon: 'campaigns', badge: '12' },
          { label: 'Email', href: '/email', icon: 'mail' },
          { label: 'Templates', href: '/templates', icon: 'template' },
          { label: 'Sequences', href: '/sequences', icon: 'sequence' }
        ]
      },
      { label: 'Reports', href: '/reports', icon: 'reports' },
      { label: 'Analytics', href: '/analytics', icon: 'analytics' }
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'AI Insights', href: '/ai-insights', icon: 'ai', badge: 'NEW', ai: true },
      { label: 'Users & Roles', href: '/admin/users', icon: 'users' },
      { label: 'Settings', href: '/admin/settings', icon: 'settings' },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'audit' },
      { label: 'Support', href: '/support', icon: 'support' }
    ]
  }
];

const recentItems: NavItem[] = [
  { label: 'Country', href: '/admin/countries', icon: 'country' },
  { label: 'Clients', href: '/clients', icon: 'clients' },
  { label: 'Campaigns', href: '/campaigns', icon: 'campaigns' }
];

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string[]> = {
    dashboard: ['M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z'],
    crm: ['M7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 21v-2a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v2m-2-7h5a5 5 0 0 1 5 5v2'],
    sales: ['M4 19V5m0 14h16M8 16l3-4 3 2 5-7'],
    marketing: ['M4 12h4l10-5v10L8 12H4Zm4 0v6'],
    ops: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 4h-2M6 12H4m12.2-5.2-1.4 1.4M9.2 16.8l-1.4 1.4m0-11.4 1.4 1.4m5.6 5.6 1.4 1.4'],
    master: ['m12 3 9 5-9 5-9-5 9-5Zm-7 9 7 4 7-4M5 16l7 4 7-4'],
    clients: ['M3 21V5a2 2 0 0 1 2-2h10v18M9 7h2m-2 4h2m-2 4h2m6-6h2a2 2 0 0 1 2 2v10'],
    contacts: ['M16 11a4 4 0 1 0-8 0m8 0a4 4 0 1 1-8 0m8 0c2.5.8 4 2.5 4 5v1H4v-1c0-2.5 1.5-4.2 4-5'],
    leads: ['M12 3v18m0-18 7 4-7 4m0-8-7 4 7 4'],
    campaigns: ['M4 12h4l10-5v10L8 12H4Zm4 0v6'],
    activities: ['M4 6h16M4 12h10M4 18h7'],
    reports: ['M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h6M10 17h6'],
    analytics: ['M4 19V5m0 14h16M8 16V9m4 7V7m4 9v-4'],
    ai: ['M12 3l1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z'],
    users: ['M16 11a4 4 0 1 0-8 0m8 0a4 4 0 1 1-8 0m8 0c2.5.8 4 2.5 4 5v1H4v-1c0-2.5 1.5-4.2 4-5'],
    settings: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 4h-2M6 12H4m12.2-5.2-1.4 1.4M9.2 16.8l-1.4 1.4m0-11.4 1.4 1.4m5.6 5.6 1.4 1.4'],
    audit: ['M9 12l2 2 4-5M5 3h14v7c0 5-3 9-7 11-4-2-7-6-7-11V3Z'],
    country: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.3 2.8 3.5 5.8 3.5 9S14.3 18.2 12 21c-2.3-2.8-3.5-5.8-3.5-9S9.7 5.8 12 3Z'],
    region: ['M4 6h16M6 6v12m12-12v12M4 18h16'],
    branch: ['M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6'],
    industry: ['M3 21h18M5 21V9l5 3V9l5 3V7h4v14'],
    supplier: ['M4 7h10v10H4V7Zm10 3h3l3 3v4h-6v-7Z'],
    currency: ['M12 3v18M8 7h6a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6'],
    mail: ['M4 6h16v12H4V6Zm0 0l8 7 8-7'],
    template: ['M6 3h12v18H6V3Zm3 5h6M9 12h6M9 16h4'],
    sequence: ['M4 7h5v5H4V7Zm11 0h5v5h-5V7ZM4 17h5m6 0h5M9 9h6m-6 10h6'],
    chevron: ['m9 6 6 6-6 6'],
    menu: ['M4 6h16M4 12h16M4 18h16'],
    search: ['m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z'],
    profile: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0'],
    support: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5h.01M10 9a2 2 0 1 1 3.3 1.5c-.8.6-1.3 1.1-1.3 2.5'],
    portal: ['M4 5h16v14H4V5Zm4 4h8M8 13h5']
  };

  return <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">{paths[name].map((path) => <path key={path} d={path} strokeLinecap="round" strokeLinejoin="round" />)}</svg>;
}

function initials(name?: string, email?: string) {
  const source = name || email || 'SA';
  return source.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

function labelRole(role?: string) {
  return role ? role.replace('_', ' ') : 'Workspace User';
}

function isItemActive(pathname: string, item: NavItem) {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`)) || false;
}

function flattenItems(groups: NavGroup[]) {
  return groups.flatMap((group) => group.items.flatMap((item) => [item, ...(item.children || [])]));
}

function SidebarItem({ item, collapsed, level = 0, onNavigate }: { item: NavItem; collapsed: boolean; level?: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = isItemActive(pathname, item);
  return (
    <Link href={item.href} title={collapsed ? item.label : undefined} onClick={onNavigate} className={`group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition duration-200 hover:translate-x-0.5 ${active ? 'bg-emerald-100 text-emerald-700' : item.ai ? 'bg-gradient-to-r from-emerald-700 to-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'} ${level > 0 && !collapsed ? 'ml-3' : ''}`}>
      {active ? <span className="absolute left-0 top-2 h-6 w-1 rounded-r-full bg-emerald-700" /> : null}
      <Icon name={item.icon} />
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
      {!collapsed && item.badge ? <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white">{item.badge}</span> : null}
      {collapsed ? <span className="pointer-events-none absolute left-[64px] z-50 hidden rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white shadow-xl group-hover:block">{item.label}</span> : null}
    </Link>
  );
}

function SidebarGroup({ group, collapsed, query, onNavigate }: { group: NavGroup; collapsed: boolean; query: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const defaultOpen = group.items.some((item) => isItemActive(pathname, item));
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = group.items.map((item) => {
    if (!normalizedQuery) return item;
    const childMatches = item.children?.filter((child) => child.label.toLowerCase().includes(normalizedQuery));
    if (item.label.toLowerCase().includes(normalizedQuery) || childMatches?.length) return { ...item, children: childMatches || item.children };
    return null;
  }).filter(Boolean) as NavItem[];
  if (visibleItems.length === 0) return null;

  return (
    <section className="space-y-1.5">
      {!collapsed ? <p className="px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{group.title}</p> : null}
      <div className="grid gap-1">
        {visibleItems.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const itemOpen = normalizedQuery ? true : (openGroups[item.label] ?? defaultOpen);
          if (!hasChildren) return <SidebarItem key={item.label} item={item} collapsed={collapsed} onNavigate={onNavigate} />;
          return (
            <div key={item.label}>
              <button title={collapsed ? item.label : undefined} className={`group relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition duration-200 hover:translate-x-0.5 ${isItemActive(pathname, item) ? 'bg-emerald-100 text-emerald-700' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`} onClick={() => setOpenGroups((current) => ({ ...current, [item.label]: !itemOpen }))} type="button">
                {isItemActive(pathname, item) ? <span className="absolute left-0 top-2 h-6 w-1 rounded-r-full bg-emerald-700" /> : null}
                <Icon name={item.icon} />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
                {!collapsed ? <span className={`ml-auto transition ${itemOpen ? 'rotate-90' : ''}`}><Icon name="chevron" /></span> : null}
                {collapsed ? <span className="pointer-events-none absolute left-[64px] z-50 hidden rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white shadow-xl group-hover:block">{item.label}</span> : null}
              </button>
              {itemOpen && !collapsed ? <div className="mt-1 grid gap-1">{item.children?.map((child) => <SidebarItem key={child.label} item={child} collapsed={collapsed} level={1} onNavigate={onNavigate} />)}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function EnterpriseSidebar({ user }: { user: SidebarUser | null }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const allItems = useMemo(() => flattenItems(navGroups), []);
  const quickMatches = query.trim() ? allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
  const widthClass = collapsed ? 'w-[72px]' : 'w-[248px]';

  const content = (
    <div className={`flex h-full flex-col border-r border-slate-200 bg-white shadow-[0_0_25px_rgba(15,23,42,0.04)] transition-all duration-300 ${widthClass}`}>
      <div className="flex h-[64px] shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-3">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-orange-400">SA</span>
          {!collapsed ? <span className="truncate text-lg font-black text-slate-950">Satguru AI</span> : null}
        </Link>
        <button className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => setCollapsed((value) => !value)} type="button" aria-label="Toggle sidebar"><Icon name="menu" /></button>
      </div>
      {!collapsed ? <div className="px-3 py-3"><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" /></span><input className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" placeholder="Search modules..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>{quickMatches.length ? <div className="mt-2 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">{quickMatches.map((item) => <Link key={`${item.href}-${item.label}`} className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50" href={item.href}>{item.label}</Link>)}</div> : null}</div> : null}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-2.5 py-3">
        {!collapsed ? <section className="space-y-1.5"><p className="px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Recent</p><div className="grid gap-1">{recentItems.map((item) => <SidebarItem key={item.label} item={item} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />)}</div></section> : null}
        {navGroups.map((group) => <SidebarGroup key={group.title} group={group} collapsed={collapsed} query={query} onNavigate={() => setMobileOpen(false)} />)}
      </div>
      <div className="shrink-0 border-t border-slate-100 p-2.5"><div className={`relative rounded-2xl border border-slate-200 bg-slate-50 p-3 ${collapsed ? 'grid place-items-center' : ''}`}><div className="flex items-center gap-3">{user?.picture ? <img src={user.picture} alt="Profile" className="h-10 w-10 rounded-full object-cover" /> : <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-orange-400">{initials(user?.name, user?.email)}</div>}{!collapsed ? <div className="min-w-0"><p className="truncate text-sm font-black text-slate-950">{user?.name || 'Satguru User'}</p><p className="truncate text-xs font-semibold capitalize text-slate-500">{labelRole(user?.role)} · {user?.branch || 'Pune HO'}</p></div> : null}</div>{!collapsed ? <div className="mt-3 grid grid-cols-2 gap-2"><Link href="/profile" className="rounded-xl bg-white px-3 py-2 text-center text-xs font-black text-slate-700 hover:bg-emerald-50">Profile</Link><Link href="/api/auth/logout" className="rounded-xl bg-white px-3 py-2 text-center text-xs font-black text-slate-700 hover:bg-emerald-50">Logout</Link></div> : null}</div></div>
    </div>
  );

  return <><button className="fixed bottom-5 left-5 z-50 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-700 text-white shadow-xl lg:hidden" onClick={() => setMobileOpen(true)} type="button" aria-label="Open sidebar"><Icon name="menu" /></button><aside className="hidden h-[calc(100vh-72px)] shrink-0 lg:block">{content}</aside>{mobileOpen ? <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm lg:hidden"><div className="h-full w-[248px]">{content}</div><button className="absolute right-4 top-4 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-900" onClick={() => setMobileOpen(false)} type="button">Close</button></div> : null}</>;
}
