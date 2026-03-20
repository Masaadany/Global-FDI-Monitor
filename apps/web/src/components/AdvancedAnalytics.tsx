'use client';
import { useState } from 'react';
import Link from 'next/link';

const QUARTERLY = [
  {q:'Q1 24',global:4.1,mena:0.28,tech:1.12},{q:'Q2 24',global:4.3,mena:0.30,tech:1.18},
  {q:'Q3 24',global:4.0,mena:0.31,tech:1.22},{q:'Q4 24',global:4.5,mena:0.34,tech:1.31},
  {q:'Q1 25',global:4.2,mena:0.33,tech:1.28},{q:'Q2 25',global:4.7,mena:0.36,tech:1.38},
  {q:'Q3 25',global:4.9,mena:0.38,tech:1.44},{q:'Q4 25',global:5.2,mena:0.41,tech:1.55},
];

const REGION_DATA = [
  {r:'Asia-Pacific',  v:33,c:'#74BB65'},{r:'North America',v:24,c:'#74BB65'},
  {r:'Europe',        v:22,c:'#0A3D62'},{r:'MENA',         v:8, c:'#696969'},
  {r:'Latin America', v:7, c:'#696969'},{r:'Africa',       v:4, c:'#0F3538'},
  {r:'Other',         v:2, c:'#0F2021'},
];

const SECTORS = [
  {s:'💻 ICT',         pct:30,c:'#74BB65'},{s:'⚡ Energy',   pct:21,c:'#0A3D62'},
  {s:'🏭 Manufacturing',pct:18,c:'#74BB65'},{s:'💰 Finance',  pct:14,c:'#696969'},
  {s:'🏗 Real Estate', pct:10,c:'#696969'},{s:'🌾 Other',    pct:7, c:'#0F3538'},
];

function LineChart({ data, keys, colors, height=120 }: { data:any[]; keys:string[]; colors:string[]; height?:number }) {
  const w=520; const pad={l:32,r:16,t:8,b:20};
  const cw=w-pad.l-pad.r; const ch=height-pad.t-pad.b;
  const maxV = Math.max(...data.flatMap(d=>keys.map(k=>d[k])));
  const x=(i:number)=>pad.l+(i/(data.length-1))*cw;
  const y=(v:number)=>pad.t+(1-v/maxV)*ch;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full">
      {[0.25,0.5,0.75,1].map(f=>(
        <line key={f} x1={pad.l} y1={pad.t+ch*(1-f)} x2={w-pad.r} y2={pad.t+ch*(1-f)}
          stroke="rgba(10,61,98,0.12)" strokeWidth={0.5}/>
      ))}
      {keys.map((k,ki)=>{
        const pts=data.map((d,i)=>`${x(i)},${y(d[k])}`).join(' ');
        return <polyline key={k} fill="none" stroke={colors[ki]} strokeWidth={2} points={pts} strokeLinejoin="round"/>;
      })}
      {keys.map((k,ki)=>(
        <circle key={k} cx={x(data.length-1)} cy={y(data[data.length-1][k])} r={3} fill={colors[ki]}/>
      ))}
      {data.map((d,i)=>i%2===0&&(
        <text key={d.q} x={x(i)} y={height-4} textAnchor="middle" fontSize={8} fill="#696969">{d.q}</text>
      ))}
    </svg>
  );
}

