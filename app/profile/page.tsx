import { DashboardShell } from '@/components/AppShell';
import { users } from '@/lib/data';

export default function Profile() {
  const user = users[0];

  return (
    <DashboardShell>
      <div className="card">
        <h1 className="text-3xl font-black text-navy">Profile</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="input" defaultValue={user.name} />
          <input className="input" defaultValue={user.email} />
          <input className="input" defaultValue={user.department} />
          <input className="input" defaultValue={user.branch} />
        </div>
      </div>
    </DashboardShell>
  );
}
