import Link from 'next/link';
export const metadata = { title: 'Subscription Plans — Global FDI Monitor' };

const PLANS = [
  {
    id:'free', name:'Free', price:null, badge:'3-Day Trial',
    cta:'Sign Up Free', ctaHref:'/register', outline:false,
    features:[
      '3 days full access',
      '5 FIC credits included',
      '1 economy, 1 sector',
      'Basic signal feed (Silver)',
      'No credit card required',
    ],
    highlight: false,
  },
  {
    id:'professional', name:'Professional', price:'$899', period:'/month',
    annual:'$9,588/year (save 11%)', badge:'Most Popular',
    cta:'Subscribe Now', ctaHref:'/register?plan=professional', outline:false,
    features:[
      '3 platform seats',
      '4,800 FIC credits/year',
      'All 215 countries',
      'All 21 sectors',
      'PLATINUM + GOLD signals',
      'Full report suite (10 types)',
      'GFR rankings deep-dive',
      'Investment Pipeline',
      'Mission Planning (MFS)',
      'Email support (4h response)',
    ],
    highlight: true,
  },
  {
    id:'enterprise', name:'Enterprise', price:'Custom', period:null,
    annual:'From $29,500/year', badge:'Full Intelligence',
    cta:'Request Demo', ctaHref:'/contact?type=demo', outline:true,
    features:[
      'Custom user count',
      'Custom FIC allowance',
      'Sub-national data (500 cities)',
      '1,400+ free zones intelligence',
      'White-label option',
      'Dedicated customer success',
      'Custom reports pipeline',
      'API access (all endpoints)',
      'Azure Private Link option',
      'SLA 99.9% uptime',
      'Priority support (1h response)',
      'Quarterly GFR briefing call',
    ],
    highlight: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="py-16 px-6" style={{background:'var(--gradient-primary)'}}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Subscription Plans</div>
          <h1 className="text-4xl font-extrabold mb-4">Choose Your Plan</h1>
          <p className="text-white/70 text-lg">Professional FDI intelligence from $799/month (annual). Start free today.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.id}
              className={`gfm-card p-6 relative flex flex-col ${plan.highlight?'border-primary ring-2 ring-primary ring-offset-2':''}`}>
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full ${plan.highlight?'bg-primary text-white':'bg-deep text-white'}`}>
                  {plan.badge}
                </div>
              )}
              <div className="mb-5">
                <div className="font-extrabold text-xl text-deep mb-2">{plan.name}</div>
                {plan.price && (
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-primary font-mono">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
                  </div>
                )}
                {!plan.price && <div className="text-4xl font-extrabold text-slate-400 mb-1">—</div>}
                {plan.annual && <div className="text-xs text-emerald-600 font-semibold">{plan.annual}</div>}
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.ctaHref}
                className={`block w-full text-center py-3 rounded-lg font-bold text-sm transition-all ${
                  plan.highlight?'bg-primary text-white hover:bg-primary-dark':
                  plan.outline?'border-2 border-deep text-deep hover:bg-deep hover:text-white':
                  'bg-surface border border-slate-200 text-deep hover:border-primary hover:text-primary'
                }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FIC top-ups */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-extrabold text-deep mb-2">Need More FIC Credits?</h2>
          <p className="text-slate-500 mb-6 text-sm">Top-up at any time. Credits expire 12 months from purchase.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[{credits:50,price:'$79'},{credits:100,price:'$149',popular:true},{credits:500,price:'$599'}].map(p=>(
              <div key={p.credits} className={`gfm-card p-5 text-center min-w-36 relative ${(p as any).popular?'border-amber-300':''}`}>
                {(p as any).popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold bg-amber-400 text-white px-3 py-0.5 rounded-full">Best Value</div>}
                <div className="text-2xl font-extrabold text-primary font-mono mb-0.5">⭐ {p.credits}</div>
                <div className="text-slate-400 text-xs mb-2">credits</div>
                <div className="text-xl font-extrabold text-deep mb-3">{p.price}</div>
                <Link href="/fic" className="gfm-btn-primary text-xs py-1.5 w-full justify-center">Buy Credits</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
