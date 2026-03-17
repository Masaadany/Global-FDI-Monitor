'use client';
import { useState, useMemo } from 'react';

// Simplified world map using country centroids for bubble placement
const COUNTRY_POSITIONS: Record<string,[number,number]> = {
  // [lon, lat] → converted to SVG x,y
  USA:[-100,38],CAN:[-96,56],MEX:[-102,24],BRA:[-51,-10],ARG:[-65,-34],
  CHL:[-71,-30],COL:[-74,4],PER:[-76,-10],VEN:[-66,8],ECU:[-78,-2],
  GBR:[-2,54],FRA:[2,46],DEU:[10,51],ITA:[12,42],ESP:[-4,40],
  PRT:[-8,39],NLD:[5,52],BEL:[4,51],CHE:[8,47],AUT:[14,47],
  POL:[20,52],CZE:[16,50],HUN:[19,47],ROU:[25,46],BGR:[25,43],
  NOR:[10,62],SWE:[18,60],DNK:[10,56],FIN:[26,64],GRC:[22,39],
  TUR:[35,39],RUS:[60,60],UKR:[32,49],KAZ:[67,48],UZB:[63,41],
  SAU:[45,25],ARE:[54,24],QAT:[51,25],KWT:[48,29],OMN:[57,22],
  BHR:[50,26],JOR:[36,31],ISR:[35,32],LBN:[36,34],EGY:[30,27],
  MAR:[6,32],TUN:[9,34],DZA:[2,28],LBY:[17,27],NGA:[8,10],
  GHA:[-2,8],KEN:[38,-1],ETH:[40,9],ZAF:[25,-29],TZA:[34,-6],
  UGA:[32,1],RWA:[30,-2],MZQ:[35,-18],ANG:[18,-12],CMR:[12,6],
  IND:[78,20],CHN:[104,35],JPN:[138,36],KOR:[128,37],TWN:[121,24],
  HKG:[114,22],SGP:[104,1],MYS:[108,4],IDN:[117,-2],PHL:[122,13],
  THA:[101,15],VNM:[108,16],MMR:[96,17],BGD:[90,24],PAK:[70,30],
  LKA:[81,8],NPL:[84,28],AFG:[67,33],IRN:[53,33],IRQ:[44,33],
  AUS:[134,-26],NZL:[172,-42],FJI:[178,-18],PNG:[145,-6],
  ZMB:[28,-15],ZWE:[30,-20],BWA:[24,-22],NAM:[18,-22],MWI:[34,-14],
};

// Convert lon/lat to SVG coords (mercator approximation)
function toSVG(lon: number, lat: number, W=800, H=450): [number,number] {
  const x = (lon + 180) / 360 * W;
  const latRad = lat * Math.PI / 180;
  const mercN  = Math.log(Math.tan(Math.PI/4 + latRad/2));
  const y      = H/2 - (mercN * H / (2 * Math.PI));
  return [Math.round(x), Math.round(y)];
}

// Simplified continent paths
const CONTINENTS = [
  {name:'North America',color:'#1e3a5f',d:'M 40,60 L 220,50 L 250,130 L 200,200 L 130,210 L 60,170 Z'},
  {name:'South America',color:'#1e3a5f',d:'M 150,220 L 230,215 L 250,310 L 200,390 L 150,380 L 130,310 Z'},
  {name:'Europe',       color:'#1e3a5f',d:'M 310,45 L 420,40 L 440,100 L 400,130 L 310,120 Z'},
  {name:'Africa',       color:'#1e3a5f',d:'M 310,135 L 420,130 L 435,260 L 390,350 L 330,340 L 305,240 Z'},
  {name:'Asia',         color:'#1e3a5f',d:'M 425,40 L 680,35 L 710,180 L 620,240 L 490,220 L 420,130 Z'},
  {name:'SE Asia',      color:'#1e3a5f',d:'M 590,195 L 660,190 L 665,250 L 600,255 Z'},
  {name:'Australia',   color:'#1e3a5f',d:'M 600,290 L 720,280 L 730,370 L 610,375 Z'},
];

const FDI_DATA: Record<string,{fdi_b:number;grade:'PLATINUM'|'GOLD'|'SILVER'|'BRONZE';name:string}> = {
  USA:{fdi_b:285,grade:'PLATINUM',name:'United States'},
  CHN:{fdi_b:163,grade:'PLATINUM',name:'China'},
  SGP:{fdi_b:141,grade:'PLATINUM',name:'Singapore'},
  IRL:{fdi_b:94, grade:'PLATINUM',name:'Ireland'},
  NLD:{fdi_b:92, grade:'GOLD',    name:'Netherlands'},
  IND:{fdi_b:71, grade:'GOLD',    name:'India'},
  BRA:{fdi_b:65, grade:'GOLD',    name:'Brazil'},
  AUS:{fdi_b:59, grade:'GOLD',    name:'Australia'},
  DEU:{fdi_b:35, grade:'GOLD',    name:'Germany'},
  ARE:{fdi_b:30, grade:'PLATINUM',name:'UAE'},
  JPN:{fdi_b:30, grade:'GOLD',    name:'Japan'},
  GBR:{fdi_b:52, grade:'GOLD',    name:'United Kingdom'},
  SAU:{fdi_b:28, grade:'GOLD',    name:'Saudi Arabia'},
  FRA:{fdi_b:28, grade:'SILVER',  name:'France'},
  KOR:{fdi_b:18, grade:'SILVER',  name:'South Korea'},
  VNM:{fdi_b:18, grade:'GOLD',    name:'Vietnam'},
  MEX:{fdi_b:36, grade:'SILVER',  name:'Mexico'},
  IDN:{fdi_b:22, grade:'GOLD',    name:'Indonesia'},
  EGY:{fdi_b:9,  grade:'SILVER',  name:'Egypt'},
  NGA:{fdi_b:4,  grade:'SILVER',  name:'Nigeria'},
  MAR:{fdi_b:3,  grade:'SILVER',  name:'Morocco'},
  KEN:{fdi_b:1,  grade:'BRONZE',  name:'Kenya'},
  ZAF:{fdi_b:5,  grade:'SILVER',  name:'South Africa'},
  QAT:{fdi_b:5,  grade:'SILVER',  name:'Qatar'},
};

