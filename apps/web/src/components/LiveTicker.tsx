'use client';
import { useState, useEffect, useRef } from 'react';

const DEMO_TICKS = [
  { cic:'GFM-ARE-MSFT-2026-PL01', company:'Microsoft',     eco:'UAE',          grade:'PLATINUM', capex_m:850  },
  { cic:'GFM-IDN-CATL-2026-PL02', company:'CATL',          eco:'Indonesia',    grade:'PLATINUM', capex_m:3200 },
  { cic:'GFM-IND-NVDA-2026-PL03', company:'NVIDIA',        eco:'India',        grade:'PLATINUM', capex_m:1100 },
  { cic:'GFM-SAU-ACWA-2026-GD04', company:'ACWA Power',    eco:'Saudi Arabia', grade:'GOLD',     capex_m:980  },
  { cic:'GFM-VNM-SAMS-2026-PL05', company:'Samsung SDI',   eco:'Vietnam',      grade:'PLATINUM', capex_m:2100 },
  { cic:'GFM-ARE-AMZN-2026-GD06', company:'Amazon AWS',    eco:'UAE',          grade:'GOLD',     capex_m:420  },
  { cic:'GFM-EGY-TOTE-2026-GD07', company:'TotalEnergies', eco:'Egypt',        grade:'GOLD',     capex_m:890  },
  { cic:'GFM-SGP-GOOG-2026-GD08', company:'Google Cloud',  eco:'Singapore',    grade:'GOLD',     capex_m:620  },
];

const GRADE_COLORS: Record<string,string> = { PLATINUM:'#0A3D62', GOLD:'#74BB65', SILVER:'#696969', BRONZE:'#696969' };

export default function LiveTicker() {
  const [signals, setSignals] = useState(DEMO_TICKS);
  const [offset,  setOffset]  = useState(0);
  const wsRef = useRef<WebSocket|null>(null);
  const rafRef = useRef<number>(0);
  const lastTs = useRef(Date.now());

  useEffect(() => {
    // Smooth scroll animation
    function tick() {
      const now = Date.now();
      const delta = now - lastTs.current;
      lastTs.current = now;
      setOffset(prev => {
        const next = prev + delta * 0.04; // px per ms
        return next > signals.length * 220 ? 0 : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    // WebSocket for real signals
    try {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'wss://api.fdimonitor.org/ws');
      ws.onmessage = e => {
        const d = JSON.parse(e.data);
        if (d.signals?.length) setSignals(prev => [...d.signals.slice(0, 4), ...prev.slice(0, 4)]);
      };
      wsRef.current = ws;
    } catch {}

    return () => {
      cancelAnimationFrame(rafRef.current);
      wsRef.current?.close();
    };
  }, [signals.length]);

  const doubled = [...signals, ...signals]; // infinite loop

  return (
    <div role="marquee" aria-label="Live FDI signal ticker" className="overflow-hidden relative" style={{background:'rgba(240,248,238,0.9)',borderBottom:'1px solid rgba(10,61,98,0.1)'}}>
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="flex items-center gap-1.5 flex-shrink-0 pr-3" style={{borderRight:'1px solid rgba(10,61,98,0.15)'}}>
          <span className="live-dot"/>
          <span className="text-xs font-extrabold uppercase tracking-widest" style={{color:'#74BB65'}}>LIVE</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-6 whitespace-nowrap transition-none"
               style={{transform:`translateX(-${offset % (signals.length * 220)}px)`, transition:'none'}}>
            {doubled.map((s, i) => (
              <div key={`${s.cic}-${i}`} className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-extrabold px-1.5 py-0.5 rounded text-midnight"
                      style={{background: GRADE_COLORS[s.grade] || '#696969', fontSize: 9}}>
                  {s.grade.slice(0,2)}
                </span>
                <span className="text-xs font-bold" style={{color:'#0A3D62'}}>{s.company}</span>
                <span className="text-xs" style={{color:'#696969'}}>{s.eco}</span>
                <span className="text-xs font-extrabold font-data" style={{color:'#74BB65'}}>${s.capex_m}M</span>
                <span className="text-xs" style={{color:'rgba(10,61,98,0.3)'}}>·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
