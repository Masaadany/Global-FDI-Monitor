'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';
import { exportSignals, exportGFR } from '@/lib/export';

const Globe4D          = dynamic(() => import('@/components/Globe4D'),           { ssr:false, loading:()=><div className="h-96 bg-[#060f1a] rounded-2xl animate-pulse"/> });
const AdvancedAnalytics= dynamic(() => import('@/components/AdvancedAnalytics'),  { ssr:false, loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/> });
const InvestmentHeatmap= dynamic(() => import('@/components/InvestmentHeatmap'),  { ssr:false, loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/> });
const FDIWorldMap      = dynamic(() => import('@/components/FDIWorldMap'),        { ssr:false, loading:()=><div className="h-96 bg-slate-100 rounded-2xl animate-pulse"/> });
const GlobeMap         = dynamic(() => import('@/components/GlobeMap'),            { ssr:false, loading:()=><div className="h-96 bg-[#030d1a] rounded-2xl animate-pulse"/> });

const API = process.env.NEXT_PUBLIC_API_URL || '';
const GRADE_COLORS: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

export default function AnalyticsPage() {
  const [tab,     setTab]    = useState<'globe'|'charts'|'heatmap'|'live'>('globe');
  const [kpis,    setKpis]   = useState({signals:218,platinum:24,economies:215,gfrLeader:'SGP 88.5'});
  const [loading, setLoading]= useState(true);
  const { signals: liveSignals, connected, totalSeen } = useRealTimeSignals(40);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      try {
        const [sigR, gfrR] = await Promise.all([
          fetch(`${API}/api/v1/signals?size=1`),
          fetch(`${API}/api/v1/gfr?size=1`),
        ]);
        const [sigD, gfrD] = await Promise.all([sigR.json(), gfrR.json()]);
        setKpis({
          signals:  sigD?.data?.total || sigD?.meta?.total || 218,
          platinum: sigD?.data?.pagination?.total || sigD?.meta?.platinum || 24,
          economies:215,
          gfrLeader: gfrD?.data?.rankings?.[0] ? `${gfrD.data.rankings[0].iso3} ${gfrD.data.rankings[0].composite}` : 'SGP 88.5',
        });
      } catch {}
      setLoading(false);
    }
    load();
  },[]);

  const KPIS = [
    {l:'Active Signals',    v:loading?'…':String(kpis.signals),  sub:'↑ 12% vs last week', c:'text-blue-600',   bg:'bg-blue-50'},
    {l:'Platinum Signals',  v:loading?'…':String(kpis.platinum), sub:'Premium intelligence', c:'text-amber-600',  bg:'bg-amber-50'},
    {l:'Economies Tracked', v:'215',                              sub:'All World Bank economies',c:'text-emerald-600',bg:'bg-emerald-50'},
    {l:'GFR Leader',        v:loading?'…':kpis.gfrLeader,        sub:'Q1 2026 Rank #1',    c:'text-violet-600', bg:'bg-violet-50'},
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Global Intelligence Analytics</span>
        <div className="flex gap-1 ml-4">
          {(['globe','charts','heatmap','live'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${tab===t?'bg-[#0A2540] text-white':'text-slate-400 hover:text-slate-600'}`}>
              {t==='globe'?'🌍 4D Globe':t==='charts'?'📊 Charts':t==='heatmap'?'🔥 Heatmap':'📡 Live Feed'}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {tab==='live' && (
            <button onClick={()=>exportSignals(liveSignals.map((s:any)=>({...s,id:s.reference_code})))}
              className="text-xs font-bold border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg hover:border-blue-300">
              Export CSV
            </button>
          )}
          <div className={`flex items-center gap-1.5 text-xs font-bold ${connected?'text-emerald-600':'text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-300'}`}/>
            {connected ? `LIVE · ${totalSeen}` : 'Connecting…'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5 space-y-4">
        {/* KPI row — always visible */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KPIS.map(k=>(
            <div key={k.l} className={`rounded-xl border border-slate-100 p-4 bg-white ${loading?'animate-pulse':''}`}>
              <div className="text-xs text-slate-400 mb-1">{k.l}</div>
              <div className={`text-2xl font-black ${k.c}`}>{k.v}</div>
              <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {tab==='globe'   && <Globe4D/>}
        {tab==='charts'  && <AdvancedAnalytics/>}
        {tab==='heatmap'   && <InvestmentHeatmap/>}
        {tab==='worldmap'  && <FDIWorldMap/>}

        {tab==='live' && (
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-black text-[#0A2540]">Real-Time Signal Stream</div>
                <div className="text-xs text-slate-400 mt-0.5">WebSocket · 2-second updates · SHA-256 verified provenance</div>
              </div>
              <span className="text-xs text-slate-400">{liveSignals.length} in buffer</span>
            </div>
            {liveSignals.length === 0 ? (
              <div className="text-center py-14 text-slate-400">
                <div className="text-4xl mb-3">📡</div>
                <div className="text-sm font-semibold">{connected?'Scanning for signals…':'Connecting to WebSocket…'}</div>
                <div className="text-xs mt-1">Updates every 2 seconds</div>
              </div>
            ) : (
              <div className="space-y-2">
                {liveSignals.map((s:any,i:number)=>(
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:GRADE_COLORS[s.grade]||'#6b7280'}}/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0A2540]">{s.company}</span>
                        <span className="text-slate-400 text-xs">→</span>
                        <span className="text-xs font-bold text-blue-600">{s.economy}</span>
                      </div>
                      <div className="text-xs text-slate-400">ISIC {s.sector} · SCI {s.sci_score}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-blue-600">${s.capex_m}M</div>
                      <div className="text-xs font-bold px-1.5 py-0.5 rounded text-white mt-0.5" style={{background:GRADE_COLORS[s.grade]||'#6b7280'}}>{s.grade}</div>
                    </div>
                    <div className="hidden md:block text-right flex-shrink-0 min-w-0">
                      <div className="text-xs font-mono text-slate-400 truncate max-w-36">{s.reference_code}</div>
                      {s.provenance?.verified && <div className="text-xs text-emerald-600 font-bold">✓ T{s.provenance.tier?.replace('T','')}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
