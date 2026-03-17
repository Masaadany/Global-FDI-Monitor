'use client';
import { useState, useEffect, useRef } from 'react';

// ── WORLD MAP DATA ─────────────────────────────────────────────────────────
// Simplified country positions for SVG world map (x,y as % of viewBox)
const COUNTRIES: Record<string, {
  name: string; x: number; y: number; region: string;
  fdi_b: number; gfr: number; signals: number; grade: string;
}> = {
  ARE: { name:'UAE',           x:62, y:44, region:'MENA',   fdi_b:30.7, gfr:80.0, signals:12, grade:'PLATINUM' },
  SAU: { name:'Saudi Arabia',  x:60, y:46, region:'MENA',   fdi_b:28.3, gfr:68.1, signals:9,  grade:'GOLD' },
  QAT: { name:'Qatar',         x:61, y:45, region:'MENA',   fdi_b:8.2,  gfr:71.2, signals:5,  grade:'GOLD' },
  EGY: { name:'Egypt',         x:56, y:43, region:'MENA',   fdi_b:9.8,  gfr:52.4, signals:4,  grade:'SILVER' },
  IND: { name:'India',         x:67, y:46, region:'SAS',    fdi_b:71.0, gfr:62.3, signals:18, grade:'PLATINUM' },
  CHN: { name:'China',         x:76, y:38, region:'EAP',    fdi_b:163.0,gfr:61.8, signals:22, grade:'GOLD' },
  SGP: { name:'Singapore',     x:77, y:52, region:'EAP',    fdi_b:141.2,gfr:88.5, signals:15, grade:'PLATINUM' },
  USA: { name:'United States', x:18, y:36, region:'NAM',    fdi_b:285.0,gfr:84.5, signals:28, grade:'PLATINUM' },
  GBR: { name:'UK',            x:46, y:28, region:'ECA',    fdi_b:52.0, gfr:78.5, signals:11, grade:'GOLD' },
  DEU: { name:'Germany',       x:50, y:28, region:'ECA',    fdi_b:35.4, gfr:81.5, signals:8,  grade:'GOLD' },
  FRA: { name:'France',        x:48, y:30, region:'ECA',    fdi_b:28.1, gfr:76.2, signals:7,  grade:'GOLD' },
  IRL: { name:'Ireland',       x:44, y:27, region:'ECA',    fdi_b:94.5, gfr:78.5, signals:6,  grade:'GOLD' },
  NGA: { name:'Nigeria',       x:50, y:52, region:'SSA',    fdi_b:4.1,  gfr:42.1, signals:3,  grade:'BRONZE' },
  ZAF: { name:'South Africa',  x:54, y:64, region:'SSA',    fdi_b:5.4,  gfr:51.3, signals:4,  grade:'SILVER' },
  KEN: { name:'Kenya',         x:58, y:56, region:'SSA',    fdi_b:1.8,  gfr:51.3, signals:2,  grade:'SILVER' },
  BRA: { name:'Brazil',        x:30, y:60, region:'LAC',    fdi_b:65.1, gfr:54.2, signals:10, grade:'SILVER' },
  MEX: { name:'Mexico',        x:16, y:44, region:'LAC',    fdi_b:36.1, gfr:56.8, signals:7,  grade:'SILVER' },
  VNM: { name:'Vietnam',       x:77, y:47, region:'EAP',    fdi_b:18.1, gfr:58.2, signals:9,  grade:'GOLD' },
  IDN: { name:'Indonesia',     x:78, y:55, region:'EAP',    fdi_b:22.0, gfr:57.1, signals:8,  grade:'SILVER' },
  AUS: { name:'Australia',     x:82, y:68, region:'EAP',    fdi_b:59.4, gfr:82.1, signals:7,  grade:'GOLD' },
  JPN: { name:'Japan',         x:82, y:36, region:'EAP',    fdi_b:30.5, gfr:79.3, signals:6,  grade:'GOLD' },
  KOR: { name:'South Korea',   x:80, y:35, region:'EAP',    fdi_b:18.4, gfr:77.8, signals:5,  grade:'GOLD' },
  NOR: { name:'Norway',        x:49, y:22, region:'ECA',    fdi_b:12.3, gfr:83.2, signals:4,  grade:'GOLD' },
  CHE: { name:'Switzerland',   x:50, y:30, region:'ECA',    fdi_b:26.4, gfr:87.5, signals:5,  grade:'PLATINUM' },
  CAN: { name:'Canada',        x:16, y:26, region:'NAM',    fdi_b:48.3, gfr:83.1, signals:6,  grade:'GOLD' },
  KAZ: { name:'Kazakhstan',    x:66, y:30, region:'ECA',    fdi_b:8.1,  gfr:58.4, signals:3,  grade:'SILVER' },
  RUS: { name:'Russia',        x:65, y:24, region:'ECA',    fdi_b:5.2,  gfr:48.1, signals:2,  grade:'BRONZE' },
  TUR: { name:'Turkey',        x:57, y:34, region:'MENA',   fdi_b:12.4, gfr:59.8, signals:5,  grade:'SILVER' },
  MYS: { name:'Malaysia',      x:76, y:52, region:'EAP',    fdi_b:14.2, gfr:66.4, signals:6,  grade:'SILVER' },
  THA: { name:'Thailand',      x:76, y:49, region:'EAP',    fdi_b:9.8,  gfr:63.1, signals:5,  grade:'SILVER' },
};

