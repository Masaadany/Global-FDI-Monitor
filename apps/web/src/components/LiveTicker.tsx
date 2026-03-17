'use client';
import { useEffect, useState } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';

const GRADE_COLORS: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

export default function LiveTicker() {
  const { signals, connected } = useRealTimeSignals(20);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setOffset(o => o + 1), 50);
    return () => clearInterval(id);
  }, []);

  const items = signals.length > 0 ? signals : [
    {grade:'PLATINUM',company:'Microsoft',economy:'UAE',capex_m:850,reference_code:'MSS-J-ARE-20260317-0001'},
    {grade:'GOLD',company:'AWS',economy:'Saudi Arabia',capex_m:5300,reference_code:'MSS-J-SAU-20260317-0002'},
    {grade:'PLATINUM',company:'Siemens Energy',economy:'Egypt',capex_m:340,reference_code:'MSS-D-EGY-20260317-0003'},
    {grade:'GOLD',company:'Samsung',economy:'Vietnam',capex_m:2800,reference_code:'MSS-C-VNM-20260317-0004'},
    {grade:'PLATINUM',company:'Vestas',economy:'India',capex_m:420,reference_code:'MSS-D-IND-20260317-0005'},
  ];

  return (
    <div className="bg-[#060f1a] border-b border-blue-900 py-1.5 px-4 flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-600'}`}/>
        <span className="text-xs font-black text-emerald-400 tracking-widest uppercase">Live</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-6 whitespace-nowrap"
          style={{transform:`translateX(-${(offset*0.4)%((items.length)*220)}px)`,transition:'none'}}>
          {[...items,...items].map((s,i)=>(
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:GRADE_COLORS[s.grade]||'#6b7280'}}/>
              <span className="text-xs text-white font-semibold">{s.company}</span>
              <span className="text-xs text-blue-400">→ {s.economy}</span>
              <span className="text-xs font-black text-blue-300">${s.capex_m}M</span>
              <span className="text-xs text-blue-800 font-mono">{(s.reference_code||'').slice(0,24)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
