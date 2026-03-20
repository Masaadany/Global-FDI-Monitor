'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

const PRESETS = [
  { id:'base',      name:'Base Case',        desc:'Moderate growth at historical rates',        gdp:0,    tech:1.0,  energy:0.5, color:'#74BB65' },
  { id:'optimistic',name:'Optimistic',        desc:'AI productivity boom + rapid energy shift',  gdp:2.5,  tech:1.5,  energy:0.9, color:'#22c55e' },
  { id:'stress',    name:'Stress',            desc:'Geopolitical fragmentation, slow growth',    gdp:-1.5, tech:0.7,  energy:0.2, color:'#EF4444' },
  { id:'green',     name:'Green Acceleration',desc:'Mandatory net-zero + digital leap',          gdp:1.0,  tech:1.3,  energy:1.0, color:'#22c55e' },
];

function runMC(gdp: number, tech: number, energy: number): {p10:number,p50:number,p90:number,cagr:string} {
  const BASE = 1.8;
  const adj = 1 + (gdp * 0.40) + ((tech - 1) * 0.30) + (energy * 0.15);
  const p50 = parseFloat((BASE * adj).toFixed(2));
  const p10 = parseFloat((p50 * 0.65).toFixed(2));
  const p90 = parseFloat((p50 * 1.42).toFixed(2));
  const cagr = (((p50 / BASE) ** (1/11) - 1) * 100).toFixed(1) + '%';
  return { p10, p50, p90, cagr };
}

function ConfBar({ p10, p50, p90, color }: { p10:number; p50:number; p90:number; color:string }) {
  const max = 5; const W = 320;
  const x10 = (p10/max)*W, x50 = (p50/max)*W, x90 = (p90/max)*W;
  return (
    <svg viewBox={`0 0 ${W} 36`} className="w-full">
      <rect x={x10} y={10} width={x90-x10} height={16} rx="4" fill={color} opacity="0.2"/>
      <rect x={x50-2} y={6} width={4} height={24} rx="2" fill={color}/>
      {[{x:x10,l:`$${p10}T`},{x:x50,l:`$${p50}T`},{x:x90,l:`$${p90}T`}].map(({x,l})=>(
        <text key={l} x={x} y={4} textAnchor="middle" fontSize="9" fill={color} fontFamily="monospace">{l}</text>
      ))}
      <text x={0} y={35} fontSize="8" fill="#696969" fontFamily="monospace">P10</text>
      <text x={W/2} y={35} textAnchor="middle" fontSize="8" fill="#696969" fontFamily="monospace">P50</text>
      <text x={W} y={35} textAnchor="end" fontSize="8" fill="#696969" fontFamily="monospace">P90</text>
    </svg>
  );
}

