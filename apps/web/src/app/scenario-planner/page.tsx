'use client';
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
      </div>
    </div>
  );
}
