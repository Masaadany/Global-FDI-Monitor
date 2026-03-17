'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Globe4D          = dynamic(() => import('@/components/Globe4D'),          { ssr:false, loading:()=><div className="h-96 rounded-2xl animate-pulse bg-slate-900"/> });
const BentoDashboard   = dynamic(() => import('@/components/BentoDashboard'),   { ssr:false, loading:()=><div className="h-64 rounded-2xl animate-pulse bg-slate-100"/> });
const AdvancedAnalytics= dynamic(() => import('@/components/AdvancedAnalytics'), { ssr:false, loading:()=><div className="h-64 rounded-2xl animate-pulse bg-slate-100"/> });
const InvestmentHeatmap= dynamic(() => import('@/components/InvestmentHeatmap'), { ssr:false, loading:()=><div className="h-64 rounded-2xl animate-pulse bg-slate-100"/> });

const TABS = [
  {id:'overview', label:'Overview',  icon:'🗂'},
  {id:'globe',    label:'4D Globe',  icon:'🌍'},
  {id:'analytics',label:'Analytics', icon:'📊'},
  {id:'heatmap',  label:'Heatmap',   icon:'🔥'},
] as const;

export default function DashboardPage() {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('overview');

  return (
    <div className="min-h-screen bg-surface">
      {/* Dashboard header */}
      <div className="bg-deep text-white border-b border-white/10 px-6 py-3 sticky top-14 z-30">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full live-dot"/>
            <span className="text-xs font-bold text-emerald-400 tracking-widest">LIVE</span>
          </div>
          <div className="flex gap-1">
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab===t.id?'bg-primary text-white':'text-white/60 hover:text-white hover:bg-white/10'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/subscription" className="text-xs text-amber-300 font-bold hover:underline">⭐ FIC Credits</Link>
            <Link href="/subscription" className="gfm-btn-primary text-xs py-1.5 px-3">Upgrade</Link>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-5">
        {tab==='overview'  && <BentoDashboard/>}
        {tab==='globe'     && <Globe4D/>}
        {tab==='analytics' && <AdvancedAnalytics/>}
        {tab==='heatmap'   && <InvestmentHeatmap/>}
      </div>
    </div>
  );
}
