'use client';
import { useState } from 'react';
import Link from 'next/link';
import { exportCSV } from '@/lib/export';

const SECTORS = [
  { code:'J', name:'Technology & ICT',      fdi_b:1840, growth:14.2, share:22, icon:'💻', risk:'LOW',    top_eco:'SGP/USA/IRL', signal_count:62, tier:'FRONTIER', desc:'Cloud infrastructure, AI, semiconductors, software R&D. Hyperscaler-led with sovereign wealth participation.' },
  { code:'K', name:'Finance & Insurance',   fdi_b:1210, growth:8.4,  share:15, icon:'🏦', risk:'LOW',    top_eco:'IRL/CHN/SGP', signal_count:38, tier:'HIGH',     desc:'Digital banking, fintech, payments infrastructure, insurance tech. RegTech opportunity driven by Basel IV.' },
  { code:'D', name:'Energy & Renewables',   fdi_b:980,  growth:22.8, share:12, icon:'⚡', risk:'MEDIUM', top_eco:'ARE/SAU/AUS', signal_count:44, tier:'HIGH',     desc:'Solar, wind, green hydrogen, grid infrastructure. Net-zero commitments driving fastest-growing FDI sector.' },
  { code:'C', name:'Manufacturing',         fdi_b:820,  growth:6.2,  share:10, icon:'🏭', risk:'MEDIUM', top_eco:'CHN/VNM/IDN', signal_count:35, tier:'HIGH',     desc:'EV components, battery manufacturing, advanced electronics. China+1 strategy reshaping ASEAN flows.' },
  { code:'H', name:'Logistics & Transport', fdi_b:420,  growth:9.4,  share:5,  icon:'🚢', risk:'LOW',    top_eco:'SGP/UAE/NLD', signal_count:22, tier:'HIGH',     desc:'Port infrastructure, cold chain, last-mile networks. E-commerce growth driving warehousing FDI.' },
  { code:'B', name:'Mining & Resources',    fdi_b:440,  growth:11.2, share:5,  icon:'⛏',  risk:'HIGH',   top_eco:'AUS/BRA/ZAF', signal_count:18, tier:'MEDIUM',   desc:'Critical minerals, copper, lithium, cobalt. EV supply chain driving strategic acquisitions globally.' },
  { code:'G', name:'Retail & Consumer',     fdi_b:210,  growth:5.8,  share:3,  icon:'🛒', risk:'MEDIUM', top_eco:'IND/CHN/USA', signal_count:14, tier:'MEDIUM',   desc:'E-commerce infrastructure, luxury retail, FMCG. Direct-to-consumer digital platforms reshaping flows.' },
  { code:'Q', name:'Healthcare & Pharma',   fdi_b:290,  growth:12.1, share:4,  icon:'🏥', risk:'LOW',    top_eco:'IRL/USA/SGP', signal_count:19, tier:'HIGH',     desc:'Pharma manufacturing, medtech, CRO expansion. Post-pandemic supply chain diversification drives greenfield.' },
  { code:'I', name:'Education & Tourism',   fdi_b:140,  growth:18.4, share:2,  icon:'🎓', risk:'LOW',    top_eco:'ARE/SGP/AUS', signal_count:11, tier:'MEDIUM',   desc:'Edtech platforms, hospitality expansion, tourism infrastructure. MENA driving 40% of global tourism FDI.' },
  { code:'A', name:'Agriculture & Food',    fdi_b:120,  growth:7.6,  share:1,  icon:'🌾', risk:'MEDIUM', top_eco:'BRA/IND/NGA', signal_count:9,  tier:'MEDIUM',   desc:'Food security investments, agritech, processing facilities. Sovereign wealth funds increasing allocation.' },
  { code:'L', name:'Real Estate',           fdi_b:380,  growth:4.2,  share:5,  icon:'🏗',  risk:'MEDIUM', top_eco:'ARE/CHN/USA', signal_count:24, tier:'MEDIUM',   desc:'Grade A commercial, logistics parks, data centre real estate. DIFC and ADGM driving MENA flows.' },
  { code:'N', name:'Infrastructure & Util.', fdi_b:280, growth:15.6, share:3,  icon:'🔌', risk:'MEDIUM', top_eco:'IND/EGY/IDN', signal_count:16, tier:'MEDIUM',   desc:'Power grids, water treatment, smart city infrastructure. PPP structures dominating greenfield mode.' },
];

