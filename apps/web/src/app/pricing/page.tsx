import Link from 'next/link';
export const metadata = { title: 'Pricing — Global FDI Monitor', description: 'FDI intelligence from $899/month. Free 3-day trial included.' };
const PLANS = [
  { id:'free', name:'Free Trial', price:'$0', period:'3 days', badge:'No card required',
    cta:'Start Free Trial', href:'/register', accent:false,
    features:['3-day full platform access','5 FIC credits','1 economy · 1 sector','Silver signal feed','GFR top-10 preview'] },
  { id:'pro', name:'Professional', price:'$899', period:'/month', badge:'Most Popular',
    annual:'or $799/mo billed annually ($9,588/yr)',
    cta:'Subscribe Now', href:'/register?plan=professional', accent:true,
    features:['3 platform seats','4,800 FIC/year','All 215 economies','All 21 sectors','PLATINUM + GOLD signals','10 AI report types','Full GFR rankings + proprietary factors','Investment Pipeline (Kanban)','Mission Planning (MFS)','Email support — 4h response'] },
  { id:'ent', name:'Enterprise', price:'Custom', period:null, badge:'Full Suite',
    annual:'From $29,500/year · Custom FIC',
    cta:'Request Demo', href:'/contact?type=demo', accent:false,
    features:['Custom seats','Custom FIC allowance','Sub-national (500+ cities)','1,400+ free zones','White-label option','API access (all 40 endpoints)','Dedicated customer success manager','Custom report pipeline','Azure Private Link option','99.9% uptime SLA','Priority support — 1h response','Quarterly GFR briefing call'] },
];
const FIC_PACKS = [
  {n:50,  price:'$79',  per:'$1.58/credit'},
  {n:100, price:'$149', per:'$1.49/credit', best:true},
  {n:500, price:'$599', per:'$1.20/credit'},
];
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Transparent Pricing</div>
          <h1 className="text-5xl font-extrabold mb-4">Simple, Clear Pricing</h1>
          <p className="text-white/70 text-lg">Professional FDI intelligence starts at <strong className="text-white">$799/month</strong> (annual). Start free.</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(p=>(
            <div key={p.id} className={`gfm-card p-7 flex flex-col relative ${p.accent?'ring-2 ring-primary':''}`}>
              {p.badge && <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full text-white ${p.accent?'bg-primary':'bg-deep'}`}>{p.badge}</div>}
              <div className="mb-6">
                <div className="font-extrabold text-xl text-deep mb-1">{p.name}</div>
                <div className="flex items-baseline gap-1"><span className="text-4xl font-extrabold text-primary font-mono">{p.price}</span>{p.period&&<span className="text-slate-400 text-sm">{p.period}</span>}</div>
                {p.annual&&<div className="text-xs text-emerald-600 font-semibold mt-1">{p.annual}</div>}
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {p.features.map(f=><li key={f} className="flex items-start gap-2 text-sm text-slate-600"><span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">✓</span>{f}</li>)}
              </ul>
              <Link href={p.href} className={`block w-full text-center py-3.5 rounded-xl font-bold transition-all ${p.accent?'bg-primary text-white hover:bg-primary-dark':'border-2 border-slate-200 text-deep hover:border-primary hover:text-primary'}`}>{p.cta}</Link>
            </div>
          ))}
        </div>
        <div className="text-center mb-8"><h2 className="text-2xl font-extrabold text-deep mb-1">FIC Credit Top-Ups</h2><p className="text-slate-500 text-sm">Buy extra intelligence credits any time · Valid 12 months · Non-refundable once used</p></div>
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          {FIC_PACKS.map(p=>(
            <div key={p.n} className={`gfm-card p-5 text-center min-w-40 relative ${p.best?'ring-2 ring-amber-400':''}`}>
              {p.best&&<div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-bold px-3 py-0.5 rounded-full">Best Value</div>}
              <div className="text-2xl font-extrabold text-primary font-mono mb-0.5">⭐ {p.n}</div>
              <div className="text-slate-400 text-xs mb-2">credits</div>
              <div className="text-xl font-extrabold text-deep mb-1">{p.price}</div>
              <div className="text-xs text-slate-400 mb-3">{p.per}</div>
              <Link href="/fic" className="gfm-btn-primary text-xs py-1.5 w-full justify-center block text-center">Buy Credits</Link>
            </div>
          ))}
        </div>
        <div className="gfm-card p-8 text-center">
          <h2 className="text-2xl font-extrabold text-deep mb-2">All plans include</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[['🔐','SHA-256 provenance on every data point'],['⚡','Real-time WebSocket signal stream'],['🏆','GFR Rankings Q1 2026'],['📡','50 AI agent platform'],['🌍','215 economies covered'],['🔒','SOC 2 compliant Azure infrastructure'],['📋','Full audit trail + reference codes'],['💬','Documentation + community']].map(([i,t])=>(
              <div key={String(t)} className="text-center"><div className="text-2xl mb-1">{i}</div><div className="text-xs text-slate-500 leading-tight">{t}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
