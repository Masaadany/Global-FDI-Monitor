'use client';
import { useState } from 'react';
import Link from 'next/link';
const INSIGHTS = [
  {id:'INS-001',type:'MACRO_TREND',urgency:'HIGH',region:'MENA',date:'2026-03-17',verified:true,fic:null,
   title:'MENA FDI hits 5-year high at $88B',
   summary:'FDI inflows to the MENA region reached $88 billion in 2025, the highest since 2020, driven by technology and renewable energy investments into UAE and Saudi Arabia.',
   tags:['UAE','Saudi Arabia','Technology','Energy'],source:'UNCTAD'},
  {id:'INS-002',type:'REGULATORY',urgency:'HIGH',region:'SAS',date:'2026-03-15',verified:true,fic:null,
   title:'India raises insurance FDI cap to 100%',
   summary:'India\'s government has raised the FDI cap in the insurance sector to 100% under the automatic route, opening an estimated $8B pipeline for foreign insurers.',
   tags:['India','Finance','Regulatory'],source:'Ministry of Finance'},
  {id:'INS-003',type:'SECTOR_SIGNAL',urgency:'MEDIUM',region:'MENA',date:'2026-03-14',verified:true,fic:5,
   title:'Data centre FDI to MENA: $28B projected by 2028',
   summary:'GFM projects $28B in data centre foreign direct investment to the MENA region by 2028, with UAE and Saudi Arabia accounting for 80% of the total.',
   tags:['UAE','ICT','Data Centres'],source:'GFM Intelligence'},
  {id:'INS-004',type:'GEOPOLITICAL',urgency:'MEDIUM',region:'EAP',date:'2026-03-13',verified:true,fic:null,
   title:'ASEAN supply chain reconfiguration accelerates',
   summary:'Vietnam, Indonesia and Malaysia are receiving accelerating supply chain FDI as multinationals diversify manufacturing away from single-country dependence.',
   tags:['Vietnam','Indonesia','Manufacturing'],source:'World Bank'},
  {id:'INS-005',type:'COMMODITY_LINK',urgency:'LOW',region:'SSA',date:'2026-03-12',verified:true,fic:null,
   title:'African critical minerals corridor: $14B pipeline',
   summary:'A new $14B investment pipeline targeting critical minerals in the DRC, Zambia and Zimbabwe is emerging as battery supply chains restructure globally.',
   tags:['DRC','Zambia','Mining'],source:'AfDB'},
  {id:'INS-006',type:'GFR_UPDATE',urgency:'MEDIUM',region:'MENA',date:'2026-03-11',verified:true,fic:null,
   title:'UAE records largest quarterly GFR gain',
   summary:'UAE achieves +4.2 GFR points in Q1 2026, the largest quarterly gain in the ranking\'s 8-year history, driven by digital infrastructure and policy reforms.',
   tags:['UAE','GFR','Digital'],source:'GFM'},
];
const TYPE_CONFIG: Record<string,{bg:string;text:string;border:string;label:string}> = {
  MACRO_TREND:   {bg:'bg-blue-50',   text:'text-blue-700',   border:'border-blue-200',  label:'Macro Trend'},
  REGULATORY:    {bg:'bg-violet-50', text:'text-violet-700', border:'border-violet-200',label:'Regulatory'},
  SECTOR_SIGNAL: {bg:'bg-amber-50',  text:'text-amber-700',  border:'border-amber-200', label:'Sector Signal'},
  GEOPOLITICAL:  {bg:'bg-red-50',    text:'text-red-700',    border:'border-red-200',   label:'Geopolitical'},
  COMMODITY_LINK:{bg:'bg-emerald-50',text:'text-emerald-700',border:'border-emerald-200',label:'Commodity'},
  GFR_UPDATE:    {bg:'bg-teal-50',   text:'text-teal-700',   border:'border-teal-200',  label:'GFR Update'},
};
const URG: Record<string,string> = {HIGH:'text-red-500',MEDIUM:'text-amber-500',LOW:'text-slate-400'};
export default function InsightsPage() {
  const [filter,setFilter]=useState('');
  const filtered=INSIGHTS.filter(i=>!filter||i.type===filter||i.region===filter);
  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Intelligence Feed</div>
          <h1 className="text-4xl font-extrabold mb-2">Resources &amp; Insights</h1>
          <p className="text-white/70">Verified FDI intelligence briefs — macro trends, regulatory updates, sector signals, and GFR updates.</p>
        </div>
      </section>
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2">
          {[['','All Types'],['MACRO_TREND','Macro'],['REGULATORY','Regulatory'],['SECTOR_SIGNAL','Sector'],['GEOPOLITICAL','Geopolitical'],['GFR_UPDATE','GFR'],['MENA','MENA'],['SAS','South Asia'],['EAP','East Asia']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter===v?'bg-primary text-white':'bg-white border border-slate-200 text-slate-500 hover:border-primary'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(ins=>{
          const tc=TYPE_CONFIG[ins.type]||TYPE_CONFIG.MACRO_TREND;
          return (
            <div key={ins.id} className="gfm-card p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className={`gfm-badge ${tc.bg} ${tc.text} ${tc.border}`}>{tc.label}</span>
                <div className="flex items-center gap-2">
                  {ins.fic&&<span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{ins.fic} FIC</span>}
                  <span className={`text-xs font-bold ${URG[ins.urgency]}`}>{ins.urgency}</span>
                </div>
              </div>
              <h2 className="font-bold text-base text-deep mb-2 leading-snug">{ins.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-3">{ins.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {ins.tags.map(t=><span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">{t}</span>)}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-400">{ins.date} · {ins.source}</div>
                {ins.verified&&<span className="text-xs text-emerald-600 font-bold">✓ Verified</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
