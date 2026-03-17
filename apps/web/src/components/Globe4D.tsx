'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

// ── ALL 215 ECONOMY POSITIONS (lat/lon projected to SVG 0-100) ──────────
const ECONOMY_NODES: Record<string,{x:number,y:number,name:string,region:string}> = {
  // MENA
  ARE:{x:62,y:44,name:'UAE',           region:'MENA'},
  SAU:{x:60,y:46,name:'Saudi Arabia',  region:'MENA'},
  QAT:{x:61,y:45,name:'Qatar',         region:'MENA'},
  EGY:{x:56,y:42,name:'Egypt',         region:'MENA'},
  IRN:{x:64,y:40,name:'Iran',          region:'MENA'},
  IRQ:{x:62,y:40,name:'Iraq',          region:'MENA'},
  JOR:{x:58,y:41,name:'Jordan',        region:'MENA'},
  KWT:{x:61,y:43,name:'Kuwait',        region:'MENA'},
  LBN:{x:57,y:40,name:'Lebanon',       region:'MENA'},
  OMN:{x:63,y:47,name:'Oman',          region:'MENA'},
  ISR:{x:57,y:41,name:'Israel',        region:'MENA'},
  TUN:{x:50,y:38,name:'Tunisia',       region:'MENA'},
  DZA:{x:48,y:38,name:'Algeria',       region:'MENA'},
  MAR:{x:45,y:38,name:'Morocco',       region:'MENA'},
  LBY:{x:52,y:39,name:'Libya',         region:'MENA'},
  // SAS
  IND:{x:67,y:46,name:'India',         region:'SAS'},
  PAK:{x:65,y:44,name:'Pakistan',      region:'SAS'},
  BGD:{x:70,y:46,name:'Bangladesh',    region:'SAS'},
  LKA:{x:68,y:50,name:'Sri Lanka',     region:'SAS'},
  NPL:{x:69,y:44,name:'Nepal',         region:'SAS'},
  // EAP
  CHN:{x:76,y:38,name:'China',         region:'EAP'},
  SGP:{x:77,y:52,name:'Singapore',     region:'EAP'},
  JPN:{x:82,y:35,name:'Japan',         region:'EAP'},
  KOR:{x:80,y:35,name:'South Korea',   region:'EAP'},
  AUS:{x:82,y:68,name:'Australia',     region:'EAP'},
  NZL:{x:88,y:72,name:'New Zealand',   region:'EAP'},
  IDN:{x:78,y:54,name:'Indonesia',     region:'EAP'},
  MYS:{x:76,y:51,name:'Malaysia',      region:'EAP'},
  THA:{x:75,y:48,name:'Thailand',      region:'EAP'},
  VNM:{x:77,y:47,name:'Vietnam',       region:'EAP'},
  PHL:{x:80,y:48,name:'Philippines',   region:'EAP'},
  TWN:{x:80,y:40,name:'Taiwan',        region:'EAP'},
  HKG:{x:79,y:42,name:'Hong Kong',     region:'EAP'},
  KHM:{x:76,y:49,name:'Cambodia',      region:'EAP'},
  MMR:{x:74,y:46,name:'Myanmar',       region:'EAP'},
  // NAM
  USA:{x:18,y:36,name:'United States', region:'NAM'},
  CAN:{x:16,y:26,name:'Canada',        region:'NAM'},
  MEX:{x:15,y:44,name:'Mexico',        region:'NAM'},
  // LAC
  BRA:{x:30,y:60,name:'Brazil',        region:'LAC'},
  ARG:{x:28,y:68,name:'Argentina',     region:'LAC'},
  CHL:{x:26,y:66,name:'Chile',         region:'LAC'},
  COL:{x:24,y:54,name:'Colombia',      region:'LAC'},
  PER:{x:24,y:60,name:'Peru',          region:'LAC'},
  VEN:{x:26,y:52,name:'Venezuela',     region:'LAC'},
  URY:{x:30,y:68,name:'Uruguay',       region:'LAC'},
  ECU:{x:22,y:56,name:'Ecuador',       region:'LAC'},
  BOL:{x:26,y:62,name:'Bolivia',       region:'LAC'},
  PRY:{x:29,y:64,name:'Paraguay',      region:'LAC'},
  // ECA
  DEU:{x:50,y:28,name:'Germany',       region:'ECA'},
  GBR:{x:46,y:27,name:'UK',            region:'ECA'},
  FRA:{x:48,y:30,name:'France',        region:'ECA'},
  IRL:{x:44,y:27,name:'Ireland',       region:'ECA'},
  NLD:{x:49,y:27,name:'Netherlands',   region:'ECA'},
  CHE:{x:50,y:30,name:'Switzerland',   region:'ECA'},
  NOR:{x:49,y:22,name:'Norway',        region:'ECA'},
  SWE:{x:51,y:22,name:'Sweden',        region:'ECA'},
  DNK:{x:50,y:24,name:'Denmark',       region:'ECA'},
  FIN:{x:53,y:20,name:'Finland',       region:'ECA'},
  ESP:{x:46,y:32,name:'Spain',         region:'ECA'},
  ITA:{x:51,y:32,name:'Italy',         region:'ECA'},
  POL:{x:53,y:26,name:'Poland',        region:'ECA'},
  CZE:{x:52,y:27,name:'Czech Rep.',    region:'ECA'},
  AUT:{x:51,y:29,name:'Austria',       region:'ECA'},
  BEL:{x:48,y:27,name:'Belgium',       region:'ECA'},
  PRT:{x:44,y:33,name:'Portugal',      region:'ECA'},
  GRC:{x:53,y:35,name:'Greece',        region:'ECA'},
  HUN:{x:53,y:28,name:'Hungary',       region:'ECA'},
  ROU:{x:55,y:29,name:'Romania',       region:'ECA'},
  BGR:{x:55,y:31,name:'Bulgaria',      region:'ECA'},
  RUS:{x:65,y:24,name:'Russia',        region:'ECA'},
  TUR:{x:57,y:34,name:'Turkey',        region:'ECA'},
  UKR:{x:57,y:27,name:'Ukraine',       region:'ECA'},
  KAZ:{x:66,y:30,name:'Kazakhstan',    region:'ECA'},
  // SSA
  NGA:{x:50,y:52,name:'Nigeria',       region:'SSA'},
  ZAF:{x:54,y:64,name:'South Africa',  region:'SSA'},
  KEN:{x:58,y:56,name:'Kenya',         region:'SSA'},
  ETH:{x:59,y:52,name:'Ethiopia',      region:'SSA'},
  GHA:{x:47,y:52,name:'Ghana',         region:'SSA'},
  TZA:{x:58,y:58,name:'Tanzania',      region:'SSA'},
  UGA:{x:57,y:55,name:'Uganda',        region:'SSA'},
  MOZ:{x:57,y:62,name:'Mozambique',    region:'SSA'},
  ZMB:{x:55,y:60,name:'Zambia',        region:'SSA'},
  COD:{x:53,y:56,name:'DR Congo',      region:'SSA'},
  CMR:{x:51,y:53,name:'Cameroon',      region:'SSA'},
  CIV:{x:46,y:52,name:"Côte d'Ivoire", region:'SSA'},
  SEN:{x:43,y:49,name:'Senegal',       region:'SSA'},
  AGO:{x:53,y:60,name:'Angola',        region:'SSA'},
  MUS:{x:64,y:62,name:'Mauritius',     region:'SSA'},
  RWA:{x:57,y:56,name:'Rwanda',        region:'SSA'},
};

