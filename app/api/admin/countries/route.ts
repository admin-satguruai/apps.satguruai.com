import { NextResponse } from 'next/server';
import { CountryMasterRecord, listCountryMasterRecords } from '@/lib/countries';

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url: url.replace(/\/$/, ''), serviceRoleKey };
}

function toSupabasePayload(record: CountryMasterRecord) {
  return {
    id: record.id,
    country_id: record.countryId,
    country_name: record.countryName,
    iso_code_2: record.iso2,
    iso_code_3: record.iso3,
    dialing_code: record.dialingCode,
    continent: record.continent,
    subcontinent: record.subcontinent,
    presence_status: record.presenceStatus,
    time_zones: record.timeZones,
    status: record.status,
    owner_name: record.owner,
    created_by: record.createdBy,
    modified_by: record.lastModifiedBy,
    remarks: record.remarks,
    modified_at: new Date().toISOString()
  };
}

export async function GET() {
  const rows = await listCountryMasterRecords();
  return NextResponse.json({ ok: true, rows });
}

export async function POST(request: Request) {
  const record = (await request.json()) as CountryMasterRecord;
  const config = getSupabaseConfig();

  if (!config) {
    return NextResponse.json({ ok: true, persisted: false, record });
  }

  const response = await fetch(`${config.url}/rest/v1/countries`, {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(toSupabasePayload(record))
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ ok: true, persisted: false, record, error });
  }

  const data = await response.json().catch(() => []);
  return NextResponse.json({ ok: true, persisted: true, record: Array.isArray(data) && data[0] ? data[0] : record });
}
