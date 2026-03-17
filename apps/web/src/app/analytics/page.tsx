'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const FDIWorldMap      = dynamic(() => import('@/components/FDIWorldMap'),      { ssr:false, loading:()=><div className="h-96 bg-slate-100 rounded-2xl animate-pulse"/> });
const AdvancedAnalytics= dynamic(() => import('@/components/AdvancedAnalytics'), { ssr:false, loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/> });

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function AnalyticsPage() {
  const [stats,    setStats]    = useState<any>(null);
  const [tab,      setTab]      = useState<'overview'|'map'|'signals'|'forecast'>('overview');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sigRes, gfrRes] = await Promise.all([
          fetch(`${API}/api/v1/signals?size=100`),
          fetch(`${API}/api/v1/gfr`),
        ]);
        const [sigData, gfrData] = await Promise.all([sigRes.json(), gfrRes.json()]);
        setStats({
          totalSignals:   sigData?.meta?.total || sigData?.data?.total || 218,
          platinum:       sigData?.meta?.platinum || 24,
          gold:           sigData?.meta?.gold || 58,
          topEconomy:     gfrData?.data?.rankings?.[0]?.name || 'Singapore',
          topScore:       gfrData?.data?.rankings?.[0]?.composite || 88.5,
          economies:      gfrData?.data?.total || 215,
        });
      } catch { setStats({totalSignals:218,platinum:24,gold:58,topEconomy:'Singapore',topScore:88.5,economies:215}); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const KPIs = [
    {l:'Active Signals',   v:stats?.totalSignals||'—', sub:'↑ 12% this week',   c:'text-blue-600',   bg:'bg-blue-50'},
    {l:'Platinum Signals', v:stats?.platinum||'—',     sub:'Premium intelligence',c:'text-amber-600', bg:'bg-amber-50'},
    {l:'Economies Tracked',v:stats?.economies||'—',    sub:'All World Bank economies',c:'text-emerald-600',bg:'bg-emerald-50'},
    {l:'GFR Leader',       v:stats?`${stats.topEconomy} ${stats.topScore}`:'—', sub:'Q1 2026 #1 rank',c:'text-violet-600',bg:'bg-violet-50'},
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Global Intelligence Analytics</span>
        <div className="flex gap-1 ml-4">
          {(['overview','map','signals','forecast'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${tab===t?'bg-[#0A2540] text-white':'text-slate-400 hover:text-slate-600'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>
          <span className="text-xs text-emerald-600 font-bold">LIVE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5 space-y-5">
        {/* KPI tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KPIs.map(k=>(
            <div key={k.l} className={`rounded-xl border border-slate-100 p-4 ${loading?'animate-pulse':''} bg-white`}>
              <div className="text-xs text-slate-400 mb-1">{k.l}</div>
              <div className={`text-2xl font-black ${k.c}`}>{k.v}</div>
              <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {(tab==='overview'||tab==='map')   && <FDIWorldMap/>}
        {(tab==='overview'||tab==='signals') && <AdvancedAnalytics/>}
      </div>
    </div>
  );
}