const RISK_CFG: Record<string,{bg:string;text:string}> = {
  LOW:   {bg:'bg-emerald-100', text:'text-emerald-700'},
  MEDIUM:{bg:'bg-amber-100',   text:'text-amber-700'},
  HIGH:  {bg:'bg-red-100',     text:'text-red-700'},
};

export default function SectorsPage() {
  const [sort,     setSort]     = useState<'fdi_b'|'growth'|'signal_count'>('fdi_b');
  const [selected, setSelected] = useState<typeof SECTORS[0]|null>(null);
  const [risk,     setRisk]     = useState('');

  const sorted = [...SECTORS]
    .filter(s => !risk || s.risk === risk)
    .sort((a,b) => b[sort] - a[sort]);

  const totalFDI  = SECTORS.reduce((s,x) => s+x.fdi_b, 0);
  const avgGrowth = (SECTORS.reduce((s,x) => s+x.growth, 0) / SECTORS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">ISIC Rev.4 Classification</div>
          <h1 className="text-4xl font-extrabold mb-2">Sector Intelligence</h1>
          <p className="text-white/70">12 ISIC sectors tracked · Real-time signal density · Risk-return profiles</p>
          <div className="flex gap-8 mt-5">
            {[['$'+totalFDI.toFixed(0)+'B','Total tracked FDI'],['12','Sectors monitored'],[avgGrowth+'%','Average YoY growth']].map(([v,l])=>(
              <div key={l}><div className="stat-number text-2xl font-bold text-white">{v}</div><div className="text-white/40 text-xs">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2 items-center">
          {['','LOW','MEDIUM','HIGH'].map(r=>(
            <button key={r} onClick={()=>setRisk(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${risk===r?'bg-primary text-white border-primary':'border-slate-200 text-slate-500 hover:border-primary'}`}>
              {r||'All Risk'} {r && {LOW:'🟢',MEDIUM:'🟡',HIGH:'🔴'}[r]}
            </button>
          ))}
          <div className="flex gap-1 ml-3">
            {[['fdi_b','FDI'],['growth','Growth'],['signal_count','Signals']].map(([k,l])=>(
              <button key={k} onClick={()=>setSort(k as any)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${sort===k?'bg-deep text-white':'text-slate-500 hover:bg-slate-100'}`}>{l}</button>
            ))}
          </div>
          <button onClick={()=>exportCSV(sorted.map(s=>({Sector:s.name,'ISIC Code':s.code,'FDI $B':s.fdi_b,'Growth%':s.growth,'Signals':s.signal_count,'Risk':s.risk})),'GFM_Sectors')}
            className="ml-auto gfm-btn-outline text-xs py-1.5">Export CSV</button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((s, idx) => (
            <div key={s.code} onClick={()=>setSelected(selected?.code===s.code?null:s)}
              className={`gfm-card cursor-pointer hover:border-primary transition-all ${selected?.code===s.code?'border-primary ring-2 ring-primary ring-offset-1':''}`}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <div className="font-extrabold text-sm text-deep">{s.name}</div>
                      <div className="text-xs font-mono text-slate-400">ISIC {s.code}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-extrabold text-primary font-mono">${s.fdi_b}B</div>
                    <div className={`text-xs font-bold ${s.growth>10?'text-emerald-600':'text-slate-500'}`}>+{s.growth}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${RISK_CFG[s.risk].bg} ${RISK_CFG[s.risk].text}`}>{s.risk} risk</span>
                  <span className="text-xs text-slate-400">{s.signal_count} signals</span>
                  <span className="text-xs text-slate-400 ml-auto">{s.share}% share</span>
                </div>

                <div className="gfm-progress mb-3">
                  <div className="gfm-progress-fill" style={{width:`${(s.fdi_b/SECTORS[0].fdi_b)*100}%`}}/>
                </div>

                {selected?.code === s.code && (
                  <div className="border-t border-slate-100 pt-3 mt-1">
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{s.desc}</p>
                    <div className="text-xs text-slate-400 mb-2">Top economies: <strong className="text-deep">{s.top_eco}</strong></div>
                    <div className="flex gap-2">
                      <Link href={`/signals?sector=${s.code}`} className="gfm-btn-primary text-xs py-1.5 px-3">View Signals</Link>
                      <button onClick={()=>window.location.href='/subscription'} className="gfm-btn-outline text-xs py-1.5 px-3">Sector Brief — 14 FIC</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
