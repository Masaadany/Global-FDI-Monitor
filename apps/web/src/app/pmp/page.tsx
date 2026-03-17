'use client';
import { useState } from 'react';
import { exportCSV } from '@/lib/export';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const COMPANIES = [
  {cic:'GFM-USA-MSFT-12847',name:'Microsoft Corporation',hq:'USA',hq_city:'Redmond, WA',sector:'J',sector_name:'Technology · Cloud Computing',mfs:94.2,ims:96,rev_b:211.9,employees:221000,esg:'LEADER',esg_score:77.2,capex_range:'$500M–$2B',grade:'PLATINUM',conviction:'VERY HIGH',stage:'TARGETED',
   interest:'Cloud Region expansion · AI infrastructure · Partner ecosystem',ceo:'Satya Nadella',founded:1975,
   signals:[{date:'2026-03-17',desc:'Cloud Region Dubai announcement',sci:91.2},{date:'2026-03-10',desc:'G42 AI partnership',sci:88.4}]},
  {cic:'GFM-USA-AMZN-98120',name:'Amazon Web Services',hq:'USA',hq_city:'Seattle, WA',sector:'J',sector_name:'Technology · Cloud',mfs:91.8,ims:95,rev_b:90.8,employees:1500000,esg:'LEADER',esg_score:74.1,capex_range:'$1B+',grade:'PLATINUM',conviction:'VERY HIGH',stage:'TARGETED',
   interest:'Hyperscale data centres · Edge compute · Marketplace',ceo:'Andy Jassy',founded:2006,
   signals:[{date:'2026-03-17',desc:'Saudi Arabia $5.3B expansion',sci:88.4},{date:'2026-02-20',desc:'UAE availability zone',sci:84.2}]},
  {cic:'GFM-CHN-CATL-11234',name:'CATL',hq:'CHN',hq_city:'Ningde',sector:'C',sector_name:'Manufacturing · EV Batteries',mfs:90.2,ims:92,rev_b:44.0,employees:102000,esg:'STRONG',esg_score:62.4,capex_range:'$1B–$5B',grade:'PLATINUM',conviction:'CONFIRMED',stage:'COMMITTED',
   interest:'Battery gigafactory · Nickel processing · R&D centre',ceo:'Robin Zeng',founded:2011,
   signals:[{date:'2026-03-15',desc:'Indonesia $3.2B committed',sci:85.4},{date:'2026-03-01',desc:'Morocco exploration',sci:72.1}]},
  {cic:'GFM-DEU-SINEN-44221',name:'Siemens Energy',hq:'DEU',hq_city:'Munich',sector:'D',sector_name:'Energy · Wind & Hydrogen',mfs:88.3,ims:85,rev_b:35.3,employees:92000,esg:'LEADER',esg_score:72.8,capex_range:'$200M–$500M',grade:'GOLD',conviction:'HIGH',stage:'NEGOTIATING',
   interest:'Wind farm · Green hydrogen · Grid infrastructure',ceo:'Christian Bruch',founded:2020,
   signals:[{date:'2026-03-17',desc:'Egypt JV confirmed $340M',sci:86.1}]},
  {cic:'GFM-USA-NVDA-66234',name:'NVIDIA Corporation',hq:'USA',hq_city:'Santa Clara',sector:'J',sector_name:'Technology · AI Chips',mfs:89.4,ims:94,rev_b:60.9,employees:29600,esg:'LEADER',esg_score:71.2,capex_range:'$200M–$800M',grade:'PLATINUM',conviction:'HIGH',stage:'ENGAGED',
   interest:'AI data centre · Research lab · Developer ecosystem',ceo:'Jensen Huang',founded:1993,
   signals:[{date:'2026-03-06',desc:'Singapore $4.4B announced',sci:89.2}]},
  {cic:'GFM-SAU-ACWA-44512',name:'ACWA Power',hq:'SAU',hq_city:'Riyadh',sector:'D',sector_name:'Energy · Renewables',mfs:86.2,ims:88,rev_b:4.2,employees:4000,esg:'LEADER',esg_score:74.1,capex_range:'$500M–$2B',grade:'GOLD',conviction:'HIGH',stage:'COMMITTED',
   interest:'Solar · Wind · Green hydrogen pipeline',ceo:'Marco Arcelli',founded:2004,
   signals:[{date:'2026-03-13',desc:'Morocco $1.1B confirmed',sci:82.1}]},
  {cic:'GFM-USA-GOOG-77234',name:'Google (Alphabet)',hq:'USA',hq_city:'Mountain View',sector:'J',sector_name:'Technology · Cloud & AI',mfs:92.1,ims:94,rev_b:307.4,employees:181000,esg:'LEADER',esg_score:73.8,capex_range:'$500M–$2B',grade:'GOLD',conviction:'HIGH',stage:'ENGAGED',
   interest:'Cloud region · AI research · Smart city',ceo:'Sundar Pichai',founded:1998,
   signals:[{date:'2026-03-09',desc:'UAE $1B announced',sci:87.1}]},
  {cic:'GFM-USA-DATA-88234',name:'Databricks',hq:'USA',hq_city:'San Francisco',sector:'J',sector_name:'Technology · Data Platform',mfs:82.7,ims:79,rev_b:1.6,employees:6000,esg:'ACTIVE',esg_score:52.0,capex_range:'$100M–$300M',grade:'GOLD',conviction:'MEDIUM',stage:'PROSPECTING',
   interest:'Regional HQ · Data lakehouse · AI platform',ceo:'Ali Ghodsi',founded:2013,
   signals:[{date:'2026-03-14',desc:'Singapore HQ announced',sci:79.3}]},
  {cic:'GFM-DNK-VEST-55123',name:'Vestas Wind Systems',hq:'DNK',hq_city:'Aarhus',sector:'D',sector_name:'Energy · Wind Turbines',mfs:84.9,ims:80,rev_b:15.9,employees:29000,esg:'LEADER',esg_score:78.4,capex_range:'$300M–$800M',grade:'GOLD',conviction:'HIGH',stage:'NEGOTIATING',
   interest:'Wind turbine factory · R&D · Service hub',ceo:'Henrik Andersen',founded:1945,
   signals:[{date:'2026-03-16',desc:'India $420M Rajasthan',sci:85.9}]},
  {cic:'GFM-JPN-TOYT-88123',name:'Toyota Motor Corp',hq:'JPN',hq_city:'Toyota City',sector:'C',sector_name:'Manufacturing · EV & Hybrid',mfs:87.1,ims:88,rev_b:274.5,employees:375000,esg:'STRONG',esg_score:67.4,capex_range:'$500M–$2B',grade:'GOLD',conviction:'HIGH',stage:'ENGAGED',
   interest:'EV assembly · Hybrid components · R&D',ceo:'Koji Sato',founded:1937,
   signals:[{date:'2026-03-08',desc:'Vietnam expansion $2.1B',sci:84.3}]},
];

