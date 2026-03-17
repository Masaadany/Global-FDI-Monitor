'use client';
import { useState, useCallback } from 'react';

const FDI_BY_REGION = [
  {r:'EAP',v:486,color:'#06b6d4'},{r:'ECA',v:312,color:'#3b82f6'},
  {r:'NAM',v:333,color:'#10b981'},{r:'SAS',v:74, color:'#8b5cf6'},
  {r:'MENA',v:88, color:'#f59e0b'},{r:'LAC',v:142,color:'#f97316'},
  {r:'SSA',v:28, color:'#ef4444'},
];

const SECTOR_TREND = [
  {s:'ICT',  y2021:720,y2022:1120,y2023:1480,y2024:1640,y2025:1840,color:'#3b82f6'},
  {s:'Energy',y2021:580,y2022:680, y2023:780, y2024:880, y2025:980, color:'#8b5cf6'},
  {s:'Finance',y2021:820,y2022:900,y2023:980, y2024:1100,y2025:1210,color:'#10b981'},
  {s:'Mfg',  y2021:640,y2022:690, y2023:740, y2024:790, y2025:820, color:'#f59e0b'},
];

const TOP_DESTINATIONS = [
  {eco:'USA', v:285,color:'#10b981'},{eco:'SGP',v:141,color:'#3b82f6'},
  {eco:'IRL', v:94, color:'#3b82f6'},{eco:'NLD',v:92, color:'#3b82f6'},
  {eco:'IND', v:71, color:'#8b5cf6'},{eco:'BRA',v:65, color:'#f97316'},
  {eco:'AUS', v:59, color:'#06b6d4'},{eco:'GBR',v:52, color:'#3b82f6'},
  {eco:'ARE', v:30, color:'#f59e0b'},{eco:'JPN',v:30, color:'#06b6d4'},
];

const QUARTERLY_FDI = [
  {q:'Q1\'24',v:410},{q:'Q2\'24',v:440},{q:'Q3\'24',v:468},{q:'Q4\'24',v:495},
  {q:'Q1\'25',v:512},{q:'Q2\'25',v:480},{q:'Q3\'25',v:525},{q:'Q4\'25',v:548},
  {q:'Q1\'26',v:565},
];

type ChartType = 'regional'|'sector'|'destinations'|'quarterly'|'donut';

