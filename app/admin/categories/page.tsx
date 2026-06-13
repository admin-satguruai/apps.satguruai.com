import { AdminShell } from '@/components/AppShell'; import { CategoryTable } from '@/components/AdminTables';
export default function Page(){return <AdminShell><h1 className="text-3xl font-black text-navy">Categories management</h1><div className="mt-6"><CategoryTable /></div></AdminShell>}
