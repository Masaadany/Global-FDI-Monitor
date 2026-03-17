'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[GFM Error]', error); }, [error]);
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="gfm-card p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-extrabold text-2xl text-deep mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-3">An unexpected error occurred. Our team has been notified.</p>
        {error.digest && (
          <code className="block bg-surface text-slate-400 text-xs px-3 py-2 rounded-lg mb-5 font-mono">{error.digest}</code>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="gfm-btn-primary px-6 py-2.5 rounded-xl">Try Again</button>
          <Link href="/" className="gfm-btn-outline px-6 py-2.5 rounded-xl">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
