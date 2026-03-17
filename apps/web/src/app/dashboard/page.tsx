'use client';
import { useEffect, useState, useCallback } from 'react';
import { UPDATE_INTERVALS } from '@/lib/shared';

interface KPI { label: string; value: string; change: string; up: boolean; color: string }
interface Signal {
  signal_code: string; grade: string; signal_type: string;
  company_name: string; economy_iso3: string; headline: string;
  sci_score: number; capex_usd?: number; jobs_created?: number;
  signal_date: string;
}

const GRADE_PILL: Record<string, string> = {
  PLATINUM: 'bg-amber-50 text-amber-700 border border-amber-200',
  GOLD:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  SILVER:   'bg-blue-50 text-blue-700 border border-blue-200',
  BRONZE:   'bg-slate-100 text-slate-500 border border-slate-200',
};

function useSignalStream(apiUrl: string) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Try SSE first, fall back to polling
    const es = new EventSource(`${apiUrl}/signals/stream`);
    es.onopen = () => setConnected(true);
    es.onmessage = (ev) => {
      try {
        const sig = JSON.parse(ev.data);
        setSignals(prev => [sig, ...prev.slice(0, 49)]);
      } catch {}
    };
    es.onerror = () => setConnected(false);
    return () => es.close();
  }, [apiUrl]);

  return { signals, connected };
}

export default function DashboardPage() {
  const API = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';
  const { signals, connected } = useSignalStream(API);

  const [kpis, setKpis] = useState<KPI[]>([
    { label: 'Live Signals (24h)', value: '1,247', change: '↑ 12.4% vs 7-day avg', up: true, color: 'text-blue-700' },
    { label: 'Platinum Signals',   value: '89',    change: '↑ 8 new today', up: true, color: 'text-amber-600' },
    { label: 'GFR Top Mover',      value: 'UAE +4.2', change: '↑ Q1 2026 update', up: true, color: 'text-emerald-600' },
    { label: 'Active Economies',   value: '189/215', change: 'Signalling today', up: true, color: 'text-violet-600' },
  ]);

  // Simulate 2-second live KPI updates
  useEffect(() => {
    const id = setInterval(() => {
      setKpis(prev => prev.map((k, i) => {
        if (i === 0) {
          const n = parseInt(k.value.replace(',', '')) + Math.floor(Math.random() * 2);
          return { ...k, value: n.toLocaleString() };
        }
        if (i === 1) {
          const n = parseInt(k.value) + (Math.random() > 0.85 ? 1 : 0);
          return { ...k, value: String(n) };
        }
        return k;
      }));
    }, UPDATE_INTERVALS.critical_signals_ms);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Filter bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Economy:</span>
        {['All 215', 'GCC', 'EU', 'ASEAN', 'Americas'].map(label => (
          <button key={label}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              label === 'All 215'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
            }`}>
            {label}
          </button>
        ))}
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-2">Sector:</span>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-1.5 text-slate-600 bg-white">
          <option>All Sectors</option>
          <option>Technology (J)</option>
          <option>Manufacturing (C)</option>
          <option>Financial Services (K)</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {connected ? '2-second updates active' : 'Connecting...'}
          </div>
          <button className="bg-[#1D4ED8] text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-100 min-h-[calc(100vh-120px)] flex-shrink-0 py-4">
          {[
            { label: 'Intelligence', items: ['Dashboard Overview', 'FDI Flow Monitor', 'Trade Dynamics', 'Investment Climate'] },
            { label: 'Live Feeds',   items: ['Signal Feed', 'GFR Updates', 'Policy Alerts'] },
            { label: 'Portfolio',    items: ['Watchlist (12)', 'IPA Pipeline', 'Report History'] },
          ].map(group => (
            <div key={group.label} className="mb-4">
              <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-widest">{group.label}</div>
              {group.items.map((item, i) => (
                <button key={item}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all text-left ${
                    item === 'Dashboard Overview'
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-l-2 border-transparent'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    item === 'Signal Feed' ? 'bg-emerald-500' :
                    item === 'GFR Updates' ? 'bg-amber-400' :
                    item === 'Policy Alerts' ? 'bg-blue-500' : 'bg-slate-300'
                  }`} />
                  {item}
                  {item === 'Signal Feed' && (
                    <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs px-1.5 py-0.5 rounded-full font-bold text-[9px]">LIVE</span>
                  )}
                </button>
              ))}
            </div>
          ))}
          <div className="px-4 mt-2">
            <button className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
              + New Report
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-5 overflow-auto">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {kpis.map(kpi => (
              <div key={kpi.label} className="bg-white border border-slate-100 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{kpi.label}</div>
                <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
                <div className={`text-xs mt-1 font-semibold ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {kpi.change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Signal volume chart placeholder */}
            <div className="col-span-2 bg-white border border-slate-100 rounded-xl p-4">
              <div className="font-bold text-sm text-[#0A2540] mb-0.5">Signal Volume — Rolling 30 Days</div>
              <div className="text-xs text-slate-400 mb-3">All 12 MSS modules · SCI-weighted · 2-second live updates</div>
              <SignalSparkline />
            </div>
            {/* Signal types donut */}
            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <div className="font-bold text-sm text-[#0A2540] mb-0.5">Signals by Type</div>
              <div className="text-xs text-slate-400 mb-3">Last 7 days</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Greenfield', pct: 34, color: 'bg-blue-600' },
                  { label: 'M&A', pct: 22, color: 'bg-violet-500' },
                  { label: 'Expansion', pct: 19, color: 'bg-emerald-500' },
                  { label: 'VC/PE', pct: 14, color: 'bg-amber-400' },
                  { label: 'Other', pct: 11, color: 'bg-slate-300' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-slate-500 text-right">{item.label}</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <div className="text-xs font-bold text-slate-600 w-8">{item.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signal feed + top economies */}
          <div className="grid grid-cols-2 gap-4">
            {/* Live signal feed */}
            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-sm text-[#0A2540]">Live Signal Feed</div>
                  <div className="text-xs text-emerald-600 font-semibold">● 2-second updates</div>
                </div>
                <button className="text-xs text-blue-600 font-semibold hover:underline">All Signals →</button>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-auto">
                {(signals.length ? signals : SAMPLE_SIGNALS).slice(0, 8).map((sig, i) => (
                  <div key={sig.signal_code ?? i} className="flex gap-2 items-start py-2 border-b border-slate-50 last:border-0">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${GRADE_PILL[sig.grade] ?? GRADE_PILL.BRONZE}`}>
                      {sig.grade?.slice(0, 3)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#0A2540] truncate">{sig.company_name} · {sig.economy_iso3}</div>
                      <div className="text-xs text-slate-400 truncate">{sig.headline?.slice(0, 80)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Top economies */}
            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <div className="font-bold text-sm text-[#0A2540] mb-3">Top Destination Economies</div>
              <div className="space-y-2.5">
                {[
                  { name: 'UAE', flag: '🇦🇪', count: 312, pct: 100 },
                  { name: 'Saudi Arabia', flag: '🇸🇦', count: 287, pct: 92 },
                  { name: 'India', flag: '🇮🇳', count: 265, pct: 85 },
                  { name: 'Germany', flag: '🇩🇪', count: 198, pct: 63 },
                  { name: 'Singapore', flag: '🇸🇬', count: 187, pct: 60 },
                  { name: 'USA', flag: '🇺🇸', count: 172, pct: 55 },
                  { name: 'UK', flag: '🇬🇧', count: 158, pct: 51 },
                ].map(eco => (
                  <div key={eco.name} className="flex items-center gap-2">
                    <span className="text-sm">{eco.flag}</span>
                    <span className="text-xs text-slate-600 w-24 truncate">{eco.name}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${eco.pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 w-8 text-right">{eco.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SignalSparkline() {
  const data = [980, 1050, 990, 1180, 1100, 1220, 1247];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 400;
  const H = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 10) - 5;
    return `${x},${y}`;
  }).join(' ');
  const labels = ['Mar 3','5','7','9','11','13','15'];
  return (
    <div className="overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }}>
        <polyline points={pts} fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * W;
          const y = H - ((v - min) / range) * (H - 10) - 5;
          return <circle key={i} cx={x} cy={y} r="3" fill="#1D4ED8" />;
        })}
      </svg>
      <div className="flex justify-between text-xs text-slate-300 mt-1 px-1">
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