const MISSIONS = [
  {id:'PMP-ARE-J-20260317-0001',economy:'UAE',   flag:'🇦🇪',sector:'J',status:'ACTIVE',  targets:6,progress:42,created:'2026-03-17',fic_cost:30},
  {id:'PMP-SAU-D-20260315-0001',economy:'Saudi Arabia',flag:'🇸🇦',sector:'D',status:'ACTIVE',  targets:5,progress:28,created:'2026-03-15',fic_cost:30},
  {id:'PMP-EGY-D-20260310-0001',economy:'Egypt', flag:'🇪🇬',sector:'D',status:'COMPLETE',targets:4,progress:100,created:'2026-03-10',fic_cost:30},
];

const GRADE_DOT: Record<string,string> = {PLATINUM:'#D97706',GOLD:'#059669',SILVER:'#2563EB',BRONZE:'#6B7280'};
const STAGE_CFG: Record<string,{color:string}> = {
  TARGETED:   {color:'text-slate-500'},PROSPECTING:{color:'text-violet-600'},
  ENGAGED:    {color:'text-primary'},  NEGOTIATING:{color:'text-amber-600'},
  COMMITTED:  {color:'text-emerald-600'},CLOSED_WON:{color:'text-teal-600'},
};

// Simple flight-path SVG map
function MissionMap({selected}:{selected:string[]}) {
  const DEST_COORDS: Record<string,[number,number]> = {
    'ARE':[371,218],'SAU':[355,230],'IND':[430,228],'EGY':[330,215],'SGP':[510,270],
    'VNM':[500,248],'IDN':[515,285],'DEU':[302,168],'KOR':[530,188],'JPN':[548,185],
    'MAR':[278,215],'NGA':[298,268],'NGA':[298,268],
  };
  const HOME: [number,number] = [302,168]; // EU base
  return (
    <div className="bg-deep rounded-xl overflow-hidden border border-white/10">
      <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-400 rounded-full live-dot"/>
        <span className="text-xs font-bold text-emerald-400">MISSION MAP — Investment Destinations</span>
      </div>
      <svg viewBox="0 0 600 380" className="w-full">
        {/* Ocean */}
        <rect width="600" height="380" fill="#030d1a"/>
        {/* Grid */}
        {[1,2,3,4].map(i=><line key={`h${i}`} x1={0} y1={i*80} x2={600} y2={i*80} stroke="#0d2845" strokeWidth="0.4"/>)}
        {[1,2,3,4,5].map(i=><line key={`v${i}`} x1={i*100} y1={0} x2={i*100} y2={380} stroke="#0d2845" strokeWidth="0.4"/>)}
        {/* Simplified continent shapes */}
        <path d="M 40,80 L 220,70 L 240,160 L 185,210 L 120,215 L 55,175 Z" fill="#1e3a5f" stroke="#0d2845" strokeWidth="0.5"/>
        <path d="M 148,230 L 225,225 L 248,310 L 195,360 L 148,350 L 130,300 Z" fill="#1e3a5f" stroke="#0d2845" strokeWidth="0.5"/>
        <path d="M 265,95 L 400,88 L 420,155 L 370,190 L 265,180 Z" fill="#1e3a5f" stroke="#0d2845" strokeWidth="0.5"/>
        <path d="M 265,195 L 385,188 L 398,290 L 355,350 L 295,338 L 270,270 Z" fill="#1e3a5f" stroke="#0d2845" strokeWidth="0.5"/>
        <path d="M 405,85 L 580,78 L 600,200 L 530,250 L 440,240 L 410,175 Z" fill="#1e3a5f" stroke="#0d2845" strokeWidth="0.5"/>
        <path d="M 510,250 L 575,245 L 580,295 L 520,300 Z" fill="#1e3a5f" stroke="#0d2845" strokeWidth="0.5"/>
        <path d="M 520,305 L 580,298 L 582,365 L 525,368 Z" fill="#1e3a5f" stroke="#0d2845" strokeWidth="0.5"/>
        {/* Flight paths */}
        {selected.filter(cic => {
          const co = COMPANIES.find(c=>c.cic===cic);
          return co && DEST_COORDS[co.iso3 || ''];
        }).map((cic,i)=>{
          const co = COMPANIES.find(c=>c.cic===cic)!;
          const dest = DEST_COORDS[co.iso3||''];
          if(!dest) return null;
          const mx=(HOME[0]+dest[0])/2, my=Math.min(HOME[1],dest[1])-40;
          return (
            <g key={cic}>
              <path d={`M${HOME[0]},${HOME[1]} Q${mx},${my} ${dest[0]},${dest[1]}`}
                fill="none" stroke="#0A66C2" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.7"/>
              <circle cx={dest[0]} cy={dest[1]} r={8} fill={GRADE_DOT[co.grade]} opacity="0.9"/>
              <circle cx={dest[0]} cy={dest[1]} r={14} fill={GRADE_DOT[co.grade]} opacity="0.15"/>
              <text x={dest[0]} y={dest[1]+3} textAnchor="middle" fontSize="7" fill="white" fontWeight="700">
                {co.iso3||''}
              </text>
            </g>
          );
        })}
        {/* Home base */}
        <circle cx={HOME[0]} cy={HOME[1]} r={10} fill="#0A66C2" opacity="0.9"/>
        <text x={HOME[0]} y={HOME[1]+3} textAnchor="middle" fontSize="8" fill="white" fontWeight="900">IPA</text>
      </svg>
      <div className="px-4 py-2 text-xs text-white/40 text-center">
        Select companies to see investment mission routes · Animated on live platform
      </div>
    </div>
  );
}

