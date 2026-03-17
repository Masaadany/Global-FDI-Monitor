'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Globe4D          = dynamic(() => import('@/components/Globe4D'),          { ssr:false, loading:()=><div className="h-96 bg-[#060f1a] rounded-2xl animate-pulse flex items-center justify-center text-blue-800 text-sm">Loading globe…</div> });
const BentoDashboard   = dynamic(() => import('@/components/BentoDashboard'),   { ssr:false, loading:()=><div className="space-y-4"><div className="h-16 bg-slate-100 rounded-xl animate-pulse"/><div className="grid grid-cols-4 gap-3">{[1,2,3,4].map(i=><div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"/>)}</div></div> });
const AdvancedCharts   = dynamic(() => import('@/components/AdvancedAnalytics'),{ ssr:false, loading:()=><div className="h-64 bg-slate-100 rounded-xl animate-pulse"/> });
const InvestmentHeatmap= dynamic(() => import('@/components/InvestmentHeatmap'),{ ssr:false, loading:()=><div className="h-64 bg-slate-100 rounded-xl animate-pulse"/> });

type Tab = 'overview'|'globe'|'analytics'|'heatmap';

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('overview');

  const TABS: [Tab, string][] = [
    ['overview', '🗂 Overview'],
    ['globe',    '🌍 4D Globe'],
    ['analytics','📊 Charts'],
    ['heatmap',  '🔥 Heatmap'],
  ];

  return (
    <div className="min-h-screen bg-[#060f1a]">
      {/* Toolbar */}
      <div className="bg-[#0d1f35] border-b border-blue-900/50 px-5 py-2.5 flex items-center gap-3 sticky top-14 z-30">
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live</span>
        </span>
        <div className="flex gap-1">
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tab===t?'bg-blue-600 text-white':'text-blue-400 hover:bg-blue-900/50'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/fic"     className="text-xs text-amber-400 font-bold hover:underline">⭐ Buy FIC</Link>
          <Link href="/pricing" className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">Upgrade</Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 max-w-7xl mx-auto">
        {tab === 'overview'  && <BentoDashboard/>}
        {tab === 'globe'     && <Globe4D/>}
        {tab === 'analytics' && (
          <div className="bg-white rounded-2xl p-5">
            <AdvancedCharts/>
          </div>
        )}
        {tab === 'heatmap'   && <InvestmentHeatmap/>}
      </div>
    </div>
  );
}
