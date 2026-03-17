'use client';
import { useState } from 'react';
import { exportCSV } from '@/lib/export';

const API = process.env.NEXT_PUBLIC_API_URL || '';
const YEARS = ['2024','2025','2026','2027','2028','2029','2030'];

function ScenarioChart({bull,base,bear}:{bull:number[];base:number[];bear:number[]}) {
  const all=[...bull,...base,...bear];
  const maxV=Math.max(...all)*1.06, minV=Math.min(...all)*0.92;
  const W=460,H=160,pL=44,pR=12,pT=10,pB=30;
  function pt(i:number,v:number){return{x:pL+i*(W-pL-pR)/(YEARS.length-1),y:pT+(H-pT-pB)*(1-(v-minV)/(maxV-minV))};}
  function path(vals:number[]){return vals.map((v,i)=>{const p=pt(i,v);return `${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;}).join(' ');}
  function area(hi:number[],lo:number[]){return `${path(hi)} ${[...lo].reverse().map((v,i)=>{const p=pt(lo.length-1-i,v);return `L${p.x.toFixed(1)},${p.y.toFixed(1)}`;}).join(' ')} Z`;}
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0,.33,.66,1].map(t=>{const y=pT+(H-pT-pB)*t;const v=(maxV-t*(maxV-minV)).toFixed(0);return(<g key={t}><line x1={pL} y1={y} x2={W-pR} y2={y} stroke="#E2E8F0" strokeWidth="0.5"/><text x={pL-3} y={y+3} fontSize="8" fill="#94A3B8" textAnchor="end">${v}B</text></g>);})}
      <path d={area(bull,bear)} fill="#0A66C215"/>
      <path d={path(bull)} fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="5,3"/>
      <path d={path(base)} fill="none" stroke="#0A66C2" strokeWidth="2.5"/>
      <path d={path(bear)} fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,4"/>
      {base.map((v,i)=>{const p=pt(i,v);return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#0A66C2"/>;} )}
      {YEARS.map((y,i)=>{const {x}=pt(i,base[0]);return <text key={y} x={x} y={H-pB+13} fontSize="8" fill="#94A3B8" textAnchor="middle">{y}</text>;})}
    </svg>
  );
}

export default function ScenarioPage() {
  const [custom,  setCustom]  = useState({gdp:3.4,fdi:31.5,oil:80,policy:70});
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<any>(null);
  const [tab,     setTab]     = useState<'custom'|'monte'|'prebuilt'>('prebuilt');

  // Compute from inputs
  const bull   = YEARS.map((_,i)=>custom.fdi*(1+(custom.gdp-2.5)/100*2.0+i*0.06+0.08));
  const base   = YEARS.map((_,i)=>custom.fdi*(1+(custom.gdp-2.5)/100*1.2+i*0.035+0.03));
  const bear   = YEARS.map((_,i)=>custom.fdi*(1+(custom.gdp-2.5)/100*0.6+i*0.015-0.04));

  async function runScenario() {
    setLoading(true);
    try {
      const token = typeof window!=='undefined'?localStorage.getItem('gfm_token'):null;
      const res = await fetch(`${API}/api/v1/scenarios`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token||''}`},body:JSON.stringify(custom)});
      const d = await res.json();
      if(d.success) setResult(d.data);
    } catch {}
    setLoading(false);
  }

  const PREBUILT = [
    {title:'MENA Green Hydrogen',economy:'MENA',bull:[0.8,1.4,2.2,4.0,7.5,12,18],base:[0.8,1.2,1.8,3.0,5.5,8.4,12],bear:[0.8,1.0,1.4,2.0,3.2,4.8,6.4],desc:'Green hydrogen production and export corridor. Based on IRENA targets and current project pipeline.'},
    {title:'ASEAN Supply Chain',economy:'ASEAN',bull:[88,98,112,130,152,178,210],base:[88,94,102,114,128,144,162],bear:[88,90,94,98,104,110,118],desc:'Supply chain FDI reconfiguration to Vietnam, Indonesia, Malaysia. Driven by China+1 strategies.'},
    {title:'Africa Minerals Corridor',economy:'Africa',bull:[4.2,5.8,8.0,11.2,15.6,21.4,28.8],base:[4.2,5.0,6.4,8.2,10.8,13.8,17.6],bear:[4.2,4.6,5.0,5.6,6.2,6.8,7.4],desc:'Critical minerals FDI to DRC, Zambia, Zimbabwe. Driven by EV battery supply chain demand.'},
  ];

  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Monte Carlo Analysis</div>
          <h1 className="text-4xl font-extrabold mb-2">Scenario Planner</h1>
          <p className="text-white/70">Build custom FDI scenarios · Pre-built corridor models · Monte Carlo simulation</p>
        </div>
      </section>

      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-screen-xl mx-auto flex gap-0">
          {[['prebuilt','🔮 Pre-Built Scenarios'],['custom','⚙️ Custom Scenario'],['monte','🎲 Monte Carlo']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)} className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {tab==='prebuilt' && (
          <div className="space-y-5">
            {PREBUILT.map(s=>(
              <div key={s.title} className="gfm-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div><div className="font-extrabold text-deep text-lg">{s.title}</div><div className="text-xs text-slate-400 mt-0.5">{s.economy}</div></div>
                  <div className="flex gap-2">
                    <button onClick={()=>exportCSV(YEARS.map((y,i)=>({Year:y,Bull:s.bull[i].toFixed(1),Base:s.base[i].toFixed(1),Bear:s.bear[i].toFixed(1)})),`GFM_Scenario_${s.title.replace(/ /g,'_')}`)} className="gfm-btn-outline text-xs py-1.5">Export</button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{s.desc}</p>
                <ScenarioChart bull={s.bull} base={s.base} bear={s.bear}/>
                <div className="flex items-center gap-5 mt-2 text-xs text-slate-400 justify-center">
                  <span className="flex items-center gap-1.5"><div className="w-5 h-0.5 bg-emerald-500"/>Optimistic</span>
                  <span className="flex items-center gap-1.5"><div className="w-5 h-1 bg-primary rounded"/>Base Case</span>
                  <span className="flex items-center gap-1.5"><div className="w-5 h-0.5 bg-red-500"/>Stress</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='custom' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="gfm-card p-6">
              <div className="font-extrabold text-deep mb-5">Build Custom Scenario</div>
              <div className="space-y-5">
                {[
                  {key:'gdp',label:'GDP Growth Rate (%)',min:0,max:10,step:0.1,fmt:(v:number)=>`${v}%`},
                  {key:'fdi',label:'FDI Base ($B)',min:1,max:200,step:0.5,fmt:(v:number)=>`$${v}B`},
                  {key:'oil',label:'Oil Price ($/bbl)',min:30,max:150,step:5,fmt:(v:number)=>`$${v}`},
                  {key:'policy',label:'Policy Score (0-100)',min:0,max:100,step:5,fmt:(v:number)=>String(v)},
                ].map(({key,label,min,max,step,fmt})=>(
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-600">{label}</span>
                      <span className="font-extrabold text-primary font-mono">{fmt(custom[key as keyof typeof custom])}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={custom[key as keyof typeof custom]}
                      onChange={e=>setCustom(c=>({...c,[key]:parseFloat(e.target.value)}))}
                      className="w-full accent-primary"/>
                    <div className="flex justify-between text-xs text-slate-300 mt-0.5"><span>{min}</span><span>{max}</span></div>
                  </div>
                ))}
                <button onClick={runScenario} disabled={loading} className={`w-full gfm-btn-primary py-3.5 rounded-xl ${loading?'opacity-50':''}`}>
                  {loading?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Running model…</span>:'Run Scenario — 5 FIC'}
                </button>
              </div>
            </div>
            <div className="gfm-card p-6">
              <div className="font-extrabold text-deep mb-3">Scenario Output</div>
              <ScenarioChart bull={bull} base={base} bear={bear}/>
              <div className="flex items-center gap-5 mt-2 mb-4 text-xs text-slate-400 justify-center">
                <span className="flex items-center gap-1.5"><div className="w-5 h-0.5 bg-emerald-500"/>Optimistic</span>
                <span className="flex items-center gap-1.5"><div className="w-5 h-1 bg-primary rounded"/>Base</span>
                <span className="flex items-center gap-1.5"><div className="w-5 h-0.5 bg-red-500"/>Stress</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[{l:'Bull 2030',v:`$${bull[6].toFixed(0)}B`,c:'text-emerald-600'},{l:'Base 2030',v:`$${base[6].toFixed(0)}B`,c:'text-primary'},{l:'Bear 2030',v:`$${bear[6].toFixed(0)}B`,c:'text-red-500'}].map(s=>(
                  <div key={s.l} className="bg-surface rounded-xl p-3 text-center border border-slate-200">
                    <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                    <div className={`font-extrabold font-mono ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>exportCSV(YEARS.map((y,i)=>({Year:y,Bull:bull[i].toFixed(1),Base:base[i].toFixed(1),Bear:bear[i].toFixed(1)})),'GFM_Custom_Scenario')} className="gfm-btn-outline text-xs py-2 w-full mt-3">Export Scenario CSV</button>
            </div>
          </div>
        )}

        {tab==='monte' && (
          <div className="max-w-2xl mx-auto text-center py-10">
            <div className="text-5xl mb-4">🎲</div>
            <div className="font-extrabold text-deep text-2xl mb-2">Monte Carlo Simulation</div>
            <p className="text-slate-500 mb-5 leading-relaxed">Run 10,000 simulations across your chosen macro parameters to generate a probability distribution of FDI outcomes.</p>
            <div className="gfm-card p-6 text-left mb-5">
              <div className="font-bold text-sm text-deep mb-3">Simulation parameters</div>
              <div className="space-y-2 text-sm text-slate-500">
                {['GDP growth: normal distribution (μ=3.4%, σ=1.2%)','Oil price: log-normal (μ=$80, σ=$18)','Policy score: uniform [60,90]','FX volatility: GARCH(1,1)'].map(p=><div key={p} className="flex items-center gap-2"><span className="text-primary">→</span>{p}</div>)}
              </div>
            </div>
            <button onClick={()=>window.location.href='/subscription'} className="gfm-btn-primary px-8 py-3 text-base">Run Monte Carlo — 8 FIC</button>
          </div>
        )}
      </div>
    </div>
  );
}
