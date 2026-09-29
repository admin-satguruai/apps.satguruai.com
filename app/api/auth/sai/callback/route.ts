import { NextResponse } from 'next/server';

import { createSessionToken, fallbackName, isAllowedEmail, normalizeEmail, sessionCookieOptions } from '@/lib/auth-flow';
import { getPortalUserByEmail, upsertPortalUser } from '@/lib/supabase-admin';

type VerifyResponse = Record<string, unknown>;

function cleanEnv(value?: string) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function getOrigin(request: Request) {
  return new URL(request.url).origin;
}

function loginRedirect(request: Request, message: string) {
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, getOrigin(request)));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readNested(source: Record<string, unknown>, keys: string[]) {
  let current: unknown = source;
  for (const key of keys) {
    const record = asRecord(current);
    if (!record) return undefined;
    current = record[key];
  }
  return current;
}

function firstString(source: Record<string, unknown>, paths: string[][]) {
  for (const path of paths) {
    const value = readNested(source, path);
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function firstBoolean(source: Record<string, unknown>, paths: string[][]) {
  for (const path of paths) {
    const value = readNested(source, path);
    if (typeof value === 'boolean') return value;
  }
  return undefined;
}

function safeDetail(error: unknown) {
  return (error instanceof Error ? error.message : String(error || 'Unknown error'))
    .replace(/sai_token=[^&\s]+/gi, 'sai_token=[hidden]')
    .slice(0, 180);
}

async function verifyWithSai(saiToken: string) {
  const verifyUrl = cleanEnv(process.env.SAI_SSO_VERIFY_URL);
  const audience = cleanEnv(process.env.SAI_SSO_AUDIENCE);
  const issuer = cleanEnv(process.env.SAI_SSO_ISSUER);
  const verifySecret = cleanEnv(process.env.SAI_SSO_VERIFY_SECRET);

  if (!verifyUrl) {
    throw new Error('SAI_SSO_VERIFY_URL is not configured.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  if (verifySecret) {
    headers['X-SAI-SSO-Secret'] = verifySecret;
  }

  const response = await fetch(verifyUrl, {
    method: 'POST',
    headers,
    cache: 'no-store',
    body: JSON.stringify({
      sai_token: saiToken,
      ...(audience ? { audience } : {})
    })
  });

  const text = await response.text();
  let payload: VerifyResponse = {};
  try {
    payload = text ? (JSON.parse(text) as VerifyResponse) : {};
  } catch {
    throw new Error(`SAI verification returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok || payload.ok === false || payload.valid === false) {
    const message = firstString(payload, [
      ['message'],
      ['error'],
      ['detail']
    ]);
    throw new Error(message || `SAI verification failed (HTTP ${response.status}).`);
  }

  const returnedAudience = firstString(payload, [
    ['audience'],
    ['aud'],
    ['claims', 'audience'],
    ['claims', 'aud'],
    ['data', 'audience'],
    ['data', 'aud']
  ]);
  const returnedIssuer = firstString(payload, [
    ['issuer'],
    ['iss'],
    ['claims', 'issuer'],
    ['claims', 'iss'],
    ['data', 'issuer'],
    ['data', 'iss']
  ]);

  if (audience && returnedAudience && returnedAudience !== audience) {
    throw new Error('SAI SSO audience mismatch.');
  }

  if (issuer && returnedIssuer && returnedIssuer !== issuer) {
    throw new Error('SAI SSO issuer mismatch.');
  }

  return payload;
}

function extractIdentity(payload: VerifyResponse) {
  const email = normalizeEmail(firstString(payload, [
    ['email'],
    ['user', 'email'],
    ['claims', 'email'],
    ['data', 'email'],
    ['data', 'user', 'email'],
    ['data', 'claims', 'email']
  ]));

  const name = firstString(payload, [
    ['name'],
    ['user', 'name'],
    ['claims', 'name'],
    ['data', 'name'],
    ['data', 'user', 'name'],
    ['data', 'claims', 'name']
  ]);

  const active = firstBoolean(payload, [
    ['active'],
    ['user', 'active'],
    ['data', 'active'],
    ['data', 'user', 'active']
  ]);

  const status = firstString(payload, [
    ['status'],
    ['user', 'status'],
    ['data', 'status'],
    ['data', 'user', 'status']
  ]).toLowerCase();

  return { email, name, active, status };
}

async function completeSaiLogin(request: Request, saiToken: string) {
  if (!saiToken) {
    return loginRedirect(request, 'SAI SSO token is missing.');
  }

  try {
    const verified = await verifyWithSai(saiToken);
    const identity = extractIdentity(verified);

    if (!identity.email || !isAllowedEmail(identity.email)) {
      return loginRedirect(request, 'SAI returned an email that is not allowed for this portal.');
    }

    if (identity.active === false || ['inactive', 'disabled', 'revoked', 'suspended'].includes(identity.status)) {
      return loginRedirect(request, 'Your SAI account is not active.');
    }

    const portalUser = await getPortalUserByEmail(identity.email);
    if (!portalUser) {
      return loginRedirect(request, 'Your SAI identity is valid, but this email is not enabled for this portal.');
    }

    if (portalUser.status === 'inactive' || portalUser.status === 'disabled') {
      return loginRedirect(request, 'Your portal account is inactive. Please contact administrator.');
    }

    const role = portalUser.role === 'super_admin' || portalUser.role === 'admin' ? portalUser.role : 'user';
    const name = identity.name || portalUser.name || fallbackName(identity.email);
    const lastLogin = new Date().toISOString();

    await upsertPortalUser({
      email: identity.email,
      name,
      picture: portalUser.picture || undefined,
      role,
      status: 'active',
      login_method: 'sai_sso',
      last_login: lastLogin
    });

    const sessionToken = createSessionToken({
      email: identity.email,
      name,
      picture: portalUser.picture || undefined,
      role,
      status: 'active',
      loginMethod: 'sai_sso',
      lastLogin
    }, true);

    const response = NextResponse.redirect(new URL('/dashboard', getOrigin(request)));
    response.cookies.set('satguru_session', sessionToken, sessionCookieOptions(true));
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    const detail = safeDetail(error);
    console.error('SAI SSO callback failed:', detail);
    return loginRedirect(request, `SAI single sign-on failed: ${detail}`);
  }
}

export async function GET(request: Request) {
  const saiToken = new URL(request.url).searchParams.get('sai_token') || '';
  return completeSaiLogin(request, saiToken);
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  let saiToken = '';

  if (contentType.includes('application/json')) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    saiToken = String(body.sai_token || body.token || '');
  } else {
    const form = await request.formData().catch(() => null);
    saiToken = String(form?.get('sai_token') || form?.get('token') || '');
  }

  return completeSaiLogin(request, saiToken);
}
