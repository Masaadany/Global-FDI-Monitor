'use client';
import { useState, useEffect, useRef } from 'react';

const YEARS = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];

// Hotspot data: [x%, y%, radius, grade, label, value]
const HOTSPOTS_BY_YEAR: Record<number, Array<[number,number,number,string,string,string]>> = {
  2015:[[22,35,14,'GOLD','North America','$380B'],[48,30,12,'SILVER','Europe','$290B'],[70,45,10,'SILVER','East Asia','$240B']],
  2018:[[22,35,16,'GOLD','North America','$410B'],[48,30,14,'GOLD','Europe','$310B'],[70,45,13,'GOLD','East Asia','$280B'],[58,55,8,'SILVER','South Asia','$60B']],
  2020:[[22,35,10,'SILVER','North America','$180B'],[48,30,9,'SILVER','Europe','$140B'],[70,45,11,'SILVER','East Asia','$220B'],[58,42,6,'SILVER','MENA','$40B']],
  2022:[[22,35,17,'PLATINUM','North America','$480B'],[48,30,15,'GOLD','Europe','$350B'],[70,45,14,'GOLD','East Asia','$320B'],[58,55,11,'GOLD','South Asia','$70B'],[58,42,10,'GOLD','MENA','$55B']],
  2025:[[22,35,20,'PLATINUM','North America','$620B'],[48,30,16,'GOLD','Europe','$380B'],[70,45,16,'GOLD','East Asia','$460B'],[58,55,14,'GOLD','South Asia','$90B'],[58,42,15,'PLATINUM','MENA','$88B'],[75,60,10,'SILVER','SE Asia','$70B'],[30,65,9,'SILVER','Latin America','$142B']],
  2028:[[22,35,22,'PLATINUM','North America','$780B'],[48,30,18,'GOLD','Europe','$420B'],[70,45,18,'PLATINUM','East Asia','$560B'],[58,55,16,'GOLD','South Asia','$130B'],[58,42,17,'PLATINUM','MENA','$120B'],[75,60,13,'GOLD','SE Asia','$110B']],
  2030:[[22,35,24,'PLATINUM','North America','$920B'],[48,30,20,'GOLD','Europe','$480B'],[70,45,20,'PLATINUM','East Asia','$680B'],[58,55,18,'PLATINUM','South Asia','$180B'],[58,42,19,'PLATINUM','MENA','$160B'],[75,60,15,'GOLD','SE Asia','$150B'],[30,65,12,'GOLD','Latin America','$200B']],
};

const GRADE_COLORS: Record<string,string> = {PLATINUM:'rgba(245,158,11,0.85)',GOLD:'rgba(16,185,129,0.8)',SILVER:'rgba(59,130,246,0.75)',BRONZE:'rgba(107,114,128,0.7)'};
const GRADE_RING:   Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

function getHotspots(year: number) {
  const years = Object.keys(HOTSPOTS_BY_YEAR).map(Number).sort();
  const lower  = years.filter(y=>y<=year).pop() || years[0];
  const upper  = years.find(y=>y>year) || years[years.length-1];
  if (lower === upper) return HOTSPOTS_BY_YEAR[lower];
  const t = (year-lower)/(upper-lower);
  const lo = HOTSPOTS_BY_YEAR[lower];
  const hi = HOTSPOTS_BY_YEAR[upper]||lo;
  return lo.map((h,i): [number,number,number,string,string,string] => {
    const h2 = hi[i] || h;
    return [
      h[0]+(h2[0]-h[0])*t, h[1]+(h2[1]-h[1])*t,
      h[2]+(h2[2]-h[2])*t,
      h[3], h[4], h[5]
    ];
  });
}

const CONTINENT_PATHS = [
  {name:'North America', d:'M 120,80 L 180,75 L 210,110 L 200,170 L 155,175 L 120,140 Z', fill:'#1e3a5f'},
  {name:'South America',d:'M 165,190 L 195,185 L 210,230 L 185,290 L 155,280 L 145,230 Z', fill:'#1e3a5f'},
  {name:'Europe',       d:'M 270,60 L 320,55 L 340,90 L 320,110 L 275,105 Z', fill:'#1e3a5f'},
  {name:'Africa',       d:'M 270,120 L 320,115 L 335,200 L 305,260 L 270,240 L 260,180 Z', fill:'#1e3a5f'},
  {name:'Asia',         d:'M 330,60 L 460,55 L 480,130 L 430,170 L 350,155 L 320,110 Z', fill:'#1e3a5f'},
  {name:'SE Asia',      d:'M 420,165 L 465,160 L 470,200 L 430,205 Z', fill:'#1e3a5f'},
  {name:'Australia',   d:'M 410,220 L 470,215 L 475,265 L 420,270 Z', fill:'#1e3a5f'},
];

