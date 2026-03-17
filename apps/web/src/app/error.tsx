'use client';
import { useEffect } from 'react';
import Link from 'next/link';
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[GFM Error]', error); }, [error]);
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-black text-2xl text-[#0A2540] mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-2">An unexpected error occurred. Our team has been notified automatically.</p>
        {error.digest && <p className="text-xs font-mono text-slate-300 mb-6">Error ID: {error.digest}</p>}
        <div className="flex gap-3 justify-center">
          <button onClick={reset}
            className="bg-[#0A2540] text-white font-black px-6 py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
            Try Again
          </button>
          <Link href="/"
            className="border border-slate-200 text-slate-600 font-bold px-6 py-3 rounded-xl hover:border-blue-300 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
