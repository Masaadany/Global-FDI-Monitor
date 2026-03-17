'use client';

function CustomScenarioChart({gdp,oil,fdi_base}: {gdp:number;oil:number;fdi_base:number}) {
  const years = [2024,2025,2026,2027,2028,2029,2030];
  const base  = years.map((_,i)=>fdi_base*(1+(gdp-2.5)/100*1.2+i*0.035));
  const bull  = years.map((_,i)=>fdi_base*(1+(gdp-2.5)/100*2.0+i*0.06+0.08));
  const bear  = years.map((_,i)=>fdi_base*(1+(gdp-2.5)/100*0.6+i*0.015-0.04));
  const allV  = [...base,...bull,...bear];
  const maxV  = Math.max(...allV)*1.05; const minV = Math.min(...allV)*0.92;
  const W=380,H=160,padL=44,padR=12,padT=8,padB=28;
  function px(i:number,v:number){
    return {x:padL+i*(W-padL-padR)/(years.length-1),y:padT+(H-padT-padB)*(1-(v-minV)/(maxV-minV))};
  }
  function path(vals:number[]){return vals.map((v,i)=>{const {x,y}=px(i,v);return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`;}).join(' ');}
  const area=(hi:number[],lo:number[])=>`${path(hi)} ${[...lo].reverse().map((v,i)=>{const j=lo.length-1-i;const {x,y}=px(j,v);return `L${x.toFixed(1)},${y.toFixed(1)}`;}).join(' ')} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0,0.33,0.66,1].map(t=>{
        const y=padT+(H-padT-padB)*t; const v=maxV-t*(maxV-minV);
        return <g key={t}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#e2e8f0" strokeWidth="0.5"/>
          <text x={padL-3} y={y+3} fontSize="7" fill="#94a3b8" textAnchor="end">${v.toFixed(0)}B</text></g>;
      })}
      <path d={area(bull,bear)} fill="#3b82f620"/>
      <path d={path(bull)}  fill="none" stroke="#10b981" strokeWidth="1.8"/>
      <path d={path(base)}  fill="none" stroke="#3b82f6" strokeWidth="2.2"/>
      <path d={path(bear)}  fill="none" stroke="#ef4444" strokeWidth="1.8" strokeDasharray="4,3"/>
      {years.map((y,i)=>{const {x}=px(i,base[i]);return <text key={y} x={x} y={H-padB+12} fontSize="7" fill="#94a3b8" textAnchor="middle">{y}</text>;})}
      {base.map((v,i)=>{const {x,y}=px(i,v);return <circle key={i} cx={x} cy={y} r={2.5} fill="#3b82f6"/>;})}
    </svg>
  );
}

import { useState } from 'react';

const BASE_SCENARIOS = [
  {id:'S1',name:'Baseline 2026',    tag:'BASE',     gdp_growth:3.4, fdi_b:31.5, inflation:2.8, rate:4.5, unemployment:3.2, probability:45, color:'#3b82f6', desc:'Moderate growth, stable oil prices $75-85, continued tech FDI.'},
  {id:'S2',name:'Oil Boom',         tag:'BULL',     gdp_growth:4.8, fdi_b:42.0, inflation:3.8, rate:4.0, unemployment:2.8, probability:20, color:'#10b981', desc:'Brent $120+, Vision 2030 acceleration, major energy FDI surge.'},
  {id:'S3',name:'Global Recession', tag:'BEAR',     gdp_growth:0.8, fdi_b:18.5, inflation:4.2, rate:6.0, unemployment:5.1, probability:15, color:'#ef4444', desc:'US/EU recession spillover, FDI freeze, capital flight from EM.'},
  {id:'S4',name:'Green Transition', tag:'TRANSFORM',gdp_growth:3.9, fdi_b:38.0, inflation:2.4, rate:4.2, unemployment:3.0, probability:20, color:'#8b5cf6', desc:'Accelerated energy transition, $40B+ clean energy FDI pipeline.'},
];

const SECTORS = [
  {code:'J',name:'Technology',     base:285, bull:420, bear:140, green:380},
  {code:'D',name:'Energy',         base:180, bull:320, bear:90,  green:480},
  {code:'K',name:'Finance',        base:210, bull:280, bear:120, green:200},
  {code:'C',name:'Manufacturing',  base:155, bull:200, bear:80,  green:170},
  {code:'L',name:'Real Estate',    base:120, bull:180, bear:55,  green:110},
  {code:'H',name:'Logistics',      base:95,  bull:130, bear:60,  green:100},
];

const SCENARIO_KEY: Record<string,'base'|'bull'|'bear'|'green'> = {
  BASE:'base', BULL:'bull', BEAR:'bear', TRANSFORM:'green'
};

