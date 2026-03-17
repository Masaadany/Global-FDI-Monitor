'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

// Static data for 20 key economies
const ECONOMY_DATA: Record<string, any> = {
  ARE: { name:'United Arab Emirates', capital:'Abu Dhabi', pop_m:10, currency:'AED', lang:'Arabic', tz:'GMT+4', gfr:80.0, macro:82, policy:78, digital:84, human:54, infra:92, sustain:53,
    fdi_inflows:30.7, fdi_stocks:198, greenfield:18.2, ma:7.1, avg_project_m:45, jobs_yr:125000, ics:85, investor_score:92,
    top_sources:[{c:'USA',share:35,b:8.9},{c:'India',share:22,b:5.6},{c:'UK',share:15,b:3.8},{c:'France',share:12,b:3.0},{c:'Germany',share:8,b:2.0}],
    top_sectors:[{s:'Technology',share:45,b:11.4},{s:'Renewable Energy',share:23,b:5.8},{s:'Finance',share:14,b:3.5},{s:'Healthcare',share:10,b:2.5},{s:'Logistics',share:8,b:2.0}],
    top_projects:[{co:'Microsoft',amt:'$850M',type:'Cloud Region',city:'Dubai',yr:2026},{co:'Amazon AWS',amt:'$5.3B',type:'Expansion',city:'UAE',yr:2026},{co:'CATL',amt:'Exploring',type:'Battery',city:'JAFZA',yr:2026},{co:'BlackRock',amt:'$500M',type:'Platform',city:'DIFC',yr:2026}],
    ires:84, ims:94, sci:92, fzii:90, pai:88, gci:87, free_zones:46, gdp_b:504 },
  SAU: { name:'Saudi Arabia', capital:'Riyadh', pop_m:36, currency:'SAR', lang:'Arabic', tz:'GMT+3', gfr:68.1, macro:74, policy:62, digital:72, human:48, infra:76, sustain:50,
    fdi_inflows:28.3, fdi_stocks:284, greenfield:22.1, ma:6.2, avg_project_m:68, jobs_yr:180000, ics:79, investor_score:85,
    top_sources:[{c:'USA',share:28,b:7.9},{c:'China',share:22,b:6.2},{c:'UK',share:14,b:4.0},{c:'France',share:10,b:2.8},{c:'Japan',share:8,b:2.3}],
    top_sectors:[{s:'Renewable Energy',share:38,b:10.7},{s:'Technology',share:28,b:7.9},{s:'Tourism',share:16,b:4.5},{s:'Manufacturing',share:12,b:3.4},{s:'Mining',share:6,b:1.7}],
    top_projects:[{co:'Amazon AWS',amt:'$5.3B',type:'Cloud',city:'Riyadh',yr:2026},{co:'ACWA Power',amt:'$4.2B',type:'Solar',city:'NEOM',yr:2026},{co:'Lucid Motors',amt:'$3.8B',type:'EV Factory',city:'King Abdullah',yr:2025},{co:'Google',amt:'$1B',type:'Cloud',city:'Riyadh',yr:2026}],
    ires:79, ims:85, sci:80, fzii:72, pai:76, gci:78, free_zones:36, gdp_b:1069 },
  IND: { name:'India', capital:'New Delhi', pop_m:1430, currency:'INR', lang:'Hindi/English', tz:'GMT+5:30', gfr:62.3, macro:68, policy:56, digital:59, human:69, infra:65, sustain:38,
    fdi_inflows:71.0, fdi_stocks:520, greenfield:48.2, ma:22.8, avg_project_m:32, jobs_yr:980000, ics:72, investor_score:78,
    top_sources:[{c:'USA',share:24,b:17.0},{c:'Singapore',share:18,b:12.8},{c:'UK',share:14,b:9.9},{c:'Netherlands',share:10,b:7.1},{c:'Japan',share:8,b:5.7}],
    top_sectors:[{s:'Technology',share:42,b:29.8},{s:'Manufacturing',share:22,b:15.6},{s:'Renewable Energy',share:18,b:12.8},{s:'Finance',share:10,b:7.1},{s:'Retail',share:8,b:5.7}],
    top_projects:[{co:'Apple',amt:'$1.5B',type:'Manufacturing',city:'Chennai',yr:2026},{co:'Samsung',amt:'$880M',type:'Expansion',city:'Noida',yr:2025},{co:'Vestas',amt:'$420M',type:'Wind Factory',city:'Rajasthan',yr:2026},{co:'Google',amt:'$2B',type:'Infrastructure',city:'Mumbai',yr:2025}],
    ires:68, ims:74, sci:72, fzii:58, pai:64, gci:70, free_zones:285, gdp_b:3730 },
  SGP: { name:'Singapore', capital:'Singapore', pop_m:6, currency:'SGD', lang:'English', tz:'GMT+8', gfr:88.5, macro:87, policy:91, digital:87, human:63, infra:94, sustain:62,
    fdi_inflows:141.2, fdi_stocks:1840, greenfield:88.4, ma:52.8, avg_project_m:82, jobs_yr:42000, ics:94, investor_score:98,
    top_sources:[{c:'USA',share:32,b:45.2},{c:'Japan',share:18,b:25.4},{c:'Netherlands',share:14,b:19.8},{c:'UK',share:10,b:14.1},{c:'China',share:8,b:11.3}],
    top_sectors:[{s:'Finance',share:38,b:53.7},{s:'Technology',share:28,b:39.5},{s:'Manufacturing',share:16,b:22.6},{s:'Logistics',share:10,b:14.1},{s:'Biotech',share:8,b:11.3}],
    top_projects:[{co:'NVIDIA',amt:'$4.4B',type:'AI Data Centre',city:'Singapore',yr:2026},{co:'Databricks',amt:'$150M',type:'APAC HQ',city:'Singapore',yr:2026},{co:'Pfizer',amt:'$900M',type:'Biotech',city:'Tuas',yr:2025},{co:'BlackRock',amt:'$400M',type:'Platform',city:'CBD',yr:2025}],
    ires:89, ims:96, sci:94, fzii:92, pai:90, gci:88, free_zones:8, gdp_b:501 },
};

