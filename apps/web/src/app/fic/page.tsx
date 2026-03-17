'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const PACKS = [
  {id:'fic_50',  credits:50,  price:79,  per:'$1.58/credit', icon:'⭐',  popular:false, desc:'Perfect for occasional reports'},
  {id:'fic_100', credits:100, price:149, per:'$1.49/credit', icon:'⭐⭐', popular:true,  desc:'Most popular — great for active IPAs'},
  {id:'fic_500', credits:500, price:599, per:'$1.20/credit', icon:'⭐⭐⭐',popular:false, desc:'Best value for high-volume users'},
];

const FIC_COSTS = [
  {action:'Full Signal Detail',  cost:1,  icon:'📡'},
  {action:'Market Intelligence Brief',cost:5,icon:'⚡'},
  {action:'Country Economic Profile',cost:20,icon:'🌍'},
  {action:'Sector Intelligence Report',cost:14,icon:'🏭'},
  {action:'Target Investor Report',cost:18,icon:'🎯'},
  {action:'Flagship GFR Report',  cost:25, icon:'🏆'},
  {action:'Mission Planning',     cost:30, icon:'🚀'},
  {action:'Regulatory Brief',     cost:16, icon:'📜'},
  {action:'Strategic Briefing',   cost:15, icon:'📋'},
  {action:'Publication Download', cost:5,  icon:'📰'},
];

export default function FICPage() {
  const [balance,  setBalance]  = useState<number|null>(null);
  const [loading,  setLoading]  = useState<string|null>(null);
  const [history,  setHistory]  = useState<any[]>([]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
    if (!token) return;
    Promise.all([
      fetch(`${API}/api/v1/auth/trial-status`,{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
      fetch(`${API}/api/v1/billing/fic`,      {headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
    ]).then(([trial, fic]) => {
      setBalance(trial?.data?.fic_balance ?? fic?.data?.fic_balance ?? 5);
      setHistory(fic?.data?.history || []);
    }).catch(() => setBalance(5));
  }, []);

  async function checkout(packId: string) {
    setLoading(packId);
    const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
    try {
      if (!token) { window.location.href = '/register?ref=fic'; return; }
      const res  = await fetch(`${API}/api/v1/billing/checkout`, {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({
          plan:       packId,
          return_url: `${window.location.origin}/fic/success?pack=${packId}`,
          cancel_url: `${window.location.origin}/fic`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        window.location.href = `/fic/success?pack=${packId}&demo=true`;
      }
    } catch { window.location.href = `/fic/success?pack=${packId}&demo=true`; }
    finally  { setLoading(null); }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#0A2540] text-white px-6 py-14">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h1 className="text-4xl font-black mb-3">FIC Credits</h1>
          <p className="text-blue-200 text-lg mb-6">
            Forecasta Intelligence Credits — the currency for unlocking premium FDI intelligence.
          </p>
          {balance !== null && (
            <div className="inline-flex items-center gap-3 bg-blue-900 rounded-2xl px-6 py-4 border border-blue-700">
              <div className="text-4xl font-black text-amber-400">{balance}</div>
              <div className="text-left">
                <div className="font-bold text-white">Your FIC Balance</div>
                <div className="text-xs text-blue-400">Credits available to spend</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-[#0A2540] text-center mb-8">Buy FIC Credits</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {PACKS.map(pack=>(
              <div key={pack.id}
                className={`bg-white rounded-2xl border p-6 relative ${pack.popular?'border-amber-400 shadow-lg':'border-slate-200'}`}>
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-black px-4 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}
                <div className="text-center mb-5">
                  <div className="text-3xl mb-2">{pack.icon}</div>
                  <div className="text-4xl font-black text-[#0A2540]">{pack.credits}</div>
                  <div className="text-slate-400 text-sm">credits</div>
                  <div className="text-3xl font-black text-blue-600 mt-2">${pack.price}</div>
                  <div className="text-xs text-slate-400">{pack.per}</div>
                  <p className="text-xs text-slate-500 mt-2">{pack.desc}</p>
                </div>
                <button onClick={()=>checkout(pack.id)} disabled={loading===pack.id}
                  className={`w-full font-black py-3.5 rounded-xl transition-colors ${
                    loading===pack.id?'bg-slate-200 text-slate-400':
                    pack.popular?'bg-amber-500 text-white hover:bg-amber-400':
                    'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
                  }`}>
                  {loading===pack.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      Redirecting…
                    </span>
                  ) : `Buy ${pack.credits} Credits — $${pack.price}`}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">
            Credits expire 12 months from purchase · Non-refundable once used · Secure payment via Stripe
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-[#0A2540] mb-6">FIC Cost Guide</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {FIC_COSTS.map(item=>(
              <div key={item.action} className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 p-4">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-sm text-[#0A2540]">{item.action}</div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-600">{item.cost}</span>
                  <span className="text-xs text-slate-400 ml-1">FIC</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-6 bg-[#0A2540] text-center">
        <p className="text-blue-200 text-sm mb-4">Annual subscribers receive FIC credits as part of their plan.</p>
        <Link href="/pricing" className="bg-[#1D4ED8] text-white font-black px-8 py-3 rounded-xl hover:bg-blue-500 transition-colors">
          View Subscription Plans →
        </Link>
      </section>
    </div>
  );
}
