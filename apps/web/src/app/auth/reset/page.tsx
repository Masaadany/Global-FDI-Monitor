'use client';
import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function ResetPage() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API}/api/v1/auth/reset-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message || 'Request failed'); }
      else { setSent(true); }
    } catch { setError('Network error — try again'); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="font-extrabold text-2xl text-deep">{sent ? 'Check your inbox' : 'Reset password'}</h1>
          <p className="text-slate-500 text-sm mt-2">
            {sent ? `We sent a reset link to ${email}` : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {!sent ? (
          <div className="gfm-card p-8">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                  placeholder="you@company.com" autoComplete="email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"/>
              </div>
              {error && <div className="text-red-500 text-xs font-semibold bg-red-50 rounded-lg px-3 py-2">{error}</div>}
              <button type="submit" disabled={loading || !email}
                className={`w-full gfm-btn-primary py-3.5 rounded-xl ${(loading||!email)?'opacity-50':''}`}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending…</span> : 'Send Reset Link'}
              </button>
            </form>
            <div className="text-center mt-5">
              <Link href="/auth/login" className="text-sm text-slate-400 hover:text-primary">← Back to login</Link>
            </div>
          </div>
        ) : (
          <div className="gfm-card p-8 text-center">
            <div className="text-4xl mb-4">📧</div>
            <p className="text-sm text-slate-500 mb-5">The link expires in 1 hour. Check your spam folder if it doesn&apos;t arrive.</p>
            <button onClick={()=>{setSent(false);setEmail('');}} className="gfm-btn-outline text-sm px-5 py-2">Resend</button>
            <div className="mt-4"><Link href="/auth/login" className="text-sm text-primary hover:underline">← Back to login</Link></div>
          </div>
        )}
      </div>
    </div>
  );
}
