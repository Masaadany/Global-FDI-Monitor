'use client';
import { useState } from 'react';

const DEALS = [
  {id:'PIPE-001',company:'Microsoft Corp',hq:'USA',economy:'UAE',sector:'Technology',capex_m:850,stage:'COMMITTED',probability:92,contact:'Sarah Chen - VP FDI',days_in_stage:14,notes:'MoU signed Mar 10. Site selection in progress. DSO preferred.'},
  {id:'PIPE-002',company:'Amazon AWS',hq:'USA',economy:'Saudi Arabia',sector:'Cloud',capex_m:5300,stage:'NEGOTIATING',probability:74,contact:'Ahmed Al-Rashid - Dir Partnerships',days_in_stage:28,notes:'Term sheet under review. Three AZs proposed. Decision Q2.'},
  {id:'PIPE-003',company:'Siemens Energy',hq:'DEU',economy:'Egypt',sector:'Energy',capex_m:340,stage:'COMMITTED',probability:91,contact:'Klaus Mueller - SVP MENA',days_in_stage:7,notes:'JV agreement with EEHC finalized. Ground-breaking June 2026.'},
  {id:'PIPE-004',company:'Vestas Wind',hq:'DNK',economy:'India',sector:'Renewables',capex_m:420,stage:'ENGAGED',probability:61,contact:'Priya Sharma - Country Manager',days_in_stage:42,notes:'Rajasthan site shortlisted. Grid connection study underway.'},
  {id:'PIPE-005',company:'Databricks',hq:'USA',economy:'Singapore',sector:'AI/Data',capex_m:150,stage:'ENGAGED',probability:58,contact:'Wei Lin - APAC Director',days_in_stage:21,notes:'Regional HQ evaluation. EDB incentive package pending.'},
  {id:'PIPE-006',company:'BlackRock',hq:'USA',economy:'UAE',sector:'Finance',capex_m:500,stage:'PROSPECTING',probability:38,contact:'James Park - MD Middle East',days_in_stage:5,notes:'Initial meeting held. ADGM framework review requested.'},
  {id:'PIPE-007',company:'Nuveen AM',hq:'USA',economy:'UAE',sector:'Finance',capex_m:600,stage:'PROSPECTING',probability:31,contact:'TBD',days_in_stage:2,notes:'Identified via signal MSS-GFS-ARE-0006. Outreach not yet sent.'},
  {id:'PIPE-008',company:'Palantir',hq:'USA',economy:'Saudi Arabia',sector:'AI/Data',capex_m:200,stage:'TARGETED',probability:22,contact:'TBD',days_in_stage:0,notes:'MFS 85.1. Generated via Mission PMP-SAU-J-20260317-0001.'},
  {id:'PIPE-009',company:'Snowflake',hq:'USA',economy:'Singapore',sector:'AI/Data',capex_m:120,stage:'TARGETED',probability:19,contact:'TBD',days_in_stage:0,notes:'MFS 82.7. Target based on sector gap analysis.'},
  {id:'PIPE-010',company:'CATL',hq:'CHN',economy:'Indonesia',sector:'Manufacturing',capex_m:3200,stage:'COMMITTED',probability:88,contact:'Li Wei - Intl Investments',days_in_stage:31,notes:'Battery gigafactory confirmed. Land acquisition in progress.'},
];

const STAGES = ['TARGETED','PROSPECTING','ENGAGED','NEGOTIATING','COMMITTED','CLOSED_WON'];
const STAGE_COLORS: Record<string,{bg:string,text:string,border:string}> = {
  TARGETED:    {bg:'bg-slate-100',  text:'text-slate-500',   border:'border-slate-300'},
  PROSPECTING: {bg:'bg-violet-100', text:'text-violet-700',  border:'border-violet-300'},
  ENGAGED:     {bg:'bg-blue-100',   text:'text-blue-700',    border:'border-blue-300'},
  NEGOTIATING: {bg:'bg-amber-100',  text:'text-amber-700',   border:'border-amber-300'},
  COMMITTED:   {bg:'bg-emerald-100',text:'text-emerald-700', border:'border-emerald-300'},
  CLOSED_WON:  {bg:'bg-teal-100',   text:'text-teal-700',    border:'border-teal-300'},
};

type ViewMode = 'kanban' | 'table';

function ProbabilityBar({pct}: {pct:number}) {
  const color = pct>=80?'bg-emerald-500':pct>=60?'bg-blue-500':pct>=40?'bg-amber-500':'bg-slate-300';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{width:`${pct}%`}}/>
      </div>
      <span className="text-xs font-bold text-slate-500 w-6">{pct}%</span>
    </div>
  );
}

