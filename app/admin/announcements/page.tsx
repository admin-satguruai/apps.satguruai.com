import { AdminShell } from '@/components/AppShell';
import { announcements } from '@/lib/data';

export default function Announcements() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-navy">Announcements</h1>
      <div className="mt-6 grid gap-4">
        {announcements.map((announcement) => (
          <div className="card" key={announcement.title}>
            <b>{announcement.title}</b>
            <p>{announcement.message}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
