'use client';
import { useState } from 'react';
import { exportJSON } from '@/lib/export';

const PUBLICATIONS = [
  {id:'FNL-WK-2026-11-20260317-001', type:'WEEKLY',  grade:'FREE',        date:'2026-03-17', pages:12, signals:12, dl_size:'1.2MB',
   title:'GFM Intelligence Digest — Week 11, 2026',
   summary:'MENA FDI hits 5-year high. India insurance liberalised. ASEAN supply chain acceleration. 12 new signals including 3 PLATINUM.',
   highlights:['UAE GFR +4.2pts — largest gain ever','India insurance 100% FDI','CATL Indonesia $3.2B committed','Green hydrogen: 12 new $1B+ projects']},
  {id:'FPB-MON-2026-03-20260301-001', type:'MONTHLY', grade:'PROFESSIONAL', date:'2026-03-01', pages:68, signals:48, dl_size:'4.8MB',
   title:'Global FDI Intelligence Report — March 2026',
   summary:'Comprehensive monthly FDI intelligence. Q1 2026 GFR update, 48 featured signals, ICT and Clean Energy deep-dives.',
   highlights:['Q1 2026 GFR Rankings full update','ICT sector deep-dive: $1.84T global','MENA FDI outlook 2026–2028','Top 50 PLATINUM signals of the month']},
  {id:'FGR-Q1-2026-20260315-001',    type:'GFR',     grade:'PROFESSIONAL', date:'2026-03-15', pages:48, signals:0,  dl_size:'3.2MB',
   title:'Global Future Readiness Rankings — Q1 2026',
   summary:'Full Q1 2026 GFR rankings: 215 economies, 6 dimensions, tier assignments, FRONTIER profiles.',
   highlights:['UAE record +4.2pt quarterly gain','Singapore retains #1 (88.5)','New FRONTIER: NOR, DNK, FIN','Complete 215-economy dataset']},
  {id:'FNL-WK-2026-10-20260310-001', type:'WEEKLY',  grade:'FREE',         date:'2026-03-10', pages:11, signals:9,  dl_size:'1.1MB',
   title:'GFM Intelligence Digest — Week 10, 2026',
   summary:'Korea-Vietnam corridor reaches $28B cumulative. Saudi Vision 2030 FDI update. Nigeria tech hub signals emerging.',
   highlights:['CATL Indonesia $3.2B','Databricks Singapore HQ','Nigeria tech FDI emerging','K-VN corridor milestone']},
  {id:'FPB-MON-2026-02-20260201-001', type:'MONTHLY', grade:'PROFESSIONAL', date:'2026-02-01', pages:64, signals:42, dl_size:'4.5MB',
   title:'Global FDI Intelligence Report — February 2026',
   summary:'2025 FDI year-end recap. Top 20 destinations. Clean energy FDI supercycle. Emerging corridor report.',
   highlights:['2025 FDI $1.8T record','Clean energy supercycle analysis','Top 20 destination profiles','AfCFTA corridor intelligence']},
  {id:'FNL-WK-2026-09-20260303-001', type:'WEEKLY',  grade:'FREE',         date:'2026-03-03', pages:10, signals:8,  dl_size:'1.0MB',
   title:'GFM Intelligence Digest — Week 9, 2026',
   summary:'EU FDI screening tightened for AI assets. African Continental Free Trade Area implications. CEE nearshoring surge.',
   highlights:['EU AI asset screening extended','AfCFTA FDI implications','CEE nearshoring: $22B Q4 2025','India pharma $8B record']},
  {id:'FPB-QTR-2025-Q4-20260115-001',type:'QUARTERLY',grade:'PROFESSIONAL', date:'2026-01-15', pages:88, signals:120,dl_size:'6.1MB',
   title:'Q4 2025 Global FDI Intelligence Quarterly',
   summary:'Comprehensive Q4 2025 analysis: 120 featured signals, GFR retrospective, sector performance, 2026 outlook.',
   highlights:['Q4 2025 full signal archive','2026 FDI outlook: $1.9T projected','Sector performance league table','10 economies to watch in 2026']},
];

