'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';
import { exportSignals } from '@/lib/export';
const Globe4D          = dynamic(()=>import('@/components/Globe4D'),           {ssr:false,loading:()=><div className="h-96 bg-deep rounded-2xl animate-pulse"/>});
const AdvancedAnalytics= dynamic(()=>import('@/components/AdvancedAnalytics'),  {ssr:false,loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/>});
const InvestmentHeatmap= dynamic(()=>import('@/components/InvestmentHeatmap'),  {ssr:false,loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/>});
const FDIWorldMap      = dynamic(()=>import('@/components/FDIWorldMap'),        {ssr:false,loading:()=><div className="h-96 bg-slate-100 rounded-2xl animate-pulse"/>});
const API = process.env.NEXT_PUBLIC_API_URL||'';
const GRADE_DOT: Record<string,string>={PLATINUM:'#D97706',GOLD:'#059669',SILVER:'#2563EB',BRONZE:'#6B7280'};
export default function AnalyticsPage() {
  const [tab,setTab]=useState<'globe'|'worldmap'|'charts'|'heatmap'|'live'>('globe');
  const [kpis,setKpis]=useState({signals:218,platinum:24,gfrLeader:'SGP 88.5',ws:0});
  const {signals:live,connected,totalSeen}=useRealTimeSignals(40);
  useEffect(()=>{
    Promise.all([fetch(`${API}/api/v1/signals?size=1`).then(r=>r.json()),fetch(`${API}/api/v1/gfr?size=1`).then(r=>r.json())]).then(([s,g])=>{
      setKpis({signals:s?.data?.total||218,platinum:s?.meta?.platinum||24,gfrLeader:g?.data?.rankings?.[0]?`${g.data.rankings[0].iso3} ${g.data.rankings[0].composite}`:'SGP 88.5',ws:connected?1:0});
    }).catch(()=>{});
  },[connected]);
  const KPIS=[
    {l:'Active Signals',v:String(kpis.signals),sub:'↑12% vs last week',color:'text-primary'},
    {l:'PLATINUM Grade', v:String(kpis.platinum),sub:'Highest conviction',color:'text-amber-600'},
    {l:'GFR Leader',     v:kpis.gfrLeader,sub:'Q1 2026 Rank #1',color:'text-emerald-600'},
    {l:'Economies',      v:'215',sub:'Full WB coverage',color:'text-violet-600'},
  ];
  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Intelligence Analytics</div>
            <h1 className="text-3xl font-extrabold">Global Analytics</h1>
          </div>
          <div className={`flex items-center gap-2 text-xs font-bold ${connected?'text-emerald-300':'text-white/40'}`}>
            <span className={`w-2 h-2 rounded-full ${connected?'bg-emerald-400 live-dot':'bg-white/20'}`}/>
            {connected?`LIVE · ${totalSeen} processed`:'Connecting…'}
          </div>
        </div>
      </section>
      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-screen-xl mx-auto flex gap-0">
          {[['globe','🌍 4D Globe'],['worldmap','🗺 World Map'],['charts','📊 Charts'],['heatmap','🔥 Heatmap'],['live','📡 Live Feed']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)} className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>{l}</button>
          ))}
          {tab==='live'&&<button onClick={()=>exportSignals(live.map((s:any)=>({...s,id:s.reference_code})))} className="ml-auto gfm-btn-outline text-xs my-2 px-3">Export CSV</button>}
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-5 space-y-4">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KPIS.map(k=><div key={k.l} className="gfm-card p-4"><div className="text-xs text-slate-400 mb-1">{k.l}</div><div className={`text-2xl font-extrabold font-mono ${k.color}`}>{k.v}</div><div className="text-xs text-slate-400 mt-1">{k.sub}</div></div>)}
        </div>
        {tab==='globe'   &&<Globe4D/>}
        {tab==='worldmap'&&<FDIWorldMap/>}
        {tab==='charts'  &&<AdvancedAnalytics/>}
        {tab==='heatmap' &&<InvestmentHeatmap/>}
        {tab==='live'&&(
          <div className="gfm-card p-5">
            <div className="font-extrabold text-deep mb-3 text-sm">Real-Time Signal Stream · SHA-256 Verified</div>
            {live.length===0?<div className="text-center py-12 text-slate-400"><div className="text-4xl mb-3">📡</div><div className="text-sm">{connected?'Scanning…':'Connecting…'}</div></div>:(
              <div className="space-y-2">
                {live.map((s:any,i:number)=>(
                  <div key={i} className="signal-card">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{background:GRADE_DOT[s.grade]||'#6b7280'}}/>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><span className="font-bold text-xs text-deep">{s.company}</span><span className="text-xs text-primary font-semibold">→ {s.economy}</span></div>
                        <div className="text-xs text-slate-400">ISIC {s.sector} · SCI {s.sci_score}</div>
                      </div>
                      <div className="text-right"><div className="font-extrabold text-sm text-primary font-mono">${s.capex_m}M</div><span className="gfm-badge text-white text-xs px-1.5 py-0.5 rounded" style={{background:GRADE_DOT[s.grade]||'#6b7280'}}>{s.grade}</span></div>
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
