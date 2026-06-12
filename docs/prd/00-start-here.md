# START HERE - Codex Implementation Prompt

Use this file as the first instruction for Codex.

## Instruction to Codex

Read every Markdown file inside `docs/prd/` before making code changes. Implement the Satguru AI Central Portal as a real database-backed internal application hub, not as a static link page.

## Build Order

1. Create the base Next.js + TypeScript + Tailwind project structure.
2. Implement public pages: Home, About, Tools Preview, Contact, Login, Signup.
3. Implement authentication with approved email domain validation and OTP-ready architecture.
4. Implement logged-in dashboard with portal cards, search, favorites, and announcements.
5. Implement admin modules for users, portals, allowed domains, categories, and documents.
6. Implement Supabase/PostgreSQL schema and seed data.
7. Protect authenticated and admin routes.
8. Prepare deployment configuration for Vercel and `app.satguruai.com`.

## Do Not Build Yet

Do not implement full enterprise SSO or full AI document Q&A in the first pass. Keep architecture ready for them, but complete the MVP first.

## Critical Rules

- Do not hardcode portal cards in the frontend. Use database-driven portal registry.
- Future SSO is the correct approach for connected application access.
- Use environment variables for configuration values.
- Protect routes server-side, not only by hiding UI.
- Add clear README and `.env.example`.
