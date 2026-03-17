'use client';
import { useState, useMemo } from 'react';
import { exportCSV, exportPrintHTML } from '@/lib/export';

const GFR_DATA: Record<string,{name:string;composite:number;macro:number;policy:number;digital:number;human:number;infra:number;sustain:number;tier:string}> = {
  SGP:{name:'Singapore',   composite:88.5,macro:87,policy:91,digital:87,human:63,infra:94,sustain:62,tier:'FRONTIER'},
  CHE:{name:'Switzerland', composite:87.5,macro:87,policy:88,digital:86,human:70,infra:90,sustain:78,tier:'FRONTIER'},
  USA:{name:'United States',composite:84.5,macro:89,policy:83,digital:91,human:74,infra:86,sustain:68,tier:'FRONTIER'},
  NOR:{name:'Norway',      composite:83.2,macro:88,policy:90,digital:84,human:71,infra:85,sustain:82,tier:'FRONTIER'},
  AUS:{name:'Australia',   composite:82.1,macro:83,policy:85,digital:82,human:69,infra:84,sustain:76,tier:'FRONTIER'},
  ARE:{name:'UAE',         composite:80.0,macro:82,policy:78,digital:84,human:54,infra:92,sustain:53,tier:'FRONTIER'},
  GBR:{name:'UK',          composite:78.5,macro:80,policy:84,digital:82,human:71,infra:80,sustain:72,tier:'HIGH'},
  DEU:{name:'Germany',     composite:78.1,macro:81,policy:86,digital:78,human:70,infra:84,sustain:77,tier:'HIGH'},
  JPN:{name:'Japan',       composite:77.4,macro:79,policy:83,digital:80,human:68,infra:86,sustain:70,tier:'HIGH'},
  SAU:{name:'Saudi Arabia',composite:68.1,macro:74,policy:62,digital:72,human:48,infra:76,sustain:50,tier:'HIGH'},
  CHN:{name:'China',       composite:64.2,macro:68,policy:55,digital:72,human:62,infra:78,sustain:44,tier:'MEDIUM'},
  IND:{name:'India',       composite:62.3,macro:68,policy:56,digital:59,human:69,infra:65,sustain:38,tier:'MEDIUM'},
  BRA:{name:'Brazil',      composite:54.2,macro:56,policy:52,digital:56,human:55,infra:54,sustain:46,tier:'MEDIUM'},
  NGA:{name:'Nigeria',     composite:42.1,macro:46,policy:36,digital:42,human:40,infra:36,sustain:36,tier:'EMERGING'},
  EGY:{name:'Egypt',       composite:52.4,macro:55,policy:48,digital:52,human:48,infra:58,sustain:42,tier:'MEDIUM'},
  VNM:{name:'Vietnam',     composite:58.2,macro:62,policy:58,digital:55,human:52,infra:58,sustain:48,tier:'MEDIUM'},
  IDN:{name:'Indonesia',   composite:57.1,macro:60,policy:56,digital:54,human:52,infra:58,sustain:52,tier:'MEDIUM'},
  ZAF:{name:'South Africa',composite:51.3,macro:52,policy:54,digital:52,human:46,infra:50,sustain:52,tier:'MEDIUM'},
};
const DIMS = ['macro','policy','digital','human','infra','sustain'];
const DIM_LABELS = ['Macro','Policy','Digital','Human','Infra','Sustain'];
const TIER_COLORS: Record<string,string> = {FRONTIER:'#7C3AED',HIGH:'#0A66C2',MEDIUM:'#D97706',EMERGING:'#EA580C',DEVELOPING:'#6B7280'};

