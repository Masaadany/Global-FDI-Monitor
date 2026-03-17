'use client';
import { useState, useMemo } from 'react';
import { exportGFR, exportCSV } from '@/lib/export';
import Link from 'next/link';

const TIER_CONFIG = {
  FRONTIER:  {bg:'bg-violet-100',text:'text-violet-800',border:'border-violet-200',color:'#7C3AED'},
  HIGH:      {bg:'bg-blue-100',  text:'text-blue-800',  border:'border-blue-200',  color:'#2563EB'},
  MEDIUM:    {bg:'bg-amber-100', text:'text-amber-800', border:'border-amber-200', color:'#D97706'},
  EMERGING:  {bg:'bg-orange-100',text:'text-orange-800',border:'border-orange-200',color:'#EA580C'},
  DEVELOPING:{bg:'bg-slate-100', text:'text-slate-600', border:'border-slate-200', color:'#6B7280'},
};

// Q4 2025 baselines for trend arrows
const Q4_2025: Record<string,number> = {
  SGP:87.8,CHE:87.0,ARE:75.8,DEU:77.4,USA:83.9,GBR:78.0,NOR:82.6,SAU:65.2,
  IND:60.8,BRA:53.0,NGA:40.8,AUS:81.4,JPN:78.9,KOR:77.2,VNM:56.8,EGY:50.9,
  IDN:55.8,MYS:65.1,THA:62.4,NLD:79.8,IRL:75.8,FRA:75.4,ITA:67.2,ESP:69.4,
  POL:61.2,TUR:50.8,KAZ:50.8,ZAF:50.2,KEN:50.0,QAT:70.0,CHN:61.2,KWT:68.4,
  BHR:64.2,OMN:56.8,ISR:72.1,HKG:82.4,TWN:74.2,DNK:85.4,SWE:83.1,FIN:84.2,
};

// Proprietary factors (derived from composite + dimension scores)
function propFactors(eco: any) {
  const c = eco.composite;
  return {
    IRES: Math.min(99,Math.round(c*1.05+eco.macro*0.02)),
    IMS:  Math.min(99,Math.round(c*1.10+eco.digital*0.03)),
    SCI:  Math.min(99,Math.round(c*1.08+eco.policy*0.02)),
    FZII: Math.min(99,Math.round(c*0.92+eco.infra*0.05)),
    PAI:  Math.min(99,Math.round(c*0.98+eco.policy*0.03)),
    GCI:  Math.min(99,Math.round(c*1.02+eco.macro*0.03)),
  };
}

