'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPwd,  setShowPwd]  = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Email and password required'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API}/api/v1/auth/login`, {
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('gfm_token',   data.data.access_token);
        localStorage.setItem('gfm_refresh', data.data.refresh_token || '');
        localStorage.setItem('gfm_user',    JSON.stringify(data.data.user));
        localStorage.setItem('gfm_org',     JSON.stringify(data.data.org));
        // Redirect to intended page or dashboard
        const next = new URLSearchParams(window.location.search).get('next') || '/dashboard';
        router.push(next);
      } else {
        setError(data.error?.message || 'Invalid email or password');
      }
    } catch {
      // Demo mode — allow any credentials
      localStorage.setItem('gfm_demo', 'true');
      localStorage.setItem('gfm_token', 'demo_token');
      router.push('/dashboard');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-[#0A2540] text-2xl mx-auto mb-4 hover:opacity-90 transition-opacity cursor-pointer">G</div>
          </Link>
          <h1 className="text-2xl font-black text-white">Welcome back</h1>
          <p className="text-blue-300 text-sm mt-1">Global FDI Monitor</p>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Work email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@organisation.com" autoFocus autoComplete="email"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-colors"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-500">Password</label>
                <Link href="/auth/reset" className="text-xs text-blue-600 hover:underline font-semibold">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPwd?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-blue-400 transition-colors"/>
                <button type="button" onClick={()=>setShowPwd(v=>!v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold">
                  {showPwd ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                <span>⚠</span>{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className={`w-full font-black py-3.5 rounded-xl transition-colors ${
                loading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#0A2540] text-white hover:bg-primary-dark'
              }`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <Link href="/register"
              className="block w-full text-center border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors text-sm">
              No account? Start free trial →
            </Link>
            <Link href="/demo"
              className="block w-full text-center text-slate-400 text-xs hover:text-slate-600 transition-colors">
              Explore without signing in →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-blue-700 mt-5">
          <Link href="/privacy" className="hover:text-blue-400">Privacy</Link>
          {' · '}
          <Link href="/terms"   className="hover:text-blue-400">Terms</Link>
          {' · '}
          <Link href="/contact" className="hover:text-blue-400">Support</Link>
        </p>
      </div>
    </div>
  );
}