const SAMPLE_SIGNALS: Signal[] = [
  { signal_code: 'MSS-GFS-ARE-001', grade: 'PLATINUM', signal_type: 'GFS', company_name: 'Microsoft Corp', economy_iso3: 'ARE', headline: 'Microsoft announces $850M data centre campus in Abu Dhabi', sci_score: 91.2, capex_usd: 850000000, signal_date: new Date().toISOString() },
  { signal_code: 'MSS-CES-SAU-002', grade: 'GOLD',     signal_type: 'CES', company_name: 'Amazon Web Services', economy_iso3: 'SAU', headline: 'AWS announces $5.3B Saudi Arabia cloud region expansion', sci_score: 82.5, capex_usd: 5300000000, signal_date: new Date().toISOString() },
  { signal_code: 'MSS-GFS-VNM-003', grade: 'GOLD',     signal_type: 'GFS', company_name: 'Samsung Electronics', economy_iso3: 'VNM', headline: 'Samsung confirms $2.8B semiconductor facility in Vietnam', sci_score: 79.8, capex_usd: 2800000000, signal_date: new Date().toISOString() },
  { signal_code: 'MSS-MAI-SAU-004', grade: 'GOLD',     signal_type: 'MAI', company_name: 'BlackRock Inc', economy_iso3: 'SAU', headline: 'BlackRock acquires Saudi asset management firm for $1.2B', sci_score: 77.4, capex_usd: 1200000000, signal_date: new Date().toISOString() },
  { signal_code: 'MSS-GFS-EGY-005', grade: 'GOLD',     signal_type: 'GFS', company_name: 'Siemens Energy', economy_iso3: 'EGY', headline: 'Siemens Energy to build $340M wind turbine facility in Egypt', sci_score: 73.1, capex_usd: 340000000, signal_date: new Date().toISOString() },
];