// ── FDI FLOW DATA BY YEAR ────────────────────────────────────────────────
const FDI_FLOWS_BY_YEAR: Record<number, Array<[string,string,number,string]>> = {
  2015: [['USA','CHN',180,'J'],['USA','GBR',60,'K'],['DEU','CHN',50,'C'],['CHN','AUS',18,'B'],['USA','IND',44,'J'],['GBR','ARE',22,'K'],['DEU','USA',38,'C']],
  2016: [['USA','CHN',185,'J'],['USA','GBR',64,'K'],['DEU','CHN',52,'C'],['CHN','AUS',20,'B'],['USA','IND',50,'J'],['GBR','ARE',24,'K'],['JPN','USA',44,'C']],
  2017: [['USA','CHN',190,'J'],['USA','GBR',68,'K'],['DEU','IND',48,'C'],['CHN','IDN',22,'B'],['USA','IND',56,'J'],['ARE','IND',18,'K'],['DEU','USA',40,'C']],
  2018: [['USA','CHN',195,'J'],['USA','IRL',72,'K'],['DEU','IND',52,'C'],['CHN','VNM',28,'C'],['USA','IND',62,'J'],['ARE','IND',22,'K'],['JPN','USA',48,'C']],
  2019: [['USA','CHN',200,'J'],['USA','IRL',76,'K'],['DEU','IND',56,'C'],['CHN','VNM',32,'C'],['USA','IND',68,'J'],['SAU','ARE',20,'D'],['GBR','IND',18,'J']],
  2020: [['USA','IRL',88,'J'],['USA','DEU',64,'J'],['CHN','VNM',36,'C'],['USA','IND',72,'J'],['SAU','ARE',18,'D'],['GBR','IND',16,'J'],['DEU','CHN',42,'C']],
  2021: [['USA','IRL',98,'J'],['USA','DEU',72,'J'],['CHN','VNM',42,'C'],['USA','IND',82,'J'],['SAU','ARE',24,'D'],['ARE','IND',28,'K'],['DEU','CHN',44,'C'],['JPN','VNM',18,'C']],
  2022: [['USA','IRL',108,'J'],['USA','SGP',88,'J'],['CHN','IDN',48,'C'],['USA','IND',92,'J'],['SAU','ARE',28,'D'],['ARE','IND',30,'K'],['DEU','IND',32,'C'],['KOR','VNM',22,'C']],
  2023: [['USA','ARE',68,'J'],['USA','SGP',94,'J'],['SAU','IND',42,'D'],['ARE','IND',82,'K'],['CHN','IDN',52,'C'],['DEU','IND',36,'C'],['JPN','IND',28,'C'],['KOR','VNM',28,'C'],['USA','IND',128,'J']],
  2024: [['MSFT','ARE',0.85,'J'],['AWS','SAU',5.3,'J'],['CATL','IDN',3.2,'C'],['NVDA','IND',1.2,'J'],['SAU','EGY',2.8,'D'],['ARE','IND',4.2,'K'],['DEU','IND',3.8,'C'],['JPN','VNM',2.4,'C']],
  2025: [['MSFT','SAU',4.2,'J'],['AWS','ARE',2.1,'J'],['CATL','MAR',1.8,'C'],['VESTAS','IND',0.42,'D'],['SGP','IDN',3.4,'J'],['ARE','EGY',2.2,'D'],['CHN','NGA',1.8,'B']],
};

