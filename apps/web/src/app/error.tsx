'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="font-black text-xl text-[#0A2540] mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-6">An error occurred loading this page. Our team has been notified.</p>
        <button onClick={reset} className="bg-[#0A2540] text-white font-black px-6 py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}
