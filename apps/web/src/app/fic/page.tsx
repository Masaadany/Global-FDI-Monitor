'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWithAuth, getOrg, formatFIC } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const TOPUP_PACKS = [
  { id:'fic_50',  credits:50,  price:79,   label:'Starter',  badge:'',           desc:'5–8 reports',   color:'#64748B' },
  { id:'fic_100', credits:100, price:149,  label:'Standard', badge:'Most Popular',desc:'10–15 reports',  color:'#0A66C2' },
  { id:'fic_500', credits:500, price:599,  label:'Power',    badge:'Best Value',  desc:'50–80 reports',  color:'#7C3AED' },
];

const FIC_ACTIONS = [
  { action:'Unlock Signal Detail',   fic:1,  icon:'📡' },
  { action:'Market Intelligence Brief',fic:5, icon:'⚡' },
  { action:'Investment Climate Report',fic:18,icon:'📜' },
  { action:'Country Economic Profile', fic:20,icon:'🌍' },
  { action:'Sector Intelligence',      fic:14,icon:'🏭' },
  { action:'Mission Planning Dossier', fic:30,icon:'🎯' },
  { action:'Target Investor Report',   fic:18,icon:'🏢' },
  { action:'Flagship GFR Report',      fic:25,icon:'🏆' },
  { action:'Publication Download',     fic:5, icon:'📰' },
  { action:'Scenario Simulation',      fic:8, icon:'🎲' },
];

const DEMO_HISTORY = [
  { id:'TX001', action:'fic_initial',     amount:5,    created_at:'2026-03-15T09:00:00Z', type:'credit' },
  { id:'TX002', action:'report_generated',amount:-5,   created_at:'2026-03-16T14:22:00Z', type:'debit',  ref:'MIB-ARE' },
  { id:'TX003', action:'signal_unlocked', amount:-1,   created_at:'2026-03-17T08:44:00Z', type:'debit',  ref:'MSS-J-ARE' },
];

