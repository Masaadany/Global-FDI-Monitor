'use client'
import { useEffect, useRef } from 'react'

interface RadarData { scores:number[]; color:string; label?:string }

export function RadarChart({ datasets, labels, size=200 }: { datasets:RadarData[]; labels:string[]; size?: number }) {
  const n=labels.length, cx=size/2, cy=size/2, r=size*0.36

  function pt(i:number, v:number) {
    const a=(Math.PI*2*i/n)-Math.PI/2
    return { x:cx+(v/100)*r*Math.cos(a), y:cy+(v/100)*r*Math.sin(a) }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25,50,75,100].map(l=>{
        const ps=Array.from({length:n},(_,i)=>pt(i,l))
        return <polygon key={l} points={ps.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="#ECF0F1" strokeWidth="0.8"/>
      })}
      {Array.from({length:n},(_,i)=>{
        const p=pt(i,100)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#ECF0F1" strokeWidth="0.8"/>
      })}
      {datasets.map((ds,di)=>{
        const pts=ds.scores.map((v,i)=>pt(i,v))
        return (
          <g key={di}>
            <polygon points={pts.map(p=>`${p.x},${p.y}`).join(' ')}
              fill={ds.color+'20'} stroke={ds.color} strokeWidth="2"
              style={{animation:'radarSweep 0.8s ease-out forwards'}}/>
            {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3" fill={ds.color} stroke="white" strokeWidth="1.5"/>)}
          </g>
        )
      })}
      {labels.map((label,i)=>{
        const p=pt(i,116)
        return <text key={label} x={p.x} y={p.y} fontSize="8" fill="#5A6874" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter,sans-serif">{label}</text>
      })}
    </svg>
  )
}
