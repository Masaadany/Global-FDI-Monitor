'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// /benchmarking PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const BENCHMARK_ECONOMIES = [
  {iso3:'SGP',flag:'🇸🇬',name:'Singapore',   gfr:88.5,infra:94,digital:87,incentive:93,labour:63,energy:62,fdi_b:148.0,rank:1},
  {iso3:'IRL',flag:'🇮🇪',name:'Ireland',     gfr:78.5,infra:78,digital:82,incentive:91,labour:70,energy:58,fdi_b:98.2, rank:6},
  {iso3:'ARE',flag:'🇦🇪',name:'UAE',         gfr:80.0,infra:92,digital:84,incentive:94,labour:54,energy:53,fdi_b:30.7, rank:8},
  {iso3:'IND',flag:'🇮🇳',name:'India',       gfr:62.3,infra:65,digital:59,incentive:72,labour:69,energy:38,fdi_b:71.4, rank:22},
  {iso3:'DEU',flag:'🇩🇪',name:'Germany',     gfr:81.5,infra:84,digital:78,incentive:76,labour:48,energy:77,fdi_b:22.3, rank:4},
  {iso3:'VNM',flag:'🇻🇳',name:'Vietnam',     gfr:58.2,infra:58,digital:48,incentive:68,labour:48,energy:52,fdi_b:18.2, rank:28},
  {iso3:'KEN',flag:'🇰🇪',name:'Kenya',       gfr:54.8,infra:42,digital:40,incentive:55,labour:40,energy:75,fdi_b:0.9,  rank:31},
];

const DIMENSIONS = [
  {key:'gfr',       label:'GFR Score',   max:100, color:'bg-blue-600'},
  {key:'infra',     label:'Infrastructure',max:100,color:'bg-violet-500'},
  {key:'digital',   label:'Digital',     max:100, color:'bg-cyan-500'},
  {key:'incentive', label:'Incentives',  max:100, color:'bg-amber-500'},
  {key:'labour',    label:'Labour',      max:100, color:'bg-emerald-500'},
  {key:'energy',    label:'Energy Trans.',max:100,color:'bg-lime-500'},
];

