'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || '';

function LoginForm() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Email and password required'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email, password}),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gfm_token', data.data.tokens.accessToken);
          localStorage.setItem('gfm_user',  JSON.stringify(data.data.user));
          localStorage.setItem('gfm_org',   JSON.stringify(data.data.org));
        }
        router.push('/dashboard');
      } else {
        setError(data.error?.message || 'Invalid credentials');
      }
    } catch {
      setError('Connection error — check your internet');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-[#0A2540] text-2xl mx-auto mb-4">G</div>
          <h1 className="text-2xl font-black text-white">Sign in</h1>
          <p className="text-blue-300 text-sm mt-1">Global FDI Monitor</p>
        </div>
        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Work email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@organisation.com" autoFocus
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
            {error && <p className="text-red-500 text-xs font-semibold bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className={`w-full font-black py-3.5 rounded-xl transition-colors ${
                loading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
              }`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-slate-100 text-center space-y-2">
            <p className="text-slate-400 text-xs">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">Start free trial</Link>
            </p>
            <p className="text-slate-300 text-xs">
              <Link href="/auth/reset" className="hover:text-slate-500 transition-colors">Forgot password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginForm/></Suspense>;
}
