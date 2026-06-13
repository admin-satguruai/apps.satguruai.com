import { DashboardShell } from '@/components/AppShell';
import { PortalCard } from '@/components/PortalCard';
import { categories, portals } from '@/lib/data';

export default function PortalDirectory() {
  return (
    <DashboardShell>
      <h1 className="text-3xl font-black text-navy">Portal directory</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_220px]">
        <input className="input" placeholder="Search registry" />
        <select className="input">
          <option>All categories</option>
          {categories.map((category) => (
            <option key={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {portals.map((portal) => (
          <PortalCard key={portal.id} portal={portal} />
        ))}
      </div>
    </DashboardShell>
  );
}
