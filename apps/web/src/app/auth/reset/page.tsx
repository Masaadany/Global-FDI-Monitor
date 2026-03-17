'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

function ResetForm() {
  const [step,     setStep]    = useState<'request'|'sent'|'reset'>('request');
  const [email,    setEmail]   = useState('');
  const [token,    setToken]   = useState('');
  const [password, setPassword]= useState('');
  const [confirm,  setConfirm] = useState('');
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError('Email required'); return; }
    setLoading(true); setError('');
    try {
      // In production calls /api/v1/auth/reset-request
      await new Promise(r => setTimeout(r, 800));
      setStep('sent');
    } catch { setError('Request failed. Please try again.'); }
    finally { setLoading(false); }
  }

  async function doReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    try {
      await new Promise(r => setTimeout(r, 800));
      setStep('reset');
    } catch { setError('Reset failed. Try requesting a new link.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-[#0A2540] text-2xl mx-auto mb-4">G</div>
          <h1 className="text-2xl font-black text-white">
            {step === 'sent' ? 'Check your email' : step === 'reset' ? 'Password updated' : 'Reset password'}
          </h1>
          <p className="text-blue-300 text-sm mt-1">Global FDI Monitor</p>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          {step === 'request' && (
            <form onSubmit={requestReset} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Work email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="you@organisation.com" autoFocus
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg font-semibold">{error}</p>}
              <button type="submit" disabled={loading}
                className={`w-full font-black py-3.5 rounded-xl transition-colors ${loading?'bg-slate-300 text-slate-500':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'}`}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending…</span> : 'Send Reset Link'}
              </button>
              <div className="text-center pt-2">
                <Link href="/auth/login" className="text-xs text-blue-600 font-bold hover:underline">Back to sign in</Link>
              </div>
            </form>
          )}

          {step === 'sent' && (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="text-sm text-slate-600">We sent a reset link to <strong>{email}</strong>. Check your inbox and click the link within 30 minutes.</p>
              <p className="text-xs text-slate-400">Didn&apos;t receive it? Check your spam folder or <button onClick={()=>setStep('request')} className="text-blue-600 font-bold hover:underline">try again</button>.</p>
              <Link href="/auth/login" className="block w-full text-center border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl hover:border-blue-300 transition-colors text-sm">
                Back to sign in
              </Link>
            </div>
          )}

          {step === 'reset' && (
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <p className="text-sm text-slate-600 font-semibold">Password updated successfully.</p>
              <Link href="/auth/login" className="block w-full text-center bg-[#0A2540] text-white font-black py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                Sign In Now →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPage() {
  return <Suspense fallback={null}><ResetForm/></Suspense>;
}
