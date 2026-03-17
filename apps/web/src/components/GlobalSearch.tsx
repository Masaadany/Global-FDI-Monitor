'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const QUICK_LINKS = [
  {label:'UAE Signals',     href:'/signals?economy=ARE',    icon:'📡'},
  {label:'GFR Rankings',    href:'/gfr',                    icon:'🏆'},
  {label:'Generate Report', href:'/reports',                icon:'📋'},
  {label:'Dashboard',       href:'/dashboard',              icon:'📊'},
  {label:'Mission Planning',href:'/pmp',                    icon:'🎯'},
  {label:'Forecast',        href:'/forecast',               icon:'🔮'},
];

const ECONOMY_SEARCH = [
  {iso3:'ARE',name:'United Arab Emirates',region:'MENA'},
  {iso3:'SAU',name:'Saudi Arabia',region:'MENA'},
  {iso3:'IND',name:'India',region:'SAS'},
  {iso3:'SGP',name:'Singapore',region:'EAP'},
  {iso3:'DEU',name:'Germany',region:'ECA'},
  {iso3:'USA',name:'United States',region:'NAM'},
  {iso3:'GBR',name:'United Kingdom',region:'ECA'},
  {iso3:'CHN',name:'China',region:'EAP'},
  {iso3:'VNM',name:'Vietnam',region:'EAP'},
  {iso3:'NGA',name:'Nigeria',region:'SSA'},
  {iso3:'EGY',name:'Egypt',region:'MENA'},
  {iso3:'BRA',name:'Brazil',region:'LAC'},
];

export function GlobalSearch() {
  const [open,    setOpen]   = useState(false);
  const [query,   setQuery]  = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const results = query.length > 1
    ? ECONOMY_SEARCH.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.iso3.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="hidden md:flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:border-blue-300 transition-colors">
      <span>🔍</span>
      <span>Search…</span>
      <kbd className="ml-2 bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-mono text-xs">⌘K</kbd>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <span className="text-slate-400">🔍</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search economies, signals, reports…"
            className="flex-1 text-sm focus:outline-none text-[#0A2540]"/>
          <button onClick={() => setOpen(false)}
            className="text-xs text-slate-400 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">
            ESC
          </button>
        </div>

        {results.length > 0 ? (
          <div className="p-2 max-h-72 overflow-y-auto">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wide px-2 py-1.5">Economies</div>
            {results.map(e => (
              <Link key={e.iso3} href={`/gfr?search=${e.iso3}`} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded w-12 text-center">
                  {e.iso3}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#0A2540]">{e.name}</div>
                  <div className="text-xs text-slate-400">{e.region}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-3">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wide px-2 py-1.5 mb-1">Quick Access</div>
            <div className="grid grid-cols-2 gap-1">
              {QUICK_LINKS.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm text-slate-600">
                  <span>{l.icon}</span>{l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
