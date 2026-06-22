import { createHmac, randomBytes, randomInt, timingSafeEqual, pbkdf2Sync } from 'crypto';
import nodemailer from 'nodemailer';

export const ALLOWED_DOMAINS = ['satgurutravel.com', 'satguruai.com'];
export const TOKEN_TTL_MS = 10 * 60 * 1000;
export const RESET_TTL_MS = 30 * 60 * 1000;
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const REMEMBER_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function sessionCookieOptions(rememberMe = false) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
    path: '/'
  };
}

export const cookieOptions = sessionCookieOptions(false);

export type SessionPayload = {
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  status?: string;
  picture?: string;
  loginMethod: string;
  lastLogin: string;
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

function cleanEnv(value: string | undefined) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function cleanHost(value: string | undefined) {
  const cleaned = cleanEnv(value)
    .replace(/^https?:\/\//i, '')
    .replace(/^smtp:\/\//i, '')
    .split('/')[0]
    .split(':')[0]
    .trim();

  return cleaned || 'smtp.gmail.com';
}

function authSecret() {
  const configured = cleanEnv(process.env.AUTH_SECRET);
  if (!configured && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET is required in production.');
  }
  return configured || 'development-secret-change-before-production';
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

function normalizeRole(role: unknown): SessionPayload['role'] {
  return role === 'super_admin' || role === 'admin' ? role : 'user';
}

export function createSessionToken(payload: SessionPayload, rememberMe = false) {
  return encodeToken({ purpose: 'session', ...payload, role: normalizeRole(payload.role), rememberMe }, rememberMe ? REMEMBER_SESSION_TTL_MS : SESSION_TTL_MS);
}

export function decodeSessionToken(token: string): SessionPayload | null {
  const payload = decodeToken(token);
  if (!payload || payload.purpose !== 'session') return null;
  const email = normalizeEmail(payload.email);
  if (!email || !isAllowedEmail(email)) return null;
  return {
    email,
    name: String(payload.name || fallbackName(email)),
    role: normalizeRole(payload.role),
    status: String(payload.status || 'active'),
    picture: payload.picture ? String(payload.picture) : undefined,
    loginMethod: String(payload.loginMethod || 'unknown'),
    lastLogin: String(payload.lastLogin || new Date().toISOString())
  };
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

export function verifyPassword(password: string, storedHash?: string | null) {
  const parts = String(storedHash || '').split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') return false;
  const iterations = Number(parts[1]);
  const salt = parts[2];
  const expected = parts[3];
  if (!Number.isFinite(iterations) || !salt || !expected) return false;
  const actual = pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
  return safeEqual(actual, expected);
}

function smtpConfig() {
  const host = cleanHost(process.env.SMTP_HOST);
  const portText = cleanEnv(process.env.SMTP_PORT) || '465';
  const port = Number(portText);
  const secure = cleanEnv(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false';
  const user = cleanEnv(process.env.SMTP_USER);
  const pass = cleanEnv(process.env.SMTP_PASSWORD);
  const from = cleanEnv(process.env.EMAIL_FROM_ADDRESS) || (user ? `Satguru AI <${user}>` : '');

  if (!user) throw new Error('SMTP_USER is not configured. Add SMTP_USER in Vercel Environment Variables.');
  if (!pass) throw new Error('SMTP_PASSWORD is not configured. Add the Google App Password in Vercel Environment Variables.');
  if (!from) throw new Error('EMAIL_FROM_ADDRESS is not configured. Add EMAIL_FROM_ADDRESS in Vercel Environment Variables.');
  if (!Number.isFinite(port)) throw new Error('SMTP_PORT is invalid. Use 465 for Gmail SSL SMTP.');

  return { host, port, secure, user, pass, from };
}

export async function sendEmail(to: string, subject: string, text: string) {
  const config = smtpConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: !config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    },
    tls: {
      servername: config.host
    }
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    text
  });
}