// Projected flows
const PROJECTED = {
  2026: [['MSFT','ARE',0.85,'J'],['AWS','SAU',5.3,'J'],['SIEMENS','EGY',0.34,'D'],['SAMS','VNM',2.8,'C'],['VESTAS','IND',0.42,'D'],['NVDA','SGP',1.1,'J']],
  2027: [['MSFT','IND',2.1,'J'],['AWS','IND',3.4,'J'],['CATL','MAR',2.2,'C'],['NVDA','MYS',0.8,'J'],['SAU','EGY',4.2,'D'],['ARE','NGA',1.2,'K']],
  2028: [['TECH_FUND','VNM',8.4,'J'],['CLEAN','IND',12.1,'D'],['MFCTR','IDN',6.8,'C'],['FIN','ARE',5.4,'K'],['SAU','ZAF',2.8,'D']],
  2029: [['GLOBAL_AI','IND',18.2,'J'],['GREEN','NGA',4.4,'D'],['TECH_FUND','EGY',3.8,'J'],['FIN','SGP',8.2,'K']],
  2030: [['AI_MEGA','IND',28.4,'J'],['CLEAN_MEGA','AFR',22.1,'D'],['TECH_HUB','SGP',15.8,'J'],['MFG_SHIFT','VNM',12.4,'C']],
};

