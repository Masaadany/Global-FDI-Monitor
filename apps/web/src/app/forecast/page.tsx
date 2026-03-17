'use client';
import { useState } from 'react';

const ECONOMIES = [
  {iso3:'ARE',name:'United Arab Emirates',flag:'🇦🇪'},
  {iso3:'SAU',name:'Saudi Arabia',flag:'🇸🇦'},
  {iso3:'IND',name:'India',flag:'🇮🇳'},
  {iso3:'DEU',name:'Germany',flag:'🇩🇪'},
  {iso3:'SGP',name:'Singapore',flag:'🇸🇬'},
  {iso3:'USA',name:'United States',flag:'🇺🇸'},
  {iso3:'GBR',name:'United Kingdom',flag:'🇬🇧'},
];

const HORIZONS = ['Nowcast','1-Month','3-Month','6-Month','1-Year','2-Year','3-Year','5-Year','10-Year'];

const FORECAST_DATA: Record<string, Record<string, {base:number,opt:number,stress:number,conf:number}>> = {
  ARE: {
    'Nowcast':  {base:7.8,   opt:8.2,  stress:7.1,  conf:0.97},
    '1-Month':  {base:7.9,   opt:8.4,  stress:7.0,  conf:0.96},
    '3-Month':  {base:8.1,   opt:8.7,  stress:6.9,  conf:0.94},
    '6-Month':  {base:8.8,   opt:9.5,  stress:7.2,  conf:0.92},
    '1-Year':   {base:31.4,  opt:38.9, stress:22.7, conf:0.89},
    '2-Year':   {base:35.8,  opt:46.2, stress:24.1, conf:0.84},
    '3-Year':   {base:40.2,  opt:54.8, stress:26.3, conf:0.78},
    '5-Year':   {base:52.1,  opt:78.4, stress:29.8, conf:0.70},
    '10-Year':  {base:107.1, opt:164.8,stress:59.2, conf:0.62},
  },
  IND: {
    'Nowcast':  {base:10.2,  opt:10.8, stress:9.4,  conf:0.96},
    '1-Year':   {base:42.8,  opt:52.1, stress:31.5, conf:0.88},
    '3-Year':   {base:58.4,  opt:78.2, stress:38.9, conf:0.77},
    '5-Year':   {base:82.3,  opt:118.4,stress:52.1, conf:0.69},
    '10-Year':  {base:158.7, opt:248.3,stress:88.4, conf:0.58},
  },
};

const RISK_FACTORS = {
  ARE: [
    {label:'Geopolitical risk',  impact:'Medium', dir:'-', color:'#F59E0B'},
    {label:'Oil price trajectory',impact:'Medium',dir:'+', color:'#F59E0B'},
    {label:'GFR reform momentum',impact:'High',   dir:'+', color:'#10B981'},
    {label:'Pillar Two alignment',impact:'Low',   dir:'~', color:'#60A5FA'},
    {label:'USD strength',        impact:'Medium', dir:'-', color:'#F59E0B'},
  ],
  IND: [
    {label:'Political stability',  impact:'Medium', dir:'+', color:'#10B981'},
    {label:'Infrastructure spend', impact:'High',   dir:'+', color:'#10B981'},
    {label:'Rupee volatility',     impact:'Low',    dir:'-', color:'#60A5FA'},
    {label:'PLI scheme uptake',    impact:'High',   dir:'+', color:'#10B981'},
    {label:'US-India tech ties',   impact:'High',   dir:'+', color:'#10B981'},
  ],
};

