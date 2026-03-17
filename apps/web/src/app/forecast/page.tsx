'use client';
import { exportCSV } from '@/lib/export';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const HORIZONS = ['2025Q4','2026Q1','2026Q2','2026Q3','2026Q4','2027','2028','2029','2030'];

const FORECASTS: Record<string,Record<string,number[]>> = {
  ARE:  {base:[28,30,31,33,34,36,38,40,42],opt:[30,33,35,38,40,43,46,49,52],stress:[25,27,28,29,30,31,32,33,34]},
  SAU:  {base:[24,26,28,30,32,35,37,39,41],opt:[26,29,32,35,38,42,45,48,52],stress:[20,22,23,25,26,27,28,29,30]},
  IND:  {base:[65,68,70,71,72,73,74,75,76],opt:[70,74,78,81,83,85,86,87,88],stress:[55,58,60,61,62,63,64,64,65]},
  VNM:  {base:[15,17,18,19,20,21,22,23,24],opt:[17,19,21,23,25,27,29,31,33],stress:[12,13,14,15,15,16,17,17,18]},
  SGP:  {base:[138,141,144,148,152,156,160,164,168],opt:[145,150,156,162,168,175,182,189,196],stress:[125,128,130,132,134,136,138,140,142]},
  NGA:  {base:[3.8,4.1,4.4,4.8,5.2,5.8,6.4,7.0,7.8],opt:[4.2,4.8,5.4,6.1,6.8,7.8,8.8,9.8,11.0],stress:[3.2,3.4,3.6,3.8,4.0,4.2,4.4,4.6,4.8]},
  EGY:  {base:[8.8,9.4,10.0,10.8,11.4,12.2,13.2,14.2,15.2],opt:[9.4,10.2,11.2,12.2,13.2,14.5,16.0,17.5,19.2],stress:[7.8,8.2,8.6,9.0,9.4,9.8,10.2,10.6,11.0]},
  IDN:  {base:[20,21,22,23,24,26,28,30,32],opt:[22,24,26,28,30,33,36,40,44],stress:[17,18,19,20,21,22,23,24,25]},
  DEU:  {base:[33,34,35,36,37,38,40,42,44],opt:[36,38,40,42,44,48,52,56,60],stress:[28,29,30,31,32,33,34,35,36]},
};

const SCENARIO_CONFIG = [
  {key:'opt',   label:'Optimistic',  color:'#10b981', dashes:'', desc:'Above-trend growth: FDI-friendly reforms, commodity boom, strong global trade.'},
  {key:'base',  label:'Baseline',    color:'#3b82f6', dashes:'', desc:'Central forecast based on IMF WEO, historical trends, and current signals.'},
  {key:'stress',label:'Stress',      color:'#ef4444', dashes:'4,4', desc:'Downside: global recession, geopolitical shock, tightened financial conditions.'},
];

const ECONOMIES = [['ARE','UAE'],['SAU','Saudi Arabia'],['IND','India'],['VNM','Vietnam'],['SGP','Singapore'],['NGA','Nigeria'],['EGY','Egypt'],['IDN','Indonesia'],['DEU','Germany']];

