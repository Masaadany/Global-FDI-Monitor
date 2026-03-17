'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || '';

interface SearchResult {
  type: 'economy'|'company'|'signal'|'report';
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

const STATIC_SUGGESTIONS: SearchResult[] = [
  {type:'economy',title:'United Arab Emirates',subtitle:'GFR 80.0 · FRONTIER · MENA',href:'/country/ARE',badge:'ARE'},
  {type:'economy',title:'Saudi Arabia',subtitle:'GFR 68.1 · HIGH · MENA',href:'/country/SAU',badge:'SAU'},
  {type:'economy',title:'India',subtitle:'GFR 62.3 · MEDIUM · SAS',href:'/country/IND',badge:'IND'},
  {type:'economy',title:'Singapore',subtitle:'GFR 88.5 · FRONTIER #1',href:'/country/SGP',badge:'SGP'},
  {type:'company',title:'Microsoft Corporation',subtitle:'IMS 96 · PLATINUM · Technology',href:'/company-profiles',badge:'MSFT'},
  {type:'company',title:'CATL',subtitle:'IMS 92 · PLATINUM · Manufacturing',href:'/company-profiles',badge:'CATL'},
  {type:'signal', title:'PLATINUM Signal Feed',subtitle:'218+ live signals across 215 economies',href:'/signals',badge:'LIVE'},
  {type:'report', title:'Market Intelligence Brief',subtitle:'5 FIC · 8-12 pages · ~45 seconds',href:'/reports',badge:'MIB'},
];

const TYPE_ICON: Record<string,string> = {economy:'🌍',company:'🏢',signal:'📡',report:'📋'};

export default function GlobalSearch() {
  const [query,   setQuery]   = useState('');
  const [open,    setOpen]    = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const panelRef  = useRef<HTMLDivElement>(null);
  const router    = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); inputRef.current?.focus(); setOpen(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults(STATIC_SUGGESTIONS.slice(0,5)); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/v1/search?q=${encodeURIComponent(query)}&size=6`);
        const data = await res.json();
        if (data.success && data.data?.results?.length) {
          setResults(data.data.results);
        } else {
          // Filter static
          const q = query.toLowerCase();
          setResults(STATIC_SUGGESTIONS.filter(s =>
            s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
          ).slice(0, 6));
        }
      } catch {
        const q = query.toLowerCase();
        setResults(STATIC_SUGGESTIONS.filter(s =>
          s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
        ).slice(0, 6));
      }
      setLoading(false);
    }, 280);
    return () => clearTimeout(timeout);
  }, [query]);

  function select(result: SearchResult) {
    setOpen(false);
    setQuery('');
    router.push(result.href);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
    if (e.key === 'Enter' && query.trim()) {
      setOpen(false);
      router.push(`/signals?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  }

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 transition-all ${open ? 'border-primary bg-primary-light' : 'border-slate-200 bg-white hover:border-primary'}`}
        style={{minWidth:'180px'}}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className={`flex-shrink-0 ${open ? 'text-primary' : 'text-slate-400'}`}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Search…"
          className="bg-transparent text-xs w-full focus:outline-none text-slate-700 placeholder-slate-400"
        />
        {loading && <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0"/>}
      </div>

      {open && (
        <div ref={panelRef}
          className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-72 overflow-hidden">
          {query.trim() === '' && (
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
              Quick Access
            </div>
          )}
          {results.length === 0 && query.trim() !== '' && !loading && (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              No results for &quot;{query}&quot;
            </div>
          )}
          {results.map((r, i) => (
            <button key={i} onClick={() => select(r)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0">
              <span className="text-base flex-shrink-0">{TYPE_ICON[r.type] || '🔍'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-deep truncate">{r.title}</div>
                <div className="text-xs text-slate-400 truncate">{r.subtitle}</div>
              </div>
              {r.badge && (
                <span className="text-xs font-mono font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded flex-shrink-0">
                  {r.badge}
                </span>
              )}
            </button>
          ))}
          <div className="px-3 py-2 border-t border-slate-100 bg-slate-50">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>⌘K to open · Enter to search</span>
              <span className="text-primary font-semibold">{STATIC_SUGGESTIONS.length} items indexed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
