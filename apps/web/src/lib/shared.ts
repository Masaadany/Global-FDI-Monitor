/**
 * GFM Shared Utilities
 * Auth, API fetching, formatting helpers.
 */
'use client';

const API = process.env.NEXT_PUBLIC_API_URL || '';

// ── Types ─────────────────────────────────────────────────────────────────
export interface GFMUser {
  id:         string;
  email:      string;
  full_name:  string;
  role:       string;
}

export interface GFMOrg {
  id:          string;
  name:        string;
  tier:        'free_trial' | 'professional' | 'enterprise';
  fic_balance: number;
}

// ── Auth ─────────────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gfm_token');
}

export function getUser(): GFMUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('gfm_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function getOrg(): GFMOrg | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('gfm_org');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  ['gfm_token', 'gfm_refresh', 'gfm_user', 'gfm_org'].forEach(k => localStorage.removeItem(k));
}

export async function refreshAuth(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const refresh = localStorage.getItem('gfm_refresh');
  if (!refresh) return false;
  try {
    const r = await fetch(`${API}/api/v1/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh_token: refresh }),
    });
    if (!r.ok) { clearAuth(); return false; }
    const d = await r.json();
    localStorage.setItem('gfm_token', d.access_token || d.data?.access_token || '');
    return true;
  } catch { clearAuth(); return false; }
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  let res = await fetch(url, { ...options, headers });

  // Try refresh on 401
  if (res.status === 401) {
    const refreshed = await refreshAuth();
    if (refreshed) {
      const newToken = getToken();
      if (newToken) headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, { ...options, headers });
    }
  }
  return res;
}

// ── Formatters ────────────────────────────────────────────────────────────
export function formatFIC(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K FIC`;
  return `${n} FIC`;
}

export function formatCapex(usd: number): string {
  if (usd >= 1e9)  return `$${(usd / 1e9).toFixed(1)}B`;
  if (usd >= 1e6)  return `$${(usd / 1e6).toFixed(0)}M`;
  if (usd >= 1e3)  return `$${(usd / 1e3).toFixed(0)}K`;
  return `$${usd}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)     return `${s}s ago`;
  if (s < 3600)   return `${Math.floor(s / 60)}m ago`;
  if (s < 86400)  return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
