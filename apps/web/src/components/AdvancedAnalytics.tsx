'use client';
import { useState } from 'react';

// ── MINI CHART COMPONENTS ──────────────────────────────────────────────────

function SparkLine({ data, color = '#3b82f6', height = 40 }: {
  data: number[]; color?: string; height?: number;
}) {
  const max   = Math.max(...data);
  const min   = Math.min(...data);
  const range = max - min || 1;
  const w     = 100 / (data.length - 1);

  const points = data.map((v, i) => ({
    x: i * w,
    y: height - ((v - min) / range) * height,
  }));

  const path = points.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const area = path + ` L${points[points.length-1].x},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color.replace('#','')})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="2"/>
      <circle cx={points[points.length-1].x} cy={points[points.length-1].y}
        r="2.5" fill={color}/>
    </svg>
  );
}

function BarChart({ data, colors }: {
  data: {label:string; value:number; color?:string}[];
  colors?: string[];
}) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-slate-400 truncate">{d.label}</span>
            <span className="text-white font-bold ml-2">{d.value}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(d.value/max)*100}%`,
                background: d.color || colors?.[i] || '#3b82f6'
              }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function RadarChart({ dimensions }: { dimensions: {label:string; value:number}[] }) {
  const n     = dimensions.length;
  const cx    = 50; const cy = 50; const r = 40;
  const rings = [25,50,75,100];

  function polar(angle: number, radius: number) {
    const a = (angle - 90) * Math.PI / 180;
    return { x: cx + radius * 0.4 * Math.cos(a), y: cy + radius * 0.4 * Math.sin(a) };
  }

  const axes = dimensions.map((_, i) => polar(i * 360 / n, 100));
  const values = dimensions.map((d, i) => polar(i * 360 / n, d.value));
  const valuePath = values.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-xs mx-auto">
      {/* Rings */}
      {rings.map(ring => {
        const pts = dimensions.map((_,i) => polar(i*360/n, ring));
        const path = pts.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ') + 'Z';
        return <path key={ring} d={path} fill="none" stroke="#1e3a5f" strokeWidth="0.5"/>;
      })}
      {/* Axes */}
      {axes.map((p,i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#1e3a5f" strokeWidth="0.5"/>
      ))}
      {/* Value area */}
      <path d={valuePath} fill="#3b82f620" stroke="#3b82f6" strokeWidth="1"/>
      {/* Dots */}
      {values.map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#3b82f6"/>
      ))}
      {/* Labels */}
      {dimensions.map((d,i) => {
        const p = polar(i*360/n, 115);
        return (
          <text key={i} x={p.x} y={p.y} fontSize="4.5" fill="#94a3b8"
            textAnchor="middle" dominantBaseline="middle">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments }: { segments: {label:string; value:number; color:string}[] }) {
  const total = segments.reduce((s,d) => s+d.value, 0);
  let offset  = 0;
  const cx    = 50; const cy = 50;
  const r     = 35; const innerR = 22;

  const arcs = segments.map(seg => {
    const pct   = seg.value / total;
    const start = offset * 360;
    const end   = (offset + pct) * 360;
    offset     += pct;

    const s = (angle: number) => ({
      x: cx + r * Math.cos((angle - 90) * Math.PI / 180),
      y: cy + r * Math.sin((angle - 90) * Math.PI / 180),
    });
    const si = (angle: number) => ({
      x: cx + innerR * Math.cos((angle - 90) * Math.PI / 180),
      y: cy + innerR * Math.sin((angle - 90) * Math.PI / 180),
    });

    const p1 = s(start); const p2 = s(end);
    const i1 = si(end);  const i2 = si(start);
    const large = pct > 0.5 ? 1 : 0;

    return {
      ...seg, pct,
      path: `M${p1.x},${p1.y} A${r},${r} 0 ${large} 1 ${p2.x},${p2.y} L${i1.x},${i1.y} A${innerR},${innerR} 0 ${large} 0 ${i2.x},${i2.y} Z`
    };
  });

  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-xs mx-auto">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.path} fill={arc.color} opacity="0.85"/>
      ))}
      <text x={cx} y={cy-3} fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">
        {total}
      </text>
      <text x={cx} y={cy+6} fontSize="4" fill="#94a3b8" textAnchor="middle">
        signals
      </text>
    </svg>
  );
}

// ── MAIN ANALYTICS DASHBOARD ──────────────────────────────────────────────

