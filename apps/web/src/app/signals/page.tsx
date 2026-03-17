'use client';
import { useState } from 'react';

const SIGNALS = [
  {id:'MSS-GFS-ARE-20260317-0001',grade:'PLATINUM',company:'Microsoft Corp',hq:'USA',economy:'UAE',sector:'J - Technology',capex:'$850M',sci:91.2,type:'Greenfield',status:'CONFIRMED',date:'Today 09:14',desc:'Data centre campus confirmed in Dubai Silicon Oasis. 850MW capacity. 2,000 construction jobs.'},
  {id:'MSS-CES-SAU-20260317-0002',grade:'GOLD',company:'Amazon Web Services',hq:'USA',economy:'Saudi Arabia',sector:'J - Technology',capex:'$5.3B',sci:88.4,type:'Expansion',status:'ANNOUNCED',date:'Today 08:51',desc:'AWS Middle East expansion — three new Availability Zones in Riyadh by 2027.'},
  {id:'MSS-GFS-EGY-20260317-0003',grade:'PLATINUM',company:'Siemens Energy',hq:'DEU',economy:'Egypt',sector:'D - Energy',capex:'$340M',sci:86.1,type:'JV',status:'CONFIRMED',date:'Today 08:22',desc:'Joint venture with EEHC for 500MW offshore wind farm in Gulf of Suez.'},
  {id:'MSS-CES-VNM-20260317-0004',grade:'GOLD',company:'Samsung Electronics',hq:'KOR',economy:'Vietnam',sector:'C - Manufacturing',capex:'$2.8B',sci:83.7,type:'Expansion',status:'CONFIRMED',date:'Today 07:45',desc:'Expansion of semiconductor packaging facility in Thai Nguyen province.'},
  {id:'MSS-GFS-ARE-20260317-0005',grade:'SILVER',company:'BlackRock Inc',hq:'USA',economy:'UAE',sector:'K - Finance',capex:'$500M',sci:74.2,type:'Platform',status:'RUMOURED',date:'Yesterday',desc:'Infrastructure fund exploring direct investment platform in Abu Dhabi Global Market.'},
  {id:'MSS-GFS-IND-20260317-0006',grade:'PLATINUM',company:'Vestas Wind',hq:'DNK',economy:'India',sector:'D - Energy',capex:'$420M',sci:85.9,type:'Greenfield',status:'ANNOUNCED',date:'Yesterday',desc:'Wind turbine manufacturing plant in Rajasthan targeting 2GW annual capacity.'},
  {id:'MSS-MAI-SAU-20260317-0007',grade:'GOLD',company:'Microsoft Corp',hq:'USA',economy:'Saudi Arabia',sector:'J - Technology',capex:'$1.5B',sci:82.1,type:'M&A',status:'COMPLETED',date:'2 days ago',desc:'Strategic stake in G42 Cloud for Middle East cloud infrastructure JV.'},
  {id:'MSS-GFS-SGP-20260317-0008',grade:'GOLD',company:'Databricks',hq:'USA',economy:'Singapore',sector:'J - Technology',capex:'$150M',sci:79.3,type:'Platform',status:'ANNOUNCED',date:'2 days ago',desc:'Asia Pacific AI/ML platform expansion. Regional HQ in Singapore.'},
];

const GRADE_STYLES: Record<string,{bg:string,text:string,border:string}> = {
  PLATINUM:{bg:'bg-amber-50',  text:'text-amber-700',  border:'border-amber-300'},
  GOLD:    {bg:'bg-emerald-50',text:'text-emerald-700',border:'border-emerald-300'},
  SILVER:  {bg:'bg-blue-50',   text:'text-blue-700',   border:'border-blue-300'},
  BRONZE:  {bg:'bg-slate-50',  text:'text-slate-500',  border:'border-slate-300'},
};

const STATUS_STYLES: Record<string,string> = {
  CONFIRMED:'bg-emerald-100 text-emerald-700',
  ANNOUNCED:'bg-blue-100 text-blue-700',
  RUMOURED: 'bg-amber-100 text-amber-700',
  COMPLETED:'bg-violet-100 text-violet-700',
};

