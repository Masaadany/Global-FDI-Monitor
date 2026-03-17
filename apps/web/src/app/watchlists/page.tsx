'use client';
import { useState, useEffect } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const DEFAULT_WATCHLISTS = [
  {id:'wl_001',name:'MENA Technology',    economies:['ARE','SAU','QAT','EGY'],  sectors:['J','K'],  signals:12,created:'2026-03-01'},
  {id:'wl_002',name:'EAP Manufacturing',  economies:['VNM','IDN','THA','MYS'],  sectors:['C','D'],  signals:8, created:'2026-03-05'},
  {id:'wl_003',name:'Clean Energy Global',economies:['IND','SAU','EGY','MAR'],  sectors:['D'],      signals:9, created:'2026-03-08'},
  {id:'wl_004',name:'SGP & IRL Finance',  economies:['SGP','IRL','NLD','LUX'],  sectors:['K','J'],  signals:6, created:'2026-03-10'},
];

const ECONOMIES = ['ARE','SAU','QAT','EGY','IND','SGP','VNM','IDN','DEU','GBR','USA','CHN','NGA','ZAF','MAR'];
const SECTORS   = [['J','ICT'],['K','Finance'],['D','Energy'],['C','Manufacturing'],['B','Mining'],['H','Logistics']];

const GRADE_COLORS: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

export default function WatchlistsPage() {
  const [watchlists, setWatchlists] = useState(DEFAULT_WATCHLISTS);
  const [active,  setActive]   = useState(DEFAULT_WATCHLISTS[0]);
  const [creating,setCreating] = useState(false);
  const [newName, setNewName]  = useState('');
  const [newEcos, setNewEcos]  = useState<string[]>([]);
  const [newSecs, setNewSecs]  = useState<string[]>([]);
  const { signals: liveSignals, connected } = useRealTimeSignals(20);

  // Filter live signals to active watchlist
  const watchlistSignals = liveSignals.filter(s =>
    active.economies.includes(s.economy?.slice(0,3)||'') ||
    active.sectors.includes(s.sector||'')
  );

  async function createWatchlist() {
    if (!newName) return;
    const token = typeof window!=='undefined' ? localStorage.getItem('gfm_token') : null;
    const newWL = {id:`wl_${Date.now()}`,name:newName,economies:newEcos,sectors:newSecs,signals:0,created:new Date().toISOString().slice(0,10)};
    try {
      await fetch(`${API}/api/v1/watchlists`,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token||''}`},
        body:JSON.stringify({name:newName,economies:newEcos,sectors:newSecs}),
      });
    } catch {}
    setWatchlists(prev=>[...prev,newWL]);
    setActive(newWL); setCreating(false); setNewName(''); setNewEcos([]); setNewSecs([]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Watchlists</span>
        <div className={`flex items-center gap-1.5 text-xs font-bold ml-auto ${connected?'text-emerald-600':'text-slate-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-300'}`}/>
          {connected?'Live signals':'Offline'}
        </div>
        <button onClick={()=>setCreating(true)}
          className="bg-[#0A2540] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">
          + New Watchlist
        </button>
      </div>

      <div className="flex gap-0" style={{height:'calc(100vh - 7rem)'}}>
        {/* Watchlist sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-slate-100 bg-white overflow-y-auto">
          {watchlists.map(wl=>(
            <div key={wl.id} onClick={()=>setActive(wl)}
              className={`px-4 py-3.5 border-b border-slate-50 cursor-pointer transition-all ${active.id===wl.id?'bg-blue-50 border-l-2 border-l-blue-500':'hover:bg-slate-50'}`}>
              <div className="font-bold text-sm text-[#0A2540] mb-1">{wl.name}</div>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {wl.economies.slice(0,4).map(e=>(
                  <span key={e} className="text-xs font-mono bg-blue-50 border border-blue-200 text-blue-700 px-1.5 py-0.5 rounded">{e}</span>
                ))}
              </div>
              <div className="flex gap-3 text-xs text-slate-400">
                <span>{wl.signals} signals</span>
                <span>{wl.sectors.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Watchlist content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-lg text-[#0A2540]">{active.name}</h2>
              <div className="flex flex-wrap gap-1 mt-1">
                {active.economies.map(e=><span key={e} className="text-xs font-mono bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded">{e}</span>)}
                {active.sectors.map(s=><span key={s} className="text-xs bg-violet-50 border border-violet-200 text-violet-700 px-2 py-0.5 rounded font-bold">ISIC {s}</span>)}
              </div>
            </div>
            <button className="text-xs text-red-400 font-bold hover:underline">Delete</button>
          </div>

          {/* Live signals for this watchlist */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-sm text-[#0A2540]">Live Signal Feed</div>
              <span className="text-xs text-slate-400">{watchlistSignals.length} matching</span>
            </div>
            {watchlistSignals.length > 0 ? (
              <div className="space-y-2">
                {watchlistSignals.slice(0,8).map((s,i)=>(
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:GRADE_COLORS[s.grade]||'#6b7280'}}/>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#0A2540] truncate">{s.company}</div>
                      <div className="text-xs text-slate-400">{s.economy} · ISIC {s.sector}</div>
                    </div>
                    <div className="text-xs font-black text-blue-600">${s.capex_m}M</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <div className="text-2xl mb-2">📡</div>
                <div className="text-xs">{connected?'Watching for signals…':'Connecting…'}</div>
              </div>
            )}
          </div>

          {/* Watchlist stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {l:'Total Signals', v:active.signals||watchlistSignals.length},
              {l:'Economies',     v:active.economies.length},
              {l:'Sectors',       v:active.sectors.length},
              {l:'Created',       v:active.created},
            ].map(s=>(
              <div key={s.l} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
                <div className="font-black text-lg text-blue-600">{s.v}</div>
                <div className="text-xs text-slate-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="font-black text-[#0A2540]">New Watchlist</div>
              <button onClick={()=>setCreating(false)} className="text-slate-400 text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Watchlist name</label>
                <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Africa Energy"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Economies (click to add)</label>
                <div className="flex flex-wrap gap-1.5">
                  {ECONOMIES.map(e=>(
                    <button key={e} onClick={()=>setNewEcos(prev=>prev.includes(e)?prev.filter(x=>x!==e):[...prev,e])}
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border transition-all ${newEcos.includes(e)?'bg-blue-600 text-white border-blue-600':'border-slate-200 text-slate-500 hover:border-blue-300'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Sectors</label>
                <div className="flex flex-wrap gap-1.5">
                  {SECTORS.map(([code,name])=>(
                    <button key={code} onClick={()=>setNewSecs(prev=>prev.includes(code)?prev.filter(x=>x!==code):[...prev,code])}
                      className={`text-xs font-bold px-2 py-0.5 rounded border transition-all ${newSecs.includes(code)?'bg-violet-600 text-white border-violet-600':'border-slate-200 text-slate-500 hover:border-violet-300'}`}>
                      {code} {name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={()=>setCreating(false)} className="flex-1 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl">Cancel</button>
                <button onClick={createWatchlist} disabled={!newName}
                  className="flex-1 bg-[#0A2540] text-white font-black py-2.5 rounded-xl hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