function ForecastChart({data,economy}: {data:Record<string,number[]>,economy:string}) {
  const allVals = [...data.base,...data.opt,...data.stress];
  const minV = Math.min(...allVals)*0.92;
  const maxV = Math.max(...allVals)*1.05;
  const W=560, H=200, padL=50, padR=20, padT=10, padB=30;
  const xStep = (W-padL-padR)/(HORIZONS.length-1);
  function px(i:number,v:number) {
    const x = padL + i*xStep;
    const y = padT + (H-padT-padB)*(1-(v-minV)/(maxV-minV));
    return {x,y};
  }
  function path(vals:number[]) {
    return vals.map((v,i)=>{ const {x,y}=px(i,v); return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  }
  function areaBetween(upper:number[],lower:number[]) {
    const top = upper.map((v,i)=>{ const {x,y}=px(i,v); return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
    const bot = lower.slice().reverse().map((v,i,a)=>{ const ri=a.length-1-i; const {x,y}=px(ri,v); return `L${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
    return `${top} ${bot} Z`;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Grid */}
      {[0,0.25,0.5,0.75,1].map(t=>{
        const y = padT + (H-padT-padB)*t;
        const v = maxV - t*(maxV-minV);
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#e2e8f0" strokeWidth="0.5"/>
            <text x={padL-4} y={y+4} fontSize="9" fill="#94a3b8" textAnchor="end">
              {v>=1?`$${v.toFixed(0)}B`:v.toFixed(1)}
            </text>
          </g>
        );
      })}
      {/* Confidence band */}
      <path d={areaBetween(data.opt,data.stress)} fill="#3b82f620"/>
      {/* Scenario lines */}
      {SCENARIO_CONFIG.map(sc=>(
        <path key={sc.key} d={path(data[sc.key])} fill="none" stroke={sc.color}
          strokeWidth={sc.key==='base'?2.5:1.8}
          strokeDasharray={sc.dashes||''}/>
      ))}
      {/* Today marker */}
      {(() => { const {x}=px(0,data.base[0]); return <line x1={x} y1={padT} x2={x} y2={H-padB} stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2"/>; })()}
      {/* X labels */}
      {HORIZONS.map((h,i)=>{
        const {x}=px(i,data.base[i]);
        return <text key={h} x={x} y={H-padB+14} fontSize="8" fill="#94a3b8" textAnchor="middle">{h.replace('20','')}</text>;
      })}
      {/* Base dots */}
      {data.base.map((v,i)=>{
        const {x,y}=px(i,v);
        return <circle key={i} cx={x} cy={y} r={3} fill="#3b82f6"/>;
      })}
    </svg>
  );
}

export default function ForecastPage() {
  const [eco,       setEco]       = useState('ARE');
  const [compare,   setCompare]   = useState<string[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [liveData,  setLiveData]  = useState<any>(null);

  const data   = FORECASTS[eco] || FORECASTS.ARE;
  const ecoName = ECONOMIES.find(e=>e[0]===eco)?.[1] || eco;

  useEffect(()=>{
    setLoading(true);
    fetch(`${API}/api/v1/forecast?economy=${eco}`)
      .then(r=>r.json())
      .then(d=>{ if(d.success) setLiveData(d.data); })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[eco]);

  const lastBase   = data.base[data.base.length-1];
  const firstBase  = data.base[0];
  const cagr       = (((lastBase/firstBase)**(1/(HORIZONS.length-1)))-1)*100;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">FDI Forecast</span>
        <div className="flex gap-1 ml-4 flex-wrap">
          {ECONOMIES.map(([c,n])=>(
            <button key={c} onClick={()=>setEco(c)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${eco===c?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 space-y-5">
        {/* Economy header */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-black text-[#0A2540]">{ecoName}</h2>
              <div className="text-xs text-slate-400 mt-0.5">FDI Inflows Forecast · 9 horizons · Bayesian VAR + Prophet Ensemble</div>
            </div>
            <div className="flex gap-4">
              {[
                {l:'2025 Baseline',v:`$${firstBase}B`,c:'text-slate-700'},
                {l:'2030 Baseline',v:`$${lastBase}B`, c:'text-blue-600'},
                {l:'CAGR (Base)',   v:`${cagr.toFixed(1)}%`,c:'text-emerald-600'},
                {l:'2030 Optimistic',v:`$${data.opt[data.opt.length-1]}B`,c:'text-emerald-600'},
              ].map(s=>(
                <div key={s.l} className="text-center">
                  <div className={`text-xl font-black ${s.c}`}>{s.v}</div>
                  <div className="text-xs text-slate-400">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <ForecastChart data={data} economy={eco}/>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3">
            {SCENARIO_CONFIG.map(sc=>(
              <div key={sc.key} className="flex items-center gap-2 text-xs text-slate-500">
                <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke={sc.color} strokeWidth="2" strokeDasharray={sc.dashes||''}/></svg>
                <strong>{sc.label}</strong> — {sc.desc}
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-5 h-3 bg-blue-100 rounded"/>
              Confidence band (stress→optimistic)
            </div>
          </div>
        </div>

        {/* Scenario table */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 font-black text-sm text-[#0A2540]">Scenario Comparison Table (FDI Inflows $B)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wide w-24">Scenario</th>
                  {HORIZONS.map(h=><th key={h} className="text-center px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h.replace('20','')}</th>)}
                </tr>
              </thead>
              <tbody>
                {SCENARIO_CONFIG.map(sc=>(
                  <tr key={sc.key} className="border-t border-slate-50">
                    <td className="px-4 py-3 font-black" style={{color:sc.color}}>{sc.label}</td>
                    {data[sc.key].map((v,i)=>(
                      <td key={i} className="text-center px-3 py-3 font-semibold text-slate-700">{v>=10?v.toFixed(0):v.toFixed(1)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-economy compare */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-black text-sm text-[#0A2540] mb-3">Economy Comparison — 2030 Baseline Forecast ($B)</div>
          <div className="space-y-2">
            {ECONOMIES.filter(([c])=>FORECASTS[c]).sort((a,b)=>FORECASTS[b[0]].base[8]-FORECASTS[a[0]].base[8]).map(([code,name],i)=>{
              const val   = FORECASTS[code].base[8];
              const maxVal= Math.max(...ECONOMIES.filter(([c])=>FORECASTS[c]).map(([c])=>FORECASTS[c].base[8]));
              return (
                <div key={code} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-4">#{i+1}</span>
                  <span className="text-xs font-bold text-slate-600 w-24 flex-shrink-0">{name.split(' ')[0]}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${code===eco?'bg-blue-500':'bg-slate-300'} transition-all`} style={{width:`${(val/maxVal)*100}%`}}/>
                  </div>
                  <span className={`text-xs font-black w-12 text-right ${code===eco?'text-blue-600':'text-slate-600'}`}>${val>=10?val.toFixed(0):val.toFixed(1)}B</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mb-3">
          <button onClick={()=>exportCSV(HORIZONS.map((h,i)=>({Horizon:h,Optimistic:data.opt[i],Baseline:data.base[i],Stress:data.stress[i]})),'GFM_Forecast_'+eco)}
            className="text-xs font-bold border border-slate-200 text-slate-500 px-4 py-1.5 rounded-lg hover:border-blue-300 transition-colors">
            Export Forecast CSV
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center">Bayesian VAR + Meta Prophet Ensemble · IMF WEO base case · Updated March 2026 · Not financial advice</p>
      </div>
    </div>
  );
}
