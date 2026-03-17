import type { Metadata } from 'next';
import Link from 'next/link';
import { GlobeMap } from '@/components/GlobeMap';
import { LiveTicker } from '@/components/LiveTicker';
import { PricingSection } from '@/components/pricing/PricingSection';

export const metadata: Metadata = {
  title: 'Global FDI Monitor — World\'s First Fully Integrated Investment Intelligence Platform',
  description: 'Live investment signals, forecasts, GFR rankings, and custom reports across 215 economies and all sectors. Powered by 3,000+ authoritative sources.',
  keywords: 'FDI intelligence, investment monitor, global FDI, investment signals, GFR ranking',
  openGraph: {
    title: 'Global FDI Monitor',
    description: 'Live global investment intelligence across 215 economies',
    url: 'https://fdimonitor.org',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <LiveTicker />

      {/* ── HERO ── */}
      <section className="bg-white border-b border-slate-100 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            World's First Integrated Global FDI Intelligence Platform
          </div>

          <h1 className="text-5xl font-black text-[#0A2540] leading-tight tracking-tight mb-5 max-w-4xl mx-auto">
            Live Global Investment Intelligence<br />
            for <span className="text-[#1D4ED8]">Faster, Smarter Decisions</span>
          </h1>

          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Powered by live data continuously monitored across 215 economies and all sectors
            through thousands of authoritative sources — delivering real-time signals,
            forward-looking intelligence, and decision-ready insights.
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-14">
            <Link href="/register" className="bg-[#0A2540] text-white px-7 py-3.5 rounded-lg font-bold text-sm hover:bg-[#1D4ED8] transition-colors">
              Start 3-Day Free Trial
            </Link>
            <Link href="/dashboard" className="bg-white border-2 border-slate-200 text-slate-700 px-7 py-3.5 rounded-lg font-semibold text-sm hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors">
              Explore Platform
            </Link>
          </div>

          {/* World Map */}
          <GlobeMap />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 border-b border-slate-100">
        {[
          ['215', 'Economies Covered'],
          ['3,000+', 'Data Sources'],
          ['10M+', 'Company Profiles'],
          ['2s', 'Live Update Speed'],
        ].map(([num, label]) => (
          <div key={label} className="py-6 px-8 text-center bg-white">
            <div className="text-3xl font-black text-[#0A2540]">{num}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </section>

      {/* ── TRUSTED BY ── */}
      <section className="bg-slate-50 border-b border-slate-100 py-5 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-4">
            Data aligned with leading global organisations
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['WORLD BANK', 'UNCTAD', 'IMF', 'OECD', 'IFC', 'JETRO', 'IDA IRELAND'].map(org => (
              <span key={org} className="px-4 py-1.5 border border-slate-200 rounded-md text-xs font-bold text-slate-400 bg-white">
                {org}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-[#0A2540] text-center mb-3">
            Everything You Need to Lead on Global Investment
          </h2>
          <p className="text-slate-400 text-center text-base mb-10">
            One platform. All 215 economies. All sectors. Live intelligence.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(feat => (
              <Link key={feat.href} href={feat.href}
                className="group p-6 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-[#0A2540] mb-2 text-sm group-hover:text-[#1D4ED8] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black text-[#0A2540] mb-10">
            From Raw Data to Decision in Seconds
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Live Collection', desc: '3,000+ authoritative sources monitored every 2 seconds' },
              { step: '02', title: 'AI Processing', desc: '15 AI agents classify, score, and verify every signal' },
              { step: '03', title: 'Intelligence Layer', desc: 'GFR rankings, forecasts, and sector analytics updated continuously' },
              { step: '04', title: 'Decision-Ready', desc: 'Reports, dashboards, and alerts in your format, instantly' },
            ].map(item => (
              <div key={item.step} className="text-left">
                <div className="text-xs font-black text-[#1D4ED8] mb-2 tracking-widest">{item.step}</div>
                <div className="font-bold text-[#0A2540] text-sm mb-1">{item.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <PricingSection />

      {/* ── CTA ── */}
      <section className="bg-[#0A2540] py-16 px-6 text-center">
        <h2 className="text-3xl font-black text-white mb-4">
          Start Your Free Trial Today
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          3 days. 1 economy. 5 intelligence credits. No credit card required.
        </p>
        <Link href="/register"
          className="inline-block bg-[#1D4ED8] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-500 transition-colors">
          Start Free Trial — No Credit Card
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A2540] border-t border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="text-white font-black text-lg mb-2">
                Global <span className="text-[#1D4ED8]">FDI</span> Monitor
              </div>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                World's first fully integrated global investment and trade intelligence platform.
              </p>
              <p className="text-slate-500 text-xs mt-3">fdimonitor.org</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs">
              {FOOTER_LINKS.map(group => (
                <div key={group.title}>
                  <div className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-xs">{group.title}</div>
                  {group.links.map(link => (
                    <Link key={link.href} href={link.href}
                      className="block text-slate-500 hover:text-white mb-1.5 transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2">
            <span>© 2026 Global FDI Monitor. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/dpa" className="hover:text-white transition-colors">DPA</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: '📊', href: '/dashboard',
    title: 'Global Investment Dashboard',
    description: 'Real-time FDI flows, trade dynamics, and live signals across 215 economies with 12 configurable intelligence widgets. Updates every 2 seconds.',
  },
  {
    icon: '📡', href: '/signals',
    title: 'Market Signals (12 Modules)',
    description: 'Platinum, Gold, Silver, Bronze investment signals. 10M+ companies monitored 24/7. SCI-scored and graded for instant prioritisation.',
  },
  {
    icon: '🔭', href: '/forecast',
    title: 'Forecast & Outlook',
    description: '9-horizon forecasts from nowcast to 10-year projections. Three probability-weighted scenarios. 280+ ensemble models.',
  },
  {
    icon: '🏆', href: '/gfr',
    title: 'GFR Ranking',
    description: 'Global Future Readiness ranking across 6 dimensions for all 215 economies. Quarterly updates with reform pathway simulation.',
  },
  {
    icon: '📋', href: '/reports',
    title: 'Custom Reports (10 Types)',
    description: 'AI-generated intelligence reports in under 60 seconds. 10 report types, 120 filters, Z3 verified, 20 languages.',
  },
  {
    icon: '🎯', href: '/pmp',
    title: 'Promotion Mission Planning',
    description: 'Auto-generates complete mission dossiers in 5 minutes. MFS-ranked company targets, stakeholder maps, event intelligence.',
  },
];

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/signals', label: 'Market Signals' },
      { href: '/gfr', label: 'GFR Ranking' },
      { href: '/reports', label: 'Custom Reports' },
      { href: '/pmp', label: 'Mission Planning' },
    ]
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/sources', label: 'Data Sources' },
      { href: '/methodology', label: 'Methodology' },
      { href: '/contact', label: 'Contact' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/dpa', label: 'Data Processing' },
      { href: '/cookies', label: 'Cookie Policy' },
    ]
  },
];
