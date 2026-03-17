'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrganizationJsonLd, SoftwareAppJsonLd, FAQJsonLd } from '@/components/JsonLd';
import dynamic from 'next/dynamic';

const Globe4D       = dynamic(() => import('@/components/Globe4D'),       { ssr:false });
const BentoDashboard= dynamic(() => import('@/components/BentoDashboard'), { ssr:false });

const API = process.env.NEXT_PUBLIC_API_URL || '';

const TRUST_BADGES = [
  {name:'World Bank', icon:'🏛️'},{name:'IMF',    icon:'💰'},
  {name:'UNCTAD',     icon:'🌍'},{name:'OECD',   icon:'📈'},
  {name:'IEA',        icon:'⚡'},{name:'ILO',    icon:'👷'},
  {name:'IRENA',      icon:'🌱'},{name:'Freedom House',icon:'🗽'},
];

export default function HomePage() {
  const [tick, setTick]       = useState(0);
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t+1), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/v1/signals?size=6`)
      .then(r=>r.json())
      .then(d=>{ if(d.success) setSignals(d.data?.signals||[]); })
      .catch(()=>{});
  }, []);

  const FAQS = [
    {q:"What is Global FDI Monitor?",a:"GFM is the world's first fully integrated FDI intelligence platform, covering 215 economies with real-time signals, GFR rankings, and AI-powered reports."},
    {q:"How much does it cost?",a:"Professional plan starts at $899/month (or $799/month billed annually). A 3-day free trial with 5 FIC credits is available with no credit card required."},
    {q:"What are FIC credits?",a:"Forecasta Intelligence Credits (FIC) are used to unlock premium intelligence: Platinum signals, custom reports, and mission planning dossiers."},
    {q:"What data sources does GFM use?",a:"IMF, World Bank, UNCTAD, OECD, IEA, ILO, Freedom House, Transparency International, GDELT, and more. Every data point carries full SHA-256 provenance."},
  ];

  return (
    <div className="min-h-screen bg-white">
      <OrganizationJsonLd/>
      <SoftwareAppJsonLd/>
      <FAQJsonLd faqs={FAQS}/>
      {/* HERO */}
      <section className="bg-[#0A2540] text-white">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-900 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300 mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
                LIVE · {tick * 2} signals processed today
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                World&apos;s First Fully Integrated{' '}
                <span className="text-[#1D4ED8]">Global FDI</span>{' '}
                Intelligence Platform
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed mb-6">
                Live investment signals, GFR rankings, custom reports, and AI-powered
                mission planning across <strong className="text-white">215 economies</strong> powered by{' '}
                <strong className="text-white">14 authoritative sources</strong>.
              </p>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {TRUST_BADGES.map(b=>(
                  <div key={b.name} className="flex items-center gap-1.5 bg-blue-900/60 border border-blue-800 px-2.5 py-1 rounded-lg">
                    <span className="text-sm">{b.icon}</span>
                    <span className="text-xs font-semibold text-blue-300">{b.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-7 py-3.5 rounded-xl hover:bg-blue-500 transition-colors">
                  Start Free Trial — No Card
                </Link>
                <Link href="/pricing" className="border border-blue-400 text-blue-200 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/5 transition-colors">
                  View Pricing →
                </Link>
              </div>
              <p className="text-blue-400 text-xs mt-3">3 days free · 5 FIC credits · No credit card required</p>
            </div>

            {/* 4D Globe preview */}
            <div>
              <Globe4D/>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-10 border-t border-blue-900">
            {[
              {value:'215',    label:'Economies Tracked'},
              {value:'50',     label:'AI Agents Active'},
              {value:'14',     label:'Data Sources'},
              {value:'2s',     label:'Signal Update Speed'},
            ].map(s=>(
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-blue-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO DASHBOARD PREVIEW */}
      <section className="py-16 px-6 bg-[#060f1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Intelligence Dashboard</div>
            <h2 className="text-3xl font-black text-white">Everything in one view</h2>
            <p className="text-blue-400 mt-2 text-sm">Live signals · GFR rankings · Data provenance · Pipeline status</p>
          </div>
          <BentoDashboard/>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0A2540]">Built for investment professionals</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {icon:'📡',title:'Live Investment Signals',desc:'Real-time detection across 215 economies. Platinum to Bronze grading. SHA-256 verified with full source attribution.'},
              {icon:'🏆',title:'GFR Rankings',desc:'215 economies scored across 6 dimensions with quarterly updates. Methodology-driven, not opinion-based.'},
              {icon:'📋',title:'Custom Reports',desc:'10 AI-powered report types generated in minutes. Every claim verified and source-attributed.'},
              {icon:'🎯',title:'Mission Planning',desc:'AI identifies top target companies by MFS score. Full dossier with contact intelligence.'},
              {icon:'🔮',title:'Forecast & Outlook',desc:'9-horizon projections: nowcast to 2030. Bayesian VAR + Prophet ensemble. Three scenarios.'},
              {icon:'✅',title:'Z3 Verified Intelligence',desc:'Every factual claim verified against domain constraints. Logical consistency checked before delivery.'},
            ].map(f=>(
              <div key={f.title} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-black text-[#0A2540] mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#0A2540] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Ready to get started?</h2>
          <p className="text-blue-200 mb-8">
            Professional plan from <span className="text-white font-black">$899/month</span>. Start with a free 3-day trial.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors text-lg">Start Free Trial</Link>
            <Link href="/pricing"  className="border border-blue-400 text-blue-200 font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition-colors text-lg">See All Plans</Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 px-6 bg-blue-900 border-t border-blue-800">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-sm font-black text-white mb-1">Weekly FDI Intelligence Digest</div>
          <p className="text-blue-300 text-xs mb-4">Free weekly newsletter. Top signals, GFR updates, market insights.</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="your@organisation.com"
              className="flex-1 bg-blue-800 border border-blue-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-500 focus:outline-none focus:border-blue-400"/>
            <button className="bg-[#1D4ED8] text-white font-black px-5 py-2.5 rounded-xl hover:bg-blue-500 transition-colors text-sm flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060f1a] text-blue-400 py-10 px-6 text-center text-xs">
        <div className="max-w-6xl mx-auto">
          <div className="font-black text-white text-sm mb-2">Global FDI Monitor</div>
          <p className="mb-4">World&apos;s first fully integrated global investment intelligence platform.</p>
          <div className="flex flex-wrap justify-center gap-6 mb-4 text-xs">
            {[['Pricing','/pricing'],['GFR','/gfr'],['Signals','/signals'],['Analytics','/analytics'],['Reports','/reports'],['About','/about'],['Contact','/contact'],['Demo','/demo'],['Status','/health'],['Register','/register'],['Privacy','/privacy'],['Terms','/terms']].map(([l,h])=>(
              <Link key={l} href={h} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <p>© 2026 Global FDI Monitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
