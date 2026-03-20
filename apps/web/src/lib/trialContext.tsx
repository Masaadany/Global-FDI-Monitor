'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type TrialTier = 'free_trial' | 'soft_locked' | 'professional' | 'enterprise';
export type LockTrigger = 'time' | 'reports' | 'searches' | null;

export interface TrialState {
  tier:              TrialTier;
  daysLeft:          number;      // 0–7 for free_trial
  reportsUsed:       number;      // 0–2 during trial
  searchesUsed:      number;      // 0–3 during trial
  reportsMax:        number;      // 2
  searchesMax:       number;      // 3
  isSoftLocked:      boolean;
  isReadOnly:        boolean;
  isTrialActive:     boolean;
  isProfessional:    boolean;
  // Granular feature access
  canDownload:       boolean;
  canGenerateReport: boolean;
  canExport:         boolean;
  canFilter:         boolean;     // BLOCKED after soft-lock per new spec
  canSearch:         boolean;     // BLOCKED after soft-lock per new spec
  canViewResults:    boolean;     // BLOCKED after soft-lock
  // Lock context
  lockTrigger:       LockTrigger;
  lockReason:        string | null;
  lockMessage:       string | null; // contextual message for redirect
  upgradeUrl:        string;
  demoUrl:           string;
  // Quota tracking
  reportsLeft:       number;
  searchesLeft:      number;
  shouldRedirect:    boolean;     // true immediately upon lock — caller handles redirect
}

interface TrialContextType extends TrialState {
  consumeReport:  () => { allowed: boolean; redirectNow: boolean };
  consumeSearch:  () => { allowed: boolean; redirectNow: boolean };
  submitDemoRequest: () => void;
  refresh: () => void;
}

const DEFAULTS: TrialState = {
  tier:              'free_trial',
  daysLeft:          7,
  reportsUsed:       0,
  searchesUsed:      0,
  reportsMax:        2,
  searchesMax:       3,
  isSoftLocked:      false,
  isReadOnly:        false,
  isTrialActive:     true,
  isProfessional:    false,
  canDownload:       false,
  canGenerateReport: true,
  canExport:         false,
  canFilter:         true,
  canSearch:         true,
  canViewResults:    true,
  lockTrigger:       null,
  lockReason:        null,
  lockMessage:       null,
  upgradeUrl:        '/contact',
  demoUrl:           '/contact?reason=trial_expired',
  reportsLeft:       2,
  searchesLeft:      3,
  shouldRedirect:    false,
};

