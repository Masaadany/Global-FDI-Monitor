'use client';
import { useState, useEffect } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const INSIGHTS = [
  {id:'INS-001',type:'MACRO_TREND',    icon:'📊',urgency:'HIGH',  region:'MENA', date:'Today',        ref:'GFM-INS-20260317-0001',verified:true,fic:null,
   title:'MENA FDI hits 5-year high at $88B',
   summary:'FDI inflows to MENA reached $88B in 2025, highest since 2020. UAE and Saudi Arabia account for 65% of flows. Energy transition and tech infrastructure are primary drivers. GFM projects $102B by 2027.',
   tags:['UAE','Saudi Arabia','Technology','Energy']},
  {id:'INS-002',type:'REGULATORY',     icon:'📜',urgency:'HIGH',  region:'SAS',  date:'2 days ago',   ref:'GFM-INS-20260315-0002',verified:true,fic:null,
   title:'India raises insurance FDI cap to 100%',
   summary:'India raises the FDI cap in insurance to 100% under the automatic route. GFM identifies 8–12 probable cross-border M&A targets in life and reinsurance. Key windows: 12–18 months.',
   tags:['India','Finance','Regulatory','M&A']},
  {id:'INS-003',type:'SECTOR_SIGNAL',  icon:'💡',urgency:'MEDIUM',region:'MENA', date:'3 days ago',   ref:'GFM-INS-20260314-0003',verified:true,fic:5,
   title:'Data centre FDI to MENA: $28B projected by 2028',
   summary:'GFM intelligence projects $28B in data centre FDI to MENA by 2028. UAE accounts for 62% of current capacity. Microsoft, AWS, Google all confirmed. Hyperscale construction window: 2026–2028.',
   tags:['UAE','Data Centres','ICT','Hyperscale']},
  {id:'INS-004',type:'GEOPOLITICAL',   icon:'🌐',urgency:'MEDIUM',region:'EAP',  date:'4 days ago',   ref:'GFM-INS-20260313-0004',verified:true,fic:null,
   title:'ASEAN supply chain reconfiguration accelerates',
   summary:'Vietnam, Indonesia and Malaysia receiving accelerating supply chain FDI. 42 new facility announcements in Q1 2026. China+1 strategies now accounting for 28% of regional FDI. Samsung and Toyota leading.',
   tags:['Vietnam','Indonesia','Malaysia','Manufacturing','Supply Chain']},
  {id:'INS-005',type:'COMMODITY_LINK', icon:'⛏️',urgency:'HIGH',  region:'GLOBAL',date:'5 days ago',  ref:'GFM-INS-20260312-0005',verified:true,fic:5,
   title:'Uranium +52% YoY unlocking $40B nuclear FDI pipeline',
   summary:'Uranium at $88/lb as nuclear renaissance gathers pace. Kazakhstan, Australia, Canada primary beneficiaries. 18 new nuclear plant approvals globally in 2025. GFM identifies 6 PLATINUM signals in pipeline.',
   tags:['Kazakhstan','Australia','Nuclear','Energy','Commodities']},
  {id:'INS-006',type:'GFR_UPDATE',     icon:'🏆',urgency:'MEDIUM',region:'MENA', date:'6 days ago',   ref:'GFM-INS-20260311-0006',verified:true,fic:null,
   title:'UAE records largest quarterly GFR gain in index history',
   summary:'UAE achieves +4.2 GFR points in Q1 2026 — largest single-quarter gain in 8-year index history. Digital Foundations (+6.1) and Sustainability (+5.8) lead. GFR: 80.0 (#3 globally).',
   tags:['UAE','GFR','Digital','Sustainability']},
  {id:'INS-007',type:'MACRO_TREND',    icon:'📈',urgency:'MEDIUM',region:'NAM',  date:'1 week ago',   ref:'GFM-INS-20260310-0007',verified:true,fic:null,
   title:'US reshoring drives $180B manufacturing FDI in 2025',
   summary:'IRA-driven manufacturing FDI totalled $180B in the US in 2025 — a record. EV battery, solar and semiconductor fabs account for 68% of flows. Texas, Ohio, Arizona top receiving states.',
   tags:['USA','Manufacturing','IRA','EV','Solar']},
  {id:'INS-008',type:'SECTOR_SIGNAL',  icon:'🌱',urgency:'HIGH',  region:'GLOBAL',date:'1 week ago',  ref:'GFM-INS-20260309-0008',verified:true,fic:5,
   title:'Green hydrogen: 12 new $1B+ projects in Q1 2026',
   summary:'Q1 2026 saw 12 new green hydrogen projects above $1B each. Combined capex $28B. Saudi Arabia (4), Australia (3), Chile (2) leading. IRENA projects $300B annual investment by 2030.',
   tags:['Green Hydrogen','Saudi Arabia','Australia','Chile','Renewable']},
  {id:'INS-009',type:'REGULATORY',     icon:'📋',urgency:'MEDIUM',region:'ECA',  date:'10 days ago',  ref:'GFM-INS-20260307-0009',verified:true,fic:null,
   title:'EU FDI Screening Regulation tightened for AI/data assets',
   summary:'European Commission tightens FDI screening for AI infrastructure, semiconductor fabs, and data centres. Deal timelines for non-EU acquirers extended from 25 to 45 days. Irish and Dutch authorities expanding review capacity.',
   tags:['EU','Regulatory','AI','Semiconductors','Screening']},
  {id:'INS-010',type:'GEOPOLITICAL',   icon:'🔗',urgency:'LOW',   region:'SSA',  date:'2 weeks ago',  ref:'GFM-INS-20260303-0010',verified:true,fic:null,
   title:'Africa Continental Free Trade Area: FDI implications for Q2 2026',
   summary:'AfCFTA implementation progress accelerating. Nigeria and South Africa removing 85% of tariffs on manufactured goods. GFM models $12B incremental FDI into Sub-Saharan Africa by end-2027 from improved corridor predictability.',
   tags:['AfCFTA','Nigeria','South Africa','Africa','Trade']},
  {id:'INS-011',type:'SECTOR_SIGNAL',  icon:'💊',urgency:'MEDIUM',region:'SAS',  date:'2 weeks ago',  ref:'GFM-INS-20260302-0011',verified:true,fic:5,
   title:'India pharma & biotech FDI: $8B in 2025, $14B projected 2026',
   summary:'India pharmaceutical FDI reached $8B in 2025, driven by post-COVID supply chain diversification and generics export opportunity. Hyderabad and Pune emerging as preferred manufacturing hubs for MNCs.',
   tags:['India','Pharmaceuticals','Biotech','Manufacturing']},
  {id:'INS-012',type:'MACRO_TREND',    icon:'💰',urgency:'LOW',   region:'ECA',  date:'3 weeks ago',  ref:'GFM-INS-20260224-0012',verified:true,fic:null,
   title:'CEE emerges as nearshoring destination: $22B FDI in Q4 2025',
   summary:'Central and Eastern Europe recorded $22B FDI inflows in Q4 2025, up 34% YoY. Poland, Czech Republic, and Hungary leading. ICT services and advanced manufacturing dominant sectors.',
   tags:['Poland','Czech Republic','Hungary','CEE','Nearshoring']},
];

