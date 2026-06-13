# Satguru AI Central Portal

Satguru AI Central Portal is a Next.js, TypeScript, and Tailwind CSS MVP foundation for `https://app.satguruai.com`. It is designed as a database-backed internal application hub, not a static link page.

## Phase 1 MVP included

- Public pages: Home, About, Tools preview, Contact
- Auth-ready pages: Login, Signup, Verify OTP, Forgot password
- Logged-in experience: Dashboard, portal directory, portal detail pages, profile, favorites, support form
- Admin console: overview, users, portals, allowed domains, categories, documents, announcements, support, settings
- Database-ready mock registry in `lib/data.ts`
- PostgreSQL schema and seed data in `database/`
- Vercel root-domain redirects in `vercel.json`
- Environment variable template in `.env.example`

## Not included yet

- Full cross-portal SSO
- AI assistant and document Q&A
- Production authentication provider wiring
- File upload storage implementation
- Advanced analytics dashboards

The data model and UI are structured so these can be added in later phases.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and configure Supabase/PostgreSQL, email, storage, auth, and future AI provider settings.

## Database

Run `database/schema.sql` in PostgreSQL/Supabase, then `database/seed.sql` to create the initial approved domains, categories, departments, announcements, and 13 initial portal records.

## Architecture notes

- Frontend cards are rendered from `lib/data.ts`, which mirrors the database schema and should be replaced by Supabase service functions when credentials are configured.
- Admin screens are management-ready placeholders that show database-backed tables and intended actions.
- Auth pages are OTP-ready and document approved email domain policy.
- Dashboard/admin routes must be protected server-side when the auth provider is connected.
