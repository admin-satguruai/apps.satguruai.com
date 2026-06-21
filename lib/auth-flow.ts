import { createHmac, randomBytes, randomInt, timingSafeEqual, pbkdf2Sync } from 'crypto';

export const ALLOWED_DOMAINS = ['satgurutravel.com', 'satguruai.com'];
export const TOKEN_TTL_MS = 10 * 60 * 1000;
export const RESET_TTL_MS = 30 * 60 * 1000;

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60,
  path: '/'
};

export function isAllowedEmail(email: string) {
  return ALLOWED_DOMAINS.some((domain) => email.toLowerCase().endsWith(`@${domain}`));
}

export function normalizeEmail(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

export function safeCookieValue(value: string) {
  return encodeURIComponent(value).slice(0, 3500);
}

export function fallbackName(email: string) {
  const local = email.split('@')[0] || 'Satguru User';
  return local.split(/[._-]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function authSecret() {
  return process.env.AUTH_SECRET || process.env.EMAIL_PROVIDER_API_KEY || process.env.RESEND_API_KEY || 'development-secret-change-before-production';
}

export function sign(value: string) {
  return createHmac('sha256', authSecret()).update(value).digest('hex');
}

export function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function encodeToken(payload: Record<string, unknown>, ttlMs: number) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ttlMs })).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function decodeToken(token: string) {
  const [body, signature] = String(token || '').split('.');
  if (!body || !signature || !safeEqual(sign(body), signature)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Record<string, unknown>;
    const exp = Number(payload.exp || 0);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function makeOtp() {
  return String(randomInt(100000, 1000000));
}

export function validatePassword(password: string) {
  const issues: string[] = [];
  if (password.length < 8) issues.push('minimum 8 characters');
  if (!/[A-Z]/.test(password)) issues.push('one uppercase letter');
  if (!/[a-z]/.test(password)) issues.push('one lowercase letter');
  if (!/[0-9]/.test(password)) issues.push('one number');
  if (!/[^A-Za-z0-9]/.test(password)) issues.push('one special character');
  return issues;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
  return `pbkdf2_sha256$120000$${salt}$${hash}`;
}

export async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY || process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM_ADDRESS || process.env.RESEND_FROM_EMAIL;
  if (!apiKey) throw new Error('Email provider is not configured. Add EMAIL_PROVIDER_API_KEY or RESEND_API_KEY in Vercel Environment Variables.');
  if (!from) throw new Error('Sender email is not configured. Add EMAIL_FROM_ADDRESS or RESEND_FROM_EMAIL in Vercel Environment Variables.');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text })
  });

  if (!response.ok) throw new Error(`Email could not be sent. Provider response: ${await response.text()}`);
}
