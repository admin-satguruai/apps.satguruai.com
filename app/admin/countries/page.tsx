import Link from 'next/link';

import { AdminShell } from '@/components/AppShell';
import { MasterColumn, MasterDataTable } from '@/components/MasterDataTable';
import { CountryMasterRecord, listCountryMasterRecords } from '@/lib/countries';

const columns: MasterColumn<CountryMasterRecord>[] = [
  { key: 'countryName', label: 'Country Name', locked: true },
  { key: 'countryId', label: 'Country ID', locked: true },
  { key: 'iso2', label: 'ISO-2' },
  { key: 'iso3', label: 'ISO-3' },
  { key: 'dialingCode', label: 'Dialing Code' },
  { key: 'continent', label: 'Continent' },
  { key: 'subcontinent', label: 'Subcontinent' },
  { key: 'presenceStatus', label: 'Presence' },
  { key: 'timeZones', label: 'Time Zones', defaultVisible: false },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner', defaultVisible: false },
  { key: 'createdBy', label: 'Created By' },
  { key: 'lastModifiedBy', label: 'Last Modified By' },
  { key: 'remarks', label: 'Remarks', defaultVisible: false }
];

type CountryView = 'home' | 'dashboard';

function CountryModuleHeader({ view }: { view: CountryView }) {
  const items = [
    { label: 'Administration', href: '/admin' },
    { label: 'Master Data', href: '/admin/countries' },
    { label: 'Country', href: '/admin/countries' },
    { label: 'Country Module', href: '/admin/countries' },
    { label: view === 'dashboard' ? 'Dashboard' : 'Home', href: view === 'dashboard' ? '/admin/countries?view=dashboard' : '/admin/countries' }
  ];

  const tabClass = (active: boolean) => active
    ? 'rounded-t-2xl border border-b-0 border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-700 shadow-sm'
    : 'rounded-t-2xl border border-b-0 border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm hover:bg-slate-50';

  return (
    <section className="space-y-4">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-black text-slate-400" aria-label="Country module breadcrumb">
        {items.map((item, index) => (
          <span className="flex items-center gap-2" key={`${item.label}-${index}`}>
            <Link className={index === items.length - 1 ? 'text-emerald-700 hover:underline' : 'hover:text-emerald-700 hover:underline'} href={item.href}>
              {item.label}
            </Link>
            {index < items.length - 1 ? <span className="text-slate-300">&gt;</span> : null}
          </span>
        ))}
      </nav>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        <Link className={tabClass(view === 'dashboard')} href="/admin/countries?view=dashboard">
          Country Dashboard
        </Link>
        <Link className={tabClass(view === 'home')} href="/admin/countries">
          Country Home
        </Link>
      </div>
    </section>
  );
}

