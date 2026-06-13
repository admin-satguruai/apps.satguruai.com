import { DashboardShell } from '@/components/AppShell';
import { PortalCard } from '@/components/PortalCard';
import { portals } from '@/lib/data';

export default function Favorites() {
  return (
    <DashboardShell>
      <h1 className="text-3xl font-black text-navy">Favorites</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {portals.slice(0, 3).map((portal) => (
          <PortalCard key={portal.id} portal={portal} />
        ))}
      </div>
    </DashboardShell>
  );
}
