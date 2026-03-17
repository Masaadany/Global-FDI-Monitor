'use client';
import { exportCSV } from '@/lib/export';
import { useState } from 'react';

const GFR_DATA: Record<string,{name:string,composite:number,tier:string,macro:number,policy:number,digital:number,human:number,infra:number,sustain:number,fdi_b:number,gdp_b:number}> = {
  ARE: {name:'UAE',        composite:80.0,tier:'FRONTIER',macro:82,policy:78,digital:84,human:54,infra:92,sustain:53,fdi_b:30.7,gdp_b:504},
  SAU: {name:'Saudi Arabia',composite:68.1,tier:'HIGH',   macro:74,policy:62,digital:72,human:48,infra:76,sustain:50,fdi_b:28.3,gdp_b:1069},
  SGP: {name:'Singapore',  composite:88.5,tier:'FRONTIER',macro:87,policy:91,digital:87,human:63,infra:94,sustain:62,fdi_b:141.2,gdp_b:501},
  IND: {name:'India',      composite:62.3,tier:'MEDIUM',  macro:68,policy:56,digital:59,human:69,infra:65,sustain:38,fdi_b:71.0,gdp_b:3730},
  DEU: {name:'Germany',    composite:78.1,tier:'HIGH',    macro:81,policy:86,digital:78,human:70,infra:84,sustain:77,fdi_b:35.4,gdp_b:4430},
  GBR: {name:'UK',         composite:78.5,tier:'HIGH',    macro:80,policy:84,digital:82,human:71,infra:80,sustain:72,fdi_b:52.0,gdp_b:3079},
  USA: {name:'USA',        composite:84.5,tier:'FRONTIER',macro:89,policy:83,digital:91,human:74,infra:86,sustain:68,fdi_b:285.0,gdp_b:27360},
  VNM: {name:'Vietnam',    composite:58.2,tier:'MEDIUM',  macro:62,policy:58,digital:55,human:52,infra:58,sustain:48,fdi_b:18.1,gdp_b:430},
  EGY: {name:'Egypt',      composite:52.4,tier:'MEDIUM',  macro:55,policy:48,digital:52,human:48,infra:58,sustain:42,fdi_b:9.8,gdp_b:395},
  NGA: {name:'Nigeria',    composite:42.1,tier:'EMERGING',macro:46,policy:36,digital:42,human:40,infra:36,sustain:36,fdi_b:4.1,gdp_b:477},
};

const DIMS = ['macro','policy','digital','human','infra','sustain'] as const;
const DIM_LABELS: Record<string,string> = {macro:'Macro',policy:'Policy',digital:'Digital',human:'Human',infra:'Infra',sustain:'Sustain'};
const TIER_COLORS: Record<string,string> = {FRONTIER:'#10b981',HIGH:'#3b82f6',MEDIUM:'#f59e0b',EMERGING:'#ef4444',DEVELOPING:'#6b7280'};