const GRADE_COLORS: Record<string, string> = {
  PLATINUM: '#f59e0b',
  GOLD:     '#10b981',
  SILVER:   '#3b82f6',
  BRONZE:   '#6b7280',
};

const REGION_COLORS: Record<string, string> = {
  MENA: '#f59e0b', SAS: '#8b5cf6', EAP: '#06b6d4',
  ECA:  '#3b82f6', NAM: '#10b981', LAC: '#f97316',
  SSA:  '#ef4444',
};

interface TooltipData {
  iso3: string; x: number; y: number;
}

export default function FDIWorldMap() {
  const [selected, setSelected]     = useState<string>('ARE');
  const [tooltip, setTooltip]       = useState<TooltipData | null>(null);
  const [mode, setMode]             = useState<'signals'|'gfr'|'fdi'>('signals');
  const [region, setRegion]         = useState<string>('');
  const [animFrame, setAnimFrame]   = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Animate signal pulses
  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(id);
  }, []);

  const filtered = Object.entries(COUNTRIES).filter(([, c]) =>
    !region || c.region === region
  );

  const selectedCountry = COUNTRIES[selected];

  function getDotSize(iso3: string): number {
    const c = COUNTRIES[iso3];
    if (mode === 'fdi')     return Math.max(4, Math.min(20, c.fdi_b / 15));
    if (mode === 'gfr')     return Math.max(4, Math.min(18, c.gfr / 7));
    return Math.max(4, Math.min(18, c.signals * 0.8));
  }

  function getDotColor(iso3: string): string {
    const c = COUNTRIES[iso3];
    if (mode === 'signals') return GRADE_COLORS[c.grade];
    if (mode === 'gfr')     return c.gfr >= 75 ? '#10b981' : c.gfr >= 60 ? '#3b82f6' : c.gfr >= 45 ? '#f59e0b' : '#ef4444';
    return REGION_COLORS[c.region] || '#6b7280';
  }

  return (
    <div className="bg-[#060f1a] rounded-2xl overflow-hidden border border-blue-900">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-blue-900">
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest">Global FDI Intelligence Map</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>
            LIVE
          </div>
        </div>
        <div className="flex gap-1">
          {([['signals','Signals'],['gfr','GFR Score'],['fdi','FDI Volume']] as const).map(([m,l]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                mode===m ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-blue-900'
              }`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Map */}
        <div className="flex-1 relative">
          <svg ref={svgRef} viewBox="0 0 100 75" className="w-full"
            style={{background:'linear-gradient(180deg,#060f1a 0%,#0a1628 100%)'}}>

            {/* Grid lines */}
            {[20,40,60,80].map(x => (
              <line key={x} x1={x} y1={0} x2={x} y2={75} stroke="#1e3a5f" strokeWidth="0.1"/>
            ))}
            {[25,50].map(y => (
              <line key={y} x1={0} y1={y} x2={100} y2={y} stroke="#1e3a5f" strokeWidth="0.1"/>
            ))}
            {/* Equator */}
            <line x1={0} y1={38} x2={100} y2={38} stroke="#1e3a5f" strokeWidth="0.2" strokeDasharray="1,1"/>

            {/* FDI flow lines between top economies */}
            {[
              ['USA','GBR'], ['USA','DEU'], ['USA','SGP'],
              ['GBR','ARE'], ['DEU','ARE'], ['CHN','SGP'],
              ['SGP','IND'], ['ARE','IND'], ['USA','IND'],
            ].map(([a,b]) => {
              const ca = COUNTRIES[a], cb = COUNTRIES[b];
              if (!ca || !cb) return null;
              const pulse = (animFrame / 60);
              const mx = ca.x + (cb.x-ca.x)*pulse;
              const my = ca.y + (cb.y-ca.y)*pulse;
              return (
                <g key={`${a}-${b}`}>
                  <line x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
                    stroke="#1e3a5f" strokeWidth="0.15" strokeDasharray="0.5,0.5" opacity="0.6"/>
                  <circle cx={mx} cy={my} r="0.4" fill="#3b82f6" opacity="0.8"/>
                </g>
              );
            })}

            {/* Country dots */}
            {filtered.map(([iso3, country]) => {
              const size  = getDotSize(iso3);
              const color = getDotColor(iso3);
              const isSelected = iso3 === selected;
              const isPlatinum = country.grade === 'PLATINUM';

              return (
                <g key={iso3}
                  onClick={() => setSelected(iso3)}
                  onMouseEnter={() => setTooltip({iso3, x:country.x, y:country.y})}
                  onMouseLeave={() => setTooltip(null)}
                  style={{cursor:'pointer'}}>

                  {/* Pulse ring for platinum signals */}
                  {isPlatinum && (
                    <circle cx={country.x} cy={country.y}
                      r={size/10 + (animFrame % 20) * 0.05}
                      fill="none" stroke={color} strokeWidth="0.2"
                      opacity={1 - (animFrame % 20) * 0.05}/>
                  )}

                  {/* Selection ring */}
                  {isSelected && (
                    <circle cx={country.x} cy={country.y}
                      r={size/10 + 1.5} fill="none" stroke="white" strokeWidth="0.3"/>
                  )}

                  {/* Main dot */}
                  <circle cx={country.x} cy={country.y}
                    r={size/10}
                    fill={color}
                    opacity={isSelected ? 1 : 0.8}/>

                  {/* Label for selected or large countries */}
                  {(isSelected || size > 12) && (
                    <text x={country.x} y={country.y - size/10 - 0.8}
                      fontSize="1.8" fill="white" textAnchor="middle"
                      fontWeight="bold" opacity="0.9">
                      {country.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Tooltip */}
            {tooltip && COUNTRIES[tooltip.iso3] && (
              <g>
                <rect x={tooltip.x + 1} y={tooltip.y - 8}
                  width="22" height="10" rx="0.5"
                  fill="#0A2540" stroke="#1e3a5f" strokeWidth="0.2"/>
                <text x={tooltip.x + 2} y={tooltip.y - 5.5}
                  fontSize="1.6" fill="white" fontWeight="bold">
                  {COUNTRIES[tooltip.iso3].name}
                </text>
                <text x={tooltip.x + 2} y={tooltip.y - 3.5}
                  fontSize="1.4" fill="#94a3b8">
                  GFR: {COUNTRIES[tooltip.iso3].gfr} | FDI: ${COUNTRIES[tooltip.iso3].fdi_b}B
                </text>
                <text x={tooltip.x + 2} y={tooltip.y - 1.5}
                  fontSize="1.4" fill={GRADE_COLORS[COUNTRIES[tooltip.iso3].grade]}>
                  {COUNTRIES[tooltip.iso3].signals} signals · {COUNTRIES[tooltip.iso3].grade}
                </text>
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-[#0a1628]/90 rounded-lg p-2 border border-blue-900">
            <div className="text-xs text-blue-400 font-bold mb-1.5 uppercase tracking-wide">
              {mode === 'signals' ? 'Signal Grade' : mode === 'gfr' ? 'GFR Score' : 'FDI Volume'}
            </div>
            {mode === 'signals' && (
              <div className="space-y-1">
                {[['PLATINUM','#f59e0b'],['GOLD','#10b981'],['SILVER','#3b82f6'],['BRONZE','#6b7280']].map(([g,c]) => (
                  <div key={g} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{background:c}}/>
                    <span className="text-xs text-slate-300">{g}</span>
                  </div>
                ))}
              </div>
            )}
            {mode === 'gfr' && (
              <div className="space-y-1">
                {[['75+','#10b981','Frontier'],['60-75','#3b82f6','High'],['45-60','#f59e0b','Medium'],['<45','#ef4444','Emerging']].map(([r,c,l]) => (
                  <div key={r} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{background:c}}/>
                    <span className="text-xs text-slate-300">{r} {l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Country panel */}
        {selectedCountry && (
          <div className="w-56 border-l border-blue-900 p-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
                style={{background: GRADE_COLORS[selectedCountry.grade]}}>
                {selected}
              </div>
              <div>
                <div className="text-white font-black text-sm">{selectedCountry.name}</div>
                <div className="text-blue-400 text-xs">{selectedCountry.region}</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {l:'GFR Score', v:selectedCountry.gfr, max:100, color:'#10b981'},
                {l:'FDI Inflows', v:Math.min(100,selectedCountry.fdi_b/3), max:100, display:`$${selectedCountry.fdi_b}B`, color:'#3b82f6'},
                {l:'Active Signals', v:Math.min(100,selectedCountry.signals*3.5), max:100, display:selectedCountry.signals, color:'#f59e0b'},
              ].map(s => (
                <div key={s.l}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{s.l}</span>
                    <span className="text-white font-bold">{s.display ?? s.v}</span>
                  </div>
                  <div className="h-1.5 bg-blue-950 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{width:`${s.v}%`, background:s.color}}/>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-blue-900">
              <div className="text-xs text-blue-400 mb-2">Signal Grade</div>
              <div className="text-sm font-black px-2 py-1 rounded-lg text-center"
                style={{
                  color: GRADE_COLORS[selectedCountry.grade],
                  background: GRADE_COLORS[selectedCountry.grade] + '20',
                  border: `1px solid ${GRADE_COLORS[selectedCountry.grade]}40`
                }}>
                {selectedCountry.grade}
              </div>
            </div>

            {/* Top signals */}
            <div className="mt-4">
              <div className="text-xs text-blue-400 mb-2">Recent Signals</div>
              <div className="space-y-1.5">
                {[
                  {co:'Microsoft', val:'$850M', g:'PLATINUM'},
                  {co:'Siemens', val:'$340M', g:'GOLD'},
                  {co:'BlackRock', val:'$500M', g:'SILVER'},
                ].slice(0, Math.min(3, selectedCountry.signals)).map((s,i) => (
                  <div key={i} className="flex items-center justify-between bg-blue-950/50 rounded px-2 py-1">
                    <div className="text-xs text-slate-300 truncate">{s.co}</div>
                    <div className="text-xs font-bold ml-1"
                      style={{color:GRADE_COLORS[s.g]}}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Region filter bar */}
      <div className="flex gap-1.5 px-4 py-2.5 border-t border-blue-900 flex-wrap">
        <button onClick={() => setRegion('')}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
            !region ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-blue-900'
          }`}>All Regions</button>
        {Object.entries(REGION_COLORS).map(([r,c]) => (
          <button key={r} onClick={() => setRegion(r === region ? '' : r)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              region===r ? 'text-white' : 'text-blue-400 hover:bg-blue-900'
            }`} style={region===r ? {background:c} : {}}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