function RadarChart({economies,data}:{economies:string[];data:typeof GFR_DATA}) {
  const cx=160, cy=150, R=110;
  const N = DIMS.length;
  const PALETTE = ['#0A66C2','#059669','#D97706','#7C3AED','#EF4444'];

  function toXY(dimIdx:number, val:number) {
    const angle = (dimIdx/N)*2*Math.PI - Math.PI/2;
    const r = (val/100)*R;
    return { x: cx + r*Math.cos(angle), y: cy + r*Math.sin(angle) };
  }

  // Axis lines + labels
  const axes = DIMS.map((_,i)=>{
    const angle=(i/N)*2*Math.PI-Math.PI/2;
    return {x1:cx,y1:cy,x2:cx+R*Math.cos(angle),y2:cy+R*Math.sin(angle),lx:cx+(R+18)*Math.cos(angle),ly:cy+(R+18)*Math.sin(angle),label:DIM_LABELS[i]};
  });

  // Grid rings
  const rings = [25,50,75,100].map(r=>{
    const pts=DIMS.map((_,i)=>{
      const angle=(i/N)*2*Math.PI-Math.PI/2;
      const rr=(r/100)*R;
      return `${cx+rr*Math.cos(angle)},${cy+rr*Math.sin(angle)}`;
    }).join(' ');
    return {pts,r};
  });

  return (
    <svg viewBox="0 0 320 300" className="w-full max-w-xs mx-auto">
      {rings.map(({pts,r})=><polygon key={r} points={pts} fill="none" stroke="#E2E8F0" strokeWidth="0.5"/>)}
      {axes.map((a,i)=>(
        <g key={i}>
          <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke="#E2E8F0" strokeWidth="0.5"/>
          <text x={a.lx} y={a.ly} fontSize="10" textAnchor="middle" dominantBaseline="middle" fill="#94A3B8" fontWeight="600">{a.label}</text>
        </g>
      ))}
      {economies.slice(0,5).map((iso,ei)=>{
        const eco=data[iso]; if(!eco) return null;
        const vals=[eco.macro,eco.policy,eco.digital,eco.human,eco.infra,eco.sustain];
        const pts=vals.map((v,i)=>{const {x,y}=toXY(i,v);return `${x.toFixed(1)},${y.toFixed(1)}`;}).join(' ');
        const col=PALETTE[ei];
        return(
          <g key={iso}>
            <polygon points={pts} fill={col} fillOpacity="0.1" stroke={col} strokeWidth="1.5"/>
            {vals.map((v,i)=>{const {x,y}=toXY(i,v);return <circle key={i} cx={x} cy={y} r={3} fill={col}/>;})}
          </g>
        );
      })}
    </svg>
  );
}

