'use client';
import { useState } from 'react';
import { exportJSON } from '@/lib/export';


const PUBS = [
  {id:'FNL-WK-2026-11-20260317-001',type:'WEEKLY', grade:'FREE',        date:'2026-03-17',pages:12,signals:12,color:'#0A66C2',
   title:'GFM Intelligence Digest — Week 11, 2026',
   summary:'MENA FDI hits 5-year high. India insurance liberalised. ASEAN supply chain acceleration.',
   highlights:['UAE GFR +4.2pts record gain','India insurance 100% FDI','CATL Indonesia $3.2B','Green hydrogen: 12 new $1B+ projects']},
  {id:'FPB-MON-2026-03-20260301-001',type:'MONTHLY',grade:'PROFESSIONAL',date:'2026-03-01',pages:68,signals:48,color:'#0A2540',
   title:'Global FDI Intelligence Report — March 2026',
   summary:'Comprehensive monthly FDI intelligence. Q1 2026 GFR update, 48 featured signals.',
   highlights:['Q1 2026 GFR full update','ICT sector: $1.84T global','MENA FDI outlook 2026–2028','Top 50 PLATINUM signals']},
  {id:'FGR-Q1-2026-20260315-001',   type:'GFR',    grade:'PROFESSIONAL',date:'2026-03-15',pages:48,signals:0, color:'#7C3AED',
   title:'Global Future Readiness Rankings — Q1 2026',
   summary:'Full Q1 2026 GFR rankings: 215 economies, 6 dimensions, tier assignments.',
   highlights:['UAE record +4.2pt gain','Singapore retains #1 (88.5)','New FRONTIER entrants','All 215 economy profiles']},
  {id:'FNL-WK-2026-10-20260310-001',type:'WEEKLY', grade:'FREE',        date:'2026-03-10',pages:11,signals:9, color:'#0A66C2',
   title:'GFM Intelligence Digest — Week 10, 2026',
   summary:'Korea-Vietnam corridor $28B. Saudi Vision 2030 update. Nigeria tech hub emerging.',
   highlights:['CATL Indonesia confirmed','Databricks Singapore HQ','Nigeria tech FDI','K-VN corridor milestone']},
  {id:'FPB-MON-2026-02-20260201-001',type:'MONTHLY',grade:'PROFESSIONAL',date:'2026-02-01',pages:64,signals:42,color:'#0A2540',
   title:'Global FDI Intelligence Report — February 2026',
   summary:'2025 FDI year-end recap. Top 20 destinations. Clean energy supercycle analysis.',
   highlights:['2025 FDI $1.8T record','Clean energy supercycle','Top 20 destinations','AfCFTA corridors']},
  {id:'FNL-WK-2026-09-20260303-001',type:'WEEKLY', grade:'FREE',        date:'2026-03-03',pages:10,signals:8, color:'#0A66C2',
   title:'GFM Intelligence Digest — Week 9, 2026',
   summary:'EU FDI screening tightened for AI assets. AfCFTA implications. CEE nearshoring surge.',
   highlights:['EU AI screening extended','AfCFTA FDI implications','CEE nearshoring $22B','India pharma $8B record']},
  {id:'FPB-QTR-2025-Q4-20260115-001',type:'QUARTERLY',grade:'PROFESSIONAL',date:'2026-01-15',pages:88,signals:120,color:'#059669',
   title:'Q4 2025 Global FDI Intelligence Quarterly',
   summary:'Q4 2025 comprehensive analysis: 120 featured signals, GFR retrospective, 2026 outlook.',
   highlights:['Q4 2025 full archive','2026 FDI: $1.9T projected','Sector performance table','10 economies to watch']},
  {id:'FPB-SPE-2025-EV-20251201-001',type:'SPECIAL', grade:'PROFESSIONAL',date:'2025-12-01',pages:52,signals:28,color:'#D97706',
   title:'EV Supply Chain Intelligence Report — 2025',
   summary:'Comprehensive EV supply chain FDI: battery, charging, manufacturing across 40 countries.',
   highlights:['Battery gigafactory map','Charging infrastructure FDI','Lithium-cobalt supply chains','Policy landscape 2026']},
];

