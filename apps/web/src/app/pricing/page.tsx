'use client';
import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

type Billing = 'monthly' | 'annual';

const PLANS = [
  {
    id: 'professional',
    name: 'Professional',
    price_monthly: 899,
    price_annual_monthly: 799,
    price_annual: 9588,
    fic_annual: 4800,
    users: 3,
    popular: true,
    stripe_monthly: 'professional_monthly',
    stripe_annual:  'professional_annual',
    features: [
      'All live signals — Platinum through Bronze',
      'GFR Rankings — all 215 economies',
      '4,800 FIC credits/year',
      '3 platform seats',
      'All 10 report types',
      'Investment Pipeline (unlimited deals)',
      'Mission Planning (30 FIC/mission)',
      'Forecasts — all 9 economies',
      'Watchlists + Alerts',
      'WebSocket real-time feed',
      'CSV/JSON export',
      'Email support (4h response)',
    ],
    highlight: null,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_monthly: null,
    price_annual_monthly: 2458,
    price_annual: 29500,
    fic_annual: 60000,
    users: 10,
    popular: false,
    stripe_monthly: null,
    stripe_annual:  'enterprise',
    features: [
      'Everything in Professional',
      '60,000 FIC credits/year',
      '10 platform seats',
      'Dedicated account manager',
      'Custom data integrations',
      'White-label reporting option',
      'SLA: 99.9% uptime guarantee',
      'Priority support (1h response)',
      'Quarterly GFR briefing call',
      'API access (all endpoints)',
      'Azure Private Link option',
      'GDPR DPA + custom legal',
    ],
    highlight: 'Best for IPAs & Government',
  },
];

const FIC_PACKS = [
  {id:'fic_50',  credits:50,  price:79,  per:'$1.58/credit',popular:false},
  {id:'fic_100', credits:100, price:149, per:'$1.49/credit',popular:true},
  {id:'fic_500', credits:500, price:599, per:'$1.20/credit',popular:false},
];

const COMPARISON_ROWS = [
  ['Live Platinum signals',       '✓','✓'],
  ['All 215 economy GFR scores',  '✓','✓'],
  ['FIC credits / year',          '4,800','60,000'],
  ['Platform seats',              '3','10'],
  ['Report types',                '10/10','10/10'],
  ['Investment Pipeline',         '✓','✓'],
  ['Mission Planning',            '✓','✓'],
  ['API access',                  '—','✓'],
  ['Dedicated account manager',   '—','✓'],
  ['White-label reports',         '—','✓'],
  ['SLA guarantee',               '—','99.9%'],
  ['Support response',            '4 hours','1 hour'],
];

