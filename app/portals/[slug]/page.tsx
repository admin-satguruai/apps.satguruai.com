import { notFound } from 'next/navigation';

import { DashboardShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/PortalCard';
import { getPortal, portals } from '@/lib/data';

export function generateStaticParams() {
  return portals.map((portal) => ({ slug: portal.slug }));
}

export default function PortalDetail({ params }: { params: { slug: string } }) {
  const portal = getPortal(params.slug);

  if (!portal) {
    notFound();
  }

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-navy">{portal.name}</h1>
              <p className="mt-3 text-slate-600">{portal.fullDescription}</p>
            </div>
            <StatusBadge status={portal.status} />
          </div>
          <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
            <p><b>Category:</b> {portal.category}</p>
            <p><b>Department:</b> {portal.department}</p>
            <p><b>Owner:</b> {portal.owner}</p>
            <p><b>Support:</b> {portal.supportEmail}</p>
          </div>
          <a href={portal.url} className="btn-primary mt-6">
            Open portal
          </a>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-navy">Documentation</h2>
          {portal.documents.map((document) => (
            <div className="mt-3 rounded-xl bg-slate-50 p-4" key={document.id}>
              {document.title} · {document.type} · v{document.version}
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-navy">FAQs</h2>
          {portal.faqs.map((faq) => (
            <details className="mt-3 rounded-xl bg-slate-50 p-4" key={faq.id}>
              <summary className="font-semibold">{faq.question}</summary>
              <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