const TrialContext = createContext<TrialContextType>({
  ...DEFAULTS,
  consumeReport:  () => ({ allowed: true,  redirectNow: false }),
  consumeSearch:  () => ({ allowed: true,  redirectNow: false }),
  submitDemoRequest: () => {},
  refresh: () => {},
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildLockMessage(trigger: LockTrigger, reportsMax: number, searchesMax: number): string {
  switch (trigger) {
    case 'time':
      return 'Your 7-day free trial period has expired.';
    case 'reports':
      return `You have used all ${reportsMax} report downloads included in your free trial.`;
    case 'searches':
      return `You have completed ${searchesMax} search or result views — the limit for your free trial.`;
    default:
      return 'Your free trial has ended.';
  }
}

function buildDemoUrl(trigger: LockTrigger): string {
  const reasons: Record<string, string> = {
    time:    'Your 7-day trial has expired.',
    reports: 'You used all 2 trial report downloads.',
    searches:'You completed 3 trial searches.',
  };
  const msg = trigger ? encodeURIComponent(reasons[trigger] || '') : '';
  return `/contact?reason=trial_expired&trigger=${trigger || 'unknown'}&msg=${msg}`;
}

// ─── Compute state from stored values ────────────────────────────────────────
function computeState(stored: {
  tier?: string;
  reportsUsed?: number;
  searchesUsed?: number;
  registeredAt?: string;
  demoSubmitted?: boolean;
}): TrialState {
  const tier         = (stored.tier || 'free_trial') as TrialTier;
  const isPro        = tier === 'professional' || tier === 'enterprise';
  const reportsMax   = 2;
  const searchesMax  = 3;
  const reportsUsed  = stored.reportsUsed ?? 0;
  const searchesUsed = stored.searchesUsed ?? 0;

  // --- Days left calculation ---
  let daysLeft = 7;
  if (stored.registeredAt) {
    const elapsed = (Date.now() - new Date(stored.registeredAt).getTime()) / 86_400_000;
    daysLeft = Math.max(0, Math.ceil(7 - elapsed));
  }

  // --- Three lock triggers (first to fire wins) ---
  const timeExpired      = !isPro && daysLeft <= 0;
  const reportQuota      = !isPro && reportsUsed  >= reportsMax;
  const searchQuota      = !isPro && searchesUsed >= searchesMax;

  let lockTrigger: LockTrigger = null;
  if (timeExpired)   lockTrigger = 'time';
  else if (reportQuota) lockTrigger = 'reports';
  else if (searchQuota) lockTrigger = 'searches';

  const isSoftLocked = !isPro && lockTrigger !== null;

  const lockReason  = isSoftLocked ? buildLockMessage(lockTrigger, reportsMax, searchesMax) : null;
  const lockMessage = lockReason;
  const demoUrl     = isSoftLocked ? buildDemoUrl(lockTrigger) : '/contact';

  // --- Feature access: ALL interactive features blocked on soft-lock ---
  const canAny = !isSoftLocked;
  return {
    tier,
    daysLeft,
    reportsUsed,
    searchesUsed,
    reportsMax,
    searchesMax,
    isSoftLocked,
    isReadOnly:        isSoftLocked,
    isTrialActive:     tier === 'free_trial' && !isSoftLocked,
    isProfessional:    isPro,
    // Access control — all blocked when soft-locked (per updated spec)
    canDownload:       isPro,
    canGenerateReport: isPro || (canAny && reportsUsed < reportsMax),
    canExport:         isPro,
    canFilter:         !isSoftLocked,        // blocked after lock
    canSearch:         !isSoftLocked,        // blocked after lock
    canViewResults:    !isSoftLocked,        // blocked after lock
    lockTrigger,
    lockReason,
    lockMessage,
    upgradeUrl:        '/contact',
    demoUrl,
    reportsLeft:       Math.max(0, reportsMax - reportsUsed),
    searchesLeft:      Math.max(0, searchesMax - searchesUsed),
    shouldRedirect:    isSoftLocked && !stored.demoSubmitted,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function TrialProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TrialState>(DEFAULTS);

  const load = useCallback(() => {
    try {
      const tier          = localStorage.getItem('gfm_tier')           || 'free_trial';
      const reportsUsed   = parseInt(localStorage.getItem('gfm_reports_used')  || '0', 10);
      const searchesUsed  = parseInt(localStorage.getItem('gfm_searches_used') || '0', 10);
      const registeredAt  = localStorage.getItem('gfm_registered_at')  || new Date().toISOString();
      const demoSubmitted = localStorage.getItem('gfm_demo_submitted') === 'true';
      setState(computeState({ tier, reportsUsed, searchesUsed, registeredAt, demoSubmitted }));
    } catch {
      setState(computeState({}));
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000); // recheck every 30s for day-boundary
    return () => clearInterval(t);
  }, [load]);

  function consumeReport(): { allowed: boolean; redirectNow: boolean } {
    try {
      const used = parseInt(localStorage.getItem('gfm_reports_used') || '0', 10);
      if (state.tier === 'free_trial' && used >= state.reportsMax) {
        return { allowed: false, redirectNow: true };
      }
      const newUsed = used + 1;
      localStorage.setItem('gfm_reports_used', String(newUsed));
      load();
      const newState = computeState({
        tier: state.tier, reportsUsed: newUsed,
        searchesUsed: state.searchesUsed,
        registeredAt: localStorage.getItem('gfm_registered_at') || undefined,
      });
      const redirectNow = newState.isSoftLocked;
      if (redirectNow) setState(newState);
      return { allowed: true, redirectNow };
    } catch { return { allowed: false, redirectNow: false }; }
  }

  function consumeSearch(): { allowed: boolean; redirectNow: boolean } {
    try {
      if (state.isSoftLocked) return { allowed: false, redirectNow: true };
      const used = parseInt(localStorage.getItem('gfm_searches_used') || '0', 10);
      if (state.tier === 'free_trial' && used >= state.searchesMax) {
        return { allowed: false, redirectNow: true };
      }
      const newUsed = used + 1;
      localStorage.setItem('gfm_searches_used', String(newUsed));
      load();
      const newState = computeState({
        tier: state.tier, reportsUsed: state.reportsUsed,
        searchesUsed: newUsed,
        registeredAt: localStorage.getItem('gfm_registered_at') || undefined,
      });
      const redirectNow = newState.isSoftLocked;
      if (redirectNow) setState(newState);
      return { allowed: true, redirectNow };
    } catch { return { allowed: false, redirectNow: false }; }
  }

  function submitDemoRequest() {
    try {
      localStorage.setItem('gfm_demo_submitted', 'true');
      load();
    } catch {}
  }

  return (
    <TrialContext.Provider value={{ ...state, consumeReport, consumeSearch, submitDemoRequest, refresh: load }}>
      {children}
    </TrialContext.Provider>
  );
}

export function useTrial() { return useContext(TrialContext); }