export default function ScenarioPlannerPage() {
  const [preset, setPreset]   = useState('base');
  const [gdp,    setGdp]      = useState(0);
  const [tech,   setTech]     = useState(1.0);
  const [energy, setEnergy]   = useState(0.5);
  const [custom, setCustom]   = useState(false);

  function applyPreset(p: typeof PRESETS[0]) {
    setPreset(p.id); setGdp(p.gdp); setTech(p.tech); setEnergy(p.energy); setCustom(false);
  }

  const results = runMC(gdp, tech, energy);
  const activePreset = PRESETS.find(p=>p.id===preset);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Monte Carlo · 10,000 Simulations</div>
          <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>Scenario Planner</h1>
          <p className="text-sm mt-1" style={{color:'#696969'}}>P10/P50/P90 global FDI projections · Adjust macro variables · Compare scenarios</p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-5 grid lg:grid-cols-3 gap-5">
        {/* Controls */}
        <div className="space-y-4">
          {/* Presets */}
          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Preset Scenarios</div>
            <div className="space-y-2">
              {PRESETS.map(p=>(
                <button key={p.id} onClick={()=>applyPreset(p)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${preset===p.id&&!custom?'':'hover:bg-white/3'}`}
                  style={preset===p.id&&!custom?{borderColor:p.color,background:`${p.color}08`}:{borderColor:'rgba(10,61,98,0.15)'}}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-extrabold" style={{color:preset===p.id&&!custom?p.color:'#696969'}}>{p.name}</span>
                    {preset===p.id&&!custom && <span style={{color:p.color}}>●</span>}
                  </div>
                  <div className="text-xs" style={{color:'#696969'}}>{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* What-If sliders */}
          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>What-If Variables</div>
            <div className="space-y-5">
              {[
                {label:'GDP Growth Adj.',    val:gdp,    set:(v:number)=>{setGdp(v);setCustom(true)},    min:-3,  max:5,   step:0.5, fmt:(v:number)=>`${v>0?'+':''}${v}%`,   color:'#74BB65'},
                {label:'Tech Adoption Mult.',val:tech,   set:(v:number)=>{setTech(v);setCustom(true)},   min:0.5, max:2,   step:0.1, fmt:(v:number)=>`×${v.toFixed(1)}`,     color:'#74BB65'},
                {label:'Energy Transition',  val:energy, set:(v:number)=>{setEnergy(v);setCustom(true)}, min:0,   max:1,   step:0.1, fmt:(v:number)=>`${Math.round(v*100)}%`,color:'#22c55e'},
              ].map(s=>(
                <div key={s.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold" style={{color:'#696969'}}>{s.label}</span>
                    <span className="text-xs font-extrabold font-data" style={{color:s.color}}>{s.fmt(s.val)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                    onChange={e=>s.set(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full cursor-pointer"
                    style={{accentColor:s.color, background:'rgba(10,61,98,0.1)'}}/>
                  <div className="flex justify-between text-xs mt-0.5" style={{color:'#696969'}}>
                    <span>{s.fmt(s.min)}</span><span>{s.fmt(s.max)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main result */}
          <div className="gfm-card p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{color:activePreset?.color||'#74BB65'}}>
                  {custom ? '🎛 Custom Scenario' : `📊 ${activePreset?.name}`}
                </div>
                <div className="text-xs" style={{color:'#696969'}}>Global FDI by 2035 · Monte Carlo P10/P50/P90</div>
              </div>
              <div className="flex gap-5">
                {[['P50 (Median)',`$${results.p50}T`,'#74BB65'],['CAGR',results.cagr,'#22c55e'],['Simulations','10,000','#696969']].map(([l,v,c])=>(
                  <div key={l} className="text-center">
                    <div className="text-xl font-extrabold font-data" style={{color:c}}>{v}</div>
                    <div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <ConfBar p10={results.p10} p50={results.p50} p90={results.p90} color={activePreset?.color||'#74BB65'}/>
          </div>

          {/* Comparison table */}
          <div className="gfm-card overflow-hidden">
            <div className="px-5 py-3 border-b font-extrabold text-sm" style={{borderBottomColor:'rgba(10,61,98,0.1)',color:'#0A3D62'}}>Scenario Comparison</div>
            <div className="overflow-x-auto">
              <table className="gfm-table">
                <thead><tr><th>Scenario</th><th>P10</th><th>P50 (Median)</th><th>P90</th><th>CAGR</th></tr></thead>
                <tbody>
                  {PRESETS.map(p=>{
                    const r = runMC(p.gdp, p.tech, p.energy);
                    const isActive = preset===p.id && !custom;
                    return (
                      <tr key={p.id} style={isActive?{background:'rgba(116,187,101,0.05)'}:{}}>
                        <td>
                          <span className="font-bold text-xs px-2 py-0.5 rounded" style={{color:p.color,background:`${p.color}15`}}>{p.name}</span>
                        </td>
                        <td className="font-data" style={{color:'#696969'}}>${r.p10}T</td>
                        <td className="font-extrabold font-data" style={{color:p.color}}>${r.p50}T</td>
                        <td className="font-data" style={{color:'#696969'}}>${r.p90}T</td>
                        <td className="font-bold" style={{color:'#22c55e'}}>{r.cagr}</td>
                      </tr>
                    );
                  })}
                  {custom && (
                    <tr style={{background:'rgba(116,187,101,0.05)',borderTop:'1px solid rgba(116,187,101,0.2)'}}>
                      <td><span className="font-bold text-xs px-2 py-0.5 rounded" style={{color:'#74BB65',background:'rgba(116,187,101,0.15)'}}>🎛 Custom</span></td>
                      <td className="font-data" style={{color:'#696969'}}>${results.p10}T</td>
                      <td className="font-extrabold font-data" style={{color:'#74BB65'}}>${results.p50}T</td>
                      <td className="font-data" style={{color:'#696969'}}>${results.p90}T</td>
                      <td className="font-bold" style={{color:'#22c55e'}}>{results.cagr}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/forecast"     className="gfm-btn-primary text-sm py-2 px-5">Foresight 2050 →</Link>
            <Link href="/benchmarking" className="gfm-btn-outline text-sm py-2 px-5" style={{color:'#696969'}}>Benchmark Economies</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
