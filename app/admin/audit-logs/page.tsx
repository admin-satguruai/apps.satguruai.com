import { AdminShell } from '@/components/AppShell';
import { AuditLogTable } from '@/components/AdminTables';

export default function AdminAuditLogs() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-navy">Audit logs</h1>
      <p className="mt-2 text-slate-600">Read-only audit trail placeholder for important admin and support actions.</p>
      <div className="mt-6">
        <AuditLogTable />
      </div>
    </AdminShell>
  );
}
