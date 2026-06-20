-- Satguru AI Central Portal - Country Master
-- Run this script in Supabase SQL Editor before enabling persistent Country CRUD.

create extension if not exists pgcrypto;

create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  country_id text unique not null,
  country_name text unique not null,
  iso_code_2 char(2) unique not null,
  iso_code_3 char(3) unique not null,
  dialing_code text not null,
  continent text,
  subcontinent text,
  presence_status text not null default 'No' check (presence_status in ('Yes', 'No')),
  time_zones text,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  remarks text,
  owner_id uuid,
  owner_name text not null default 'admin@satguruai.com',
  created_by_id uuid,
  created_by text not null default 'admin@satguruai.com',
  created_at timestamptz not null default now(),
  modified_by_id uuid,
  modified_by text not null default 'admin@satguruai.com',
  modified_at timestamptz not null default now(),
  constraint countries_iso2_uppercase check (iso_code_2 = upper(iso_code_2)),
  constraint countries_iso3_uppercase check (iso_code_3 = upper(iso_code_3))
);

create index if not exists countries_status_idx on countries(status);
create index if not exists countries_presence_status_idx on countries(presence_status);
create index if not exists countries_continent_idx on countries(continent);

create or replace function set_country_modified_at()
returns trigger as $$
begin
  new.modified_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_countries_modified_at on countries;
create trigger trg_countries_modified_at
before update on countries
for each row
execute function set_country_modified_at();

insert into countries (
  country_id,
  country_name,
  iso_code_2,
  iso_code_3,
  dialing_code,
  continent,
  subcontinent,
  presence_status,
  time_zones,
  status,
  remarks,
  owner_name,
  created_by,
  modified_by
) values
  ('CN-001', 'India', 'IN', 'IND', '+91', 'Asia', 'South Asia', 'Yes', 'Asia/Kolkata', 'Active', 'Satguru central support and shared services presence.', 'admin@satguruai.com', 'admin@satguruai.com', 'admin@satguruai.com'),
  ('CN-002', 'United Arab Emirates', 'AE', 'ARE', '+971', 'Asia', 'Western Asia', 'Yes', 'Asia/Dubai', 'Active', 'Used for UAE operations and regional references.', 'admin@satguruai.com', 'admin@satguruai.com', 'admin@satguruai.com'),
  ('CN-003', 'South Africa', 'ZA', 'ZAF', '+27', 'Africa', 'Southern Africa', 'Yes', 'Africa/Johannesburg', 'Active', 'Presence country for Southern Africa structure.', 'admin@satguruai.com', 'admin@satguruai.com', 'admin@satguruai.com'),
  ('CN-004', 'Kenya', 'KE', 'KEN', '+254', 'Africa', 'East Africa', 'Yes', 'Africa/Nairobi', 'Active', 'Presence country for East Africa operations.', 'admin@satguruai.com', 'admin@satguruai.com', 'admin@satguruai.com'),
  ('CN-005', 'Nigeria', 'NG', 'NGA', '+234', 'Africa', 'West Africa', 'Yes', 'Africa/Lagos', 'Active', 'Presence country for West Africa operations.', 'admin@satguruai.com', 'admin@satguruai.com', 'admin@satguruai.com'),
  ('CN-006', 'United Kingdom', 'GB', 'GBR', '+44', 'Europe', 'Northern Europe', 'No', 'Europe/London', 'Active', 'Reference country for education, travel, and reporting use cases.', 'admin@satguruai.com', 'admin@satguruai.com', 'admin@satguruai.com')
on conflict (country_id) do nothing;
