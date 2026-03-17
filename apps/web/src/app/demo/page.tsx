'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const FDIWorldMap      = dynamic(()=>import('@/components/FDIWorldMap'),      {ssr:false,loading:()=><div className="h-80 bg-slate-100 rounded-2xl animate-pulse"/>});
const AdvancedAnalytics= dynamic(()=>import('@/components/AdvancedAnalytics'), {ssr:false,loading:()=><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"/>});

const DEMO_SIGNALS = [
  {grade:'PLATINUM',company:'Microsoft Corp',     economy:'UAE',     capex:'$850M',  sci:91.2,sector:'ICT',     type:'Greenfield',status:'CONFIRMED'},
  {grade:'PLATINUM',company:'Amazon AWS',         economy:'Saudi Arabia',capex:'$5.3B',sci:88.4,sector:'ICT',  type:'Expansion', status:'ANNOUNCED'},
  {grade:'GOLD',    company:'Siemens Energy',      economy:'Egypt',   capex:'$340M',  sci:86.1,sector:'Energy', type:'JV',        status:'CONFIRMED'},
  {grade:'GOLD',    company:'CATL',                economy:'Indonesia',capex:'$3.2B', sci:85.4,sector:'Mfg',   type:'Greenfield',status:'COMMITTED'},
  {grade:'GOLD',    company:'Vestas Wind Systems', economy:'India',   capex:'$420M',  sci:85.9,sector:'Energy', type:'Greenfield',status:'ANNOUNCED'},
];
const GRADE_DOT: Record<string,string> = {PLATINUM:'#D97706',GOLD:'#059669',SILVER:'#2563EB'};
export default function DemoPage() {
  const [tab, setTab] = useState<'signals'|'map'|'charts'>('signals');
  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12 text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs font-bold text-emerald-300">
            <span className="w-2 h-2 bg-emerald-400 rounded-full live-dot"/> Live Demo — No login required
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Experience Global FDI Monitor</h1>
          <p className="text-white/70 mb-6">Preview live signals, interactive maps, and analytics. Full access from $899/month.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/register" className="gfm-btn-primary px-8 py-3 rounded-lg bg-white text-primary">Start Free Trial</Link>
            <Link href="/pricing"  className="gfm-btn-outline px-6 py-3 rounded-lg" style={{color:'white',borderColor:'rgba(255,255,255,.4)'}}>View Pricing</Link>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-screen-xl mx-auto flex gap-0">
          {[['signals','📡 Signals'],['map','🌍 World Map'],['charts','📊 Analytics']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {tab==='signals' && (
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs text-slate-400 mb-4">Showing 5 of 218+ live signals · <Link href="/register" className="text-primary font-semibold hover:underline">Sign up to see all →</Link></div>
            {DEMO_SIGNALS.map((s,i)=>(
              <div key={i} className="signal-card">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:GRADE_DOT[s.grade]||'#6b7280'}}/>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm text-deep">{s.company}</span>
                      <span className="text-slate-300">→</span>
                      <span className="text-sm font-semibold text-primary">{s.economy}</span>
                      <span className={`gfm-badge ml-auto ${s.grade==='PLATINUM'?'gfm-badge-platinum':s.grade==='GOLD'?'gfm-badge-gold':'gfm-badge-silver'}`}>{s.grade}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="font-bold text-slate-700 font-mono">{s.capex}</span>
                      <span>SCI {s.sci}</span>
                      <span className="text-slate-300">|</span>
                      <span>{s.sector}</span>
                      <span className="text-slate-300">|</span>
                      <span>{s.type}</span>
                      <span className={`font-semibold ${s.status==='CONFIRMED'?'text-emerald-600':s.status==='COMMITTED'?'text-teal-600':'text-blue-600'}`}>{s.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="gfm-card p-5 text-center border-dashed border-2 border-primary">
              <div className="text-lg font-extrabold text-deep mb-1">213+ more signals available</div>
              <p className="text-slate-500 text-sm mb-4">Including PLATINUM signals with full investment details, SCI scores, and provenance.</p>
              <Link href="/register" className="gfm-btn-primary px-8 py-3">Start Free Trial — No Card Required</Link>
            </div>
          </div>
        )}
        {tab==='map'    && <FDIWorldMap/>}
        {tab==='charts' && <AdvancedAnalytics/>}
      </div>
    </div>
  );
}