const TYPE_CONFIG: Record<string,{bg:string;text:string}> = {
  WEEKLY:   {bg:'bg-blue-100',   text:'text-blue-700'},
  MONTHLY:  {bg:'bg-slate-800',  text:'text-white'},
  GFR:      {bg:'bg-violet-100', text:'text-violet-700'},
  QUARTERLY:{bg:'bg-emerald-100',text:'text-emerald-700'},
  SPECIAL:  {bg:'bg-amber-100',  text:'text-amber-700'},
};

export default function PublicationsPage() {
  const [filter, setFilter] = useState('');
  const [dlg,    setDlg]    = useState<string|null>(null);
  const shown = PUBS.filter(p => !filter || p.type === filter);

  async function dl(pub: typeof PUBS[0]) {
    setDlg(pub.id);
    await new Promise(r=>setTimeout(r,1000));
    if (pub.grade==='FREE') exportJSON({reference:pub.id,title:pub.title,date:pub.date,summary:pub.summary,highlights:pub.highlights},'GFM_'+pub.id);
    else window.location.href='/subscription';
    setDlg(null);
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="gfm-hero text-white px-6 py-12">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Publications Library</div>
          <h1 className="text-4xl font-extrabold mb-2">Intelligence Publications</h1>
          <p className="text-white/70">Weekly digests, monthly intelligence reports, quarterly GFR publications, and special editions.</p>
          <div className="flex gap-4 mt-5">
            {[['FREE',PUBS.filter(p=>p.grade==='FREE').length,'text-emerald-300'],['PROFESSIONAL',PUBS.filter(p=>p.grade==='PROFESSIONAL').length,'text-amber-300'],['Total pages',PUBS.reduce((s,p)=>s+p.pages,0),'text-blue-300']].map(([l,v,c])=>(
              <div key={String(l)}><span className={`stat-number text-xl font-bold ${c}`}>{v}</span><span className="text-white/50 text-xs ml-1.5">{l}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-7 flex-wrap">
          {[['','All Types'],['WEEKLY','Weekly'],['MONTHLY','Monthly'],['GFR','GFR Reports'],['QUARTERLY','Quarterly'],['SPECIAL','Special']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter===v?'text-white':'text-slate-500 bg-white border border-slate-200 hover:border-primary'}`}
              style={filter===v?{background:'var(--primary)'}:{}}>
              {l}
            </button>
          ))}
        </div>

        {/* Recent publications label */}
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Recent Publications</div>

        {/* Cover grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {shown.map(pub => {
            const tc  = TYPE_CONFIG[pub.type] || TYPE_CONFIG.MONTHLY;
            const isFree = pub.grade === 'FREE';
            return (
              <div key={pub.id} className="gfm-card overflow-hidden cursor-pointer group" onClick={()=>dl(pub)}>
                {/* Cover */}
                <div className="aspect-[3/4] flex flex-col p-4 relative overflow-hidden"
                  style={{background:`linear-gradient(145deg, ${pub.color}ee, ${pub.color}99)`}}>
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(6)].map((_,i)=>(
                      <div key={i} className="absolute w-full h-px bg-white" style={{top:`${(i+1)*16.6}%`}}/>
                    ))}
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tc.bg} ${tc.text}`}>{pub.type}</span>
                      {!isFree && <span className="text-xs font-bold bg-amber-400 text-white px-1.5 py-0.5 rounded">PRO</span>}
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl text-white">
                        {pub.type==='GFR'?'🏆':pub.type==='QUARTERLY'?'📊':pub.type==='SPECIAL'?'⚡':'📰'}
                      </div>
                    </div>
                    <div className="text-white/80 text-xs font-mono mt-auto">{pub.date}</div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="font-bold text-xs text-deep leading-tight mb-1 line-clamp-2">{pub.title}</div>
                  <div className="text-xs text-slate-400">{pub.pages} pages{pub.signals>0&&` · ${pub.signals} signals`}</div>
                  <button disabled={dlg===pub.id}
                    className={`mt-2 w-full text-xs font-bold py-1.5 rounded-lg transition-all ${isFree?'bg-primary text-white hover:bg-primary-dark':'bg-deep text-white hover:opacity-90'} ${dlg===pub.id?'opacity-50':''}`}>
                    {dlg===pub.id?'…':isFree?'↓ Download':'↓ Pro — 5 FIC'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-8 justify-center">
          <button className="gfm-btn-outline text-sm px-6 py-2.5">View All Publications</button>
          <button className="gfm-btn-primary text-sm px-6 py-2.5">Subscribe to Updates</button>
        </div>
      </div>
    </div>
  );
}
