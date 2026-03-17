'use client';
import { useState, useEffect, useRef } from 'react';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

const ACTIVE  = SUPPORTED_LOCALES.filter(l => l.active);
const COMING  = SUPPORTED_LOCALES.filter(l => !l.active).slice(0, 12);

export default function LanguageSelector() {
  const [open,    setOpen]    = useState(false);
  const [current, setCurrent] = useState('en');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('gfm_locale') : null;
    if (stored) setCurrent(stored);

    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(code: string) {
    setCurrent(code);
    setOpen(false);
    if (typeof window !== 'undefined') localStorage.setItem('gfm_locale', code);
    if (code === 'ar') window.location.href = '/ar';
    else if (code === 'en' && window.location.pathname === '/ar') window.location.href = '/';
  }

  const cur = SUPPORTED_LOCALES.find(l => l.code === current) || SUPPORTED_LOCALES[0];

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
          open ? 'border-primary text-primary bg-primary-light' : 'border-slate-200 text-slate-500 hover:border-primary hover:text-primary'
        }`}
        aria-label="Select language"
        aria-expanded={open}>
        <span>{cur.flag}</span>
        <span className="hidden sm:block">{cur.code.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${open?'rotate-180':''}`}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-52 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Now</div>
          </div>
          {ACTIVE.map(l => (
            <button key={l.code} onClick={() => select(l.code)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                current === l.code ? 'bg-primary-light text-primary font-bold' : 'text-slate-600'
              }`}>
              <span className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.name}</span>
                {l.dir === 'rtl' && <span className="text-xs bg-amber-100 text-amber-700 px-1 rounded">RTL</span>}
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase">{l.code}</span>
            </button>
          ))}
          <div className="px-3 py-2 border-t border-slate-100 bg-slate-50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Coming Soon (38 languages)</div>
            <div className="flex flex-wrap gap-1">
              {COMING.map(l => (
                <span key={l.code} className="text-xs bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-mono cursor-not-allowed" title={l.name}>
                  {l.flag}
                </span>
              ))}
            </div>
          </div>
          <div className="px-3 py-2 border-t border-slate-100 text-center">
            <a href="/contact?type=other&message=Request%20language" className="text-xs text-primary hover:underline font-semibold">
              Request a language →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