export function BenchmarkingPage() {
  const [selected, setSelected] = useState<string[]>(['ARE','SGP','IRL','IND']);
  const [dimFilter, setDimFilter] = useState('gfr');

  function toggleEco(iso3: string) {
    setSelected(prev => prev.includes(iso3)
      ? prev.filter(x => x!==iso3)
      : prev.length < 5 ? [...prev,iso3] : prev);
  }

  const shown = BENCHMARK_ECONOMIES.filter(e => selected.includes(e.iso3));
  const maxVal = Math.max(...shown.map(e => (e as any)[dimFilter] ?? 0), 1);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Economy Benchmarking</span>
        <span className="text-xs text-slate-400">Compare up to 5 economies across 6 investment dimensions</span>
        <div className="flex gap-1.5 ml-4 flex-wrap">
          {BENCHMARK_ECONOMIES.map(e => (
            <button key={e.iso3} onClick={() => toggleEco(e.iso3)}
              className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selected.includes(e.iso3) ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}>{e.flag} {e.iso3}</button>
          ))}
        </div>
        <button className="ml-auto bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          ↓ Export Comparison
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Dimension tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {DIMENSIONS.map(d => (
            <button key={d.key} onClick={() => setDimFilter(d.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dimFilter===d.key ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}>{d.label}</button>
          ))}
        </div>

        {/* Comparative bar chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-bold text-sm text-[#0A2540] mb-5">
            {DIMENSIONS.find(d=>d.key===dimFilter)?.label} Comparison
          </div>
          <div className="space-y-4">
            {shown.sort((a,b) => ((b as any)[dimFilter]??0) - ((a as any)[dimFilter]??0)).map((eco,i) => {
              const val = (eco as any)[dimFilter] ?? 0;
              const dim = DIMENSIONS.find(d=>d.key===dimFilter)!;
              return (
                <div key={eco.iso3} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-32 flex-shrink-0">
                    <span className="text-lg">{eco.flag}</span>
                    <div>
                      <div className="text-xs font-bold text-[#0A2540]">{eco.name}</div>
                      <div className="text-xs text-slate-400">#{eco.rank} GFR</div>
                    </div>
                  </div>
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className={`h-full ${dim.color} rounded-full transition-all duration-500`}
                      style={{width:`${(val/maxVal)*100}%`}}/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-white mix-blend-difference">{val}</span>
                  </div>
                  {i === 0 && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex-shrink-0">Leader</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-dimension spider table */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 overflow-x-auto">
          <div className="font-bold text-sm text-[#0A2540] mb-4">Full Dimension Comparison Matrix</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-2 text-slate-400 font-bold uppercase tracking-wide">Economy</th>
                {DIMENSIONS.map(d => (
                  <th key={d.key} className="text-center pb-2 text-slate-400 font-bold uppercase tracking-wide px-2">
                    {d.label.split(' ')[0]}
                  </th>
                ))}
                <th className="text-center pb-2 text-slate-400 font-bold uppercase tracking-wide px-2">FDI Inflows</th>
              </tr>
            </thead>
            <tbody>
              {shown.sort((a,b)=>b.gfr-a.gfr).map(eco => (
                <tr key={eco.iso3} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 flex items-center gap-2">
                    <span className="text-base">{eco.flag}</span>
                    <span className="font-bold text-[#0A2540]">{eco.name}</span>
                  </td>
                  {DIMENSIONS.map(d => {
                    const val = (eco as any)[d.key] ?? 0;
                    const isTop = shown.every(e => val >= ((e as any)[d.key]??0));
                    return (
                      <td key={d.key} className="text-center py-2.5 px-2">
                        <span className={`font-bold ${isTop ? 'text-emerald-600' : 'text-slate-600'}`}>{val}</span>
                      </td>
                    );
                  })}
                  <td className="text-center py-2.5 px-2 font-bold text-blue-600">${eco.fdi_b.toFixed(1)}B</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-slate-400 mt-2 italic">Green = leader for that dimension. All scores 0-100 unless noted.</div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// /scenario-planner PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const SCENARIO_VARIABLES = [
  {id:'gdp_growth',      label:'GDP Growth Rate (%)',       min:-5,  max:15, default:3.5},
  {id:'fdi_growth',      label:'FDI Growth Rate (%)',       min:-20, max:30, default:8.0},
  {id:'gfr_change',      label:'GFR Score Change (pts)',    min:-10, max:10, default:2.0},
  {id:'inflation',       label:'Inflation Rate (%)',        min:0,   max:20, default:3.2},
  {id:'exchange_rate',   label:'FX Rate Change vs USD (%)' ,min:-30, max:30, default:0.0},
  {id:'policy_openness', label:'Policy Openness Change',    min:-3,  max:3,  default:0.5},
];

export function ScenarioPlannerPage() {
  const [eco, setEco] = useState('ARE');
  const [vars, setVars] = useState(() => Object.fromEntries(SCENARIO_VARIABLES.map(v => [v.id, v.default])));
  const [scenarioName, setScenarioName] = useState('Custom Scenario');

  const baseFDI = eco === 'ARE' ? 30.7 : eco === 'SAU' ? 22.4 : eco === 'IND' ? 71.4 : 15.0;
  const fdiImpact = baseFDI * (1 + (vars.fdi_growth || 0)/100 + (vars.gfr_change || 0)*0.02 + (vars.policy_openness || 0)*0.05);
  const fdiChange = fdiImpact - baseFDI;
  const sentiment = fdiImpact > baseFDI * 1.1 ? 'POSITIVE' : fdiImpact < baseFDI * 0.9 ? 'NEGATIVE' : 'NEUTRAL';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Scenario Planner</span>
        <span className="text-xs text-slate-400">Stress-test investment decisions across custom economic scenarios</span>
        <select className="ml-4 border border-slate-200 rounded-lg text-xs px-3 py-2"
          value={eco} onChange={e=>setEco(e.target.value)}>
          {[['ARE','UAE'],['SAU','Saudi Arabia'],['IND','India'],['DEU','Germany'],['SGP','Singapore']].map(([v,l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button className="ml-auto bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Scenario — 3 FIC
        </button>
      </div>

      <div className="p-5 grid grid-cols-[1fr_300px] gap-5">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <input className="flex-1 border border-slate-200 rounded-lg text-sm px-3 py-2 font-semibold focus:outline-none focus:border-blue-400"
                value={scenarioName} onChange={e => setScenarioName(e.target.value)}/>
              <span className="text-xs text-slate-400">for {eco}</span>
            </div>
            {SCENARIO_VARIABLES.map(v => (
              <div key={v.id} className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">{v.label}</label>
                  <span className="text-sm font-black text-blue-600">
                    {(vars[v.id] >= 0 ? '+' : '')}{vars[v.id]?.toFixed(1)}
                    {v.id.includes('pct') || v.id.includes('rate') || v.id.includes('growth') || v.id.includes('inflation') || v.id.includes('exchange') ? '%' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-6 text-right">{v.min}</span>
                  <input type="range" min={v.min} max={v.max} step={0.1}
                    value={vars[v.id] ?? v.default}
                    onChange={e => setVars(prev => ({...prev,[v.id]:parseFloat(e.target.value)}))}
                    className="flex-1 h-1.5 accent-blue-600"/>
                  <span className="text-xs text-slate-400 w-6">{v.max}</span>
                </div>
                <div className="h-1 rounded-full mt-1 overflow-hidden bg-slate-100">
                  <div className={`h-full rounded-full transition-all ${
                    (vars[v.id]??0) > 0 ? 'bg-emerald-500' : (vars[v.id]??0) < 0 ? 'bg-red-400' : 'bg-slate-400'
                  }`} style={{width:`${Math.abs(((vars[v.id]??0)-v.min)/(v.max-v.min))*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario output */}
        <div className="space-y-4">
          <div className={`rounded-xl p-4 border-2 ${
            sentiment==='POSITIVE' ? 'border-emerald-300 bg-emerald-50' :
            sentiment==='NEGATIVE' ? 'border-red-300 bg-red-50' :
            'border-slate-200 bg-slate-50'
          }`}>
            <div className="text-xs font-bold uppercase tracking-wide mb-2 text-slate-500">Scenario Outlook</div>
            <div className={`text-2xl font-black mb-1 ${
              sentiment==='POSITIVE' ? 'text-emerald-600' :
              sentiment==='NEGATIVE' ? 'text-red-600' : 'text-slate-600'
            }`}>{sentiment}</div>
            <div className="font-bold text-sm text-[#0A2540]">Projected FDI Inflows</div>
            <div className="text-3xl font-black text-blue-600 mt-1">${fdiImpact.toFixed(1)}B</div>
            <div className={`text-sm font-semibold mt-1 ${fdiChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {fdiChange >= 0 ? '+' : ''}{fdiChange.toFixed(1)}B vs baseline
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">Variable Impact Summary</div>
            {SCENARIO_VARIABLES.map(v => {
              const val = vars[v.id] ?? 0;
              const neutral = v.default;
              const delta = val - neutral;
              return (
                <div key={v.id} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs text-slate-500 flex-1 truncate">{v.label.split(' ').slice(0,3).join(' ')}</span>
                  <span className={`text-xs font-bold w-14 text-right ${
                    delta > 0.1 ? 'text-emerald-600' : delta < -0.1 ? 'text-red-500' : 'text-slate-400'
                  }`}>
                    {delta > 0.1 ? '▲' : delta < -0.1 ? '▼' : '–'} {Math.abs(val).toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-2">Predefined Scenarios</div>
            {[
              {name:'Base Case',       desc:'Current trajectory'},
              {name:'Optimistic 2026', desc:'Reform + global growth'},
              {name:'Stress Test',     desc:'Geopolitical shock'},
              {name:'Vision 2030',     desc:'Full reform delivery'},
            ].map(s => (
              <button key={s.name}
                className="w-full text-left flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors text-xs border-b border-slate-50 last:border-0">
                <div>
                  <div className="font-semibold text-slate-700">{s.name}</div>
                  <div className="text-slate-400">{s.desc}</div>
                </div>
                <span className="ml-auto text-blue-500 font-bold">Load →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// /corridor-intelligence PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const CORRIDORS = [
  {from:'USA',to:'ARE',flag_f:'🇺🇸',flag_t:'🇦🇪',trade_b:30.3,fdi_b:8.2,  bit:true, signals_7d:42,trend:'↑',score:82},
  {from:'DEU',to:'CHN',flag_f:'🇩🇪',flag_t:'🇨🇳',trade_b:259.8,fdi_b:14.2,bit:true, signals_7d:38,trend:'↓',score:65},
  {from:'USA',to:'IND',flag_f:'🇺🇸',flag_t:'🇮🇳',trade_b:128.3,fdi_b:28.2,bit:true, signals_7d:68,trend:'↑',score:78},
  {from:'CHN',to:'VNM',flag_f:'🇨🇳',flag_t:'🇻🇳',trade_b:199.2,fdi_b:22.1,bit:true, signals_7d:28,trend:'↑',score:72},
  {from:'ARE',to:'IND',flag_f:'🇦🇪',flag_t:'🇮🇳',trade_b:73.9, fdi_b:12.4,bit:true, signals_7d:35,trend:'↑',score:74},
  {from:'GBR',to:'ARE',flag_f:'🇬🇧',flag_t:'🇦🇪',trade_b:24.2, fdi_b:5.2,  bit:true, signals_7d:22,trend:'↑',score:70},
  {from:'SAU',to:'CHN',flag_f:'🇸🇦',flag_t:'🇨🇳',trade_b:111.5,fdi_b:4.8,  bit:true, signals_7d:18,trend:'↑',score:68},
  {from:'USA',to:'SAU',flag_f:'🇺🇸',flag_t:'🇸🇦',trade_b:34.7, fdi_b:7.4,  bit:true, signals_7d:31,trend:'↑',score:75},
];

export function CorridorIntelligencePage() {
  const [from, setFrom] = useState('');
  const [to, setTo]     = useState('');
  const [sortBy, setSort] = useState<'score'|'trade'|'fdi'|'signals'>('score');

  const filtered = CORRIDORS.filter(c =>
    (!from || c.from === from) &&
    (!to   || c.to === to)
  ).sort((a,b) => {
    if (sortBy === 'score')   return b.score - a.score;
    if (sortBy === 'trade')   return b.trade_b - a.trade_b;
    if (sortBy === 'fdi')     return b.fdi_b - a.fdi_b;
    if (sortBy === 'signals') return b.signals_7d - a.signals_7d;
    return 0;
  });

  const allIso3 = [...new Set(CORRIDORS.flatMap(c => [c.from, c.to]))];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Corridor Intelligence</span>
        <select className="border border-slate-200 rounded-lg text-xs px-3 py-2 ml-4"
          value={from} onChange={e=>setFrom(e.target.value)}>
          <option value="">From: All Source Markets</option>
          {allIso3.map(iso => <option key={iso} value={iso}>{iso}</option>)}
        </select>
        <select className="border border-slate-200 rounded-lg text-xs px-3 py-2"
          value={to} onChange={e=>setTo(e.target.value)}>
          <option value="">To: All Destinations</option>
          {allIso3.map(iso => <option key={iso} value={iso}>{iso}</option>)}
        </select>
        <div className="flex gap-1.5">
          {(['score','trade','fdi','signals'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${sortBy===s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'}`}>
              Sort: {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {filtered.map(cor => (
            <div key={`${cor.from}-${cor.to}`}
              className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                {/* Corridor header */}
                <div className="flex items-center gap-2 flex-shrink-0 w-52">
                  <span className="text-2xl">{cor.flag_f}</span>
                  <div className="text-center">
                    <div className="text-xs font-black text-slate-400">{cor.from}</div>
                    <div className="text-lg">→</div>
                    <div className="text-xs font-black text-blue-600">{cor.to}</div>
                  </div>
                  <span className="text-2xl">{cor.flag_t}</span>
                </div>

                {/* Metrics */}
                <div className="flex-1 grid grid-cols-4 gap-3">
                  {[
                    {label:'Trade Volume',  value:`$${cor.trade_b.toFixed(1)}B`, color:'text-blue-600'},
                    {label:'FDI Corridor',  value:`$${cor.fdi_b.toFixed(1)}B`,   color:'text-violet-600'},
                    {label:'Signals (7d)',  value:cor.signals_7d,                 color:'text-emerald-600'},
                    {label:'Corridor Score',value:cor.score,                      color:'text-amber-600'},
                  ].map(m => (
                    <div key={m.label} className="text-center">
                      <div className="text-xs text-slate-400 mb-0.5">{m.label}</div>
                      <div className={`text-base font-black ${m.color}`}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Status badges */}
                <div className="flex gap-2 flex-shrink-0">
                  {cor.bit && (
                    <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded font-semibold">BIT ✓</span>
                  )}
                  <span className={`text-xs font-black px-2 py-0.5 rounded ${
                    cor.trend==='↑' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  }`}>{cor.trend} Trend</span>
                </div>

                {/* Score bar */}
                <div className="w-20 flex-shrink-0">
                  <div className="text-xs text-slate-400 text-center mb-1">Score</div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width:`${cor.score}%`}}/>
                  </div>
                  <div className="text-center text-xs font-black text-blue-600 mt-0.5">{cor.score}</div>
                </div>

                <button className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors font-semibold flex-shrink-0">
                  Full Analysis →
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <div className="text-3xl mb-3">🌐</div>
              <div className="font-semibold">No corridors match your filter</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Default export for Next.js routing
export default BenchmarkingPage;
