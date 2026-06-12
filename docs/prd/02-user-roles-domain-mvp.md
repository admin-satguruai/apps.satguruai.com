# 3. User Roles and Permissions

## 3.1 Role Matrix

| Role | Description | Permissions |
|---|---|---|
| Public Visitor | Anyone visiting before login. | Can view homepage, about, limited tool preview, FAQ, contact page, login/signup. Cannot see internal portal links or restricted documents. |
| Registered User | User who signed up with approved domain and verified OTP. | Can view dashboard, portal cards, portal detail pages, documentation based on visibility, favorites, profile, and support form. |
| Department User | Registered user assigned to a department such as Sales, Operations, Marketing, Finance, HR, Visa, Cargo, DMC, etc. | Can receive department-relevant portal recommendations and may later have department-specific access. |
| Portal Owner | Business owner for one or more portals. | Can manage assigned portal details, documentation, FAQs, release notes, support info, and ownership details if portal owner features are enabled. |
| Support User | User handling support/access issues. | Can view and manage support tickets. |
| Admin | Operational admin. | Can manage users, portals, allowed domains, categories, documents, announcements, and support tickets. |
| Super Admin | Highest-level controller. | Can manage roles, admin users, global settings, security, audit logs, and future SSO configuration. |

## 3.2 Access Principles

- Follow least-privilege access.
- Public users must not see internal links, restricted documents, or admin data.
- Regular users must not access admin routes.
- Portal owners must only manage assigned portals unless granted broader access.
- Super admin controls sensitive configuration.
- All admin actions should be audit logged.

---

# 4. Domain, Hosting, and Deployment Requirements

## 4.1 Domain Behavior

| Domain | Required Behavior |
|---|---|
| `satguruai.com` | Redirect to `https://app.satguruai.com`. |
| `www.satguruai.com` | Redirect to `https://app.satguruai.com`. |
| `app.satguruai.com` | Primary Satguru AI Central Portal. |
| Tool subdomains | Individual application portals connected through Vercel projects. |

## 4.2 Vercel Requirements

- Create a separate Vercel project for the central portal.
- Connect the Vercel project to the GitHub repo.
- Add `app.satguruai.com` as the production domain.
- Add `satguruai.com` and `www.satguruai.com` if using Vercel-managed redirects.
- Configure environment variables in Vercel.
- Ensure SSL is valid.

## 4.3 `vercel.json` Redirect Recommendation

Use this only if `satguruai.com` is added to the same Vercel project and Vercel is handling redirect behavior.

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "satguruai.com" }],
      "destination": "https://app.satguruai.com/:path*",
      "permanent": true
    },
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.satguruai.com" }],
      "destination": "https://app.satguruai.com/:path*",
      "permanent": true
    }
  ]
}
```

## 4.4 Initial Portal Registry

Seed these records into the portal database.

| Portal Name | URL | Category | Department | Initial Status | Description |
|---|---|---|---|---|---|
| Retail CRM | `https://retail-crm.satguruai.com` | CRM | Retail/CRM | Live / Added | Customer and retail CRM related workflows. |
| Satguru Sales Intelligence | `https://sales-intelligence.satguruai.com` | Sales | Sales/Management | Pending DNS confirmation | Sales intelligence, client insights, and business development analysis. |
| COPS | `https://cops.satguruai.com` | Operations | Operations | Pending DNS confirmation | Operational coordination and process tracking portal. |
| Holiday Itinerary | `https://holiday-itinerary.satguruai.com` | Operations | Travel / Holidays | Pending DNS confirmation | Holiday itinerary creation and management. |
| STG Operations | `https://stg-ops.satguruai.com` | Operations | Operations | Pending DNS confirmation | Operational workflows and branch operations support. |
| STG Sales / Lead Finder | `https://stg-sales.satguruai.com` | Sales | Sales / Lead Management | Pending DNS confirmation | Lead finder and sales management application. |
| Process Repository | `https://process-repository.satguruai.com` | Knowledge | Process/SOP | Pending DNS confirmation | Central repository for process documents and SOPs. |
| Satguru Cargo | `https://satcargo-connect.satguruai.com` | Cargo | Cargo | Pending DNS confirmation | Cargo-related workflows and connection portal. |
| VisaDone | `https://visadone.satguruai.com` | Visa | Visa | Pending DNS confirmation | Visa-related internal workflow support. |
| CIA Mobility | `https://cia-mobility.satguruai.com` | Mobility | Mobility | Pending DNS confirmation | CIA mobility related portal. |
| DMC Contracting | `https://dmc-contracting.satguruai.com` | DMC | Contracting | Pending DNS confirmation | DMC contracting workflow support. |
| Maxsave | `https://maxsave.satguruai.com` | Savings / Management | Management | Pending DNS confirmation | Maxsave related application. |
| Satguru AI Central Portal | `https://app.satguruai.com` | Platform | All Departments | To be created | Main home page and application hub. |

---

# 5. MVP Scope

Build these modules in the first version.

## 5.1 MVP Must-Have Features

- Public homepage
- About page
- Tools preview page
- Contact page
- Signup page
- Approved domain validation
- Email OTP verification or equivalent secure email verification
- Login
- Forgot password
- User dashboard
- Portal directory
- Portal detail page
- Favorites/bookmarks
- User profile
- Admin dashboard
- User management
- Portal management
- Allowed domain management
- Category management
- Basic document upload metadata
- Support/contact request form
- Protected routes
- Role-based admin access
- Initial seed data
- Vercel deployment
- `app.satguruai.com` domain setup
- `satguruai.com` redirect

## 5.2 MVP Should Not Include Yet

Do not implement these fully in MVP unless specifically requested later:

- Full cross-portal SSO
- AI document Q&A
- Native mobile app
- HRMS integration
- Credential vault for other portals
- Advanced analytics dashboards
- Full ticketing system with SLA
- Complex role-builder UI

However, the code and data model should be structured so these can be added later.
