'use client';
import { useState } from 'react';

type WatchEntity = { id: string; type: 'economy'|'company'|'sector'; name: string; code: string; flag?: string; signals_7d: number; latest_signal?: string; grade?: string; alert_min: string; added: string };

const INITIAL_WATCHLIST: WatchEntity[] = [
  {id:'1',type:'economy',name:'United Arab Emirates',    code:'ARE',flag:'🇦🇪',signals_7d:89, latest_signal:'Microsoft $850M data centre confirmed',      grade:'PLATINUM',alert_min:'GOLD',    added:'2025-12-01'},
  {id:'2',type:'economy',name:'Saudi Arabia',             code:'SAU',flag:'🇸🇦',signals_7d:74, latest_signal:'AWS $5.3B cloud region expansion',           grade:'PLATINUM',alert_min:'GOLD',    added:'2025-12-01'},
  {id:'3',type:'economy',name:'India',                    code:'IND',flag:'🇮🇳',signals_7d:68, latest_signal:'Vestas 500MW wind farm Rajasthan',            grade:'GOLD',   alert_min:'GOLD',    added:'2026-01-15'},
  {id:'4',type:'economy',name:'Germany',                  code:'DEU',flag:'🇩🇪',signals_7d:52, latest_signal:'BASF expansion in chemicals cluster',         grade:'SILVER', alert_min:'SILVER',  added:'2026-01-15'},
  {id:'5',type:'company', name:'Microsoft Corporation',   code:'MSFT',          signals_7d:3,  latest_signal:'UAE data centre + Saudi AI partnership deal', grade:'PLATINUM',alert_min:'GOLD',    added:'2026-02-01'},
  {id:'6',type:'company', name:'Siemens Energy',          code:'SIENEN',        signals_7d:2,  latest_signal:'$340M Egypt wind contract confirmed',         grade:'GOLD',   alert_min:'GOLD',    added:'2026-02-01'},
  {id:'7',type:'sector',  name:'Information & Communication Technology',code:'J',signals_7d:342,latest_signal:'MENA tech FDI signals surging — 28% increase', grade:'GOLD', alert_min:'GOLD',   added:'2025-11-15'},
  {id:'8',type:'sector',  name:'Financial & Insurance Activities',      code:'K',signals_7d:187,latest_signal:'GCC Islamic finance investment corridor active',grade:'SILVER',alert_min:'SILVER',added:'2025-11-15'},
];

const GRADE_STYLES: Record<string,string> = {
  PLATINUM:'bg-amber-50 text-amber-700 border-amber-200',
  GOLD:'bg-emerald-50 text-emerald-700 border-emerald-200',
  SILVER:'bg-blue-50 text-blue-700 border-blue-200',
  BRONZE:'bg-slate-100 text-slate-500 border-slate-200',
};

