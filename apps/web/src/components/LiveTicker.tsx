'use client';
import { useEffect, useState } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';

const STATIC_SIGNALS = [
  '📡 PLATINUM — Microsoft → UAE $850M Cloud Region Confirmed',
  '⚡ PLATINUM — Amazon AWS → Saudi Arabia $5.3B Expansion Announced',
  '🏆 GFR Update — UAE +4.2pts · Largest quarterly gain in history',
  '🟢 GOLD — Siemens Energy → Egypt $340M Wind JV Confirmed',
  '⚡ PLATINUM — CATL → Indonesia $3.2B Battery Gigafactory Committed',
  '📡 GOLD — Vestas Wind → India $420M Renewable Factory Announced',
  '🌍 MENA FDI — Q1 2026 hits 5-year high at $88B (UNCTAD)',
  '🟡 GOLD — NVIDIA → Singapore $4.4B AI Supercomputer Announced',
  '📊 GFR Rank #1 — SGP 88.5pts · #2 CHE 87.5pts · #3 USA 84.5pts',
  '🔮 Forecast — Global FDI projected $4.2T by 2028 (GFM)',
  '⚡ PLATINUM — ACWA Power → Morocco $1.1B Atlantic Wind Confirmed',
  '🟢 GOLD — Google → UAE $1B Cloud Region Announced',
];

const GRADE_COLOR: Record<string,string> = {PLATINUM:'text-amber-400',GOLD:'text-emerald-400',SILVER:'text-blue-400'};

export default function LiveTicker() {
  const { signals, connected } = useRealTimeSignals(5);
  const [items, setItems] = useState(STATIC_SIGNALS);

  useEffect(() => {
    if (signals.length > 0) {
      const liveItems = signals.slice(0, 6).map((s: any) =>
        `📡 ${s.grade} — ${s.company} → ${s.economy} $${s.capex_m}M ${s.signal_type}`
      );
      setItems([...liveItems, ...STATIC_SIGNALS].slice(0, 16));
    }
  }, [signals]);

  const doubled = [...items, ...items];

  return (
    <div className="bg-deep border-b border-white/10 overflow-hidden relative" style={{height:'32px'}}>
      <div className="flex items-center h-full">
        {/* Live badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 h-full border-r border-white/10 bg-black/20 z-10">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 live-dot' : 'bg-slate-500'}`}/>
          <span className="text-xs font-bold text-emerald-400 tracking-widest">LIVE</span>
        </div>
        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-ticker">
            {doubled.map((item, i) => (
              <span key={i} className="inline-flex items-center text-xs text-white/70 mr-12 hover:text-white transition-colors cursor-default">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
