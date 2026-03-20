'use client';
import { useState } from 'react';

interface Slice { label: string; value: number; color: string }
interface Props { slices: Slice[]; size?: number; title?: string }

export default function SectorDonut({ slices, size=200, title }: Props) {
  const [hover, setHover] = useState<number|null>(null);
  const cx = size/2, cy = size/2;
  const r1 = size*0.38, r2 = size*0.22;
  const total = slices.reduce((s,x)=>s+x.value,0);
  let angle = -Math.PI/2;
  const arcs = slices.map((s,i) => {
    const sweep = (s.value/total)*2*Math.PI;
    const sa = angle, ea = angle+sweep;
    angle += sweep;
    const expanded = hover===i ? 0.04 : 0;
    const mc = (sa+ea)/2;
    const ox = expanded*Math.cos(mc), oy = expanded*Math.sin(mc);
    const x1=cx+ox+(r1)*Math.cos(sa), y1=cy+oy+(r1)*Math.sin(sa);
    const x2=cx+ox+(r1)*Math.cos(ea), y2=cy+oy+(r1)*Math.sin(ea);
    const x3=cx+ox+(r2)*Math.cos(ea), y3=cy+oy+(r2)*Math.sin(ea);
    const x4=cx+ox+(r2)*Math.cos(sa), y4=cy+oy+(r2)*Math.sin(sa);
    const large = sweep > Math.PI ? 1 : 0;
    const pct = Math.round(s.value/total*100);
    return { path:`M${x1},${y1} A${r1},${r1} 0 ${large},1 ${x2},${y2} L${x3},${y3} A${r2},${r2} 0 ${large},0 ${x4},${y4} Z`, color:s.color, label:s.label, pct, i };
  });

  return (
    <div style={{display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}} role="img" aria-label="Sector distribution donut">
        {arcs.map(a=>(
          <path key={a.i} d={a.path} fill={a.color} stroke="white" strokeWidth="1.5"
            onMouseEnter={()=>setHover(a.i)} onMouseLeave={()=>setHover(null)}
            style={{cursor:'pointer',transition:'all 0.2s ease',filter:hover===a.i?'brightness(1.1)':'none'}}/>
        ))}
        {hover !== null ? (
          <>
            <text x={cx} y={cy-6} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0A3D62">{arcs[hover].pct}%</text>
            <text x={cx} y={cy+10} textAnchor="middle" fontSize="9" fill="#696969">{arcs[hover].label}</text>
          </>
        ) : (
          <text x={cx} y={cy+4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A3D62">{title||''}</text>
        )}
      </svg>
      <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
        {slices.map((s,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'11px',
            fontWeight:hover===i?700:400,color:hover===i?s.color:'#696969',cursor:'pointer',transition:'all 0.15s'}}
            onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}>
            <div style={{width:'10px',height:'10px',borderRadius:'3px',background:s.color,flexShrink:0}}/>
            <span>{s.label}</span>
            <span style={{marginLeft:'auto',fontFamily:'monospace',fontWeight:700}}>{Math.round(s.value/total*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
