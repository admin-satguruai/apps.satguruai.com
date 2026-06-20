export type CountryMasterRecord = {
  id: string;
  countryId: string;
  countryName: string;
  iso2: string;
  iso3: string;
  dialingCode: string;
  continent: string;
  subcontinent: string;
  presenceStatus: 'Yes' | 'No';
  timeZones: string;
  status: 'Active' | 'Inactive';
  owner: string;
  createdBy: string;
  lastModifiedBy: string;
  remarks: string;
};

export const countryMasterRecords: CountryMasterRecord[] = [
  {
    id: 'country-india',
    countryId: 'CN-001',
    countryName: 'India',
    iso2: 'IN',
    iso3: 'IND',
    dialingCode: '+91',
    continent: 'Asia',
    subcontinent: 'South Asia',
    presenceStatus: 'Yes',
    timeZones: 'Asia/Kolkata',
    status: 'Active',
    owner: 'admin@satguruai.com',
    createdBy: 'admin@satguruai.com',
    lastModifiedBy: 'admin@satguruai.com',
    remarks: 'Satguru central support and shared services presence.'
  },
  {
    id: 'country-uae',
    countryId: 'CN-002',
    countryName: 'United Arab Emirates',
    iso2: 'AE',
    iso3: 'ARE',
    dialingCode: '+971',
    continent: 'Asia',
    subcontinent: 'Western Asia',
    presenceStatus: 'Yes',
    timeZones: 'Asia/Dubai',
    status: 'Active',
    owner: 'admin@satguruai.com',
    createdBy: 'admin@satguruai.com',
    lastModifiedBy: 'admin@satguruai.com',
    remarks: 'Used for UAE operations and regional references.'
  },
  {
    id: 'country-south-africa',
    countryId: 'CN-003',
    countryName: 'South Africa',
    iso2: 'ZA',
    iso3: 'ZAF',
    dialingCode: '+27',
    continent: 'Africa',
    subcontinent: 'Southern Africa',
    presenceStatus: 'Yes',
    timeZones: 'Africa/Johannesburg',
    status: 'Active',
    owner: 'admin@satguruai.com',
    createdBy: 'admin@satguruai.com',
    lastModifiedBy: 'admin@satguruai.com',
    remarks: 'Presence country for Southern Africa structure.'
  },
  {
    id: 'country-kenya',
    countryId: 'CN-004',
    countryName: 'Kenya',
    iso2: 'KE',
    iso3: 'KEN',
    dialingCode: '+254',
    continent: 'Africa',
    subcontinent: 'East Africa',
    presenceStatus: 'Yes',
    timeZones: 'Africa/Nairobi',
    status: 'Active',
    owner: 'admin@satguruai.com',
    createdBy: 'admin@satguruai.com',
    lastModifiedBy: 'admin@satguruai.com',
    remarks: 'Presence country for East Africa operations.'
  },
  {
    id: 'country-nigeria',
    countryId: 'CN-005',
    countryName: 'Nigeria',
    iso2: 'NG',
    iso3: 'NGA',
    dialingCode: '+234',
    continent: 'Africa',
    subcontinent: 'West Africa',
    presenceStatus: 'Yes',
    timeZones: 'Africa/Lagos',
    status: 'Active',
    owner: 'admin@satguruai.com',
    createdBy: 'admin@satguruai.com',
    lastModifiedBy: 'admin@satguruai.com',
    remarks: 'Presence country for West Africa operations.'
  },
  {
    id: 'country-united-kingdom',
    countryId: 'CN-006',
    countryName: 'United Kingdom',
    iso2: 'GB',
    iso3: 'GBR',
    dialingCode: '+44',
    continent: 'Europe',
    subcontinent: 'Northern Europe',
    presenceStatus: 'No',
    timeZones: 'Europe/London',
    status: 'Active',
    owner: 'admin@satguruai.com',
    createdBy: 'admin@satguruai.com',
    lastModifiedBy: 'admin@satguruai.com',
    remarks: 'Reference country for education, travel, and reporting use cases.'
  }
];

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ''), serviceRoleKey };
}

function normalizeCountry(row: Record<string, unknown>): CountryMasterRecord {
  return {
    id: String(row.id || row.country_id || row.countryId || crypto.randomUUID()),
    countryId: String(row.country_id || row.countryId || 'CN-000'),
    countryName: String(row.country_name || row.countryName || ''),
    iso2: String(row.iso_code_2 || row.iso2 || '').toUpperCase(),
    iso3: String(row.iso_code_3 || row.iso3 || '').toUpperCase(),
    dialingCode: String(row.dialing_code || row.dialingCode || ''),
    continent: String(row.continent || ''),
    subcontinent: String(row.subcontinent || ''),
    presenceStatus: String(row.presence_status || row.presenceStatus || 'No').toLowerCase() === 'yes' ? 'Yes' : 'No',
    timeZones: String(row.time_zones || row.timeZones || ''),
    status: String(row.status || 'Active').toLowerCase() === 'inactive' ? 'Inactive' : 'Active',
    owner: String(row.owner_name || row.owner || 'admin@satguruai.com'),
    createdBy: String(row.created_by || row.createdBy || 'System'),
    lastModifiedBy: String(row.modified_by || row.lastModifiedBy || row.created_by || 'System'),
    remarks: String(row.remarks || '')
  };
}

export async function listCountryMasterRecords(): Promise<CountryMasterRecord[]> {
  const config = getSupabaseConfig();

  if (!config) {
    return countryMasterRecords;
  }

  const response = await fetch(`${config.url}/rest/v1/countries?select=*&order=modified_at.desc`, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    return countryMasterRecords;
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    return countryMasterRecords;
  }

  return data.map(normalizeCountry);
}