function RadarChart({economies, colors}: {economies:string[], colors:string[]}) {
  const n=6; const cx=110; const cy=110; const r=85;
  function polar(i:number, v:number) {
    const a = (i*360/n-90)*Math.PI/180;
    return {x:cx+(v/100)*r*Math.cos(a), y:cy+(v/100)*r*Math.sin(a)};
  }
  const rings=[20,40,60,80,100];
  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-xs mx-auto">
      {rings.map(rv=>{
        const pts=DIMS.map((_,i)=>polar(i,rv));
        const d=pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')+'Z';
        return <path key={rv} d={d} fill="none" stroke="#e2e8f0" strokeWidth={rv===100?1:"0.5"}/>;
      })}
      {DIMS.map((_,i)=>{ const p=polar(i,100); return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#e2e8f0" strokeWidth="0.5"/>; })}
      {DIMS.map((d,i)=>{ const p=polar(i,115); return <text key={d} x={p.x} y={p.y} fontSize="9" textAnchor="middle" fill="#64748b" fontWeight="bold">{DIM_LABELS[d]}</text>; })}
      {economies.map((eco,ei)=>{
        const ed=GFR_DATA[eco]; if(!ed) return null;
        const pts=DIMS.map((_,i)=>polar(i,ed[DIMS[i]]));
        const d=pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')+'Z';
        const col=colors[ei];
        return <path key={eco} d={d} fill={`${col}25`} stroke={col} strokeWidth="1.5"/>;
      })}
      {economies.map((eco,ei)=>{
        const ed=GFR_DATA[eco]; if(!ed) return null;
        return DIMS.map((_,i)=>{ const p=polar(i,ed[DIMS[i]]); return <circle key={`${eco}-${i}`} cx={p.x} cy={p.y} r={3} fill={colors[ei]}/>; });
      })}
    </svg>
  );
}

const PALETTE = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6'];

export default function BenchmarkingPage() {
  const [ecos, setEcos]   = useState(['ARE','SGP','SAU']);
  const [view, setView]   = useState<'radar'|'bars'|'table'>('radar');

  function toggleEco(eco:string) {
    setEcos(prev => prev.includes(eco)?prev.filter(e=>e!==eco):prev.length<5?[...prev,eco]:prev);
  }

  const dimMax = (dim: typeof DIMS[number]) => Math.max(...ecos.map(e=>GFR_DATA[e]?.[dim]||0));
  const gaps = (eco: string) => DIMS.map(dim=>({dim,val:GFR_DATA[eco]?.[dim]||0,gap:(dimMax(dim))-(GFR_DATA[eco]?.[dim]||0)}));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Economy Benchmarking</span>
        <div className="flex gap-1 ml-4">
          {(['radar','bars','table'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${view===v?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>{v}</button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        {/* Economy selector */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-5">
          <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Select economies to compare (max 5)</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(GFR_DATA).map(([code,d],i)=>{
              const sel=ecos.includes(code);
              const col=sel?PALETTE[ecos.indexOf(code)]:undefined;
              return (
                <button key={code} onClick={()=>toggleEco(code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${sel?'text-white border-transparent':'text-slate-500 border-slate-200 hover:border-blue-300'}`}
                  style={sel?{background:col,borderColor:col}:{}}>
                  {sel && <span className="w-1.5 h-1.5 bg-white rounded-full"/>}
                  {code} — {d.name}
                  <span className="font-black">{d.composite}</span>
                  <span className="text-xs opacity-70">{d.tier[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Radar or bars */}
          <div className="md:col-span-2">
            {view==='radar' && (
              <div className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="font-black text-sm text-[#0A2540] mb-4">6-Dimension Radar Comparison</div>
                <RadarChart economies={ecos} colors={PALETTE}/>
                <div className="flex flex-wrap gap-3 justify-center mt-3">
                  {ecos.map((eco,i)=>(
                    <div key={eco} className="flex items-center gap-1.5 text-xs font-bold" style={{color:PALETTE[i]}}>
                      <div className="w-3 h-3 rounded-full" style={{background:PALETTE[i]}}/>
                      {GFR_DATA[eco]?.name} ({GFR_DATA[eco]?.composite})
                    </div>
                  ))}
                </div>
              </div>
            )}
            {view==='bars' && (
              <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
                <div className="font-black text-sm text-[#0A2540] mb-2">Dimension-by-Dimension</div>
                {DIMS.map(dim=>(
                  <div key={dim}>
                    <div className="text-xs font-bold text-slate-400 mb-1.5">{DIM_LABELS[dim]}</div>
                    <div className="space-y-1">
                      {ecos.map((eco,i)=>{
                        const v=GFR_DATA[eco]?.[dim]||0;
                        return (
                          <div key={eco} className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400 w-6">{eco}</span>
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{width:`${v}%`,background:PALETTE[i]}}/>
                            </div>
                            <span className="text-xs font-black w-6 text-right" style={{color:PALETTE[i]}}>{v}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {view==='table' && (
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-4 py-2.5 font-bold text-slate-400">Economy</th>
                      <th className="text-center px-3 py-2.5 font-bold text-slate-400">GFR</th>
                      {DIMS.map(d=><th key={d} className="text-center px-2 py-2.5 font-bold text-slate-400">{DIM_LABELS[d]}</th>)}
                      <th className="text-center px-3 py-2.5 font-bold text-slate-400">FDI $B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ecos.map((eco,i)=>{
                      const d=GFR_DATA[eco]; if(!d) return null;
                      return (
                        <tr key={eco} className="border-t border-slate-50">
                          <td className="px-4 py-3 font-bold" style={{color:PALETTE[i]}}>{d.name}</td>
                          <td className="text-center px-3 py-3 font-black text-lg text-[#0A2540]">{d.composite}</td>
                          {DIMS.map(dim=>{
                            const v=d[dim]; const mx=dimMax(dim);
                            return <td key={dim} className={`text-center px-2 py-3 font-bold ${v===mx?'text-emerald-600':'text-slate-600'}`}>{v}</td>;
                          })}
                          <td className="text-center px-3 py-3 font-bold text-blue-600">{d.fdi_b}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Gap analysis */}
          <div className="space-y-3">
            {ecos.map((eco,i)=>{
              const d=GFR_DATA[eco]; if(!d) return null;
              const gs=gaps(eco).sort((a,b)=>b.gap-a.gap);
              return (
                <div key={eco} className="bg-white rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:PALETTE[i]}}/>
                    <div className="font-black text-sm text-[#0A2540]">{d.name}</div>
                    <div className="ml-auto font-black text-xl text-blue-600">{d.composite}</div>
                  </div>
                  <div className="text-xs font-bold text-slate-400 mb-2">GAP ANALYSIS</div>
                  {gs.map(({dim,val,gap})=>(
                    <div key={dim} className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs text-slate-500 w-14">{DIM_LABELS[dim]}</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${val}%`,background:gap===0?'#10b981':PALETTE[i]}}/>
                      </div>
                      <span className="text-xs font-bold w-6 text-right text-slate-500">{val}</span>
                      {gap>0&&<span className="text-xs font-bold text-red-400 w-8">-{gap}</span>}
                      {gap===0&&<span className="text-xs font-bold text-emerald-500 w-8">BEST</span>}
                    </div>
                  ))}
                  <div className="mt-2 text-xs text-slate-400">
                    Weakest: <span className="font-bold text-red-500">{gs[0].dim} ({gs[0].val})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
