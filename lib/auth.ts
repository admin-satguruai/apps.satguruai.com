import { cookies } from 'next/headers';
import { User } from '@/types';

export type SessionUser = User;

function readCookie(name: string) {
  return cookies().get(name)?.value;
}

function decodeValue(value?: string) {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function fallbackName(email: string) {
  const localPart = email.split('@')[0] || 'Satguru User';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getSessionUser(): SessionUser | null {
  const session = readCookie('satguru_session');
  const email = decodeValue(readCookie('satguru_user_email')).toLowerCase();

  if (!session || !email) {
    return null;
  }

  const name = decodeValue(readCookie('satguru_user_name')) || fallbackName(email);
  const picture = decodeValue(readCookie('satguru_user_picture')) || undefined;
  const loginMethod = decodeValue(readCookie('satguru_login_method')) || session;
  const lastLogin = decodeValue(readCookie('satguru_last_login')) || new Date().toISOString();
  const role = (decodeValue(readCookie('satguru_role')) || 'user') as SessionUser['role'];

  return {
    id: `google-${email}`,
    name,
    email,
    picture,
    loginMethod,
    role,
    department: 'Auto-created by Google login',
    branch: 'To be updated',
    country: 'To be updated',
    status: 'active',
    lastLogin
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
