import { AdminShell } from '@/components/AppShell';
import { MasterColumn, MasterDataTable } from '@/components/MasterDataTable';
import { CountryMasterRecord, countryMasterRecords } from '@/lib/countries';

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

export default function CountriesPage() {
  return (
    <AdminShell>
      <MasterDataTable
        title="Country Master"
        description="Central country reference master for Satguru business lines, branches, reporting, dropdowns, and future access segmentation. Country remains independent and follows the reusable table-first master-module framework."
        createLabel="+ Create Country"
        searchPlaceholder="Search countries by name, ID, ISO code, dialing code, continent, owner, or remarks..."
        columns={columns}
        rows={countryMasterRecords}
        primaryKey="countryName"
        searchKeys={['countryName', 'countryId', 'iso2', 'iso3', 'dialingCode', 'continent', 'subcontinent', 'owner', 'remarks']}
        filters={[
          { key: 'continent', label: 'Continent', options: ['Asia', 'Africa', 'Europe'] },
          { key: 'presenceStatus', label: 'Presence Status', options: ['Yes', 'No'] },
          { key: 'status', label: 'Country Status', options: ['Active', 'Inactive'] }
        ]}
      />
    </AdminShell>
  );
}
