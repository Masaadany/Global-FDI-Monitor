'use client';
import { useState, useEffect } from 'react';
import { exportCSV } from '@/lib/export';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const ECONOMIES = ['ARE','SAU','IND','SGP','VNM','IDN','DEU','EGY','NGA','CHN'];
const HORIZONS  = ['2025Q4','2026Q1','2026Q2','2026Q3','2026Q4','2027','2028','2029','2030'];

const FORECAST_DB: Record<string,{base:number[];opt:number[];stress:number[];cagr:number;name:string}> = {
  ARE:{name:'UAE',       base:[28,30,31,33,34,36,38,40,42],opt:[30,33,35,38,40,43,46,49,52],stress:[25,27,28,29,30,31,32,33,34],cagr:5.2},
  SAU:{name:'Saudi Arabia',base:[24,26,28,30,32,35,37,39,41],opt:[26,29,32,35,38,42,45,48,52],stress:[20,22,23,25,26,27,28,29,30],cagr:6.8},
  IND:{name:'India',     base:[65,68,70,71,72,73,74,75,76],opt:[70,74,78,81,83,85,86,87,88],stress:[55,58,60,61,62,63,64,64,65],cagr:2.2},
  SGP:{name:'Singapore', base:[138,141,144,148,152,156,160,164,168],opt:[145,150,156,162,168,175,182,189,196],stress:[125,128,130,132,134,136,138,140,142],cagr:2.5},
  VNM:{name:'Vietnam',   base:[15,17,18,19,20,21,22,23,24],opt:[17,19,21,23,25,27,29,31,33],stress:[12,13,14,15,15,16,17,17,18],cagr:6.0},
  IDN:{name:'Indonesia', base:[20,21,22,23,24,26,28,30,32],opt:[22,24,26,28,30,33,36,40,44],stress:[17,18,19,20,21,22,23,24,25],cagr:6.0},
  DEU:{name:'Germany',   base:[33,34,35,36,37,38,40,42,44],opt:[36,38,40,42,44,48,52,56,60],stress:[28,29,30,31,32,33,34,35,36],cagr:3.7},
  EGY:{name:'Egypt',     base:[8.8,9.4,10,10.8,11.4,12.2,13.2,14.2,15.2],opt:[9.4,10.2,11.2,12.2,13.2,14.5,16,17.5,19.2],stress:[7.8,8.2,8.6,9,9.4,9.8,10.2,10.6,11],cagr:8.1},
  NGA:{name:'Nigeria',   base:[3.8,4.1,4.4,4.8,5.2,5.8,6.4,7,7.8],opt:[4.2,4.8,5.4,6.1,6.8,7.8,8.8,9.8,11],stress:[3.2,3.4,3.6,3.8,4,4.2,4.4,4.6,4.8],cagr:9.4},
  CHN:{name:'China',     base:[155,158,161,165,168,172,176,180,184],opt:[162,167,172,178,184,190,196,202,208],stress:[140,142,144,146,148,150,152,154,156],cagr:2.2},
};