function DonutChart({ data }: { data:{r:string;v:number;c:string}[] }) {
  const cx=80; const cy=80; const R=65; const r=40;
  let angle=-Math.PI/2;
  const total=data.reduce((a,d)=>a+d.v,0);
  const slices = data.map(d=>{
    const start=angle; const sweep=(d.v/total)*2*Math.PI; angle+=sweep;
    const x1=cx+R*Math.cos(start); const y1=cy+R*Math.sin(start);
    const x2=cx+R*Math.cos(start+sweep); const y2=cy+R*Math.sin(start+sweep);
    const xi1=cx+r*Math.cos(start+sweep); const yi1=cy+r*Math.sin(start+sweep);
    const xi2=cx+r*Math.cos(start); const yi2=cy+r*Math.sin(start);
    const large=sweep>Math.PI?1:0;
    return {...d, path:`M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${xi1},${yi1} A${r},${r} 0 ${large},0 ${xi2},${yi2} Z`};
  });
  return (
    <svg viewBox="0 0 160 160" className="w-full max-w-40">
      {slices.map((s,i)=><path key={i} d={s.path} fill={s.c} stroke="#E2F2DF" strokeWidth={1}/>)}
      <text x={cx} y={cy-8} textAnchor="middle" fontSize={18} fontWeight="800" fill="#0A3D62" fontFamily="monospace">Q4</text>
      <text x={cx} y={cy+10} textAnchor="middle" fontSize={11} fill="#696969">2025</text>
    </svg>
  );
}

export default function AdvancedAnalytics({ compact=false }: { compact?: boolean }) {
  const [metricView, setMetricView] = useState<'trend'|'region'|'sector'>('trend');

  return (
    <div aria-label="AdvancedAnalytics component" className={`gfm-card ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="font-extrabold text-sm" style={{color:'#0A3D62'}}>📊 Advanced Analytics</div>
        <div className="flex gap-1">
          {(['trend','region','sector'] as const).map(v=>(
            <button key={v} onClick={()=>setMetricView(v)}
              className="text-xs px-3 py-1 rounded-lg font-bold capitalize transition-all border"
              style={metricView===v?{background:'#74BB65',color:'#E2F2DF',borderColor:'#74BB65'}:{borderColor:'rgba(10,61,98,0.2)',color:'#696969'}}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {metricView === 'trend' && (
        <div>
          <div className="flex gap-3 mb-3 flex-wrap">
            {[['Global FDI (T)','#74BB65'],['MENA (T)','#0A3D62'],['Tech (T)','#74BB65']].map(([l,c])=>(
              <div key={l} className="flex items-center gap-1.5 text-xs" style={{color:c as string}}>
                <div className="w-3 h-0.5 rounded" style={{background:c as string}}/>{l}
              </div>
            ))}
          </div>
          <LineChart data={QUARTERLY} keys={['global','mena','tech']} colors={['#74BB65','#0A3D62','#74BB65']}/>
          <div className="flex justify-between text-xs mt-1" style={{color:'#696969'}}>
            <span>Q1 2024</span><span>Q4 2025</span>
          </div>
        </div>
      )}

      {metricView === 'region' && (
        <div className="flex items-center gap-4">
          <DonutChart data={REGION_DATA}/>
          <div className="flex-1 space-y-1.5">
            {REGION_DATA.map(d=>(
              <div key={d.r} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.c}}/>
                <span className="text-xs flex-1" style={{color:'#696969'}}>{d.r}</span>
                <span className="text-xs font-extrabold font-data" style={{color:d.c}}>{d.v}%</span>
                <div className="w-16 bg-white/5 rounded-full h-1">
                  <div className="h-1 rounded-full" style={{width:`${d.v*2.5}%`,background:d.c}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {metricView === 'sector' && (
        <div className="space-y-2.5">
          {SECTORS.map(s=>(
            <div key={s.s} className="flex items-center gap-3">
              <span className="text-xs w-28 flex-shrink-0" style={{color:'#696969'}}>{s.s}</span>
              <div className="flex-1 bg-white/5 rounded-full h-2.5">
                <div className="h-2.5 rounded-full" style={{width:`${s.pct*3}%`,background:s.c}}/>
              </div>
              <span className="text-xs font-extrabold font-data w-8" style={{color:s.c}}>{s.pct}%</span>
            </div>
          ))}
        </div>
      )}

      {!compact && (
        <div className="flex gap-2 mt-4">
          <Link href="/analytics"  className="text-xs font-bold" style={{color:'#74BB65'}}>Full Analytics →</Link>
          <span style={{color:'#696969'}}>·</span>
          <Link href="/benchmarking" className="text-xs font-bold" style={{color:'#696969'}}>Benchmark →</Link>
        </div>
      )}
    </div>
  );
}
