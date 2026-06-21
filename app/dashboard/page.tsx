import { DashboardShell } from '@/components/AppShell';

const focusItems = [
  {
    title: 'Find the right portal',
    description: 'Use the portal directory to identify the correct Satguru application, owner, status, and support path.'
  },
  {
    title: 'Understand access rules',
    description: 'Apps.SatguruAI is designed for approved-domain users and governed access to internal tools.'
  },
  {
    title: 'Prepare for connected login',
    description: 'Current tools remain separate while the platform is kept ready for future SSO and AI-assisted discovery.'
  }
];

const nextActions = [
  'Open Portal Directory to browse available applications.',
  'Check Support when access or ownership details are unclear.',
  'Use Admin areas to maintain portal, user, and master-data governance.'
];

export default function Dashboard() {
  return (
    <DashboardShell>
      <div className="grid gap-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-7 shadow-sm shadow-slate-900/5 lg:p-9">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-100/70" />
          <div className="absolute bottom-0 right-14 h-28 w-28 rounded-full bg-orange-100/70" />
          <div className="relative max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">app.satguruai.com</p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
              Home for Satguru internal applications.
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-slate-600">
              This page is the first landing point after login. It should help users quickly understand what this platform is for, where to go next, and how Satguru applications are governed.
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {focusItems.map((item, index) => (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5" key={item.title}>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-700">
                {index + 1}
              </div>
              <h2 className="mt-4 text-lg font-black text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <h2 className="text-xl font-black text-slate-950">What should happen from Home?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Home should not duplicate the full portal listing. It should act as a clear orientation page with platform purpose, current capability, and next actions.
            </p>
            <div className="mt-5 grid gap-3">
              {nextActions.map((action) => (
                <div className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold text-slate-700" key={action}>
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-700 text-[10px] text-white">✓</span>
                  {action}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-6 shadow-sm shadow-slate-900/5">
            <h2 className="text-xl font-black text-slate-950">Current platform status</h2>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-orange-100">
                <p className="font-black text-slate-950">MVP foundation</p>
                <p className="mt-1 text-slate-600">Central login, portal navigation, support flow, and admin-ready structure are in place.</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-emerald-100">
                <p className="font-black text-slate-950">Next phase ready</p>
                <p className="mt-1 text-slate-600">SSO, deeper app integrations, and AI-assisted portal discovery can be added later.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
