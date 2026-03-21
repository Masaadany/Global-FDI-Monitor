'use client'
import { useRef, useEffect, useState } from 'react'

interface GlobeDot { x:number; y:number; code:string; name:string; gosa:number; color:string }

const DOTS: GlobeDot[] = [
  {x:73,y:47,code:'SG',name:'Singapore',gosa:88.4,color:'#2ECC71'},
  {x:77,y:68,code:'AU',name:'Australia',gosa:82.8,color:'#2ECC71'},
  {x:53,y:41,code:'AE',name:'UAE',gosa:82.1,color:'#2ECC71'},
  {x:46,y:26,code:'GB',name:'UK',gosa:82.5,color:'#2ECC71'},
  {x:51,y:25,code:'DE',name:'Germany',gosa:83.1,color:'#2ECC71'},
  {x:18,y:35,code:'US',name:'USA',gosa:83.9,color:'#2ECC71'},
  {x:65,y:39,code:'IN',name:'India',gosa:73.2,color:'#F1C40F'},
  {x:78,y:33,code:'KR',name:'S.Korea',gosa:84.1,color:'#2ECC71'},
  {x:25,y:58,code:'BR',name:'Brazil',gosa:71.3,color:'#F1C40F'},
  {x:44,y:52,code:'MA',name:'Morocco',gosa:66.8,color:'#F1C40F'},
  {x:55,y:43,code:'SA',name:'S.Arabia',gosa:79.1,color:'#3498DB'},
  {x:70,y:44,code:'TH',name:'Thailand',gosa:80.7,color:'#3498DB'},
  {x:72,y:46,code:'MY',name:'Malaysia',gosa:81.2,color:'#3498DB'},
  {x:71,y:42,code:'VN',name:'Vietnam',gosa:79.4,color:'#3498DB'},
  {x:49,y:26,code:'DK',name:'Denmark',gosa:85.3,color:'#2ECC71'},
  {x:79,y:32,code:'JP',name:'Japan',gosa:81.4,color:'#2ECC71'},
  {x:73,y:35,code:'CN',name:'China',gosa:64.2,color:'#F1C40F'},
]

export function Globe3D({ onSelect }: { onSelect?: (code:string)=>void }) {
  const [hovered, setHovered] = useState<string|null>(null)
  const [selected, setSelected] = useState<string|null>(null)

  function handleClick(dot: GlobeDot) {
    setSelected(dot.code)
    onSelect?.(dot.code)
  }

  return (
    <div className="relative w-full" style={{aspectRatio:'2/1'}}>
      <svg viewBox="0 0 100 55" className="w-full h-full" style={{background:'linear-gradient(180deg,#EBF5FF,#F0F7FF)'}}>
        {/* Grid */}
        {[0,10,20,30,40,50].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(52,152,219,0.06)" strokeWidth="0.2"/>)}
        {[0,10,20,30,40,50,60,70,80,90,100].map(x=><line key={x} x1={x} y1="0" x2={x} y2="55" stroke="rgba(52,152,219,0.06)" strokeWidth="0.2"/>)}

        {/* Continents */}
        <path d="M5,12 L22,12 L28,18 L26,28 L22,36 L18,38 L12,35 L8,28 L5,20 Z" fill="rgba(26,44,62,0.05)" stroke="rgba(26,44,62,0.1)" strokeWidth="0.3"/>
        <path d="M18,40 L28,38 L32,42 L30,54 L24,55 L18,50 Z" fill="rgba(26,44,62,0.05)" stroke="rgba(26,44,62,0.1)" strokeWidth="0.3"/>
        <path d="M40,14 L58,14 L58,22 L54,26 L46,26 L40,22 Z" fill="rgba(26,44,62,0.05)" stroke="rgba(26,44,62,0.1)" strokeWidth="0.3"/>
        <path d="M42,26 L56,26 L58,34 L56,48 L46,50 L40,42 L40,32 Z" fill="rgba(26,44,62,0.05)" stroke="rgba(26,44,62,0.1)" strokeWidth="0.3"/>
        <path d="M52,28 L66,28 L66,36 L56,38 L52,34 Z" fill="rgba(26,44,62,0.05)" stroke="rgba(26,44,62,0.1)" strokeWidth="0.3"/>
        <path d="M58,10 L90,10 L92,16 L88,22 L84,28 L74,32 L64,30 L60,26 L58,18 Z" fill="rgba(26,44,62,0.05)" stroke="rgba(26,44,62,0.1)" strokeWidth="0.3"/>
        <path d="M68,36 L80,34 L82,42 L76,48 L68,46 L66,40 Z" fill="rgba(26,44,62,0.05)" stroke="rgba(26,44,62,0.1)" strokeWidth="0.3"/>
        <path d="M72,57 L90,55 L92,65 L84,70 L72,68 Z" fill="rgba(26,44,62,0.05)" stroke="rgba(26,44,62,0.1)" strokeWidth="0.3"/>

        {/* Region labels */}
        {[{x:14,y:22,l:'AMERICAS'},{x:48,y:18,l:'EUROPE'},{x:62,y:18,l:'ASIA PACIFIC'},{x:48,y:40,l:'AFRICA'},{x:57,y:34,l:'MIDDLE EAST'}].map(({x,y,l})=>(
          <text key={l} x={x} y={y} textAnchor="middle" fontSize="2.2" fill="rgba(26,44,62,0.15)" fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.08em">{l}</text>
        ))}

        {/* Dots */}
        {DOTS.map(dot=>{
          const mx=dot.x, my=(dot.y/100)*55
          const active=hovered===dot.code||selected===dot.code
          return (
            <g key={dot.code} style={{cursor:'pointer'}}
              onClick={()=>handleClick(dot)}
              onMouseEnter={()=>setHovered(dot.code)}
              onMouseLeave={()=>setHovered(null)}>
              <circle cx={mx} cy={my} r={active?5.5:3.5} fill={dot.color+'18'} stroke={dot.color+'40'} strokeWidth="0.4">
                {active&&<animate attributeName="r" values={`${active?5.5:3.5};${active?7:4.5};${active?5.5:3.5}`} dur="1.5s" repeatCount="indefinite"/>}
              </circle>
              <circle cx={mx} cy={my} r={selected===dot.code?4:active?3.5:2.5} fill={dot.color} stroke="white" strokeWidth={active?0.8:0.5}/>
              {active&&(
                <g>
                  <rect x={mx-7} y={my-8} width="14" height="6.5" fill="white" stroke={dot.color} strokeWidth="0.3" rx="1.2" style={{filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.15))'}}/>
                  <text x={mx} y={my-5} textAnchor="middle" fontSize="1.9" fill="#1A2C3E" fontWeight="800" fontFamily="Inter">{dot.name}</text>
                  <text x={mx} y={my-2.5} textAnchor="middle" fontSize="1.7" fill={dot.color} fontWeight="700" fontFamily="JetBrains Mono,monospace">{dot.gosa}</text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border-light">
        {[['#2ECC71','TOP (≥80)'],['#3498DB','HIGH (60-79)'],['#F1C40F','DEV (<60)']].map(([c,l])=>(
          <div key={l} className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
            <div className="w-2.5 h-2.5 rounded-full" style={{background:c as string}}/>
            {l}
          </div>
        ))}
      </div>

      {/* Live badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-border-light">
        <div className="w-1.5 h-1.5 rounded-full bg-primary-teal animate-pulse"/>
        <span className="text-xs font-semibold text-primary-teal">LIVE</span>
        <span className="text-xs text-text-light">{DOTS.length} economies</span>
      </div>
    </div>
  )
}