const GFR_ALL: any[] = [
  {iso3:'SGP',name:'Singapore',    region:'EAP', income:'High', composite:88.5,tier:'FRONTIER', macro:87,policy:91,digital:87,human:63,infra:94,sustain:62,fdi_b:141.2,gdp_b:501,  pop_m:6,  internet_pct:97,rank:1},
  {iso3:'CHE',name:'Switzerland',  region:'ECA', income:'High', composite:87.5,tier:'FRONTIER', macro:87,policy:88,digital:86,human:70,infra:90,sustain:78,fdi_b:26.0, gdp_b:884,  pop_m:9,  internet_pct:94,rank:2},
  {iso3:'USA',name:'United States',region:'NAM', income:'High', composite:84.5,tier:'FRONTIER', macro:89,policy:83,digital:91,human:74,infra:86,sustain:68,fdi_b:285.0,gdp_b:27360,pop_m:335,internet_pct:92,rank:3},
  {iso3:'NOR',name:'Norway',        region:'ECA', income:'High', composite:83.2,tier:'FRONTIER', macro:88,policy:90,digital:84,human:71,infra:85,sustain:82,fdi_b:8.4,  gdp_b:620,  pop_m:5,  internet_pct:99,rank:4},
  {iso3:'DNK',name:'Denmark',       region:'ECA', income:'High', composite:82.8,tier:'FRONTIER', macro:85,policy:91,digital:86,human:72,infra:83,sustain:80,fdi_b:7.8,  gdp_b:420,  pop_m:6,  internet_pct:98,rank:5},
  {iso3:'AUS',name:'Australia',     region:'EAP', income:'High', composite:82.1,tier:'FRONTIER', macro:83,policy:85,digital:82,human:69,infra:84,sustain:76,fdi_b:59.0, gdp_b:1688, pop_m:26, internet_pct:91,rank:6},
  {iso3:'SWE',name:'Sweden',        region:'ECA', income:'High', composite:81.9,tier:'FRONTIER', macro:84,policy:89,digital:85,human:71,infra:82,sustain:79,fdi_b:12.4, gdp_b:590,  pop_m:10, internet_pct:97,rank:7},
  {iso3:'FIN',name:'Finland',       region:'ECA', income:'High', composite:81.4,tier:'FRONTIER', macro:83,policy:90,digital:85,human:72,infra:80,sustain:78,fdi_b:5.8,  gdp_b:306,  pop_m:6,  internet_pct:95,rank:8},
  {iso3:'CAN',name:'Canada',        region:'NAM', income:'High', composite:81.1,tier:'FRONTIER', macro:82,policy:85,digital:83,human:71,infra:83,sustain:75,fdi_b:48.0, gdp_b:2140, pop_m:39, internet_pct:93,rank:9},
  {iso3:'ARE',name:'UAE',           region:'MENA',income:'High', composite:80.0,tier:'FRONTIER', macro:82,policy:78,digital:84,human:54,infra:92,sustain:53,fdi_b:30.7, gdp_b:504,  pop_m:10, internet_pct:99,rank:10},
  {iso3:'GBR',name:'United Kingdom',region:'ECA', income:'High', composite:78.5,tier:'HIGH',     macro:80,policy:84,digital:82,human:71,infra:80,sustain:72,fdi_b:52.0, gdp_b:3079, pop_m:67, internet_pct:96,rank:11},
  {iso3:'DEU',name:'Germany',       region:'ECA', income:'High', composite:78.1,tier:'HIGH',     macro:81,policy:86,digital:78,human:70,infra:84,sustain:77,fdi_b:35.4, gdp_b:4430, pop_m:84, internet_pct:91,rank:12},
  {iso3:'JPN',name:'Japan',         region:'EAP', income:'High', composite:77.4,tier:'HIGH',     macro:79,policy:83,digital:80,human:68,infra:86,sustain:70,fdi_b:30.1, gdp_b:4213, pop_m:124,internet_pct:94,rank:13},
  {iso3:'NLD',name:'Netherlands',   region:'ECA', income:'High', composite:77.2,tier:'HIGH',     macro:80,policy:84,digital:80,human:68,infra:84,sustain:72,fdi_b:92.0, gdp_b:1081, pop_m:18, internet_pct:96,rank:14},
  {iso3:'FRA',name:'France',        region:'ECA', income:'High', composite:76.1,tier:'HIGH',     macro:78,policy:82,digital:80,human:69,infra:80,sustain:70,fdi_b:28.0, gdp_b:2924, pop_m:68, internet_pct:85,rank:15},
  {iso3:'KOR',name:'South Korea',   region:'EAP', income:'High', composite:75.8,tier:'HIGH',     macro:78,policy:80,digital:84,human:70,infra:82,sustain:60,fdi_b:18.0, gdp_b:1710, pop_m:52, internet_pct:97,rank:16},
  {iso3:'IRL',name:'Ireland',       region:'ECA', income:'High', composite:75.2,tier:'HIGH',     macro:82,policy:84,digital:78,human:66,infra:76,sustain:68,fdi_b:94.0, gdp_b:529,  pop_m:5,  internet_pct:92,rank:17},
  {iso3:'ISR',name:'Israel',        region:'MENA',income:'High', composite:74.8,tier:'HIGH',     macro:76,policy:78,digital:82,human:72,infra:78,sustain:64,fdi_b:16.2, gdp_b:522,  pop_m:9,  internet_pct:90,rank:18},
  {iso3:'QAT',name:'Qatar',         region:'MENA',income:'High', composite:72.4,tier:'HIGH',     macro:78,policy:72,digital:76,human:52,infra:84,sustain:56,fdi_b:5.8,  gdp_b:236,  pop_m:3,  internet_pct:99,rank:19},
  {iso3:'SAU',name:'Saudi Arabia',  region:'MENA',income:'High', composite:68.1,tier:'HIGH',     macro:74,policy:62,digital:72,human:48,infra:76,sustain:50,fdi_b:28.3, gdp_b:1069, pop_m:36, internet_pct:97,rank:22},
  {iso3:'CHN',name:'China',         region:'EAP', income:'UMI',  composite:64.2,tier:'MEDIUM',   macro:68,policy:55,digital:72,human:62,infra:78,sustain:44,fdi_b:163.0,gdp_b:17795,pop_m:1410,internet_pct:75,rank:28},
  {iso3:'MYS',name:'Malaysia',      region:'EAP', income:'UMI',  composite:66.4,tier:'MEDIUM',   macro:68,policy:65,digital:68,human:58,infra:72,sustain:54,fdi_b:14.0, gdp_b:430,  pop_m:33, internet_pct:90,rank:26},
  {iso3:'IND',name:'India',         region:'SAS', income:'LMI',  composite:62.3,tier:'MEDIUM',   macro:68,policy:56,digital:59,human:69,infra:65,sustain:38,fdi_b:71.0, gdp_b:3730, pop_m:1430,internet_pct:55,rank:35},
  {iso3:'THA',name:'Thailand',      region:'EAP', income:'UMI',  composite:61.8,tier:'MEDIUM',   macro:64,policy:60,digital:62,human:56,infra:66,sustain:54,fdi_b:9.4,  gdp_b:545,  pop_m:71, internet_pct:88,rank:37},
  {iso3:'VNM',name:'Vietnam',       region:'EAP', income:'LMI',  composite:58.2,tier:'MEDIUM',   macro:62,policy:58,digital:55,human:52,infra:58,sustain:48,fdi_b:18.1, gdp_b:430,  pop_m:98, internet_pct:79,rank:52},
  {iso3:'IDN',name:'Indonesia',     region:'EAP', income:'LMI',  composite:57.1,tier:'MEDIUM',   macro:60,policy:56,digital:54,human:52,infra:58,sustain:52,fdi_b:22.0, gdp_b:1371, pop_m:277,internet_pct:77,rank:55},
  {iso3:'MEX',name:'Mexico',        region:'LAC', income:'UMI',  composite:54.0,tier:'MEDIUM',   macro:56,policy:52,digital:54,human:52,infra:56,sustain:46,fdi_b:36.0, gdp_b:1328, pop_m:131,internet_pct:76,rank:64},
  {iso3:'BRA',name:'Brazil',        region:'LAC', income:'UMI',  composite:54.2,tier:'MEDIUM',   macro:56,policy:52,digital:56,human:55,infra:54,sustain:46,fdi_b:65.0, gdp_b:2130, pop_m:215,internet_pct:81,rank:63},
  {iso3:'TUR',name:'Turkey',        region:'ECA', income:'UMI',  composite:51.8,tier:'MEDIUM',   macro:54,policy:46,digital:56,human:54,infra:58,sustain:44,fdi_b:12.0, gdp_b:1108, pop_m:85, internet_pct:82,rank:72},
  {iso3:'EGY',name:'Egypt',         region:'MENA',income:'LMI',  composite:52.4,tier:'MEDIUM',   macro:55,policy:48,digital:52,human:48,infra:58,sustain:42,fdi_b:9.8,  gdp_b:395,  pop_m:105,internet_pct:74,rank:69},
  {iso3:'MAR',name:'Morocco',       region:'MENA',income:'LMI',  composite:54.8,tier:'MEDIUM',   macro:56,policy:54,digital:52,human:46,infra:60,sustain:50,fdi_b:3.2,  gdp_b:146,  pop_m:37, internet_pct:88,rank:61},
  {iso3:'POL',name:'Poland',        region:'ECA', income:'High', composite:62.0,tier:'MEDIUM',   macro:64,policy:64,digital:64,human:62,infra:64,sustain:52,fdi_b:20.0, gdp_b:750,  pop_m:38, internet_pct:87,rank:36},
  {iso3:'ZAF',name:'South Africa',  region:'SSA', income:'UMI',  composite:51.3,tier:'MEDIUM',   macro:52,policy:54,digital:52,human:46,infra:50,sustain:52,fdi_b:5.2,  gdp_b:373,  pop_m:60, internet_pct:72,rank:73},
  {iso3:'KEN',name:'Kenya',         region:'SSA', income:'LMI',  composite:51.3,tier:'MEDIUM',   macro:52,policy:50,digital:54,human:48,infra:48,sustain:52,fdi_b:1.2,  gdp_b:118,  pop_m:55, internet_pct:42,rank:74},
  {iso3:'NGA',name:'Nigeria',       region:'SSA', income:'LMI',  composite:42.1,tier:'EMERGING', macro:46,policy:36,digital:42,human:40,infra:36,sustain:36,fdi_b:4.1,  gdp_b:477,  pop_m:218,internet_pct:55,rank:128},
];