const ENTITY_ICONS: Record<string,string> = { economy:'🌍', company:'🏢', sector:'🏭' };

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [typeFilter, setTypeFilter] = useState<''|'economy'|'company'|'sector'>('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newEntity, setNewEntity] = useState({type:'economy', search:''});

  const filtered = watchlist.filter(e =>
    (!typeFilter || e.type === typeFilter) &&
    (!search || e.name.toLowerCase().includes(search.toLowerCase()))
  );

  function removeEntity(id: string) {
    setWatchlist(prev => prev.filter(e => e.id !== id));
  }

  const totalSignals = watchlist.reduce((s, e) => s + e.signals_7d, 0);
  const ecoCount = watchlist.filter(e => e.type==='economy').length;
  const coCount  = watchlist.filter(e => e.type==='company').length;
  const secCount = watchlist.filter(e => e.type==='sector').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">My Watchlist</span>
        <div className="flex gap-1.5 ml-4">
          {([['','All'],['economy','Economies'],['company','Companies'],['sector','Sectors']] as const).map(([v,l]) => (
            <button key={v} onClick={() => setTypeFilter(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${typeFilter===v ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'}`}>
              {l}
            </button>
          ))}
        </div>
        <input placeholder="Search watchlist…"
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-44 focus:outline-none focus:border-blue-400"
          value={search} onChange={e => setSearch(e.target.value)}/>
        <button onClick={() => setShowAdd(!showAdd)}
          className={`ml-auto px-4 py-2 rounded-lg text-xs font-bold transition-all ${showAdd ? 'bg-blue-600 text-white' : 'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'}`}>
          + Add to Watchlist
        </button>
      </div>

      <div className="p-5 grid grid-cols-[1fr_280px] gap-5">
        <div>
          {/* Add entity panel */}
          {showAdd && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex gap-3 items-end">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Type</label>
                <select className="border border-slate-200 rounded-lg text-xs px-2 py-2 bg-white"
                  value={newEntity.type} onChange={e=>setNewEntity(s=>({...s,type:e.target.value}))}>
                  <option value="economy">Economy (ISO3)</option>
                  <option value="company">Company</option>
                  <option value="sector">Sector (ISIC)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 block mb-1">Search</label>
                <input className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-400"
                  placeholder={newEntity.type==='economy' ? 'e.g. Singapore, Kenya, Poland…' : newEntity.type==='company' ? 'e.g. Nvidia, Vestas, Airbus…' : 'e.g. J — Technology, D — Energy…'}
                  value={newEntity.search} onChange={e=>setNewEntity(s=>({...s,search:e.target.value}))}/>
              </div>
              <button onClick={() => setShowAdd(false)}
                className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Search & Add
              </button>
              <button onClick={() => setShowAdd(false)}
                className="bg-white border border-slate-200 text-slate-500 text-xs px-3 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          )}

          {/* Watchlist items */}
          <div className="space-y-2.5">
            {filtered.map(entity => (
              <div key={entity.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                    {entity.flag ?? ENTITY_ICONS[entity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-sm text-[#0A2540]">{entity.name}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">{entity.code}</span>
                      <span className="text-xs bg-slate-50 border border-slate-100 text-slate-400 px-2 py-0.5 rounded-full capitalize">{entity.type}</span>
                    </div>
                    {entity.latest_signal && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${GRADE_STYLES[entity.grade ?? 'BRONZE']}`}>
                          {entity.grade?.slice(0,4)}
                        </span>
                        <span className="text-xs text-slate-500 truncate">{entity.latest_signal}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-bold text-blue-600">{entity.signals_7d}</span>
                      <span>signals (7d)</span>
                      <span>·</span>
                      <span>Alert min: <span className="font-semibold text-slate-600">{entity.alert_min}</span></span>
                      <span>·</span>
                      <span>Added: {entity.added}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-semibold">
                      Signals →
                    </button>
                    <button onClick={() => removeEntity(entity.id)}
                      className="text-xs bg-white border border-slate-200 text-slate-400 px-2.5 py-1.5 rounded-lg hover:border-red-200 hover:text-red-500 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <div className="text-3xl mb-3">⭐</div>
                <div className="font-semibold">Watchlist is empty for this filter</div>
                <div className="text-sm mt-1">Add economies, companies, or sectors to track their signals</div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">Watchlist Summary</div>
            {[
              {label:'Economies tracked',value:ecoCount,icon:'🌍'},
              {label:'Companies tracked', value:coCount, icon:'🏢'},
              {label:'Sectors tracked',   value:secCount,icon:'🏭'},
              {label:'Signals this week', value:totalSignals,icon:'📡'},
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs text-slate-500 flex-1">{s.label}</span>
                <span className="text-base font-black text-blue-600">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">Quick Add — Suggested</div>
            {[
              {flag:'🇸🇬',name:'Singapore',code:'SGP',type:'economy'},
              {flag:'🇰🇪',name:'Kenya',    code:'KEN',type:'economy'},
              {flag:'🇻🇳',name:'Vietnam',  code:'VNM',type:'economy'},
              {flag:'',   name:'Energy (D)',code:'D',  type:'sector'},
              {flag:'',   name:'Nvidia Corp',code:'NVDA',type:'company'},
            ].map(s => (
              <button key={s.code} className="w-full flex items-center gap-2 py-1.5 text-left hover:bg-slate-50 rounded-lg px-1 transition-colors">
                <span className="text-sm">{s.flag || ENTITY_ICONS[s.type as any]}</span>
                <span className="text-xs text-slate-600 flex-1">{s.name}</span>
                <span className="text-xs text-blue-500 font-bold">+ Add</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
