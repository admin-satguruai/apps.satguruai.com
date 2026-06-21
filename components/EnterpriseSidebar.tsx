'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type SidebarUser = { name?: string; email?: string; role?: string; branch?: string; picture?: string; loginMethod?: string };
type NavItem = { label: string; href: string; icon: string; badge?: string; ai?: boolean; children?: NavItem[] };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { title: 'Main', items: [
    { label: 'Dashboard', href: '/dashboard', icon: 'D' },
    { label: 'Portal Directory', href: '/portals', icon: 'P' },
    { label: 'CRM', href: '/crm', icon: 'C' },
    { label: 'Sales', href: '/sales', icon: 'S' },
    { label: 'Operations', href: '/operations', icon: 'O' }
  ] },
  { title: 'Business Modules', items: [
    { label: 'Master Data', href: '/admin/countries', icon: 'M', children: [
      { label: 'Country', href: '/admin/countries', icon: 'C' },
      { label: 'Region', href: '/admin/regions', icon: 'R' },
      { label: 'Branch', href: '/admin/branches', icon: 'B' },
      { label: 'Industry', href: '/admin/industries', icon: 'I' },
      { label: 'Supplier', href: '/admin/suppliers', icon: 'S' },
      { label: 'Currency', href: '/admin/currencies', icon: '$' }
    ] },
    { label: 'CRM Data', href: '/clients', icon: 'C', children: [
      { label: 'Clients', href: '/clients', icon: 'B' },
      { label: 'Contacts', href: '/contacts', icon: 'U' },
      { label: 'Leads', href: '/leads', icon: 'L' },
      { label: 'Activities', href: '/activities', icon: 'A' }
    ] },
    { label: 'Marketing', href: '/campaigns', icon: 'M', children: [
      { label: 'Campaigns', href: '/campaigns', icon: 'C', badge: '12' },
      { label: 'Email', href: '/email', icon: 'E' },
      { label: 'Templates', href: '/templates', icon: 'T' },
      { label: 'Sequences', href: '/sequences', icon: 'S' }
    ] },
    { label: 'Reports', href: '/reports', icon: 'R' },
    { label: 'Analytics', href: '/analytics', icon: 'A' }
  ] },
  { title: 'System', items: [
    { label: 'AI Insights', href: '/ai-insights', icon: 'AI', badge: 'NEW', ai: true },
    { label: 'Users & Roles', href: '/admin/users', icon: 'U' },
    { label: 'Settings', href: '/admin/settings', icon: 'G' },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'L' },
    { label: 'Support', href: '/support', icon: '?' }
  ] }
];

function MenuIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /></svg>;
}

function SearchIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m21 21-4-4M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" strokeLinecap="round" /></svg>;
}

function Chevron({ open }: { open: boolean }) {
  return <span className={`ml-auto text-slate-400 transition ${open ? 'rotate-90' : ''}`}>›</span>;
}

function NavIcon({ value, active }: { value: string; active: boolean }) {
  return <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[11px] font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'}`}>{value}</span>;
}