export default function BenchmarkingPage() {
  const [ecos,   setEcos]   = useState(['ARE','SGP','SAU','IND','DEU']);
  const [adding, setAdding] = useState('');
  const PALETTE = ['#0A66C2','#059669','#D97706','#7C3AED','#EF4444'];

  function addEco(iso:string) { if(iso&&!ecos.includes(iso)&&GFR_DATA[iso]&&ecos.length<5){setEcos(e=>[...e,iso]);setAdding('');} }
  function removeEco(iso:string) { if(ecos.length>2)setEcos(e=>e.filter(x=>x!==iso)); }

  const tableData = useMemo(()=>ecos.map(iso=>{const d=GFR_DATA[iso];return{iso,...d};}), [ecos]);

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Comparative Analysis</div>
          <h1 className="text-4xl font-extrabold mb-2">Economy Benchmarking</h1>
          <p className="text-white/70">Compare up to 5 economies across all GFR dimensions. Radar + table view.</p>
        </div>
      </section>

      {/* Economy selector */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400 mr-1">ECONOMIES:</span>
          {ecos.map((iso,i)=>{
            const d=GFR_DATA[iso]; if(!d) return null;
            return(
              <div key={iso} className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full border text-xs font-semibold" style={{borderColor:PALETTE[i],color:PALETTE[i],background:`${PALETTE[i]}10`}}>
                <span>{iso}</span>
                {ecos.length>2&&<button onClick={()=>removeEco(iso)} className="opacity-60 hover:opacity-100 font-bold ml-0.5">×</button>}
              </div>
            );
          })}
          {ecos.length<5&&(
            <select value={adding} onChange={e=>{setAdding(e.target.value);addEco(e.target.value);}}
              className="text-xs border border-dashed border-primary rounded-full px-2.5 py-1 text-primary focus:outline-none cursor-pointer">
              <option value="">+ Add economy</option>
              {Object.keys(GFR_DATA).filter(k=>!ecos.includes(k)).map(k=><option key={k}>{k}</option>)}
            </select>
          )}
          <div className="ml-auto flex gap-2">
            <button onClick={()=>exportCSV(tableData.map(d=>({ISO:d.iso,Economy:d.name,Composite:d.composite,Macro:d.macro,Policy:d.policy,Digital:d.digital,Human:d.human,Infra:d.infra,Sustain:d.sustain,Tier:d.tier})),'GFM_Benchmarking')}
              className="gfm-btn-outline text-xs py-1.5">Export CSV</button>
            <button onClick={()=>exportPrintHTML('GFM Benchmarking — '+ecos.join(' vs '), `<p>${ecos.join(', ')}</p>`)}
              className="gfm-btn-outline text-xs py-1.5">Print</button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Radar chart */}
          <div className="gfm-card p-5">
            <div className="font-extrabold text-deep text-sm mb-3">Radar Comparison</div>
            <RadarChart economies={ecos} data={GFR_DATA}/>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {ecos.map((iso,i)=>(
                <div key={iso} className="flex items-center gap-1.5 text-xs font-semibold" style={{color:PALETTE[i]}}>
                  <div className="w-3 h-0.5 rounded" style={{background:PALETTE[i]}}/>
                  {iso}
                </div>
              ))}
            </div>
          </div>
          {/* Score bars */}
          <div className="gfm-card p-5">
            <div className="font-extrabold text-deep text-sm mb-4">Composite GFR Score</div>
            {tableData.map((e,i)=>(
              <div key={e.iso} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-deep">{e.iso} — {e.name}</span>
                  <span className="font-extrabold font-mono" style={{color:PALETTE[i]}}>{e.composite}</span>
                </div>
                <div className="gfm-progress">
                  <div className="gfm-progress-fill" style={{width:`${e.composite}%`,background:PALETTE[i]}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full comparison table */}
        <div className="gfm-card overflow-x-auto">
          <table className="w-full gfm-table">
            <thead>
              <tr>
                <th>Economy</th>
                <th className="text-center">GFR</th>
                <th className="text-center">Tier</th>
                {DIM_LABELS.map(d=><th key={d} className="text-center">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {tableData.map((e,i)=>{
                const tc=TIER_COLORS[e.tier]||'#6B7280';
                return(
                  <tr key={e.iso}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{background:PALETTE[i]}}/>
                        <div><div className="font-bold text-deep text-xs">{e.name}</div><div className="text-slate-400 text-xs font-mono">{e.iso}</div></div>
                      </div>
                    </td>
                    <td className="text-center font-extrabold font-mono text-lg" style={{color:PALETTE[i]}}>{e.composite}</td>
                    <td className="text-center"><span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{background:tc}}>{e.tier}</span></td>
                    {DIMS.map(d=>(
                      <td key={d} className="text-center">
                        <div className="font-mono text-xs font-semibold text-slate-600">{(e as any)[d]}</div>
                        <div className="h-1 bg-slate-100 rounded-full mt-0.5 mx-auto w-10">
                          <div className="h-full rounded-full" style={{width:`${(e as any)[d]}%`,background:PALETTE[i]}}/>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={()=>window.location.href='/subscription'} className="gfm-btn-primary px-6 py-2.5">Generate Benchmark Report — 15 FIC</button>
          <button className="gfm-btn-outline px-6 py-2.5">+ Compare Historical</button>
        </div>
      </div>
    </div>
  );
}