function BarH({ data, maxV, color }: { data:{label:string;v:number}[]; maxV:number; color?:string }) {
  return (
    <div className="space-y-2">
      {data.map(d=>(
        <div key={d.label} className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-10 flex-shrink-0 text-right">{d.label}</span>
          <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700 flex items-center pl-2"
              style={{width:`${Math.max(3,(d.v/maxV)*100)}%`,background:color||'#3b82f6'}}>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 w-12 text-right">${d.v}B</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data:{q:string;v:number}[] }) {
  const W=500, H=120, pad=30;
  const maxV=Math.max(...data.map(d=>d.v));
  const minV=Math.min(...data.map(d=>d.v))*0.9;
  const pts=data.map((d,i)=>({
    x:pad+i*(W-pad*2)/(data.length-1),
    y:pad+(H-pad*2)*(1-(d.v-minV)/(maxV-minV)),
    q:d.q, v:d.v,
  }));
  const path=pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area=`${path} L${pts[pts.length-1].x},${H-pad} L${pts[0].x},${H-pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0.25,0.5,0.75,1].map(t=>{
        const y=pad+(H-pad*2)*(1-t);
        return <line key={t} x1={pad} y1={y} x2={W-pad} y2={y} stroke="#f1f5f9" strokeWidth="1"/>;
      })}
      <path d={area} fill="#3b82f615"/>
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill="#3b82f6"/>
          {i%2===0&&<text x={p.x} y={H-pad+12} fontSize="8" textAnchor="middle" fill="#94a3b8">{p.q}</text>}
        </g>
      ))}
    </svg>
  );
}

function DonutChart({ data }: { data:{r:string;v:number;color:string}[] }) {
  const total=data.reduce((s,d)=>s+d.v,0);
  const cx=80,cy=80,r=65,inner=38;
  let angle=-Math.PI/2;
  const slices=data.map(d=>{
    const sa=angle, ea=angle+(d.v/total)*2*Math.PI;
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa);
    const x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const ix1=cx+inner*Math.cos(sa),iy1=cy+inner*Math.sin(sa);
    const ix2=cx+inner*Math.cos(ea),iy2=cy+inner*Math.sin(ea);
    const large=ea-sa>Math.PI?1:0;
    const path=`M${ix1.toFixed(1)},${iy1.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${ix2.toFixed(1)},${iy2.toFixed(1)} A${inner},${inner} 0 ${large} 0 ${ix1.toFixed(1)},${iy1.toFixed(1)} Z`;
    angle=ea;
    return {...d,path};
  });
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 160 160" className="w-40 h-40 flex-shrink-0">
        {slices.map(s=><path key={s.r} d={s.path} fill={s.color}/>)}
        <text x={cx} y={cy-4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#0A2540">${(total/1000).toFixed(1)}T</text>
        <text x={cx} y={cy+8} textAnchor="middle" fontSize="8" fill="#94a3b8">Global FDI</text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {slices.map(s=>(
          <div key={s.r} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:s.color}}/>
            <span className="text-xs text-slate-600 flex-1">{s.r}</span>
            <span className="text-xs font-bold text-slate-600">${s.v}B</span>
            <span className="text-xs text-slate-400 w-8 text-right">{((s.v/total)*100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdvancedAnalytics() {
  const [chart, setChart] = useState<ChartType>('regional');

  const CHARTS: {k:ChartType;l:string}[] = [
    {k:'regional',    l:'Regional FDI'},
    {k:'sector',      l:'Sector Trends'},
    {k:'destinations',l:'Top Destinations'},
    {k:'quarterly',   l:'Quarterly Trend'},
    {k:'donut',       l:'Regional Share'},
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div className="font-black text-sm text-[#0A2540]">FDI Intelligence Charts — 2025</div>
        <div className="flex gap-1 flex-wrap">
          {CHARTS.map(({k,l})=>(
            <button key={k} onClick={()=>setChart(k)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${chart===k?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200 hover:border-blue-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {chart==='regional' && (
          <div>
            <div className="text-xs text-slate-400 mb-3 font-semibold">FDI Inflows by Region 2025 ($B) — Total $1.46T</div>
            <BarH data={FDI_BY_REGION.map(d=>({label:d.r,v:d.v}))} maxV={500}/>
          </div>
        )}

        {chart==='sector' && (
          <div>
            <div className="text-xs text-slate-400 mb-3 font-semibold">FDI by Sector 2021–2025 ($B)</div>
            <div className="space-y-4">
              {SECTOR_TREND.map(s=>{
                const vals=[s.y2021,s.y2022,s.y2023,s.y2024,s.y2025];
                const maxV=Math.max(...vals);
                return (
                  <div key={s.s}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-600">{s.s}</span>
                      <span className="font-black" style={{color:s.color}}>${s.y2025}B (+{(((s.y2025-s.y2021)/s.y2021)*100).toFixed(0)}% 4yr)</span>
                    </div>
                    <div className="flex gap-1 h-4">
                      {vals.map((v,i)=>(
                        <div key={i} className="flex-1 rounded-sm" style={{background:`${s.color}${Math.round(40+i*15).toString(16).padStart(2,'0')}`}} title={`${2021+i}: $${v}B`}/>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-300 mt-0.5">
                      {[2021,2022,2023,2024,2025].map(y=><span key={y}>{y}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chart==='destinations' && (
          <div>
            <div className="text-xs text-slate-400 mb-3 font-semibold">Top 10 FDI Destination Economies 2025 ($B)</div>
            <BarH data={TOP_DESTINATIONS.map(d=>({label:d.eco,v:d.v}))} maxV={300}/>
          </div>
        )}

        {chart==='quarterly' && (
          <div>
            <div className="text-xs text-slate-400 mb-3 font-semibold">Global FDI Quarterly Trend 2024–Q1 2026 ($B)</div>
            <LineChart data={QUARTERLY_FDI}/>
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-8">
              <span>Min: ${Math.min(...QUARTERLY_FDI.map(d=>d.v))}B</span>
              <span>Latest: ${QUARTERLY_FDI[QUARTERLY_FDI.length-1].v}B</span>
              <span>Max: ${Math.max(...QUARTERLY_FDI.map(d=>d.v))}B</span>
            </div>
          </div>
        )}

        {chart==='donut' && (
          <div>
            <div className="text-xs text-slate-400 mb-3 font-semibold">FDI Share by Region 2025</div>
            <DonutChart data={FDI_BY_REGION}/>
          </div>
        )}
      </div>
    </div>
  );
}
