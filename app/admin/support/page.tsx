import { AdminShell } from '@/components/AppShell'; import { SupportTable } from '@/components/AdminTables';
export default function Page(){return <AdminShell><h1 className="text-3xl font-black text-navy">Support management</h1><div className="mt-6"><SupportTable /></div></AdminShell>}
