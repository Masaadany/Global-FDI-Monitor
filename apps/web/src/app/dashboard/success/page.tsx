'use client';
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export default function DashboardSuccessPage() {
  const [seconds, setSeconds] = useState(5);
  const [plan,    setPlan]    = useState('Professional');
  const [credits, setCredits] = useState(200);
  const [annual,  setAnnual]  = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem('gfm_plan');
      if (p) setPlan(p);
      const tier = localStorage.getItem('gfm_tier');
      if (tier === 'enterprise') setCredits(500);
      const cycle = localStorage.getItem('gfm_billing_cycle');
      if (cycle === 'annual') setAnnual(true);
    } catch {}
    const t = setInterval(() => setSeconds(s => {
      if (s <= 1) { clearInterval(t); window.location.href = '/dashboard'; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <div className="gfm-card p-10 max-w-lg w-full text-center mt-14">
        <div className="text-6xl mb-5">🎉</div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
          style={{background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)'}}>
          <div className="w-2 h-2 rounded-full" style={{background:'#22c55e'}}/>
          <span className="text-sm font-extrabold" style={{color:'#22c55e'}}>
            {plan} — {annual ? 'Annual' : 'Monthly'} — Active
          </span>
        </div>

        <h1 className="text-2xl font-extrabold mb-3" style={{color:'#0A3D62'}}>You are all set!</h1>
        <p className="text-sm mb-5 leading-relaxed" style={{color:'#696969'}}>
          Your subscription is active. PDF reports, data downloads, API access, and {credits} intelligence credits per month are all enabled.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {icon:'📋', label:'Reports',    value:'Enabled'},
            {icon:'📥', label:'Downloads',  value:'Enabled'},
            {icon:'🔑', label:'API',        value:'500 req/min'},
          ].map(({icon,label,value}) => (
            <div key={label} className="p-3 rounded-xl" style={{background:'rgba(34,197,94,0.05)',border:'1px solid rgba(34,197,94,0.12)'}}>
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs font-bold" style={{color:'#0A3D62'}}>{label}</div>
              <div className="text-xs mt-0.5" style={{color:'#22c55e'}}>{value}</div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl mb-5" style={{background:'rgba(116,187,101,0.06)',border:'1px solid rgba(116,187,101,0.15)'}}>
          <div className="text-sm font-bold" style={{color:'#74BB65'}}>{credits} intelligence credits / month</div>
          <div className="text-xs mt-0.5" style={{color:'#696969'}}>Generate reports · Export data · Credits never expire</div>
        </div>

        <Link href="/dashboard" className="gfm-btn-primary w-full py-3 block text-center font-extrabold mb-3">
          Enter Dashboard →
        </Link>
        <div className="flex justify-center gap-4 text-xs">
          <Link href="/reports"     style={{color:'#74BB65'}}>Generate Reports →</Link>
          <span style={{color:'#696969'}}>·</span>
          <Link href="/settings"    style={{color:'#696969'}}>Account Settings</Link>
          <span style={{color:'#696969'}}>·</span>
          <Link href="/fic/credits" style={{color:'#696969'}}>Buy Credits</Link>
        </div>
        <p className="text-xs mt-4" style={{color:'#696969'}}>Redirecting to dashboard in {seconds}s…</p>
      </div>
    </div>
  );
}
