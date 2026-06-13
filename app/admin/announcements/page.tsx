import { AdminShell } from '@/components/AppShell'; import { announcements } from '@/lib/data';
export default function Announcements(){return <AdminShell><h1 className="text-3xl font-black text-navy">Announcements</h1><div className="mt-6 grid gap-4">{announcements.map(a=><div className="card" key={a.title}><b>{a.title}</b><p>{a.message}</p></div>)}</div></AdminShell>}
