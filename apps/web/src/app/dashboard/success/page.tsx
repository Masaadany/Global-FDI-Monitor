'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function UpgradeSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const plan   = params.get('plan') || 'Professional';

  useEffect(() => {
    // Refresh user data after upgrade
    const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
    if (!token) return;
    const API = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${API}/api/v1/auth/me`, {headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.json())
      .then(d=>{
        if (d.success && d.data?.org) {
          localStorage.setItem('gfm_org', JSON.stringify(d.data.org));
        }
      }).catch(()=>{});
    setTimeout(() => router.push('/dashboard'), 5000);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-black text-2xl text-[#0A2540] mb-2">Welcome to {plan}!</h1>
        <p className="text-slate-500 mb-6">Your subscription is active. Full access to all signals, reports, and intelligence tools.</p>
        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left border border-blue-200">
          <div className="text-xs font-bold text-blue-700 mb-2">Your subscription includes:</div>
          {['All Platinum + Gold + Silver signals','4,800 FIC credits/year','All 10 report types','Mission planning (MFS scoring)','GFR deep-dives — all 215 economies','3 platform seats'].map(f=>(
            <div key={f} className="flex items-center gap-2 text-xs text-blue-600 mb-1">
              <span className="text-emerald-500 font-bold">✓</span>{f}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mb-4">Redirecting to dashboard in 5 seconds…</p>
        <Link href="/dashboard" className="block w-full bg-[#0A2540] text-white font-black py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
          Open Dashboard Now →
        </Link>
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return <Suspense fallback={null}><UpgradeSuccessContent /></Suspense>;
}
