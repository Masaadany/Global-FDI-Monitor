'use client';
import { useState } from 'react';

function MiniLineChart({data,color='#3b82f6'}:{data:number[];color?:string}) {
  const max=Math.max(...data), min=Math.min(...data), range=max-min||1;
  const w=100/(data.length-1);
  const pts=data.map((v,i)=>({x:i*w,y:60-((v-min)/range)*55}));
  const path=pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const area=path+` L${pts[pts.length-1].x},65 L0,65 Z`;
  return (
    <svg viewBox="0 0 100 65" className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`fg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fg${color.replace('#','')})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="2"/>
    </svg>
  );
}

const FORECASTS = [
  {economy:'UAE',     indicator:'FDI Inflows (USD B)',    base:[28,30,31,33,34,36,38,40,42],    opt:[30,33,35,38,40,43,46,49,52],    stress:[25,27,28,29,30,31,32,33,34], unit:'$B'},
  {economy:'Saudi Arabia',indicator:'FDI Inflows (USD B)',base:[24,26,28,30,32,35,37,39,41],    opt:[26,29,32,35,38,42,45,48,52],    stress:[20,22,23,25,26,27,28,29,30], unit:'$B'},
  {economy:'India',   indicator:'GDP Growth Rate (%)',    base:[6.5,6.8,7.0,7.1,7.2,7.3,7.4,7.5,7.6],opt:[7.0,7.4,7.8,8.1,8.3,8.5,8.6,8.7,8.8],stress:[5.5,5.8,6.0,6.1,6.2,6.3,6.4,6.4,6.5],unit:'%'},
  {economy:'Vietnam', indicator:'FDI Inflows (USD B)',    base:[15,17,18,19,20,21,22,23,24],    opt:[17,19,21,23,25,27,29,31,33],    stress:[12,13,14,15,15,16,17,17,18], unit:'$B'},
];

const HORIZONS = ['2025Q4','2026Q1','2026Q2','2026Q3','2026Q4','2027','2028','2029','2030'];

export default function ForecastPage() {
  const [selected, setSelected] = useState(FORECASTS[0]);
  const [scenario, setScenario] = useState<'base'|'opt'|'stress'>('base');

  const data  = selected[scenario];
  const last  = data[data.length-1];
  const first = data[0];
  const change= ((last-first)/first*100).toFixed(1);
  const colors = {base:'#3b82f6',opt:'#10b981',stress:'#ef4444'};

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">AI-Powered · Bayesian VAR + Prophet Ensemble</div>
          <h1 className="text-3xl font-black mb-2">Forecast & Outlook</h1>
          <p className="text-blue-200 text-sm">9-horizon forecasts: nowcast to 2030. Three scenarios: Baseline, Optimistic, Stress.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 grid md:grid-cols-4 gap-5">
        {/* Economy selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Economy</div>
          {FORECASTS.map(f => (
            <div key={f.economy} onClick={() => setSelected(f)}
              className={`bg-white rounded-xl border p-3.5 cursor-pointer transition-all ${
                selected.economy===f.economy ? 'border-blue-400 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'
              }`}>
              <div className="font-bold text-sm text-[#0A2540]">{f.economy}</div>
              <div className="text-xs text-slate-400">{f.indicator}</div>
            </div>
          ))}
        </div>

        {/* Main chart */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-black text-xl text-[#0A2540]">{selected.economy}</h2>
                <div className="text-slate-400 text-sm">{selected.indicator}</div>
              </div>
              <div className="flex gap-1">
                {([['base','Baseline','bg-blue-600'],['opt','Optimistic','bg-emerald-600'],['stress','Stress','bg-red-500']] as const).map(([s,l,c]) => (
                  <button key={s} onClick={() => setScenario(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all text-white ${
                      scenario===s ? c : 'bg-slate-200 text-slate-500'
                    }`}>{l}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div>
                <div className="text-3xl font-black" style={{color:colors[scenario]}}>{last}{selected.unit}</div>
                <div className="text-xs text-slate-400">2030 {scenario} forecast</div>
              </div>
              <div>
                <div className={`text-xl font-black ${parseFloat(change)>0?'text-emerald-600':'text-red-500'}`}>
                  {parseFloat(change)>0?'+':''}{change}%
                </div>
                <div className="text-xs text-slate-400">vs 2025</div>
              </div>
            </div>

            <MiniLineChart data={data} color={colors[scenario]}/>

            <div className="flex justify-between text-xs text-slate-400 mt-2">
              {HORIZONS.filter((_,i) => i % 3 === 0).map(h => <span key={h}>{h}</span>)}
            </div>
          </div>

          {/* All 3 scenarios comparison */}
          <div className="grid grid-cols-3 gap-3">
            {([['base','Baseline','#3b82f6'],['opt','Optimistic','#10b981'],['stress','Stress','#ef4444']] as const).map(([s,l,c]) => (
              <div key={s} className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="font-bold text-xs mb-1" style={{color:c}}>{l}</div>
                <div className="text-2xl font-black text-[#0A2540]">{selected[s][selected[s].length-1]}{selected.unit}</div>
                <div className="text-xs text-slate-400 mb-2">2030</div>
                <MiniLineChart data={selected[s]} color={c}/>
              </div>
            ))}
          </div>

          {/* Horizon table */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-2.5 font-bold text-slate-400">Horizon</th>
                  <th className="text-left px-4 py-2.5 font-bold text-blue-500">Baseline</th>
                  <th className="text-left px-4 py-2.5 font-bold text-emerald-500">Optimistic</th>
                  <th className="text-left px-4 py-2.5 font-bold text-red-500">Stress</th>
                </tr>
              </thead>
              <tbody>
                {HORIZONS.map((h,i) => (
                  <tr key={h} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-semibold text-slate-600">{h}</td>
                    <td className="px-4 py-2.5 font-bold text-blue-600">{selected.base[i]}{selected.unit}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">{selected.opt[i]}{selected.unit}</td>
                    <td className="px-4 py-2.5 font-bold text-red-500">{selected.stress[i]}{selected.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
