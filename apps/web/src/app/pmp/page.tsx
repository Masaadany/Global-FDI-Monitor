'use client';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const TARGET_COMPANIES = [
  {cic:'GFM-USA-MSFT-12847', name:'Microsoft Corp',    hq:'USA',sector:'J',mfs:94.2,ims:96,rev_b:211.9,employees:221000,esg:'LEADER',stage:'TARGETED',  capex_range:'$500M-$2B',  conviction:'VERY HIGH'},
  {cic:'GFM-USA-AMZN-98120', name:'Amazon AWS',        hq:'USA',sector:'J',mfs:91.8,ims:95,rev_b:90.8, employees:1500000,esg:'LEADER',stage:'TARGETED',  capex_range:'$1B+',       conviction:'VERY HIGH'},
  {cic:'GFM-USA-NVDA-66234', name:'NVIDIA Corporation',hq:'USA',sector:'J',mfs:89.4,ims:94,rev_b:60.9, employees:29600,  esg:'LEADER',stage:'ENGAGED',   capex_range:'$200M-$800M',conviction:'HIGH'},
  {cic:'GFM-USA-DATA-88234', name:'Databricks',        hq:'USA',sector:'J',mfs:88.4,ims:82,rev_b:1.6,  employees:6000,   esg:'ACTIVE',stage:'ENGAGED',   capex_range:'$100M-$500M',conviction:'HIGH'},
  {cic:'GFM-USA-PLTR-25422', name:'Palantir Technologies',hq:'USA',sector:'J',mfs:85.1,ims:84,rev_b:2.23,employees:3900, esg:'STRONG',stage:'TARGETED',  capex_range:'$50M-$200M', conviction:'MEDIUM'},
  {cic:'GFM-USA-SNOW-11234', name:'Snowflake Inc',     hq:'USA',sector:'J',mfs:82.7,ims:79,rev_b:2.8,  employees:7000,   esg:'STRONG',stage:'TARGETED',  capex_range:'$100M-$300M',conviction:'MEDIUM'},
  {cic:'GFM-DEU-SINEN-44221',name:'Siemens Energy',    hq:'DEU',sector:'D',mfs:88.3,ims:85,rev_b:35.3, employees:92000,  esg:'LEADER',stage:'COMMITTED', capex_range:'$200M-$500M',conviction:'CONFIRMED'},
  {cic:'GFM-DNK-VEST-55123', name:'Vestas Wind',       hq:'DNK',sector:'D',mfs:84.9,ims:80,rev_b:15.9, employees:29000,  esg:'LEADER',stage:'NEGOTIATING',capex_range:'$300M-$800M',conviction:'HIGH'},
  {cic:'GFM-CHN-CATL-11234', name:'CATL',              hq:'CHN',sector:'C',mfs:86.2,ims:90,rev_b:44.0, employees:102000, esg:'STRONG',stage:'COMMITTED', capex_range:'$1B-$5B',    conviction:'CONFIRMED'},
  {cic:'GFM-USA-BLR-77891',  name:'BlackRock',         hq:'USA',sector:'K',mfs:79.8,ims:88,rev_b:17.9, employees:21000,  esg:'STRONG',stage:'PROSPECTING',capex_range:'$200M-$600M',conviction:'MEDIUM'},
];

const MISSIONS = [
  {id:'PMP-ARE-J-20260317-0001',economy:'UAE',sector:'J',status:'ACTIVE',  targets:6, progress:42, created:'2026-03-17',fic_cost:30},
  {id:'PMP-SAU-D-20260315-0001',economy:'Saudi Arabia',sector:'D',status:'ACTIVE',targets:5,progress:28,created:'2026-03-15',fic_cost:30},
  {id:'PMP-EGY-D-20260310-0001',economy:'Egypt',sector:'D',status:'COMPLETE',targets:4,progress:100,created:'2026-03-10',fic_cost:30},
];

