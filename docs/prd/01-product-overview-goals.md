# Satguru AI Central Portal - Codex Ready Product Requirements Document

> **Product:** Satguru AI Central Portal / Satguru AI Application Hub  
> **Primary URL:** `https://app.satguruai.com`  
> **Parent domain:** `satguruai.com`  
> **Root domain behavior:** `https://satguruai.com` and `https://www.satguruai.com` should redirect to `https://app.satguruai.com`  
> **Deployment:** GitHub repo connected to Vercel  
> **Recommended stack:** Next.js, TypeScript, Tailwind CSS, Supabase/PostgreSQL or equivalent, secure authentication, file storage, future AI integration, future SSO readiness  
> **Implementation instruction for Codex:** Build this as a real database-backed platform, not as a static link page.

---

## 0. Codex Implementation Instruction

Read this file completely before implementation.

The goal is to build a production-ready internal portal called **Satguru AI Central Portal** at `app.satguruai.com`. This portal is the central gateway for all Satguru internal AI tools and business applications.

The first version should implement the **MVP** fully and leave clean architecture hooks for Phase 2/3 items such as AI assistant, document-based Q&A, analytics, access requests, and SSO.

### Critical Development Rules

- Do **not** build this as a hardcoded/static list of links.
- Use a database-backed portal registry so admins can add, edit, deactivate, and manage portals without developer support.
- Use secure authentication and approved email domain validation.
- Protect all logged-in routes and admin routes.
- Keep the code modular and future-ready for AI assistant and SSO.
- Store all configuration values in environment variables.
- Use clear TypeScript types and reusable components.
- Build MVP first; do not attempt full enterprise SSO in initial release.

### Recommended Initial Repo Structure

```text
satguru-ai-portal/
  app/
    page.tsx
    about/
    tools/
    contact/
    login/
    signup/
    verify-otp/
    forgot-password/
    dashboard/
    portals/
      page.tsx
      [slug]/page.tsx
    profile/
    favorites/
    support/
    admin/
      page.tsx
      users/
      portals/
      domains/
      documents/
      categories/
      announcements/
      support/
      audit-logs/
      settings/
    api/
  components/
  lib/
  types/
  database/
    schema.sql
    seed.sql
    policies.sql
  docs/
    prd/
  public/
  .env.example
  README.md
  vercel.json
```

---

# 1. Product Overview

## 1.1 Background

Satguru Travel Group is building multiple internal digital portals, AI-supported systems, CRM platforms, operations tools, sales intelligence applications, process repositories, and department-specific productivity tools. These tools are being deployed as independent applications, many under subdomains of `satguruai.com` and hosted through GitHub and Vercel.

As the number of portals increases from the current 13 applications to a future 20-25+ applications, employees will need one trusted location to discover, understand, access, and get support for those tools.

The Satguru AI Central Portal should solve this by becoming the official internal gateway for all Satguru AI applications.

## 1.2 Product Definition

The Satguru AI Central Portal is:

- A central application directory
- An internal app marketplace
- An employee login hub
- A portal documentation repository
- A support and contact gateway
- A future AI knowledge assistant layer
- A future SSO identity and access layer
- A governance console for portal owners and administrators

## 1.3 Primary Product URL

```text
https://app.satguruai.com
```

## 1.4 Root Domain Redirect Requirement

```text
https://satguruai.com       -> https://app.satguruai.com
https://www.satguruai.com   -> https://app.satguruai.com
```

## 1.5 Product Principle

The portal must be treated as a long-term platform, not a temporary landing page.

The first release may be simple, but the architecture must support:

- Admin-managed portal registry
- Approved domain-based user registration
- User profile and account status
- Portal categories and ownership
- Documentation and FAQ management
- Future AI assistant
- Future SSO
- Usage analytics
- Audit logs

---

# 2. Goals and Success Measures

## 2.1 Business Goals

| Goal ID | Goal | Description | Priority | Phase |
|---|---|---|---|---|
| GOAL-001 | Central application hub | All Satguru AI portals should be discoverable from `app.satguruai.com`. | High | MVP |
| GOAL-002 | Controlled registration | Only users with approved company email domains should self-register. | High | MVP |
| GOAL-003 | Portal knowledge and manuals | Each portal should have a detail page with description, documentation, FAQs, owner, and support contact. | High | MVP |
| GOAL-004 | Reduce basic support queries | AI assistant and documentation should answer common user questions. | Medium | Phase 2 |
| GOAL-005 | Future SSO readiness | User, role, portal, and access matrix should support future central login. | High | MVP |
| GOAL-006 | Continuous portal growth | Admins should add new portals without code changes. | High | MVP |
| GOAL-007 | Governance | Each portal must have owner, category, status, support contact, and go-live information. | High | MVP |
| GOAL-008 | Adoption tracking | Admins and management should understand usage trends over time. | Medium | Phase 3 |

## 2.2 Success Measures

| Success Metric | Target / Measurement |
|---|---|
| Portal launch | `app.satguruai.com` is live with HTTPS. |
| Root redirect | `satguruai.com` redirects to `app.satguruai.com`. |
| Initial portal coverage | All initial 13 portals are listed. |
| Registration control | Approved domains can register; unapproved domains are blocked. |
| Admin autonomy | Admin can add, edit, and deactivate portals without developer support. |
| Documentation coverage | Each live portal can have documentation attached. |
| Search usefulness | Users can find portals by name, category, department, and keywords. |
| Security | Public users cannot access internal dashboard, documents, or admin pages. |
| Scalability | Platform can support 25+ portals without redesign. |
