# Core Features and Business Flows

## Feature groups

### Public site

- Public home page explaining Satguru AI.
- Limited tools preview before login.
- Public contact form.
- Public FAQ and registration policy.

### User account

- Signup with approved company email domain.
- Email verification using OTP or secure verification mechanism.
- Login and logout.
- Account recovery.
- User profile page.
- User status management by admin.

### Portal directory

- Portal records must come from database.
- Portal cards show logo, name, short description, category, status and actions.
- Portal detail page includes owner, support contact, documentation and FAQ sections.
- Users can search and filter portals.
- Users can mark portals as favorites.

### Admin module

- Admin dashboard.
- User management.
- Portal management.
- Approved domain management.
- Category management.
- Document metadata management.
- Support request review.

### Support module

- Public and logged-in users can raise support/contact requests.
- Request can optionally relate to a portal.
- Categories include login issue, signup issue, access request, technical issue, documentation issue and enhancement request.

## Business process flows

### User signup flow

1. User opens `app.satguruai.com`.
2. User clicks Sign Up.
3. User enters name, official email, mobile, department, branch and country.
4. System extracts email domain.
5. System checks domain against `allowed_domains`.
6. If domain is not approved, signup is stopped with a clear message.
7. If domain is approved, pending account is created.
8. Verification code or email verification is sent.
9. User verifies email.
10. Account becomes active.
11. User can login and access dashboard.

### Portal discovery flow

1. User logs in.
2. Dashboard loads portal categories and favorite portals.
3. User searches or filters portals.
4. User opens portal detail page.
5. User reads description, support contact and documents.
6. User clicks Open Portal.
7. System tracks portal open event for analytics.

### Admin add portal flow

1. Admin opens `/admin/portals`.
2. Admin clicks Add Portal.
3. Admin enters portal name, slug, URL, category, department, owner, support contact, description and status.
4. Admin optionally uploads logo or stores logo URL.
5. Admin saves portal.
6. Portal appears to users based on status and visibility.
7. Audit entry is created.

### Support request flow

1. User opens support form.
2. User selects category and related portal if applicable.
3. User submits subject and description.
4. System creates support ticket record.
5. Admin or support user reviews the request.
6. Status is updated until closed.

### Future AI question flow

1. User asks a question from portal detail page.
2. System identifies portal context and user permissions.
3. System retrieves approved documents and FAQs.
4. AI answer is generated using only allowed knowledge sources.
5. If information is not available, system says information is not available and suggests support contact.

## Critical implementation rules

- Do not hardcode portal cards in page components.
- Do not expose admin routes to regular users.
- Do not expose restricted documentation before login.
- Use central portal registry for tool listing.
- Keep future AI and SSO hooks clean but do not overbuild in MVP.
