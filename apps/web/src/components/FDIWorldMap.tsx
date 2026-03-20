'use client';
import { useState } from 'react';
import Link from 'next/link';

type Signal = { iso3: string; lat: number; lon: number; grade: string; capex_m: number; company: string };

const HOTSPOTS: Signal[] = [
  {iso3:'ARE',lat:24.4, lon:54.4, grade:'PLATINUM', capex_m:850,  company:'Microsoft'},
  {iso3:'SAU',lat:24.7, lon:46.7, grade:'PLATINUM', capex_m:980,  company:'ACWA Power'},
  {iso3:'IND',lat:20.6, lon:78.9, grade:'PLATINUM', capex_m:1100, company:'NVIDIA'},
  {iso3:'IDN',lat:-0.8, lon:113.9,grade:'PLATINUM', capex_m:3200, company:'CATL'},
  {iso3:'VNM',lat:14.1, lon:108.3,grade:'PLATINUM', capex_m:2100, company:'Samsung SDI'},
  {iso3:'SGP',lat:1.3,  lon:103.8,grade:'GOLD',     capex_m:620,  company:'Google Cloud'},
  {iso3:'EGY',lat:26.8, lon:30.8, grade:'GOLD',     capex_m:890,  company:'TotalEnergies'},
  {iso3:'MAR',lat:31.8, lon:-7.1, grade:'GOLD',     capex_m:380,  company:'Renault'},
  {iso3:'DEU',lat:51.2, lon:10.4, grade:'GOLD',     capex_m:340,  company:'Siemens'},
  {iso3:'USA',lat:37.1, lon:-95.7,grade:'PLATINUM', capex_m:2400, company:'Multiple'},
];

const GRADE_COLORS: Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969',BRONZE:'#696969'};

