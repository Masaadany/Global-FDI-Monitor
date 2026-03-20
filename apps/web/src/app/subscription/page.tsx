'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

const PLANS = [
  {
    id:'trial', name:'Free Trial', monthly:0, annual:0, period:'3 days',
    color:'#696969', badge:'',
    features:['Full dashboard access','218+ live FDI signals','GFR rankings 215 economies','Foresight 2050 views','Scenario planner (view)','Benchmarking tool (view)','1 user seat'],
    limits:  ['No PDF report generation','No data downloads','No API access'],
    cta:'Start Free Trial', href:'/register',
  },
  {
    id:'professional', name:'Professional', monthly:799, annual:679, period:'month',
    color:'#74BB65', badge:'Most Popular',
    features:['Everything in Free Trial','Unlimited PDF report generation','Data exports (watermarked)','API access 500 req/min','WebSocket live feed','3 user seats','200 intelligence credits/month','Priority support (24h)'],
    limits:[],
    cta:'Start Professional', href:'/register',
  },
  {
    id:'enterprise', name:'Enterprise', monthly:0, annual:0, period:'',
    color:'#0A3D62', badge:'',
    features:['Everything in Professional','Unlimited user seats','Dedicated data operations team','Custom API SLA','White-label option available','Custom report formats','Enterprise SSO','Dedicated onboarding'],
    limits:[],
    cta:'Contact Sales', href:'/contact',
  },
];

export default function SubscriptionPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-14 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{color:'#74BB65'}}>Subscription Plans</div>
          <h1 className="text-4xl font-extrabold mb-3" style={{color:'#0A3D62'}}>Choose Your Intelligence Tier</h1>
          <p className="text-base mb-6" style={{color:'#696969'}}>3-day free trial · No credit card required · Cancel anytime</p>

          {/* Annual / Monthly toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full" style={{background:'rgba(10,61,98,0.1)'}}>
            <button onClick={()=>setAnnual(false)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={!annual?{background:'#74BB65',color:'#fff'}:{color:'#696969'}}>
              Monthly
            </button>
            <button onClick={()=>setAnnual(true)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2"
              style={annual?{background:'#74BB65',color:'#fff'}:{color:'#696969'}}>
              Annual
              <span className="text-xs px-1.5 py-0.5 rounded" style={{background:'rgba(34,197,94,0.2)',color:'#22c55e'}}>Save 15%</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {PLANS.map(plan=>(
            <div key={plan.id}
              className={`gfm-card p-6 flex flex-col relative ${plan.badge?'border-2':''}`}
              style={plan.badge?{borderColor:plan.color,boxShadow:`0 0 32px ${plan.color}20`}:{}}>
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-extrabold px-4 py-1 rounded-full whitespace-nowrap"
                  style={{background:plan.color,color:'#E2F2DF'}}>{plan.badge}</div>
              )}

              <div className="mb-5">
                <div className="font-extrabold text-lg mb-1" style={{color:'#0A3D62'}}>{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  {plan.id === 'enterprise' ? (
                    <span className="text-3xl font-extrabold" style={{color:plan.color}}>Custom</span>
                  ) : plan.id === 'trial' ? (
                    <><span className="text-4xl font-extrabold font-data" style={{color:plan.color}}>$0</span>
                    <span className="text-sm" style={{color:'#696969'}}>/3 days</span></>
                  ) : (
                    <><span className="text-4xl font-extrabold font-data" style={{color:plan.color}}>
                      ${annual ? plan.annual : plan.monthly}
                    </span>
                    <span className="text-sm" style={{color:'#696969'}}>/{plan.period}</span></>
                  )}
                </div>
                {plan.id === 'professional' && annual && (
                  <div className="text-xs font-bold" style={{color:'#22c55e'}}>Saving $1,440/year vs monthly</div>
                )}
              </div>

              <div className="flex-1 space-y-1.5 mb-5">
                {plan.features.map(f=>(
                  <div key={f} className="flex gap-2 text-xs"><span style={{color:'#22c55e',flexShrink:0}}>✓</span><span style={{color:'#696969'}}>{f}</span></div>
                ))}
                {plan.limits.map(f=>(
                  <div key={f} className="flex gap-2 text-xs"><span style={{flexShrink:0,color:'#696969'}}>✗</span><span style={{color:'#696969'}}>{f}</span></div>
                ))}
              </div>

              <Link href={plan.href}
                className={`block text-center py-3 rounded-xl text-sm font-extrabold transition-all ${plan.badge?'gfm-btn-primary':''}`}
                style={!plan.badge?{border:'1px solid rgba(10,61,98,0.2)',color:'#696969'}:{}}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Annual savings banner */}
        {!annual && (
          <div className="gfm-card p-4 flex items-center gap-4 flex-wrap mb-8">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <div className="font-extrabold text-sm" style={{color:'#0A3D62'}}>Switch to Annual Billing — Save 15%</div>
              <div className="text-xs mt-0.5" style={{color:'#696969'}}>Professional at $679/month billed annually — saving $1,440/year.</div>
            </div>
            <button onClick={()=>setAnnual(true)} className="gfm-btn-primary text-sm py-2 px-5 flex-shrink-0">
              View Annual Pricing
            </button>
          </div>
        )}

        {/* FAQ */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['Can I generate reports on the free trial?','No. Report generation and data downloads require a Professional subscription. The free trial gives full read-only dashboard access for 3 days.'],
            ['What payment methods are accepted?','Stripe processes all payments securely. We accept all major credit and debit cards, and wire transfer for annual Enterprise contracts.'],
            ['Can I cancel anytime?','Yes. Cancel from Settings → Billing at any time. Cancellation takes effect at end of current billing period. No prorated refunds.'],
            ['Do intelligence credits expire?','Credits included with Professional ($200/month) expire at end of billing period. Credits purchased separately (credit packs) never expire.'],
          ].map(([q,a])=>(
            <div key={q} className="gfm-card p-5">
              <div className="font-bold text-sm mb-1" style={{color:'#0A3D62'}}>{q}</div>
              <div className="text-xs leading-relaxed" style={{color:'#696969'}}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
