'use client';
import { useState, useEffect } from 'react';
import { exportPipeline, exportJSON } from '@/lib/export';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const STAGES = ['PROSPECTING','ENGAGED','NEGOTIATING','COMMITTED','CLOSED_WON'] as const;
type Stage = typeof STAGES[number];

const STAGE_CONFIG: Record<Stage,{label:string;color:string;bg:string;border:string;prob:number}> = {
  PROSPECTING: {label:'Prospecting',   color:'text-slate-600',   bg:'bg-slate-50',  border:'border-slate-200', prob:20},
  ENGAGED:     {label:'Engaged',       color:'text-blue-700',    bg:'bg-blue-50',   border:'border-blue-200',  prob:40},
  NEGOTIATING: {label:'Negotiating',   color:'text-amber-700',   bg:'bg-amber-50',  border:'border-amber-200', prob:65},
  COMMITTED:   {label:'Committed',     color:'text-emerald-700', bg:'bg-emerald-50',border:'border-emerald-200',prob:85},
  CLOSED_WON:  {label:'Closed ✓',     color:'text-teal-700',    bg:'bg-teal-50',   border:'border-teal-200',  prob:100},
};

const MOCK_DEALS = [
  {id:'PIPE-001',company:'Microsoft Corp',hq:'USA',iso3:'ARE',sector:'J',capex_m:850,stage:'NEGOTIATING' as Stage,probability:75,contact:'Sarah Chen',days:8,  notes:'Data centre confirmed. Site visit completed 2026-03-12.',grade:'PLATINUM'},
  {id:'PIPE-002',company:'Amazon AWS',    hq:'USA',iso3:'SAU',sector:'J',capex_m:5300,stage:'COMMITTED' as Stage, probability:92,contact:'Ahmed Al-Rashid',days:15,notes:'MoU signed. Board approval expected Q2.',grade:'PLATINUM'},
  {id:'PIPE-003',company:'Siemens Energy',hq:'DEU',iso3:'EGY',sector:'D',capex_m:340, stage:'ENGAGED' as Stage,   probability:55,contact:'Maria Rodriguez',days:5, notes:'Site visit scheduled 2026-03-25.',grade:'GOLD'},
  {id:'PIPE-004',company:'CATL',          hq:'CHN',iso3:'IDN',sector:'C',capex_m:3200,stage:'COMMITTED' as Stage, probability:88,contact:'James Park',    days:22,notes:'Land acquisition complete. Phase 1 start Q3 2026.',grade:'PLATINUM'},
  {id:'PIPE-005',company:'Vestas Wind',   hq:'DNK',iso3:'IND',sector:'D',capex_m:420, stage:'PROSPECTING' as Stage,probability:30,contact:'Wei Zhang',    days:3, notes:'Initial inquiry via LinkedIn.',grade:'GOLD'},
  {id:'PIPE-006',company:'Databricks',    hq:'USA',iso3:'SGP',sector:'J',capex_m:150, stage:'ENGAGED' as Stage,   probability:60,contact:'Priya Nair',    days:8, notes:'Demo scheduled for EDB leadership.',grade:'SILVER'},
  {id:'PIPE-007',company:'ACWA Power',    hq:'SAU',iso3:'MAR',sector:'D',capex_m:1100,stage:'COMMITTED' as Stage, probability:90,contact:'Omar Malik',    days:18,notes:'EPC contract signed. IFC financing approved.',grade:'GOLD'},
  {id:'PIPE-008',company:'Palantir',      hq:'USA',iso3:'GBR',sector:'J',capex_m:200, stage:'NEGOTIATING' as Stage,probability:65,contact:'James Davies',  days:11,notes:'Contract terms being finalised.',grade:'GOLD'},
];

const GRADE_DOT: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

