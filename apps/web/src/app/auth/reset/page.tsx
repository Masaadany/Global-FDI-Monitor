'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function ResetPage() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await fetch(`${API}/api/v1/auth/reset-request`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch { setError('Request failed. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{background:'#E2F2DF'}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo variant="dark" href="/" className="justify-center"/>
        </div>

        {!sent ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold mb-1" style={{color:'#0A3D62'}}>Reset your password</h1>
              <p className="text-sm" style={{color:'#696969'}}>Enter your email and we will send a reset link</p>
            </div>
            <div className="gfm-card p-7">
              <form onSubmit={handleReset} className="space-y-4">
                {error && (
                  <div className="text-sm p-3 rounded-xl" style={{background:'rgba(239,68,68,0.08)',color:'#EF4444',border:'1px solid rgba(239,68,68,0.2)'}}>{error}</div>
                )}
                <div>
                  <label htmlFor="reset-email" className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Work Email</label>
                  <input id="reset-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                    className="w-full px-4 py-3 text-sm rounded-xl" placeholder="you@organisation.com"
                    autoComplete="email" aria-required="true"/>
                </div>
                <button type="submit" disabled={loading}
                  className={`gfm-btn-primary w-full py-3 font-extrabold ${loading?'opacity-70':''}`}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending…</span>
                    : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-5 pt-5 border-t text-center" style={{borderTopColor:'rgba(10,61,98,0.1)'}}>
                <Link href="/auth/login" className="text-sm" style={{color:'#696969'}}>← Back to Login</Link>
              </div>
            </div>
          </>
        ) : (
          <div className="gfm-card p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-extrabold mb-2" style={{color:'#0A3D62'}}>Check your email</h2>
            <p className="text-sm mb-4 leading-relaxed" style={{color:'#696969'}}>
              If an account exists for <span style={{color:'#74BB65'}}>{email}</span>, we sent a reset link. Check your inbox and spam folder.
            </p>
            <div className="text-xs p-3 rounded-xl mb-5" style={{background:'rgba(116,187,101,0.08)',color:'#74BB65'}}>
              Reset links expire after 1 hour
            </div>
            <div className="space-y-2">
              <Link href="/auth/login" className="gfm-btn-primary block py-3 text-center">Back to Login →</Link>
              <button onClick={()=>{setSent(false);setEmail('');}} className="block w-full text-xs py-2" style={{color:'#696969'}}>
                Try a different email
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-center mt-4" style={{color:'#696969'}}>
          No account? <Link href="/register" style={{color:'#74BB65'}}>Start free trial</Link>
        </p>
      </div>
    </div>
  );
}