export default function SignalsPage() {
  const [grade,    setGrade]    = useState('');
  const [sector,   setSector]   = useState('');
  const [selected, setSelected] = useState(SIGNALS[0]);
  const [search,   setSearch]   = useState('');

  const filtered = SIGNALS.filter(s =>
    (!grade  || s.grade === grade) &&
    (!sector || s.sector.startsWith(sector)) &&
    (!search || s.company.toLowerCase().includes(search.toLowerCase()) ||
                s.economy.toLowerCase().includes(search.toLowerCase()))
  );

  const gs = GRADE_STYLES[selected.grade];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Signal Monitor</span>
        <div className="flex items-center gap-1.5 ml-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
          <span className="text-xs font-bold text-emerald-600">218 LIVE</span>
        </div>
        <input placeholder="Search company or economy…" value={search} onChange={e=>setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-48 focus:outline-none focus:border-blue-400 ml-2"/>
        <div className="flex gap-1">
          {['','PLATINUM','GOLD','SILVER','BRONZE'].map(g => (
            <button key={g} onClick={() => setGrade(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                grade===g ? 'bg-[#0A2540] text-white' : 'text-slate-400 hover:text-slate-600 border border-slate-200'
              }`}>{g || 'All'}</button>
          ))}
        </div>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2 ml-auto"
          value={sector} onChange={e=>setSector(e.target.value)}>
          <option value="">All Sectors</option>
          {['J','K','C','D','F','H','L','Q'].map(s=><option key={s} value={s}>ISIC {s}</option>)}
        </select>
      </div>

      <div className="flex gap-0 h-[calc(100vh-8.5rem)]">
        {/* Signal list */}
        <div className="w-96 flex-shrink-0 overflow-y-auto border-r border-slate-100 bg-white">
          {filtered.map(s => {
            const style = GRADE_STYLES[s.grade];
            return (
              <div key={s.id} onClick={() => setSelected(s)}
                className={`px-4 py-3.5 border-b border-slate-50 cursor-pointer transition-all ${
                  selected.id===s.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-slate-50'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-black px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}>
                    {s.grade}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                  <span className="text-xs text-slate-400 ml-auto">{s.date}</span>
                </div>
                <div className="font-bold text-sm text-[#0A2540] mb-0.5">{s.company}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{s.economy} · {s.type}</span>
                  <span className="text-xs font-black text-blue-600">{s.capex}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <div className="text-3xl mb-2">📡</div>
              <div className="text-sm">No signals match your filters</div>
            </div>
          )}
        </div>

        {/* Signal detail */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className={`inline-flex text-xs font-black px-3 py-1 rounded-full border mb-3 ${gs.bg} ${gs.text} ${gs.border}`}>
                  {selected.grade} SIGNAL · SCI {selected.sci}
                </div>
                <h1 className="text-2xl font-black text-[#0A2540]">{selected.company}</h1>
                <div className="text-slate-400 text-sm mt-1 font-mono">{selected.id}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-600">{selected.capex}</div>
                <div className="text-xs text-slate-400 mt-1">Estimated CapEx</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {l:'Economy',   v:selected.economy},
                {l:'Sector',    v:selected.sector},
                {l:'HQ',        v:selected.hq},
                {l:'Type',      v:selected.type},
                {l:'Status',    v:selected.status},
                {l:'Date',      v:selected.date},
              ].map(f => (
                <div key={f.l} className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-0.5">{f.l}</div>
                  <div className="text-sm font-bold text-[#0A2540]">{f.v}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
              <div className="font-bold text-sm text-[#0A2540] mb-2">Signal Intelligence</div>
              <p className="text-slate-600 text-sm leading-relaxed">{selected.desc}</p>
            </div>

            {selected.grade === 'PLATINUM' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-bold text-amber-700 text-sm">Platinum Signal — 1 FIC to unlock full report</div>
                  <p className="text-amber-600 text-xs mt-1">Full company intelligence, contact details, IPA engagement playbook, and mission planning integration.</p>
                  <button className="mt-2 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors">
                    Unlock Full Report — 1 FIC
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