export default function PMPPage() {
  const [tab,       setTab]       = useState<'missions'|'search'|'new'>('search');
  const [economy,   setEconomy]   = useState('UAE');
  const [sector,    setSector]    = useState('J');
  const [selected,  setSelected]  = useState<string[]>([]);
  const [expanded,  setExpanded]  = useState<string|null>(null);
  const [generating,setGenerating]= useState(false);
  const [dossier,   setDossier]   = useState<Record<string,'idle'|'generating'|'ready'>>({});
  const [search,    setSearch]    = useState('');
  const [gradeFilter,setGrade]    = useState('');

  function toggleSelect(cic: string) {
    setSelected(prev => prev.includes(cic) ? prev.filter(c=>c!==cic) : [...prev,cic]);
  }

  async function genDossier(cic: string) {
    setDossier(d=>({...d,[cic]:'generating'}));
    await new Promise(r=>setTimeout(r,1800));
    setDossier(d=>({...d,[cic]:'ready'}));
  }

  async function newMission() {
    setGenerating(true);
    await new Promise(r=>setTimeout(r,1500));
    setGenerating(false);
    setTab('search');
  }

  const filtered = COMPANIES.filter(c=>
    (!search    || c.name.toLowerCase().includes(search.toLowerCase())) &&
    (!gradeFilter || c.grade===gradeFilter)
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">AI-Powered Targeting</div>
          <h1 className="text-4xl font-extrabold mb-2">Investment Promotion Mission Planning</h1>
          <p className="text-white/70">AI-generated company targets ranked by Mission Feasibility Score (MFS). Select companies and export briefing reports.</p>
          <div className="flex gap-6 mt-5">
            {[['Active Missions',MISSIONS.filter(m=>m.status==='ACTIVE').length],['Target Companies',COMPANIES.length],['Avg MFS',Math.round(COMPANIES.reduce((s,c)=>s+c.mfs,0)/COMPANIES.length)]].map(([l,v])=>(
              <div key={String(l)}><div className="stat-number text-xl font-bold text-white">{v}</div><div className="text-white/50 text-xs">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-screen-xl mx-auto flex gap-0">
          {[['missions','Active Missions'],['search','Target Companies'],['new','+ New Mission']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>
              {l}
            </button>
          ))}
          {selected.length > 0 && (
            <div className="ml-auto flex items-center gap-2 py-2">
              <span className="text-xs text-slate-500">{selected.length} selected</span>
              <button onClick={()=>exportCSV(selected.map(cic=>{const c=COMPANIES.find(x=>x.cic===cic)!;return {CIC:c.cic,Company:c.name,HQ:c.hq,'MFS Score':c.mfs,'Conviction':c.conviction,'Stage':c.stage};}), 'GFM_Mission_Companies')}
                className="gfm-btn-outline text-xs py-1.5">Export Brief</button>
              <button className="gfm-btn-primary text-xs py-1.5">Generate Dossier</button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        {/* Active Missions */}
        {tab==='missions' && (
          <div className="space-y-3">
            {MISSIONS.map(m=>(
              <div key={m.id} className="gfm-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-extrabold text-deep">{m.flag} {m.economy} — ISIC {m.sector}</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{m.id}</div>
                  </div>
                  <span className={`gfm-badge ${m.status==='ACTIVE'?'gfm-badge-gold':'bg-slate-100 text-slate-500 border-slate-200'}`}>{m.status}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>{m.targets} targets · Created {m.created}</span>
                  <span>{m.progress}% pipeline progress</span>
                </div>
                <div className="gfm-progress mb-3"><div className="gfm-progress-fill" style={{width:`${m.progress}%`}}/></div>
                <button onClick={()=>setTab('search')} className="text-xs text-primary font-semibold hover:underline">View targets →</button>
              </div>
            ))}
          </div>
        )}

        {/* Company search — fDi Markets style */}
        {tab==='search' && (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-3">
              {/* Filters */}
              <div className="filter-bar">
                <span className="text-xs font-bold text-deep">FILTERS:</span>
                {['','PLATINUM','GOLD','SILVER'].map(g=>(
                  <button key={g} onClick={()=>setGrade(g)}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${gradeFilter===g?'bg-primary text-white':'border border-slate-200 text-slate-500 hover:border-primary'}`}>
                    {g||'All Grades'}
                  </button>
                ))}
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search company…"
                  className="ml-auto text-xs border border-slate-200 rounded-md px-3 py-1.5 w-36 focus:outline-none focus:border-primary"/>
                {selected.length > 0 && (
                  <button onClick={()=>setSelected([])} className="text-xs text-red-500 hover:underline">Clear ({selected.length})</button>
                )}
              </div>

              {filtered.map(co=>{
                const isExp  = expanded===co.cic;
                const isSel  = selected.includes(co.cic);
                const stageCfg = STAGE_CFG[co.stage]||STAGE_CFG.TARGETED;
                const ds     = dossier[co.cic]||'idle';
                return (
                  <div key={co.cic} className={`gfm-card overflow-hidden ${isSel?'border-primary ring-2 ring-primary ring-offset-1':''}`}>
                    <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={()=>setExpanded(isExp?null:co.cic)}>
                      {/* MFS badge */}
                      <div className="text-center flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${co.mfs>=90?'bg-amber-50 border border-amber-200':co.mfs>=80?'bg-emerald-50 border border-emerald-200':'bg-blue-50 border border-blue-200'}`}>
                          <div className={`font-extrabold text-sm font-mono ${co.mfs>=90?'text-amber-700':co.mfs>=80?'text-emerald-700':'text-blue-700'}`}>{co.mfs}</div>
                          <div className="text-xs text-slate-400 leading-none">MFS</div>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-0.5">
                          <div>
                            <div className="font-bold text-deep">{co.name}</div>
                            <div className="text-xs text-slate-500">{co.sector_name} · {co.hq_city}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-2 h-2 rounded-full" style={{background:GRADE_DOT[co.grade]}}/>
                            <span className="text-xs font-semibold text-slate-500">{co.grade}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="font-bold text-deep font-mono">${co.rev_b}B rev</span>
                          <span>{co.employees.toLocaleString()} emp</span>
                          <span>IMS {co.ims}</span>
                          <span className={`font-semibold ${stageCfg.color}`}>{co.stage}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-400">{co.capex_range}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{co.interest}</p>
                      </div>
                      {/* Select checkbox */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <button onClick={e=>{e.stopPropagation();toggleSelect(co.cic);}}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSel?'bg-primary border-primary':'border-slate-300 hover:border-primary'}`}>
                          {isSel && <span className="text-white text-xs">✓</span>}
                        </button>
                      </div>
                    </div>

                    {isExp && (
                      <div className="border-t border-slate-100 p-4 bg-surface space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Company Profile</div>
                            <div className="space-y-1 text-xs text-slate-600">
                              <div>CEO: <strong className="text-deep">{co.ceo}</strong></div>
                              <div>Founded: <strong className="text-deep">{co.founded}</strong></div>
                              <div>ESG: <strong className="text-emerald-600">{co.esg} ({co.esg_score})</strong></div>
                              <div>Investment interest: <em className="text-deep">{co.interest}</em></div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Recent Signals</div>
                            {co.signals.map((s,i)=>(
                              <div key={i} className="text-xs text-slate-500 mb-1 flex gap-2">
                                <span className="text-slate-300">{s.date}</span>
                                <span>{s.desc}</span>
                                <span className="font-mono text-primary ml-auto">SCI {s.sci}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={()=>genDossier(co.cic)} disabled={ds==='generating'}
                            className={`gfm-btn-primary text-xs py-1.5 px-4 ${ds==='generating'?'opacity-50':''}`}>
                            {ds==='generating'?<span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>Generating…</span>
                             :ds==='ready'?'✓ Download Dossier'
                             :'AI Dossier — 18 FIC'}
                          </button>
                          <button onClick={()=>toggleSelect(co.cic)}
                            className={`gfm-btn-outline text-xs py-1.5 px-4 ${isSel?'bg-primary text-white border-primary':''}`}>
                            {isSel?'✓ Selected':'Select for Report'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mission map + selected summary */}
            <div className="space-y-4">
              <MissionMap selected={selected}/>
              {selected.length > 0 && (
                <div className="gfm-card p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Selected for Report ({selected.length})</div>
                  {selected.map(cic=>{
                    const co = COMPANIES.find(c=>c.cic===cic)!;
                    return (
                      <div key={cic} className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:GRADE_DOT[co.grade]}}/>
                        <span className="text-xs text-deep font-medium flex-1 truncate">{co.name}</span>
                        <span className="text-xs font-mono text-slate-400">{co.mfs}</span>
                        <button onClick={()=>toggleSelect(cic)} className="text-slate-300 hover:text-red-400 text-xs">×</button>
                      </div>
                    );
                  })}
                  <div className="flex gap-2 mt-3">
                    <button className="gfm-btn-outline text-xs py-1.5 flex-1" onClick={()=>exportCSV(selected.map(cic=>{const c=COMPANIES.find(x=>x.cic===cic)!;return{CIC:c.cic,Company:c.name,HQ:c.hq,MFS:c.mfs};}), 'GFM_Brief')}>Export Brief</button>
                    <button className="gfm-btn-primary text-xs py-1.5 flex-1">Full Report</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New mission */}
        {tab==='new' && (
          <div className="max-w-lg mx-auto">
            <div className="gfm-card p-6">
              <h2 className="font-extrabold text-deep text-xl mb-5">Generate New Mission</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Target Economy</label>
                  <select value={economy} onChange={e=>setEconomy(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary">
                    {['UAE','Saudi Arabia','India','Egypt','Vietnam','Indonesia','Germany','Singapore','Nigeria','Morocco'].map(e=><option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Primary Sector</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['J','ICT / Technology'],['D','Energy & Utilities'],['K','Finance'],['C','Manufacturing'],['B','Mining'],['H','Logistics']].map(([c,n])=>(
                      <button key={c} onClick={()=>setSector(c)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all ${sector===c?'border-primary bg-primary-light text-primary':'border-slate-200 text-slate-500 hover:border-primary'}`}>
                        <span className="font-bold">ISIC {c}</span> — {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-xs text-blue-700">
                  <div className="font-bold mb-1">Mission will include:</div>
                  <ul className="space-y-0.5">
                    <li>• Top 5–8 companies ranked by MFS score</li>
                    <li>• Full CIC profiles for each target</li>
                    <li>• Recommended engagement strategy</li>
                    <li>• FlightRadar-style mission route map</li>
                  </ul>
                </div>
                <button onClick={newMission} disabled={generating}
                  className={`w-full gfm-btn-primary py-4 text-base rounded-xl ${generating?'opacity-50 cursor-not-allowed':''}`}>
                  {generating?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Generating…</span>:'Generate Mission — 30 FIC'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
