'use client';
import { useState, useMemo } from 'react';
import { exportCSV } from '@/lib/export';

const COMPANIES = [
  {cic:'GFM-USA-MSFT-12847',name:'Microsoft Corporation',hq:'USA',hq_city:'Redmond, WA',sector:'J',sector_name:'Technology',ims:96,rev_b:211.9,employees:221000,listed:true,esg:'LEADER',esg_score:77.2,grade:'PLATINUM',fdi_stage:'ACTIVE',founded:1975,ceo:'Satya Nadella',
   footprints:['GBR','DEU','IND','SGP','ARE','JPN','SAU','IRL','NLD','AUS'],
   history:[{yr:2026,co:'ARE',proj:'Cloud Region Dubai',amt:'$850M',status:'Announced'},{yr:2025,co:'SAU',proj:'Cloud Region Riyadh',amt:'$5.3B',status:'Committed'},{yr:2024,co:'DEU',proj:'AI Research Lab',amt:'$1.2B',status:'Completed'},{yr:2023,co:'IND',proj:'Data Center Hyderabad',amt:'$2.8B',status:'Completed'},{yr:2022,co:'SGP',proj:'Cloud Singapore Expansion',amt:'$1.5B',status:'Completed'}]},
  {cic:'GFM-USA-AMZN-98120',name:'Amazon Web Services',hq:'USA',hq_city:'Seattle, WA',sector:'J',sector_name:'Technology',ims:95,rev_b:90.8,employees:1500000,listed:true,esg:'LEADER',esg_score:74.1,grade:'PLATINUM',fdi_stage:'ACTIVE',founded:2006,ceo:'Andy Jassy',
   footprints:['GBR','DEU','IRL','SGP','AUS','IND','SAU','ARE','JPN'],
   history:[{yr:2026,co:'SAU',proj:'3 New AZ Saudi Arabia',amt:'$5.3B',status:'Announced'},{yr:2025,co:'ARE',proj:'UAE Cloud Infrastructure',amt:'$800M',status:'Committed'},{yr:2024,co:'IND',proj:'India Data Centres (3)',amt:'$3.7B',status:'Completed'},{yr:2023,co:'AUS',proj:'Melbourne Region',amt:'$2.3B',status:'Completed'}]},
  {cic:'GFM-CHN-CATL-11234',name:'CATL',hq:'CHN',hq_city:'Ningde',sector:'C',sector_name:'Manufacturing',ims:92,rev_b:44.0,employees:102000,listed:true,esg:'STRONG',esg_score:62.4,grade:'PLATINUM',fdi_stage:'ACTIVE',founded:2011,ceo:'Robin Zeng',
   footprints:['DEU','HUN','IDN','AUS','MAR','CAN','MEX'],
   history:[{yr:2026,co:'IDN',proj:'Battery Gigafactory Karawang',amt:'$3.2B',status:'Committed'},{yr:2025,co:'HUN',proj:'Debrecen Gigafactory',amt:'$7.8B',status:'Under construction'},{yr:2024,co:'DEU',proj:'Erfurt Cell Plant',amt:'$2.0B',status:'Completed'},{yr:2023,co:'MAR',proj:'Battery Assembly',amt:'$600M',status:'Completed'}]},
  {cic:'GFM-DEU-SINEN-44221',name:'Siemens Energy',hq:'DEU',hq_city:'Munich',sector:'D',sector_name:'Energy',ims:85,rev_b:35.3,employees:92000,listed:true,esg:'LEADER',esg_score:72.8,grade:'GOLD',fdi_stage:'ACTIVE',founded:2020,ceo:'Christian Bruch',
   footprints:['GBR','USA','SAU','EGY','AUS','BRA','IND','ZAF'],
   history:[{yr:2026,co:'EGY',proj:'Gulf of Suez Wind JV',amt:'$340M',status:'Confirmed'},{yr:2025,co:'SAU',proj:'Grid Infrastructure',amt:'$520M',status:'Completed'},{yr:2024,co:'IND',proj:'Wind Turbine Factory',amt:'$280M',status:'Completed'},{yr:2023,co:'AUS',proj:'Green Hydrogen',amt:'$200M',status:'Exploring'}]},
  {cic:'GFM-USA-NVDA-66234',name:'NVIDIA Corporation',hq:'USA',hq_city:'Santa Clara',sector:'J',sector_name:'Technology',ims:94,rev_b:60.9,employees:29600,listed:true,esg:'LEADER',esg_score:71.2,grade:'PLATINUM',fdi_stage:'ACTIVE',founded:1993,ceo:'Jensen Huang',
   footprints:['TWN','KOR','GBR','DEU','IND','SGP','IRL'],
   history:[{yr:2026,co:'SGP',proj:'AI Supercomputer Data Centre',amt:'$4.4B',status:'Announced'},{yr:2025,co:'GBR',proj:'AI Research Partnership',amt:'$600M',status:'Committed'},{yr:2024,co:'DEU',proj:'HPC Research Centre',amt:'$400M',status:'Completed'}]},
  {cic:'GFM-DNK-VEST-55123',name:'Vestas Wind Systems',hq:'DNK',hq_city:'Aarhus',sector:'D',sector_name:'Energy',ims:80,rev_b:15.9,employees:29000,listed:true,esg:'LEADER',esg_score:78.4,grade:'GOLD',fdi_stage:'ACTIVE',founded:1945,ceo:'Henrik Andersen',
   footprints:['GBR','DEU','USA','IND','BRA','AUS','MEX'],
   history:[{yr:2026,co:'IND',proj:'Wind Turbine Factory Rajasthan',amt:'$420M',status:'Announced'},{yr:2025,co:'BRA',proj:'Service Hub Expansion',amt:'$180M',status:'Completed'},{yr:2024,co:'AUS',proj:'Offshore Wind Supply',amt:'$240M',status:'Completed'}]},
  {cic:'GFM-SAU-ACWA-44512',name:'ACWA Power',hq:'SAU',hq_city:'Riyadh',sector:'D',sector_name:'Energy',ims:86,rev_b:4.2,employees:4000,listed:true,esg:'LEADER',esg_score:74.1,grade:'GOLD',fdi_stage:'ACTIVE',founded:2004,ceo:'Marco Arcelli',
   footprints:['EGY','MAR','SAU','JOR','PAK','ZAF','UZB'],
   history:[{yr:2026,co:'MAR',proj:'Dakhla Atlantic Wind',amt:'$1.1B',status:'Confirmed'},{yr:2025,co:'EGY',proj:'NEOM Wind + Solar',amt:'$2.8B',status:'Under construction'},{yr:2024,co:'ZAF',proj:'Redstone CSP',amt:'$930M',status:'Completed'}]},
  {cic:'GFM-USA-GOOG-77234',name:'Google (Alphabet)',hq:'USA',hq_city:'Mountain View',sector:'J',sector_name:'Technology',ims:92,rev_b:307.4,employees:181000,listed:true,esg:'LEADER',esg_score:73.8,grade:'GOLD',fdi_stage:'ACTIVE',founded:1998,ceo:'Sundar Pichai',
   footprints:['IRL','GBR','DEU','SGP','IND','ARE','JPN'],
   history:[{yr:2026,co:'ARE',proj:'Cloud Region UAE',amt:'$1.0B',status:'Announced'},{yr:2025,co:'SGP',proj:'Data Centre Expansion',amt:'$2.0B',status:'Committed'},{yr:2024,co:'DEU',proj:'Hamburg Data Centre',amt:'$1.4B',status:'Completed'}]},
];

