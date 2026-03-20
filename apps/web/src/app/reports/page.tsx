'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const REPORT_TYPES = [
  { id:'MIB',  name:'Market Intelligence Brief',           credits:5,  pages:'5–8',   icon:'📋', cat:'Signal', desc:'Focused brief on 3–5 active signals in a specified economy or sector. SCI scores, company overview, timeline.' },
  { id:'SER',  name:'Sector & Economy Report',             credits:8,  pages:'12–15', icon:'📊', cat:'Sector', desc:'Deep analysis of a single investment sector in a target economy. Growth drivers, regulatory environment, top investors.' },
  { id:'ICR',  name:'Investment Climate Report',           credits:18, pages:'15–20', icon:'🌍', cat:'Economy',desc:'Full investment climate assessment: GFR dimensions, signal landscape, policy framework, incentives, and risk matrix.' },
  { id:'TIR',  name:'Targeted Investment Report',          credits:20, pages:'18–22', icon:'🎯', cat:'Deal',   desc:'Investor-specific report combining company intelligence, target economy GFR, and deal feasibility analysis.' },
  { id:'CEGP', name:'Country Economic Growth Profile',     credits:12, pages:'12–15', icon:'📈', cat:'Economy',desc:'Five-year economic trajectory, FDI inflow history, sector composition, and 2030 growth projections.' },
  { id:'RQBR', name:'Regional Quarterly Brief',            credits:15, pages:'10–14', icon:'🌏', cat:'Regional',desc:'Quarterly intelligence bulletin covering top 10 signals, GFR movers, and thematic analysis for a specific region.' },
  { id:'SPOR', name:'Sector Opportunity Report',           credits:22, pages:'15–18', icon:'⚡', cat:'Sector', desc:'Investment opportunity mapping for a target sector across 10–15 economies. Corridor analysis and optimal entry points.' },
  { id:'FCGR', name:'Flagship GFR Report',                 credits:25, pages:'30–40', icon:'🏆', cat:'Flagship',desc:'Annual comprehensive GFR analysis. All 215 economies, all 6 dimensions, full rankings, tier analysis, and 12-month outlook.' },
  { id:'PMP',  name:'Mission Planning Dossier',            credits:30, pages:'35–45', icon:'🗺', cat:'Mission',desc:'Full mission planning package: target economies, matched companies, corridor intelligence, Intelligence matrix, and recommended outreach sequence.' },
  { id:'CRP',  name:'Custom Report',                       credits:35, pages:'Custom',icon:'✏️', cat:'Custom', desc:'Bespoke report configured to your specification. Scope, economy selection, sector focus, and output format agreed with the data team.' },
];

const CAT_COLORS: Record<string,string> = {Signal:'#74BB65',Sector:'#74BB65',Economy:'#0A3D62',Deal:'#22c55e',Regional:'#696969',Flagship:'#0A3D62',Mission:'#0A66C2',Custom:'#696969'};

