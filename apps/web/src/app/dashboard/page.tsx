'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Globe4D         = dynamic(() => import('@/components/Globe4D'),         { ssr:false, loading:()=><div className="h-96 bg-[#060f1a] rounded-2xl animate-pulse"/> });
const BentoDashboard  = dynamic(() => import('@/components/BentoDashboard'),  { ssr:false, loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/> });
const AdvancedCharts  = dynamic(() => import('@/components/AdvancedAnalytics'),{ ssr:false, loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/> });
const InvestmentHeatmap= dynamic(() => import('@/components/InvestmentHeatmap'),{ ssr:false, loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/> });

export default function DashboardPage() {
  const [tab, setTab] = useState<'overview'|'globe'|'analytics'|'heatmap'>('overview');

  return (
    <div className="min-h-screen bg-[#060f1a]">
      <div className="bg-[#0d1f35] border-b border-blue-900 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"/>
        <span className="text-xs font-bold text-emerald-400">LIVE</span>
        <div className="flex gap-1 ml-2 flex-wrap">
          {([
            ['overview','🗂 Overview'],
            ['globe',   '🌍 4D Globe'],
            ['analytics','📊 Analytics'],
            ['heatmap', '🔥 Heatmap'],
          ] as const).map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tab===t?'bg-blue-600 text-white':'text-blue-400 hover:bg-blue-900/50'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/fic" className="text-xs text-amber-400 font-bold hover:underline">⭐ FIC Credits</Link>
          <Link href="/pricing" className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">Upgrade</Link>
        </div>
      </div>
      <div className="p-5 max-w-7xl mx-auto">
        {tab === 'overview'   && <BentoDashboard/>}
        {tab === 'globe'      && <Globe4D/>}
        {tab === 'analytics'  && <AdvancedCharts/>}
        {tab === 'heatmap'    && <InvestmentHeatmap/>}
      </div>
    </div>
  );
}
