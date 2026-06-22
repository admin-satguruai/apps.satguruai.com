import { AllowedDomain, Portal, SupportTicket, User } from '@/types';

export const allowedDomains: AllowedDomain[] = [
  { id: 'dom-1', domain: 'satgurutravel.com', description: 'Satguru Travel corporate users', status: 'active' },
  { id: 'dom-2', domain: 'satguruai.com', description: 'Satguru AI platform administrators', status: 'active' },
  { id: 'dom-3', domain: 'satguruuniverse.com', description: 'Approved group domain', status: 'active' }
];

type PortalSeed = {
  name: string;
  slug: string;
  businessDomain: string;
  demoUrl: string;
  domainUrl: string;
  category: string;
  department: string;
  status: Portal['status'];
  demoLinkStatus: Portal['demoLinkStatus'];
  portalLinkStatus: Portal['portalLinkStatus'];
  shortDescription: string;
  fullDescription: string;
  owner: string;
  audience: string;
  goLiveDate?: string;
  keyFeatures: string[];
  documents: Array<{ title: string; fileName: string; summary: string }>;
};

const manualUrl = (fileName: string) => `/docs/portal-manuals/${fileName}`;

const docs = (slug: string, entries: PortalSeed['documents']) => entries.map((entry, index) => ({
  id: `${slug}-doc-${index + 1}`,
  title: entry.title,
  type: 'User Manual',
  version: index === 0 ? '1.0' : 'Reference',
  visibility: 'logged_in' as const,
  url: manualUrl(entry.fileName),
  fileName: entry.fileName,
  summary: entry.summary,
  status: 'active' as const
}));

const faqs = (name: string, slug: string, email: string) => [
  { id: `${slug}-faq-1`, question: `How do I request access to ${name}?`, answer: `Use the Request Access action on this detail page or contact ${email}.`, visibility: 'logged_in' as const, status: 'active' as const },
  { id: `${slug}-faq-2`, question: `Where can I find the ${name} user manual?`, answer: 'Open the Documentation section on this page and download the available user manual or guide.', visibility: 'logged_in' as const, status: 'active' as const },
  { id: `${slug}-faq-3`, question: 'Who should I contact for training or a demo?', answer: 'Use the Request Training / Demo action in the Support & Requests panel. A support ticket will be routed to the relevant owner.', visibility: 'logged_in' as const, status: 'active' as const }
];

