import { AdminShell } from '@/components/AppShell';
import { UserTable } from '@/components/AdminTables';

export default function Page() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-navy">Users management</h1>
      <div className="mt-6">
        <UserTable />
      </div>
    </AdminShell>
  );
}