const TYPE_STYLES: Record<string,{bg:string,text:string,icon:string}> = {
  WEEKLY:   {bg:'bg-blue-100',  text:'text-blue-700',  icon:'📰'},
  MONTHLY:  {bg:'bg-emerald-100',text:'text-emerald-700',icon:'📋'},
  GFR:      {bg:'bg-amber-100', text:'text-amber-700', icon:'🏆'},
  QUARTERLY:{bg:'bg-violet-100',text:'text-violet-700',icon:'📊'},
};

export default function PublicationsPage() {
  const [filter,    setFilter]    = useState('');
  const [downloading,setDownloading]=useState<string|null>(null);

  const shown = PUBLICATIONS.filter(p => !filter || p.type === filter);

  async function handleDownload(pub: typeof PUBLICATIONS[0]) {
    setDownloading(pub.id);
    // Simulate download preparation
    await new Promise(r => setTimeout(r, 1200));
    if (pub.grade === 'FREE') {
      // Provide a JSON data export as demo
      exportJSON({
        reference: pub.id,
        title: pub.title,
        date: pub.date,
        summary: pub.summary,
        highlights: pub.highlights,
        signals_count: pub.signals,
        platform: 'Global FDI Monitor',
        url: 'https://fdimonitor.org',
      }, pub.id);
    }
    setDownloading(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Publications & Reports</h1>
          <p className="text-blue-200 text-sm">Weekly digests, monthly intelligence reports, quarterly GFR publications, and special editions.</p>
          <div className="flex gap-6 mt-4">
            {[['FREE',PUBLICATIONS.filter(p=>p.grade==='FREE').length,'text-emerald-400'],
              ['PROFESSIONAL',PUBLICATIONS.filter(p=>p.grade==='PROFESSIONAL').length,'text-amber-400'],
              ['Total pages',PUBLICATIONS.reduce((s,p)=>s+p.pages,0),'text-blue-400'],
            ].map(([l,v,c])=>(
              <div key={String(l)}>
                <span className={`font-black text-xl ${c}`}>{v}</span>
                <span className="text-blue-400 text-xs ml-1">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-5">
        {/* Filter */}
        <div className="flex gap-2 mb-5">
          {[['','All Types'],['WEEKLY','Weekly'],['MONTHLY','Monthly'],['GFR','GFR Reports'],['QUARTERLY','Quarterly']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter===v?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200 hover:border-blue-300'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {shown.map(pub=>{
            const ts = TYPE_STYLES[pub.type] || TYPE_STYLES.MONTHLY;
            const isFree = pub.grade === 'FREE';
            const isDl   = downloading === pub.id;
            return (
              <div key={pub.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">{ts.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${ts.bg} ${ts.text}`}>{pub.type}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${isFree?'bg-emerald-100 text-emerald-700':'bg-violet-100 text-violet-700'}`}>
                        {isFree ? 'FREE' : 'PROFESSIONAL'}
                      </span>
                      <span className="text-xs text-slate-400">{pub.date}</span>
                      <span className="text-xs text-slate-400">{pub.pages} pages</span>
                      {pub.signals > 0 && <span className="text-xs text-slate-400">{pub.signals} signals</span>}
                      <span className="text-xs text-slate-300">{pub.dl_size}</span>
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
                  <div className="flex flex-col gap-2 flex-shrink-0 min-w-32">
                    <button onClick={()=>handleDownload(pub)} disabled={isDl}
                      className={`text-xs font-black px-4 py-2.5 rounded-xl transition-colors ${
                        isDl ? 'bg-slate-300 text-slate-500 cursor-not-allowed' :
                        isFree ? 'bg-[#0A2540] text-white hover:bg-[#1D4ED8]' :
                        'bg-blue-600 text-white hover:bg-blue-500'
                      }`}>
                      {isDl ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                          Preparing…
                        </span>
                      ) : isFree ? '↓ Download PDF' : `↓ Download — 5 FIC`}
                    </button>
                    <button className="text-xs font-semibold border border-slate-200 text-slate-500 px-4 py-2 rounded-xl hover:border-blue-300 transition-colors">
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
