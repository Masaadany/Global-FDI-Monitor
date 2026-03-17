'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ROUTES = [
  {path:'/dashboard',         label:'Dashboard',           icon:'🗂',  type:'page'},
  {path:'/signals',           label:'Signal Monitor',      icon:'📡',  type:'page'},
  {path:'/gfr',               label:'GFR Rankings',        icon:'🏆',  type:'page'},
  {path:'/analytics',         label:'Analytics & Globe',   icon:'📊',  type:'page'},
  {path:'/reports',           label:'Custom Reports',      icon:'📋',  type:'page'},
  {path:'/pmp',               label:'Mission Planning',    icon:'🎯',  type:'page'},
  {path:'/forecast',          label:'Forecast',            icon:'🔮',  type:'page'},
  {path:'/investment-pipeline',label:'Investment Pipeline',icon:'💼',  type:'page'},
  {path:'/company-profiles',  label:'Company Profiles',    icon:'🏢',  type:'page'},
  {path:'/market-insights',   label:'Market Insights',     icon:'💡',  type:'page'},
  {path:'/watchlists',        label:'Watchlists',          icon:'👁',  type:'page'},
  {path:'/benchmarking',      label:'Benchmarking',        icon:'📐',  type:'page'},
  {path:'/scenario-planner',  label:'Scenario Planner',    icon:'🧩',  type:'page'},
  {path:'/corridor-intelligence',label:'Corridor Intel',   icon:'🔗',  type:'page'},
  {path:'/pricing',           label:'Pricing',             icon:'💳',  type:'page'},
  {path:'/fic',               label:'Buy FIC Credits',     icon:'⭐',  type:'page'},
  // Economies quick links
  {path:'/gfr?iso3=ARE',      label:'UAE — GFR Profile',   icon:'🇦🇪',  type:'economy'},
  {path:'/gfr?iso3=SAU',      label:'Saudi Arabia — GFR',  icon:'🇸🇦',  type:'economy'},
  {path:'/gfr?iso3=IND',      label:'India — GFR Profile', icon:'🇮🇳',  type:'economy'},
  {path:'/gfr?iso3=SGP',      label:'Singapore — GFR',     icon:'🇸🇬',  type:'economy'},
  {path:'/gfr?iso3=DEU',      label:'Germany — GFR',       icon:'🇩🇪',  type:'economy'},
  {path:'/gfr?iso3=USA',      label:'United States — GFR', icon:'🇺🇸',  type:'economy'},
  // Signals quick actions
  {path:'/signals?grade=PLATINUM',label:'Platinum Signals',icon:'⭐',  type:'signal'},
  {path:'/signals?grade=GOLD',    label:'Gold Signals',    icon:'🥇',  type:'signal'},
  {path:'/reports?type=CEGP',     label:'Generate Country Profile',icon:'📋',type:'action'},
  {path:'/reports?type=MIB',      label:'Generate Market Brief',   icon:'⚡',type:'action'},
];

export default function GlobalSearch() {
  const [open,   setOpen]   = useState(false);
  const [query,  setQuery]  = useState('');
  const [cursor, setCursor] = useState(0);
  const router   = useRouter();
  const API      = process.env.NEXT_PUBLIC_API_URL || '';
  const [apiResults, setApiResults] = useState<any[]>([]);
  const API_SEARCH = true;
  const inputRef = useRef<HTMLInputElement>(null);

  // Live API search (debounced)
  useEffect(() => {
    if (query.length < 2) { setApiResults([]); return; }
    const id = setTimeout(() => {
      fetch(`${API}/api/v1/search?q=${encodeURIComponent(query)}`)
        .then(r=>r.json())
        .then(d=>{ if(d.success) setApiResults(d.data?.results||[]); })
        .catch(()=>{});
    }, 300);
    return () => clearTimeout(id);
  }, [query, API]);

  const filtered = query.length < 1 ? ROUTES.slice(0, 8) :
    [
      ...apiResults.map(r => ({path:r.url,label:r.label,icon:r.icon,type:r.type})),
      ...ROUTES.filter(r => r.label.toLowerCase().includes(query.toLowerCase())),
    ].filter((r,i,a) => a.findIndex(x=>x.path===r.path)===i).slice(0,10);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(''); setCursor(0); }
  }, [open]);

  function navigate(path: string) {
    router.push(path);
    setOpen(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c+1, filtered.length-1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c-1, 0)); }
    if (e.key === 'Enter' && filtered[cursor]) navigate(filtered[cursor].path);
  }

  const TYPE_COLORS: Record<string,string> = {
    page:'bg-blue-900 text-blue-300',
    economy:'bg-amber-900 text-amber-300',
    signal:'bg-emerald-900 text-emerald-300',
    action:'bg-violet-900 text-violet-300',
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-900/40 border border-blue-800 rounded-lg px-3 py-1.5 text-xs text-blue-400 hover:border-blue-600 transition-colors">
        <span>🔍</span>
        <span>Search</span>
        <span className="bg-blue-900 px-1.5 py-0.5 rounded text-[10px] font-mono ml-1">⌘K</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center pt-20 z-50 px-4"
          onClick={() => setOpen(false)}>
          <div className="bg-[#0d1f35] rounded-2xl border border-blue-700 w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-blue-900">
              <span className="text-blue-400">🔍</span>
              <input ref={inputRef} value={query} onChange={e=>{ setQuery(e.target.value); setCursor(0); }}
                onKeyDown={handleKey} placeholder="Search pages, economies, signals…"
                className="flex-1 bg-transparent text-white placeholder-blue-600 text-sm focus:outline-none"/>
              <button onClick={() => setOpen(false)} className="text-blue-600 hover:text-blue-400 text-xs font-bold">ESC</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filtered.map((r, i) => (
                <div key={r.path} onClick={() => navigate(r.path)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-blue-900/50 ${
                    i === cursor ? 'bg-blue-800/50' : 'hover:bg-blue-900/30'
                  }`}>
                  <span className="text-xl w-7 flex-shrink-0">{r.icon}</span>
                  <span className="flex-1 text-sm text-white">{r.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${TYPE_COLORS[r.type]}`}>{r.type}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-blue-900 flex gap-3 text-xs text-blue-700">
              <span>↑↓ navigate</span><span>↵ select</span><span>ESC close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