const portalSeeds: PortalSeed[] = [
  {
    name: 'Satguru Retail CRM',
    slug: 'retail-crm',
    businessDomain: 'CRM',
    demoUrl: 'https://retail-crm.vercel.app',
    domainUrl: 'https://retail-crm.satguruai.com',
    category: 'CRM',
    department: 'Retail / Sales',
    status: 'live',
    demoLinkStatus: 'live',
    portalLinkStatus: 'live',
    shortDescription: 'Customer and retail CRM workflows for leads, follow-ups, activities, bookings, and reporting.',
    fullDescription: 'Satguru Retail CRM supports sales agents, branch managers, and administrators with lead management, customer conversion, follow-ups, tasks, communication history, reporting, campaigns, import tools, and audit trail controls.',
    owner: 'Retail CRM Team',
    audience: 'Sales agents, branch managers, CRM administrators',
    goLiveDate: 'May 2026',
    keyFeatures: ['Lead management', 'Customer conversion', 'Tasks and activities', 'Campaign workflows', 'Dashboard analytics', 'Import wizard', 'Audit trail'],
    documents: [{ title: 'Satguru Retail CRM User Manual', fileName: 'satguru-retail-crm-user-manual.txt', summary: 'Complete reference for Sales, Operations and Administration covering leads, dashboard analytics, imports, auto routing, communication and audit trail.' }]
  },
  {
    name: 'Satguru Sales Intelligence',
    slug: 'sales-intelligence',
    businessDomain: 'Sales Intelligence',
    demoUrl: 'https://sales-intelligence.vercel.app',
    domainUrl: 'https://sales-intelligence.satguruai.com',
    category: 'Sales',
    department: 'Sales / Management',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'Role-aware sales performance dashboard for ERV, NCA, revenue, meetings, scorecards, trends, and alerts.',
    fullDescription: 'Satguru Sales Intelligence consolidates CRM, meetings, MOM, TravelGuard, and transaction ledger data into a leadership dashboard for branch managers, region managers, RMs, and administrators.',
    owner: 'Sales Intelligence Team',
    audience: 'Sales leadership, region managers, branch managers, relationship managers',
    goLiveDate: 'TBA',
    keyFeatures: ['ERV clients', 'NCA pipeline', 'Revenue analysis', 'Meetings analysis', 'MOM analysis', 'Sales scorecard', 'AI sales assistant'],
    documents: [{ title: 'Satguru Sales Intelligence User Manual', fileName: 'satguru-sales-intelligence-user-manual.txt', summary: 'Performance dashboard guide covering overview, ERV clients, NCA pipeline, meetings, MOM, TravelGuard, trends and AI assistant.' }]
  },
  {
    name: 'COPS',
    slug: 'cops',
    businessDomain: 'Central Operations',
    demoUrl: 'https://central-ops-audit-tool.vercel.app',
    domainUrl: 'https://cops.satguruai.com',
    category: 'Operations',
    department: 'Central Operations',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'AI-powered preflight PNR audit system with RED, AMBER, and GREEN gate flags.',
    fullDescription: 'COPS automates PNR booking audits, identifies operational risks, provides AI executive summaries, validates commission data, and supports role-based branch filtering and audit history.',
    owner: 'Central Operations Team',
    audience: 'Operations users, RMs, BMs, central audit team, administrators',
    goLiveDate: 'TBA',
    keyFeatures: ['PNR audit', 'Gate flag system', 'Agentivity API data', 'AI executive summary', 'Anomaly detection', 'Audit history', 'CSV export'],
    documents: [{ title: 'COPS User Manual', fileName: 'cops-user-manual.txt', summary: 'Central Ops PNR Audit System manual covering booking audits, events audit, flag logic, filters, AI summaries, history and analytics.' }]
  },
  {
    name: 'Holiday Itinerary Manager',
    slug: 'holiday-itinerary',
    businessDomain: 'Travel / Holidays',
    demoUrl: 'https://holidays-itinerary.vercel.app',
    domainUrl: 'https://holiday-itinerary.satguruai.com',
    category: 'Operations',
    department: 'Travel / Holidays',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'Holiday itinerary creation, AI trip planning, client management, bookings, DMC rates and query desk.',
    fullDescription: 'Holiday Itinerary Manager helps branch agents create, manage, price, send, export and track professional holiday itineraries through a unified workspace.',
    owner: 'Holiday Product Team',
    audience: 'Holiday agents, branch users, central holiday support team',
    goLiveDate: 'TBA',
    keyFeatures: ['AI trip planner', 'Google Drive itinerary search', 'Client management', 'Templates', 'Bookings', 'Query Desk', 'DMC rates', 'PDF export'],
    documents: [{ title: 'Holiday Itinerary User Manual', fileName: 'holiday-itinerary-user-manual.txt', summary: 'Complete user manual for itinerary search, AI trip planner, client management, templates, bookings, query desk, DMC rates and exports.' }]
  },
  {
    name: 'STG Operations',
    slug: 'stg-operations',
    businessDomain: 'Operations Analytics',
    demoUrl: 'https://stg-operations.vercel.app',
    domainUrl: 'https://stg-ops.satguruai.com',
    category: 'Operations',
    department: 'Operations',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'Operations workflow and email analytics platform for support effort, PNR, ticket, and after-hours reporting.',
    fullDescription: 'STG Operations is planned to support operational workflows and email analytics, linking client communications to PNRs and ticket numbers to measure workload, response time, and after-hours effort.',
    owner: 'STG Operations Team',
    audience: 'Operations teams, branch users, central support teams',
    goLiveDate: 'TBA',
    keyFeatures: ['Email analytics', 'PNR matching', 'Ticket matching', 'After-hours analysis', 'Support reports', 'Client billing evidence'],
    documents: [{ title: 'STG Operations Enhancement Requirement', fileName: 'stg-operations-email-analytics-requirement.txt', summary: 'Requirement guide for email analytics, PNR upload, ticket matching, office-hours classification and support effort reporting.' }]
  },
  {
    name: 'STGsales',
    slug: 'stgsales',
    businessDomain: 'Outbound Sales',
    demoUrl: 'https://st-gsales.vercel.app',
    domainUrl: 'https://stg-sales.satguruai.com',
    category: 'Sales',
    department: 'Sales / Lead Management',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'AI-powered outbound sales platform for strategy, company discovery, contacts, and campaigns.',
    fullDescription: 'STGsales supports target strategy creation, company discovery, global client research, contact discovery, Gmail-connected campaigns, message workflows, and outbound pipeline analytics.',
    owner: 'STG Sales Team',
    audience: 'Sales managers, branch managers, digital calling and campaign teams',
    goLiveDate: 'TBA',
    keyFeatures: ['Strategy creation', 'Company discovery', 'Global clients', 'Contact management', 'Email campaigns', 'Gmail connection', 'Sales funnel'],
    documents: [{ title: 'STGsales User Manual', fileName: 'stgsales-user-manual.txt', summary: 'Step-by-step manual for strategies, companies, contacts, global clients, email campaigns, Gmail connection and outbound sales workflows.' }]
  },
  {
    name: 'SOE Lead Finder',
    slug: 'soe-lead-finder',
    businessDomain: 'Overseas Education',
    demoUrl: 'https://soe-sales-management.vercel.app',
    domainUrl: 'https://soe-sales.satguruai.com',
    category: 'Education',
    department: 'SOE Sales',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'AI-powered student discovery and lead management platform for overseas education.',
    fullDescription: 'SOE Lead Finder automates discovery, scoring, qualification and engagement of student leads across web sources, Telegram, campaigns and outreach channels.',
    owner: 'Satguru Overseas Education Team',
    audience: 'SOE counsellors, marketing users, education sales team',
    goLiveDate: 'TBA',
    keyFeatures: ['AI discovery', 'Lead scoring', 'Telegram monitoring', 'Campaign analytics', 'Outreach generation', 'WhatsApp and calling'],
    documents: [{ title: 'SOE Lead Finder User Guide', fileName: 'soe-lead-finder-user-guide.txt', summary: 'Guide for AI-powered student discovery, lead scoring, Telegram monitoring, campaigns, outreach and analytics.' }]
  },
  {
    name: 'SatCargo Connect',
    slug: 'satcargo-connect',
    businessDomain: 'Cargo',
    demoUrl: 'https://satcargo-connect.vercel.app',
    domainUrl: 'https://satcargo-connect.satguruai.com',
    category: 'Cargo',
    department: 'Cargo',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'B2B freight logistics platform for quotes, shipments, tracking, customs, invoices and partners.',
    fullDescription: 'SatCargo Connect digitizes freight logistics from quote generation to shipment tracking, customs clearance, invoices, payments, carriers, clients and partner workflows.',
    owner: 'Cargo Team',
    audience: 'Cargo operations, finance, corporate customers, carrier partners, travel agents',
    goLiveDate: 'TBA',
    keyFeatures: ['Quote management', 'Shipment tracking', 'Documents', 'Customs clearance', 'Carrier management', 'Invoices and payments', 'Reports'],
    documents: [{ title: 'SatCargo Connect User Manual', fileName: 'satcargo-connect-user-manual.txt', summary: 'Complete guide for cargo quotes, shipments, tracking, document management, customs, carriers, invoices and analytics.' }]
  },
  {
    name: 'Corporate Booking Tool',
    slug: 'corporate-booking-tool',
    businessDomain: 'Corporate Travel',
    demoUrl: 'https://corporate-booking-tool.vercel.app',
    domainUrl: 'https://cbt.satguruai.com',
    category: 'Corporate Travel',
    department: 'Corporate Travel',
    status: 'coming_soon',
    demoLinkStatus: 'live',
    portalLinkStatus: 'coming_soon',
    shortDescription: 'End-to-end corporate travel and expense management platform with DCS+ hotel integration.',
    fullDescription: 'Corporate Booking Tool unifies corporate travel search, flight, hotel, rooms, approvals, expenses, wallet, invoices, payments audit, crew logistics, and reporting.',
    owner: 'Corporate Travel Team',
    audience: 'Corporate users, travel managers, finance, admin teams',
    goLiveDate: 'TBA',
    keyFeatures: ['Flight search', 'DCS+ hotels', 'Reservations', 'Approvals', 'Expenses', 'Wallet', 'Crew logistics', 'Reports'],
    documents: [{ title: 'Corporate Booking Tool User Manual', fileName: 'corporate-booking-tool-user-manual.txt', summary: 'Manual for corporate travel, live DCS+ hotel booking, reservations, approvals, expense management, payments audit and crew logistics.' }]
  },
  {
    name: 'VisaDone',
    slug: 'visadone',
    businessDomain: 'Visa',
    demoUrl: 'https://visadone.vercel.app',
    domainUrl: 'https://visadone.satguruai.com',
    category: 'Visa',
    department: 'Visa',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'Complete visa platform for B2C, B2B agents, corporate HR, operations and CRM workflows.',
    fullDescription: 'VisaDone covers public visa applications, customer accounts, partner workspace, corporate workspace, operations console, CRM, Meta/WhatsApp integrations, voice AI and call tracking.',
    owner: 'VisaDone Team',
    audience: 'Visa operations, partners, corporate HR, CRM users',
    goLiveDate: 'TBA',
    keyFeatures: ['Visa application wizard', 'B2B partner workspace', 'Corporate workspace', 'Ops console', 'CRM pipeline', 'Meta and WhatsApp', 'Voice AI'],
    documents: [{ title: 'VisaDone Complete Platform Manual', fileName: 'visadone-complete-platform-manual.txt', summary: 'Complete VisaDone manual covering customer site, B2C/B2B/corporate workspaces, ops console, CRM and integrations.' }]
  },
  {
    name: 'CIA Mobility',
    slug: 'cia-mobility',
    businessDomain: 'Mobility',
    demoUrl: 'https://cia-mobility.vercel.app',
    domainUrl: 'https://cia-mobility.satguruai.com',
    category: 'Mobility',
    department: 'Mobility',
    status: 'pending_dns',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'Mobility workflow portal for internal service management and operational coordination.',
    fullDescription: 'CIA Mobility is listed as a mobility-related Satguru AI tool. Detailed summary will be updated after final manual review and business-owner confirmation.',
    owner: 'Mobility Team',
    audience: 'Mobility users and support team',
    goLiveDate: 'TBA',
    keyFeatures: ['Mobility workflows', 'Service coordination', 'Operational tracking', 'Summary will be updated soon'],
    documents: [{ title: 'CIA Mobility User Manual', fileName: 'cia-mobility-user-manual.txt', summary: 'Summary will be updated soon after the complete manual is reviewed.' }]
  },
  {
    name: 'RentalOS',
    slug: 'rentalos',
    businessDomain: 'Car Rental',
    demoUrl: 'https://platform-flame-ten.vercel.app',
    domainUrl: 'https://rentalos.satguruai.com',
    category: 'Mobility',
    department: 'Car Rental',
    status: 'coming_soon',
    demoLinkStatus: 'live',
    portalLinkStatus: 'coming_soon',
    shortDescription: 'Car rental ecosystem platform for customers, staff admin, B2B partners and corporate clients.',
    fullDescription: 'RentalOS supports self-drive bookings, staff administration, vendors, fleet, chauffeurs, trips, maintenance, reports, pricing, currencies, invoices, accounts and partner/corporate portals.',
    owner: 'Mobility / Rental Team',
    audience: 'Rental operations, customers, vendors, B2B partners, corporate clients',
    goLiveDate: 'TBA',
    keyFeatures: ['Customer bookings', 'Fleet management', 'Vendors', 'Chauffeurs', 'Trips', 'Maintenance', 'Reports', 'Corporate portal'],
    documents: [{ title: 'RentalOS User & Testing Manual', fileName: 'rentalos-user-testing-manual.txt', summary: 'User and testing manual for car rental customer website, staff admin, fleet, vendors, chauffeurs, trips, reports and partner portal.' }]
  },
  {
    name: 'Process Repository',
    slug: 'process-repository',
    businessDomain: 'Knowledge',
    demoUrl: 'https://process-repository.vercel.app',
    domainUrl: 'https://process-repository.satguruai.com',
    category: 'Knowledge',
    department: 'Process / SOP',
    status: 'coming_soon',
    demoLinkStatus: 'coming_soon',
    portalLinkStatus: 'coming_soon',
    shortDescription: 'Central process and SOP repository for structured operational documentation.',
    fullDescription: 'Process Repository will become the central location for SOPs, process documents, policies, workflow notes and searchable documentation.',
    owner: 'Process Excellence Team',
    audience: 'All departments',
    goLiveDate: 'TBA',
    keyFeatures: ['SOP library', 'Process search', 'Document download', 'Version tracking', 'Summary will be updated soon'],
    documents: [{ title: 'Process Repository Manual', fileName: 'process-repository-user-manual.txt', summary: 'Summary will be updated soon.' }]
  },
  {
    name: 'MaxSave',
    slug: 'maxsave',
    businessDomain: 'Savings / Management',
    demoUrl: 'https://maxsave.vercel.app',
    domainUrl: 'https://maxsave.satguruai.com',
    category: 'Savings / Management',
    department: 'Management',
    status: 'coming_soon',
    demoLinkStatus: 'coming_soon',
    portalLinkStatus: 'coming_soon',
    shortDescription: 'MaxSave related management application. Summary will be updated soon.',
    fullDescription: 'MaxSave is listed as a future Satguru AI tool. Detailed business summary, workflows, documents and ownership will be updated as the module matures.',
    owner: 'Management Team',
    audience: 'Management users',
    goLiveDate: 'TBA',
    keyFeatures: ['Summary will be updated soon', 'Management workflows', 'Future documentation'],
    documents: [{ title: 'MaxSave Manual', fileName: 'maxsave-user-manual.txt', summary: 'Summary will be updated soon.' }]
  },
  {
    name: 'Satguru AI Central Portal',
    slug: 'satguru-ai-central-portal',
    businessDomain: 'Platform',
    demoUrl: 'https://apps-satguruai-com.vercel.app',
    domainUrl: 'https://app.satguruai.com',
    category: 'Platform',
    department: 'All Departments',
    status: 'live',
    demoLinkStatus: 'live',
    portalLinkStatus: 'pending',
    shortDescription: 'Central application hub, knowledge repository, access gateway and future SSO-ready platform.',
    fullDescription: 'Satguru AI Central Portal is the central hub for all Satguru AI tools, documentation, support, registration, login, portal discovery, future admin registry and AI-powered knowledge access.',
    owner: 'Satguru AI Platform Team',
    audience: 'All authorized Satguru group users',
    goLiveDate: 'June 2026',
    keyFeatures: ['Portal directory', 'Authentication', 'Documentation hub', 'Support requests', 'Admin control', 'Future AI assistant', 'Future SSO readiness'],
    documents: [{ title: 'Satguru AI Central Portal Blueprint', fileName: 'satguru-ai-central-portal-blueprint.txt', summary: 'Requirement cum project blueprint for central portal, application hub, documentation, AI assistant, admin control and future SSO.' }]
  }
];

