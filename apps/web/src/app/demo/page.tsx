'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Globe4D = dynamic(() => import('@/components/Globe4D'), { ssr:false });


const DEMO_SIGNALS = [
  {grade:'PLATINUM',company:'Microsoft Corp',  economy:'UAE',    value:'$850M',sector:'ICT',  sci:91.2,ref:'MSS-J-ARE-20260317-0001'},
  {grade:'GOLD',    company:'Amazon AWS',      economy:'Saudi Arabia',value:'$5.3B',sector:'ICT',sci:88.4,ref:'MSS-J-SAU-20260317-0002'},
  {grade:'PLATINUM',company:'Siemens Energy',  economy:'Egypt',  value:'$340M',sector:'Energy',sci:86.1,ref:'MSS-D-EGY-20260317-0003'},
  {grade:'GOLD',    company:'Samsung',         economy:'Vietnam',value:'$2.8B',sector:'Manufacturing',sci:83.7,ref:'MSS-C-VNM-20260317-0004'},
  {grade:'PLATINUM',company:'Vestas Wind',     economy:'India',  value:'$420M',sector:'Energy',sci:85.9,ref:'MSS-D-IND-20260317-0005'},
];
const DEMO_GFR = [
  {rank:1,iso3:'SGP',name:'Singapore',   composite:88.5,tier:'FRONTIER'},
  {rank:2,iso3:'CHE',name:'Switzerland', composite:87.5,tier:'FRONTIER'},
  {rank:3,iso3:'ARE',name:'UAE',         composite:80.0,tier:'FRONTIER'},
  {rank:4,iso3:'USA',name:'USA',         composite:84.5,tier:'FRONTIER'},
  {rank:5,iso3:'GBR',name:'UK',          composite:78.5,tier:'HIGH'},
];
const GRADE_DOT: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6'};
const TIER_BG:   Record<string,string> = {FRONTIER:'bg-emerald-100 text-emerald-700',HIGH:'bg-blue-100 text-blue-700'};

export default function DemoPage() {
  const [tick, setTick] = useState(0);
  useEffect(()=>{const id=setInterval(()=>setTick(t=>t+1),2000);return()=>clearInterval(id);},[]);
  const liveSig = DEMO_SIGNALS[tick % DEMO_SIGNALS.length];

  return (
    <div className="min-h-screen bg-[#060f1a] text-white">
      {/* Demo banner */}
      <div className="bg-amber-500 text-white text-center py-2 px-4 text-xs font-black sticky top-14 z-40">
        🎯 INTERACTIVE DEMO — Explore GFM without signing up ·{' '}
        <Link href="/register" className="underline hover:no-underline">Start free trial →</Link>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-5 pt-8 pb-5">
        <div className="text-center mb-8">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Interactive Demo</div>
          <h1 className="text-4xl font-black mb-3">Global FDI Monitor — Live Platform Demo</h1>
          <p className="text-blue-200 text-lg mb-6">Explore the intelligence platform trusted by IPAs and investors across 215 economies.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-7 py-3 rounded-xl hover:bg-blue-500 transition-colors">
              Start Free Trial — No Card
            </Link>
            <Link href="/pricing" className="border border-blue-600 text-blue-300 font-bold px-7 py-3 rounded-xl hover:bg-white/5 transition-colors">
              View Pricing →
            </Link>
          </div>
        </div>

        {/* Live signal ticker */}
        <div className="bg-[#0d1f35] rounded-2xl border border-blue-900 p-5 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Live Signal Feed — Updates Every 2s</span>
            <span className="ml-auto text-xs text-blue-400">{tick * 2} signals processed</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#060f1a] rounded-xl border border-blue-900">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:GRADE_DOT[liveSig.grade]||'#6b7280'}}/>
            <div>
              <div className="font-black text-white">{liveSig.company}</div>
              <div className="text-xs text-blue-400">{liveSig.economy} · {liveSig.sector} · SCI {liveSig.sci}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="font-black text-2xl text-blue-400">{liveSig.value}</div>
              <div className="text-xs font-mono text-blue-800">{liveSig.ref}</div>
            </div>
            <div className="text-xs font-black px-2 py-1 rounded text-white" style={{background:GRADE_DOT[liveSig.grade]}}>{liveSig.grade}</div>
          </div>
        </div>

        {/* Globe + GFR split */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">4D Investment Globe — 2015→2030</div>
            <Globe4D/>
          </div>
          <div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">GFR Rankings — Top 5</div>
            <div className="bg-[#0d1f35] rounded-2xl border border-blue-900 overflow-hidden">
              {DEMO_GFR.map((e,i)=>(
                <div key={e.iso3} className="flex items-center gap-4 px-5 py-4 border-b border-blue-900">
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-xs font-black text-blue-300">#{e.rank}</div>
                  <div className="flex-1">
                    <div className="font-black text-white">{e.name}</div>
                    <div className="text-xs text-blue-400">{e.iso3}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-300">{e.composite}</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_BG[e.tier]||'bg-slate-800 text-slate-400'}`}>{e.tier}</span>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center">
                <Link href="/register" className="text-xs text-blue-400 font-bold hover:underline">Unlock all 215 economies →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            {icon:'📡',title:'Live Signals',       desc:'Real-time PLATINUM to BRONZE FDI signals across 215 economies. 2-second updates.',      cta:'View all signals',   link:'/signals'},
            {icon:'📋',title:'AI Reports',          desc:'10 report types: Country profiles, sector intelligence, mission dossiers. Z3 verified.',cta:'Generate a report',  link:'/reports'},
            {icon:'🎯',title:'Mission Planning',    desc:'AI identifies top target companies by MFS score. Complete company dossiers.',            cta:'Plan a mission',     link:'/pmp'},
            {icon:'🔮',title:'FDI Forecast',        desc:'9-horizon projections: 2025Q4 to 2030. Bayesian VAR + Prophet. 3 scenarios.',           cta:'View forecasts',     link:'/forecast'},
            {icon:'📊',title:'Benchmarking',        desc:'Compare 5 economies on 6 GFR dimensions with radar chart and gap analysis.',            cta:'Benchmark economies',link:'/benchmarking'},
            {icon:'🌐',title:'Corridor Analysis',   desc:'8 bilateral FDI corridors with flow data, signals, and trajectory analysis.',           cta:'Explore corridors',  link:'/corridor-intelligence'},
          ].map(f=>(
            <div key={f.title} className="bg-[#0d1f35] rounded-xl border border-blue-900 p-5 hover:border-blue-700 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-black text-white mb-2">{f.title}</div>
              <p className="text-blue-300 text-xs leading-relaxed mb-4">{f.desc}</p>
              <Link href={f.link} className="text-xs text-blue-400 font-bold hover:underline">{f.cta} →</Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#0d1f35] rounded-2xl border border-blue-800 p-8 text-center">
          <h2 className="text-2xl font-black mb-2">Ready for full access?</h2>
          <p className="text-blue-300 mb-6">Professional from <strong className="text-white">$899/month</strong>. Start with a free 3-day trial — no credit card.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-8 py-3.5 rounded-xl hover:bg-blue-500 transition-colors">Start Free Trial →</Link>
            <Link href="/pricing"  className="border border-blue-600 text-blue-300 font-bold px-8 py-3.5 rounded-xl hover:bg-white/5 transition-colors">See Plans</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
