import type { AuthUser } from '@/types';

const TOKEN_KEY = 'ass_token';
const USER_KEY = 'ass_user';

export const setAuth = (token: string, user: AuthUser) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem(USER_KEY);
  try { return u ? JSON.parse(u) : null; } catch { return null; }
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => !!getToken();
export const isAdmin = (): boolean => getUser()?.role === 'admin';
export const isTechnician = (): boolean =>
  ['admin', 'technician'].includes(getUser()?.role ?? '');