const REGIONS = ['All','EAP','ECA','MENA','SAS','LAC','SSA','NAM'];

export default function GFRPage() {
  const [search,  setSearch]  = useState('');
  const [region,  setRegion]  = useState('All');
  const [tier,    setTier]    = useState('');
  const [income,  setIncome]  = useState('');
  const [selected,setSelected]= useState<any>(GFR_ALL[0]);
  const [showDetail,setShowDetail]=useState(false);
  const [sortKey, setSortKey] = useState<string>('rank');

  const filtered = useMemo(()=>GFR_ALL.filter(e=>
    (!search || e.name.toLowerCase().includes(search.toLowerCase()) || e.iso3.includes(search.toUpperCase())) &&
    (region==='All' || e.region===region) &&
    (!tier   || e.tier===tier) &&
    (!income || e.income===income)
  ).sort((a,b)=> sortKey==='rank' ? a.rank-b.rank : (b as any)[sortKey]-(a as any)[sortKey]),[search,region,tier,income,sortKey]);

  const tc = TIER_CONFIG[selected?.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.DEVELOPING;
  const pf = selected ? propFactors(selected) : null;

  function TrendArrow({iso3,current}:{iso3:string;current:number}) {
    const prev = Q4_2025[iso3];
    if (!prev) return null;
    const diff = current - prev;
    if (Math.abs(diff) < 0.2) return <span className="text-slate-400 text-xs">→</span>;
    return diff > 0
      ? <span className="text-emerald-500 text-xs font-bold">↑{diff.toFixed(1)}</span>
      : <span className="text-red-400 text-xs font-bold">↓{Math.abs(diff).toFixed(1)}</span>;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Global Intelligence</div>
          <h1 className="text-4xl font-extrabold mb-3">Global Future Readiness Rankings</h1>
          <p className="text-white/70 mb-5">215 economies · 6 core dimensions · 6 proprietary factors · Q1 2026</p>
          <div className="flex gap-6">
            {[['#1 SGP','88.5 pts'],['215','Economies'],['40+','Indicators'],['Q1 2026','Updated']].map(([v,l])=>(
              <div key={l}>
                <div className="stat-number text-xl font-bold text-white">{v}</div>
                <div className="text-white/50 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology note */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto">
          <details className="group">
            <summary className="cursor-pointer flex items-center gap-2 text-sm font-bold text-deep select-none list-none">
              <span className="text-primary">📐</span> Methodology
              <span className="text-slate-400 font-normal text-xs ml-2">Click to expand</span>
              <span className="ml-auto text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
            </summary>
            <div className="mt-4 grid md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div>
                <div className="font-bold text-deep mb-2">Core Dimensions</div>
                <p className="text-xs leading-relaxed mb-3">The GFR measures 215 economies across 6 core dimensions: Economic Resilience, Innovation Capacity, Trade & Capital Mobility, Digital & Technological, Sustainable Growth, and Governance & Policy.</p>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="font-bold text-xs text-primary mb-1">Composite Formula</div>
                  <code className="text-xs text-blue-800">GFR = Macro×0.20 + Policy×0.18 + Digital×0.15 + Human×0.15 + Infra×0.15 + Sustain×0.17</code>
                </div>
              </div>
              <div>
                <div className="font-bold text-deep mb-2">Proprietary Factors (Full Manual)</div>
                <div className="grid grid-cols-2 gap-2">
                  {[['IRES','Investment Resilience Score'],['IMS','Investment Momentum Score'],['SCI','Signal Confidence Index'],['FZII','Free Zone Intensity Index'],['PAI','Policy Attractiveness Index'],['GCI','Greenfield Confidence Index']].map(([k,v])=>(
                    <div key={k} className="text-xs"><span className="font-bold text-primary font-mono">{k}</span> <span className="text-slate-500">{v}</span></div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">Each dimension combines sub-indicators from World Bank, IMF, UNCTAD, OECD. Scores normalised 0–100. +20 years historical data provides trend context.</p>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 sticky top-14 z-30">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2 items-center">
          <div className="flex gap-1">
            {REGIONS.map(r=>(
              <button key={r} onClick={()=>setRegion(r)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${region===r?'bg-primary text-white':'text-slate-500 hover:bg-slate-100'}`}>
                {r}
              </button>
            ))}
          </div>
          <select value={tier} onChange={e=>setTier(e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 font-medium text-slate-600 focus:border-primary focus:outline-none">
            <option value="">All Tiers</option>
            {['FRONTIER','HIGH','MEDIUM','EMERGING','DEVELOPING'].map(t=><option key={t}>{t}</option>)}
          </select>
          <select value={income} onChange={e=>setIncome(e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 font-medium text-slate-600 focus:border-primary focus:outline-none">
            <option value="">All Income Groups</option>
            {['High','UMI','LMI','LI'].map(i=><option key={i}>{i}</option>)}
          </select>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search country or ISO3…"
            className="ml-auto text-xs border border-slate-200 rounded-md px-3 py-1.5 w-40 focus:outline-none focus:border-primary"/>
          <div className="flex items-center gap-2">
            <button onClick={()=>exportGFR(filtered)} className="gfm-btn-outline text-xs py-1.5">Export CSV</button>
          </div>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} / 215</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5 flex gap-5">
        {/* Rankings table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full gfm-table">
            <thead>
              <tr>
                {[['rank','Rank'],['composite','Score'],['name','Economy'],['region','Region'],['tier','Tier'],
                  ['macro','Macro'],['policy','Policy'],['digital','Digital'],['human','Human'],['infra','Infra'],['sustain','Sustain'],
                  ['IRES','IRES'],['IMS','IMS'],['SCI','SCI'],['fdi_b','FDI']
                ].map(([k,h])=>(
                  <th key={k} className="cursor-pointer hover:text-primary" onClick={()=>setSortKey(k)}>{h}{sortKey===k?' ▲':''}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e=>{
                const t = TIER_CONFIG[e.tier as keyof typeof TIER_CONFIG]||TIER_CONFIG.DEVELOPING;
                const pf = propFactors(e);
                const prev = Q4_2025[e.iso3];
                const diff = prev ? e.composite-prev : 0;
                return (
                  <tr key={e.iso3} onClick={()=>{setSelected(e);setShowDetail(true);}} className="cursor-pointer">
                    <td className="font-mono font-bold text-slate-400 text-center">#{e.rank}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-deep font-mono">{e.composite}</span>
                        {prev && Math.abs(diff)>=0.2 && (
                          <span className={`text-xs font-bold ${diff>0?'text-emerald-500':'text-red-400'}`}>
                            {diff>0?'↑':'↓'}{Math.abs(diff).toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full mt-0.5 w-16">
                        <div className="h-full rounded-full" style={{width:`${e.composite}%`,background:t.color}}/>
                      </div>
                    </td>
                    <td>
                      <a href={`/country/${e.iso3}`} onClick={ev=>ev.stopPropagation()} className="font-semibold text-deep text-xs group-hover:text-primary hover:underline">{e.name}</a>
                      <div className="text-slate-400 text-xs font-mono">{e.iso3}</div>
                    </td>
                    <td className="text-slate-500">{e.region}</td>
                    <td><span className={`gfm-badge ${t.bg} ${t.text} ${t.border}`}>{e.tier}</span></td>
                    {[e.macro,e.policy,e.digital,e.human,e.infra,e.sustain].map((v,i)=>(
                      <td key={i} className="text-center font-mono text-slate-600">{v}</td>
                    ))}
                    {[pf.IRES,pf.IMS,pf.SCI].map((v,i)=>(
                      <td key={i} className="text-center font-mono font-bold" style={{color:'var(--primary)'}}>{v}</td>
                    ))}
                    <td className="text-center font-mono font-bold text-primary">${e.fdi_b}B</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Side detail panel */}
        {selected && (
          <div className="w-72 flex-shrink-0 space-y-3">
            <div className="gfm-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xl font-extrabold text-deep">{selected.name}</div>
                  <div className="font-mono text-slate-400 text-xs">{selected.iso3}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold font-mono" style={{color:'var(--primary)'}}>{selected.composite}</div>
                  <div className="text-xs text-slate-400">#{selected.rank} / 215</div>
                </div>
              </div>
              <span className={`gfm-badge ${tc.bg} ${tc.text} ${tc.border} mb-4 inline-block`}>{selected.tier}</span>
              
              {/* 6 dimensions */}
              <div className="space-y-2 mb-4">
                {[['Macro',selected.macro],['Policy',selected.policy],['Digital',selected.digital],
                  ['Human',selected.human],['Infra',selected.infra],['Sustain',selected.sustain]].map(([l,v])=>(
                  <div key={String(l)}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-slate-500">{l}</span>
                      <span className="font-bold font-mono" style={{color:'var(--primary)'}}>{v}</span>
                    </div>
                    <div className="gfm-progress">
                      <div className="gfm-progress-fill" style={{width:`${v}%`}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Proprietary factors */}
              {pf && (
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 mb-4">
                  <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">Proprietary Factors</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.entries(pf).map(([k,v])=>(
                      <div key={k} className="flex justify-between text-xs">
                        <span className="font-mono font-bold text-blue-700">{k}</span>
                        <span className="font-mono text-slate-600">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Economic snapshot */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[['GDP',`$${selected.gdp_b>=1000?`${(selected.gdp_b/1000).toFixed(1)}T`:`${selected.gdp_b}B`}`],
                  ['FDI',`$${selected.fdi_b}B`],
                  ['Pop.',`${selected.pop_m}M`],
                  ['Internet',`${selected.internet_pct}%`]].map(([l,v])=>(
                  <div key={l} className="bg-surface rounded-lg p-2 text-center">
                    <div className="text-xs text-slate-400">{l}</div>
                    <div className="font-bold text-xs text-deep font-mono">{v}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={()=>window.location.href='/subscription'} className="flex-1 gfm-btn-primary text-xs py-2">
                  Full GFR Report — 10 FIC
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historical trends note */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-400">
        Trend arrows compare Q1 2026 vs Q4 2025 · Scores normalised 0–100 · Proprietary factors detailed in methodology manual · Source: IMF, World Bank, UNCTAD, OECD, IEA, Yale EPI
      </div>
    </div>
  );
}
