'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';
import { exportSignals } from '@/lib/export';

const GRADE_CONFIG: Record<string,{bg:string;text:string;border:string;dot:string;label:string}> = {
  PLATINUM:{bg:'bg-amber-50',  text:'text-amber-800',  border:'border-amber-200',  dot:'#D97706',label:'Platinum'},
  GOLD:    {bg:'bg-emerald-50',text:'text-emerald-800',border:'border-emerald-200',dot:'#059669',label:'Gold'},
  SILVER:  {bg:'bg-blue-50',  text:'text-blue-800',   border:'border-blue-200',   dot:'#2563EB',label:'Silver'},
  BRONZE:  {bg:'bg-slate-50', text:'text-slate-600',  border:'border-slate-200',  dot:'#6B7280', label:'Bronze'},
};

const STATIC_SIGNALS = [
  {id:'MSS-J-ARE-20260317-0001',grade:'PLATINUM',company:'Microsoft Corp',hq:'USA',economy:'UAE',iso3:'ARE',sector:'J',sector_name:'ICT',capex_usd:850000000,sci_score:91.2,signal_type:'Greenfield',status:'CONFIRMED',signal_date:'2026-03-17',jobs:2400,description:'Data centre in Dubai South, part of $5B regional commitment through 2028.',source:'Reuters'},
  {id:'MSS-J-SAU-20260317-0002',grade:'PLATINUM',company:'Amazon AWS',hq:'USA',economy:'Saudi Arabia',iso3:'SAU',sector:'J',sector_name:'ICT',capex_usd:5300000000,sci_score:88.4,signal_type:'Expansion',status:'ANNOUNCED',signal_date:'2026-03-17',jobs:4800,description:'Cloud infrastructure expansion. 3 new availability zones by 2027.',source:'FT'},
  {id:'MSS-D-EGY-20260317-0003',grade:'PLATINUM',company:'Siemens Energy',hq:'DEU',economy:'Egypt',iso3:'EGY',sector:'D',sector_name:'Energy',capex_usd:340000000,sci_score:86.1,signal_type:'JV',status:'CONFIRMED',signal_date:'2026-03-17',jobs:1200,description:'600MW wind farm joint venture in Gulf of Suez.',source:'Bloomberg'},
  {id:'MSS-C-VNM-20260317-0004',grade:'GOLD',company:'Samsung Electronics',hq:'KOR',economy:'Vietnam',iso3:'VNM',sector:'C',sector_name:'Manufacturing',capex_usd:2800000000,sci_score:83.7,signal_type:'Expansion',status:'CONFIRMED',signal_date:'2026-03-16',jobs:8000,description:'Semiconductor packaging facility expansion in Thai Nguyen.',source:'KOTRA'},
  {id:'MSS-D-IND-20260317-0005',grade:'PLATINUM',company:'Vestas Wind Systems',hq:'DNK',economy:'India',iso3:'IND',sector:'D',sector_name:'Energy',capex_usd:420000000,sci_score:85.9,signal_type:'Greenfield',status:'ANNOUNCED',signal_date:'2026-03-16',jobs:1800,description:'800MW wind turbine manufacturing facility in Rajasthan.',source:'ET'},
  {id:'MSS-C-IDN-20260317-0006',grade:'PLATINUM',company:'CATL',hq:'CHN',economy:'Indonesia',iso3:'IDN',sector:'C',sector_name:'Manufacturing',capex_usd:3200000000,sci_score:85.4,signal_type:'Greenfield',status:'COMMITTED',signal_date:'2026-03-15',jobs:10000,description:'Battery gigafactory in Karawang. Phase 1 operational Q3 2027.',source:'BKPM'},
  {id:'MSS-J-SGP-20260317-0007',grade:'GOLD',company:'Databricks',hq:'USA',economy:'Singapore',iso3:'SGP',sector:'J',sector_name:'ICT',capex_usd:150000000,sci_score:79.3,signal_type:'Platform',status:'ANNOUNCED',signal_date:'2026-03-15',jobs:400,description:'APAC regional HQ + data lakehouse R&D centre.',source:'EDB'},
  {id:'MSS-K-ARE-20260317-0008',grade:'SILVER',company:'BlackRock Inc',hq:'USA',economy:'UAE',iso3:'ARE',sector:'K',sector_name:'Finance',capex_usd:500000000,sci_score:74.2,signal_type:'Platform',status:'RUMOURED',signal_date:'2026-03-14',jobs:300,description:'Regional investment management platform discussions with ADGM.',source:'GFM'},
];

