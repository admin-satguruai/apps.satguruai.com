import Link from 'next/link';

import { Portal } from '@/types';

const label: Record<Portal['status'], string> = {
  live: 'Live',
  beta: 'Beta',
  maintenance: 'Maintenance',
  coming_soon: 'Coming Soon',
  retired: 'Retired',
  pending_dns: 'In Progress'
};

const statusStyles: Record<Portal['status'], string> = {
  live: 'bg-emerald-100 text-emerald-700',
  beta: 'bg-blue-100 text-blue-700',
  maintenance: 'bg-orange-100 text-orange-700',
  coming_soon: 'bg-sky-100 text-sky-700',
  retired: 'bg-slate-100 text-slate-700',
  pending_dns: 'bg-amber-100 text-amber-700'
};

const linkStatusLabel = {
  live: 'Live',
  pending: 'Pending',
  not_available: 'TBA',
  coming_soon: 'Coming Soon'
};

export function StatusBadge({ status }: { status: Portal['status'] }) {
  return <span className={`badge ${statusStyles[status]}`}>{label[status]}</span>;
}

export function PortalLogoMark({ portal, size = 'large' }: { portal: Portal; size?: 'small' | 'large' }) {
  return (
    <div className={size === 'small' ? 'leading-tight' : 'text-center leading-tight'}>
      <div className={size === 'small' ? 'text-lg font-black tracking-tight' : 'text-4xl font-black tracking-tight'}>
        <span className="text-emerald-700">Satguru</span><span className="text-orange-500">AI</span>
      </div>
      <div className={size === 'small' ? 'mt-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500' : 'mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500'}>
        {portal.businessDomain || portal.category}
      </div>
    </div>
  );
}

function ExternalIcon() {
  return <span aria-hidden="true" className="text-xs">↗</span>;
}

function isOpenable(status?: string) {
  return status === 'live';
}

export function PortalCard({ portal, publicPreview = false }: { portal: Portal; publicPreview?: boolean }) {
  const openUrl = portal.domainUrl || portal.url;
  const canOpenPortal = isOpenable(portal.portalLinkStatus);

  return (
    <article className="card flex h-full flex-col gap-5 rounded-[1.35rem] border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_28px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <PortalLogoMark portal={portal} />
        </div>
        <StatusBadge status={portal.status} />
      </div>

      <div>
        <h3 className="text-xl font-black text-navy">{portal.name}</h3>
        <p className="mt-2 min-h-[48px] text-sm font-medium leading-6 text-slate-600">{portal.shortDescription || 'Summary will be updated soon.'}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="badge bg-slate-100 text-slate-700">{portal.businessDomain || portal.category}</span>
        <span className="badge bg-slate-100 text-slate-700">{portal.department}</span>
      </div>

      <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-xs font-semibold text-slate-600">
        <div className="flex items-center justify-between gap-3"><span>Demo</span><span>{linkStatusLabel[portal.demoLinkStatus || 'not_available']}</span></div>
        <div className="flex items-center justify-between gap-3"><span>Portal</span><span>{linkStatusLabel[portal.portalLinkStatus || 'not_available']}</span></div>
      </div>

      {publicPreview ? (
        <p className="text-xs text-slate-500">Login to view support contacts, documents, FAQs, and portal access actions.</p>
      ) : (
        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <Link className="btn-secondary h-11" href={`/portals/${portal.slug}`}>Details</Link>
          {canOpenPortal ? (
            <a className="btn-primary h-11 gap-2" href={openUrl} target="_blank" rel="noreferrer">Open Portal <ExternalIcon /></a>
          ) : (
            <Link className="btn-primary h-11" href={`/portals/${portal.slug}`}>View Status</Link>
          )}
        </div>
      )}
    </article>
  );
}
