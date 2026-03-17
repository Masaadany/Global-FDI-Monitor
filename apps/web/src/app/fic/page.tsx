'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const PACKS = [
  {id:'fic_50',  credits:50,  price:79,  popular:false, label:'Starter Pack',  per:'$1.58/credit'},
  {id:'fic_100', credits:100, price:149, popular:true,  label:'Standard Pack', per:'$1.49/credit'},
  {id:'fic_500', credits:500, price:599, popular:false, label:'Power Pack',    per:'$1.20/credit'},
];

const FIC_ACTIONS = [
  {action:'View Platinum Signal',     cost:1,  grade:'PLATINUM', icon:'⭐'},
  {action:'Market Intelligence Brief',cost:5,  grade:'MIB',      icon:'📋'},
  {action:'Sector Intelligence Report',cost:14,grade:'SIR',      icon:'🔍'},
  {action:'Country Economic Profile', cost:20, grade:'CEGP',     icon:'🌍'},
  {action:'Flagship Country Report',  cost:25, grade:'FCGR',     icon:'🏆'},
  {action:'Mission Planning Dossier', cost:30, grade:'PMP',      icon:'🎯'},
  {action:'GFR Economy Report',       cost:10, grade:'GFR',      icon:'📊'},
  {action:'Sector Potential Report',  cost:22, grade:'SPOR',     icon:'📈'},
];

export default function FICPage() {
  const [balance, setBalance]   = useState<number|null>(null);
  const [selected, setSelected] = useState('fic_100');

  useEffect(()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
    if (!token) return;
    fetch(`${API}/api/v1/billing/fic`, {headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.json()).then(d=>{ if(d.success) setBalance(d.data.fic_balance); }).catch(()=>{});
  },[]);

  const pack = PACKS.find(p=>p.id===selected)!;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">FIC Credits</div>
          <h1 className="text-3xl font-black mb-2">Forecasta Intelligence Credits</h1>
          <p className="text-blue-200 text-sm max-w-xl">FIC credits unlock premium intelligence: Platinum signals, custom reports, mission planning, and GFR deep-dives.</p>
          {balance !== null && (
            <div className="mt-5 inline-flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3">
              <span className="text-blue-300 text-sm">Your balance:</span>
              <span className="text-3xl font-black text-white">{balance}</span>
              <span className="text-blue-300 text-sm">FIC</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-5">
        {/* Pack selector */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {PACKS.map(p=>(
            <div key={p.id} onClick={()=>setSelected(p.id)}
              className={`bg-white rounded-2xl border p-6 cursor-pointer transition-all relative ${selected===p.id?'border-blue-400 shadow-md':'border-slate-100 hover:border-blue-200'}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-black px-4 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}
              <div className="text-xs font-bold text-slate-400 mb-1">{p.label}</div>
              <div className="text-4xl font-black text-[#0A2540] mb-1">{p.credits}</div>
              <div className="text-sm text-slate-400 mb-3">FIC credits</div>
              <div className="text-3xl font-black text-blue-600 mb-1">${p.price}</div>
              <div className="text-xs text-slate-400">{p.per}</div>
              {selected===p.id && (
                <div className="mt-3 text-xs text-blue-600 font-bold">✓ Selected</div>
              )}
            </div>
          ))}
        </div>

        {/* Purchase button */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 text-center">
          <div className="text-sm text-slate-500 mb-4">
            Purchase {pack.credits} FIC credits for <span className="font-black text-[#0A2540]">${pack.price}</span>
          </div>
          <button className="bg-[#0A2540] text-white font-black px-10 py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors text-lg">
            Buy {pack.credits} Credits — ${pack.price}
          </button>
          <div className="text-xs text-slate-400 mt-3">Secure payment via Stripe · One-time purchase · No subscription</div>
        </div>

        {/* What costs what */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-black text-sm text-[#0A2540] mb-4">FIC Credit Usage Guide</div>
          <div className="grid md:grid-cols-2 gap-2">
            {FIC_ACTIONS.map(a=>(
              <div key={a.action} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-xs text-slate-600 font-semibold">{a.action}</span>
                </div>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {a.cost} FIC
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-700">
            <strong>Free always:</strong> Gold, Silver & Bronze signals · GFR tier overview · Market Insights digest · Dashboard KPIs
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/pricing" className="text-xs text-blue-600 font-semibold hover:underline">
            View subscription plans for unlimited FIC → 
          </Link>
        </div>
      </div>
    </div>
  );
}
