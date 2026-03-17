'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const proPrice   = billing === 'monthly' ? 899   : 799;    // $9,588/yr ÷ 12 = $799
  const proLabel   = billing === 'monthly' ? '/month' : '/month';
  const proBilled  = billing === 'monthly' ? 'Billed monthly' : 'Billed annually — $9,588/year';
  const proSaving  = billing === 'annual'  ? 'Save 11% vs monthly' : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#0A2540] text-white text-center py-14 px-4">
        <div className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-3">Pricing</div>
        <h1 className="text-4xl font-black mb-4">Simple, transparent pricing</h1>
        <p className="text-blue-200 max-w-xl mx-auto">
          Access live investment signals across 215 economies. Start free — no credit card required.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 bg-white/10 rounded-full p-1 mt-8">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              billing === 'monthly' ? 'bg-white text-[#0A2540]' : 'text-white hover:bg-white/10'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              billing === 'annual' ? 'bg-white text-[#0A2540]' : 'text-white hover:bg-white/10'
            }`}
          >
            Annual
            <span className="bg-emerald-400 text-white text-xs font-black px-2 py-0.5 rounded-full">
              Save 11%
            </span>
          </button>
        </div>
      </div>

      {/* Trial banner */}
      <div className="bg-amber-50 border-b border-amber-200 text-center py-3 px-4">
        <span className="text-amber-700 text-sm font-semibold">
          ⭐ 3-Day Free Trial &nbsp;·&nbsp; 5 FIC Credits &nbsp;·&nbsp; No Credit Card Required
        </span>
      </div>

      {/* Pricing cards */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Free Trial */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Free Trial</div>
            <div className="text-4xl font-black text-[#0A2540] mb-1">$0</div>
            <div className="text-sm text-slate-400 mb-6">3 days, then cancel or upgrade</div>
            <ul className="space-y-2.5 mb-8 text-sm text-slate-600">
              {[
                '5 FIC credits',
                '1 economy focus',
                '1 sector focus',
                'Gold + Silver signals',
                'GFR score preview',
                'No credit card needed',
              ].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {f}
                </li>
              ))}
              {['Report generation', 'All 215 economies'].map(f => (
                <li key={f} className="flex items-center gap-2 text-slate-300">
                  <span>–</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register"
              className="block w-full text-center border-2 border-[#0A2540] text-[#0A2540] font-bold py-3 rounded-xl hover:bg-[#0A2540] hover:text-white transition-colors">
              Start Free Trial
            </Link>
          </div>

          {/* Professional — FEATURED */}
          <div className="bg-[#0A2540] rounded-2xl p-7 relative shadow-2xl md:-mt-4 md:mb-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">
              MOST POPULAR
            </div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Professional</div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-black text-white">${proPrice}</span>
              <span className="text-blue-300 text-sm mb-1.5">{proLabel}</span>
            </div>
            <div className="text-sm text-blue-300 mb-1">{proBilled}</div>
            {proSaving && (
              <div className="text-xs text-emerald-400 font-bold mb-5">{proSaving}</div>
            )}
            {!proSaving && <div className="mb-5"/>}

            <ul className="space-y-2.5 mb-8 text-sm text-blue-100">
              {[
                '3 users',
                '4,800 FIC/year',
                'All 215 economies',
                'All 21 ISIC sectors',
                'Real-time signals (2s)',
                'Custom reports (10 types)',
                'GFR Rankings access',
                'Mission planning (PMP)',
                'Weekly newsletter',
              ].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> {f}
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <button className="block w-full text-center bg-[#1D4ED8] text-white font-black py-3 rounded-xl hover:bg-blue-500 transition-colors">
                Subscribe {billing === 'monthly' ? 'Monthly' : 'Annually'}
              </button>
              {billing === 'monthly' && (
                <button
                  onClick={() => setBilling('annual')}
                  className="block w-full text-center border border-blue-400 text-blue-300 text-xs font-semibold py-2 rounded-xl hover:bg-white/5 transition-colors">
                  Switch to annual — save $1,200/year
                </button>
              )}
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Enterprise</div>
            <div className="text-4xl font-black text-[#0A2540] mb-1">Custom</div>
            <div className="text-sm text-slate-400 mb-6">Contact us for a tailored quote</div>
            <ul className="space-y-2.5 mb-8 text-sm text-slate-600">
              {[
                'Unlimited users',
                '60,000+ FIC/year',
                'Sub-national data (500 cities)',
                '1,400+ free zones',
                'White-label option',
                'Dedicated CSM',
                'Custom API integration',
                'SLA guarantee',
              ].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <a href="mailto:enterprise@fdimonitor.org"
              className="block w-full text-center bg-[#0A2540] text-white font-bold py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
              Contact Sales
            </a>
          </div>
        </div>

        {/* FIC Top-up */}
        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <h4 className="font-black text-[#0A2540] text-lg mb-1">Need more credits?</h4>
          <p className="text-slate-500 text-sm mb-4">
            FIC credits unlock Platinum signals, custom reports, and forecast data packs.
          </p>
          <div className="inline-flex items-center gap-3 bg-slate-50 rounded-xl px-6 py-3 border border-slate-200">
            <span className="font-black text-2xl text-[#0A2540]">$79</span>
            <span className="text-slate-500 text-sm">for 50 FIC credits — one-time purchase</span>
          </div>
          <div className="mt-4">
            <button className="bg-[#1D4ED8] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
              Buy FIC Credits
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {[
            { q: 'What is a FIC credit?',
              a: 'FIC (Forecasta Intelligence Credits) are used for premium actions: viewing Platinum signals (1 FIC), generating reports (5–30 FIC), and downloading forecast packs. Gold, Silver, and Bronze signals are free.' },
            { q: 'Can I cancel anytime?',
              a: 'Monthly plans can be cancelled anytime — access continues until end of billing period. Annual plans are non-refundable but include a free trial before any charge.' },
            { q: 'What happens after the free trial?',
              a: 'After 3 days your trial ends. You keep your account and can upgrade to Professional to restore full access. No automatic charges.' },
            { q: 'Do you offer discounts for IPAs and government agencies?',
              a: 'Yes — investment promotion agencies and government bodies qualify for special pricing. Contact enterprise@fdimonitor.org.' },
          ].map(item => (
            <div key={item.q} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="font-bold text-[#0A2540] text-sm mb-2">{item.q}</div>
              <div className="text-slate-500 text-sm leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