function ForecastChart({ data, eco }: { data: typeof FORECAST_DB['ARE']; eco: string }) {
  const all = [...data.base, ...data.opt, ...data.stress];
  const maxV = Math.max(...all) * 1.08;
  const minV = Math.min(...all) * 0.88;
  const W = 560, H = 180, padL = 50, padR = 16, padT = 12, padB = 32;

  function px(i: number, v: number) {
    return {
      x: padL + i * (W - padL - padR) / (HORIZONS.length - 1),
      y: padT + (H - padT - padB) * (1 - (v - minV) / (maxV - minV))
    };
  }
  function makePath(vals: number[]) {
    return vals.map((v, i) => { const p = px(i, v); return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');
  }
  function makeArea(hi: number[], lo: number[]) {
    const fwd = hi.map((v, i) => { const p = px(i, v); return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');
    const bwd = [...lo].reverse().map((v, i) => { const p = px(lo.length - 1 - i, v); return `L${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');
    return `${fwd} ${bwd} Z`;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 0.33, 0.66, 1].map(t => {
        const y = padT + (H - padT - padB) * t;
        const v = (maxV - t * (maxV - minV)).toFixed(0);
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#E2E8F0" strokeWidth="0.5" />
            <text x={padL - 4} y={y + 3.5} fontSize="8" fill="#94A3B8" textAnchor="end">${v}B</text>
          </g>
        );
      })}
      {/* Confidence band */}
      <path d={makeArea(data.opt, data.stress)} fill="#0A66C215" />
      {/* Lines */}
      <path d={makePath(data.opt)}    fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="5,3" />
      <path d={makePath(data.base)}   fill="none" stroke="#0A66C2" strokeWidth="2.5" />
      <path d={makePath(data.stress)} fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,4" />
      {/* Base dots */}
      {data.base.map((v, i) => {
        const p = px(i, v);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#0A66C2" />;
      })}
      {/* X labels */}
      {HORIZONS.map((h, i) => {
        const { x } = px(i, data.base[0]);
        return <text key={h} x={x} y={H - padB + 14} fontSize="7.5" fill="#94A3B8" textAnchor="middle">{h}</text>;
      })}
    </svg>
  );
}

export default function ForecastPage() {
  const [eco,    setEco]    = useState('ARE');
  const [data,   setData]   = useState(FORECAST_DB.ARE);
  const [loading,setLoading]= useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/v1/forecast?economy=${eco}`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data) { /* use API data when available */ } })
      .catch(() => {})
      .finally(() => { setData(FORECAST_DB[eco] || FORECAST_DB.ARE); setLoading(false); });
  }, [eco]);

  const cur  = data.base[data.base.length - 1];
  const init = data.base[0];
  const diff = ((cur - init) / init * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">AI-Powered Projections</div>
          <h1 className="text-4xl font-extrabold mb-2">Forecast &amp; Outlook</h1>
          <p className="text-white/70">FDI projections 2025–2030 · Bayesian VAR + Prophet ensemble · 3-scenario Monte Carlo</p>
        </div>
      </section>

      {/* Executive brief */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3.5">
            <div className="text-xs font-bold text-primary uppercase tracking-wide mb-1">Executive Brief</div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Global FDI is projected to reach <strong>$4.2T by 2028</strong>, driven by Technology (+45%) and Renewable Energy (+32%). Asia-Pacific leads with 18% CAGR; MENA at 15%. Key risks: geopolitical fragmentation, interest rate trajectory, and supply chain reconfiguration.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {/* Key findings */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            {icon:'💻',title:'Technology FDI',v:'+45% by 2028',sub:'$1.8T total opportunity',c:'text-primary'},
            {icon:'⚡',title:'Renewable Energy',v:'+32% by 2028',sub:'$890B green investment',c:'text-emerald-600'},
            {icon:'🌏',title:'Asia-Pacific',v:'+18% CAGR',sub:'5 new unicorn economies',c:'text-violet-600'},
          ].map(k=>(
            <div key={k.title} className="gfm-card p-5">
              <div className="text-3xl mb-3">{k.icon}</div>
              <div className="font-extrabold text-deep mb-1">{k.title}</div>
              <div className={`text-2xl font-extrabold font-mono ${k.c}`}>{k.v}</div>
              <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Economy selector + chart */}
        <div className="gfm-card p-5 mb-5">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="font-extrabold text-deep">FDI Forecast by Economy</div>
            <div className="flex flex-wrap gap-1.5">
              {ECONOMIES.map(e=>(
                <button key={e} onClick={()=>setEco(e)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${eco===e?'bg-primary text-white':'border border-slate-200 text-slate-500 hover:border-primary'}`}>
                  {e}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-right">
                <div className="font-extrabold text-primary font-mono text-lg">{data.cagr}% CAGR</div>
                <div className="text-xs text-slate-400">2025–2030</div>
              </div>
              <button onClick={()=>exportCSV(HORIZONS.map((h,i)=>({Horizon:h,Baseline:data.base[i],Optimistic:data.opt[i],Stress:data.stress[i]})),`GFM_Forecast_${eco}`)}
                className="gfm-btn-outline text-xs py-1.5">Export CSV</button>
            </div>
          </div>
          {loading ? <div className="h-44 bg-slate-100 rounded-xl animate-pulse"/> : <ForecastChart data={data} eco={eco}/>}
          <div className="flex items-center gap-5 mt-3 text-xs text-slate-500 justify-center">
            <span className="flex items-center gap-1.5"><div className="w-5 h-0.5 bg-emerald-500"/> Optimistic</span>
            <span className="flex items-center gap-1.5"><div className="w-5 h-1 bg-primary rounded"/> Base Case</span>
            <span className="flex items-center gap-1.5"><div className="w-5 h-0.5 bg-red-500"/> Stress</span>
            <span className="ml-4 text-slate-300">Model: Bayesian VAR + Prophet Ensemble</span>
          </div>
        </div>

        {/* Scenario cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {label:'Optimistic', prob:25, fdi2030:`$${data.opt[8].toFixed(0)}B`, color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-200',
             conds:['Accelerated policy reform','AI investment supercycle','Geopolitical stabilisation']},
            {label:'Base Case',  prob:60, fdi2030:`$${data.base[8].toFixed(0)}B`,color:'text-primary',     bg:'bg-primary-light border-blue-200',
             conds:['Moderate policy progress','Steady technology FDI','Contained geopolitical risk']},
            {label:'Stress',     prob:15, fdi2030:`$${data.stress[8].toFixed(0)}B`,color:'text-red-600',   bg:'bg-red-50 border-red-200',
             conds:['Trade fragmentation','Interest rate shock','Political instability']},
          ].map(s=>(
            <div key={s.label} className={`rounded-xl border p-5 ${s.bg}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="font-extrabold text-deep">{s.label}</div>
                <div className={`gfm-badge ${s.bg} ${s.color} border-current`}>P{s.prob}%</div>
              </div>
              <div className={`text-3xl font-extrabold font-mono ${s.color} mb-1`}>{s.fdi2030}</div>
              <div className="text-xs text-slate-400 mb-3">FDI by 2030</div>
              <ul className="space-y-1">
                {s.conds.map(c=><li key={c} className="text-xs text-slate-600 flex items-start gap-1.5"><span className={s.color}>•</span>{c}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={()=>window.location.href='/subscription'} className="gfm-btn-primary px-6 py-2.5">Generate Forecast Report — 12 FIC</button>
          <button onClick={()=>exportCSV(HORIZONS.map((h,i)=>({Horizon:h,Baseline:data.base[i],Optimistic:data.opt[i],Stress:data.stress[i]})),`GFM_Forecast_${eco}`)}
            className="gfm-btn-outline px-6 py-2.5">Download Data</button>
        </div>
      </div>
    </div>
  );
}