export const portals: Portal[] = portalSeeds.map((portal, index) => ({
  id: `portal-${index + 1}`,
  name: portal.name,
  slug: portal.slug,
  url: portal.domainUrl || portal.demoUrl,
  category: portal.category,
  department: portal.department,
  status: portal.status,
  shortDescription: portal.shortDescription,
  fullDescription: portal.fullDescription,
  owner: portal.owner,
  supportEmail: `support+${portal.slug}@satguruai.com`,
  supportPhone: '+91-00000-00000',
  tags: [portal.category, portal.department, portal.businessDomain, portal.name, ...portal.keyFeatures],
  documents: docs(portal.slug, portal.documents),
  faqs: faqs(portal.name, portal.slug, `support+${portal.slug}@satguruai.com`),
  businessDomain: portal.businessDomain,
  demoUrl: portal.demoUrl,
  domainUrl: portal.domainUrl,
  demoLinkStatus: portal.demoLinkStatus,
  portalLinkStatus: portal.portalLinkStatus,
  keyFeatures: portal.keyFeatures,
  audience: portal.audience,
  goLiveDate: portal.goLiveDate,
  version: '1.0'
}));

export const users: User[] = [
  { id:'usr-1', name:'Anita Sharma', email:'anita@satguruai.com', role:'super_admin', department:'Platform', branch:'HQ', country:'India', status:'active', lastLogin:'2026-06-12' },
  { id:'usr-2', name:'Rahul Mehta', email:'rahul@satgurutravel.com', role:'admin', department:'Operations', branch:'Mumbai', country:'India', status:'active', lastLogin:'2026-06-11' },
  { id:'usr-3', name:'Grace Mensah', email:'grace@satgurutravel.com', role:'user', department:'Sales', branch:'Accra', country:'Ghana', status:'pending' }
];

export const supportTickets: SupportTicket[] = [
  { id:'tick-1', ticketNumber:'SAT-1001', category:'access request', subject:'Need COPS access', status:'submitted', priority:'medium', portal:'COPS', requester:'Grace Mensah', createdAt:'2026-06-10' },
  { id:'tick-2', ticketNumber:'SAT-1002', category:'documentation issue', subject:'Retail CRM SOP update', status:'in_review', priority:'low', portal:'Satguru Retail CRM', requester:'Rahul Mehta', createdAt:'2026-06-11' }
];
export const categories = Array.from(new Set(portals.map(p => p.category))).map((category, i) => ({ id:`cat-${i+1}`, name:category, description:`${category} portals and tools`, status:'active' }));
export const announcements = [
  { title:'MVP launch foundation', message:'The central portal now provides a governed directory, support flow, and admin-ready management screens.', priority:'high' },
  { title:'Future SSO readiness', message:'Connected application login remains separate until the SSO phase is implemented.', priority:'normal' }
];
export function getPortal(slug: string) { return portals.find((p) => p.slug === slug); }
export function isAllowedEmail(email: string) { const domain = email.split('@')[1]?.toLowerCase(); return allowedDomains.some(d => d.domain === domain && d.status === 'active'); }