const COUNTRIES_FILTER = ['All Countries','UAE','Saudi Arabia','India','Vietnam','Indonesia','Singapore','Egypt','Germany'];
const SECTORS_FILTER   = ['All Sectors','ICT','Energy','Manufacturing','Finance','Mining','Real Estate'];
const TYPES_FILTER     = ['All Types','Greenfield','Expansion','M&A','JV','Platform'];

export default function SignalsPage() {
  const [grade,   setGrade]   = useState('');
  const [country, setCountry] = useState('All Countries');
  const [sector,  setSector]  = useState('All Sectors');
  const [type,    setType]    = useState('All Types');
  const [search,  setSearch]  = useState('');
  const [view,    setView]    = useState<'grid'|'map'>('grid');
  const [selected,setSelected]= useState<typeof STATIC_SIGNALS[0]|null>(null);
  const [showLive,setShowLive]= useState(false);

  const { signals: live, connected, totalSeen } = useRealTimeSignals(15);

  const all = showLive
    ? live.map((s:any) => ({...s, id:s.reference_code, company:s.company, economy:s.economy, iso3:(s.economy||'').slice(0,3).toUpperCase(), sector_name:'ICT', capex_usd:(s.capex_m||0)*1e6, signal_type:'Greenfield', status:'ANNOUNCED', signal_date:new Date().toISOString().slice(0,10), jobs:0, source:'GFM Live', description:`Live WebSocket signal · SCI ${s.sci_score}`}))
    : STATIC_SIGNALS;

  const filtered = all.filter(s =>
    (!grade   || s.grade === grade) &&
    (country === 'All Countries' || s.economy === country) &&
    (sector  === 'All Sectors'   || s.sector_name === sector) &&
    (type    === 'All Types'     || s.signal_type === type) &&
    (!search  || s.company.toLowerCase().includes(search.toLowerCase()) || s.economy.toLowerCase().includes(search.toLowerCase()))
  );

  const GRADE_COUNTS = ['PLATINUM','GOLD','SILVER','BRONZE'].map(g => ({ g, n: all.filter(s=>s.grade===g).length }));
  const SECTOR_COUNTS = ['ICT','Energy','Manufacturing','Finance'].map(s => ({ s, n: all.filter(x=>x.sector_name===s).length, pct: Math.round(all.filter(x=>x.sector_name===s).length/all.length*100) }));

  function fmtCap(usd: number) { return usd>=1e9?`$${(usd/1e9).toFixed(1)}B`:`$${(usd/1e6).toFixed(0)}M`; }

  return (
    <div className="min-h-screen bg-surface">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-deep">Market Signals Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time FDI intelligence · fDi Markets style · 2-second updates</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${connected?'text-emerald-600':'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${connected?'bg-emerald-400 live-dot':'bg-slate-300'}`}/>
              {connected?`LIVE · ${totalSeen} processed`:'Connecting…'}
            </div>
            <button onClick={()=>exportSignals(filtered.map(s=>({...s})))}
              className="gfm-btn-outline text-xs py-1.5">Export</button>
            <button onClick={()=>setShowLive(v=>!v)}
              className={`text-xs font-bold px-3 py-1.5 rounded-md border transition-all ${showLive?'bg-emerald-600 text-white border-emerald-600':'border-slate-200 text-slate-500 hover:border-primary'}`}>
              {showLive?'Live Feed':'Static'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar — fDi Markets style */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2 items-center">
          <select value={country} onChange={e=>setCountry(e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 font-medium text-slate-600 bg-white focus:border-primary focus:outline-none">
            {COUNTRIES_FILTER.map(c=><option key={c}>{c}</option>)}
          </select>
          <select value={sector} onChange={e=>setSector(e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 font-medium text-slate-600 bg-white focus:border-primary focus:outline-none">
            {SECTORS_FILTER.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={type} onChange={e=>setType(e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 font-medium text-slate-600 bg-white focus:border-primary focus:outline-none">
            {TYPES_FILTER.map(t=><option key={t}>{t}</option>)}
          </select>
          <div className="flex gap-1">
            {['','PLATINUM','GOLD','SILVER','BRONZE'].map(g=>{
              const cfg = g ? GRADE_CONFIG[g] : null;
              return (
                <button key={g} onClick={()=>setGrade(g)}
                  className={`text-xs px-2.5 py-1.5 rounded-md font-semibold border transition-all ${grade===g?'text-white':(cfg?`${cfg.bg} ${cfg.text} ${cfg.border}`:'border-slate-200 text-slate-500 bg-white hover:border-primary')}`}
                  style={grade===g&&g?{background:GRADE_CONFIG[g].dot,borderColor:GRADE_CONFIG[g].dot}:grade===g?{background:'#0A2540',borderColor:'#0A2540',color:'white'}:{}}>
                  {g||'All'}
                </button>
              );
            })}
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search company, country…"
            className="ml-auto text-xs border border-slate-200 rounded-md px-3 py-1.5 w-40 focus:outline-none focus:border-primary"/>
          {/* Active filters */}
          {(grade||country!=='All Countries'||sector!=='All Sectors') && (
            <button onClick={()=>{setGrade('');setCountry('All Countries');setSector('All Sectors');setType('All Types');setSearch('');}}
              className="text-xs text-red-500 font-semibold hover:underline">
              Clear filters
            </button>
          )}
          <span className="text-xs text-slate-400 font-mono">{filtered.length} signals</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <div className="grid lg:grid-cols-4 gap-5">
          {/* Sidebar summary */}
          <div className="space-y-4">
            {/* Signal summary */}
            <div className="gfm-card p-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Signal Summary</div>
              <div className="text-2xl font-bold text-deep font-mono mb-3">{all.length.toLocaleString()}</div>
              {GRADE_COUNTS.map(({g,n}) => {
                const cfg = GRADE_CONFIG[g];
                return (
                  <div key={g} className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-2 rounded-sm flex-shrink-0" style={{background:cfg.dot}}/>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${(n/all.length)*100}%`,background:cfg.dot}}/>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600">{n}</span>
                  </div>
                );
              })}
            </div>
            {/* Top sectors */}
            <div className="gfm-card p-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Top Sectors</div>
              {SECTOR_COUNTS.map(({s,n,pct}) => (
                <div key={s} className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 font-medium">{s}</span>
                  <span className="text-xs font-mono font-bold text-primary">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main signal grid — fDi Markets style cards */}
          <div className="lg:col-span-3 space-y-2">
            {filtered.map(s => {
              const gc  = GRADE_CONFIG[s.grade] || GRADE_CONFIG.BRONZE;
              const sel = selected?.id === s.id;
              return (
                <div key={s.id} onClick={()=>setSelected(sel?null:s)}
                  className={`signal-card cursor-pointer ${sel?'border-primary shadow-blue':''}`}>
                  <div className="flex items-start gap-3">
                    {/* Grade dot */}
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:gc.dot}}/>
                    {/* Company info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-deep">{s.company}</span>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="text-xs text-slate-500">{s.hq}</span>
                        <span className="text-slate-300 text-xs">→</span>
                        <span className="text-xs font-semibold text-primary">{s.economy}</span>
                        <span className={`gfm-badge ${gc.bg} ${gc.text} ${gc.border} ml-auto`}>{gc.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="font-bold text-slate-700 font-mono">{fmtCap(s.capex_usd)}</span>
                        <span>SCI {s.sci_score}</span>
                        <span className="text-slate-300">|</span>
                        <span>{s.signal_type}</span>
                        <span className="text-slate-300">|</span>
                        <span>{s.sector_name}</span>
                        <span className="text-slate-300">|</span>
                        <span className={s.status==='CONFIRMED'?'text-emerald-600':s.status==='RUMOURED'?'text-amber-600':'text-blue-600'}>
                          {s.status}
                        </span>
                        {s.jobs > 0 && <><span className="text-slate-300">|</span><span>{s.jobs.toLocaleString()} jobs</span></>}
                        <span className="ml-auto text-slate-400">{s.signal_date}</span>
                      </div>

                      {sel && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                          <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-400 font-mono">{s.id}</span>
                            <span className="text-xs font-bold text-emerald-600">✓ Verified</span>
                            <span className="text-xs text-slate-400">Source: {s.source}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="gfm-btn-primary text-xs py-1.5 px-4">Full Signal — 1 FIC</button>
                            <button className="gfm-btn-outline text-xs py-1.5 px-3">+ Pipeline</button>
                            <button className="gfm-btn-outline text-xs py-1.5 px-3">+ Watchlist</button>
                            <Link href={`/company-profiles`} className="gfm-btn-outline text-xs py-1.5 px-3">Company →</Link>
                            <Link href={`/country/${s.iso3}`} className="gfm-btn-outline text-xs py-1.5 px-3">Country →</Link>
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
                <div className="text-sm font-semibold">No signals match current filters</div>
                <button onClick={()=>{setGrade('');setCountry('All Countries');setSector('All Sectors');}} className="text-xs text-primary mt-2 hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
