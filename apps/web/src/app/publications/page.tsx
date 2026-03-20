'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';

const CATEGORIES = ['All','Annual Report','Quarterly Brief','Sector Analysis','Economy Profile','Research Paper','Policy Note'];

const PUBS = [
  { ref:'GFM-PUB-2026-Q1-001', title:'Global FDI Outlook Q1 2026',             cat:'Quarterly Brief',  date:'2026-03-01', pages:48, regions:['Global'],         icon:'🌍' },
  { ref:'GFM-PUB-2026-ANN-001', title:'FDI Monitor Annual Report 2025',         cat:'Annual Report',    date:'2026-01-15', pages:124,regions:['Global'],         icon:'📊' },
  { ref:'GFM-PUB-2026-SEC-004', title:'ICT Sector FDI Opportunity Report',      cat:'Sector Analysis',  date:'2026-02-20', pages:36, regions:['Asia-Pacific'],    icon:'💻' },
  { ref:'GFM-PUB-2026-ECO-012', title:'UAE Investment Climate 2026',            cat:'Economy Profile',  date:'2026-02-10', pages:28, regions:['MENA'],            icon:'🇦🇪' },
  { ref:'GFM-PUB-2026-RES-002', title:'Greenfield FDI Trends Post-2025',        cat:'Research Paper',   date:'2026-01-28', pages:52, regions:['Global'],         icon:'🔬' },
  { ref:'GFM-PUB-2026-SEC-005', title:'Energy Transition FDI Report',           cat:'Sector Analysis',  date:'2026-03-08', pages:42, regions:['MENA','Europe'],   icon:'⚡' },
  { ref:'GFM-PUB-2026-POL-003', title:'FDI Policy Monitor — ASEAN',            cat:'Policy Note',      date:'2026-02-28', pages:18, regions:['Asia-Pacific'],    icon:'📋' },
  { ref:'GFM-PUB-2026-ECO-015', title:'Saudi Vision 2030 FDI Progress Report', cat:'Economy Profile',  date:'2026-03-12', pages:32, regions:['MENA'],            icon:'🇸🇦' },
  { ref:'GFM-PUB-2026-QBR-002', title:'MENA FDI Brief Q1 2026',               cat:'Quarterly Brief',  date:'2026-03-15', pages:24, regions:['MENA'],            icon:'📈' },
  { ref:'GFM-PUB-2025-ANN-002', title:'FDI Monitor Annual Report 2024',        cat:'Annual Report',    date:'2025-01-20', pages:118,regions:['Global'],         icon:'📊' },
];

const CAT_C: Record<string,string> = {
  'Annual Report':'#0A3D62','Quarterly Brief':'#74BB65','Sector Analysis':'#74BB65',
  'Economy Profile':'#22c55e','Research Paper':'#696969','Policy Note':'#696969'
};

export default function PublicationsPage() {
  const [cat,    setCat]    = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PUBS.filter(p => {
    const mc = cat === 'All' || p.cat === cat;
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
               p.regions.some(r => r.toLowerCase().includes(search.toLowerCase()));
    return mc && ms;
  });

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-wrap justify-between gap-4 items-end">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Intelligence Library</div>
            <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>Publications</h1>
            <p className="text-sm mt-1" style={{color:'#696969'}}>Quarterly briefs · Annual reports · Sector analysis · Economy profiles · Research</p>
          </div>
          <div className="flex gap-5">
            {[['10','Reports'],['6','Categories'],['2026','Latest'],['Open Access','Select']].map(([v,l])=>(
              <div key={l} className="text-center">
                <div className="text-xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div>
                <div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 border-b px-6 py-2.5 flex flex-wrap gap-2 items-center"
        style={{background:'rgba(240,248,238,0.96)',borderBottomColor:'rgba(10,61,98,0.15)',backdropFilter:'blur(10px)'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-xl min-w-52"
          placeholder="🔍 Search publications…"
          aria-label="Search publications"/>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className="text-xs px-2.5 py-1.5 rounded-lg font-bold border transition-all"
              style={cat===c?{background:CAT_C[c]||'#74BB65',color:'#E2F2DF',borderColor:CAT_C[c]||'#74BB65'}
                           :{borderColor:'rgba(10,61,98,0.2)',color:'#696969'}}>
              {c}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs" style={{color:'#696969'}}>{filtered.length} publications</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <PreviewGate feature="downloads">
          <div className="space-y-3">
            {filtered.map(pub=>(
              <div key={pub.ref} className="gfm-card p-5 flex items-center gap-4 flex-wrap">
                <span className="text-3xl flex-shrink-0">{pub.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-extrabold text-sm" style={{color:'#0A3D62'}}>{pub.title}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{background:`${CAT_C[pub.cat]||'#74BB65'}18`,color:CAT_C[pub.cat]||'#74BB65'}}>
                      {pub.cat}
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs flex-wrap" style={{color:'#696969'}}>
                    <span>{pub.date}</span>
                    <span>·</span>
                    <span>{pub.pages} pages</span>
                    <span>·</span>
                    <span>{pub.regions.join(', ')}</span>
                    <span>·</span>
                    <span className="font-data">{pub.ref}</span>
                  </div>
                </div>
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                  style={{background:'rgba(116,187,101,0.1)',color:'#74BB65',border:'1px solid rgba(116,187,101,0.2)'}}>
                  Download PDF
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12" style={{color:'#696969'}}>
                <div className="text-4xl mb-3">📚</div>
                <div className="font-extrabold" style={{color:'#696969'}}>No publications found</div>
              </div>
            )}
          </div>
        </PreviewGate>
      </div>
    </div>
  );
}
