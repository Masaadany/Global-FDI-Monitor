'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';

const Globe4D          = dynamic(() => import('@/components/Globe4D'),          { ssr:false });
const AdvancedAnalytics= dynamic(() => import('@/components/AdvancedAnalytics'), { ssr:false });
const InvestmentHeatmap= dynamic(() => import('@/components/InvestmentHeatmap'), { ssr:false });

const GRADE_COLORS: Record<string,string> = {
  PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'
};

export default function AnalyticsPage() {
  const [tab, setTab] = useState<'globe'|'charts'|'heatmap'|'live'>('globe');
  const { signals, connected, totalSeen } = useRealTimeSignals(30);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Global Intelligence Analytics</span>
        <div className="flex gap-1 ml-4">
          {([
            ['globe',   '🌍 4D Globe'],
            ['charts',  '📊 Charts'],
            ['heatmap', '🔥 Heatmap'],
            ['live',    '📡 Live Feed'],
          ] as const).map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tab===t?'bg-[#0A2540] text-white':'text-slate-400 hover:text-slate-600'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-300'}`}/>
          <span className={`text-xs font-bold ${connected?'text-emerald-600':'text-slate-400'}`}>
            {connected?`LIVE · ${totalSeen} signals`:'Connecting…'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5">
        {tab === 'globe'   && <Globe4D/>}
        {tab === 'charts'  && <AdvancedAnalytics/>}
        {tab === 'heatmap' && <InvestmentHeatmap/>}

        {tab === 'live' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-black text-[#0A2540]">Real-Time Signal Stream</div>
                <div className="text-xs text-slate-400">WebSocket · 2s updates · SHA-256 verified</div>
              </div>
              {signals.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-3xl mb-2">📡</div>
                  <div className="text-sm">{connected ? 'Waiting for signals…' : 'Connecting to WebSocket…'}</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {signals.map((s, i) => (
                    <div key={`${s.reference_code}-${i}`}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                      <span className="text-xs font-black px-2 py-0.5 rounded text-white flex-shrink-0"
                        style={{background:GRADE_COLORS[s.grade]||'#6b7280'}}>{s.grade}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-[#0A2540] truncate">{s.company}</div>
                        <div className="text-xs text-slate-400">{s.economy} · ISIC {s.sector}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-black text-blue-600">${s.capex_m}M</div>
                        <div className="text-xs text-slate-400">SCI {s.sci_score}</div>
                      </div>
                      <div className="text-right flex-shrink-0 hidden md:block">
                        <div className="text-xs font-mono text-slate-400 truncate max-w-36">{s.reference_code}</div>
                        {s.provenance && (
                          <div className="text-xs text-emerald-600 font-bold">
                            {s.provenance.verified ? '✓ Verified' : '?'} {s.provenance.tier}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
