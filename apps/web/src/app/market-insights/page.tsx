'use client';
import { useState, useEffect } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const STATIC_INSIGHTS = [
  {id:'1', type:'MACRO_TREND',    icon:'📊',urgency:'HIGH',  region:'MENA',  date:'Today',
   title:'MENA FDI hits 5-year high at $88B',
   summary:'FDI inflows to MENA reached $88B in 2025, the highest since 2020. UAE and Saudi Arabia account for 65% of regional flows. Energy transition and tech infrastructure are primary drivers. GFM signals suggest continued acceleration into Q2 2026.',
   ref:'GFM-INS-20260317-0001', verified:true, fic_cost:null},
  {id:'2', type:'REGULATORY',     icon:'📜',urgency:'HIGH',  region:'SAS',   date:'2 days ago',
   title:'India raises insurance FDI cap to 100%',
   summary:'India raises FDI limit in insurance to 100% under the automatic route. Senior advisors expect 8–12 major cross-border M&A deals within 18 months. Key targets identified in life insurance and reinsurance segments.',
   ref:'GFM-INS-20260315-0002', verified:true, fic_cost:null},
  {id:'3', type:'SECTOR_SIGNAL',  icon:'💡',urgency:'MEDIUM',region:'MENA',  date:'3 days ago',
   title:'Data centre FDI to MENA: $28B projected by 2028',
   summary:'GFM intelligence projects $28B in data centre FDI to MENA by 2028, up from $4.2B in 2025. UAE accounts for 62% of current capacity. Microsoft, AWS, and Google all have active hyperscale projects.',
   ref:'GFM-INS-20260314-0003', verified:true, fic_cost:null},
  {id:'4', type:'GEOPOLITICAL',   icon:'🌐',urgency:'MEDIUM',region:'EAP',   date:'4 days ago',
   title:'ASEAN supply chain reconfiguration accelerates',
   summary:'Vietnam, Indonesia and Malaysia receiving accelerating supply chain FDI as manufacturers execute China+1 strategies. 42 new facility announcements in Q1 2026. ISIC C dominant, ISIC J emerging.',
   ref:'GFM-INS-20260313-0004', verified:true, fic_cost:null},
  {id:'5', type:'COMMODITY_LINK', icon:'⛏️',urgency:'HIGH',  region:'GLOBAL',date:'5 days ago',
   title:'Uranium price surge (+52% YoY) unlocking $40B nuclear FDI',
   summary:'Uranium at $88/lb as nuclear renaissance gathers pace. Kazakhstan, Australia and Canada primary beneficiaries. 18 new nuclear power plant approvals globally in 2025. GFM assigns PLATINUM grade to 6 related signals.',
   ref:'GFM-INS-20260312-0005', verified:true, fic_cost:null},
  {id:'6', type:'GFR_UPDATE',     icon:'🏆',urgency:'MEDIUM',region:'MENA',  date:'6 days ago',
   title:'UAE records largest quarterly GFR gain in index history',
   summary:'UAE achieves +4.2 point GFR improvement in Q1 2026, the largest single-quarter gain in 8-year index history. Digital Foundations (+6.1) and Sustainability (+5.8) dimensions drive improvement.',
   ref:'GFM-INS-20260311-0006', verified:true, fic_cost:null},
  {id:'7', type:'MACRO_TREND',    icon:'📈',urgency:'MEDIUM',region:'NAM',   date:'1 week ago',
   title:'US reshoring adds $180B manufacturing FDI in 2025',
   summary:'IRA-driven manufacturing FDI totalled $180B in the United States in 2025 — a record. EV battery, solar and semiconductor fabs account for 68%. Texas, Ohio and Arizona top receiving states.',
   ref:'GFM-INS-20260310-0007', verified:true, fic_cost:null},
  {id:'8', type:'SECTOR_SIGNAL',  icon:'🌱',urgency:'HIGH',  region:'GLOBAL',date:'1 week ago',
   title:'Green hydrogen: 12 new $1B+ projects announced in Q1 2026',
   summary:'Q1 2026 saw 12 new green hydrogen projects exceeding $1B each. Combined capex of $28B. Saudi Arabia (4), Australia (3), Chile (2) leading. IRENA projects $300B annual investment by 2030.',
   ref:'GFM-INS-20260309-0008', verified:true, fic_cost:null},
];

const TYPE_ICONS: Record<string,string>  = {MACRO_TREND:'📊',REGULATORY:'📜',SECTOR_SIGNAL:'💡',GEOPOLITICAL:'🌐',COMMODITY_LINK:'⛏️',GFR_UPDATE:'🏆'};
const URGENCY_STYLES: Record<string,string> = {
  HIGH:  'bg-red-50 text-red-700 border-red-200',
  MEDIUM:'bg-amber-50 text-amber-700 border-amber-200',
  LOW:   'bg-blue-50 text-blue-700 border-blue-200',
};

export default function MarketInsightsPage() {
  const [type,   setType]   = useState('');
  const [region, setRegion] = useState('');
  const [expanded, setExpanded] = useState<string|null>('1');
  const { connected, totalSeen } = useRealTimeSignals(5);

  const shown = STATIC_INSIGHTS.filter(i =>
    (!type   || i.type   === type) &&
    (!region || i.region === region)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Market Insights</span>
        <div className="flex gap-1 flex-wrap ml-2">
          {[['','All'],['MACRO_TREND','Macro'],['REGULATORY','Policy'],['SECTOR_SIGNAL','Sector'],['GEOPOLITICAL','Geo'],['COMMODITY_LINK','Commodities'],['GFR_UPDATE','GFR']].map(([v,l])=>(
            <button key={v} onClick={()=>setType(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${type===v?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-500'}`}>{l}</button>
          ))}
        </div>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2 ml-2"
          value={region} onChange={e=>setRegion(e.target.value)}>
          <option value="">All Regions</option>
          {['MENA','EAP','SAS','ECA','LAC','SSA','NAM','GLOBAL'].map(r=><option key={r}>{r}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-300'}`}/>
          <span className={`text-xs font-bold ${connected?'text-emerald-600':'text-slate-400'}`}>
            {connected ? `${totalSeen} live signals` : 'Connecting…'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-5 space-y-3">
        {shown.map(i=>(
          <div key={i.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-sm transition-all">
            <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={()=>setExpanded(expanded===i.id?null:i.id)}>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">{i.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${URGENCY_STYLES[i.urgency]}`}>{i.urgency}</span>
                  <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-bold">{i.region}</span>
                  <span className="text-xs text-slate-400 ml-auto">{i.date}</span>
                </div>
                <div className="font-black text-sm text-[#0A2540]">{i.title}</div>
                {expanded===i.id && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-slate-500 leading-relaxed">{i.summary}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-300">{i.ref}</span>
                      {i.verified && <span className="text-xs text-emerald-600 font-bold">✓ Verified</span>}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-slate-300 flex-shrink-0">{expanded===i.id?'▲':'▼'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
