import { AdminShell } from '@/components/AppShell';
import { DocumentTable } from '@/components/AdminTables';

export default function Page() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-navy">Documents management</h1>
      <div className="mt-6">
        <DocumentTable />
      </div>
    </AdminShell>
  );
}
