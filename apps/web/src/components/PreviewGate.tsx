'use client';
import { useState, useEffect } from 'react';

const ACCESS_CODE = 'GFM2026PREVIEW';
const STORAGE_KEY = 'preview_access';

export function PreviewGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode]         = useState('');
  const [error, setError]       = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already unlocked
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setUnlocked(true);
    }
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setUnlocked(true);
    } else {
      setError(true);
      setCode('');
      setTimeout(() => setError(false), 2000);
    }
  }

  // Still checking localStorage — show nothing to avoid flash
  if (checking) return null;

  // Unlocked — show the real site
  if (unlocked) return <>{children}</>;

  // Locked — show password gate
  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-[#0A2540] text-2xl mx-auto mb-4">G</div>
          <h1 className="text-3xl font-black text-white">Global FDI Monitor</h1>
          <p className="text-blue-300 mt-2 text-sm">World&apos;s First Fully Integrated Investment Intelligence Platform</p>
        </div>

        {/* Gate card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-lg font-bold text-[#0A2540] mb-1">Private Preview</div>
          <p className="text-slate-400 text-sm mb-6">This platform is currently in private preview. Enter your access code to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter access code"
              value={code}
              onChange={e => setCode(e.target.value)}
              autoFocus
              className={`w-full border-2 rounded-xl px-4 py-3 text-center text-sm font-mono tracking-widest focus:outline-none transition-colors ${
                error
                  ? 'border-red-400 bg-red-50 text-red-600 placeholder-red-300'
                  : 'border-slate-200 focus:border-[#1D4ED8]'
              }`}
            />
            {error && (
              <p className="text-red-500 text-xs font-semibold">Incorrect access code. Please try again.</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors"
            >
              Access Platform
            </button>
          </form>

          <p className="text-slate-300 text-xs mt-6">
            Don&apos;t have an access code?{' '}
            <a href="mailto:info@fdimonitor.org" className="text-blue-600 hover:underline font-semibold">
              Request access
            </a>
          </p>
        </div>

        <p className="text-blue-900 text-xs mt-6">
          &copy; 2026 Global FDI Monitor. All rights reserved.
        </p>
      </div>
    </div>
  );
}
