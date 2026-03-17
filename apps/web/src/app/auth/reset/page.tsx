'use client';
import { useState } from 'react';
import Link from 'next/link';
const API = process.env.NEXT_PUBLIC_API_URL || '';
export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);
  const [loading,setLoad] = useState(false);
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setLoad(true);
    try { await fetch(`${API}/api/v1/auth/reset-request`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})}); } catch {}
    setSent(true); setLoad(false);
  }
  if(sent) return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-4">
      <div className="gfm-card p-10 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="font-extrabold text-2xl text-deep mb-2">Check your email</h2>
        <p className="text-slate-500 text-sm mb-5">If <strong>{email}</strong> has an account, a reset link is on its way.</p>
        <Link href="/auth/login" className="gfm-btn-primary w-full justify-center py-3">Back to Sign In</Link>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-deep text-2xl mx-auto mb-4 bg-white">G</div>
          <h1 className="text-2xl font-extrabold text-white">Reset your password</h1>
          <p className="text-blue-300 text-sm mt-1">Enter your work email to receive a reset link</p>
        </div>
        <div className="gfm-card p-7">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Work email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@organisation.com" autoFocus
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"/>
            </div>
            <button type="submit" disabled={loading||!email}
              className={`w-full gfm-btn-primary py-3.5 rounded-xl ${loading||!email?'opacity-50':''}`}>
              {loading?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending…</span>:'Send Reset Link'}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4"><Link href="/auth/login" className="text-primary hover:underline">← Back to Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