// Fallback for unlisted economies
function getEco(iso3: string) {
  return ECONOMY_DATA[iso3] || {
    name: iso3, capital:'—', pop_m:0, currency:'—', lang:'—', tz:'—',
    gfr:55, macro:55, policy:55, digital:55, human:55, infra:55, sustain:55,
    fdi_inflows:5, fdi_stocks:40, greenfield:3, ma:2, avg_project_m:20, jobs_yr:20000, ics:60, investor_score:65,
    top_sources:[], top_sectors:[], top_projects:[],
    ires:58, ims:60, sci:58, fzii:50, pai:56, gci:55, free_zones:5, gdp_b:100
  };
}

export default function CountryProfileClient({ iso3: iso3Prop }: { iso3: string }) {
  const iso3 = iso3Prop.toUpperCase();
  const eco    = getEco(iso3);
  const [tab, setTab] = useState<'overview'|'gfr'|'projects'|'signals'>('overview');

  const DIMS = [['Economic Resilience',eco.macro],['Policy & Governance',eco.policy],['Digital Foundations',eco.digital],['Human Capital',eco.human],['Infrastructure',eco.infra],['Sustainability',eco.sustain]];
  const PROP = [['IRES',eco.ires],['IMS',eco.ims],['SCI',eco.sci],['FZII',eco.fzii],['PAI',eco.pai],['GCI',eco.gci]];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Country Investment Profile</div>
          <h1 className="text-4xl font-extrabold mb-1">{eco.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/60 mt-2">
            {[['Capital',eco.capital],['Population',`${eco.pop_m}M`],['Currency',eco.currency],['Language',eco.lang],['Timezone',eco.tz]].map(([l,v])=>
              <span key={String(l)}><span className="text-white/30">{l}:</span> <strong className="text-white/80">{v}</strong></span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-5xl font-extrabold font-mono text-white">{eco.gfr}</div>
            <div>
              <div className="text-sm font-bold text-blue-200">GFR Score — Q1 2026</div>
              <div className="text-xs text-white/50">Global Future Readiness</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-screen-xl mx-auto flex gap-0">
          {[['overview','📊 Overview'],['gfr','🏆 GFR Scores'],['projects','🏗 Projects'],['signals','📡 Signals']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {tab==='overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Key indicators */}
            <div className="space-y-4">
              <div className="font-extrabold text-deep text-sm uppercase tracking-wide mb-3">Key FDI Indicators</div>
              <div className="grid grid-cols-2 gap-3">
                {[['FDI Inflows 2025',`$${eco.fdi_inflows}B`,'↑12%'],['FDI Stocks',`$${eco.fdi_stocks}B`,'↑8%'],['Greenfield',`$${eco.greenfield}B`,'↑15%'],['M&A Deals',`$${eco.ma}B`,'↑5%'],['Avg Project',`$${eco.avg_project_m}M`,''],['Jobs/Year',eco.jobs_yr.toLocaleString(),''],['Inv. Climate',`${eco.ics}/100`,''],['Free Zones',String(eco.free_zones),'']].map(([l,v,t])=>(
                  <div key={String(l)} className="gfm-card p-4">
                    <div className="text-xs text-slate-400 mb-1">{l}</div>
                    <div className="font-extrabold text-lg text-primary font-mono">{v}</div>
                    {t && <div className="text-xs text-emerald-500 font-bold">{t}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {/* Top investors */}
              <div className="gfm-card p-5">
                <div className="font-extrabold text-deep text-sm mb-3">Top Investor Countries</div>
                {eco.top_sources.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <div className="text-xs font-mono text-slate-400 w-4">{i+1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5"><span className="font-semibold text-deep">{s.c}</span><span className="font-mono text-primary">${s.b}B</span></div>
                      <div className="gfm-progress"><div className="gfm-progress-fill" style={{width:`${s.share}%`}}/></div>
                    </div>
                    <div className="text-xs text-slate-400 w-8 text-right">{s.share}%</div>
                  </div>
                ))}
              </div>
              {/* Top sectors */}
              <div className="gfm-card p-5">
                <div className="font-extrabold text-deep text-sm mb-3">Top Investment Sectors</div>
                {eco.top_sectors.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <div className="text-xs font-mono text-slate-400 w-4">{i+1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5"><span className="font-semibold text-deep">{s.s}</span><span className="font-mono text-primary">${s.b}B</span></div>
                      <div className="gfm-progress"><div className="gfm-progress-fill" style={{width:`${s.share}%`}}/></div>
                    </div>
                    <div className="text-xs text-slate-400 w-8 text-right">{s.share}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==='gfr' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="gfm-card p-6">
              <div className="font-extrabold text-deep text-sm mb-4">Core Dimensions</div>
              {DIMS.map(([l,v]) => (
                <div key={String(l)} className="mb-3">
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">{l}</span><span className="font-bold font-mono text-primary">{v}</span></div>
                  <div className="gfm-progress"><div className="gfm-progress-fill" style={{width:`${v}%`}}/></div>
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-deep">GFR Composite</span>
                  <span className="text-2xl font-extrabold font-mono text-primary">{eco.gfr}</span>
                </div>
              </div>
            </div>
            <div className="gfm-card p-6">
              <div className="font-extrabold text-deep text-sm mb-1">Proprietary Factors</div>
              <div className="text-xs text-slate-400 mb-4">Full methodology in exported reports</div>
              <div className="grid grid-cols-2 gap-3">
                {PROP.map(([k,v]) => (
                  <div key={String(k)} className="bg-primary-light rounded-xl p-3 border border-blue-200">
                    <div className="font-extrabold text-primary font-mono text-lg">{v}</div>
                    <div className="text-xs font-bold text-blue-600 mt-0.5">{k}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                IRES: Investment Resilience · IMS: Momentum · SCI: Signal Confidence · FZII: Free Zone Intensity · PAI: Policy Attractiveness · GCI: Greenfield Confidence
              </div>
            </div>
          </div>
        )}

        {tab==='projects' && (
          <div className="space-y-3 max-w-3xl">
            <div className="font-extrabold text-deep text-sm mb-3">Top Investment Projects 2025–2026</div>
            {eco.top_projects.map((p: any, i: number) => (
              <div key={i} className="gfm-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary font-extrabold text-sm">{p.co.slice(0,2)}</div>
                <div className="flex-1">
                  <div className="font-bold text-deep">{p.co}</div>
                  <div className="text-xs text-slate-500">{p.type} · {p.city} · {p.yr}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-primary font-mono">{p.amt}</div>
                  <Link href="/signals" className="text-xs text-primary hover:underline">View signal →</Link>
                </div>
              </div>
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={()=>window.location.href='/subscription'} className="gfm-btn-primary px-6 py-2.5">Generate Country Report — 20 FIC</button>
              <Link href={`/gfr`} className="gfm-btn-outline px-6 py-2.5">Compare with Peers</Link>
            </div>
          </div>
        )}

        {tab==='signals' && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📡</div>
            <div className="font-extrabold text-deep text-lg mb-2">Signals for {eco.name}</div>
            <p className="text-slate-500 text-sm mb-5">Filter the signals dashboard by {iso3} to see all {eco.name} intelligence.</p>
            <Link href={`/signals?country=${eco.name}`} className="gfm-btn-primary px-8 py-3">View Signals for {eco.name}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