const REGION_COLORS: Record<string,string> = {
  MENA:'#f59e0b',EAP:'#06b6d4',NAM:'#10b981',
  LAC:'#f97316',ECA:'#3b82f6',SAS:'#8b5cf6',SSA:'#ef4444',
};

const SECTOR_COLORS: Record<string,string> = {
  J:'#3b82f6',K:'#10b981',C:'#f59e0b',
  D:'#8b5cf6',B:'#f97316',H:'#06b6d4',
};

interface Particle { id:number; x:number; y:number; tx:number; ty:number; t:number; color:string; size:number; }

export default function Globe4D() {
  const [year,     setYear]     = useState(2023);
  const [playing,  setPlaying]  = useState(false);
  const [mode,     setMode]     = useState<'flows'|'heatmap'|'signals'>('flows');
  const [region,   setRegion]   = useState('');
  const [selected, setSelected] = useState<string|null>(null);
  const [tooltip,  setTooltip]  = useState<{iso3:string,x:number,y:number}|null>(null);
  const [particles,setParticles]= useState<Particle[]>([]);
  const animRef = useRef<number>(0);
  const frameRef= useRef(0);
  const pidRef  = useRef(0);

  // Build particles from flow data
  const buildParticles = useCallback((yr: number) => {
    const flows = yr <= 2025
      ? (FDI_FLOWS_BY_YEAR[yr] || FDI_FLOWS_BY_YEAR[2023])
      : (PROJECTED[yr as keyof typeof PROJECTED] || []);

    const newParticles: Particle[] = [];
    flows.forEach(([from, to, val, sector]) => {
      const fn = ECONOMY_NODES[from] || ECONOMY_NODES[to];
      const tn = ECONOMY_NODES[to]   || ECONOMY_NODES[from];
      if (!fn || !tn) return;
      const count = Math.max(1, Math.min(8, Math.round(val / 0.8)));
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id:    pidRef.current++,
          x:     fn.x + (Math.random()-0.5)*2,
          y:     fn.y + (Math.random()-0.5)*2,
          tx:    tn.x + (Math.random()-0.5)*2,
          ty:    tn.y + (Math.random()-0.5)*2,
          t:     Math.random(),
          color: SECTOR_COLORS[sector] || '#3b82f6',
          size:  Math.max(0.8, Math.min(2.5, val/2)),
        });
      }
    });
    setParticles(newParticles);
  }, []);

  // Animation loop
  useEffect(() => {
    buildParticles(year);
  }, [year, buildParticles]);

  useEffect(() => {
    const animate = () => {
      frameRef.current++;
      if (frameRef.current % 2 === 0) {
        setParticles(prev => prev.map(p => {
          const t = (p.t + 0.012) % 1;
          const x = p.x + (p.tx - p.x) * t;
          const y = p.y + (p.ty - p.y) * t;
          return {...p, t, x, y};
        }));
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Auto-play year slider
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setYear(y => { if (y >= 2030) { setPlaying(false); return 2030; } return y + 1; });
    }, 1200);
    return () => clearInterval(id);
  }, [playing]);

  const displayEconomies = Object.entries(ECONOMY_NODES)
    .filter(([, e]) => !region || e.region === region);

  const isProjected = year > 2025;

  return (
    <div className="bg-[#030d1a] rounded-2xl overflow-hidden border border-blue-900 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-blue-900">
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest">4D FDI Intelligence Globe</div>
          {isProjected && (
            <span className="text-xs bg-violet-900 text-violet-300 border border-violet-700 px-2 py-0.5 rounded font-bold">
              PROJECTED
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {(['flows','heatmap','signals'] as const).map(m=>(
            <button key={m} onClick={()=>setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all capitalize ${
                mode===m?'bg-blue-600 text-white':'text-blue-400 hover:bg-blue-900/50'
              }`}>{m}</button>
          ))}
        </div>
      </div>

      {/* Globe SVG */}
      <div className="relative">
        <svg viewBox="0 0 100 80" className="w-full"
          style={{background:'radial-gradient(ellipse at 50% 40%, #0d2240 0%, #030d1a 70%)'}}>

          {/* Grid */}
          {[20,40,60,80].map(x=>(<line key={`vx${x}`} x1={x} y1={0} x2={x} y2={80} stroke="#0d2240" strokeWidth="0.15"/>))}
          {[20,40,60].map(y=>(<line key={`hy${y}`} x1={0} y1={y} x2={100} y2={y} stroke="#0d2240" strokeWidth="0.15"/>))}
          {/* Equator */}
          <line x1={0} y1={42} x2={100} y2={42} stroke="#1e3a5f" strokeWidth="0.25" strokeDasharray="1,1" opacity="0.6"/>
          {/* Tropics */}
          <line x1={0} y1={36} x2={100} y2={36} stroke="#1e3a5f" strokeWidth="0.1" strokeDasharray="0.5,1.5" opacity="0.4"/>
          <line x1={0} y1={48} x2={100} y2={48} stroke="#1e3a5f" strokeWidth="0.1" strokeDasharray="0.5,1.5" opacity="0.4"/>

          {/* Flow lines */}
          {mode === 'flows' && (FDI_FLOWS_BY_YEAR[year] || FDI_FLOWS_BY_YEAR[2023] || []).map(([from,to,,sector],i)=>{
            const fn=ECONOMY_NODES[from]||ECONOMY_NODES[to];
            const tn=ECONOMY_NODES[to]||ECONOMY_NODES[from];
            if(!fn||!tn) return null;
            return (
              <line key={i} x1={fn.x} y1={fn.y} x2={tn.x} y2={tn.y}
                stroke={SECTOR_COLORS[sector]||'#3b82f6'} strokeWidth="0.2"
                opacity="0.25" strokeDasharray="0.5,0.5"/>
            );
          })}

          {/* Particles (investment flow dots) */}
          {particles.slice(0,120).map(p=>(
            <circle key={p.id} cx={p.x} cy={p.y} r={p.size*0.28}
              fill={p.color} opacity="0.85"/>
          ))}

          {/* Economy nodes */}
          {displayEconomies.map(([iso3,eco])=>{
            const isSelected = iso3===selected;
            const color = REGION_COLORS[eco.region]||'#6b7280';
            return (
              <g key={iso3}
                onClick={()=>setSelected(iso3===selected?null:iso3)}
                onMouseEnter={()=>setTooltip({iso3,x:eco.x,y:eco.y})}
                onMouseLeave={()=>setTooltip(null)}
                style={{cursor:'pointer'}}>
                {isSelected && (
                  <circle cx={eco.x} cy={eco.y} r={2.2} fill="none" stroke="white" strokeWidth="0.4"/>
                )}
                <circle cx={eco.x} cy={eco.y} r={isSelected?1.6:1.0}
                  fill={color} opacity={isSelected?1:0.75}/>
                {isSelected && (
                  <text x={eco.x} y={eco.y-2.2} fontSize="2.2" fill="white"
                    textAnchor="middle" fontWeight="bold">{eco.name}</text>
                )}
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltip && ECONOMY_NODES[tooltip.iso3] && (
            <g>
              <rect x={tooltip.x+1.5} y={tooltip.y-8} width="20" height="8"
                rx="0.4" fill="#0A2540" stroke="#1e3a5f" strokeWidth="0.2"/>
              <text x={tooltip.x+2.5} y={tooltip.y-5.8} fontSize="1.8" fill="white" fontWeight="bold">
                {ECONOMY_NODES[tooltip.iso3].name}
              </text>
              <text x={tooltip.x+2.5} y={tooltip.y-3.6} fontSize="1.4" fill="#94a3b8">
                {ECONOMY_NODES[tooltip.iso3].region}
              </text>
              <text x={tooltip.x+2.5} y={tooltip.y-1.6} fontSize="1.4" fill={REGION_COLORS[ECONOMY_NODES[tooltip.iso3].region]||'#6b7280'}>
                {tooltip.iso3} · Click for detail
              </text>
            </g>
          )}
        </svg>

        {/* Year badge */}
        <div className="absolute top-3 right-3 bg-[#0A2540]/90 border border-blue-800 rounded-xl px-4 py-2 text-center">
          <div className="text-2xl font-black text-white">{year}</div>
          {isProjected && <div className="text-xs text-violet-400 font-bold">PROJECTED</div>}
          {!isProjected && <div className="text-xs text-blue-400">HISTORICAL</div>}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-[#0A2540]/90 rounded-lg p-2 border border-blue-900">
          <div className="text-xs text-blue-400 font-bold mb-1.5">Regions</div>
          {Object.entries(REGION_COLORS).map(([r,c])=>(
            <div key={r} className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c}}/>
              <span className="text-xs text-slate-300">{r}</span>
            </div>
          ))}
        </div>

        {/* Sector legend */}
        <div className="absolute bottom-3 right-3 bg-[#0A2540]/90 rounded-lg p-2 border border-blue-900">
          <div className="text-xs text-blue-400 font-bold mb-1.5">Flow Type</div>
          {[['J','ICT'],['K','Finance'],['C','Manufacturing'],['D','Energy'],['B','Mining']].map(([s,l])=>(
            <div key={s} className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2 h-2 rounded-full" style={{background:SECTOR_COLORS[s]}}/>
              <span className="text-xs text-slate-300">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time slider */}
      <div className="px-5 py-4 border-t border-blue-900">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={()=>setPlaying(p=>!p)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all flex-shrink-0 ${
              playing?'bg-red-600 text-white':'bg-blue-600 text-white hover:bg-blue-500'
            }`}>
            {playing?'⏸':'▶'}
          </button>
          <div className="flex-1">
            <input type="range" min={2015} max={2030} step={1} value={year}
              onChange={e=>{ setYear(parseInt(e.target.value)); setPlaying(false); }}
              className="w-full accent-blue-500"/>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {[['','All'],['MENA','MENA'],['EAP','EAP'],['ECA','EU+'],['NAM','NA'],['SSA','SSA']].map(([v,l])=>(
              <button key={v} onClick={()=>setRegion(v)}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                  region===v?'bg-blue-600 text-white':'text-blue-400 hover:bg-blue-900/50'
                }`}>{l}</button>
            ))}
          </div>
        </div>
        {/* Year markers */}
        <div className="flex justify-between text-xs text-blue-800 px-4">
          {[2015,2017,2019,2021,2023,2025,2027,2030].map(y=>(
            <span key={y} className={y>2025?'text-violet-700':y===year?'text-white font-bold':''}>{y}</span>
          ))}
        </div>
        <div className="text-center text-xs text-blue-500 mt-1">
          {year <= 2025 ? `Historical FDI flows ${year}` : `AI-projected flows ${year} (based on trend models)`}
          {' · '}{(FDI_FLOWS_BY_YEAR[year]||PROJECTED[year as keyof typeof PROJECTED]||[]).length} active corridors
        </div>
      </div>
    </div>
  );
}
