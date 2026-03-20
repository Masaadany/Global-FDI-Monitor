'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0F0A0A'}}>
      <div className="gfm-card p-8 max-w-md w-full text-center mx-4">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-extrabold mb-2" style={{color:'#FAFAF0'}}>Something went wrong</h2>
        <p className="text-sm mb-5" style={{color:'#87A19E'}}>{error.message || 'An unexpected error occurred.'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="gfm-btn-primary text-sm py-2 px-5">Try Again</button>
          <Link href="/dashboard" className="gfm-btn-outline text-sm py-2 px-5" style={{color:'#87A19E'}}>Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
