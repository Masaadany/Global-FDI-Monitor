'use client'

const INDICATORS = [
  {name:'Starting a Business',   score:82.3,avg:72.4},
  {name:'Construction Permits',  score:74.8,avg:67.1},
  {name:'Getting Electricity',   score:87.2,avg:78.6},
  {name:'Registering Property',  score:71.4,avg:61.8},
  {name:'Getting Credit',        score:75.0,avg:65.4},
  {name:'Protecting Investors',  score:81.8,avg:71.2},
  {name:'Paying Taxes',          score:78.6,avg:64.8},
  {name:'Trading Across Borders',score:82.4,avg:74.2},
  {name:'Enforcing Contracts',   score:72.1,avg:58.4},
  {name:'Resolving Insolvency',  score:82.4,avg:61.6},
]

export function BulletChart() {
  return (
    <div className="space-y-2.5">
      {INDICATORS.map(({name,score,avg})=>{
        const color = score>=80?'#2ECC71':score>=70?'#3498DB':'#F1C40F'
        return (
          <div key={name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-text-secondary">{name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-light">avg {avg}</span>
                <span className="text-xs font-bold font-mono" style={{color}}>{score}</span>
              </div>
            </div>
            {/* Bullet: background=range, gray=avg, colored=actual */}
            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
              {/* Average reference band */}
              <div className="absolute left-0 top-0 h-full bg-gray-200 rounded-full" style={{width:`${avg}%`}}/>
              {/* Actual score */}
              <div className="absolute left-0 top-0.5 h-1.5 rounded-full"
                style={{width:`${score}%`, background:`linear-gradient(90deg,${color}50,${color})`}}/>
              {/* Target line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400" style={{left:`${avg}%`}}/>
            </div>
          </div>
        )
      })}
      <div className="flex gap-4 pt-2 text-[10px] text-text-light">
        <span className="flex items-center gap-1"><span className="w-3 h-1 bg-gray-200 rounded inline-block"/>Global Avg</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1 bg-primary-teal rounded inline-block"/>Score</span>
        <span className="flex items-center gap-1"><span className="w-0.5 h-3 bg-gray-400 inline-block"/>Target ref</span>
      </div>
    </div>
  )
}
