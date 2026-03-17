'use client';
import { useState } from 'react';

const PUBLICATIONS = [
  {id:'FNL-WK-2026-11-20260317-001', type:'WEEKLY',    title:'GFM Intelligence Digest — Week 11, 2026', date:'2026-03-17', pages:12, grade:'FREE',
   summary:'MENA FDI hits 5-year high. India insurance FDI liberalised. ASEAN supply chain acceleration. 12 new signals this week including 3 PLATINUM.',
   signals:12, highlights:['UAE GFR +4.2 points','India insurance 100% FDI cap','CATL Indonesia committed']},
  {id:'FPB-MON-2026-03-20260301-001', type:'MONTHLY',  title:'Global FDI Intelligence Report — March 2026', date:'2026-03-01', pages:68, grade:'PROFESSIONAL',
   summary:'Comprehensive monthly FDI intelligence covering 215 economies. Q1 2026 GFR update, 48 featured signals, sector deep-dives on ICT and Clean Energy.',
   signals:48, highlights:['Q1 2026 GFR Rankings','ICT sector deep-dive','MENA FDI outlook 2026']},
  {id:'FGR-Q1-2026-20260315-001',    type:'GFR',      title:'Global Future Readiness Rankings — Q1 2026', date:'2026-03-15', pages:48, grade:'PROFESSIONAL',
   summary:'Full Q1 2026 GFR rankings for 215 economies. 6-dimension scoring, tier assignments, and economy profiles for all FRONTIER and HIGH economies.',
   signals:0,  highlights:['UAE record +4.2pt gain','Singapore retains #1','New FRONTIER: NOR, DNK']},
  {id:'FNL-WK-2026-10-20260310-001', type:'WEEKLY',   title:'GFM Intelligence Digest — Week 10, 2026', date:'2026-03-10', pages:11, grade:'FREE',
   summary:'Saudi Arabia Vision 2030 FDI update. Korea-Vietnam bilateral reaches $28B cumulative. Nigeria tech hub signals emerging.',
   signals:9, highlights:['CATL Indonesia $3.2B','Databricks Singapore HQ','Nigeria tech FDI']},
  {id:'FPB-MON-2026-02-20260201-001', type:'MONTHLY', title:'Global FDI Intelligence Report — February 2026', date:'2026-02-01', pages:64, grade:'PROFESSIONAL',
   summary:'Year-end 2025 FDI recap. Top 20 destinations by inflows. Clean energy FDI supercycle analysis. Emerging corridor report.',
   signals:42, highlights:['2025 FDI year-end review','Clean energy supercycle','Top 20 destinations']},
];

const TYPE_STYLES: Record<string,{bg:string,text:string}> = {
  WEEKLY:      {bg:'bg-blue-100',  text:'text-blue-700'},
  MONTHLY:     {bg:'bg-emerald-100',text:'text-emerald-700'},
  GFR:         {bg:'bg-amber-100', text:'text-amber-700'},
  QUARTERLY:   {bg:'bg-violet-100',text:'text-violet-700'},
};

export default function PublicationsPage() {
  const [filter, setFilter] = useState('');
  const shown = PUBLICATIONS.filter(p => !filter || p.type===filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Publications</h1>
          <p className="text-blue-200 text-sm">Weekly digests, monthly intelligence reports, and quarterly GFR publications.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-5">
        <div className="flex gap-2 mb-5">
          {[['','All'],['WEEKLY','Weekly'],['MONTHLY','Monthly'],['GFR','GFR Reports']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter===v?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>{l}</button>
          ))}
        </div>

        <div className="space-y-4">
          {shown.map(pub=>{
            const ts = TYPE_STYLES[pub.type] || TYPE_STYLES.MONTHLY;
            const isFree = pub.grade === 'FREE';
            return (
              <div key={pub.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${ts.bg} ${ts.text}`}>{pub.type}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${isFree?'bg-emerald-100 text-emerald-700':'bg-violet-100 text-violet-700'}`}>
                        {pub.grade}
                      </span>
                      <span className="text-xs text-slate-400">{pub.date}</span>
                      <span className="text-xs text-slate-400">{pub.pages} pages</span>
                    </div>
                    <h3 className="font-black text-[#0A2540] mb-1.5">{pub.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3">{pub.summary}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {pub.highlights.map(h=>(
                        <span key={h} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">{h}</span>
                      ))}
                    </div>
                    <div className="text-xs font-mono text-slate-300">{pub.id}</div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {isFree ? (
                      <button className="bg-[#0A2540] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                        Download PDF
                      </button>
                    ) : (
                      <button className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-500 transition-colors">
                        Download — 5 FIC
                      </button>
                    )}
                    <button className="border border-slate-200 text-slate-500 text-xs font-bold px-5 py-2 rounded-xl hover:border-blue-300 transition-colors">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
