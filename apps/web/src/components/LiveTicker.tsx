'use client';
import { useEffect, useRef, useState } from 'react';
import { UPDATE_INTERVALS } from '@/lib/shared';

interface TickerSignal {
  grade: string;
  company: string;
  destination: string;
  capex: string;
  type: string;
}

// Seed signals for immediate display before WebSocket connects
const SEED_SIGNALS: TickerSignal[] = [
  { grade: 'PLATINUM', type: 'Greenfield', company: 'Microsoft Corp', destination: 'UAE', capex: '$850M' },
  { grade: 'GOLD', type: 'Expansion', company: 'Amazon Web Services', destination: 'Saudi Arabia', capex: '$5.3B' },
  { grade: 'PLATINUM', type: 'Greenfield', company: 'Samsung Electronics', destination: 'Vietnam', capex: '$2.8B' },
  { grade: 'GOLD', type: 'M&A', company: 'BlackRock Inc', destination: 'Saudi Arabia', capex: '$1.2B' },
  { grade: 'GOLD', type: 'Greenfield', company: 'Siemens Energy', destination: 'Egypt', capex: '$340M' },
  { grade: 'SILVER', type: 'JV', company: 'Goldman Sachs', destination: 'India', capex: '$220M' },
];

const GRADE_STYLES: Record<string, string> = {
  PLATINUM: 'text-amber-400 font-black',
  GOLD: 'text-emerald-400 font-bold',
  SILVER: 'text-blue-400 font-semibold',
  BRONZE: 'text-slate-400',
};

export function LiveTicker() {
  const [signals, setSignals] = useState<TickerSignal[]>(SEED_SIGNALS);
  const [liveCount, setLiveCount] = useState(1247);
  const [utcTime, setUtcTime] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  // Clock update
  useEffect(() => {
    const tick = () => {
      setUtcTime(new Date().toUTCString().slice(17, 22) + ' UTC');
      // Simulate live signal count fluctuation (±1-3)
      setLiveCount(c => c + Math.floor(Math.random() * 3 - 1));
    };
    tick();
    const id = setInterval(tick, UPDATE_INTERVALS.critical_signals_ms);
    return () => clearInterval(id);
  }, []);

  // WebSocket connection for real-time signals
  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
    if (!WS_URL || typeof window === 'undefined') return;

    const token = typeof window !== 'undefined'
      ? localStorage.getItem('gfm_access_token')
      : null;
    if (!token) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'auth', token }));
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'new_signal' || data.type === 'watchlist_signal') {
            const newSignal: TickerSignal = {
              grade: data.grade,
              type: data.signal_type_label ?? data.signal_type,
              company: data.company_name ?? 'Company',
              destination: data.economy_iso3,
              capex: data.capex_usd ? formatCapex(data.capex_usd) : '',
            };
            setSignals(prev => [newSignal, ...prev.slice(0, 8)]);
            setLiveCount(c => c + 1);
          }
        } catch {}
      };

      ws.onerror = () => {}; // Graceful degradation — ticker works without WS
      ws.onclose = () => {};
    } catch {}

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="bg-[#0A2540] text-white h-9 flex items-center gap-4 px-4 text-xs overflow-hidden border-b border-white/10">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold opacity-70 tracking-wide">LIVE</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-8 animate-ticker whitespace-nowrap">
          {[...signals, ...signals].map((sig, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span className={GRADE_STYLES[sig.grade] ?? 'text-white'}>
                {sig.grade === 'PLATINUM' ? '⚡' : '●'} {sig.grade}
              </span>
              <span className="text-white/70">·</span>
              <span className="text-white/90">{sig.type}</span>
              <span className="text-white/70">·</span>
              <span className="font-semibold">{sig.company}</span>
              <span className="text-white/70">→</span>
              <span className="text-white/80">{sig.destination}</span>
              {sig.capex && (
                <>
                  <span className="text-white/70">·</span>
                  <span className="text-emerald-400 font-bold">{sig.capex}</span>
                </>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Stats + clock */}
      <div className="flex items-center gap-3 flex-shrink-0 text-white/50">
        <span className="text-white/70">
          <span className="font-bold text-white/90">{liveCount.toLocaleString()}</span> signals today
        </span>
        <span className="font-mono">{utcTime}</span>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function formatCapex(usd: number): string {
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(1)}T`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(0)}M`;
  return `$${usd.toLocaleString()}`;
}
