export type PortalStatus = 'live' | 'beta' | 'maintenance' | 'coming_soon' | 'retired' | 'pending_dns';
export type UserRole = 'user' | 'portal_owner' | 'support' | 'admin' | 'super_admin';
export type Portal = { id:string; name:string; slug:string; url:string; category:string; department:string; status:PortalStatus; shortDescription:string; fullDescription:string; owner:string; supportEmail:string; supportPhone?:string; logoUrl?:string; goLiveDate?:string; version?:string; tags:string[]; documents: PortalDocument[]; faqs: PortalFaq[]; };
export type PortalDocument = { id:string; title:string; type:string; version:string; visibility:'logged_in'|'admin'|'public'; url:string; status:'active'|'inactive'; };
export type PortalFaq = { id:string; question:string; answer:string; visibility:'logged_in'|'public'; status:'active'|'inactive'; };
export type User = { id:string; name:string; email:string; role:UserRole; department:string; branch:string; country:string; status:'active'|'pending'|'inactive'; lastLogin?:string; picture?:string; loginMethod?:'google'|'email'|'debug'|string; };
export type AllowedDomain = { id:string; domain:string; description:string; status:'active'|'inactive'; };
export type SupportTicket = { id:string; ticketNumber:string; category:string; subject:string; status:'submitted'|'in_review'|'resolved'; priority:'low'|'medium'|'high'; portal?:string; requester:string; createdAt:string; };