const GRADE_DOT: Record<string,string>={PLATINUM:'#D97706',GOLD:'#059669',SILVER:'#2563EB',BRONZE:'#6B7280'};
const GRADE_CFG: Record<string,{bg:string;text:string;border:string}> = {
  PLATINUM:{bg:'bg-amber-50',text:'text-amber-800',border:'border-amber-200'},
  GOLD:    {bg:'bg-emerald-50',text:'text-emerald-800',border:'border-emerald-200'},
  SILVER:  {bg:'bg-blue-50',text:'text-blue-800',border:'border-blue-200'},
};

export default function CompanyProfilesPage() {
  const [search,  setSearch]  = useState('');
  const [sector,  setSector]  = useState('');
  const [grade,   setGrade]   = useState('');
  const [sort,    setSort]    = useState<'ims'|'rev_b'>('ims');
  const [selected,setSelected]= useState(COMPANIES[0]);
  const [tab,     setTab]     = useState<'overview'|'history'|'signals'>('overview');

  const filtered = useMemo(()=>COMPANIES.filter(c=>
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.hq.includes(search.toUpperCase())) &&
    (!sector || c.sector_name===sector) &&
    (!grade  || c.grade===grade)
  ).sort((a,b)=>b[sort]-a[sort]),[search,sector,grade,sort]);

  const gc = GRADE_CFG[selected.grade] || GRADE_CFG.GOLD;

  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Company Intelligence</div>
          <h1 className="text-3xl font-extrabold">Company Profiles (CIC)</h1>
          <p className="text-white/60 mt-1 text-sm">Forecasta Company Intelligence Cards · {COMPANIES.length} featured · 140,000+ in platform</p>
        </div>
      </section>

      {/* Filter bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 sticky top-14 z-30">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2 items-center">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company, HQ…"
            className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-40 focus:outline-none focus:border-primary"/>
          {[{v:sector,s:setSector,opts:['','Technology','Manufacturing','Energy'],p:'All Sectors'},
            {v:grade, s:setGrade, opts:['','PLATINUM','GOLD','SILVER'],        p:'All Grades'}].map((f,i)=>(
            <select key={i} value={f.v} onChange={e=>f.s(e.target.value)} className="border border-slate-200 rounded-lg text-xs px-2 py-2 focus:outline-none focus:border-primary">
              <option value="">{f.p}</option>
              {f.opts.filter(Boolean).map(o=><option key={o}>{o}</option>)}
            </select>
          ))}
          <select value={sort} onChange={e=>setSort(e.target.value as any)} className="border border-slate-200 rounded-lg text-xs px-2 py-2 focus:outline-none">
            <option value="ims">Sort: IMS Score</option>
            <option value="rev_b">Sort: Revenue</option>
          </select>
          <button onClick={()=>exportCSV(filtered.map(c=>({CIC:c.cic,Company:c.name,HQ:c.hq,'IMS Score':c.ims,'Revenue $B':c.rev_b,Grade:c.grade})),'GFM_Companies')} className="gfm-btn-outline text-xs py-1.5">Export CSV</button>
          <span className="text-xs text-slate-400 ml-auto font-mono">{filtered.length}/{COMPANIES.length}</span>
        </div>
      </div>

      <div className="flex" style={{height:'calc(100vh - 7.5rem)'}}>
        {/* Company list */}
        <div className="w-72 flex-shrink-0 border-r border-slate-100 bg-white overflow-y-auto">
          {filtered.map(co=>(
            <div key={co.cic} onClick={()=>{setSelected(co);setTab('overview');}}
              className={`px-4 py-3.5 border-b border-slate-50 cursor-pointer transition-all ${selected.cic===co.cic?'bg-primary-light border-l-2 border-l-primary':'hover:bg-slate-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0" style={{background:GRADE_DOT[co.grade]}}>{co.sector}</div>
                <div className="font-bold text-sm text-deep truncate">{co.name}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 ml-9">
                <span>{co.hq_city.split(',')[0]}</span><span>·</span>
                <span className="font-bold text-primary">IMS {co.ims}</span><span>·</span>
                <span className={`font-bold ${co.fdi_stage==='ACTIVE'?'text-emerald-600':'text-slate-400'}`}>{co.fdi_stage}</span>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div className="text-center py-10 text-slate-400 text-sm">No matches</div>}
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 max-w-2xl space-y-4">
            {/* Header */}
            <div className="gfm-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-extrabold text-deep">{selected.name}</div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">{selected.cic}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selected.hq_city} · Founded {selected.founded} · {selected.listed?'Public':'Private'} · CEO: {selected.ceo}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-primary font-mono">{selected.ims}</div>
                  <div className="text-xs text-slate-400">IMS Score</div>
                  <span className={`gfm-badge ${gc.bg} ${gc.text} ${gc.border} mt-1 inline-block`}>{selected.grade}</span>
                </div>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 mb-4">
                {[['overview','Overview'],['history','Inv. History'],['signals','Signals']].map(([t,l])=>(
                  <button key={t} onClick={()=>setTab(t as any)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab===t?'bg-primary text-white':'text-slate-500 hover:bg-slate-100'}`}>{l}</button>
                ))}
              </div>

              {tab==='overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[{l:'Revenue',v:`$${selected.rev_b}B`,c:'text-primary'},{l:'Employees',v:selected.employees>=1e6?`${(selected.employees/1e6).toFixed(1)}M`:selected.employees.toLocaleString(),c:'text-deep'},{l:'Sector',v:`ISIC ${selected.sector}`,c:'text-violet-600'},{l:'FDI Stage',v:selected.fdi_stage,c:'text-emerald-600'}].map(s=>(
                      <div key={s.l} className="bg-surface rounded-lg p-2.5 text-center">
                        <div className="text-xs text-slate-400 mb-0.5">{s.l}</div>
                        <div className={`text-sm font-extrabold ${s.c}`}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">IMS Score</span><span className="font-bold text-primary">{selected.ims}/100</span></div>
                    <div className="gfm-progress"><div className="gfm-progress-fill" style={{width:`${selected.ims}%`}}/></div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex items-center justify-between">
                    <div><div className="text-xs font-bold text-emerald-700">ESG: {selected.esg}</div><div className="text-xs text-emerald-600">Score: {selected.esg_score}/100</div></div>
                    <div className="gfm-progress w-24"><div className="gfm-progress-fill" style={{width:`${selected.esg_score}%`,background:'#059669'}}/></div>
                  </div>
                  <div><div className="text-xs font-bold text-slate-400 mb-1.5">Investment Footprint ({selected.footprints.length} economies)</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.footprints.map(iso=><span key={iso} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded font-mono border border-blue-200">{iso}</span>)}
                    </div>
                  </div>
                </div>
              )}

              {tab==='history' && (
                <div>
                  <table className="w-full gfm-table">
                    <thead><tr><th>Year</th><th>Economy</th><th>Project</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {selected.history.map((h,i)=>(
                        <tr key={i}>
                          <td className="font-mono font-bold text-primary">{h.yr}</td>
                          <td className="font-mono text-slate-500">{h.co}</td>
                          <td className="text-slate-600">{h.proj}</td>
                          <td className="font-mono font-bold text-deep">{h.amt}</td>
                          <td><span className={`text-xs font-semibold ${h.status==='Committed'||h.status==='Confirmed'?'text-emerald-600':h.status==='Completed'?'text-slate-500':h.status==='Announced'?'text-primary':'text-amber-600'}`}>{h.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab==='signals' && (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📡</div>
                  <p className="text-sm text-slate-500 mb-4">View all signals for {selected.name} in the signals dashboard.</p>
                  <a href="/signals" className="gfm-btn-primary text-xs py-2 px-5">View Company Signals</a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="gfm-card p-4">
              <div className="font-bold text-sm text-deep mb-3">Intelligence Actions</div>
              <div className="grid grid-cols-2 gap-2">
                {[{l:'Full CIC Report',c:'5 FIC',i:'📋'},{l:'Add to Pipeline',c:'Free',i:'➕'},{l:'View Signals',c:'Free',i:'📡'},{l:'Mission Dossier',c:'18 FIC',i:'🎯'}].map(a=>(
                  <button key={a.l} onClick={()=>window.location.href='/subscription'}
                    className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-slate-100 hover:border-primary transition-all text-xs text-left">
                    <span className="text-lg">{a.i}</span>
                    <div><div className="font-bold text-deep">{a.l}</div><div className="text-slate-400">{a.c}</div></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
