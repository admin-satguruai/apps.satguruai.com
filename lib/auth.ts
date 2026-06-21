import { cookies } from 'next/headers';
import { User } from '@/types';
import { decodeSessionToken, fallbackName } from '@/lib/auth-flow';

export const PRIMARY_SUPER_ADMIN_EMAIL = 'admin@satguruai.com';
export type SessionUser = User;

function readCookie(name: string) {
  return cookies().get(name)?.value;
}

export function getEffectiveRole(email: string, tokenRole?: string) {
  if (email.toLowerCase() === PRIMARY_SUPER_ADMIN_EMAIL) {
    return 'super_admin' as const;
  }

  return (tokenRole || 'user') as SessionUser['role'];
}

export function getSessionUser(): SessionUser | null {
  const payload = decodeSessionToken(readCookie('satguru_session') || '');

  if (!payload) {
    return null;
  }

  const email = payload.email.toLowerCase();
  const role = getEffectiveRole(email, payload.role);

  return {
    id: `satguru-${email}`,
    name: payload.name || fallbackName(email),
    email,
    picture: payload.picture,
    loginMethod: payload.loginMethod,
    role,
    department: payload.department || 'To be updated',
    branch: payload.branch || 'To be updated',
    country: payload.country || 'To be updated',
    status: 'active',
    lastLogin: payload.lastLogin
  };
}

export function isAdminRole(role?: string | null) {
  return role === 'admin' || role === 'super_admin';
}

export function getUsersWithSessionUser(seedUsers: User[]) {
  const sessionUser = getSessionUser();

  if (!sessionUser) {
    return seedUsers;
  }

  const existingIndex = seedUsers.findIndex((user) => user.email.toLowerCase() === sessionUser.email.toLowerCase());

  if (existingIndex >= 0) {
    return seedUsers.map((user, index) => (index === existingIndex ? { ...user, ...sessionUser, role: user.role || sessionUser.role } : user));
  }

  return [sessionUser, ...seedUsers];
}
