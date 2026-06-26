import { DashboardShell } from '@/components/AppShell';
import { users } from '@/lib/data';

export default function Profile() {
  const user = users[0];

  return (
    <DashboardShell>
      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-navy">Profile</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">Manage your workspace profile and account access.</p>
          </div>
          <a className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-black text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-100 hover:text-red-700" href="/api/auth/logout" aria-label="Logout from Satguru AI">
            Logout
          </a>
        </div>
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