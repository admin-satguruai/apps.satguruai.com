# Data Model and Seed Data

Use PostgreSQL-compatible schema. The implementation can use Supabase PostgreSQL or an equivalent relational database.

## Entity overview

| Entity | Purpose |
|---|---|
| users_profile | Extended user profile linked to auth user. |
| roles | Role definitions such as registered_user, admin, super_admin. |
| allowed_domains | Approved company email domains for signup. |
| departments | Department master. |
| countries | Country master. |
| branches | Branch/location master. |
| portal_categories | Portal category master. |
| portals | Main portal registry. |
| portal_documents | Documents/manuals linked to portals. |
| portal_faqs | FAQs linked to portals. |
| favorites | User favorite portals. |
| support_tickets | Contact/support/access requests. |
| portal_access | Future access matrix for portal-level permissions. |
| announcements | Dashboard notices. |
| audit_logs | Important user/admin activity logs. |
| portal_events | Analytics events such as portal open/search. |

## Recommended tables

### users_profile

Fields:

- id uuid primary key
- auth_user_id uuid unique nullable depending on auth provider
- first_name text
- last_name text
- email text unique not null
- email_domain text not null
- mobile_number text
- employee_id text
- department_id uuid nullable
- branch_id uuid nullable
- country_id uuid nullable
- designation text
- profile_picture_url text
- role_id uuid nullable
- status text default active
- email_verified boolean default false
- created_at timestamptz
- updated_at timestamptz
- last_login_at timestamptz

### roles

Fields:

- id uuid primary key
- role_key text unique not null
- role_name text not null
- description text
- status text default active
- created_at timestamptz

### allowed_domains

Fields:

- id uuid primary key
- domain_name text unique not null
- company_name text
- status text default active
- added_by uuid nullable
- remarks text
- created_at timestamptz
- updated_at timestamptz

### departments

Fields:

- id uuid primary key
- department_name text unique not null
- description text
- status text default active
- created_at timestamptz

### countries

Fields:

- id uuid primary key
- country_name text not null
- country_code text
- status text default active

### branches

Fields:

- id uuid primary key
- branch_name text not null
- country_id uuid nullable
- region text
- status text default active

### portal_categories

Fields:

- id uuid primary key
- category_name text unique not null
- description text
- icon text
- display_order integer default 0
- status text default active

### portals

Fields:

- id uuid primary key
- portal_name text not null
- portal_slug text unique not null
- portal_url text not null
- short_description text
- full_description text
- category_id uuid nullable
- department_id uuid nullable
- logo_url text
- banner_url text
- business_owner text
- technical_owner text
- support_email text
- support_phone text
- status text default live
- visibility text default logged_in
- go_live_date date nullable
- version text
- ai_enabled boolean default false
- created_by uuid nullable
- created_at timestamptz
- updated_at timestamptz

### portal_documents

Fields:

- id uuid primary key
- portal_id uuid references portals(id)
- document_title text not null
- document_url text
- document_type text
- version text
- visibility text default logged_in
- uploaded_by uuid nullable
- uploaded_at timestamptz
- status text default active
- extracted_text text nullable
- ai_enabled boolean default false
- tags text[] nullable

### portal_faqs

Fields:

- id uuid primary key
- portal_id uuid references portals(id)
- question text not null
- answer text not null
- visibility text default logged_in
- status text default active
- created_by uuid nullable
- created_at timestamptz
- updated_at timestamptz

### favorites

Fields:

- id uuid primary key
- user_id uuid not null
- portal_id uuid references portals(id)
- display_order integer default 0
- created_at timestamptz

### support_tickets

Fields:

- id uuid primary key
- ticket_number text unique
- user_id uuid nullable
- portal_id uuid nullable references portals(id)
- category text not null
- priority text default medium
- subject text not null
- description text not null
- attachment_url text nullable
- status text default submitted
- assigned_to uuid nullable
- created_at timestamptz
- updated_at timestamptz
- resolved_at timestamptz nullable

### portal_access

Fields:

- id uuid primary key
- user_id uuid not null
- portal_id uuid references portals(id)
- access_status text default allowed
- requested_at timestamptz nullable
- approved_by uuid nullable
- approved_at timestamptz nullable
- remarks text

### announcements

Fields:

- id uuid primary key
- title text not null
- message text not null
- target_audience text default all
- priority text default normal
- start_date date nullable
- end_date date nullable
- status text default active
- created_by uuid nullable
- created_at timestamptz

### audit_logs

Fields:

- id uuid primary key
- activity_type text not null
- performed_by uuid nullable
- affected_user_id uuid nullable
- affected_portal_id uuid nullable
- ip_address text nullable
- browser text nullable
- device text nullable
- details jsonb nullable
- created_at timestamptz

## Seed data

### Allowed domains

- satgurutravel.com
- visadone.com
- cargoafrica.com
- Additional domains to be maintained by admin

### Categories

Sales, CRM, Operations, Finance, Marketing, HR, Admin, IT, Management, Visa, Cargo, DMC, Mobility, Education, Reporting, AI Tools, Process and SOP, Support Tools, Analytics, Client Management.

### Initial portals

| Portal | URL | Category |
|---|---|---|
| Retail CRM | https://retail-crm.satguruai.com | CRM |
| Satguru Sales Intelligence | https://sales-intelligence.satguruai.com | Sales |
| COPS | https://cops.satguruai.com | Operations |
| Holiday Itinerary | https://holiday-itinerary.satguruai.com | Operations |
| STG Operations | https://stg-ops.satguruai.com | Operations |
| STG Sales / Lead Finder | https://stg-sales.satguruai.com | Sales |
| Process Repository | https://process-repository.satguruai.com | Process and SOP |
| Satguru Cargo | https://satcargo-connect.satguruai.com | Cargo |
| VisaDone | https://visadone.satguruai.com | Visa |
| CIA Mobility | https://cia-mobility.satguruai.com | Mobility |
| DMC Contracting | https://dmc-contracting.satguruai.com | DMC |
| Maxsave | https://maxsave.satguruai.com | Management |
| Satguru AI Central Portal | https://app.satguruai.com | Platform |
