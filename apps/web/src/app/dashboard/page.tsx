'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Globe4D        = dynamic(() => import('@/components/Globe4D'),        { ssr:false });
const BentoDashboard = dynamic(() => import('@/components/BentoDashboard'),  { ssr:false });
const AdvancedCharts = dynamic(() => import('@/components/AdvancedAnalytics'),{ ssr:false });

export default function DashboardPage() {
  const [tab, setTab] = useState<'overview'|'globe'|'analytics'>('overview');

  return (
    <div className="min-h-screen bg-[#060f1a]">
      {/* Top bar */}
      <div className="bg-[#0d1f35] border-b border-blue-900 px-5 py-3 flex items-center gap-4 sticky top-14 z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
          <span className="text-xs font-bold text-emerald-400">LIVE</span>
        </div>
        <div className="flex gap-1 ml-2">
          {(['overview','globe','analytics'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                tab===t?'bg-blue-600 text-white':'text-blue-400 hover:bg-blue-900/50'
              }`}>{t==='overview'?'🗂 Overview':t==='globe'?'🌍 4D Globe':'📊 Analytics'}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/fic" className="text-xs text-amber-400 font-bold hover:underline">FIC: 5 ⭐</Link>
          <Link href="/pricing" className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">Upgrade</Link>
        </div>
      </div>

      <div className="p-5 max-w-7xl mx-auto">
        {tab === 'overview'   && <BentoDashboard/>}
        {tab === 'globe'      && <Globe4D/>}
        {tab === 'analytics'  && <AdvancedCharts/>}
      </div>
    </div>
  );
}