const SIGNAL_TREND = [42,48,51,45,58,62,59,65,71,68,74,78,81,76,85,88,91,86,94,98];
const FDI_BY_SECTOR = [
  {label:'Technology (J)',   value:285, color:'#3b82f6'},
  {label:'Finance (K)',      value:210, color:'#10b981'},
  {label:'Energy (D)',       value:180, color:'#f59e0b'},
  {label:'Manufacturing (C)',value:155, color:'#8b5cf6'},
  {label:'Real Estate (L)',  value:120, color:'#f97316'},
  {label:'Logistics (H)',    value:95,  color:'#06b6d4'},
];
const SIGNAL_DONUT = [
  {label:'PLATINUM', value:24, color:'#f59e0b'},
  {label:'GOLD',     value:58, color:'#10b981'},
  {label:'SILVER',   value:89, color:'#3b82f6'},
  {label:'BRONZE',   value:47, color:'#6b7280'},
];
const GFR_RADAR_ARE = [
  {label:'Macro',    value:82},
  {label:'Policy',   value:78},
  {label:'Digital',  value:84},
  {label:'Human',    value:54},
  {label:'Infra',    value:92},
  {label:'Sustain',  value:53},
];
const TOP_ECONOMIES = [
  {label:'Singapore',     value:88, color:'#10b981'},
  {label:'UAE',           value:80, color:'#3b82f6'},
  {label:'Germany',       value:78, color:'#8b5cf6'},
  {label:'Ireland',       value:76, color:'#f59e0b'},
  {label:'Saudi Arabia',  value:68, color:'#f97316'},
  {label:'India',         value:62, color:'#06b6d4'},
];

export default function AdvancedAnalytics() {
  const [period, setPeriod] = useState<'7d'|'30d'|'90d'>('30d');

  const KPIs = [
    { label:'Active Signals', value:'218', change:'+12%', up:true, trend:[40,45,42,50,55,58,62,65,70,68,74,78,81,85,88,91,94,98,102,108], color:'#3b82f6' },
    { label:'Platinum Signals', value:'24', change:'+8%', up:true, trend:[8,9,8,10,11,10,12,11,13,12,14,13,15,14,16,15,17,16,18,24], color:'#f59e0b' },
    { label:'Economies Tracked', value:'215', change:'100%', up:true, trend:[180,185,190,195,200,205,208,210,212,213,214,215,215,215,215,215,215,215,215,215], color:'#10b981' },
    { label:'FDI Volume (Q1)', value:'$2.1T', change:'+6%', up:true, trend:[30,32,31,34,35,33,36,35,38,37,40,39,42,41,44,43,46,45,48,50], color:'#8b5cf6' },
  ];

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <h2 className="font-black text-[#0A2540] text-lg">Intelligence Analytics</h2>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          {(['7d','30d','90d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                period===p ? 'bg-white shadow text-[#0A2540]' : 'text-slate-400 hover:text-slate-600'
              }`}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KPIs.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="text-xs text-slate-400 mb-1">{kpi.label}</div>
            <div className="text-2xl font-black text-[#0A2540] mb-1">{kpi.value}</div>
            <div className="flex items-center gap-1 mb-2">
              <span className={`text-xs font-bold ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.change}
              </span>
              <span className="text-xs text-slate-400">vs last period</span>
            </div>
            <SparkLine data={kpi.trend} color={kpi.color} height={32}/>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Signal trend */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-black text-[#0A2540] text-sm">Signal Detection Trend</div>
              <div className="text-xs text-slate-400">Daily signal count — last 20 days</div>
            </div>
            <div className="text-2xl font-black text-blue-600">↑ 18%</div>
          </div>
          <SparkLine data={SIGNAL_TREND} color="#3b82f6" height={80}/>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>20 days ago</span><span>10 days ago</span><span>Today</span>
          </div>
        </div>

        {/* Signal grade donut */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-black text-[#0A2540] text-sm mb-1">Signal Grade Distribution</div>
          <div className="text-xs text-slate-400 mb-3">Current active signals</div>
          <DonutChart segments={SIGNAL_DONUT}/>
          <div className="grid grid-cols-2 gap-1 mt-3">
            {SIGNAL_DONUT.map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.color}}/>
                <span className="text-xs text-slate-500">{s.label} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* FDI by sector */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-black text-[#0A2540] text-sm mb-1">FDI Signals by Sector</div>
          <div className="text-xs text-slate-400 mb-4">Number of active signals per ISIC sector</div>
          <BarChart data={FDI_BY_SECTOR}/>
        </div>

        {/* GFR radar */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="font-black text-[#0A2540] text-sm">GFR Dimension Profile</div>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">UAE</span>
          </div>
          <div className="text-xs text-slate-400 mb-2">GFR scores across 6 dimensions</div>
          <RadarChart dimensions={GFR_RADAR_ARE}/>
        </div>
      </div>

      {/* Top GFR economies */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <div className="font-black text-[#0A2540] text-sm mb-1">Top GFR Economies</div>
        <div className="text-xs text-slate-400 mb-4">Global Future Readiness composite scores</div>
        <BarChart data={TOP_ECONOMIES}/>
      </div>
    </div>
  );
}