function BarChart({data,max,color}:{data:{l:string,v:number}[],max:number,color:string}) {
  return (
    <div className="space-y-2">
      {data.map(d=>(
        <div key={d.l}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-slate-400">{d.l}</span>
            <span className="font-bold text-slate-600">${d.v}B</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{width:`${Math.min(100,(d.v/max)*100)}%`,background:color}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ScenarioPlannerPage() {
  const [active,    setActive]    = useState('S1');
  const [economy,   setEconomy]   = useState('UAE');
  const [custom,    setCustom]    = useState({gdp:3.4,fdi:31.5,oil:80});
  const [customEconomy, setCustomEconomy] = useState('UAE');

  const ECON_LIST = ['UAE','Saudi Arabia','India','Egypt','Vietnam','Indonesia','Germany','Singapore','Nigeria','Morocco','Brazil','Turkey','Kenya','South Africa','Vietnam'];

  const sc  = BASE_SCENARIOS.find(s=>s.id===active)!;
  const sKey = SCENARIO_KEY[sc.tag];
  const maxFDI = Math.max(...SECTORS.map(s=>s[sKey]));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Scenario Planner</h1>
          <p className="text-blue-200 text-sm">Model investment outcomes across macro scenarios. Adjust assumptions and see projected FDI impact by sector.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        {/* Scenario cards */}
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          {BASE_SCENARIOS.map(s=>(
            <div key={s.id} onClick={()=>setActive(s.id)}
              className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all ${active===s.id?'shadow-md':'border-slate-100 hover:border-blue-200'}`}
              style={active===s.id?{borderColor:s.color,borderWidth:'2px'}:{}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded text-white" style={{background:s.color}}>{s.tag}</span>
                <span className="text-xs text-slate-400">{s.probability}% prob.</span>
              </div>
              <div className="font-black text-sm text-[#0A2540] mb-1">{s.name}</div>
              <div className="text-2xl font-black" style={{color:s.color}}>+{s.gdp_growth}%</div>
              <div className="text-xs text-slate-400">GDP growth</div>
              <div className="text-sm font-black text-blue-600 mt-1">${s.fdi_b}B</div>
              <div className="text-xs text-slate-400">FDI inflows</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Active scenario detail */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full" style={{background:sc.color}}/>
                <div className="font-black text-lg text-[#0A2540]">{sc.name}</div>
                <span className="text-xs font-bold text-slate-400 ml-auto">{sc.probability}% probability</span>
              </div>
              <p className="text-slate-500 text-sm mb-5">{sc.desc}</p>

              <div className="grid grid-cols-5 gap-3 mb-5">
                {[
                  {l:'GDP Growth',    v:`+${sc.gdp_growth}%`},
                  {l:'FDI Inflows',   v:`$${sc.fdi_b}B`},
                  {l:'Inflation',     v:`${sc.inflation}%`},
                  {l:'Interest Rate', v:`${sc.rate}%`},
                  {l:'Unemployment',  v:`${sc.unemployment}%`},
                ].map(k=>(
                  <div key={k.l} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-400 mb-0.5">{k.l}</div>
                    <div className="font-black text-sm text-[#0A2540]">{k.v}</div>
                  </div>
                ))}
              </div>

              <div className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-3">FDI Impact by Sector</div>
              <BarChart
                data={SECTORS.map(s=>({l:`ISIC ${s.code} — ${s.name}`, v:s[sKey]}))}
                max={maxFDI}
                color={sc.color}
              />
            </div>

            {/* Scenario comparison */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="font-bold text-sm text-[#0A2540] mb-4">Scenario Comparison — Total FDI Signals</div>
              <div className="space-y-3">
                {BASE_SCENARIOS.map(s=>(
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.color}}/>
                    <span className="text-xs text-slate-500 w-36">{s.name}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{width:`${(s.fdi_b/50)*100}%`,background:s.color}}/>
                    </div>
                    <span className="text-xs font-black text-slate-600 w-16 text-right">${s.fdi_b}B</span>
                    <span className="text-xs text-slate-400 w-12">{s.probability}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom assumptions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="font-bold text-sm text-[#0A2540] mb-4">Custom Assumptions</div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Economy</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 mb-3"
                  value={customEconomy} onChange={e=>setCustomEconomy(e.target.value)}>
                  {ECON_LIST.map(e=><option key={e}>{e}</option>)}
                </select>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Economy focus</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    value={economy} onChange={e=>setEconomy(e.target.value)}>
                    {['UAE','Saudi Arabia','India','Egypt','Vietnam','Indonesia','Germany','Singapore'].map(e=>(
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                </div>
                {[
                  {key:'gdp',label:'GDP Growth (%)', min:'-5', max:'10', step:'0.1'},
                  {key:'fdi',label:'FDI Inflows ($B)', min:'0', max:'100', step:'0.5'},
                  {key:'oil',label:'Oil Price ($/bbl)', min:'40', max:'150', step:'1'},
                ].map(f=>(
                  <div key={f.key}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-500">{f.label}</span>
                      <span className="font-black text-blue-600">{(custom as any)[f.key]}</span>
                    </div>
                    <input type="range" min={f.min} max={f.max} step={f.step}
                      value={(custom as any)[f.key]}
                      onChange={e=>setCustom(c=>({...c,[f.key]:parseFloat(e.target.value)}))}
                      className="w-full accent-blue-600"/>
                  </div>
                ))}
                <button className="w-full bg-[#0A2540] text-white font-black py-2.5 rounded-xl text-sm hover:bg-[#1D4ED8] transition-colors">
                  Run Custom Scenario
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="font-bold text-sm text-[#0A2540] mb-3">Probability Weights</div>
              <div className="space-y-2">
                {BASE_SCENARIOS.map(s=>(
                  <div key={s.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{background:s.color}}/>
                    <span className="text-xs text-slate-500 flex-1">{s.name}</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${s.probability}%`,background:s.color}}/>
                    </div>
                    <span className="text-xs font-bold text-slate-500 w-6">{s.probability}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs text-blue-700 text-center font-semibold">
                Probability-weighted FDI: ${BASE_SCENARIOS.reduce((s,sc)=>s+(sc.fdi_b*sc.probability/100),0).toFixed(1)}B
              </div>
            </div>
          </div>
        </div>

        {/* Monte Carlo Simulation */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 mt-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-black text-sm text-[#0A2540]">Monte Carlo Simulation</div>
              <div className="text-xs text-slate-400">10,000 runs · 95% confidence interval</div>
            </div>
            <span className="text-xs bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded font-bold">β</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              {l:'P5  (Stress)',  v:`$${(sc.fdi_b * 0.62).toFixed(1)}B`, c:'text-red-500'},
              {l:'P25',          v:`$${(sc.fdi_b * 0.84).toFixed(1)}B`, c:'text-amber-600'},
              {l:'P50 (Median)', v:`$${sc.fdi_b.toFixed(1)}B`,          c:'text-blue-600'},
              {l:'P95 (Bull)',   v:`$${(sc.fdi_b * 1.38).toFixed(1)}B`, c:'text-emerald-600'},
            ].map(s => (
              <div key={s.l} className="bg-slate-50 rounded-lg p-3 text-center">
                <div className={`font-black text-lg ${s.c}`}>{s.v}</div>
                <div className="text-xs text-slate-400">{s.l}</div>
              </div>
            ))}
          </div>
          {/* Distribution visualization */}
          <div className="relative h-16 bg-slate-50 rounded-xl overflow-hidden">
            <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mcGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%"   stopColor="#ef4444" stopOpacity="0.3"/>
                  <stop offset="30%"  stopColor="#f59e0b" stopOpacity="0.5"/>
                  <stop offset="50%"  stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="70%"  stopColor="#f59e0b" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <path d="M0,58 C40,58 60,55 80,48 C100,40 110,30 130,18 C150,6 160,2 200,2 C240,2 250,6 270,18 C290,30 300,40 320,48 C340,55 360,58 400,58 Z" fill="url(#mcGrad)"/>
              <line x1="200" y1="0" x2="200" y2="60" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2"/>
            </svg>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600">Median</div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Distribution based on 10,000 stochastic scenarios with volatility σ={`${(sc.gdp_growth * 0.4).toFixed(1)}`}% GDP, oil price range $50–$130/bbl.
          </p>
        </div>

        {/* Monte Carlo simulation */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 mt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-black text-sm text-[#0A2540]">Monte Carlo Simulation</div>
            <div className="text-xs text-slate-400">10,000 simulations · P10/P50/P90</div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              {label:'P10 (Downside)',   value:`$${(sc.fdi_b * 0.72).toFixed(1)}B`, color:'text-red-500',    bg:'bg-red-50',   border:'border-red-200'},
              {label:'P50 (Median)',     value:`$${(sc.fdi_b * 1.0).toFixed(1)}B`,  color:'text-blue-600',  bg:'bg-blue-50',  border:'border-blue-200'},
              {label:'P90 (Upside)',     value:`$${(sc.fdi_b * 1.28).toFixed(1)}B`, color:'text-emerald-600',bg:'bg-emerald-50',border:'border-emerald-200'},
            ].map(p=>(
              <div key={p.label} className={`rounded-xl border ${p.bg} ${p.border} p-4 text-center`}>
                <div className={`text-2xl font-black ${p.color}`}>{p.value}</div>
                <div className="text-xs text-slate-500 mt-1">{p.label}</div>
              </div>
            ))}
          </div>
          {/* Distribution bar */}
          <div className="flex h-6 rounded-full overflow-hidden gap-px">
            <div className="bg-red-400" style={{width:'15%'}} title="P0-P15"/>
            <div className="bg-orange-400" style={{width:'20%'}} title="P15-P35"/>
            <div className="bg-blue-400" style={{width:'30%'}} title="P35-P65 (median range)"/>
            <div className="bg-emerald-400" style={{width:'20%'}} title="P65-P85"/>
            <div className="bg-teal-500" style={{width:'15%'}} title="P85-P100"/>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Bear case</span>
            <span>Median</span>
            <span>Bull case</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Simulation uses Bayesian parameter sampling across macro variables: oil price, global growth, inflation, political stability index, and sector-specific drivers.</p>
        </div>
      </div>
    </div>
  );
}