function MiniChart({data, horizon}: {data: Record<string,{base:number,opt:number,stress:number}>, horizon: string}) {
  // Show 5 points: historical + 4 forecast
  const historicalYears = ['2022A','2023A','2024A','2025E'];
  const eco = data;
  const hist = [22.4,26.1,28.4,30.1];

  const baseVal = eco[horizon]?.base ?? 0;
  const isAnnual = !horizon.includes('Month') && !horizon.includes('cast');
  const allPoints = isAnnual ? [...hist, baseVal] : [baseVal];

  const max = Math.max(...allPoints, eco[horizon]?.opt ?? 0) * 1.1;
  const min = Math.min(...allPoints, eco[horizon]?.stress ?? 0) * 0.9;
  const range = max - min || 1;
  const W = 280, H = 100;
  const toY = (v: number) => H - ((v - min) / range) * (H - 12) - 6;

  if (!isAnnual) {
    return (
      <div className="flex items-center justify-center h-24 text-2xl font-black text-blue-600">
        ${baseVal.toFixed(1)}B
        <span className="text-xs text-slate-400 ml-2 font-normal">quarterly</span>
      </div>
    );
  }

  const labels = [...historicalYears, horizon];
  const allVals = [...hist, baseVal];
  const pts = allVals.map((v, i) => `${(i / (allVals.length-1)) * W},${toY(v)}`).join(' ');

  // Fan: opt and stress for forecast point only
  const lastX = W;
  const baseY  = toY(baseVal);
  const optY   = toY(eco[horizon]?.opt ?? baseVal);
  const stressY = toY(eco[horizon]?.stress ?? baseVal);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height:H}}>
      {/* Grid */}
      {[0.25,0.5,0.75].map(p => (
        <line key={p} x1={0} y1={H*p} x2={W} y2={H*p} stroke="#F1F5F9" strokeWidth="0.8"/>
      ))}
      {/* Fan area */}
      <polygon
        points={`${W*(allVals.length-2)/(allVals.length-1)},${toY(hist[hist.length-1])} ${lastX},${optY} ${lastX},${stressY}`}
        fill="rgba(29,78,216,0.08)" />
      {/* Opt line */}
      <line x1={W*(allVals.length-2)/(allVals.length-1)} y1={toY(hist[hist.length-1])}
            x2={lastX} y2={optY} stroke="#10B981" strokeWidth="1.2" strokeDasharray="4,2"/>
      {/* Stress line */}
      <line x1={W*(allVals.length-2)/(allVals.length-1)} y1={toY(hist[hist.length-1])}
            x2={lastX} y2={stressY} stroke="#EF4444" strokeWidth="1.2" strokeDasharray="3,2"/>
      {/* Base line */}
      <polyline points={pts} fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinejoin="round"/>
      {/* Dots */}
      {allVals.map((v,i) => (
        <circle key={i} cx={(i/(allVals.length-1))*W} cy={toY(v)} r="3"
          fill={i === allVals.length-1 ? '#1D4ED8' : '#94A3B8'}/>
      ))}
      {/* Labels */}
      {labels.map((l,i) => (
        <text key={i} x={(i/(labels.length-1))*W} y={H-1}
          textAnchor={i===0?'start':i===labels.length-1?'end':'middle'}
          fontSize="8" fill="#94A3B8">{l}</text>
      ))}
    </svg>
  );
}

