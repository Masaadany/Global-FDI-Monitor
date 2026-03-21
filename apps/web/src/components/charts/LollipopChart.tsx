'use client'
import { useEffect, useRef } from 'react'
import { CountryFlag } from '../shared/CountryFlag'
import Link from 'next/link'

interface Economy { id:string; code:string; name:string; gosa:number; trend:number; fdi:string; category:string; region:string }

export function LollipopChart({ economies, onSelect, selected }: { economies:Economy[]; onSelect:(id:string)=>void; selected:string|null }) {
  const min=60, max=92

  return (
    <div className="space-y-1.5">
      {economies.slice(0,15).map((eco,i)=>{
        const pct=((eco.gosa-min)/(max-min))*100
        const color=eco.gosa>=80?'#2ECC71':eco.gosa>=60?'#3498DB':'#F1C40F'
        const isSel=selected===eco.id
        return (
          <div key={eco.id} onClick={()=>onSelect(eco.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${isSel?'bg-green-50 border border-green-200':'hover:bg-background-offwhite border border-transparent'}`}>
            <span className="text-xs font-mono font-bold text-text-light w-5">#{i+1}</span>
            <CountryFlag code={eco.code} size={20}/>
            <span className="text-sm font-medium text-text-primary w-28 truncate">{eco.name}</span>
            {/* Lollipop bar */}
            <div className="flex-1 relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full rounded-full lollipop-bar"
                style={{width:`${pct}%`, background:`linear-gradient(90deg,${color}50,${color})`, animationDelay:`${i*40}ms`}}/>
            </div>
            {/* Dot */}
            <div className="w-3 h-3 rounded-full border-2 border-white shadow-md flex-shrink-0" style={{background:color, marginLeft:'-8px', boxShadow:`0 0 6px ${color}60`}}/>
            <span className="text-sm font-black font-mono w-10 text-right" style={{color}}>{eco.gosa}</span>
            <span className="text-xs font-bold w-10" style={{color:eco.trend>0?'#2ECC71':'#E74C3C'}}>
              {eco.trend>0?`▲${eco.trend}`:`▼${Math.abs(eco.trend)}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}
