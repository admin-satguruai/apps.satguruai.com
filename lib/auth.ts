import { cookies } from 'next/headers';
import { User } from '@/types';
import { decodeSessionToken } from '@/lib/auth-flow';

export const PRIMARY_SUPER_ADMIN_EMAIL = 'admin@satguruai.com';
export type SessionUser = User;

function readCookie(name: string) {
  return cookies().get(name)?.value;
}

function normalizeStatus(status?: string): User['status'] {
  if (status === 'pending' || status === 'inactive') {
    return status;
  }

  return 'active';
}

export function getEffectiveRole(email: string, role?: string) {
  if (email.toLowerCase() === PRIMARY_SUPER_ADMIN_EMAIL) {
    return 'super_admin' as const;
  }

  return role === 'admin' || role === 'super_admin' ? role : 'user';
}

export function getSessionUser(): SessionUser | null {
  const session = decodeSessionToken(readCookie('satguru_session') || '');

  if (!session || session.status === 'inactive' || session.status === 'disabled') {
    return null;
  }

  return {
    id: `user-${session.email}`,
    name: session.name,
    email: session.email,
    picture: session.picture,
    loginMethod: session.loginMethod,
    role: getEffectiveRole(session.email, session.role),
    department: 'To be updated',
    branch: 'To be updated',
    country: 'To be updated',
    status: normalizeStatus(session.status),
    lastLogin: session.lastLogin
  };
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
