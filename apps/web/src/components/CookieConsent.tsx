'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gfm_cookie_consent';

type ConsentState = {
  essential:   true;
  analytics:   boolean;
  accepted_at: string;
} | null;

export function CookieConsent() {
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Show after 1.5s delay
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  function acceptAll() {
    save(true);
  }

  function acceptSelected() {
    save(analytics);
  }

  function rejectNonEssential() {
    setAnalytics(false);
    save(false);
  }

  function save(withAnalytics: boolean) {
    const consent: ConsentState = {
      essential:   true,
      analytics:   withAnalytics,
      accepted_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setVisible(false);
    // Dispatch event for analytics initialization
    window.dispatchEvent(new CustomEvent('gfm:consent', { detail: consent }));
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
        {/* Header */}
        <div className="bg-deep px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍪</span>
            <span className="font-extrabold text-white text-sm">Cookie Preferences</span>
          </div>
          <button onClick={() => setVisible(false)} className="text-white/50 hover:text-white text-lg leading-none transition-colors" aria-label="Close">×</button>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            We use cookies to ensure the platform works correctly and to understand how it's used.
            {' '}<strong className="text-deep">We never use advertising cookies.</strong>
            {' '}See our <a href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</a>.
          </p>

          {expanded && (
            <div className="space-y-3 mb-4 border-t border-slate-100 pt-4">
              {/* Essential */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-deep">Essential Cookies</div>
                  <div className="text-xs text-slate-400 mt-0.5">Authentication, session management, user preferences. Required for platform to function.</div>
                </div>
                <div className="flex-shrink-0 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Always on</div>
              </div>
              {/* Analytics */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-deep">Analytics Cookies</div>
                  <div className="text-xs text-slate-400 mt-0.5">Understand how the platform is used to improve it. No personal data sold.</div>
                </div>
                <button onClick={() => setAnalytics(v => !v)}
                  className={`flex-shrink-0 w-11 h-6 rounded-full relative transition-all ${analytics ? 'bg-primary' : 'bg-slate-200'}`}
                  role="switch" aria-checked={analytics}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${analytics ? 'left-5' : 'left-0.5'}`}/>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button onClick={acceptAll}
              className="gfm-btn-primary text-sm py-2.5 px-5 rounded-xl flex-shrink-0">
              Accept All
            </button>
            <button onClick={rejectNonEssential}
              className="gfm-btn-outline text-sm py-2.5 px-4 rounded-xl flex-shrink-0">
              Essential Only
            </button>
            <button onClick={() => setExpanded(v => !v)}
              className="text-sm text-slate-400 hover:text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all ml-auto">
              {expanded ? 'Hide details' : 'Manage preferences'}
            </button>
            {expanded && (
              <button onClick={acceptSelected}
                className="gfm-btn-outline text-sm py-2.5 px-4 rounded-xl flex-shrink-0">
                Save selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function useCookieConsent() {
  if (typeof window === 'undefined') return { analytics: false };
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return { analytics: stored?.analytics ?? false };
  } catch { return { analytics: false }; }
}