const GRADE_COLORS: Record<string,string> = {
  PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'
};

type Metric = 'fdi_b';

export default function FDIWorldMap() {
  const [hovered, setHovered] = useState<string|null>(null);
  const [filter,  setFilter]  = useState<string>('');
  const W=800, H=450;

  const bubbles = useMemo(() => Object.entries(COUNTRY_POSITIONS).map(([iso3,[lon,lat]]) => {
    const [x,y] = toSVG(lon,lat,W,H);
    const data   = FDI_DATA[iso3];
    if (!data) return null;
    const r = Math.max(4, Math.min(28, Math.sqrt(data.fdi_b) * 1.6));
    return { iso3, x, y, r, ...data };
  }).filter(Boolean), [W,H]);

  const totalFDI = Object.values(FDI_DATA).reduce((s,d)=>s+d.fdi_b,0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div>
          <div className="font-black text-sm text-[#0A2540]">FDI World Map — 2025</div>
          <div className="text-xs text-slate-400">Total: ${totalFDI.toFixed(0)}B · Bubble size ∝ FDI volume</div>
        </div>
        <div className="flex gap-2">
          {Object.entries(GRADE_COLORS).map(([g,c])=>(
            <button key={g} onClick={()=>setFilter(filter===g?'':g)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${filter===g?'text-white':'text-slate-500 border-slate-200'}`}
              style={filter===g?{background:c,borderColor:c}:{}}>
              <div className="w-2 h-2 rounded-full" style={{background:c}}/>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full"
          style={{background:'radial-gradient(ellipse at 50% 50%, #f0f4f8 0%, #e2e8f0 100%)'}}>
          {/* Ocean */}
          <rect width={W} height={H} fill="#dbeafe" opacity="0.3"/>
          {/* Continents */}
          {CONTINENTS.map(c=>(
            <path key={c.name} d={c.d} fill={c.color} stroke="#334155" strokeWidth="0.5" opacity="0.9"/>
          ))}
          {/* Graticule */}
          {[-60,-30,0,30,60].map(lat=>{
            const [,y]=toSVG(0,lat,W,H);
            return <line key={lat} x1={0} y1={y} x2={W} y2={y} stroke="#cbd5e1" strokeWidth="0.3" strokeDasharray="4,4"/>;
          })}
          {[-120,-60,0,60,120].map(lon=>{
            const [x]=toSVG(lon,0,W,H);
            return <line key={lon} x1={x} y1={0} x2={x} y2={H} stroke="#cbd5e1" strokeWidth="0.3" strokeDasharray="4,4"/>;
          })}
          {/* FDI bubbles */}
          {bubbles.filter(b=>!filter||b!.grade===filter).map(b=>{
            if(!b) return null;
            const isHov = hovered === b.iso3;
            const col   = GRADE_COLORS[b.grade];
            return (
              <g key={b.iso3} onMouseEnter={()=>setHovered(b.iso3)} onMouseLeave={()=>setHovered(null)}
                style={{cursor:'pointer'}}>
                {isHov && <circle cx={b.x} cy={b.y} r={b.r*1.6} fill={col} opacity="0.15"/>}
                <circle cx={b.x} cy={b.y} r={b.r} fill={col} opacity="0.85" stroke="white" strokeWidth="0.8"/>
                {b.r > 10 && (
                  <text x={b.x} y={b.y+3} textAnchor="middle" fontSize="7" fill="white" fontWeight="700">{b.iso3}</text>
                )}
                {isHov && (
                  <g>
                    <rect x={b.x+b.r+2} y={b.y-16} width={90} height={34} rx={4} fill="#0f172a" opacity="0.92"/>
                    <text x={b.x+b.r+6} y={b.y-3}  fontSize="9" fill={col}   fontWeight="700">{b.name}</text>
                    <text x={b.x+b.r+6} y={b.y+10}  fontSize="10" fill="white" fontWeight="900">${b.fdi_b}B FDI</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between px-5 py-2 border-t border-slate-100 text-xs text-slate-400">
        <span>Source: UNCTAD WIR 2025 · GFM Intelligence</span>
        <span>{bubbles.filter(b=>b&&(!filter||b.grade===filter)).length} economies shown</span>
      </div>
    </div>
  );
}
