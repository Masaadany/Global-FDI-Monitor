'use client';
import Link from 'next/link';

const TIERS = [
  {
    key: 'trial',
    name: 'Free Trial',
    price: '$0',
    period: '3 days',
    equiv: 'No credit card required',
    saving: '1 economy · 1 sector · 5 FIC total',
    fic: '5',
    ficLabel: 'FIC TOTAL',
    ficSub: '3-day period only',
    ficColor: 'text-slate-500',
    featured: false,
    cta: 'Start Free Trial',
    ctaHref: '/register',
    ctaStyle: 'border',
    features: [
      '1 user included',
      '1 economy (selected at signup)',
      '1 investment sector (selected at signup)',
      'Gold+ signals (Platinum: 1 FIC/view)',
      'CIC: 3 of 12 dimensions',
      'Weekly newsletter (1 edition)',
      'Publication executive summaries',
      { text: 'Report generation', excluded: true },
      { text: 'Full GFR dimensions', excluded: true },
      { text: 'API access', excluded: true },
    ],
  },
  {
    key: 'professional',
    name: 'Professional',
    price: '$9,588',
    period: '/year',
    equiv: '= $799/month equivalent',
    saving: 'Save $1,200 vs monthly · Annual billing',
    fic: '4,800',
    ficLabel: 'FIC / YEAR',
    ficSub: '= 400 FIC/month equivalent',
    ficColor: 'text-blue-600',
    featured: true,
    badge: '★ Primary Tier',
    cta: 'Get Professional',
    ctaHref: '/register?tier=professional',
    ctaStyle: 'filled',
    multiyear: '2-yr: $17,258 (10% off) · 3-yr: $24,449 (15% off)',
    features: [
      '3 named users included',
      'All 215 economies · 100 priority cities',
      'All 21 investment sectors',
      'All 10 report types (5–50 FIC)',
      'All 9 forecast horizons · 3 scenarios',
      'Full GFR — 6 dimensions + reform sim',
      'REST API: 3,000 calls/month',
      'Monthly Monitor + Annual Flagship free',
      '10 languages (Arabic RTL included)',
      'Additional users: $2,500/yr per seat',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: '$29,500',
    period: '/year',
    equiv: 'Base package · Custom pricing available',
    saving: '2-yr: $53,100 · 3-yr: $75,225',
    fic: '60,000',
    ficLabel: 'FIC / YEAR',
    ficSub: '= 5,000 FIC/month equivalent',
    ficColor: 'text-emerald-600',
    featured: false,
    cta: 'Get Enterprise',
    ctaHref: '/register?tier=enterprise',
    ctaStyle: 'border',
    features: [
      '10 named users (unlimited available)',
      '215 economies + 500 cities + all zones',
      'All sectors + subsectors + groups',
      'Platinum signals: 0 FIC (always free)',
      'All reports: 40% FIC discount',
      'White-label all outputs',
      'Full API: 100,000 calls/month',
      'SFTP + Snowflake/BigQuery connectors',
      'All 20 languages',
      'Named CSM + Solutions Engineer',
    ],
  },
  {
    key: 'customised',
    name: 'Customised',
    price: 'Bespoke',
    period: '',
    equiv: 'From $50,000/year',
    saving: '3–5 year contracts preferred',
    fic: 'Custom',
    ficLabel: 'FIC ALLOWANCE',
    ficSub: 'Negotiated annually',
    ficColor: 'text-slate-500',
    featured: false,
    cta: 'Contact Sales',
    ctaHref: '/contact?inquiry=customised',
    ctaStyle: 'border',
    note: 'IPA/EDO · Government/Ministry · IFI/Development · Academic (70% off) · LIC/LMIC (free)',
    features: [
      'Custom FIC allowance',
      'National government programmes',
      'UN/WB/IMF concessional (80% off)',
      'Fortune 500 custom data integration',
      'LIC/LMIC: free (donor co-financing)',
      'Academic: 70% off Professional',
      'Revenue share models available',
      'Joint venture structures possible',
    ],
  },
];

export function PricingSection() {
  return (
    <section className="py-16 px-6 bg-slate-50 border-y border-slate-100" id="pricing">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wide">
            All plans billed annually · No monthly subscriptions
          </div>
          <h2 className="text-3xl font-black text-[#0A2540] mb-3">
            Choose Your Intelligence Plan
          </h2>
          <p className="text-slate-400 text-sm">
            3-day free trial · No credit card required · Annual billing only
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {TIERS.map(tier => (
            <div key={tier.key}
              className={`bg-white rounded-2xl p-6 relative flex flex-col transition-all hover:-translate-y-1 ${
                tier.featured
                  ? 'border-2 border-[#1D4ED8] shadow-lg shadow-blue-100'
                  : 'border border-slate-100 hover:shadow-md'
              }`}>

              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D4ED8] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  {tier.badge}
                </div>
              )}

              <div className="mb-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {tier.name}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-[#0A2540]">{tier.price}</span>
                  {tier.period && <span className="text-sm text-slate-400">{tier.period}</span>}
                </div>
                <div className="text-xs font-semibold text-emerald-600 mb-0.5">{tier.equiv}</div>
                <div className="text-xs text-slate-400">{tier.saving}</div>
              </div>

              {/* FIC highlight */}
              <div className={`rounded-lg p-3 mb-5 ${
                tier.featured ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50 border border-slate-100'
              }`}>
                <div className={`text-xl font-black ${tier.ficColor}`}>{tier.fic}</div>
                <div className={`text-xs font-bold uppercase tracking-wide ${tier.ficColor}`}>{tier.ficLabel}</div>
                <div className="text-xs text-slate-400 mt-0.5">{tier.ficSub}</div>
              </div>

              {/* Multi-year discount */}
              {tier.multiyear && (
                <div className="text-xs text-slate-400 mb-4 border-b border-slate-100 pb-4">
                  {tier.multiyear}
                </div>
              )}

              {/* Note for customised */}
              {tier.note && (
                <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3 mb-4 leading-relaxed">
                  {tier.note}
                </div>
              )}

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.features.map((feat, i) => {
                  const excluded = typeof feat === 'object' && feat.excluded;
                  const text = typeof feat === 'object' ? feat.text : feat;
                  return (
                    <li key={i} className={`flex items-start gap-2 text-xs leading-relaxed ${
                      excluded ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      <span className={`flex-shrink-0 mt-0.5 font-bold ${
                        excluded ? 'text-slate-200' : 'text-emerald-500'
                      }`}>
                        {excluded ? '–' : '✓'}
                      </span>
                      {text}
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              <Link href={tier.ctaHref}
                className={`w-full py-2.5 rounded-lg text-sm font-bold text-center transition-all block ${
                  tier.ctaStyle === 'filled'
                    ? 'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
                }`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer guarantees */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-8 text-xs text-slate-400">
          {[
            '✓ Annual billing only — no monthly subscriptions',
            '✓ 3-day free trial, no credit card',
            '✓ GDPR & SOC2 compliant',
            '✓ IPA/Government/IFI editions available',
            '✓ Cancel anytime before renewal',
          ].map(item => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
