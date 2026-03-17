'use client';
import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';

const PREVIEW_PASSWORD = process.env.NEXT_PUBLIC_PREVIEW_PASSWORD || 'GFM2026PREVIEW';
const STORAGE_KEY      = 'gfm_preview_auth';

export function PreviewGate({ children }: { children: ReactNode }) {
  const [authed,  setAuthed]  = useState(false);
  const [pwd,     setPwd]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(true);
  const [shake,   setShake]   = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip gate for: login, register, demo, health, pricing, about, privacy, terms, ar
    const path = window.location.pathname;
    const PUBLIC = ['/auth/','/register','/demo','/health','/pricing','/about','/privacy','/terms','/ar','/contact'];
    if (PUBLIC.some(p => path.startsWith(p)) || path === '/') {
      setAuthed(true); setLoading(false); return;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') { setAuthed(true); }
    setLoading(false);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.trim() === PREVIEW_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthed(true); setError('');
    } else {
      setError('Incorrect password. Contact sales@fdimonitor.org for access.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPwd('');
    }
  }

  if (loading) return null;
  if (authed)  return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className={`w-full max-w-sm transition-all ${shake ? 'translate-x-2' : ''}`}
        style={{transition:'transform 0.1s ease'}}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-[#0A2540] text-3xl mx-auto mb-4 shadow-2xl">G</div>
          <h1 className="text-2xl font-black text-white">Global FDI Monitor</h1>
          <p className="text-blue-300 text-sm mt-1">Preview Access Required</p>
        </div>
        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          <div className="text-center mb-5">
            <div className="text-3xl mb-2">🔒</div>
            <h2 className="font-black text-[#0A2540] text-lg">Preview Password</h2>
            <p className="text-slate-400 text-xs mt-1">This platform is in private preview</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <input
              type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
              placeholder="Enter preview password" autoFocus
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-sm tracking-widest focus:outline-none focus:border-blue-400"/>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg text-center font-semibold">
                {error}
              </div>
            )}
            <button type="submit"
              className="w-full bg-[#0A2540] text-white font-black py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
              Access Platform
            </button>
          </form>
          <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2">
            <div className="text-xs text-slate-400">Don't have access?</div>
            <div className="flex gap-2">
              <Link href="/demo"     className="flex-1 text-xs bg-slate-50 border border-slate-200 text-slate-600 font-bold py-2 rounded-xl hover:border-blue-300 transition-colors">
                View Demo
              </Link>
              <Link href="/register" className="flex-1 text-xs bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-500 transition-colors">
                Free Trial
              </Link>
            </div>
            <a href="mailto:sales@fdimonitor.org" className="block text-xs text-blue-600 hover:underline">
              Contact sales@fdimonitor.org
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
