'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const QUICK_LINKS = [
  { label:'Live Signals',   href:'/signals',   icon:'📡' },
  { label:'GFR Rankings',   href:'/gfr',       icon:'🏆' },
  { label:'Mission Planning',href:'/pmp',       icon:'🎯' },
  { label:'Foresight 2050', href:'/forecast',  icon:'📈' },
  { label:'Generate Report',href:'/reports',   icon:'📋' },
  { label:'Analytics',      href:'/analytics', icon:'📊' },
];

type SearchResult = { type: string; label: string; sublabel?: string; href: string; icon: string };

export default function GlobalSearch() {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selIdx,  setSelIdx]  = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(p => !p);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); setQuery(''); setResults([]); setSelIdx(0); }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await fetchWithAuth(`${API}/api/v1/search?q=${encodeURIComponent(q)}&limit=8`);
      const d = await r.json();
      setResults(d.data?.results || d.results || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  function onKeyDown(e: React.KeyboardEvent) {
    const items = results.length ? results : QUICK_LINKS;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelIdx(i => Math.min(i+1, items.length-1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelIdx(i => Math.max(i-1, 0)); }
    if (e.key === 'Enter') {
      const item = items[selIdx];
      if (item) { window.location.href = item.href; setOpen(false); }
    }
  }

  const displayItems: SearchResult[] = results.length
    ? results
    : QUICK_LINKS.map(l => ({ ...l, type:'nav', sublabel:'' }));

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all"
      style={{background:'rgba(10,61,98,0.08)',border:'1px solid rgba(10,61,98,0.15)',color:'#696969'}}>
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
      </svg>
      <span>Search</span>
      <kbd className="text-xs px-1 py-0.5 rounded" style={{background:'rgba(10,61,98,0.1)',color:'#696969',fontSize:9}}>⌘K</kbd>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}>
      <div className="w-full max-w-lg animate-fadeIn">
        <div className="gfm-card overflow-hidden" style={{border:'1px solid rgba(116,187,101,0.2)'}}>
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b" style={{borderBottomColor:'rgba(10,61,98,0.1)'}}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="#696969">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
            </svg>
            <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={onKeyDown}
              aria-label="Search platform" role="searchbox" placeholder="Search signals, countries, companies, reports…"
              className="flex-1 bg-transparent text-sm outline-none border-0" style={{color:'#0A3D62'}}/>
            {loading && <div className="w-4 h-4 border-2 border-radiance border-t-transparent rounded-full animate-spin"/>}
            <button onClick={()=>setOpen(false)} className="text-fog hover:text-bright text-xl leading-none">×</button>
          </div>

          {/* Results */}
          <div>
            {!query && (
              <div className="px-4 py-2">
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'#696969'}}>Quick Links</div>
              </div>
            )}
            {displayItems.map((item, i) => (
              <Link key={item.href+i} href={item.href} onClick={()=>setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-all ${i===selIdx?'bg-radiance/10':''}`}
                onMouseEnter={()=>setSelIdx(i)}>
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{color: i===selIdx?'#74BB65':'#0A3D62'}}>{item.label}</div>
                  {item.sublabel && <div className="text-xs" style={{color:'#696969'}}>{item.sublabel}</div>}
                </div>
                <span className="text-xs" style={{color:'#696969'}}>{item.type}</span>
              </Link>
            ))}
          </div>

          <div className="px-4 py-2 border-t flex gap-3 text-xs" style={{borderTopColor:'rgba(10,61,98,0.1)',color:'#696969'}}>
            <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
            <span className="ml-auto">⌘K to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