const DEMO_GENERATED = [
  { ref:'GFM-RPT-ARE-ICR-2026-001', type:'ICR', title:'UAE Investment Climate Report Q1 2026', pages:18, date:'2026-03-15', sha:'a1b2c3d4e5f6' },
  { ref:'GFM-RPT-MIB-MSFT-2026-001', type:'MIB', title:'Microsoft UAE Greenfield Signal Brief', pages:7, date:'2026-03-12', sha:'b2c3d4e5f6a1' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'generate'|'library'>('generate');
  const [selected,  setSelected]  = useState<string|null>(null);
  const [catF,      setCatF]      = useState('');
  const [loading,   setLoading]   = useState(false);
  const [generated, setGenerated] = useState(DEMO_GENERATED);

  const cats = [...new Set(REPORT_TYPES.map(r=>r.cat))];
  const filtered = catF ? REPORT_TYPES.filter(r=>r.cat===catF) : REPORT_TYPES;

  async function generateReport() {
    if (!selected) return;
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('gfm_token')||'') : '';
      const r = await fetch(`${API}/api/v1/reports/generate`, {
        method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({ report_type: selected }),
      });
      const d = await r.json();
      if (d.status === 402) { alert('Subscription required to generate reports.'); return; }
      if (d.data?.ref) { setGenerated(prev=>[d.data,...prev]); setActiveTab('library'); }
    } catch { alert('Generation failed. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-wrap justify-between gap-4 items-end">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Intelligence Reports</div>
            <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>Report Generation</h1>
            <p className="text-sm mt-1" style={{color:'#696969'}}>10 report types · AI-powered · PDF only · Dynamic watermarks · Subscription required</p>
          </div>
          <div className="flex gap-5">
            {[['10','Report Types'],['5–45','Pages'],['PDF','Format Only'],['Watermarked','Security']].map(([v,l])=>(
              <div key={l} className="text-center">
                <div className="text-xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div>
                <div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 flex gap-0 border-b px-6" style={{background:'rgba(240,248,238,0.96)',borderBottomColor:'rgba(10,61,98,0.15)',backdropFilter:'blur(10px)'}}>
        <button onClick={()=>setActiveTab('generate')} className={`dash-tab ${activeTab==='generate'?'active':''}`}>📋 Generate Report</button>
        <button onClick={()=>setActiveTab('library')}  className={`dash-tab ${activeTab==='library'?'active':''}`}>📚 My Reports ({generated.length})</button>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        {activeTab === 'generate' && (
          <PreviewGate feature="reports">
            <div className="space-y-5">
              {/* Category filter */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={()=>setCatF('')}
                  className="text-xs px-3 py-1.5 rounded-lg font-bold border transition-all"
                  style={!catF?{background:'#74BB65',color:'#E2F2DF',borderColor:'#74BB65'}:{borderColor:'rgba(10,61,98,0.2)',color:'#696969'}}>
                  All Types
                </button>
                {cats.map(c=>(
                  <button key={c} onClick={()=>setCatF(c)}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold border transition-all"
                    style={catF===c?{background:CAT_COLORS[c],color:'#E2F2DF',borderColor:CAT_COLORS[c]}:{borderColor:'rgba(10,61,98,0.2)',color:'#696969'}}>
                    {c}
                  </button>
                ))}
              </div>

              {/* Report type grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {filtered.map(rt=>(
                  <div key={rt.id}
                    onClick={()=>setSelected(s=>s===rt.id?null:rt.id)}
                    className={`gfm-card p-5 cursor-pointer transition-all ${selected===rt.id?'border-2':''}`}
                    style={selected===rt.id?{borderColor:'#74BB65',background:'rgba(116,187,101,0.04)'}:{}}>
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0">{rt.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-extrabold text-sm" style={{color:'#0A3D62'}}>{rt.name}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{background:`${CAT_COLORS[rt.cat]}15`,color:CAT_COLORS[rt.cat]}}>{rt.id}</span>
                        </div>
                        <div className="flex gap-3 text-xs mb-1" style={{color:'#696969'}}>
                          <span>📄 {rt.pages} pages</span>
                          <span>💳 {rt.credits} credits</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{color:'#696969'}}>{rt.desc}</p>
                      </div>
                      {selected===rt.id && <span style={{color:'#74BB65',flexShrink:0}}>●</span>}
                    </div>
                  </div>
                ))}
              </div>

              {selected && (
                <div className="gfm-card p-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="font-extrabold text-sm" style={{color:'#0A3D62'}}>
                      Selected: {REPORT_TYPES.find(r=>r.id===selected)?.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{color:'#696969'}}>
                      {REPORT_TYPES.find(r=>r.id===selected)?.credits} credits · {REPORT_TYPES.find(r=>r.id===selected)?.pages} pages · PDF format
                    </div>
                  </div>
                  <button onClick={generateReport} disabled={loading}
                    className={`gfm-btn-primary px-8 py-2.5 text-sm ${loading?'opacity-70':''}`}>
                    {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Generating…</span> : 'Generate PDF Report →'}
                  </button>
                </div>
              )}
            </div>
          </PreviewGate>
        )}

        {activeTab === 'library' && (
          <PreviewGate feature="downloads">
            <div>
              {generated.length === 0 ? (
                <div className="text-center py-16" style={{color:'#696969'}}>
                  <div className="text-4xl mb-3">📚</div>
                  <div className="font-extrabold mb-2" style={{color:'#696969'}}>No reports generated yet</div>
                  <button onClick={()=>setActiveTab('generate')} className="gfm-btn-primary text-sm px-5 py-2.5">Generate First Report</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {generated.map(r=>(
                    <div key={r.ref} className="gfm-card p-5 flex items-center gap-4 flex-wrap">
                      <div className="text-2xl flex-shrink-0">📄</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm mb-0.5" style={{color:'#0A3D62'}}>{r.title}</div>
                        <div className="flex gap-3 text-xs flex-wrap" style={{color:'#696969'}}>
                          <span>{r.type}</span><span>·</span><span>{r.pages} pages</span><span>·</span><span>{r.date}</span>
                          <span>·</span><span className="font-data">SHA: {r.sha}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{background:'rgba(116,187,101,0.1)',color:'#74BB65'}}>Download PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PreviewGate>
        )}
      </div>
    </div>
  );
}