export default function PricingPage() {
  const [billing,   setBilling]   = useState<Billing>('annual');
  const [loading,   setLoading]   = useState<string|null>(null);
  const [error,     setError]     = useState('');

  async function checkout(planId: string) {
    setLoading(planId); setError('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
      if (!token) { window.location.href = '/register'; return; }
      const res  = await fetch(`${API}/api/v1/billing/checkout`, {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({
          plan:       billing === 'annual' ? `${planId}_annual` : `${planId}_monthly`,
          return_url: `${window.location.origin}/dashboard?upgrade=success`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        // Demo mode — redirect to register
        window.location.href = '/register';
      }
    } catch { setError('Checkout unavailable — please contact sales@fdimonitor.org'); }
    finally   { setLoading(null); }
  }

  async function checkoutFIC(packId: string) {
    setLoading(packId); setError('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
      if (!token) { window.location.href = '/register?ref=fic'; return; }
      const res  = await fetch(`${API}/api/v1/billing/checkout`, {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({plan: packId, return_url:`${window.location.origin}/fic?purchased=true`}),
      });
      const data = await res.json();
      if (data.success && data.data?.checkout_url) window.location.href = data.data.checkout_url;
      else window.location.href = '/register?ref=fic';
    } catch { setError('Checkout unavailable'); }
    finally   { setLoading(null); }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#0A2540] text-white px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">Transparent Pricing</div>
          <h1 className="text-4xl font-black mb-4">FDI Intelligence for Every IPA</h1>
          <p className="text-blue-200 mb-8">Professional platform from $799/month (annual). Start free, upgrade anytime.</p>

          {/* Billing toggle */}
          <div className="inline-flex bg-blue-900 rounded-full p-1 mb-4">
            <button onClick={()=>setBilling('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billing==='monthly'?'bg-white text-[#0A2540]':'text-blue-300'}`}>
              Monthly
            </button>
            <button onClick={()=>setBilling('annual')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billing==='annual'?'bg-white text-[#0A2540]':'text-blue-300'}`}>
              Annual <span className="ml-1 text-emerald-400 text-xs font-black">Save 11%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="px-6 py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          {/* Free trial card */}
          <div className="bg-white rounded-2xl border border-blue-200 p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-black text-[#0A2540] text-lg">Free Trial</div>
              <div className="text-slate-500 text-sm">3 days full access · 5 FIC credits · No credit card required</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-[#0A2540]">$0</div>
              <Link href="/register" className="bg-[#0A2540] text-white font-black px-6 py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                Start Free Trial →
              </Link>
            </div>
          </div>

          {/* Paid plans */}
          <div className="grid md:grid-cols-2 gap-6">
            {PLANS.map(plan=>{
              const price    = billing==='annual' ? plan.price_annual_monthly : plan.price_monthly;
              const planId   = billing==='annual' ? plan.stripe_annual : plan.stripe_monthly;
              const isLoading= loading === (plan.id + (billing==='annual'?'_annual':'_monthly'));
              return (
                <div key={plan.id}
                  className={`bg-white rounded-2xl border p-6 relative ${plan.popular?'border-blue-400 shadow-lg':'border-slate-200'}`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1 rounded-full">MOST POPULAR</div>}
                  {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-black px-4 py-1 rounded-full">{plan.highlight}</div>}

                  <div className="mb-5">
                    <div className="font-black text-xl text-[#0A2540] mb-1">{plan.name}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-[#0A2540]">${price?.toLocaleString()}</span>
                      <div className="text-slate-400 text-sm">
                        <div>/month</div>
                        {billing==='annual' && <div className="text-xs">billed ${plan.price_annual?.toLocaleString()}/year</div>}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-3 text-xs text-slate-500">
                      <span>⭐ {plan.fic_annual.toLocaleString()} FIC/year</span>
                      <span>👥 {plan.users} seats</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map(f=>(
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>{f}
                      </li>
                    ))}
                  </ul>

                  {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

                  <button onClick={()=>planId&&checkout(plan.id)} disabled={!!isLoading||!planId}
                    className={`w-full font-black py-3.5 rounded-xl transition-colors ${
                      isLoading?'bg-slate-300 text-slate-500':
                      plan.popular?'bg-[#1D4ED8] text-white hover:bg-blue-500':
                      'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
                    }`}>
                    {isLoading?(
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        Redirecting…
                      </span>
                    ) : plan.price_monthly===null&&billing==='monthly' ? 'Contact Sales' : `Subscribe — ${billing==='annual'?'Annual':'Monthly'}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-[#0A2540] text-center mb-8">Feature Comparison</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-bold text-slate-400">Feature</th>
                  <th className="text-center px-4 py-3 font-black text-blue-600">Professional</th>
                  <th className="text-center px-4 py-3 font-black text-amber-600">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(([feat,pro,ent])=>(
                  <tr key={feat} className="border-b border-slate-50">
                    <td className="px-5 py-3 text-slate-600">{feat}</td>
                    <td className="text-center px-4 py-3 font-semibold text-slate-700">{pro}</td>
                    <td className="text-center px-4 py-3 font-semibold text-slate-700">{ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FIC top-up */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-[#0A2540] mb-2">Need more FIC credits?</h2>
          <p className="text-slate-500 mb-8 text-sm">Top-up at any time. No subscription required.</p>
          <div className="grid grid-cols-3 gap-4">
            {FIC_PACKS.map(p=>(
              <div key={p.id} className={`bg-white rounded-2xl border p-5 relative ${p.popular?'border-amber-400 shadow-md':'border-slate-200'}`}>
                {p.popular && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-black px-3 py-0.5 rounded-full">BEST VALUE</div>}
                <div className="text-3xl font-black text-[#0A2540]">⭐ {p.credits}</div>
                <div className="text-slate-400 text-sm mb-1">credits</div>
                <div className="text-2xl font-black text-blue-600 mb-1">${p.price}</div>
                <div className="text-xs text-slate-400 mb-4">{p.per}</div>
                <button onClick={()=>checkoutFIC(p.id)} disabled={loading===p.id}
                  className="w-full bg-[#0A2540] text-white text-xs font-black py-2.5 rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">
                  {loading===p.id?'…':'Buy Credits'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-[#0A2540] mb-8 text-center">Common questions</h2>
          <div className="space-y-4">
            {[
              {q:'What are FIC credits?',a:'Forecasta Intelligence Credits (FIC) are the currency for unlocking premium intelligence: Platinum signals, custom reports, mission planning, and GFR deep-dives. Each action has a published FIC cost.'},
              {q:'Can I cancel anytime?',a:'Yes. Monthly plans cancel with 30 days notice. Annual plans can be cancelled before the renewal date. See Terms of Service for our refund policy.'},
              {q:'Is there a free trial?',a:'Yes — 3 days full access with 5 FIC credits. No credit card required. You can upgrade at any time during or after the trial.'},
              {q:'What data sources does GFM use?',a:'IMF WEO, World Bank WDI, UNCTAD, OECD, IEA, ILO, GDELT, Transparency International, Freedom House, Yale EPI, and more. Every data point carries full provenance.'},
              {q:'Do you offer discounts for IPAs?',a:'Yes — government IPAs in developing economies may qualify for a 30% discount. Contact sales@fdimonitor.org with your organisation details.'},
            ].map(item=>(
              <details key={item.q} className="bg-white rounded-xl border border-slate-100 p-5 group">
                <summary className="font-bold text-[#0A2540] cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-slate-300 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 bg-[#0A2540] text-white text-center">
        <h2 className="text-3xl font-black mb-3">Start your free trial today</h2>
        <p className="text-blue-200 mb-6 text-sm">3 days · 5 FIC credits · No credit card</p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors">Start Free Trial</Link>
          <Link href="/contact?type=demo" className="border border-blue-400 text-blue-200 font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition-colors">Request Demo</Link>
        </div>
      </section>
    </div>
  );
}
