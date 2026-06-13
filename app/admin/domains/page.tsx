import { AdminShell } from '@/components/AppShell'; import { DomainTable } from '@/components/AdminTables';
export default function Page(){return <AdminShell><h1 className="text-3xl font-black text-navy">Domains management</h1><div className="mt-6"><DomainTable /></div></AdminShell>}