export default function InvestmentPipelinePage() {
  const [view,     setView]     = useState<ViewMode>('kanban');
  const [selected, setSelected] = useState<typeof DEALS[0]|null>(null);
  const [economy,  setEconomy]  = useState('');

  const filtered = DEALS.filter(d => !economy || d.economy===economy);
  const economies = [...new Set(DEALS.map(d=>d.economy))];

  // Pipeline KPIs
  const totalCapex   = DEALS.reduce((s,d)=>s+d.capex_m,0);
  const committed    = DEALS.filter(d=>d.stage==='COMMITTED');
  const weightedVal  = DEALS.reduce((s,d)=>s+(d.capex_m*d.probability/100),0);
  const atRisk       = DEALS.filter(d=>d.days_in_stage>45 && d.stage==='NEGOTIATING');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Investment Pipeline</span>
        <div className="flex gap-1 ml-4">
          {(['kanban','table'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${view===v?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>
              {v==='kanban'?'🗂 Kanban':'📋 Table'}
            </button>
          ))}
        </div>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2 ml-2"
          value={economy} onChange={e=>setEconomy(e.target.value)}>
          <option value="">All Economies</option>
          {economies.map(e=><option key={e}>{e}</option>)}
        </select>
        <div className="flex gap-4 ml-auto text-xs">
          <div className="text-center"><span className="font-black text-blue-600 text-lg">${(totalCapex/1000).toFixed(1)}B</span><div className="text-slate-400">Total pipeline</div></div>
          <div className="text-center"><span className="font-black text-emerald-600 text-lg">${(committed.reduce((s,d)=>s+d.capex_m,0)/1000).toFixed(1)}B</span><div className="text-slate-400">Committed</div></div>
          <div className="text-center"><span className="font-black text-amber-600 text-lg">${(weightedVal/1000).toFixed(1)}B</span><div className="text-slate-400">Weighted</div></div>
          {atRisk.length>0&&<div className="text-center"><span className="font-black text-red-500 text-lg">{atRisk.length}</span><div className="text-slate-400">At risk</div></div>}
        </div>
      </div>

      {/* Kanban view */}
      {view==='kanban' && (
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-4" style={{minWidth:'1100px'}}>
            {STAGES.map(stage=>{
              const stageDeal=filtered.filter(d=>d.stage===stage);
              const stageVal=stageDeal.reduce((s,d)=>s+d.capex_m,0);
              const sc=STAGE_COLORS[stage];
              return (
                <div key={stage} className="flex-1 min-w-40">
                  <div className={`rounded-xl border px-3 py-2 mb-3 ${sc.bg} ${sc.border}`}>
                    <div className={`text-xs font-black ${sc.text}`}>{stage}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{stageDeal.length} deals · ${(stageVal/1000).toFixed(1)}B</div>
                  </div>
                  <div className="space-y-2">
                    {stageDeal.map(deal=>(
                      <div key={deal.id} onClick={()=>setSelected(deal)}
                        className="bg-white rounded-xl border border-slate-100 p-3 cursor-pointer hover:shadow-sm transition-all hover:border-blue-200">
                        <div className="font-bold text-xs text-[#0A2540] mb-1">{deal.company}</div>
                        <div className="text-xs text-slate-400 mb-2">{deal.economy} · {deal.sector}</div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-blue-600">${deal.capex_m}M</span>
                          <span className="text-xs text-slate-400">{deal.days_in_stage}d</span>
                        </div>
                        <ProbabilityBar pct={deal.probability}/>
                      </div>
                    ))}
                    {stageDeal.length===0&&<div className="text-center py-6 text-xs text-slate-300">Empty</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table view */}
      {view==='table' && (
        <div className="p-5">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Company','Economy','Sector','CapEx','Stage','Probability','Days','Contact'].map(h=>(
                    <th key={h} className="text-left px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(deal=>{
                  const sc=STAGE_COLORS[deal.stage];
                  return (
                    <tr key={deal.id} onClick={()=>setSelected(deal)}
                      className="border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-[#0A2540]">{deal.company}</td>
                      <td className="px-4 py-3 text-slate-500">{deal.economy}</td>
                      <td className="px-4 py-3 text-slate-500">{deal.sector}</td>
                      <td className="px-4 py-3 font-black text-blue-600">${deal.capex_m}M</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>{deal.stage}</span>
                      </td>
                      <td className="px-4 py-3"><ProbabilityBar pct={deal.probability}/></td>
                      <td className="px-4 py-3 text-slate-500">{deal.days_in_stage}d</td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-32">{deal.contact}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deal detail panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-end z-50 p-4">
          <div className="bg-white rounded-2xl w-96 shadow-2xl overflow-y-auto max-h-screen">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="font-black text-[#0A2540]">{selected.company}</div>
              <button onClick={()=>setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[{l:'Economy',v:selected.economy},{l:'Sector',v:selected.sector},{l:'CapEx',v:`$${selected.capex_m}M`},{l:'HQ',v:selected.hq}].map(f=>(
                  <div key={f.l} className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-0.5">{f.l}</div>
                    <div className="font-bold text-sm text-[#0A2540]">{f.v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Close Probability</span>
                  <span className="font-bold text-blue-600">{selected.probability}%</span>
                </div>
                <ProbabilityBar pct={selected.probability}/>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Notes</div>
                <div className="text-sm text-slate-600">{selected.notes}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Primary Contact</div>
                <div className="text-sm font-semibold text-[#0A2540]">{selected.contact}</div>
              </div>
              <div className="flex gap-2">
                {['ENGAGED','NEGOTIATING','COMMITTED'].filter(s=>s!==selected.stage).map(s=>(
                  <button key={s} className="flex-1 border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg hover:border-blue-300 transition-colors">
                    → {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
