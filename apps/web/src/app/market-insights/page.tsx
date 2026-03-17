'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const INSIGHTS = [
  { id:'MI-2026-031', date:'2026-03-17', category:'MARKET_UPDATE', headline:'MENA FDI hits 5-year high in Q1 2026', body:'Total FDI inflows to MENA reached $88B in Q1 2026, driven by UAE (+14%), Saudi Arabia (+12%), and Egypt (+32%). Technology and renewable energy lead sector allocation.', impact:'HIGH', region:'MENA', read_min:4, tag:'Quarterly Update' },
  { id:'MI-2026-030', date:'2026-03-15', category:'POLICY_SHIFT',  headline:'India announces 100% FDI in insurance sector', body:'India\'s DPIIT cleared 100% foreign investment in insurance intermediaries, opening a $280B market. Expected FDI surge of $15–22B over 3 years. Sector: Finance (ISIC K).', impact:'HIGH', region:'SAS', read_min:3, tag:'Policy Update' },
  { id:'MI-2026-029', date:'2026-03-12', category:'SECTOR_INTEL',  headline:'EV battery supply chain FDI surpasses $45B in ASEAN', body:'CATL, LG Energy, Samsung SDI and BYD have collectively committed $45B+ to battery manufacturing across Vietnam, Indonesia, and Malaysia. ISIC C dominates greenfield flows.', impact:'HIGH', region:'EAP', read_min:5, tag:'Sector Brief' },
  { id:'MI-2026-028', date:'2026-03-10', category:'GFR_UPDATE',    headline:'UAE records largest single-quarter GFR gain in history', body:'UAE\'s GFR score rose 4.2 points to 80.0 in Q1 2026, the largest quarterly gain among FRONTIER economies. Digital Foundations and Infrastructure sub-scores drove the improvement.', impact:'MEDIUM', region:'MENA', read_min:3, tag:'GFR Insight' },
  { id:'MI-2026-027', date:'2026-03-08', category:'CORRIDOR',      headline:'USA→UAE corridor emerges as top FDI flow in 2026', body:'The USA-UAE bilateral investment corridor reached $5.8B in H2 2025, surpassing traditional flows. Technology, finance, and AI infrastructure drive the trend.', impact:'HIGH', region:'MENA', read_min:4, tag:'Corridor Intelligence' },
  { id:'MI-2026-026', date:'2026-03-05', category:'MARKET_UPDATE', headline:'Singapore retains #1 GFR rank — FRONTIER tier leads with 88.5', body:'Singapore maintains its position as the world\'s most investment-ready economy with GFR 88.5. Infrastructure (94) and Policy (91) scores lead all dimensions globally.', impact:'MEDIUM', region:'EAP', read_min:3, tag:'GFR Rankings' },
  { id:'MI-2026-025', date:'2026-03-03', category:'POLICY_SHIFT',  headline:'Africa Continental Free Trade Area triggers $22B FDI pipeline', body:'AfCFTA implementation has catalysed a $22B committed FDI pipeline across 18 African economies. Mining, agriculture, and digital infrastructure dominate the early flows.', impact:'HIGH', region:'SSA', read_min:6, tag:'Policy Impact' },
  { id:'MI-2026-024', date:'2026-02-28', category:'SECTOR_INTEL',  headline:'Green hydrogen FDI reaches $18B globally in Q1 2026', body:'ACWA Power, TotalEnergies, and NEOM together announced $8B+ in green hydrogen projects. MENA leads supply-side investment while Europe leads demand-side commitments.', impact:'HIGH', region:'Global', read_min:5, tag:'Sector Brief' },
];

const IMPACT_CFG: Record<string, {bg:string; text:string; border:string}> = {
  HIGH:   { bg:'bg-red-50',    text:'text-red-700',    border:'border-red-200'   },
  MEDIUM: { bg:'bg-amber-50',  text:'text-amber-700',  border:'border-amber-200' },
  LOW:    { bg:'bg-slate-50',  text:'text-slate-600',  border:'border-slate-200' },
};
const CAT_ICON: Record<string,string> = {
  MARKET_UPDATE:'📊', POLICY_SHIFT:'⚖️', SECTOR_INTEL:'🏭', GFR_UPDATE:'🏆', CORRIDOR:'🛤'
};

