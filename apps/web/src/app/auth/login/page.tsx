'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const params   = useSearchParams();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [notice, setNotice]     = useState('');

  useEffect(() => {
    if (params.get('expired') === '1')       setNotice('Your session has expired. Please sign in again.');
    if (params.get('trial_expired') === '1') setNotice('Your free trial has ended. Sign in to upgrade to Professional.');
    if (params.get('registered') === '1')    setNotice('Account created! Sign in to access your dashboard.');
  }, [params]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
      const res  = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        const msgs: Record<string,string> = {
          INVALID_CREDENTIALS: 'Incorrect email or password.',
          ACCOUNT_SUSPENDED:   'Your account has been suspended. Contact support.',
        };
        setError(msgs[data.error?.code] ?? 'Sign in failed. Please try again.');
        return;
      }
      localStorage.setItem('gfm_access_token',  data.data.tokens.accessToken);
      localStorage.setItem('gfm_refresh_token', data.data.tokens.refreshToken);
      if (data.data.org?.trial_expired) { window.location.href = '/pricing?trial_expired=1'; return; }
      window.location.href = decodeURIComponent(params.get('return') ?? '/dashboard');
    } catch {
      setError('Connection error. Please check your connection and try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#0A2540] text-lg">G</div>
            <span className="font-black text-white text-xl">Global <span className="text-blue-400">FDI</span> Monitor</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A2540] to-[#1D4ED8] px-6 py-5 text-center">
            <div className="text-white font-black text-lg">Sign In</div>
          </div>
          <div className="p-6">
            {notice && <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg p-3 mb-4">{notice}</div>}
            {error  && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Email Address</label>
                <input type="email" autoFocus className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="you@organisation.com" value={email} onChange={e => setEmail(e.target.value)}/>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-500">Password</label>
                  <Link href="/auth/reset-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
                </div>
                <input type="password" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)}/>
              </div>
              <button type="submit" disabled={loading}
                className={`w-full font-black py-3 rounded-lg transition-colors text-sm ${loading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'}`}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <div className="mt-4 text-center text-xs text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">Start free trial</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A2540] flex items-center justify-center"><div className="text-white">Loading…</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