export default function PipelinePage() {
  const [deals,   setDeals]   = useState(MOCK_DEALS);
  const [view,    setView]    = useState<'kanban'|'table'>('kanban');
  const [filter,  setFilter]  = useState('');
  const [dragging,setDragging]= useState<string|null>(null);
  const [dragOver,setDragOver]= useState<Stage|null>(null);
  const [saving,  setSaving]  = useState<string|null>(null);

  const totalCapex = deals.reduce((s,d)=>s+d.capex_m,0);
  const weightedPipe = deals.reduce((s,d)=>s+(d.capex_m*d.probability/100),0);

  async function moveStage(dealId: string, newStage: Stage) {
    setSaving(dealId);
    setDeals(prev => prev.map(d => d.id===dealId ? {...d, stage:newStage, probability:STAGE_CONFIG[newStage].prob, days:0} : d));
    try {
      const token = typeof window!=='undefined' ? localStorage.getItem('gfm_token') : null;
      await fetch(`${API}/api/v1/pipeline/deals/${dealId}`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token||''}`},
        body:JSON.stringify({stage:newStage}),
      });
    } catch {}
    setTimeout(()=>setSaving(null),500);
  }

  const filtered = deals.filter(d => !filter || d.company.toLowerCase().includes(filter.toLowerCase()) || d.iso3.includes(filter.toUpperCase()));

  const DealCard = ({deal}: {deal:typeof MOCK_DEALS[0]}) => (
    <div draggable onDragStart={()=>setDragging(deal.id)} onDragEnd={()=>{setDragging(null);setDragOver(null);}}
      className={`bg-white rounded-xl border p-3 cursor-grab active:cursor-grabbing transition-all shadow-sm hover:shadow-md ${saving===deal.id?'opacity-50':''} ${dragging===deal.id?'opacity-40 rotate-2':''}`}
      style={{borderColor:GRADE_DOT[deal.grade]+'44'}}>
      <div className="flex items-start gap-2 mb-2">
        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:GRADE_DOT[deal.grade]}}/>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-xs text-deep truncate">{deal.company}</div>
          <div className="text-xs text-slate-400">{deal.iso3} · ISIC {deal.sector}</div>
        </div>
        <div className="text-xs font-black text-blue-600 flex-shrink-0">${deal.capex_m>=1000?`${(deal.capex_m/1000).toFixed(1)}B`:`${deal.capex_m}M`}</div>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{width:`${deal.probability}%`}}/>
        </div>
        <span className="text-xs font-bold text-slate-500">{deal.probability}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{deal.contact} · {deal.days}d</span>
        <div className="flex gap-1">
          {STAGES.filter(s=>s!==deal.stage).slice(0,1).map(s=>(
            <button key={s} onClick={()=>moveStage(deal.id,s)}
              className="text-xs text-slate-400 hover:text-blue-600 px-1 py-0.5 rounded hover:bg-blue-50 transition-colors">
              → {STAGE_CONFIG[s].label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
      {deal.notes && <p className="text-xs text-slate-400 mt-1.5 leading-tight line-clamp-1">{deal.notes}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-3 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-deep">Investment Pipeline</span>
        <div className="flex gap-1 ml-2">
          {(['kanban','table'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${view===v?'bg-deep text-white':'text-slate-400 border border-slate-200'}`}>
              {v==='kanban'?'⬜ Kanban':'📋 Table'}
            </button>
          ))}
        </div>
        <input placeholder="Search company, ISO3…" value={filter} onChange={e=>setFilter(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-36 focus:outline-none focus:border-primary ml-2"/>
        <div className="flex gap-4 text-xs text-slate-400 ml-auto">
          <span>Pipeline: <strong className="text-slate-700">${(totalCapex/1000).toFixed(1)}B</strong></span>
          <span>Weighted: <strong className="text-emerald-600">${(weightedPipe/1000).toFixed(1)}B</strong></span>
          <span>{filtered.length} deals</span>
        </div>
        <button onClick={()=>exportPipeline(filtered.map(d=>({...d})))}
          className="text-xs font-bold border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg hover:border-primary">
          Export CSV
        </button>
      </div>

      {/* Kanban */}
      {view==='kanban' && (
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {STAGES.map(stage=>{
              const stageCfg = STAGE_CONFIG[stage];
              const stageDeals = filtered.filter(d=>d.stage===stage);
              const stageCapex = stageDeals.reduce((s,d)=>s+d.capex_m,0);
              return (
                <div key={stage} className="w-60 flex-shrink-0"
                  onDragOver={e=>{e.preventDefault();setDragOver(stage);}}
                  onDrop={()=>{if(dragging) moveStage(dragging,stage);}}>
                  <div className={`rounded-xl border p-2 mb-2 ${stageCfg.bg} ${stageCfg.border}`}>
                    <div className={`text-xs font-black ${stageCfg.color}`}>{stageCfg.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{stageDeals.length} deals · ${stageCapex>=1000?`${(stageCapex/1000).toFixed(1)}B`:`${stageCapex}M`}</div>
                  </div>
                  <div className={`space-y-2 min-h-24 rounded-xl p-1 transition-colors ${dragOver===stage&&dragging?'bg-blue-50 border-2 border-dashed border-blue-300':''}`}>
                    {stageDeals.map(d=><DealCard key={d.id} deal={d}/>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      {view==='table' && (
        <div className="max-w-6xl mx-auto p-5">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['Company','Economy','Sector','CapEx','Stage','Probability','Contact','Days','Notes'].map(h=>(
                  <th key={h} className="text-left px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(d=>{
                  const sc = STAGE_CONFIG[d.stage];
                  return (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{background:GRADE_DOT[d.grade]}}/>
                          <span className="font-bold text-deep">{d.company}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-blue-600">{d.iso3}</td>
                      <td className="px-4 py-3 text-slate-500">ISIC {d.sector}</td>
                      <td className="px-4 py-3 font-black text-blue-600">${d.capex_m>=1000?`${(d.capex_m/1000).toFixed(1)}B`:`${d.capex_m}M`}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold border ${sc.bg} ${sc.color} ${sc.border}`}>{sc.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{width:`${d.probability}%`}}/>
                          </div>
                          <span className="font-bold text-slate-600">{d.probability}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{d.contact}</td>
                      <td className="px-4 py-3 text-slate-400">{d.days}d</td>
                      <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{d.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
