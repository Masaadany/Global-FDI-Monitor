'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

function SuccessContent() {
  const params   = useSearchParams();
  const [balance, setBalance] = useState<number|null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
    if (!token) return;
    fetch(`${API}/api/v1/billing/fic`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r=>r.json()).then(d=>{ if(d.success) setBalance(d.data.fic_balance); }).catch(()=>{});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
        <div className="text-6xl mb-4">⭐</div>
        <h1 className="font-black text-2xl text-[#0A2540] mb-2">Credits Added!</h1>
        {balance !== null ? (
          <p className="text-slate-500 mb-2">
            Your new FIC balance: <span className="font-black text-3xl text-amber-600">{balance}</span>
          </p>
        ) : (
          <p className="text-slate-500 mb-2">FIC credits have been added to your account.</p>
        )}
        <p className="text-slate-400 text-sm mb-8">Use FIC to unlock Platinum signals, custom reports, and mission planning.</p>
        <div className="flex flex-col gap-3">
          <Link href="/reports" className="bg-[#0A2540] text-white font-black py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
            Generate a Report →
          </Link>
          <Link href="/signals" className="border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:border-blue-300 transition-colors">
            Browse Live Signals
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FICSuccessPage() {
  return <Suspense fallback={null}><SuccessContent /></Suspense>;
}