function Wordmark() {
  return <Link href="/dashboard" className="block px-4 py-4"><span className="text-[28px] font-black leading-none tracking-[-0.05em]"><span className="text-emerald-700">Satguru</span><span className="text-orange-500">AI</span></span></Link>;
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
  const collapsedLabel = item.label.split(' ')[0];
  return <Link href={item.href} title={!expanded ? item.label : undefined} onClick={onNavigate} className={`group relative flex items-center font-semibold transition duration-200 ${expanded ? 'h-10 gap-3 rounded-xl px-3 text-sm' : 'h-[58px] flex-col justify-center gap-1 rounded-2xl px-1 text-[10px]'} ${active ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : item.ai ? 'bg-gradient-to-br from-emerald-700 to-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'} ${level > 0 && expanded ? 'ml-3' : ''}`}>
    {active ? <span className={`absolute left-0 rounded-r-full bg-orange-400 ${expanded ? 'top-2 h-6 w-1' : 'top-3 h-8 w-1'}`} /> : null}
    <NavIcon value={item.icon} active={active || Boolean(item.ai)} />
    {expanded ? <span className="truncate">{item.label}</span> : <span className="w-full truncate text-center leading-3">{collapsedLabel}</span>}
    {expanded && item.badge ? <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white">{item.badge}</span> : null}
  </Link>;
}

function SidebarGroup({ group, expanded, query, onNavigate }: { group: NavGroup; expanded: boolean; query: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const defaultOpen = group.items.some((item) => isActive(pathname, item));
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = group.items.map((item) => {
    if (!normalizedQuery) return item;
    const childMatches = item.children?.filter((child) => child.label.toLowerCase().includes(normalizedQuery));
    if (item.label.toLowerCase().includes(normalizedQuery) || childMatches?.length) return { ...item, children: childMatches || item.children };
    return null;
  }).filter(Boolean) as NavItem[];
  if (!visibleItems.length) return null;

  return <section className={expanded ? 'space-y-1.5' : 'space-y-2'}>
    {expanded ? <p className="px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{group.title}</p> : null}
    <div className={expanded ? 'grid gap-1' : 'grid gap-2'}>
      {visibleItems.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const active = isActive(pathname, item);
        const itemOpen = normalizedQuery ? true : (openGroups[item.label] ?? defaultOpen);
        if (!hasChildren) return <SidebarItem key={item.label} item={item} expanded={expanded} onNavigate={onNavigate} />;
        return <div key={item.label}>
          <button title={!expanded ? item.label : undefined} className={`group relative flex w-full items-center font-semibold transition duration-200 ${expanded ? 'h-10 gap-3 rounded-xl px-3 text-sm' : 'h-[58px] flex-col justify-center gap-1 rounded-2xl px-1 text-[10px]'} ${active ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`} onClick={() => setOpenGroups((current) => ({ ...current, [item.label]: !itemOpen }))} type="button">
            {active ? <span className={`absolute left-0 rounded-r-full bg-orange-400 ${expanded ? 'top-2 h-6 w-1' : 'top-3 h-8 w-1'}`} /> : null}
            <NavIcon value={item.icon} active={active} />
            {expanded ? <span className="truncate">{item.label}</span> : <span className="w-full truncate text-center leading-3">{item.label.split(' ')[0]}</span>}
            {expanded ? <Chevron open={itemOpen} /> : null}
          </button>
          {itemOpen && expanded ? <div className="mt-1 grid gap-1">{item.children?.map((child) => <SidebarItem key={child.label} item={child} expanded={expanded} level={1} onNavigate={onNavigate} />)}</div> : null}
        </div>;
      })}
    </div>
  </section>;
}

export function EnterpriseSidebar({ user }: { user: SidebarUser | null }) {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const allItems = useMemo(() => flatten(navGroups), []);
  const quickMatches = query.trim() ? allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
  const sidebarWidth = expanded ? '248px' : '72px';

  useEffect(() => {
    document.documentElement.style.setProperty('--satguru-sidebar-width', sidebarWidth);
    return () => document.documentElement.style.setProperty('--satguru-sidebar-width', '72px');
  }, [sidebarWidth]);

  const content = <div className={`flex h-full flex-col border-r border-slate-200 bg-white shadow-[0_0_25px_rgba(15,23,42,0.06)] transition-all duration-300 ${expanded ? 'w-[248px]' : 'w-[72px]'}`}>
    <div className={`flex h-[64px] shrink-0 items-center border-b border-slate-100 px-3 ${expanded ? 'justify-start' : 'justify-center'}`}>
      <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-800 transition hover:bg-slate-100 hover:text-emerald-700" onClick={() => setExpanded((value) => !value)} type="button" aria-label="Toggle sidebar"><MenuIcon /></button>
    </div>
    {expanded ? <Wordmark /> : null}
    {expanded ? <div className="px-3 pb-3"><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span><input className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" placeholder="Search modules..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>{quickMatches.length ? <div className="mt-2 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">{quickMatches.map((item) => <Link key={`${item.href}-${item.label}`} className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50" href={item.href}>{item.label}</Link>)}</div> : null}</div> : null}
    <div className={`min-h-0 flex-1 overflow-y-auto ${expanded ? 'space-y-4 px-2.5 py-3' : 'space-y-3 px-2 py-3'}`}>{navGroups.map((group) => <SidebarGroup key={group.title} group={group} expanded={expanded} query={query} onNavigate={() => setMobileOpen(false)} />)}</div>
  </div>;

  return <><button className="fixed bottom-5 left-5 z-50 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-700 text-white shadow-xl lg:hidden" onClick={() => setMobileOpen(true)} type="button" aria-label="Open sidebar"><MenuIcon /></button><aside className="fixed left-0 top-0 z-[60] hidden h-screen shrink-0 lg:block">{content}</aside>{mobileOpen ? <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm lg:hidden"><div className="h-full w-[248px]">{content}</div><button className="absolute right-4 top-4 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-900" onClick={() => setMobileOpen(false)} type="button">Close</button></div> : null}</>;
}
