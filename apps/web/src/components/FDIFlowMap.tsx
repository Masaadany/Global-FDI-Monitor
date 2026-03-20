'use client';
import { useEffect, useState } from 'react';

const NODES = [
  {id:'US', cx:210, cy:155, r:8,  label:'USA',          color:'#0A3D62'},
  {id:'UK', cx:455, cy:128, r:6,  label:'UK',           color:'#0A3D62'},
  {id:'DE', cx:475, cy:135, r:6,  label:'Germany',      color:'#74BB65'},
  {id:'AE', cx:560, cy:180, r:9,  label:'UAE',          color:'#74BB65'},
  {id:'SG', cx:680, cy:215, r:7,  label:'Singapore',    color:'#0A3D62'},
  {id:'CN', cx:680, cy:165, r:8,  label:'China',        color:'#696969'},
  {id:'IN', cx:620, cy:190, r:7,  label:'India',        color:'#74BB65'},
  {id:'SA', cx:555, cy:185, r:6,  label:'Saudi',        color:'#74BB65'},
  {id:'BR', cx:260, cy:255, r:5,  label:'Brazil',       color:'#696969'},
  {id:'AU', cx:710, cy:280, r:5,  label:'Australia',    color:'#696969'},
  {id:'JP', cx:730, cy:155, r:6,  label:'Japan',        color:'#696969'},
];

const FLOWS = [
  {from:'US',to:'AE',  capex:'$5.2B', color:'#74BB65', delay:0},
  {from:'US',to:'SG',  capex:'$2.8B', color:'#0A3D62', delay:0.4},
  {from:'CN',to:'AE',  capex:'$1.8B', color:'#696969', delay:0.8},
  {from:'DE',to:'SA',  capex:'$2.1B', color:'#74BB65', delay:1.2},
  {from:'JP',to:'IN',  capex:'$1.5B', color:'#0A3D62', delay:1.6},
  {from:'US',to:'UK',  capex:'$3.2B', color:'#74BB65', delay:2.0},
  {from:'UK',to:'IN',  capex:'$0.9B', color:'#696969', delay:2.4},
];

function getNode(id:string) { return NODES.find(n=>n.id===id)!; }

export default function FDIFlowMap({ height=320 }: { height?:number }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n+1), 80);
    return () => clearInterval(t);
  }, []);

  const speed = 0.012;

  return (
    <svg width="100%" viewBox="0 0 800 360" role="img" aria-label="Global FDI flow map"
      style={{background:'linear-gradient(135deg,#0A3D62 0%,#0E4F7A 100%)',borderRadius:'12px'}}>

      {/* Grid lines */}
      {[60,120,180,240,300].map(y=>(
        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}
      {[100,200,300,400,500,600,700].map(x=>(
        <line key={x} x1={x} y1="0" x2={x} y2="360" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}

      {/* World continents (simplified SVG paths) */}
      {/* North America */}
      <path d="M160,100 Q200,90 240,110 L250,180 Q210,200 170,190 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
      {/* South America */}
      <path d="M220,210 Q270,200 290,220 L285,290 Q250,310 215,295 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
      {/* Europe */}
      <path d="M430,100 Q490,95 520,110 L515,155 Q475,165 435,155 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
      {/* Africa */}
      <path d="M450,160 Q510,155 530,175 L520,280 Q475,295 445,280 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
      {/* Middle East */}
      <path d="M530,160 Q580,155 595,170 L590,210 Q555,215 530,205 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
      {/* Asia */}
      <path d="M590,100 Q690,90 740,120 L745,230 Q680,245 595,230 L595,160 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
      {/* Australia */}
      <path d="M680,255 Q730,250 750,270 L745,300 Q710,315 685,305 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>

      {/* Flow arcs */}
      {FLOWS.map((f, fi) => {
        const from = getNode(f.from), to = getNode(f.to);
        if (!from || !to) return null;
        const mx = (from.cx + to.cx) / 2;
        const my = Math.min(from.cy, to.cy) - 50 - Math.abs(to.cx - from.cx) * 0.15;
        const pathD = `M${from.cx},${from.cy} Q${mx},${my} ${to.cx},${to.cy}`;
        // Animate dot along path
        const t = ((tick * speed + f.delay * 0.3) % 1 + 1) % 1;
        // Quadratic bezier position
        const bx = (1-t)*(1-t)*from.cx + 2*(1-t)*t*mx + t*t*to.cx;
        const by = (1-t)*(1-t)*from.cy + 2*(1-t)*t*my + t*t*to.cy;
        return (
          <g key={fi}>
            <path d={pathD} stroke={f.color} strokeWidth="1.2" fill="none" opacity="0.4" strokeDasharray="4,4"/>
            <circle cx={bx} cy={by} r="3" fill={f.color} opacity="0.9">
              <animateMotion dur={`${3 + fi*0.5}s`} repeatCount="indefinite" path={pathD}/>
            </circle>
          </g>
        );
      })}

      {/* City nodes */}
      {NODES.map(n=>(
        <g key={n.id}>
          <circle cx={n.cx} cy={n.cy} r={n.r+4} fill={n.color} opacity="0.12"/>
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.color} opacity="0.85"/>
          <circle cx={n.cx} cy={n.cy} r={n.r-2} fill="white" opacity="0.3"/>
          <text x={n.cx} y={n.cy+n.r+11} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.75)" fontWeight="600">{n.label}</text>
        </g>
      ))}

      {/* Legend */}
      <g>
        <rect x="12" y="12" width="160" height="38" rx="6" fill="rgba(0,0,0,0.35)"/>
        <circle cx="24" cy="25" r="5" fill="#74BB65"/>
        <text x="33" y="29" fontSize="9" fill="rgba(255,255,255,0.8)" fontWeight="600">LIVE FDI Signal Flow</text>
        <circle cx="24" cy="41" r="4" fill="rgba(255,255,255,0.4)"/>
        <text x="33" y="45" fontSize="8.5" fill="rgba(255,255,255,0.6)">Investment Hub</text>
      </g>

      {/* Title */}
      <text x="788" y="18" textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.4)">GFM Live · 218 signals</text>
    </svg>
  );
}
