'use client';
import { useState } from 'react';

const PUBLICATIONS = [
  {
    id:'FNL-WK-2026-11-20260317-001', type:'WEEKLY_NEWSLETTER', title:'Global FDI Intelligence — Week 11, 2026',
    date:'March 17, 2026', summary:'12 new signals including 3 Platinum. UAE leads MENA with $1.5B+ committed this week. India tech sector surges.',
    highlights:['Microsoft $850M UAE data centre confirmed','Amazon AWS $5.3B Saudi Arabia expansion announced','India insurance FDI cap raised to 100%'],
    readTime:'8 min', pages:12, grade:'FREE',
  },
  {
    id:'FNL-WK-2026-10-20260310-001', type:'WEEKLY_NEWSLETTER', title:'Global FDI Intelligence — Week 10, 2026',
    date:'March 10, 2026', summary:'9 signals detected. Vietnam manufacturing boom continues. Green hydrogen investments accelerating globally.',
    highlights:['Samsung $2.8B Vietnam expansion','Vestas $420M India wind farm','UAE GFR score reaches historic high'],
    readTime:'7 min', pages:10, grade:'FREE',
  },
  {
    id:'FPB-MON-2026-03-20260301-001', type:'MONTHLY_PUBLICATION', title:'Global FDI Monitor — March 2026 Intelligence Report',
    date:'March 1, 2026', summary:'Comprehensive monthly analysis: 47 signals, GFR quarterly update, sector spotlights on AI infrastructure and green energy.',
    highlights:['Q1 2026 global FDI on track for $2.1T','MENA investment climate at 10-year high','Data centre boom: $28B pipeline to 2028'],
    readTime:'45 min', pages:68, grade:'PROFESSIONAL',
  },
  {
    id:'FGR-QTR-2026-Q1-20260415-001', type:'GFR_QUARTERLY', title:'GFR Rankings — Q1 2026 Quarterly Update',
    date:'April 15, 2026', summary:'Quarterly GFR update across all 215 economies. UAE records largest quarterly gain. Singapore retains #1.',
    highlights:['UAE +4.2 points — largest gain in index history','10 economies move tier upward','Sustainability dimension now 17% weight'],
    readTime:'30 min', pages:48, grade:'PROFESSIONAL',
  },
];

const TYPE_LABELS: Record<string,string> = {
  WEEKLY_NEWSLETTER:'Weekly Newsletter',
  MONTHLY_PUBLICATION:'Monthly Report',
  GFR_QUARTERLY:'GFR Quarterly',
};

const TYPE_COLORS: Record<string,string> = {
  WEEKLY_NEWSLETTER:'bg-blue-100 text-blue-700',
  MONTHLY_PUBLICATION:'bg-violet-100 text-violet-700',
  GFR_QUARTERLY:'bg-amber-100 text-amber-700',
};

export default function PublicationsPage() {
  const [selected, setSelected] = useState(PUBLICATIONS[0]);
  const [filter,   setFilter]   = useState('');

  const filtered = PUBLICATIONS.filter(p => !filter || p.type === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Publications</span>
        <div className="flex gap-1 ml-4">
          {[['','All'],['WEEKLY_NEWSLETTER','Weekly'],['MONTHLY_PUBLICATION','Monthly'],['GFR_QUARTERLY','GFR Quarterly']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter===v ? 'bg-[#0A2540] text-white' : 'text-slate-400 border border-slate-200'
              }`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-5 grid md:grid-cols-5 gap-5">
        {/* List */}
        <div className="md:col-span-2 space-y-3">
          {filtered.map(pub => (
            <div key={pub.id} onClick={() => setSelected(pub)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                selected.id===pub.id ? 'border-blue-400 shadow-sm' : 'border-slate-100 hover:border-blue-200'
              }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${TYPE_COLORS[pub.type]}`}>
                  {TYPE_LABELS[pub.type]}
                </span>
                {pub.grade === 'PROFESSIONAL' && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">PRO</span>
                )}
              </div>
              <div className="font-bold text-sm text-[#0A2540] mb-1 leading-snug">{pub.title}</div>
              <div className="text-xs text-slate-400">{pub.date} · {pub.readTime} · {pub.pages} pages</div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${TYPE_COLORS[selected.type]}`}>
              {TYPE_LABELS[selected.type]}
            </span>
            {selected.grade === 'PROFESSIONAL' && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">PROFESSIONAL PLAN</span>
            )}
          </div>
          <h2 className="font-black text-xl text-[#0A2540] mb-1">{selected.title}</h2>
          <div className="text-xs text-slate-400 font-mono mb-4">{selected.id}</div>
          <div className="flex gap-4 text-xs text-slate-500 mb-5">
            <span>📅 {selected.date}</span>
            <span>⏱ {selected.readTime}</span>
            <span>📄 {selected.pages} pages</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-5">{selected.summary}</p>
          <div className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-3">Key Highlights</div>
          <div className="space-y-2 mb-6">
            {selected.highlights.map((h,i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-blue-500 font-bold flex-shrink-0 mt-0.5">→</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
          {selected.grade === 'PROFESSIONAL' ? (
            <button className="w-full bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
              Download PDF (Professional Plan)
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="flex-1 bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                Read Online
              </button>
              <button className="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:border-blue-300 transition-colors">
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
