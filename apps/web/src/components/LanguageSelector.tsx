'use client';
import { useState } from 'react';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

const ACTIVE = SUPPORTED_LOCALES.filter(l => l.active);
const COMING  = SUPPORTED_LOCALES.filter(l => !l.active).slice(0, 8);

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('en');

  const cur = SUPPORTED_LOCALES.find(l => l.code === current) || SUPPORTED_LOCALES[0];

  function select(code: string) {
    setCurrent(code);
    setOpen(false);
    if (code === 'ar') window.location.href = '/ar';
    else if (code === 'en') window.location.href = '/';
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:border-blue-300 transition-colors">
        🌐 {cur.code.toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-56 overflow-hidden">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
            Active Languages
          </div>
          {ACTIVE.map(l => (
            <button key={l.code} onClick={() => select(l.code)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors ${current === l.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'}`}>
              <span>{l.name}</span>
              <span className="text-xs font-mono text-slate-400 uppercase">{l.code}</span>
            </button>
          ))}
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wide border-t border-slate-100">
            Coming Soon (Tier 2–3)
          </div>
          {COMING.map(l => (
            <div key={l.code} className="flex items-center justify-between px-3 py-2 text-sm text-slate-300 cursor-not-allowed">
              <span>{l.name}</span>
              <span className="text-xs bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-bold">Soon</span>
            </div>
          ))}
          <div className="px-3 py-2 border-t border-slate-100 text-xs text-slate-400 text-center">
            40 languages planned · <a href="/contact" className="text-blue-600 hover:underline">Request priority</a>
          </div>
        </div>
      )}
    </div>
  );
}
