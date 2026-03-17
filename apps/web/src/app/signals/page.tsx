'use client';
import { exportSignals } from '@/lib/export';
import { getPresets, savePreset, deletePreset, BUILTIN_PRESETS } from '@/lib/filterPresets';
import { useState, useEffect } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const GRADE_COLORS: Record<string,{bg:string,text:string,border:string}> = {
  PLATINUM:{bg:'bg-amber-100', text:'text-amber-700',  border:'border-amber-300'},
  GOLD:    {bg:'bg-emerald-100',text:'text-emerald-700',border:'border-emerald-300'},
  SILVER:  {bg:'bg-blue-100',  text:'text-blue-700',   border:'border-blue-300'},
  BRONZE:  {bg:'bg-slate-100', text:'text-slate-600',  border:'border-slate-300'},
};
const GRADE_DOT: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

const STATIC_SIGNALS = [
  {id:'MSS-GFS-ARE-20260317-0001',grade:'PLATINUM',company:'Microsoft Corp',hq:'USA',economy:'UAE',iso3:'ARE',sector:'J',capex_usd:850000000,sci_score:91.2,signal_type:'Greenfield',status:'CONFIRMED',signal_date:'2026-03-17',description:'Microsoft announces $850M greenfield data centre in Dubai South, creating 2,400 direct jobs. Part of $5B regional investment commitment through 2028.',provenance:{source:'Reuters/GFM Signal Engine',hash:'sha256:a3f12b8c',tier:'T1',verified:true}},
  {id:'MSS-CES-SAU-20260317-0002',grade:'PLATINUM',company:'Amazon Web Services',hq:'USA',economy:'Saudi Arabia',iso3:'SAU',sector:'J',capex_usd:5300000000,sci_score:88.4,signal_type:'Expansion',status:'ANNOUNCED',signal_date:'2026-03-17',description:'AWS confirms $5.3B expansion of Saudi Arabia cloud infrastructure. Three additional availability zones to be built by 2027. NEOM integration included.',provenance:{source:'FT/GFM Signal Engine',hash:'sha256:b8e23f1a',tier:'T1',verified:true}},
  {id:'MSS-GFS-EGY-20260317-0003',grade:'PLATINUM',company:'Siemens Energy',hq:'DEU',economy:'Egypt',iso3:'EGY',sector:'D',capex_usd:340000000,sci_score:86.1,signal_type:'JV',status:'CONFIRMED',signal_date:'2026-03-17',description:'Siemens Energy signs JV agreement with Egyptian Electricity Holding Company for 600MW wind farm in Gulf of Suez. Ground-breaking June 2026.',provenance:{source:'Bloomberg/GFM Signal Engine',hash:'sha256:c9d14e2b',tier:'T1',verified:true}},
  {id:'MSS-CES-VNM-20260317-0004',grade:'GOLD',company:'Samsung Electronics',hq:'KOR',economy:'Vietnam',iso3:'VNM',sector:'C',capex_usd:2800000000,sci_score:83.7,signal_type:'Expansion',status:'CONFIRMED',signal_date:'2026-03-16',description:'Samsung commits $2.8B to expand semiconductor packaging facility in Thai Nguyen province. Part of Vietnam-Korea strategic investment MoU.',provenance:{source:'KOTRA/GFM Signal Engine',hash:'sha256:d2e45f3c',tier:'T1',verified:true}},
  {id:'MSS-GFS-IND-20260317-0005',grade:'PLATINUM',company:'Vestas Wind Systems',hq:'DNK',economy:'India',iso3:'IND',sector:'D',capex_usd:420000000,sci_score:85.9,signal_type:'Greenfield',status:'ANNOUNCED',signal_date:'2026-03-16',description:'Vestas announces 800MW wind turbine manufacturing facility in Rajasthan. Site selection complete; grid connection study approved by RRECL.',provenance:{source:'Economic Times/GFM Signal Engine',hash:'sha256:e3f56a4d',tier:'T1',verified:true}},
  {id:'MSS-GFS-IDN-20260317-0008',grade:'GOLD',company:'CATL',hq:'CHN',economy:'Indonesia',iso3:'IDN',sector:'C',capex_usd:3200000000,sci_score:85.4,signal_type:'Greenfield',status:'COMMITTED',signal_date:'2026-03-14',description:'CATL battery gigafactory in Karawang, West Java confirmed. Land acquisition complete. Phase 1 operational Q3 2027. 10,000 jobs.',provenance:{source:'BKPM/GFM Signal Engine',hash:'sha256:f4a67b5e',tier:'T1',verified:true}},
  {id:'MSS-GFS-SGP-20260317-0007',grade:'GOLD',company:'Databricks',hq:'USA',economy:'Singapore',iso3:'SGP',sector:'J',capex_usd:150000000,sci_score:79.3,signal_type:'Platform',status:'ANNOUNCED',signal_date:'2026-03-15',description:'Databricks establishes APAC regional HQ in Singapore, committing $150M to data lakehouse infrastructure and local R&D centre.',provenance:{source:'EDB Singapore/GFM Signal Engine',hash:'sha256:1b2c3d4e',tier:'T1',verified:true}},
  {id:'MSS-PLA-ARE-20260317-0006',grade:'SILVER',company:'BlackRock Inc',hq:'USA',economy:'UAE',iso3:'ARE',sector:'K',capex_usd:500000000,sci_score:74.2,signal_type:'Platform',status:'RUMOURED',signal_date:'2026-03-16',description:'BlackRock in discussions with ADGM regarding $500M regional investment management platform. MoU expected within 30 days.',provenance:{source:'GFM Intelligence',hash:'sha256:2c3d4e5f',tier:'T6',verified:false}},
  {id:'MSS-GFS-MAR-20260316-0009',grade:'GOLD',company:'ACWA Power',hq:'SAU',economy:'Morocco',iso3:'MAR',sector:'D',capex_usd:1100000000,sci_score:82.1,signal_type:'Greenfield',status:'CONFIRMED',signal_date:'2026-03-16',description:'ACWA Power signs EPC contract for 1.8GW solar-storage complex in Midelt, Morocco. Financing from IFC and Islamic Development Bank.',provenance:{source:'ONEE/GFM Signal Engine',hash:'sha256:3d4e5f6a',tier:'T1',verified:true}},
  {id:'MSS-GFS-NGA-20260315-0010',grade:'SILVER',company:'Microsoft Corp',hq:'USA',economy:'Nigeria',iso3:'NGA',sector:'J',capex_usd:120000000,sci_score:71.4,signal_type:'Platform',status:'ANNOUNCED',signal_date:'2026-03-15',description:'Microsoft Africa Development Centre expansion: $120M skills training and cloud adoption programme. 900,000 people to be trained by 2028.',provenance:{source:'Microsoft/GFM Signal Engine',hash:'sha256:4e5f6a7b',tier:'T1',verified:true}},
];

