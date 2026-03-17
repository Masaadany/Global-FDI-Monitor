'use client';
import { useState } from 'react';

const INSIGHTS = [
  {id:'1',type:'MACRO_TREND',icon:'📊',title:'MENA FDI hits 5-year high at $88B',region:'MENA',urgency:'HIGH',summary:'FDI inflows to MENA reached $88B in 2025, highest since 2020. UAE and Saudi Arabia account for 65% of regional flows. Energy transition and tech infrastructure are primary drivers.',date:'Today'},
  {id:'2',type:'REGULATORY',icon:'📜',title:'India raises insurance FDI cap to 100%',region:'SAS',urgency:'HIGH',summary:'India raises FDI cap in insurance to 100% under automatic route. Senior advisors expect 8-12 major cross-border M&A deals within 18 months. Key targets identified in life insurance.',date:'2 days ago'},
  {id:'3',type:'SECTOR_SIGNAL',icon:'💡',title:'Data centre FDI to MENA: $28B by 2028',region:'MENA',urgency:'MEDIUM',summary:'GFM intelligence projects $28B in data centre FDI to MENA by 2028, up from $4.2B in 2025. UAE accounts for 62% of current capacity and 55% of announced pipeline.',date:'3 days ago'},
  {id:'4',type:'GEOPOLITICAL',icon:'🌐',title:'ASEAN supply chain reconfiguration accelerates',region:'EAP',urgency:'MEDIUM',summary:'Vietnam, Indonesia and Malaysia receiving accelerating supply chain investment as manufacturers execute China+1 strategies. 42 new facility announcements in Q1 2026.',date:'4 days ago'},
  {id:'5',type:'COMMODITY_LINK',icon:'⛏',title:'Uranium price surge (+52% YoY) unlocking $40B nuclear FDI',region:'GLOBAL',urgency:'HIGH',summary:'Uranium at $88/lb as nuclear renaissance gathers pace. Kazakhstan, Australia and Canada primary beneficiaries. 18 new nuclear power plant approvals globally in 2025.',date:'5 days ago'},
  {id:'6',type:'GFR_UPDATE',icon:'🏆',title:'UAE records largest quarterly GFR gain in index history',region:'MENA',urgency:'MEDIUM',summary:'UAE achieves +4.2 point GFR improvement in Q1 2026, largest gain in 8-year index history. Digital Foundations and Sustainability dimensions drive the improvement.',date:'6 days ago'},
];

const URGENCY: Record<string,string> = {
  HIGH:'bg-red-50 text-red-700 border-red-200',
  MEDIUM:'bg-amber-50 text-amber-700 border-amber-200',
  LOW:'bg-blue-50 text-blue-700 border-blue-200',
};

export default function MarketInsightsPage() {
  const [type,   setType]   = useState('');
  const [region, setRegion] = useState('');
  const shown = INSIGHTS.filter(i=>(!type||i.type===type)&&(!region||i.region===region));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Market Insights</span>
        <div className="flex gap-1 ml-4 flex-wrap">
          {[['','All'],['MACRO_TREND','Macro'],['REGULATORY','Regulatory'],['SECTOR_SIGNAL','Sector'],['GEOPOLITICAL','Geo'],['COMMODITY_LINK','Commodities'],['GFR_UPDATE','GFR']].map(([v,l])=>(
            <button key={v} onClick={()=>setType(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${type===v?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-500'}`}>{l}</button>
          ))}
        </div>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2 ml-2"
          value={region} onChange={e=>setRegion(e.target.value)}>
          <option value="">All Regions</option>
          {['MENA','EAP','SAS','ECA','LAC','SSA','NAM','GLOBAL'].map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="max-w-4xl mx-auto p-5 space-y-3">
        {shown.map(i=>(
          <div key={i.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">{i.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${URGENCY[i.urgency]}`}>{i.urgency}</span>
                  <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-bold">{i.region}</span>
                  <span className="text-xs text-slate-400 ml-auto">{i.date}</span>
                </div>
                <div className="font-black text-sm text-[#0A2540] mb-2">{i.title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{i.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
