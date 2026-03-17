'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const FDIWorldMap = dynamic(() => import('@/components/FDIWorldMap'), { ssr:false });
const AdvancedAnalytics = dynamic(() => import('@/components/AdvancedAnalytics'), { ssr:false });

const LIVE_SIGNALS = [
  {id:'S001',grade:'PLATINUM',company:'Microsoft Corp',economy:'UAE',sector:'Technology',value:'$850M',sci:91.2,time:'2 min ago'},
  {id:'S002',grade:'GOLD',company:'Amazon Web Services',economy:'Saudi Arabia',sector:'Cloud',value:'$5.3B',sci:88.4,time:'5 min ago'},
  {id:'S003',grade:'PLATINUM',company:'Siemens Energy',economy:'Egypt',sector:'Energy',value:'$340M',sci:86.1,time:'8 min ago'},
  {id:'S004',grade:'GOLD',company:'Samsung Electronics',economy:'Vietnam',sector:'Manufacturing',value:'$2.8B',sci:83.7,time:'12 min ago'},
  {id:'S005',grade:'SILVER',company:'BlackRock Inc',economy:'UAE',sector:'Finance',value:'$500M',sci:74.2,time:'15 min ago'},
  {id:'S006',grade:'PLATINUM',company:'Vestas Wind',economy:'India',sector:'Renewables',value:'$420M',sci:85.9,time:'18 min ago'},
  {id:'S007',grade:'GOLD',company:'Databricks',economy:'Singapore',sector:'AI/Data',value:'$150M',sci:79.3,time:'22 min ago'},
  {id:'S008',grade:'SILVER',company:'Nuveen AM',economy:'UAE',sector:'Finance',value:'$600M',sci:71.8,time:'25 min ago'},
];

const GRADE_STYLES: Record<string,string> = {
  PLATINUM:'bg-amber-100 text-amber-700 border-amber-300',
  GOLD:'bg-emerald-100 text-emerald-700 border-emerald-300',
  SILVER:'bg-blue-100 text-blue-700 border-blue-300',
  BRONZE:'bg-slate-100 text-slate-500 border-slate-300',
};

export default function DashboardPage() {
  const [tab, setTab] = useState<'overview'|'map'|'analytics'>('overview');
  const [tick, setTick] = useState(0);
  const orgName = typeof window !== 'undefined' ? (localStorage.getItem('gfm_org') || 'Your Organisation') : 'Your Organisation';

  useEffect(() => {
    const id = setInterval(() => setTick(t => t+1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-4 sticky top-14 z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
          <span className="text-xs font-bold text-emerald-600">LIVE</span>
          <span className="text-xs text-slate-400">{tick * 2} signals processed</span>
        </div>
        <div className="flex gap-1 ml-4">
          {(['overview','map','analytics'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                tab===t ? 'bg-[#0A2540] text-white' : 'text-slate-400 hover:text-slate-600'
              }`}>{t}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-xs text-slate-400">FIC Balance: <span className="font-black text-blue-600">5</span></div>
          <Link href="/pricing" className="bg-[#1D4ED8] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">Upgrade</Link>
        </div>
      </div>

      <div className="p-5 max-w-7xl mx-auto">
        {tab === 'overview' && (
          <div className="space-y-5">
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {l:'Active Signals', v:'218', sub:'↑ 12% this week', c:'text-blue-600'},
                {l:'Economies Tracked', v:'215', sub:'All regions covered', c:'text-emerald-600'},
                {l:'Platinum Signals', v:'24', sub:'Require 1 FIC each', c:'text-amber-600'},
                {l:'GFR Top Ranked', v:'SGP 88.5', sub:'Global #1 this quarter', c:'text-violet-600'},
              ].map(k => (
                <div key={k.l} className="bg-white rounded-xl border border-slate-100 p-4">
                  <div className="text-xs text-slate-400 mb-1">{k.l}</div>
                  <div className={`text-2xl font-black ${k.c}`}>{k.v}</div>
                  <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Live signals + quick nav */}
            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                  <div className="font-black text-sm text-[#0A2540]">Live Signal Feed</div>
                  <Link href="/signals" className="text-xs text-blue-600 font-semibold hover:underline">View all →</Link>
                </div>
                <div className="divide-y divide-slate-50">
                  {LIVE_SIGNALS.map(s => (
                    <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <span className={`text-xs font-black px-2 py-0.5 rounded border flex-shrink-0 ${GRADE_STYLES[s.grade]}`}>
                        {s.grade.slice(0,4)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-[#0A2540] truncate">{s.company}</div>
                        <div className="text-xs text-slate-400">{s.economy} · {s.sector}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-black text-blue-600">{s.value}</div>
                        <div className="text-xs text-slate-400">{s.time}</div>
                      </div>
                      <div className="w-10 text-right">
                        <span className="text-xs font-bold text-slate-500">{s.sci}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick nav */}
              <div className="space-y-3">
                {[
                  {href:'/gfr',      icon:'🏆', title:'GFR Rankings',    desc:'215 economies ranked'},
                  {href:'/reports',  icon:'📋', title:'Custom Reports',  desc:'10 report types'},
                  {href:'/signals',  icon:'📡', title:'Signal Monitor',  desc:'Real-time intelligence'},
                  {href:'/forecast', icon:'🔮', title:'Forecast',        desc:'9-horizon outlook'},
                  {href:'/pmp',      icon:'🎯', title:'Mission Planning',desc:'Target companies'},
                  {href:'/analytics',icon:'📊', title:'Analytics',       desc:'Charts & maps'},
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 p-3.5 hover:shadow-sm transition-all hover:border-blue-200">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-bold text-xs text-[#0A2540]">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'map' && <FDIWorldMap />}
        {tab === 'analytics' && <AdvancedAnalytics />}
      </div>
    </div>
  );
}
