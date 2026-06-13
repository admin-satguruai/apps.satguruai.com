import { AdminShell } from '@/components/AppShell'; import { AdminStats } from '@/components/AdminTables';
export default function Admin(){return <AdminShell><h1 className="text-3xl font-black text-navy">Admin dashboard</h1><p className="mt-2 text-slate-600">Operational overview for governed portal registry and user onboarding.</p><div className="mt-6"><AdminStats/></div></AdminShell>}