export default function ForecastPage() {
  const [eco, setEco]       = useState('ARE');
  const [variable, setVar]  = useState('FDI_INFLOWS');
  const [horizon, setHor]   = useState('1-Year');

  const ecoData  = FORECAST_DATA[eco] ?? FORECAST_DATA['ARE'];
  const current  = ecoData[horizon] ?? ecoData['1-Year'];
  const ecoMeta  = ECONOMIES.find(e => e.iso3 === eco)!;
  const risks    = (RISK_FACTORS as any)[eco] ?? RISK_FACTORS['ARE'];

  const conf = current.conf;
  const label = variable === 'FDI_INFLOWS' ? 'FDI Inflows (USD B)' : 'GDP Growth (%)';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Filter bar */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Economy:</span>
        <select className="border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-400"
          value={eco} onChange={e => setEco(e.target.value)}>
          {ECONOMIES.map(e => <option key={e.iso3} value={e.iso3}>{e.flag} {e.name}</option>)}
        </select>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-2">Variable:</span>
        {[['FDI_INFLOWS','FDI Inflows'],['GDP_GROWTH','GDP Growth'],['TRADE_FLOWS','Trade Flows']].map(([v,l]) => (
          <button key={v} onClick={() => setVar(v)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              variable===v ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
            }`}>{l}</button>
        ))}
        <button className="ml-auto bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Download Data Pack — 5 FIC
        </button>
      </div>

      <div className="p-5">
        {/* Horizon tabs */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {HORIZONS.map(h => (
            <button key={h} onClick={() => setHor(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                horizon===h ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}>{h}</button>
          ))}
        </div>

        {/* Scenario cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border-t-2 border-blue-500 border border-slate-100 p-4">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Baseline · P: 55%</div>
            <div className="text-3xl font-black text-blue-600 mb-1">${current.base.toFixed(1)}B</div>
            <div className="text-xs text-slate-400 leading-relaxed">Central forecast. Current policy trajectory, steady GFR reform momentum, stable signal conversion rate.</div>
          </div>
          <div className="bg-white rounded-xl border-t-2 border-emerald-500 border border-slate-100 p-4">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Optimistic · P: 25%</div>
            <div className="text-3xl font-black text-emerald-600 mb-1">${current.opt.toFixed(1)}B</div>
            <div className="text-xs text-slate-400 leading-relaxed">Accelerated reform delivery, strong global growth, high investment signal conversion and sectoral expansion.</div>
          </div>
          <div className="bg-white rounded-xl border-t-2 border-red-500 border border-slate-100 p-4">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Stress · P: 20%</div>
            <div className="text-3xl font-black text-red-600 mb-1">${current.stress.toFixed(1)}B</div>
            <div className="text-xs text-slate-400 leading-relaxed">Geopolitical disruption, global growth slowdown, increased policy uncertainty and reduced investor confidence.</div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-4">
          {/* Main chart */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-black text-sm text-[#0A2540]">
                    {ecoMeta.flag} {ecoMeta.name} — {label}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {horizon} forecast · 3 scenarios · 90% confidence interval
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-6 h-0.5 bg-blue-600 inline-block rounded"/>Baseline
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-6 h-0 border-t border-dashed border-emerald-500 inline-block"/>Optimistic
                  </span>
                  <span className="flex items-center gap-1.5 text-red-500">
                    <span className="w-6 h-0 border-t border-dashed border-red-400 inline-block"/>Stress
                  </span>
                </div>
              </div>
              <MiniChart data={ecoData} horizon={horizon}/>
            </div>

            {/* Confidence metrics */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="font-bold text-xs text-[#0A2540] mb-4">Forecast Model Performance</div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {label:'Model Confidence',value:`${(conf*100).toFixed(0)}%`,sub:`${horizon} horizon`,color:'text-blue-600',bg:'bg-blue-50',w:`${conf*100}%`,bar:'bg-blue-500'},
                  {label:'MAE Accuracy',value:'94.2%',sub:'Historical back-test',color:'text-emerald-600',bg:'bg-emerald-50',w:'94.2%',bar:'bg-emerald-500'},
                  {label:'Ensemble Models',value:'9',sub:'VAR + Prophet + LSTM',color:'text-violet-600',bg:'bg-violet-50',w:'75%',bar:'bg-violet-500'},
                ].map(m => (
                  <div key={m.label} className={`${m.bg} rounded-lg p-3`}>
                    <div className="text-xs text-slate-500 mb-1">{m.label}</div>
                    <div className={`text-xl font-black ${m.color}`}>{m.value}</div>
                    <div className="text-xs text-slate-400 mb-2">{m.sub}</div>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div className={`h-full ${m.bar} rounded-full`} style={{width:m.w}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: risk factors + scenario builder */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="font-bold text-xs text-[#0A2540] mb-3">Key Risk Factors — {ecoMeta.name}</div>
              <div className="space-y-2.5">
                {risks.map((r: any) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:r.color}}/>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-600">{r.label}</div>
                      <div className="text-xs text-slate-400">{r.impact} impact</div>
                    </div>
                    <span className={`text-lg font-black ${
                      r.dir==='+' ? 'text-emerald-500' :
                      r.dir==='-' ? 'text-red-500' : 'text-slate-400'
                    }`}>{r.dir==='+'?'↑':r.dir==='-'?'↓':'→'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="font-bold text-xs text-[#0A2540] mb-3">Forecast Intelligence Actions</div>
              <div className="space-y-2">
                <button className="w-full text-left text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2.5 rounded-lg hover:bg-blue-100 transition-colors font-semibold">
                  Download Data Pack (Excel) — 5 FIC
                </button>
                <button className="w-full text-left text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2.5 rounded-lg hover:border-blue-300 transition-colors font-semibold">
                  Custom Scenario Builder — 3 FIC
                </button>
                <button className="w-full text-left text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2.5 rounded-lg hover:border-blue-300 transition-colors font-semibold">
                  Sector-Level Forecasts
                </button>
                <button className="w-full text-left text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2.5 rounded-lg hover:border-blue-300 transition-colors font-semibold">
                  All 9 Horizons: Full Report — 18 FIC
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
              <div className="font-bold text-xs text-[#0A2540] mb-3">Probability Distribution</div>
              <div className="space-y-2">
                {[
                  {range:`>${(current.opt*0.9).toFixed(1)}B`,label:'Above optimistic',pct:10,color:'bg-emerald-400'},
                  {range:`${(current.base*0.9).toFixed(1)}–${(current.opt*0.9).toFixed(1)}B`,label:'Optimistic band',pct:25,color:'bg-emerald-200'},
                  {range:`${(current.base*0.95).toFixed(1)}–${(current.base*1.05).toFixed(1)}B`,label:'Baseline band',pct:55,color:'bg-blue-400'},
                  {range:`${(current.stress*1.1).toFixed(1)}–${(current.base*0.95).toFixed(1)}B`,label:'Stress band',pct:7,color:'bg-orange-300'},
                  {range:`<${(current.stress*1.1).toFixed(1)}B`,label:'Extreme stress',pct:3,color:'bg-red-400'},
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-sm ${b.color} flex-shrink-0`}/>
                    <span className="text-slate-500 flex-1">{b.label}</span>
                    <span className="text-slate-400 w-14 text-right font-mono">{b.range}</span>
                    <span className="font-bold text-slate-600 w-8 text-right">{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
