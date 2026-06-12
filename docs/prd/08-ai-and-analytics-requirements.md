# AI Assistant and Analytics Requirements

These are mostly Phase 2 and Phase 3 requirements. The MVP should keep clean architecture hooks for these features but does not need to fully implement them in the first pass.

## AI assistant purpose

The AI assistant should help users understand portals, manuals, SOPs, FAQs, and usage steps.

Example user questions:

- What is Sales Intelligence?
- How do I use Retail CRM?
- Which portal is used for SOPs?
- How do I request access to COPS?
- Where can I find VisaDone documentation?

## AI knowledge sources

- Portal descriptions
- Uploaded manuals
- SOP documents
- FAQs
- Release notes
- Training links
- Approved knowledge articles

## AI requirements

| Req ID | Requirement | Acceptance Detail | Priority | Phase |
|---|---|---|---|---|
| AI-001 | Global AI assistant | General assistant answers questions across allowed portal documentation. | Medium | Phase 2 |
| AI-002 | Portal-specific assistant | Portal detail page has assistant focused on that portal. | High | Phase 2 |
| AI-003 | Source grounding | AI answers from uploaded documents, FAQs and approved articles. | High | Phase 2 |
| AI-004 | No guessing rule | If answer is not available, AI should say information is not available. | High | Phase 2 |
| AI-005 | Source links | AI should show related documents or pages where possible. | Medium | Phase 2 |
| AI-006 | Access-aware answers | AI should not answer using restricted documents for unauthorized users. | High | Phase 2 |
| AI-007 | Provider flexibility | Architecture should allow OpenAI, Gemini, Azure OpenAI or future provider. | Medium | Phase 2 |

## AI pipeline concept

1. Admin uploads document and maps it to a portal.
2. System extracts text if supported.
3. Document content is chunked and indexed.
4. User asks a question.
5. System retrieves relevant allowed content.
6. AI answers using retrieved content.
7. If no source is available, AI gives a no-information response and suggests support contact.

## Analytics requirements

| Req ID | Requirement | Acceptance Detail | Priority | Phase |
|---|---|---|---|---|
| ANALYTICS-001 | User count | Admin should see total registered, active, inactive and pending users. | Medium | Phase 1 |
| ANALYTICS-002 | Portal usage | Track portal views and open clicks. | Medium | Phase 2 |
| ANALYTICS-003 | Search analytics | Track common search terms to identify user needs. | Low | Phase 2 |
| ANALYTICS-004 | AI usage | Track AI question count by portal and user group. | Low | Phase 3 |
| ANALYTICS-005 | Department adoption | Show usage by department, country or branch. | Medium | Phase 3 |
| ANALYTICS-006 | Least used portals | Identify portals needing training or better positioning. | Low | Phase 3 |

## Dashboard metrics

- Total registered users
- Monthly active users
- Most opened portals
- Least opened portals
- Top search queries
- Support ticket volume
- AI assistant questions

## Future SSO concept

Future SSO should allow a user to login once on `app.satguruai.com` and access connected portals without separate login. This requires future integration changes in each connected portal.

Future flow:

1. User opens a connected application.
2. Application checks session or token.
3. If no valid session exists, application redirects to `app.satguruai.com/login`.
4. Central portal authenticates the user.
5. Central portal issues a secure token.
6. User is redirected back to requested portal.
7. Connected portal validates token and checks access.
8. If allowed, user enters the portal.

For MVP, only store the access matrix and keep the code ready for future SSO.
