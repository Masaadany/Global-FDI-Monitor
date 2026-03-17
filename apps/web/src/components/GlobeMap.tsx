'use client';
import { useState } from 'react';

const REGIONS = [
  {id:'MENA',  cx:360,cy:200, r:35, fdi:88,  color:'#f59e0b', label:'MENA',    top:'UAE $30B'},
  {id:'EAP',   cx:560,cy:160, r:50, fdi:546, color:'#10b981', label:'E.Asia',  top:'China $163B'},
  {id:'NAM',   cx:100,cy:145, r:45, fdi:333, color:'#3b82f6', label:'N.America',top:'USA $285B'},
  {id:'ECA',   cx:310,cy:130, r:38, fdi:312, color:'#8b5cf6', label:'Europe',   top:'Ireland $94B'},
  {id:'SAS',   cx:430,cy:195, r:28, fdi:74,  color:'#06b6d4', label:'S.Asia',   top:'India $71B'},
  {id:'LAC',   cx:170,cy:280, r:32, fdi:142, color:'#f97316', label:'L.America',top:'Brazil $65B'},
  {id:'SSA',   cx:330,cy:285, r:22, fdi:28,  color:'#ef4444', label:'S.Africa', top:'Nigeria $4B'},
  {id:'OCE',   cx:620,cy:300, r:24, fdi:59,  color:'#0ea5e9', label:'Oceania',  top:'Australia $59B'},
];

export default function GlobeMap() {
  const [selected, setSelected] = useState<typeof REGIONS[0]|null>(null);
  const total = REGIONS.reduce((s,r)=>s+r.fdi,0);

  return (
    <div className="bg-[#030d1a] rounded-2xl border border-blue-900 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-blue-900">
        <div className="font-black text-sm text-blue-300">Regional FDI Map — 2025</div>
        <div className="text-xs text-blue-600">Total: ${total.toFixed(0)}B · Bubble ∝ FDI volume</div>
      </div>
      <svg viewBox="0 0 740 420" className="w-full"
        style={{background:'radial-gradient(ellipse at 50% 40%, #0d1f35 0%, #030d1a 100%)'}}>
        {/* Globe outline */}
        <ellipse cx="370" cy="210" rx="340" ry="190" fill="none" stroke="#0d2845" strokeWidth="1"/>
        <ellipse cx="370" cy="210" rx="250" ry="190" fill="none" stroke="#0d2845" strokeWidth="0.5"/>
        <ellipse cx="370" cy="210" rx="150" ry="190" fill="none" stroke="#0d2845" strokeWidth="0.5"/>
        <line x1="30" y1="210" x2="710" y2="210" stroke="#0d2845" strokeWidth="0.5"/>
        <line x1="370" y1="20"  x2="370" y2="400" stroke="#0d2845" strokeWidth="0.5"/>
        {/* Latitude rings */}
        {[80,130,160].map(ry=>(
          <ellipse key={ry} cx="370" cy="210" rx="340" ry={ry} fill="none" stroke="#0d2845" strokeWidth="0.3"/>
        ))}
        {/* Flow lines between regions */}
        {[
          {x1:100,y1:145, x2:310,y2:130, v:28},
          {x1:310,y1:130, x2:560,y2:160, v:22},
          {x1:360,y1:200, x2:560,y2:160, v:18},
          {x1:430,y1:195, x2:560,y2:160, v:14},
        ].map((l,i)=>(
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#1D4ED8" strokeWidth={l.v/12} opacity="0.25" strokeDasharray="4,4"/>
        ))}
        {/* Region bubbles */}
        {REGIONS.map(r=>{
          const isSel = selected?.id===r.id;
          const scale = Math.sqrt(r.fdi/total)*3.8;
          const radius = Math.max(18, r.r*scale+12);
          return (
            <g key={r.id} onClick={()=>setSelected(isSel?null:r)} style={{cursor:'pointer'}}>
              {isSel && <circle cx={r.cx} cy={r.cy} r={radius*1.4} fill={r.color} opacity="0.1"/>}
              <circle cx={r.cx} cy={r.cy} r={radius} fill={r.color} opacity={isSel?0.9:0.75}
                stroke={isSel?'white':r.color} strokeWidth={isSel?2:0.5}/>
              <text x={r.cx} y={r.cy-4}  textAnchor="middle" fontSize="9"  fill="white" fontWeight="900">{r.label}</text>
              <text x={r.cx} y={r.cy+8}  textAnchor="middle" fontSize="10" fill="white" fontWeight="700">${r.fdi}B</text>
              {isSel && (
                <>
                  <rect x={r.cx-55} y={r.cy+radius+4} width={110} height={26} rx={4} fill="#0d1f35" stroke={r.color} strokeWidth="1"/>
                  <text x={r.cx} y={r.cy+radius+21} textAnchor="middle" fontSize="9" fill={r.color} fontWeight="700">{r.top}</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-2 px-5 py-3 border-t border-blue-900">
        {REGIONS.map(r=>(
          <button key={r.id} onClick={()=>setSelected(selected?.id===r.id?null:r)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${selected?.id===r.id?'text-white':'text-blue-400'}`}
            style={selected?.id===r.id?{background:r.color}:{border:`1px solid ${r.color}44`}}>
            <div className="w-2 h-2 rounded-full" style={{background:r.color}}/>
            {r.label} ${r.fdi}B
          </button>
        ))}
      </div>
    </div>
  );
}
