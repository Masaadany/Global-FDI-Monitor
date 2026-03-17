/**
 * GFM Shared Utilities
 * Auth helpers, user state, and common types.
 */

const API = process.env.NEXT_PUBLIC_API_URL || '';

export interface GFMUser { id:string; email:string; full_name:string; role:string; }
export interface GFMOrg  { id:string; name:string; tier:string; fic_balance:number; trial_end?:string; trial_expired?:boolean; }

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gfm_token');
}

export function getUser(): GFMUser | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('gfm_user') || 'null'); } catch { return null; }
}

export function getOrg(): GFMOrg | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('gfm_org') || 'null'); } catch { return null; }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token || token === 'demo_token') return false;
  try {
    const parts   = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? payload.exp * 1000 > Date.now() : true;
  } catch { return false; }
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  ['gfm_token','gfm_refresh','gfm_user','gfm_org','gfm_demo'].forEach(k => localStorage.removeItem(k));
}

export async function refreshAuth(): Promise<boolean> {
  const refresh = typeof window !== 'undefined' ? localStorage.getItem('gfm_refresh') : null;
  if (!refresh) return false;
  try {
    const res  = await fetch(`${API}/api/v1/auth/refresh`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ refresh_token: refresh }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('gfm_token', data.data.access_token);
      return true;
    }
    return false;
  } catch { return false; }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = { 'Content-Type':'application/json', ...options.headers,
    ...(token ? { Authorization:`Bearer ${token}` } : {}) };
  const res = await fetch(`${API}${url}`, { ...options, headers });
  if (res.status === 401) {
    const refreshed = await refreshAuth();
    if (refreshed) {
      const newToken = getToken();
      return fetch(`${API}${url}`, { ...options, headers:{...headers,Authorization:`Bearer ${newToken}`} });
    }
  }
  return res;
}

export function formatFIC(n: number): string {
  return n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);
}

export function formatCapex(usd: number): string {
  if (usd >= 1e9) return `$${(usd/1e9).toFixed(1)}B`;
  if (usd >= 1e6) return `$${(usd/1e6).toFixed(0)}M`;
  return `$${usd.toLocaleString()}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'just now';
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)   return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
