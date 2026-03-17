'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LIVE_SIGNALS = [
  { grade:'PLATINUM', company:'Microsoft Corp',      economy:'UAE',          value:'$850M', sector:'Technology',    sci:91.2 },
  { grade:'GOLD',     company:'Amazon Web Services', economy:'Saudi Arabia', value:'$5.3B', sector:'Cloud',         sci:88.4 },
  { grade:'PLATINUM', company:'Siemens Energy',      economy:'Egypt',        value:'$340M', sector:'Energy',        sci:86.1 },
  { grade:'GOLD',     company:'Samsung Electronics', economy:'Vietnam',      value:'$2.8B', sector:'Manufacturing', sci:83.7 },
  { grade:'SILVER',   company:'BlackRock Inc',       economy:'UAE',          value:'$500M', sector:'Finance',       sci:74.2 },
  { grade:'PLATINUM', company:'Vestas Wind',         economy:'India',        value:'$420M', sector:'Renewables',    sci:85.9 },
];

const GRADE_STYLES = {
  PLATINUM:'bg-amber-100 text-amber-700 border-amber-300',
  GOLD:'bg-emerald-100 text-emerald-700 border-emerald-300',
  SILVER:'bg-blue-100 text-blue-700 border-blue-300',
  BRONZE:'bg-slate-100 text-slate-600 border-slate-300',
};

const STATS = [
  { value:'215',    label:'Economies Tracked' },
  { value:'50',     label:'AI Agents Active' },
  { value:'3,000+', label:'Data Sources' },
  { value:'2s',     label:'Signal Update Speed' },
];

const FEATURES = [
  { icon:'📡', title:'Live Investment Signals', desc:'Real-time AI detection of greenfield investments, M&A, expansions across 215 economies. Platinum to Bronze grade scoring.' },
  { icon:'🏆', title:'GFR Rankings', desc:'Global Future Readiness Ranking for all 215 economies across 6 dimensions including digital, sustainability, and infrastructure.' },
  { icon:'📋', title:'Custom Reports', desc:'10 report types on demand: Country Profiles, Market Intelligence Briefs, Sector Reports, Trade Intelligence. Generated in minutes.' },
  { icon:'🎯', title:'Mission Planning', desc:'AI-powered investment promotion mission planner. Identifies top target companies by MFS score and sector gap analysis.' },
  { icon:'🔮', title:'Forecast & Outlook', desc:'9-horizon forecasts from nowcast to 10-year. Three scenarios: baseline, optimistic, stress. Bayesian VAR + Prophet ensemble.' },
  { icon:'🌍', title:'50 Specialized Agents', desc:'Trade flow analysis, ESG scoring, sanctions screening, political risk, currency risk, regulatory monitoring and more.' },
];

export default function HomePage() {
  const [signalIdx, setSignalIdx] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSignalIdx(i => (i + 1) % LIVE_SIGNALS.length);
      setTick(t => t + 1);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const current = LIVE_SIGNALS[signalIdx];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-[#0A2540] text-white">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-900 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300 mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
                LIVE · {tick} signals processed today
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                World&apos;s First Fully Integrated{' '}
                <span className="text-[#1D4ED8]">Global FDI</span>{' '}
                Intelligence Platform
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed mb-8">
                Live investment signals, GFR rankings, custom reports, and AI-powered mission planning across 215 economies and 3,000+ data sources.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-7 py-3.5 rounded-xl hover:bg-blue-500 transition-colors">
                  Start Free Trial — No Card
                </Link>
                <Link href="/pricing" className="border border-blue-400 text-blue-200 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/5 transition-colors">
                  View Pricing →
                </Link>
              </div>
              <p className="text-blue-400 text-xs mt-4">3 days free · 5 FIC credits · No credit card required</p>
            </div>

            <div className="bg-[#0d2d4a] rounded-2xl p-5 border border-blue-900">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold text-blue-300 uppercase tracking-widest">Live Signal Feed</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>2s updates
                </div>
              </div>
              <div className="bg-[#0A2540] rounded-xl p-4 mb-3 border border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded border ${(GRADE_STYLES as any)[current.grade]}`}>{current.grade}</span>
                  <span className="text-xs text-blue-400">SCI {current.sci}</span>
                </div>
                <div className="font-bold text-white text-sm">{current.company}</div>
                <div className="text-blue-300 text-xs mt-1">{current.economy} · {current.sector} · {current.value}</div>
              </div>
              <div className="space-y-2">
                {LIVE_SIGNALS.slice(0,4).map((s,i) => (
                  <div key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-blue-900 last:border-0">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${(GRADE_STYLES as any)[s.grade]}`}>{s.grade.slice(0,4)}</span>
                    <span className="text-blue-200 flex-1 truncate">{s.company}</span>
                    <span className="text-blue-400 font-mono">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-10 border-t border-blue-900">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-blue-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Platform Capabilities</div>
            <h2 className="text-3xl font-black text-[#0A2540]">Everything you need to win FDI</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-black text-[#0A2540] mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING CTA */}
      <section className="py-20 px-6 bg-[#0A2540] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Ready to get started?</h2>
          <p className="text-blue-200 mb-8">Professional plan from <span className="text-white font-black">$899/month</span>. Start with a free 3-day trial.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors text-lg">Start Free Trial</Link>
            <Link href="/pricing" className="border border-blue-400 text-blue-200 font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition-colors text-lg">See All Plans</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060f1a] text-blue-400 py-10 px-6 text-center text-xs">
        <div className="max-w-6xl mx-auto">
          <div className="font-black text-white text-sm mb-2">Global FDI Monitor</div>
          <p className="mb-4">World&apos;s first fully integrated global investment intelligence platform.</p>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {[['Pricing','/pricing'],['Register','/register'],['Sign In','/auth/login'],['Contact','mailto:info@fdimonitor.org']].map(([l,h]) => (
              <a key={l} href={h} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <p>© 2026 Global FDI Monitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
