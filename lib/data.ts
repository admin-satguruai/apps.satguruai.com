import { AllowedDomain, Portal, SupportTicket, User } from '@/types';

export const allowedDomains: AllowedDomain[] = [
  { id: 'dom-1', domain: 'satgurutravel.com', description: 'Satguru Travel corporate users', status: 'active' },
  { id: 'dom-2', domain: 'satguruai.com', description: 'Satguru AI platform administrators', status: 'active' },
  { id: 'dom-3', domain: 'satguruuniverse.com', description: 'Approved group domain', status: 'active' }
];

const docs = (slug: string) => [
  { id: `${slug}-doc-1`, title: 'Getting started guide', type: 'Manual', version: '1.0', visibility: 'logged_in' as const, url: '#', status: 'active' as const },
  { id: `${slug}-doc-2`, title: 'Support and access SOP', type: 'SOP', version: '1.0', visibility: 'logged_in' as const, url: '#', status: 'active' as const }
];
const faqs = (name: string, email: string) => [
  { id: `${name}-faq-1`, question: `How do I request access to ${name}?`, answer: `Use the support form and select access request, or contact ${email}.`, visibility: 'logged_in' as const, status: 'active' as const },
  { id: `${name}-faq-2`, question: 'Who maintains this portal record?', answer: 'The business owner and platform admin keep records current through the admin console.', visibility: 'logged_in' as const, status: 'active' as const }
];

export const portals: Portal[] = [
  ['Retail CRM','retail-crm','https://retail-crm.satguruai.com','CRM','Retail/CRM','live','Customer and retail CRM related workflows.'],
  ['Satguru Sales Intelligence','sales-intelligence','https://sales-intelligence.satguruai.com','Sales','Sales/Management','pending_dns','Sales intelligence, client insights, and business development analysis.'],
  ['COPS','cops','https://cops.satguruai.com','Operations','Operations','pending_dns','Operational coordination and process tracking portal.'],
  ['Holiday Itinerary','holiday-itinerary','https://holiday-itinerary.satguruai.com','Operations','Travel / Holidays','pending_dns','Holiday itinerary creation and management.'],
  ['STG Operations','stg-ops','https://stg-ops.satguruai.com','Operations','Operations','pending_dns','Operational workflows and branch operations support.'],
  ['STG Sales / Lead Finder','stg-sales','https://stg-sales.satguruai.com','Sales','Sales / Lead Management','pending_dns','Lead finder and sales management application.'],
  ['Process Repository','process-repository','https://process-repository.satguruai.com','Knowledge','Process/SOP','pending_dns','Central repository for process documents and SOPs.'],
  ['Satguru Cargo','satcargo-connect','https://satcargo-connect.satguruai.com','Cargo','Cargo','pending_dns','Cargo-related workflows and connection portal.'],
  ['VisaDone','visadone','https://visadone.satguruai.com','Visa','Visa','pending_dns','Visa-related internal workflow support.'],
  ['CIA Mobility','cia-mobility','https://cia-mobility.satguruai.com','Mobility','Mobility','pending_dns','CIA mobility related portal.'],
  ['DMC Contracting','dmc-contracting','https://dmc-contracting.satguruai.com','DMC','Contracting','pending_dns','DMC contracting workflow support.'],
  ['Maxsave','maxsave','https://maxsave.satguruai.com','Savings / Management','Management','pending_dns','Maxsave related application.'],
  ['Satguru AI Central Portal','satguru-ai-central-portal','https://app.satguruai.com','Platform','All Departments','live','Main home page and application hub.']
].map(([name, slug, url, category, department, status, shortDescription], i) => ({
  id: `portal-${i+1}`, name, slug, url, category, department, status: status as Portal['status'], shortDescription,
  fullDescription: `${shortDescription} This record is stored through the portal registry model so administrators can manage ownership, documentation, visibility, and lifecycle without code changes.`,
  owner: `${department} Owner`, supportEmail: `support+${slug}@satguruai.com`, supportPhone: '+91-00000-00000', tags: [category, department, name], documents: docs(slug), faqs: faqs(name, `support+${slug}@satguruai.com`)
}));

export const users: User[] = [
  { id:'usr-1', name:'Anita Sharma', email:'anita@satguruai.com', role:'super_admin', department:'Platform', branch:'HQ', country:'India', status:'active', lastLogin:'2026-06-12' },
  { id:'usr-2', name:'Rahul Mehta', email:'rahul@satgurutravel.com', role:'admin', department:'Operations', branch:'Mumbai', country:'India', status:'active', lastLogin:'2026-06-11' },
  { id:'usr-3', name:'Grace Mensah', email:'grace@satgurutravel.com', role:'user', department:'Sales', branch:'Accra', country:'Ghana', status:'pending' }
];
export const supportTickets: SupportTicket[] = [
  { id:'tick-1', ticketNumber:'SAT-1001', category:'access request', subject:'Need COPS access', status:'submitted', priority:'medium', portal:'COPS', requester:'Grace Mensah', createdAt:'2026-06-10' },
  { id:'tick-2', ticketNumber:'SAT-1002', category:'documentation issue', subject:'Retail CRM SOP update', status:'in_review', priority:'low', portal:'Retail CRM', requester:'Rahul Mehta', createdAt:'2026-06-11' }
];
export const categories = Array.from(new Set(portals.map(p => p.category))).map((category, i) => ({ id:`cat-${i+1}`, name:category, description:`${category} portals and tools`, status:'active' }));
export const announcements = [
  { title:'MVP launch foundation', message:'The central portal now provides a governed directory, support flow, and admin-ready management screens.', priority:'high' },
  { title:'Future SSO readiness', message:'Connected application login remains separate until the SSO phase is implemented.', priority:'normal' }
];
export function getPortal(slug: string) { return portals.find((p) => p.slug === slug); }
export function isAllowedEmail(email: string) { const domain = email.split('@')[1]?.toLowerCase(); return allowedDomains.some(d => d.domain === domain && d.status === 'active'); }
