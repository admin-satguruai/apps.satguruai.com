import { AdminShell } from '@/components/AppShell';
import { PortalTable } from '@/components/AdminTables';

export default function Page() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-navy">Portals management</h1>
      <div className="mt-6">
        <PortalTable />
      </div>
    </AdminShell>
  );
}