export default function Globe4D() {
  const [yearIdx, setYearIdx]   = useState(10); // 2025
  const [playing, setPlaying]   = useState(false);
  const [hovered, setHovered]   = useState<number|null>(null);
  const [filter,  setFilter]    = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const year = YEARS[yearIdx];
  const hotspots = getHotspots(year);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setYearIdx(i => { if (i >= YEARS.length-1) { setPlaying(false); return i; } return i+1; });
      }, 600);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const totalFDI = hotspots.reduce((s,h) => s + parseFloat(h[5].replace(/[$B]/g,'')), 0);
  const isProjection = year > 2025;

  return (
    <div className="bg-[#030d1a] rounded-2xl border border-blue-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-blue-900">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
          <span className="text-xs font-black text-blue-300 uppercase tracking-widest">4D FDI Intelligence Globe</span>
          {isProjection && <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded-full font-bold">PROJECTION</span>}
        </div>
        <div className="flex items-center gap-3">
          <select value={filter} onChange={e=>setFilter(e.target.value)}
            className="bg-blue-950 border border-blue-800 text-blue-300 text-xs px-2 py-1 rounded-lg">
            <option value="">All regions</option>
            {hotspots.map(h=><option key={h[4]} value={h[4]}>{h[4]}</option>)}
          </select>
          <div className="text-xs font-black text-white">
            {year} · <span className="text-blue-400">${totalFDI.toFixed(0)}B total</span>
          </div>
        </div>
      </div>

      {/* Globe SVG */}
      <div className="relative">
        <svg viewBox="0 0 600 320" className="w-full" style={{background:'radial-gradient(ellipse at 50% 40%, #0d1f35 0%, #030d1a 100%)'}}>
          {/* Grid lines */}
          {[0,1,2,3].map(i => (
            <ellipse key={`h${i}`} cx="300" cy="160" rx={280} ry={80-(i*15)} fill="none" stroke="#0d2845" strokeWidth="0.5"/>
          ))}
          {[0,30,60,90,120,150].map(deg => {
            const r = deg*Math.PI/180;
            const x = 300 + 280*Math.cos(r); const y = 160 + 40*Math.sin(r);
            return <line key={`v${deg}`} x1={300} y1={120} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="#0d2845" strokeWidth="0.5"/>;
          })}
          {/* Continents */}
          {CONTINENT_PATHS.map(c => (
            <path key={c.name} d={c.d} fill={c.fill} stroke="#1e3a5f" strokeWidth="0.5"/>
          ))}
          {/* FDI hotspots */}
          {hotspots.filter(h=>!filter||h[4]===filter).map((h, i) => {
            const [x,y,r,grade,name,val] = h;
            const px = (x/100)*600; const py = (y/100)*320;
            const isHov = hovered === i;
            return (
              <g key={i} style={{cursor:'pointer'}}
                onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
                {/* Pulse rings */}
                {isHov && [1,2].map(ring=>(
                  <circle key={ring} cx={px} cy={py} r={r*ring*0.7}
                    fill="none" stroke={GRADE_RING[grade]} strokeWidth="0.8" opacity={0.3/ring}/>
                ))}
                {/* Main dot */}
                <circle cx={px} cy={py} r={r*0.55}
                  fill={GRADE_COLORS[grade]} stroke={GRADE_RING[grade]}
                  strokeWidth={isHov?2:1} opacity={0.9}/>
                {/* Label */}
                {(isHov || r > 14) && (
                  <g>
                    <rect x={px+r*0.6} y={py-14} width={70} height={28} rx={4}
                      fill="#0d1f35" stroke="#1e3a5f" strokeWidth="0.5"/>
                    <text x={px+r*0.6+4} y={py-3} fontSize="8" fill={GRADE_RING[grade]} fontWeight="bold">{name}</text>
                    <text x={px+r*0.6+4} y={py+8} fontSize="9" fill="white" fontWeight="900">{val}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Time slider */}
      <div className="px-5 py-4 border-t border-blue-900">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={()=>setPlaying(p=>!p)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${playing?'bg-red-600 text-white':'bg-blue-600 text-white hover:bg-blue-500'}`}>
            {playing ? '⏹' : '▶'}
          </button>
          <div className="flex-1">
            <input type="range" min={0} max={YEARS.length-1} value={yearIdx}
              onChange={e=>setYearIdx(parseInt(e.target.value))}
              className="w-full accent-blue-500"/>
            <div className="flex justify-between text-xs text-blue-700 mt-0.5 px-0.5">
              <span>2015</span><span className="text-blue-400 font-bold">{year}</span><span>2030 (proj)</span>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(GRADE_RING).map(([g,c])=>(
            <div key={g} className="flex items-center gap-1.5 text-xs text-blue-400">
              <div className="w-2.5 h-2.5 rounded-full" style={{background:c}}/>
              {g}
            </div>
          ))}
          <span className="text-xs text-blue-700 ml-auto">Bubble size ∝ FDI volume</span>
        </div>
      </div>
    </div>
  );
}
