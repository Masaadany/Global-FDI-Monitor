'use client';
import PreviewGate from '@/components/PreviewGate';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const ECONOMIES = [
  {iso3:'SGP',name:'Singapore',    flag:'🇸🇬',color:'#0A3D62',scores:{macro:89,policy:92,digital:94,human:88,infra:91,sustain:82}},
  {iso3:'ARE',name:'UAE',          flag:'🇦🇪',color:'#74BB65',scores:{macro:83,policy:85,digital:88,human:75,infra:87,sustain:72}},
  {iso3:'USA',name:'USA',          flag:'🇺🇸',color:'#74BB65',scores:{macro:88,policy:84,digital:90,human:86,infra:85,sustain:76}},
  {iso3:'DEU',name:'Germany',      flag:'🇩🇪',color:'#696969',scores:{macro:80,policy:84,digital:80,human:84,infra:82,sustain:80}},
  {iso3:'IND',name:'India',        flag:'🇮🇳',color:'#22c55e',scores:{macro:62,policy:60,digital:58,human:55,infra:54,sustain:52}},
  {iso3:'SAU',name:'Saudi Arabia', flag:'🇸🇦',color:'#0A66C2',scores:{macro:76,policy:74,digital:72,human:68,infra:75,sustain:65}},
  {iso3:'AUS',name:'Australia',    flag:'🇦🇺',color:'#0A3D62',scores:{macro:84,policy:86,digital:84,human:86,infra:83,sustain:78}},
  {iso3:'VNM',name:'Vietnam',      flag:'🇻🇳',color:'#22c55e',scores:{macro:59,policy:56,digital:54,human:60,infra:56,sustain:48}},
];

const DIMS = ['macro','policy','digital','human','infra','sustain'] as const;
const DIM_LABELS: Record<string,string> = {macro:'Macro',policy:'Policy',digital:'Digital',human:'Human',infra:'Infra',sustain:'Sustain'};

function RadarChart({ selected, allEco }: { selected: string[]; allEco: typeof ECONOMIES }) {
  const cx=180, cy=180, R=150, N=DIMS.length;
  const angle=(i:number) => (i/N)*Math.PI*2 - Math.PI/2;
  const pt=(r:number, i:number) => [cx+r*Math.cos(angle(i)), cy+r*Math.sin(angle(i))];

  return (
    <svg viewBox="0 0 360 360" className="w-full max-w-sm mx-auto">
      {/* Grid rings */}
      {[20,40,60,80,100].map(v=>(
        <polygon key={v} fill="none" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"
          points={DIMS.map((_,i)=>{const [x,y]=pt((v/100)*R,i);return `${x},${y}`;}).join(' ')}/>
      ))}
      {/* Axes */}
      {DIMS.map((_,i)=>{
        const [x,y]=pt(R,i);
        const [lx,ly]=pt(R+18,i);
        const d = DIMS[i];
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(10,61,98,0.2)" strokeWidth="0.5"/>
            <text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#696969">{DIM_LABELS[d]}</text>
          </g>
        );
      })}
      {/* Data polygons */}
      {selected.map(iso3=>{
        const eco = allEco.find(e=>e.iso3===iso3);
        if (!eco) return null;
        const pts = DIMS.map((d,i)=>{const [x,y]=pt((eco.scores[d]/100)*R,i);return `${x},${y}`;}).join(' ');
        return (
          <g key={iso3}>
            <polygon points={pts} fill={eco.color} fillOpacity="0.15" stroke={eco.color} strokeWidth="2"/>
            {DIMS.map((d,i)=>{
              const [x,y]=pt((eco.scores[d]/100)*R,i);
              return <circle key={d} cx={x} cy={y} r="3" fill={eco.color}/>;
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function BenchmarkingPage() {
  const [selected, setSelected] = useState(['SGP','ARE','USA']);

  function toggle(iso3: string) {
    if (selected.includes(iso3)) { if (selected.length>1) setSelected(s=>s.filter(x=>x!==iso3)); }
    else if (selected.length < 5) setSelected(s=>[...s,iso3]);
  }

  const selEcos = ECONOMIES.filter(e=>selected.includes(e.iso3));

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Comparative Intelligence</div>
          <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>Economy Benchmarking</h1>
          <p className="text-sm mt-1" style={{color:'#696969'}}>Select up to 5 economies · 6 GFR dimensions · SVG radar chart</p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        {/* Economy selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ECONOMIES.map(e=>(
            <button key={e.iso3} onClick={()=>toggle(e.iso3)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border transition-all"
              style={selected.includes(e.iso3)
                ?{background:`${e.color}20`,borderColor:e.color,color:'#0A3D62'}
                :{borderColor:'rgba(10,61,98,0.2)',color:'#696969'}}>
              <span>{e.flag}</span><span>{e.name}</span>
              {selected.includes(e.iso3) && <span style={{color:e.color}}>●</span>}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="gfm-card p-6">
            <div className="font-extrabold text-sm mb-4" style={{color:'#0A3D62'}}>Radar Comparison</div>
            <RadarChart selected={selected} allEco={ECONOMIES}/>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {selEcos.map(e=>(
                <div key={e.iso3} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{background:e.color}}/>
                  <span style={{color:'#696969'}}>{e.flag} {e.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension table */}
          <div className="gfm-card overflow-hidden">
            <div className="px-5 py-3 border-b font-extrabold text-sm" style={{borderBottomColor:'rgba(10,61,98,0.1)',color:'#0A3D62'}}>Dimension Scores</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b" style={{borderBottomColor:'rgba(10,61,98,0.08)'}}>
                    <th className="text-left px-4 py-2 font-bold" style={{color:'#696969'}}>Dimension</th>
                    {selEcos.map(e=>(
                      <th key={e.iso3} className="text-center px-3 py-2 font-bold" style={{color:e.color}}>{e.flag} {e.iso3}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DIMS.map(d=>(
                    <tr key={d} className="border-b" style={{borderBottomColor:'rgba(10,61,98,0.05)'}}>
                      <td className="px-4 py-2.5 font-semibold capitalize" style={{color:'#696969'}}>{DIM_LABELS[d]}</td>
                      {selEcos.map(e=>{
                        const v = e.scores[d];
                        const best = Math.max(...selEcos.map(x=>x.scores[d]));
                        return (
                          <td key={e.iso3} className="px-3 py-2.5 text-center">
                            <span className="font-extrabold font-data" style={{color:v===best?e.color:'#696969'}}>{v}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr style={{borderTop:'1px solid rgba(10,61,98,0.15)'}}>
                    <td className="px-4 py-3 font-extrabold text-sm" style={{color:'#0A3D62'}}>GFR Composite</td>
                    {selEcos.map(e=>{
                      const W=[0.20,0.18,0.15,0.15,0.15,0.17];
                      const gfr = DIMS.reduce((a,d,i)=>a+e.scores[d]*W[i],0);
                      const best = Math.max(...selEcos.map(x=>DIMS.reduce((a,d,i)=>a+x.scores[d]*W[i],0)));
                      return (
                        <td key={e.iso3} className="px-3 py-3 text-center font-extrabold font-data" style={{color:Math.abs(gfr-best)<0.1?'#0A3D62':'#74BB65'}}>
                          {gfr.toFixed(1)}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <Link href="/gfr"             className="gfm-btn-primary text-sm py-2 px-5">Full GFR Rankings →</Link>
          <Link href="/gfr/methodology" className="gfm-btn-outline text-sm py-2 px-5" style={{color:'#696969'}}>Methodology</Link>
        </div>
      </div>
    </div>
  );
}
