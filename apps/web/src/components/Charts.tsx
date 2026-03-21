'use client';
import { useRef, useEffect, useState } from 'react';

// ── SCORE COLOR ──────────────────────────────────────────────────────
export function scoreColor(v: number): string {
  return v >= 80 ? '#27AE60' : v >= 60 ? '#2980B9' : '#D4AC0D';
}

// ── LOLLIPOP CHART (Country Rankings) ────────────────────────────────
export function LollipopChart({ data, height=360, onSelect }: {
  data: { id:string; name:string; score:number; trend:number; flag?:string; category?:string }[];
  height?: number;
  onSelect?: (id:string) => void;
}) {
  const [hovered, setHovered] = useState<string|null>(null);
  const maxScore = 100;
  const barH = Math.max(18, Math.min(28, (height - 40) / data.length - 4));
  const chartH = data.length * (barH + 6);
  const LEFT = 160;
  const RIGHT = 60;

  return (
    <svg width="100%" viewBox={`0 0 700 ${chartH + 20}`} style={{overflow:'visible'}}>
      {/* Grid lines */}
      {[0,20,40,60,80,100].map(v => (
        <g key={v}>
          <line x1={LEFT + (v/maxScore)*(700-LEFT-RIGHT)} y1={0} x2={LEFT + (v/maxScore)*(700-LEFT-RIGHT)} y2={chartH} stroke="#ECF0F1" strokeWidth="1"/>
          <text x={LEFT + (v/maxScore)*(700-LEFT-RIGHT)} y={chartH+14} textAnchor="middle" fontSize="9" fill="#8A9BA8" fontFamily="JetBrains Mono">{v}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const y = i * (barH + 6) + barH/2;
        const x = LEFT + (d.score/maxScore)*(700-LEFT-RIGHT);
        const col = scoreColor(d.score);
        const isHov = hovered === d.id;
        return (
          <g key={d.id} style={{cursor:'pointer'}} onMouseEnter={()=>setHovered(d.id)} onMouseLeave={()=>setHovered(null)} onClick={()=>onSelect?.(d.id)}>
            {/* Background */}
            {isHov && <rect x={0} y={i*(barH+6)} width={700} height={barH+2} fill="rgba(46,204,113,0.04)" rx={4}/>}
            {/* Flag */}
            {d.flag && (
              <image href={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${d.flag}.svg`} x={2} y={i*(barH+6)+2} width={22} height={15} style={{borderRadius:2}}/>
            )}
            {/* Country name */}
            <text x={28} y={y+4} fontSize="12" fontWeight={isHov?700:500} fill={isHov?col:'#1A2C3E'} fontFamily="Inter">{d.name}</text>
            {/* Stem */}
            <line x1={LEFT} y1={y} x2={x} y2={y} stroke={col} strokeWidth={isHov?3:2} opacity={0.7} strokeLinecap="round"/>
            {/* Circle */}
            <circle cx={x} cy={y} r={isHov?9:7} fill={col} opacity={0.9} style={{transition:'r 150ms',filter:`drop-shadow(0 2px 4px ${col}60)`}}>
              <animate attributeName="r" from="0" to={isHov?"9":"7"} dur="0.3s" fill="freeze"/>
            </circle>
            {/* Score text */}
            <text x={x} y={y+4} textAnchor="middle" fontSize="8" fontWeight={800} fill="white" fontFamily="JetBrains Mono">{d.score}</text>
            {/* Trend */}
            <text x={x+16} y={y+4} fontSize="10" fill={d.trend>0?'#27AE60':'#E74C3C'} fontFamily="JetBrains Mono" fontWeight={700}>
              {d.trend>0?'▲':'▼'}{Math.abs(d.trend)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── BULLET CHART (Doing Business Indicators) ──────────────────────────
export function BulletChart({ data }: {
  data: { label:string; actual:number; target:number; avg:number; color:string }[];
}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      {data.map((d, i) => (
        <div key={d.label} style={{animation:`fadeInUp 0.5s ease ${i*0.05}s both`}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
            <span style={{fontSize:'12px',fontWeight:500,color:'var(--text-primary)'}}>{d.label}</span>
            <div style={{display:'flex',gap:'8px',fontSize:'11px',fontFamily:'var(--font-mono)',fontWeight:700}}>
              <span style={{color:'var(--text-muted)'}}>{d.avg}</span>
              <span style={{color:scoreColor(d.actual)}}>{d.actual}</span>
            </div>
          </div>
          {/* Track */}
          <div style={{position:'relative',height:'12px',background:'#ECF0F1',borderRadius:'6px',overflow:'hidden'}}>
            {/* Avg reference line */}
            <div style={{position:'absolute',left:`${d.avg}%`,top:0,width:'2px',height:'100%',background:'rgba(90,104,116,0.4)',zIndex:2}}/>
            {/* Target */}
            <div style={{position:'absolute',left:0,top:'2px',height:'8px',width:`${d.target}%`,background:'rgba(26,44,62,0.08)',borderRadius:'4px'}}/>
            {/* Actual */}
            <div style={{position:'absolute',left:0,top:'2px',height:'8px',width:`${d.actual}%`,background:`linear-gradient(90deg, ${d.color}80, ${d.color})`,borderRadius:'4px',boxShadow:`0 1px 4px ${d.color}50`,transition:'width 1s ease'}}/>
          </div>
        </div>
      ))}
      <div style={{display:'flex',gap:'16px',marginTop:'4px'}}>
        {[['Actual','var(--accent-green)'],['Target','rgba(26,44,62,0.2)'],['Global Avg','rgba(90,104,116,0.4)']].map(([l,c])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'10px',color:'var(--text-muted)'}}>
            <div style={{width:'14px',height:'4px',background:c as string,borderRadius:'2px'}}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RADAR CHART ────────────────────────────────────────────────────────
export function RadarChart({ datasets, labels, size=200, showLegend=false }: {
  datasets: {label:string; data:number[]; color:string}[];
  labels: string[];
  size?: number;
  showLegend?: boolean;
}) {
  const n = labels.length;
  const cx = size/2, cy = size/2, r = size*0.38;
  function pt(i: number, v: number) {
    const a = (Math.PI*2*i/n) - Math.PI/2;
    const d = (v/100)*r;
    return { x: cx + d*Math.cos(a), y: cy + d*Math.sin(a) };
  }
  return (
    <div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{animation:'drawRadar 0.8s ease both'}}>
        {/* Grid rings */}
        {[20,40,60,80,100].map(l => {
          const ps = labels.map((_,i) => pt(i,l));
          return <polygon key={l} points={ps.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="#ECF0F1" strokeWidth="1"/>;
        })}
        {/* Axes */}
        {labels.map((_,i) => { const p = pt(i,100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#ECF0F1" strokeWidth="1"/>; })}
        {/* Data */}
        {datasets.map((ds, di) => {
          const pts = ds.data.map((v,i) => pt(i,v));
          return (
            <g key={di}>
              <polygon points={pts.map(p=>`${p.x},${p.y}`).join(' ')} fill={ds.color+'20'} stroke={ds.color} strokeWidth="2"/>
              {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={ds.color} style={{filter:`drop-shadow(0 1px 3px ${ds.color}60)`}}/>)}
            </g>
          );
        })}
        {/* Labels */}
        {labels.map((l,i) => { const p = pt(i,118); return <text key={l} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#5A6874" fontFamily="JetBrains Mono">{l}</text>; })}
      </svg>
      {showLegend && (
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'8px',justifyContent:'center'}}>
          {datasets.map(ds => (
            <div key={ds.label} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'11px',color:'var(--text-secondary)'}}>
              <div style={{width:'10px',height:'3px',background:ds.color,borderRadius:'2px'}}/>
              {ds.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PARALLEL COORDINATES ───────────────────────────────────────────────
export function ParallelCoords({ countries, axes }: {
  countries: {id:string; name:string; flag:string; color:string; values:number[]}[];
  axes: string[];
}) {
  const [hov, setHov] = useState<string|null>(null);
  const W = 680, H = 240;
  const PAD = 50;
  const axisX = axes.map((_,i) => PAD + i*(W-2*PAD)/(axes.length-1));

  function yForValue(v: number) { return H - 30 - (v/100)*(H-60); }

  function pathForCountry(c: typeof countries[0]) {
    return c.values.map((v,i) => `${i===0?'M':'L'}${axisX[i]},${yForValue(v)}`).join(' ');
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible'}}>
      {/* Axis lines */}
      {axes.map((ax, i) => (
        <g key={ax}>
          <line x1={axisX[i]} y1={20} x2={axisX[i]} y2={H-30} stroke="#ECF0F1" strokeWidth="1.5"/>
          <text x={axisX[i]} y={12} textAnchor="middle" fontSize="9" fill="#8A9BA8" fontFamily="JetBrains Mono">{ax}</text>
          {[0,25,50,75,100].map(v => (
            <text key={v} x={axisX[i]-4} y={yForValue(v)+3} textAnchor="end" fontSize="7" fill="#B0BEC5" fontFamily="JetBrains Mono">{v}</text>
          ))}
        </g>
      ))}
      {/* Country paths — non-hovered first */}
      {countries.filter(c=>c.id!==hov).map(c => (
        <path key={c.id} d={pathForCountry(c)} fill="none" stroke={c.color} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" strokeLinejoin="round"/>
      ))}
      {/* Hovered on top */}
      {countries.filter(c=>c.id===hov).map(c => (
        <g key={c.id}>
          <path d={pathForCountry(c)} fill="none" stroke={c.color} strokeWidth="3" opacity="1" strokeLinecap="round" strokeLinejoin="round"/>
          {c.values.map((v,i) => (
            <g key={i} style={{cursor:'default'}}>
              <circle cx={axisX[i]} cy={yForValue(v)} r="5" fill={c.color} style={{filter:`drop-shadow(0 2px 4px ${c.color}60)`}}/>
              <text x={axisX[i]} y={yForValue(v)-9} textAnchor="middle" fontSize="9" fill={c.color} fontFamily="JetBrains Mono" fontWeight="700">{v}</text>
            </g>
          ))}
        </g>
      ))}
      {/* Legend */}
      {countries.map((c,i) => (
        <g key={c.id} style={{cursor:'pointer'}} onMouseEnter={()=>setHov(c.id)} onMouseLeave={()=>setHov(null)}>
          <rect x={i*80} y={H-22} width={76} height={18} rx={5} fill={c.id===hov?c.color+'15':'transparent'} stroke={c.id===hov?c.color:'var(--border)'} strokeWidth="1"/>
          <image href={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${c.flag}.svg`} x={i*80+4} y={H-19} width={16} height={11}/>
          <text x={i*80+24} y={H-11} fontSize="9" fill={c.id===hov?c.color:'#5A6874'} fontFamily="Inter" fontWeight={c.id===hov?"700":"500"}>{c.name}</text>
        </g>
      ))}
    </svg>
  );
}

// ── STREAMGRAPH (Signal Volume Over Time) ─────────────────────────────
export function Streamgraph({ data, labels, colors, height=160 }: {
  data: number[][];  // [series][timepoints]
  labels: string[];
  colors: string[];
  height?: number;
}) {
  const W = 700, H = height;
  const points = data[0]?.length || 12;
  const step = W / (points - 1);

  // Stack the data
  const stacked = data.reduce((acc: number[][], series, si) => {
    if (si === 0) {
      acc.push(series.map(v => 0));
      acc.push(series.map(v => v));
    } else {
      const prev = acc[acc.length - 1];
      acc.push(series.map((v, i) => prev[i] + v));
    }
    return acc;
  }, []);

  const maxVal = Math.max(...stacked[stacked.length-1].map(v => v));

  function yScale(v: number) { return H/2 + (v/maxVal - 0.5)*H*0.8; }

  function getPath(lower: number[], upper: number[]): string {
    const top = upper.map((v,i) => `${i===0?'M':'L'}${i*step},${yScale(v)}`).join(' ');
    const bot = lower.slice().reverse().map((v,i,arr) => `L${(arr.length-1-i)*step},${yScale(v)}`).join(' ');
    return top + ' ' + bot + ' Z';
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:'hidden'}}>
      {data.map((_, si) => (
        <path key={si} d={getPath(stacked[si], stacked[si+1])}
          fill={colors[si]} opacity="0.75" style={{animation:'fadeIn 0.8s ease'}}/>
      ))}
      {/* Time axis labels */}
      {labels.map((l,i) => (
        <text key={l} x={i*step} y={H-2} textAnchor="middle" fontSize="8" fill="#8A9BA8" fontFamily="JetBrains Mono">{l}</text>
      ))}
    </svg>
  );
}

// ── SANKEY (Investment Flows) ──────────────────────────────────────────
export function Sankey({ nodes, links }: {
  nodes: {id:string; label:string; color:string}[];
  links: {source:string; target:string; value:number; color?:string}[];
}) {
  const W=680, H=260;
  // Simple fixed-position Sankey for display
  const leftNodes = nodes.filter((_,i)=>i<3);
  const rightNodes = nodes.filter((_,i)=>i>=3);
  const lx=80, rx=W-100;
  const lGap = H/(leftNodes.length+1);
  const rGap = H/(rightNodes.length+1);

  const nodeY: Record<string,number> = {};
  leftNodes.forEach((n,i) => { nodeY[n.id] = lGap*(i+1); });
  rightNodes.forEach((n,i) => { nodeY[n.id] = rGap*(i+1); });

  const maxLink = Math.max(...links.map(l=>l.value));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible'}}>
      {/* Links */}
      {links.map((link,i) => {
        const sy = nodeY[link.source];
        const ty = nodeY[link.target];
        const w = Math.max(2, (link.value/maxLink)*30);
        const col = link.color || '#2ECC71';
        const path = `M${lx+40},${sy} C${lx+120},${sy} ${rx-80},${ty} ${rx-10},${ty}`;
        return (
          <path key={i} d={path} fill="none" stroke={col} strokeWidth={w} opacity="0.3"
            style={{animation:'fadeIn 1s ease',transition:'all 300ms'}}/>
        );
      })}
      {/* Left nodes */}
      {leftNodes.map((n,i) => {
        const y = nodeY[n.id];
        const totalOut = links.filter(l=>l.source===n.id).reduce((a,l)=>a+l.value,0);
        const h = Math.max(20, (totalOut/maxLink)*80);
        return (
          <g key={n.id}>
            <rect x={lx} y={y-h/2} width={40} height={h} rx={4} fill={n.color} opacity={0.9}/>
            <text x={lx-4} y={y+4} textAnchor="end" fontSize="11" fill="#1A2C3E" fontFamily="Inter" fontWeight="600">{n.label}</text>
          </g>
        );
      })}
      {/* Right nodes */}
      {rightNodes.map((n,i) => {
        const y = nodeY[n.id];
        const totalIn = links.filter(l=>l.target===n.id).reduce((a,l)=>a+l.value,0);
        const h = Math.max(20, (totalIn/maxLink)*80);
        return (
          <g key={n.id}>
            <rect x={rx-10} y={y-h/2} width={40} height={h} rx={4} fill={n.color} opacity={0.9}/>
            <text x={rx+36} y={y+4} fontSize="11" fill="#1A2C3E" fontFamily="Inter" fontWeight="600">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