// Equirectangular projection
function project(lat: number, lon: number, w: number, h: number): [number,number] {
  const x = ((lon + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return [x, y];
}

export default function FDIWorldMap({ signals = HOTSPOTS }: { signals?: Signal[] }) {
  const [hovered, setHovered] = useState<Signal|null>(null);
  const W = 800; const H = 400;

  return (
    <div className="gfm-card overflow-hidden" style={{position:'relative'}}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{borderBottomColor:'rgba(10,61,98,0.1)'}}>
        <div className="flex items-center gap-2">
          <span className="live-dot"/>
          <span className="text-xs font-extrabold uppercase tracking-widest" style={{color:'#696969'}}>Global FDI Signal Map</span>
        </div>
        <div className="flex gap-3 text-xs">
          {Object.entries(GRADE_COLORS).slice(0,3).map(([g,c])=>(
            <span key={g} className="flex items-center gap-1"><span style={{color:c,fontSize:16}}>●</span>{g}</span>
          ))}
        </div>
      </div>

      <div style={{position:'relative',background:'radial-gradient(ellipse at 50% 40%, #0F3538 0%, #0F0A0A 100%)'}}>
        <svg role="img" aria-label="FDI World Map — global investment flow visualization" viewBox={`0 0 ${W} ${H}`} className="w-full" style={{opacity:0.9}}>
          {/* Ocean background */}
          <rect width={W} height={H} fill="#0F1A1C"/>
          {/* Latitude grid */}
          {[-60,-30,0,30,60].map(lat=>{
            const [,y]=project(lat,0,W,H);
            return <line key={lat} x1={0} y1={y} x2={W} y2={y} stroke="rgba(10,61,98,0.06)" strokeWidth={0.5}/>;
          })}
          {/* Longitude grid */}
          {[-120,-60,0,60,120].map(lon=>{
            const [x]=project(0,lon,W,H);
            return <line key={lon} x1={x} y1={0} x2={x} y2={H} stroke="rgba(10,61,98,0.06)" strokeWidth={0.5}/>;
          })}

          {/* Stylized continents (simplified) */}
          {/* North America */}
          <path d="M 70,90 L 160,80 L 180,110 L 170,160 L 140,180 L 100,170 L 70,140 Z" fill="#0F2021" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"/>
          {/* South America */}
          <path d="M 140,220 L 180,210 L 190,270 L 165,320 L 140,310 L 125,260 Z" fill="#0F2021" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"/>
          {/* Europe */}
          <path d="M 340,75 L 390,70 L 400,90 L 380,110 L 350,105 L 335,90 Z" fill="#0F2021" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"/>
          {/* Africa */}
          <path d="M 350,130 L 395,125 L 410,180 L 400,250 L 365,280 L 335,245 L 325,180 L 340,145 Z" fill="#0F2021" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"/>
          {/* Middle East */}
          <path d="M 410,130 L 455,125 L 465,155 L 440,165 L 415,160 Z" fill="#0F2021" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"/>
          {/* Asia */}
          <path d="M 455,70 L 630,65 L 650,90 L 640,140 L 600,155 L 550,150 L 490,130 L 460,105 Z" fill="#0F2021" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"/>
          {/* South/SE Asia */}
          <path d="M 520,160 L 580,155 L 595,185 L 570,200 L 530,190 Z" fill="#0F2021" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"/>
          {/* Australia */}
          <path d="M 570,240 L 650,235 L 665,280 L 640,310 L 590,305 L 565,270 Z" fill="#0F2021" stroke="rgba(10,61,98,0.15)" strokeWidth="0.5"/>

          {/* Investment flow arcs */}
          {[
            {from:[440,140],to:[540,175],color:'#74BB65'},
            {from:[160,120],to:[440,140],color:'#74BB65'},
            {from:[160,120],to:[530,170],color:'#0A3D62'},
          ].map((arc,i)=>{
            const mx=(arc.from[0]+arc.to[0])/2;
            const my=Math.min(arc.from[1],arc.to[1])-40;
            return (
              <path key={i} d={`M${arc.from[0]},${arc.from[1]} Q${mx},${my} ${arc.to[0]},${arc.to[1]}`}
                fill="none" stroke={arc.color} strokeWidth={1} strokeDasharray="4 3" opacity={0.4}/>
            );
          })}

          {/* Signal hotspots */}
          {signals.map((s,i)=>{
            const [x,y] = project(s.lat, s.lon, W, H);
            const c = GRADE_COLORS[s.grade] || '#696969';
            const isHov = hovered?.iso3 === s.iso3;
            return (
              <g key={i} style={{cursor:'pointer'}}
                onMouseEnter={()=>setHovered(s)} onMouseLeave={()=>setHovered(null)}>
                <circle cx={x} cy={y} r={isHov?12:8} fill={c} opacity={0.15}/>
                <circle cx={x} cy={y} r={isHov?6:4} fill={c} opacity={0.9}>
                  <animate attributeName="r" values={`${isHov?6:4};${isHov?8:6};${isHov?6:4}`} dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.9;0.5;0.9" dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div className="absolute top-3 right-3 p-3 rounded-xl z-10 pointer-events-none"
               style={{background:'rgba(10,61,98,0.04)0.95)',border:`1px solid ${GRADE_COLORS[hovered.grade]}40`,minWidth:160}}>
            <div className="text-xs font-extrabold mb-0.5" style={{color:GRADE_COLORS[hovered.grade]}}>{hovered.grade}</div>
            <div className="text-sm font-bold" style={{color:'#0A3D62'}}>{hovered.company}</div>
            <div className="text-xs" style={{color:'#696969'}}>{hovered.iso3} · ${hovered.capex_m}M</div>
          </div>
        )}

        {/* Bottom legend */}
        <div className="absolute bottom-2 left-3 text-xs" style={{color:'#696969'}}>
          {signals.length} active signals · Click any hotspot for details
        </div>
      </div>

      <div className="px-4 py-2 border-t text-center" style={{borderTopColor:'rgba(10,61,98,0.08)'}}>
        <Link href="/signals" className="text-xs font-bold" style={{color:'#74BB65'}}>View all {signals.length} signals →</Link>
      </div>
    </div>
  );
}
