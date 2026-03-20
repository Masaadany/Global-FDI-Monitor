'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const FEATURES = [
  { icon:'📡', text:'218+ live FDI signals graded PLATINUM to BRONZE' },
  { icon:'🏆', text:'GFR rankings for 215 economies · 6 dimensions' },
  { icon:'📋', text:'10 AI-powered report types in PDF format' },
  { icon:'🗺', text:'Mission Planning Command Centre' },
  { icon:'📈', text:'Foresight engine to 2050 · Scenario modelling' },
  { icon:'🔒', text:'Z3 verified · SHA-256 provenance · Secure API' },
];

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API}/api/v1/auth/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (d.data?.token) {
        try { localStorage.setItem('gfm_token', d.data.token); } catch {}
        window.location.href = '/dashboard';
      } else {
        setError(d.error?.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{background:'#E2F2DF'}}>

      {/* Left — Features panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r" style={{background:'rgba(10,61,98,0.04)0.3)',borderRightColor:'rgba(10,61,98,0.1)'}}>
        <Logo variant="dark" href="/"/>
        <div>
          <h2 className="text-3xl font-extrabold mb-2 leading-tight" style={{color:'#0A3D62'}}>
            The global standard for<br/>FDI intelligence.
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{color:'#696969'}}>
            Real-time signals · GFR rankings · AI reports · Mission planning
          </p>
          <div className="space-y-3">
            {FEATURES.map(f=>(
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg flex-shrink-0">{f.icon}</span>
                <span className="text-sm" style={{color:'#696969'}}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs" style={{color:'#696969'}}>
          © 2026 FDI Monitor · DIFC, Dubai, UAE
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <Logo variant="dark" href="/"/>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold mb-1" style={{color:'#0A3D62'}}>Welcome back</h1>
            <p className="text-sm" style={{color:'#696969'}}>Sign in to your intelligence dashboard</p>
          </div>

          <div className="gfm-card p-7">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="text-sm p-3 rounded-xl" style={{background:'rgba(239,68,68,0.08)',color:'#EF4444',border:'1px solid rgba(239,68,68,0.2)'}}>{error}</div>
              )}
              <div>
                <label htmlFor="login-email" className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Work Email</label>
                <input id="login-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                  className="w-full px-4 py-3 text-sm rounded-xl" placeholder="you@organisation.com"
                  autoComplete="email" aria-required="true"/>
              </div>
              <div>
                <label htmlFor="login-password" className="text-xs font-bold block mb-1 flex items-center justify-between" style={{color:'#696969'}}>
                  Password
                  <Link href="/auth/reset" className="text-xs" style={{color:'#74BB65'}}>Forgot?</Link>
                </label>
                <div className="relative">
                  <input id="login-password" type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required
                    className="w-full px-4 py-3 text-sm rounded-xl pr-12" placeholder="••••••••"
                    autoComplete="current-password" aria-required="true"/>
                  <button type="button" onClick={()=>setShow(s=>!s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{color:'#696969'}}
                    aria-label={show?'Hide password':'Show password'}>
                    {show?'Hide':'Show'}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className={`gfm-btn-primary w-full py-3 font-extrabold ${loading?'opacity-70':''}`}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Signing in…</span>
                  : 'Sign In →'}
              </button>
            </form>
          </div>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm" style={{color:'#696969'}}>
              No account? <Link href="/register" style={{color:'#74BB65'}}>Start free 3-day trial</Link>
            </p>
            <p className="text-xs" style={{color:'#696969'}}>No credit card required</p>
          </div>
        </div>
      </div>
    </div>
  );
}