export default function FICPage() {
  const [balance,  setBalance]  = useState(5);
  const [history,  setHistory]  = useState(DEMO_HISTORY);
  const [loading,  setLoading]  = useState(true);
  const [buying,   setBuying]   = useState<string|null>(null);

  const org = getOrg();

  useEffect(() => {
    fetchWithAuth(`${API}/api/v1/billing/fic`).then(r=>r.json())
      .then(d => {
        setBalance(d.data?.fic_balance ?? d.fic_balance ?? org?.fic_balance ?? 5);
        if (d.data?.history?.length) setHistory(d.data.history);
      }).catch(() => setBalance(org?.fic_balance ?? 5))
      .finally(() => setLoading(false));
  }, [org]);

  async function checkout(pack: typeof TOPUP_PACKS[0]) {
    setBuying(pack.id);
    try {
      const r = await fetchWithAuth(`${API}/api/v1/billing/fic/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack_id: pack.id, credits: pack.credits }),
      });
      const d = await r.json();
      if (d.data?.checkout_url) window.location.href = d.data.checkout_url;
      else window.location.href = `/fic/success?credits=${pack.credits}`;
    } catch { window.location.href = `/fic/success?credits=${pack.credits}`; }
    setBuying(null);
  }

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-lg mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Forecasta Intelligence Credits</div>
          <h1 className="text-4xl font-extrabold mb-2">FIC Credits</h1>
          <p className="text-white/70">The intelligence currency of GFM. Use FIC to unlock signals, reports, and analysis.</p>
          <div className="flex items-center gap-6 mt-5">
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-2xl px-6 py-4 text-center">
              <div className="text-5xl font-extrabold text-amber-400 font-mono">{loading ? '…' : balance}</div>
              <div className="text-amber-200/70 text-xs mt-1">FIC Balance</div>
            </div>
            <div className="text-white/60 text-sm leading-relaxed max-w-xs">
              FIC credits are consumed when you generate intelligence. Professional plans include 4,800 FIC/year.
              Top up anytime below.
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-lg mx-auto px-6 py-6 grid md:grid-cols-3 gap-6">
        {/* Left: Top-up */}
        <div className="md:col-span-2 space-y-5">
          <div className="font-extrabold text-deep text-sm">Top Up FIC Credits</div>
          <div className="grid md:grid-cols-3 gap-4">
            {TOPUP_PACKS.map(pack => (
              <div key={pack.id} className={`gfm-card p-5 relative ${pack.badge ? 'border-2 border-primary' : ''}`}>
                {pack.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-primary text-white px-3 py-0.5 rounded-full whitespace-nowrap">{pack.badge}</span>
                )}
                <div className="text-center mb-4">
                  <div className="text-4xl font-extrabold font-mono text-deep">{pack.credits}</div>
                  <div className="text-xs text-slate-400">FIC Credits</div>
                </div>
                <div className="text-3xl font-extrabold text-primary font-mono text-center mb-1">${pack.price}</div>
                <div className="text-xs text-slate-400 text-center mb-4">{pack.desc}</div>
                <div className="text-xs text-slate-400 text-center mb-4">
                  ${(pack.price / pack.credits).toFixed(2)}/credit
                </div>
                <button onClick={() => checkout(pack)} disabled={buying===pack.id}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    pack.badge ? 'gfm-btn-primary' : 'gfm-btn-outline'
                  } ${buying===pack.id ? 'opacity-50' : ''}`}>
                  {buying===pack.id ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>Processing…</span> : `Buy ${pack.credits} FIC`}
                </button>
              </div>
            ))}
          </div>

          {/* FIC Cost Guide */}
          <div className="gfm-card p-5">
            <div className="font-extrabold text-deep text-sm mb-3">FIC Cost Guide</div>
            <div className="grid grid-cols-2 gap-2">
              {FIC_ACTIONS.map(a => (
                <div key={a.action} className="flex items-center justify-between py-2 px-3 bg-surface rounded-lg border border-slate-100">
                  <span className="flex items-center gap-2 text-xs text-slate-600">
                    <span>{a.icon}</span>{a.action}
                  </span>
                  <span className="text-xs font-extrabold text-amber-600 ml-2 flex-shrink-0">{a.fic} FIC</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Balance + History */}
        <div className="space-y-4">
          <div className="gfm-card p-5">
            <div className="font-bold text-deep text-sm mb-4">Balance Details</div>
            <div className="space-y-3">
              {[
                ['Current Balance',  `${balance} FIC`,           'text-amber-600'],
                ['Plan',             org?.tier === 'free_trial' ? 'Free Trial' : 'Professional', 'text-primary'],
                ['Resets',           org?.tier === 'free_trial' ? 'Never (one-time)' : 'Annually','text-slate-500'],
                ['Rollover',         org?.tier === 'free_trial' ? 'No' : 'Yes (up to 500)','text-emerald-600'],
              ].map(([l,v,c]) => (
                <div key={String(l)} className="flex justify-between text-sm">
                  <span className="text-slate-500">{l}</span>
                  <span className={`font-bold ${c}`}>{v}</span>
                </div>
              ))}
            </div>
            <Link href="/subscription" className="block gfm-btn-outline text-xs py-2 text-center mt-4 rounded-xl">
              Upgrade Plan →
            </Link>
          </div>

          <div className="gfm-card p-5">
            <div className="font-bold text-deep text-sm mb-3">Transaction History</div>
            <div className="space-y-2">
              {history.slice(0, 6).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <div>
                    <div className="text-xs font-semibold text-deep">{tx.action?.replace(/_/g,' ')}</div>
                    <div className="text-xs text-slate-400">{tx.ref || new Date(tx.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={`text-xs font-extrabold font-mono ${tx.type==='credit'||tx.amount>0?'text-emerald-600':'text-red-500'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} FIC
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