const TYPE_LABELS: Record<string,string> = {
  MACRO_TREND:'Macro Trend',REGULATORY:'Regulatory',SECTOR_SIGNAL:'Sector Signal',
  GEOPOLITICAL:'Geopolitical',COMMODITY_LINK:'Commodity',GFR_UPDATE:'GFR Update',
};
const URGENCY_STYLES: Record<string,string> = {
  HIGH:  'bg-red-50   text-red-700   border-red-200',
  MEDIUM:'bg-amber-50 text-amber-700 border-amber-200',
  LOW:   'bg-blue-50  text-blue-700  border-blue-200',
};
const TYPE_COLORS: Record<string,string> = {
  MACRO_TREND:'text-blue-700 bg-blue-50 border-blue-200',
  REGULATORY:'text-purple-700 bg-purple-50 border-purple-200',
  SECTOR_SIGNAL:'text-emerald-700 bg-emerald-50 border-emerald-200',
  GEOPOLITICAL:'text-orange-700 bg-orange-50 border-orange-200',
  COMMODITY_LINK:'text-yellow-700 bg-yellow-50 border-yellow-200',
  GFR_UPDATE:'text-teal-700 bg-teal-50 border-teal-200',
};

export default function MarketInsightsPage() {
  const [type,     setType]     = useState('');
  const [region,   setRegion]   = useState('');
  const [urgency,  setUrgency]  = useState('');
  const [expanded, setExpanded] = useState<string|null>('INS-001');
  const [search,   setSearch]   = useState('');
  const { connected, totalSeen } = useRealTimeSignals(3);

  const shown = INSIGHTS.filter(i =>
    (!type    || i.type   === type) &&
    (!region  || i.region === region) &&
    (!urgency || i.urgency=== urgency) &&
    (!search  || i.title.toLowerCase().includes(search.toLowerCase()) ||
                 i.summary.toLowerCase().includes(search.toLowerCase()) ||
                 i.tags.some(t=>t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Market Insights</span>
        <div className="flex gap-1 flex-wrap ml-2">
          {[['','All'],['MACRO_TREND','Macro'],['REGULATORY','Policy'],['SECTOR_SIGNAL','Sector'],
            ['GEOPOLITICAL','Geo'],['COMMODITY_LINK','Commodities'],['GFR_UPDATE','GFR']].map(([v,l])=>(
            <button key={v} onClick={()=>setType(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${type===v?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <input placeholder="Search insights…" value={search} onChange={e=>setSearch(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs px-3 py-1.5 w-32 focus:outline-none focus:border-blue-400"/>
          <select value={region} onChange={e=>setRegion(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs px-2 py-1.5">
            <option value="">All Regions</option>
            {['MENA','EAP','SAS','ECA','LAC','SSA','NAM','GLOBAL'].map(r=><option key={r}>{r}</option>)}
          </select>
          <select value={urgency} onChange={e=>setUrgency(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs px-2 py-1.5">
            <option value="">All Priority</option>
            {['HIGH','MEDIUM','LOW'].map(u=><option key={u}>{u}</option>)}
          </select>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold ${connected?'text-emerald-600':'text-slate-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-300'}`}/>
          {connected ? `${totalSeen} live` : 'Offline'}
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-[#0A2540] text-white px-5 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 text-sm">
          {[['HIGH priority',INSIGHTS.filter(i=>i.urgency==='HIGH').length,'text-red-300'],
            ['This week',    INSIGHTS.filter(i=>i.date.includes('day')||i.date==='Today').length,'text-blue-300'],
            ['Free insights',INSIGHTS.filter(i=>!i.fic).length,'text-emerald-300'],
            ['Premium (FIC)',INSIGHTS.filter(i=>i.fic).length,'text-amber-300'],
          ].map(([l,v,c])=>(
            <div key={String(l)}>
              <span className={`font-black text-lg ${c}`}>{v}</span>
              <span className="text-blue-400 text-xs ml-1">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-5 space-y-2">
        {shown.map(i=>(
          <div key={i.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-sm transition-all">
            <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={()=>setExpanded(expanded===i.id?null:i.id)}>
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">{i.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${URGENCY_STYLES[i.urgency]}`}>{i.urgency}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${TYPE_COLORS[i.type]||'bg-slate-50 text-slate-600 border-slate-200'}`}>{TYPE_LABELS[i.type]}</span>
                  <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-bold">{i.region}</span>
                  {i.fic && <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded font-bold">⭐ {i.fic} FIC</span>}
                  <span className="text-xs text-slate-400 ml-auto">{i.date}</span>
                </div>
                <div className="font-black text-sm text-[#0A2540] mb-1">{i.title}</div>
                {expanded===i.id ? (
                  <div className="mt-2 space-y-3">
                    <p className="text-xs text-slate-500 leading-relaxed">{i.summary}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {i.tags.map(t=>(
                        <button key={t} onClick={e=>{e.stopPropagation();setSearch(t);}}
                          className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer">
                          #{t}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-xs font-mono text-slate-300">{i.ref}</span>
                      {i.verified && <span className="text-xs text-emerald-600 font-bold">✓ Verified</span>}
                      {i.fic && (
                        <button className="ml-auto text-xs bg-[#0A2540] text-white font-bold px-4 py-1.5 rounded-lg hover:bg-[#1D4ED8] transition-colors">
                          Full Intelligence — {i.fic} FIC
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{i.summary}</p>
                )}
              </div>
              <span className="text-slate-300 flex-shrink-0 mt-1 text-sm">{expanded===i.id?'▲':'▼'}</span>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-sm font-semibold">No insights match your filters</div>
            <button onClick={()=>{setType('');setRegion('');setUrgency('');setSearch('');}} className="text-xs text-blue-600 font-bold hover:underline mt-2 block mx-auto">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
