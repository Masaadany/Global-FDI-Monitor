'use client';

interface Axis { label: string; value: number; max?: number; color?: string }
interface Props { axes: Axis[]; size?: number; showLabels?: boolean; animated?: boolean }

export default function RadarChart({ axes, size=280, showLabels=true, animated=false }: Props) {
  const cx = size/2, cy = size/2, r = size*0.38;
  const n = axes.length;
  const pts = axes.map((_, i) => {
    const angle = (i/n)*2*Math.PI - Math.PI/2;
    return { x: cx + r*Math.cos(angle), y: cy + r*Math.sin(angle) };
  });
  const valuePts = axes.map((a, i) => {
    const val = Math.min((a.value/(a.max||100)), 1);
    const angle = (i/n)*2*Math.PI - Math.PI/2;
    return { x: cx + r*val*Math.cos(angle), y: cy + r*val*Math.sin(angle) };
  });
  const polygon = valuePts.map(p=>`${p.x},${p.y}`).join(' ');
  const outerPoly = pts.map(p=>`${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="GFR radar chart">
      {/* Grid circles */}
      {[0.25,0.5,0.75,1].map(f=>(
        <circle key={f} cx={cx} cy={cy} r={r*f} fill="none" stroke="rgba(10,61,98,0.1)" strokeWidth="1"/>
      ))}
      {/* Grid lines */}
      {pts.map((p,i)=>(
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(10,61,98,0.1)" strokeWidth="1"/>
      ))}
      {/* Outer boundary */}
      <polygon points={outerPoly} fill="none" stroke="rgba(10,61,98,0.12)" strokeWidth="1"/>
      {/* Value area */}
      <polygon points={polygon} fill="rgba(116,187,101,0.18)" stroke="#74BB65" strokeWidth="2"
        strokeLinejoin="round"
        style={animated ? {transition:'all 0.5s ease'} : {}}/>
      {/* Value dots */}
      {valuePts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#74BB65" stroke="white" strokeWidth="1.5"/>
      ))}
      {/* Labels */}
      {showLabels && pts.map((p,i)=>{
        const a = (i/n)*2*Math.PI - Math.PI/2;
        const lx = cx + (r+22)*Math.cos(a), ly = cy + (r+22)*Math.sin(a);
        const anchor = Math.abs(a) < 0.3 ? 'middle' : a > 0 ? 'start' : 'end';
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fontWeight="700" fill="#0A3D62">
            {axes[i].label}
          </text>
        );
      })}
      {/* Scores */}
      {valuePts.map((p,i)=>(
        <text key={i} x={p.x} y={p.y-9} textAnchor="middle" fontSize="9" fontWeight="700" fill="#74BB65">
          {axes[i].value}
        </text>
      ))}
    </svg>
  );
}