function DashboardCards({ countries }: { countries: CountryMasterRecord[] }) {
  const activeCount = countries.filter((country) => country.status === 'Active').length;
  const inactiveCount = countries.filter((country) => country.status === 'Inactive').length;
  const continentCount = new Set(countries.map((country) => country.continent).filter(Boolean)).size;
  const subcontinentCount = new Set(countries.map((country) => country.subcontinent).filter(Boolean)).size;
  const cards = [
    ['Total Countries', countries.length, 'bg-emerald-50 text-emerald-700'],
    ['Active Countries', activeCount, 'bg-teal-50 text-teal-700'],
    ['Inactive Countries', inactiveCount, 'bg-orange-50 text-orange-700'],
    ['Continents', continentCount, 'bg-blue-50 text-blue-700'],
    ['Subcontinents', subcontinentCount, 'bg-violet-50 text-violet-700']
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, value, tone]) => (
        <div className="card card-hover flex items-center gap-4" key={String(label)}>
          <div className={`grid h-14 w-14 place-items-center rounded-2xl ${tone as string}`}>
            <span className="h-3 w-3 rounded-full bg-current" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SidePanel({ countries }: { countries: CountryMasterRecord[] }) {
  const inactiveCountries = countries.filter((country) => country.status === 'Inactive');
  const missingPresence = countries.filter((country) => country.presenceStatus === 'No');
  const recentlyUpdated = countries.slice(0, 4);

  return (
    <div className="grid gap-5 xl:grid-cols-4">
      <section className="card card-hover border-emerald-100 bg-gradient-to-br from-white to-emerald-50/60 xl:col-span-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black text-slate-950">AI Insights</h3>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">New</span>
        </div>
        <div className="mt-5 rounded-2xl border border-emerald-100 bg-white/80 p-4">
          <p className="text-sm font-bold text-slate-700">
            {inactiveCountries.length > 0
              ? `You have ${inactiveCountries.length} inactive country records. Review them to maintain clean master data.`
              : 'Country master is active and ready for downstream modules.'}
          </p>
          <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
            Use inactive status instead of deletion so historical branch, user, and reporting references remain safe.
          </p>
        </div>
      </section>

      <section className="card card-hover xl:col-span-1">
        <h3 className="text-lg font-black text-slate-950">Quick Actions</h3>
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-800">Import Countries</p>
            <p className="mt-1 text-xs text-slate-500">Bulk upload placeholder for future phase.</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-800">Download Template</p>
            <p className="mt-1 text-xs text-slate-500">Standard template action area.</p>
          </div>
        </div>
      </section>

      <section className="card card-hover xl:col-span-1">
        <h3 className="text-lg font-black text-slate-950">Governance Health</h3>
        <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
          <div className="flex justify-between"><span>Non-presence records</span><b className="text-orange-600">{missingPresence.length}</b></div>
          <div className="flex justify-between"><span>Inactive records</span><b className="text-slate-900">{inactiveCountries.length}</b></div>
          <div className="flex justify-between"><span>Owner mapped</span><b className="text-emerald-700">{countries.filter((country) => country.owner).length}</b></div>
        </div>
      </section>

      <section className="card card-hover xl:col-span-1">
        <h3 className="text-lg font-black text-slate-950">Recently Updated</h3>
        <div className="mt-4 space-y-3">
          {recentlyUpdated.map((country) => (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3" key={country.id}>
              <div>
                <p className="text-sm font-black text-slate-900">{country.countryName}</p>
                <p className="text-xs text-slate-500">{country.iso2} · {country.continent}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">{country.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function CountriesPage({ searchParams }: { searchParams?: { view?: string } }) {
  const countries = await listCountryMasterRecords();
  const continents = Array.from(new Set(countries.map((country) => country.continent).filter(Boolean))).sort();
  const view: CountryView = searchParams?.view === 'dashboard' ? 'dashboard' : 'home';

  return (
    <AdminShell>
      <div className="space-y-5">
        <CountryModuleHeader view={view} />
        {view === 'dashboard' ? (
          <div className="space-y-5">
            <DashboardCards countries={countries} />
            <SidePanel countries={countries} />
          </div>
        ) : (
          <div className="country-master-home country-master-table-only">
            <MasterDataTable
              title="Country Master"
              description="Manage all countries used across Satguru AI for branches, reporting, access segmentation, dropdowns, and future enterprise master-data governance. Country remains an independent global reference master."
              createLabel="+ Create Country"
              searchPlaceholder="Search countries, ISO code, dialing code, continent, owner, or remarks..."
              columns={columns}
              rows={countries}
              primaryKey="countryName"
              searchKeys={['countryName', 'countryId', 'iso2', 'iso3', 'dialingCode', 'continent', 'subcontinent', 'owner', 'remarks']}
              filters={[
                { key: 'continent', label: 'Continent', options: continents.length ? continents : ['Asia', 'Africa', 'Europe'] },
                { key: 'presenceStatus', label: 'Presence Status', options: ['Yes', 'No'] },
                { key: 'status', label: 'Country Status', options: ['Active', 'Inactive'] }
              ]}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
