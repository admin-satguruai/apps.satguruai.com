import Link from 'next/link';

import { Portal } from '@/types';

const label: Record<Portal['status'], string> = {
  live: 'Live',
  beta: 'Beta',
  maintenance: 'Maintenance',
  coming_soon: 'Coming soon',
  retired: 'Retired',
  pending_dns: 'Pending DNS',
};

export function StatusBadge({ status }: { status: Portal['status'] }) {
  const styles =
    status === 'live'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'pending_dns'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-700';

  return <span className={`badge ${styles}`}>{label[status]}</span>;
}

export function PortalCard({
  portal,
  publicPreview = false,
}: {
  portal: Portal;
  publicPreview?: boolean;
}) {
  return (
    <article className="card flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky font-bold text-navy">
          {portal.name.slice(0, 2).toUpperCase()}
        </div>
        <StatusBadge status={portal.status} />
      </div>

      <div>
        <h3 className="text-lg font-bold text-navy">{portal.name}</h3>
        <p className="mt-2 text-sm text-slate-600">{portal.shortDescription}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="badge bg-slate-100">{portal.category}</span>
        <span className="badge bg-slate-100">{portal.department}</span>
      </div>

      {publicPreview ? (
        <p className="text-xs text-slate-500">
          Login to view support contacts, documents, FAQs, and portal access actions.
        </p>
      ) : (
        <div className="flex gap-2">
          <Link className="btn-primary flex-1 py-2" href={`/portals/${portal.slug}`}>
            Details
          </Link>
          <a className="btn-secondary flex-1 py-2" href={portal.url}>
            Open
          </a>
        </div>
      )}
    </article>
  );
}
