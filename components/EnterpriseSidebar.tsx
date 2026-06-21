'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type SidebarUser = { name?: string; email?: string; role?: string; branch?: string; picture?: string; loginMethod?: string };
type IconName =
  | 'dashboard'
  | 'portal'
  | 'crm'
  | 'sales'
  | 'operations'
  | 'master'
  | 'country'
  | 'region'
  | 'branch'
  | 'industry'
  | 'supplier'
  | 'currency'
  | 'clients'
  | 'contacts'
  | 'leads'
  | 'activities'
  | 'marketing'
  | 'campaigns'
  | 'email'
  | 'templates'
  | 'sequences'
  | 'reports'
  | 'analytics'
  | 'ai'
  | 'users'
  | 'settings'
  | 'audit'
  | 'support';
type NavItem = { label: string; href: string; icon: IconName; badge?: string; ai?: boolean; children?: NavItem[] };
type NavGroup = { title: string; items: NavItem[] };

const EXPANDED_WIDTH = '220px';
const COLLAPSED_WIDTH = '72px';

const navGroups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
      { label: 'Portal Directory', href: '/portals', icon: 'portal' },
      { label: 'CRM', href: '/crm', icon: 'crm' },
      { label: 'Sales', href: '/sales', icon: 'sales' },
      { label: 'Operations', href: '/operations', icon: 'operations' }
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
          { label: 'Email', href: '/email', icon: 'email' },
          { label: 'Templates', href: '/templates', icon: 'templates' },
          { label: 'Sequences', href: '/sequences', icon: 'sequences' }
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

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="m21 21-4-4M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return <span className={`ml-auto text-slate-400 transition ${open ? 'rotate-90' : ''}`}>›</span>;
}

function Wordmark() {
  return (
    <Link href="/dashboard" className="min-w-0 truncate text-[25px] font-black leading-none tracking-[-0.06em]">
      <span className="text-emerald-700">Satguru</span>
      <span className="text-orange-500">AI</span>
    </Link>
  );
}

function ModuleGlyph({ name }: { name: IconName }) {
  const common = 'h-4 w-4';

  switch (name) {
    case 'dashboard':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z" strokeLinejoin="round" /></svg>;
    case 'portal':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6h16v12H4z" /><path d="M8 10h8M8 14h5" strokeLinecap="round" /></svg>;
    case 'crm':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M21 20v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case 'sales':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 19V5" strokeLinecap="round" /><path d="m4 19 6-6 4 4 6-9" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8h4v4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'operations':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.26.43.6.77 1 1 .33.2.7.3 1.1.3H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.7Z" /></svg>;
    case 'master':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /><path d="M8 4v4M16 10v4M11 16v4" strokeLinecap="round" /></svg>;
    case 'country':
    case 'region':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9S14.5 18.4 12 21M12 3C9.5 5.6 8.3 8.6 8.3 12S9.5 18.4 12 21" /></svg>;
    case 'branch':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 21V4h12v17" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" strokeLinecap="round" /></svg>;
    case 'industry':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V9l5 3V9l5 3V5h4v16" strokeLinejoin="round" /></svg>;
    case 'supplier':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 7h11v10H3zM14 11h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.5" /><circle cx="18" cy="18" r="1.5" /></svg>;
    case 'currency':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M17 7.5C15.7 6.6 14 6 12.2 6 9.9 6 8 7.1 8 9c0 4 8 2 8 6 0 1.9-1.9 3-4.2 3-1.8 0-3.6-.6-4.8-1.5" strokeLinecap="round" /></svg>;
    case 'clients':
    case 'contacts':
    case 'users':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></svg>;
    case 'leads':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-4.4 7-11A7 7 0 1 0 5 10c0 6.6 7 11 7 11Z" /><circle cx="12" cy="10" r="2" /></svg>;
    case 'activities':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 8-6-16-3 8H2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'marketing':
    case 'campaigns':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 13v-2l12-5v12L4 13Z" /><path d="M4 13l2 6h3l-1.5-5" strokeLinejoin="round" /><path d="M18 9a3 3 0 0 1 0 6" /></svg>;
    case 'email':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>;
    case 'templates':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 3h9l3 3v15H6z" /><path d="M14 3v4h4M8 12h8M8 16h6" /></svg>;
    case 'sequences':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7 7h10M7 12h10M7 17h10" strokeLinecap="round" /><circle cx="4" cy="7" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="17" r="1" /></svg>;
    case 'reports':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 3h14v18H5z" /><path d="M8 15h2v3H8zM11 11h2v7h-2zM14 13h2v5h-2zM8 7h8" /></svg>;
    case 'analytics':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 19V5M4 19h16" strokeLinecap="round" /><path d="M8 16v-4M12 16V8M16 16v-6" strokeLinecap="round" /></svg>;
    case 'ai':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.4 4.3L18 9l-4.6 1.7L12 15l-1.4-4.3L6 9l4.6-1.7L12 3ZM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" strokeLinejoin="round" /></svg>;
    case 'settings':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.18.6.6 1.05 1.2 1.2.26.07.53.1.8.1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51.7Z" /></svg>;
    case 'audit':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 3h12v18H6z" /><path d="M9 8h6M9 12h6M9 16h3" strokeLinecap="round" /></svg>;
    case 'support':
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.8 2.8 0 0 1 5.2 1.4c0 1.9-2.2 2.4-2.7 3.8M12 18h.01" strokeLinecap="round" /></svg>;
  }
}