export default function MarketInsightsPage() {
  const [insights, setInsights] = useState(INSIGHTS);
  const [filter,   setFilter]   = useState('');
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState<string|null>(null);

  useEffect(() => {
    fetch(`${API}/api/v1/insights?size=12`)
      .then(r => r.json())
      .then(d => { if (d.data?.insights?.length) setInsights(d.data.insights); })
      .catch(() => {});
  }, []);

  const shown = insights.filter(i =>
    (!filter || i.region === filter || i.category === filter) &&
    (!search  || i.headline.toLowerCase().includes(search.toLowerCase()) || i.body.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = [...new Set(INSIGHTS.map(i => i.category))];

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Intelligence Resources</div>
          <h1 className="text-4xl font-extrabold mb-2">Market Insights & Resources</h1>
          <p className="text-white/70">Analysis, policy updates, sector intelligence, GFR commentary</p>
          <div className="flex gap-6 mt-5">
            {[['8','This week'],['$88B','MENA Q1 FDI'],['4.2pt','UAE GFR gain']].map(([v,l])=>(
              <div key={l}><div className="stat-number text-xl font-bold text-white">{v}</div><div className="text-white/40 text-xs">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2 items-center">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search insights…"
            className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-44 focus:outline-none focus:border-primary"/>
          <div className="flex gap-1 flex-wrap">
            <button onClick={()=>setFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!filter?'bg-primary text-white':'border border-slate-200 text-slate-500 hover:border-primary'}`}>All</button>
            {['MENA','EAP','SAS','SSA'].map(r=>(
              <button key={r} onClick={()=>setFilter(filter===r?'':r)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${filter===r?'bg-primary text-white border-primary':'border-slate-200 text-slate-500 hover:border-primary'}`}>{r}</button>
            ))}
          </div>
          <span className="text-xs text-slate-400 ml-auto">{shown.length} insights</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {/* Featured */}
        {shown[0] && (
          <div className="gfm-card mb-5 overflow-hidden cursor-pointer hover:border-primary transition-all" onClick={()=>setExpanded(expanded===shown[0].id?null:shown[0].id)}>
            <div className="md:flex">
              <div className="md:flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{CAT_ICON[shown[0].category]||'💡'}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{shown[0].tag}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${IMPACT_CFG[shown[0].impact]?.bg} ${IMPACT_CFG[shown[0].impact]?.text} ${IMPACT_CFG[shown[0].impact]?.border}`}>{shown[0].impact}</span>
                  <span className="ml-auto text-xs text-slate-300">{shown[0].read_min} min read</span>
                </div>
                <h2 className="font-extrabold text-xl text-deep mb-2">{shown[0].headline}</h2>
                <p className="text-slate-500 text-sm leading-relaxed">{expanded===shown[0].id ? shown[0].body : shown[0].body.slice(0,120)+'…'}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-slate-400">{shown[0].date}</span>
                  <span className="text-xs text-primary font-semibold hover:underline">{expanded===shown[0].id?'Read less':'Read more'} →</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.slice(1).map(insight => (
            <div key={insight.id} className="gfm-card p-5 cursor-pointer hover:border-primary transition-all group"
              onClick={()=>setExpanded(expanded===insight.id?null:insight.id)}>
              <div className="flex items-center gap-2 mb-2">
                <span>{CAT_ICON[insight.category]||'💡'}</span>
                <span className="text-xs font-bold text-slate-400 flex-1 truncate">{insight.tag}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold border flex-shrink-0 ${IMPACT_CFG[insight.impact]?.bg} ${IMPACT_CFG[insight.impact]?.text} ${IMPACT_CFG[insight.impact]?.border}`}>{insight.impact}</span>
              </div>
              <h3 className="font-bold text-deep text-sm mb-2 group-hover:text-primary transition-colors leading-tight">{insight.headline}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {expanded===insight.id ? insight.body : insight.body.slice(0,100)+'…'}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-300">{insight.date}</span>
                <span className="text-xs text-slate-400">{insight.read_min} min</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <a href="/publications" className="gfm-btn-primary px-6 py-2.5 text-sm">Full Reports Library</a>
          <a href="/contact?type=data&message=Subscribe%20to%20Market%20Insights" className="gfm-btn-outline px-6 py-2.5 text-sm">Subscribe to Updates</a>
        </div>
      </div>
    </div>
  );
}