const SIGNAL_TYPES = ['','Greenfield','Expansion','M&A','JV','Platform','Committed'];
const STATUSES     = ['','CONFIRMED','ANNOUNCED','RUMOURED','COMPLETED'];


const PRESETS = [
  {name:'MENA Tech',  grade:'PLATINUM',sector:'J',economy:'',status:''},
  {name:'Energy',     grade:'',        sector:'D',economy:'',status:'CONFIRMED'},
  {name:'Committed',  grade:'',        sector:'', economy:'',status:'COMMITTED'},
  {name:'Vietnam',    grade:'',        sector:'', economy:'Vietnam',status:''},
];
export default function SignalsPage() {
  const [grade,   setGrade]   = useState('');
  const [sector,  setSector]  = useState('');
  const [type,    setType]    = useState('');
  const [status,  setStatus]  = useState('');
  const [search,  setSearch]  = useState('');
  const [selected,setSelected]= useState<typeof STATIC_SIGNALS[0]|null>(null);
  const [showLive,setShowLive]= useState(false);
  const [presets,  setPresets]  = useState(() => typeof window !== 'undefined' ? getPresets() : []);
  const [showSave, setShowSave] = useState(false);
  const [presetName,setPresetName]=useState('');

  const { signals: liveSignals, connected, totalSeen } = useRealTimeSignals(15);

  // Merge live + static
  const allSignals = showLive
    ? [...liveSignals.map(ls => ({
        ...ls,
        id: ls.reference_code,
        company: ls.company, economy: ls.economy,
        iso3: ls.economy?.slice(0,3)||'GLB',
        capex_usd: (ls.capex_m||0)*1_000_000,
        sci_score: ls.sci_score,
        signal_type: ls.sector==='J'?'Greenfield':'Expansion',
        status: 'CONFIRMED',
        signal_date: new Date().toISOString().slice(0,10),
        description: `Live signal detected via WebSocket stream. ${ls.grade} grade · ISIC ${ls.sector} · SCI ${ls.sci_score}`,
        provenance: ls.provenance || {source:'GFM Real-Time Engine',hash:'live',tier:'T6',verified:true},
      }))]
    : STATIC_SIGNALS;

  const filtered = allSignals.filter(s=>
    (!grade  || s.grade===grade) &&
    (!sector || s.sector===sector) &&
    (!type   || s.signal_type===type) &&
    (!status || s.status===status) &&
    (!search || s.company.toLowerCase().includes(search.toLowerCase()) ||
                s.economy.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Signal Monitor</span>
        {/* Grade filters */}
        <div className="flex gap-1 ml-2">
          {['','PLATINUM','GOLD','SILVER','BRONZE'].map(g=>{
            const sc = g ? GRADE_COLORS[g] : null;
            return (
              <button key={g} onClick={()=>setGrade(g)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  grade===g
                    ? (sc ? `${sc.bg} ${sc.text} ${sc.border}` : 'bg-[#0A2540] text-white border-[#0A2540]')
                    : 'text-slate-400 border-slate-200 hover:border-blue-300'
                }`}>{g||'All'}</button>
            );
          })}
        </div>
        
        {/* Saved presets */}
        <div className="flex gap-1 border-l border-slate-200 pl-2 ml-1">
          {PRESETS.map(p=>(
            <button key={p.name} onClick={()=>{setGrade(p.grade);setSector(p.sector);setSearch(p.economy);setStatus(p.status);}}
              className="px-2.5 py-1 rounded-full text-xs text-slate-400 border border-dashed border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap">
              {p.name}
            </button>
          ))}
        </div>
        <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs px-3 py-1.5 w-32 focus:outline-none focus:border-blue-400"/>
        <select value={type}   onChange={e=>setType(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs px-2 py-1.5">
          {SIGNAL_TYPES.map(t=><option key={t} value={t}>{t||'All Types'}</option>)}
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs px-2 py-1.5">
          {STATUSES.map(s=><option key={s} value={s}>{s||'All Status'}</option>)}
        </select>
        <button onClick={()=>setShowLive(v=>!v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${showLive?'bg-emerald-600 text-white border-emerald-600':'text-slate-400 border-slate-200'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-400'}`}/>
          {showLive?`LIVE (${liveSignals.length})`:'Live Feed'}
        </button>
        <div className="flex items-center gap-2 ml-auto">
          {/* Built-in presets */}
          {BUILTIN_PRESETS.slice(0,3).map(p=>(
            <button key={p.name} onClick={()=>{setGrade(p.grade);setSector(p.sector);setType(p.type);setStatus(p.status);setSearch(p.search);}}
              className="text-xs font-semibold border border-slate-200 text-slate-400 px-2.5 py-1.5 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors hidden lg:block">
              {p.name}
            </button>
          ))}
          <button onClick={()=>exportSignals(filtered)}
            className="text-xs font-bold border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg hover:border-blue-300 transition-colors">
            CSV
          </button>
          <button onClick={()=>setShowSave(v=>!v)}
            className="text-xs font-bold border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg hover:border-blue-300 transition-colors">
            ⭐ Save
          </button>
          <span className="text-xs text-slate-400">{filtered.length}</span>
        </div>
        <button onClick={()=>exportSignals(filtered)}
          className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          ↓ CSV
        </button>
      </div>

      <div className="flex gap-0" style={{height:'calc(100vh - 7rem)'}}>
        {/* Signal list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.map(s=>{
            const gc = GRADE_COLORS[s.grade] || GRADE_COLORS.BRONZE;
            const isSelected = selected?.id === s.id;
            return (
              <div key={s.id} onClick={()=>setSelected(isSelected?null:s)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${isSelected?'border-blue-400 shadow-md':'border-slate-100'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:GRADE_DOT[s.grade]}}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-black px-2 py-0.5 rounded border ${gc.bg} ${gc.text} ${gc.border}`}>{s.grade}</span>
                      <span className="text-xs font-bold text-slate-600">{s.company}</span>
                      <span className="text-slate-300 text-xs">→</span>
                      <span className="text-xs font-bold text-blue-600">{s.economy}</span>
                      <span className="text-xs text-slate-400 ml-auto">{s.signal_date}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span className="font-black text-slate-700">${(s.capex_usd/1e6).toFixed(0)}M</span>
                      <span>SCI {s.sci_score}</span>
                      <span>{s.signal_type}</span>
                      <span className={s.status==='CONFIRMED'?'text-emerald-600':s.status==='RUMOURED'?'text-amber-600':'text-blue-600'}>
                        {s.status}
                      </span>
                      <span>ISIC {s.sector}</span>
                    </div>
                    {isSelected && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="font-mono text-slate-300">{s.id}</span>
                          {s.provenance?.verified && <span className="text-emerald-600 font-bold">✓ Verified</span>}
                          <span className="text-slate-400">{s.provenance?.source}</span>
                          <span className="text-slate-300 font-mono">{s.provenance?.hash}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button className="bg-[#0A2540] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">
                            Full Signal — 1 FIC
                          </button>
                          <button className="border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:border-blue-300 transition-colors">
                            + Pipeline
                          </button>
                          <button className="border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:border-blue-300 transition-colors">
                            + Watchlist
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <div className="text-4xl mb-3">📡</div>
              <div className="text-sm font-semibold">No signals match the current filters</div>
            </div>
          )}
        </div>

        {/* Stats panel */}
        <div className="w-56 flex-shrink-0 border-l border-slate-100 bg-white p-4 overflow-y-auto hidden lg:block">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Signal Stats</div>
          {['PLATINUM','GOLD','SILVER','BRONZE'].map(g=>{
            const count = allSignals.filter(s=>s.grade===g).length;
            const gc    = GRADE_COLORS[g];
            return (
              <div key={g} className="mb-3">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className={`font-bold ${gc.text}`}>{g}</span>
                  <span className="font-black text-slate-600">{count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{width:`${(count/allSignals.length)*100}%`,background:GRADE_DOT[g]}}/>
                </div>
              </div>
            );
          })}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Live Stream</div>
            <div className={`flex items-center gap-1.5 text-xs font-bold ${connected?'text-emerald-600':'text-slate-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-300'}`}/>
              {connected?'Connected':'Connecting…'}
            </div>
            {connected && <div className="text-xs text-slate-400 mt-1">{totalSeen} signals seen</div>}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Top Economies</div>
            {['UAE','India','Saudi Arabia','Vietnam','Indonesia'].map((e,i)=>(
              <div key={e} className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">#{i+1} {e}</span>
                <span className="font-bold text-blue-600">{allSignals.filter(s=>s.economy===e).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