function NavIcon({ icon, active }: { icon: IconName; active: boolean }) {
  return (
    <span
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition ${
        active
          ? 'bg-white/20 text-white'
          : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
      }`}
    >
      <ModuleGlyph name={icon} />
    </span>
  );
}

function isActive(pathname: string, item: NavItem) {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return Boolean(item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`)));
}

function flatten(groups: NavGroup[]) {
  return groups.flatMap((group) => group.items.flatMap((item) => [item, ...(item.children || [])]));
}

function SidebarItem({ item, expanded, level = 0, onNavigate }: { item: NavItem; expanded: boolean; level?: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      title={!expanded ? item.label : undefined}
      onClick={onNavigate}
      className={`group relative flex items-center font-semibold transition duration-200 ${
        expanded ? 'h-10 gap-3 rounded-xl px-3 text-sm' : 'h-[54px] justify-center rounded-2xl px-1'
      } ${
        active
          ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
          : item.ai
            ? 'bg-gradient-to-br from-emerald-700 to-orange-500 text-white shadow-sm'
            : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
      } ${level > 0 && expanded ? 'ml-3' : ''}`}
    >
      {active ? <span className={`absolute left-0 rounded-r-full bg-orange-400 ${expanded ? 'top-2 h-6 w-1' : 'top-3 h-8 w-1'}`} /> : null}
      <NavIcon icon={item.icon} active={active || Boolean(item.ai)} />
      {expanded ? <span className="truncate">{item.label}</span> : null}
      {expanded && item.badge ? <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white">{item.badge}</span> : null}
    </Link>
  );
}

function SidebarGroup({ group, expanded, query, onNavigate, onExpand }: { group: NavGroup; expanded: boolean; query: string; onNavigate?: () => void; onExpand?: () => void }) {
  const pathname = usePathname();
  const defaultOpen = group.items.some((item) => isActive(pathname, item));
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = group.items
    .map((item) => {
      if (!normalizedQuery) return item;
      const childMatches = item.children?.filter((child) => child.label.toLowerCase().includes(normalizedQuery));
      if (item.label.toLowerCase().includes(normalizedQuery) || childMatches?.length) return { ...item, children: childMatches || item.children };
      return null;
    })
    .filter(Boolean) as NavItem[];

  if (!visibleItems.length) return null;

  return (
    <section className={expanded ? 'space-y-1.5' : 'space-y-2'}>
      {expanded ? <p className="px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{group.title}</p> : null}
      <div className={expanded ? 'grid gap-1' : 'grid gap-2'}>
        {visibleItems.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const active = isActive(pathname, item);
          const itemOpen = normalizedQuery ? true : (openGroups[item.label] ?? defaultOpen);

          if (!hasChildren) return <SidebarItem key={item.label} item={item} expanded={expanded} onNavigate={onNavigate} />;

          return (
            <div key={item.label}>
              <button
                title={!expanded ? item.label : undefined}
                className={`group relative flex w-full items-center font-semibold transition duration-200 ${
                  expanded ? 'h-10 gap-3 rounded-xl px-3 text-sm' : 'h-[54px] justify-center rounded-2xl px-1'
                } ${active ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                onClick={() => {
                  if (!expanded) {
                    onExpand?.();
                    return;
                  }
                  setOpenGroups((current) => ({ ...current, [item.label]: !itemOpen }));
                }}
                type="button"
              >
                {active ? <span className={`absolute left-0 rounded-r-full bg-orange-400 ${expanded ? 'top-2 h-6 w-1' : 'top-3 h-8 w-1'}`} /> : null}
                <NavIcon icon={item.icon} active={active} />
                {expanded ? <span className="truncate">{item.label}</span> : null}
                {expanded ? <Chevron open={itemOpen} /> : null}
              </button>
              {itemOpen && expanded ? (
                <div className="mt-1 grid gap-1">
                  {item.children?.map((child) => <SidebarItem key={child.label} item={child} expanded={expanded} level={1} onNavigate={onNavigate} />)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function EnterpriseSidebar({ user }: { user: SidebarUser | null }) {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const allItems = useMemo(() => flatten(navGroups), []);
  const quickMatches = query.trim() ? allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
  const sidebarWidth = COLLAPSED_WIDTH;

  useEffect(() => {
    document.documentElement.style.setProperty('--satguru-sidebar-width', sidebarWidth);
    return () => document.documentElement.style.setProperty('--satguru-sidebar-width', COLLAPSED_WIDTH);
  }, [sidebarWidth]);

  const closeAfterNavigation = () => {
    setExpanded(false);
    setMobileOpen(false);
  };

  const content = (
    <div
      className={`flex h-full flex-col border-r border-slate-200 bg-white shadow-[0_0_30px_rgba(15,23,42,0.08)] transition-all duration-300 ${
        expanded ? 'w-[220px]' : 'w-[72px]'
      }`}
    >
      <div className={`flex h-[64px] shrink-0 items-center border-b border-slate-100 px-3 ${expanded ? 'justify-between gap-3' : 'justify-center'}`}>
        {expanded ? <Wordmark /> : null}
        <button
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-800 transition hover:bg-slate-100 hover:text-emerald-700"
          onClick={() => setExpanded((value) => !value)}
          type="button"
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
      </div>

      {expanded ? (
        <div className="px-3 py-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
            <input
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              placeholder="Search modules..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {quickMatches.length ? (
            <div className="mt-2 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
              {quickMatches.map((item) => (
                <Link key={`${item.href}-${item.label}`} className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50" href={item.href} onClick={closeAfterNavigation}>
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={`min-h-0 flex-1 overflow-y-auto ${expanded ? 'space-y-4 px-2.5 py-3' : 'space-y-3 px-2 py-3'}`}>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title} group={group} expanded={expanded} query={query} onNavigate={closeAfterNavigation} onExpand={() => setExpanded(true)} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <button
        className="fixed bottom-5 left-5 z-50 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-700 text-white shadow-xl lg:hidden"
        onClick={() => setMobileOpen(true)}
        type="button"
        aria-label="Open sidebar"
      >
        <MenuIcon />
      </button>

      {expanded ? <button className="fixed inset-0 left-[72px] z-[55] hidden bg-slate-950/10 backdrop-blur-[1px] lg:block" aria-label="Close sidebar overlay" onClick={() => setExpanded(false)} type="button" /> : null}

      <aside className="fixed left-0 top-0 z-[60] hidden h-screen shrink-0 lg:block">{content}</aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm lg:hidden">
          <div className="h-full w-[220px]">{content}</div>
          <button className="absolute right-4 top-4 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-900" onClick={() => setMobileOpen(false)} type="button">
            Close
          </button>
        </div>
      ) : null}
    </>
  );
}
