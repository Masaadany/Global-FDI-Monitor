'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

const CREDIT_PACKS = [
  { id:'starter',      name:'Starter Pack',    credits:50,  price:99,   popular:false },
  { id:'professional', name:'Professional',    credits:200, price:299,  popular:true  },
  { id:'enterprise',   name:'Enterprise',      credits:500, price:599,  popular:false },
];

const CREDIT_COSTS = [
  { action:'Market Intelligence Brief (MIB)',        cost:5,  icon:'📋' },
  { action:'Sector & Economy Report (SER)',           cost:8,  icon:'📊' },
  { action:'Investment Climate Report (ICR)',         cost:18, icon:'🌍' },
  { action:'Targeted Investment Report (TIR)',        cost:20, icon:'🎯' },
  { action:'Flagship GFR Report (FCGR)',              cost:25, icon:'🏆' },
  { action:'Mission Planning Dossier (PMP)',          cost:30, icon:'🗺' },
  { action:'Country Economic Growth Profile (CEGP)', cost:12, icon:'📈' },
  { action:'Regional Quarterly Brief (RQBR)',         cost:15, icon:'🌏' },
  { action:'Bespoke Signal Package (BSP)',            cost:10, icon:'📡' },
  { action:'Sector Opportunity Report (SPOR)',        cost:22, icon:'⚡' },
  { action:'Custom Report (CRP)',                     cost:35, icon:'✏️' },
  { action:'Real-time Signal Export (CSV)',           cost:3,  icon:'📥' },
  { action:'GFR Dimension Deep Dive',                 cost:8,  icon:'🔍' },
];

export default function FICCreditsPage() {
  const [selected, setSelected] = useState('professional');

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Intelligence Credits</div>
          <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>FDI Monitor Intelligence Credits</h1>
          <p className="text-sm mt-1" style={{color:'#696969'}}>Buy credits once, use them on any report type · No expiry · Subscription users get credits included</p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-5 grid lg:grid-cols-3 gap-6">
        {/* Credit packs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {CREDIT_PACKS.map(pack=>(
              <div key={pack.id} onClick={()=>setSelected(pack.id)}
                className={`gfm-card p-5 cursor-pointer transition-all relative ${selected===pack.id?'border-2':''}`}
                style={selected===pack.id?{borderColor:'#74BB65',boxShadow:'0 0 20px rgba(116,187,101,0.15)'}:{}}>
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-extrabold px-3 py-0.5 rounded-full"
                    style={{background:'#74BB65',color:'#E2F2DF'}}>Most Popular</div>
                )}
                <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>{pack.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-extrabold font-data" style={{color:'#74BB65'}}>{pack.credits}</span>
                  <span className="text-sm" style={{color:'#696969'}}>credits</span>
                </div>
                <div className="text-xl font-extrabold font-data mb-3" style={{color:'#0A3D62'}}>${pack.price}</div>
                <div className="text-xs mb-3" style={{color:'#696969'}}>
                  ${(pack.price/pack.credits).toFixed(2)}/credit
                </div>
                <div className={`w-full py-2 rounded-xl text-xs font-extrabold text-center transition-all ${selected===pack.id?'gfm-btn-primary':''}`}
                  style={selected===pack.id?{}:{border:'1px solid rgba(10,61,98,0.2)',color:'#696969'}}>
                  {selected===pack.id?'Selected ✓':'Select'}
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="gfm-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-extrabold text-sm" style={{color:'#0A3D62'}}>Order Summary</div>
                <div className="text-lg font-extrabold font-data" style={{color:'#74BB65'}}>
                  ${CREDIT_PACKS.find(p=>p.id===selected)?.price}
                </div>
              </div>
              <div className="text-sm mb-4" style={{color:'#696969'}}>
                {CREDIT_PACKS.find(p=>p.id===selected)?.credits} intelligence credits · No expiry · Use on any report type
              </div>
              <Link href="/fic/success" className="gfm-btn-primary block text-center py-3">
                Purchase Credits →
              </Link>
            </div>
          )}
        </div>

        {/* Credit cost guide */}
        <div className="gfm-card overflow-hidden">
          <div className="px-5 py-3 border-b font-extrabold text-sm" style={{borderBottomColor:'rgba(10,61,98,0.1)',color:'#0A3D62'}}>
            📊 Credit Costs
          </div>
          <div className="divide-y" style={{borderColor:'rgba(10,61,98,0.06)'}}>
            {CREDIT_COSTS.map(item=>(
              <div key={item.action} className="flex items-center gap-2 px-4 py-2.5">
                <span className="text-sm flex-shrink-0">{item.icon}</span>
                <span className="text-xs flex-1" style={{color:'#696969'}}>{item.action}</span>
                <span className="text-xs font-extrabold font-data flex-shrink-0" style={{color:'#74BB65'}}>{item.cost}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t text-xs" style={{borderTopColor:'rgba(10,61,98,0.1)',color:'#696969'}}>
            Professional subscription: 200 credits/month included
          </div>
        </div>
      </div>
    </div>
  );
}
