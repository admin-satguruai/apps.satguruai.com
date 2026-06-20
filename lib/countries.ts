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
