'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function FICSuccessContent() {
  const params = useSearchParams();
  const credits = params.get('credits') || '100';
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="gfm-card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">⭐</div>
        <div className="text-5xl font-extrabold text-amber-600 font-mono mb-1">{credits}</div>
        <div className="text-lg font-bold text-deep mb-1">FIC Credits Added</div>
        <p className="text-slate-500 text-sm mb-6">Your intelligence credits are ready to use. Generate reports, unlock signals, and run analyses.</p>
        <div className="space-y-3">
          <Link href="/reports"    className="block gfm-btn-primary py-3 rounded-xl">Generate a Report →</Link>
          <Link href="/signals"    className="block gfm-btn-outline py-3 rounded-xl">View Signals →</Link>
          <Link href="/fic"        className="block text-sm text-slate-400 hover:text-primary py-2">FIC Balance & History</Link>
        </div>
      </div>
    </div>
  );
}
export default function FICSuccessPage() {
  return <Suspense><FICSuccessContent/></Suspense>;
}
