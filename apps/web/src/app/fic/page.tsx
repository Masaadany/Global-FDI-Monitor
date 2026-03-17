'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
const API=process.env.NEXT_PUBLIC_API_URL||'';
const PACKS=[{id:'fic_50',n:50,price:79,per:'$1.58/credit',icon:'⭐'},{id:'fic_100',n:100,price:149,per:'$1.49/credit',icon:'⭐⭐',best:true},{id:'fic_500',n:500,price:599,per:'$1.20/credit',icon:'⭐⭐⭐'}];
const FIC_COSTS=[{a:'Unlock Full Signal Detail',c:1,i:'📡'},{a:'Market Intelligence Brief',c:5,i:'⚡'},{a:'Country Economic Profile',c:20,i:'🌍'},{a:'Sector Intelligence Report',c:14,i:'🏭'},{a:'Target Investor Report',c:18,i:'🎯'},{a:'Flagship GFR Country Report',c:25,i:'🏆'},{a:'Mission Planning (MFS)',c:30,i:'🚀'},{a:'Regulatory Policy Brief',c:16,i:'⚖️'},{a:'Publication Download',c:5,i:'📰'},{a:'Strategic Briefing Paper',c:15,i:'📋'}];
export default function FICPage() {
  const [balance,setBalance]=useState<number|null>(null);
  const [loading,setLoading]=useState<string|null>(null);
  useEffect(()=>{
    const token=typeof window!=='undefined'?localStorage.getItem('gfm_token'):null;
    if(!token)return;
    fetch(`${API}/api/v1/auth/trial-status`,{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(d=>setBalance(d?.data?.fic_balance??5)).catch(()=>setBalance(5));
  },[]);
  async function checkout(packId:string){
    setLoading(packId);
    const token=typeof window!=='undefined'?localStorage.getItem('gfm_token'):null;
    try{
      if(!token){window.location.href='/register?ref=fic';return;}
      const res=await fetch(`${API}/api/v1/billing/checkout`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify({plan:packId,return_url:`${window.location.origin}/fic/success?pack=${packId}`,cancel_url:`${window.location.origin}/fic`})});
      const d=await res.json();
      if(d.success&&d.data?.checkout_url)window.location.href=d.data.checkout_url;
      else window.location.href=`/fic/success?pack=${packId}&demo=true`;
    }catch{window.location.href=`/fic/success?pack=${packId}&demo=true`;}
    finally{setLoading(null);}
  }
  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-14 text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-5xl mb-4">⭐</div>
          <h1 className="text-4xl font-extrabold mb-2">FIC Credits</h1>
          <p className="text-white/70 text-lg mb-5">Forecasta Intelligence Credits — unlock premium FDI intelligence.</p>
          {balance!==null&&<div className="inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-6 py-4"><div className="stat-number text-4xl font-bold text-amber-300">{balance}</div><div className="text-left"><div className="font-bold text-white">Your Balance</div><div className="text-xs text-white/50">Credits available</div></div></div>}
        </div>
      </section>
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-deep text-center mb-8">Buy FIC Credits</h2>
          <div className="grid md:grid-cols-3 gap-5 mb-4">
            {PACKS.map(p=>(
              <div key={p.id} className={`gfm-card p-6 relative flex flex-col ${(p as any).best?'ring-2 ring-amber-400':''}`}>
                {(p as any).best&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-bold px-4 py-1 rounded-full">BEST VALUE</div>}
                <div className="text-center flex-1 mb-5">
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <div className="text-4xl font-extrabold text-primary font-mono mb-0.5">{p.n}</div>
                  <div className="text-slate-400 text-sm mb-2">credits</div>
                  <div className="text-3xl font-extrabold text-deep">${p.price}</div>
                  <div className="text-xs text-slate-400">{p.per}</div>
                </div>
                <button onClick={()=>checkout(p.id)} disabled={loading===p.id}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all ${loading===p.id?'bg-slate-200 text-slate-400 cursor-not-allowed':(p as any).best?'bg-amber-500 hover:bg-amber-400 text-white':'bg-primary hover:bg-primary-dark text-white'}`}>
                  {loading===p.id?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Redirecting…</span>:`Buy ${p.n} Credits — $${p.price}`}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400">Credits expire 12 months from purchase · Non-refundable once used · Secure payment via Stripe</p>
        </div>
      </section>
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-deep mb-6">FIC Cost Guide</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {FIC_COSTS.map(item=>(
              <div key={item.a} className="gfm-card p-4 flex items-center gap-3">
                <span className="text-2xl">{item.i}</span>
                <div className="flex-1 font-semibold text-sm text-deep">{item.a}</div>
                <div className="text-right"><span className="text-xl font-extrabold text-amber-600 font-mono">{item.c}</span><span className="text-xs text-slate-400 ml-1">FIC</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 px-6 text-center bg-surface border-t border-slate-200">
        <p className="text-slate-500 text-sm mb-4">Annual subscribers receive FIC credits as part of their plan.</p>
        <Link href="/subscription" className="gfm-btn-primary px-8 py-3 rounded-xl">View Subscription Plans →</Link>
      </section>
    </div>
  );
}