const ECONOMIES  = ['UAE','Saudi Arabia','India','Egypt','Vietnam','Indonesia','Germany','Singapore','Nigeria','Morocco','Kenya','Brazil'];
const SECTOR_MAP = [['J','ICT'],['D','Energy'],['K','Finance'],['C','Manufacturing'],['B','Mining'],['L','Real Estate'],['H','Logistics']];
const STAGES     = ['TARGETED','PROSPECTING','ENGAGED','NEGOTIATING','COMMITTED','CLOSED_WON'];
const STAGE_COLORS: Record<string,string> = {
  TARGETED:'text-slate-500',PROSPECTING:'text-violet-600',ENGAGED:'text-blue-600',
  NEGOTIATING:'text-amber-600',COMMITTED:'text-emerald-600',CLOSED_WON:'text-teal-600',
};
const MFS_BG = (s:number) => s>=90?'bg-amber-100 text-amber-700':s>=80?'bg-emerald-100 text-emerald-700':s>=70?'bg-blue-100 text-blue-700':'bg-slate-100 text-slate-600';

export default function PMPPage() {
  const [tab,       setTab]       = useState<'missions'|'targets'|'new'>('missions');
  const [economy,   setEconomy]   = useState('UAE');
  const [sector,    setSector]    = useState('J');
  const [generating,setGenerating]= useState(false);
  const [newMission,setNewMission]= useState<any>(null);
  const [selected,  setSelected]  = useState<typeof TARGET_COMPANIES[0]|null>(null);

  async function generate() {
    setGenerating(true);
    try {
      const token = typeof window!=='undefined' ? localStorage.getItem('gfm_token') : null;
      const res = await fetch(`${API}/api/v1/pmp/missions`,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token||''}`},
        body: JSON.stringify({economy, sector}),
      });
      const data = await res.json();
      if (data.success) { setNewMission(data.data); setTab('targets'); }
    } catch { setNewMission({mission_id:`PMP-${economy.slice(0,3).toUpperCase()}-${sector}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-0001`,targets:TARGET_COMPANIES.slice(0,5),fic_cost:30}); setTab('targets'); }
    finally { setGenerating(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">AI-Powered Targeting</div>
          <h1 className="text-3xl font-black mb-2">Promotion Mission Planning</h1>
          <p className="text-blue-200 text-sm">AI generates prioritised company targets for any economy-sector combination, scored by Mission Feasibility Score (MFS).</p>
          <div className="flex gap-8 mt-5">
            {[{l:'Active Missions',v:MISSIONS.filter(m=>m.status==='ACTIVE').length},{l:'Total Targets',v:TARGET_COMPANIES.length},{l:'Avg MFS',v:Math.round(TARGET_COMPANIES.reduce((s,c)=>s+c.mfs,0)/TARGET_COMPANIES.length)}].map(s=>(
              <div key={s.l}><div className="text-2xl font-black">{s.v}</div><div className="text-blue-400 text-xs">{s.l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(['missions','targets','new'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all ${tab===t?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200 hover:border-blue-300'}`}>
              {t==='new'?'+ New Mission':t==='targets'?`Target Companies (${TARGET_COMPANIES.length})`:t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* Missions */}
        {tab==='missions' && (
          <div className="space-y-3">
            {MISSIONS.map(m=>(
              <div key={m.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-black text-lg text-[#0A2540]">{m.economy} — ISIC {m.sector}</div>
                    <div className="text-xs font-mono text-slate-300 mt-0.5">{m.id}</div>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${m.status==='ACTIVE'?'bg-emerald-100 text-emerald-700':m.status==='COMPLETE'?'bg-blue-100 text-blue-700':'bg-slate-100 text-slate-500'}`}>{m.status}</span>
                </div>
                <div className="mb-2 flex justify-between text-xs text-slate-400">
                  <span>{m.targets} target companies</span><span>{m.progress}% pipeline progress</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{width:`${m.progress}%`}}/>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>setTab('targets')} className="text-xs font-bold text-blue-600 hover:underline">View targets →</button>
                  <span className="text-slate-200">·</span>
                  <span className="text-xs text-slate-400">Created {m.created}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Targets */}
        {tab==='targets' && (
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-2">
              {TARGET_COMPANIES.map(co=>(
                <div key={co.cic} onClick={()=>setSelected(selected?.cic===co.cic?null:co)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${selected?.cic===co.cic?'border-blue-400 shadow-md':'border-slate-100 hover:border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className="text-center flex-shrink-0">
                      <div className={`text-sm font-black px-2 py-1 rounded-lg ${MFS_BG(co.mfs)}`}>{co.mfs}</div>
                      <div className="text-xs text-slate-400 mt-0.5">MFS</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="font-black text-sm text-[#0A2540]">{co.name}</div>
                        <span className="text-xs text-slate-400">{co.hq}</span>
                        <span className={`text-xs font-bold ml-auto ${STAGE_COLORS[co.stage]}`}>{co.stage}</span>
                      </div>
                      <div className="flex gap-3 text-xs text-slate-400">
                        <span className="font-bold text-blue-600">${co.rev_b}B revenue</span>
                        <span>{co.employees.toLocaleString()} employees</span>
                        <span>ISIC {co.sector}</span>
                        <span className="text-emerald-600">{co.conviction}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">Target range: <span className="font-bold text-slate-600">{co.capex_range}</span></div>
                    </div>
                  </div>
                  {selected?.cic===co.cic && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                      <button className="text-xs bg-[#0A2540] text-white font-bold py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">Full Dossier — 18 FIC</button>
                      <button className="text-xs border border-slate-200 text-slate-600 font-bold py-2 rounded-lg hover:border-blue-300 transition-colors">Add to Pipeline</button>
                      <button className="text-xs border border-slate-200 text-slate-600 font-bold py-2 rounded-lg hover:border-blue-300 transition-colors">Generate Outreach</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* MFS legend */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="font-black text-sm text-[#0A2540] mb-4">MFS Score Guide</div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Mission Feasibility Score combines 8 factors: FDI motivation, market fit, strategic alignment, financial capability, regulatory risk, political stability, ESG profile, and historical precedent.</p>
                {[{r:'90-100',l:'VERY HIGH — Priority target',c:'bg-amber-100 text-amber-700'},{r:'80-89',l:'HIGH — Strong candidate',c:'bg-emerald-100 text-emerald-700'},{r:'70-79',l:'MEDIUM — Worth pursuing',c:'bg-blue-100 text-blue-700'},{r:'<70',l:'LOW — Monitor only',c:'bg-slate-100 text-slate-600'}].map(s=>(
                  <div key={s.r} className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${s.c} flex-shrink-0`}>{s.r}</span>
                    <span className="text-xs text-slate-500">{s.l}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="font-black text-sm text-[#0A2540] mb-2">Stage Distribution</div>
                {STAGES.map(s=>{
                  const count = TARGET_COMPANIES.filter(c=>c.stage===s).length;
                  if (!count) return null;
                  return (
                    <div key={s} className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold w-24 flex-shrink-0 ${STAGE_COLORS[s]}`}>{s}</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{width:`${(count/TARGET_COMPANIES.length)*100}%`}}/>
                      </div>
                      <span className="text-xs font-bold text-slate-500 w-4">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* New mission */}
        {tab==='new' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-black text-[#0A2540] text-lg mb-5">Generate New Mission</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Target Economy</label>
                  <select value={economy} onChange={e=>setEconomy(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400">
                    {ECONOMIES.map(e=><option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Primary Sector</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SECTOR_MAP.map(([c,n])=>(
                      <button key={c} type="button" onClick={()=>setSector(c)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all text-left ${sector===c?'border-blue-400 bg-blue-50 text-blue-700':'border-slate-200 text-slate-500 hover:border-blue-200'}`}>
                        <span className="font-black">ISIC {c}</span> — {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-xs text-blue-700">
                    <div className="font-black mb-1">Mission will include:</div>
                    <ul className="space-y-0.5">
                      <li>• Top 5-8 companies ranked by MFS score</li>
                      <li>• Full CIC profiles for each target</li>
                      <li>• Recommended engagement strategy</li>
                      <li>• Gap analysis vs sector benchmark</li>
                    </ul>
                  </div>
                </div>
                <button onClick={generate} disabled={generating}
                  className={`w-full font-black py-4 rounded-xl transition-colors text-lg ${generating?'bg-slate-300 text-slate-500 cursor-not-allowed':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'}`}>
                  {generating?(
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      Generating mission…
                    </span>
                  ):'Generate Mission — 30 FIC'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
