'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function RegisterPage() {
  const [step,     setStep]    = useState(1);
  const [email,    setEmail]   = useState('');
  const [password, setPassword]= useState('');
  const [name,     setName]    = useState('');
  const [org,      setOrg]     = useState('');
  const [role,     setRole]    = useState('');
  const [show,     setShow]    = useState(false);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');

  const ROLES = ['Investment Director','Fund Manager','Strategy Consultant','Research Analyst',
                 'Government Official','IPA Director','Academic Researcher','Other'];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API}/api/v1/auth/register`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password, name, org, role }),
      });
      const d = await r.json();
      if (d.data?.token) {
        try { localStorage.setItem('gfm_token', d.data.token); } catch {}
        window.location.href = '/onboarding';
      } else {
        setError(d.error?.message || 'Registration failed. Please try again.');
      }
    } catch { setError('Connection failed. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex" style={{background:'#E2F2DF'}}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 border-r" style={{background:'rgba(10,61,98,0.04)0.3)',borderRightColor:'rgba(10,61,98,0.1)'}}>
        <Logo variant="dark" href="/"/>
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{color:'#74BB65'}}>Free 3-Day Trial</div>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight" style={{color:'#0A3D62'}}>
            Start with full platform access.<br/>No credit card required.
          </h2>
          <div className="space-y-3">
            {['Full dashboard · signals · GFR rankings','Benchmarking · Corridor intelligence','Foresight to 2050 · Scenario planning','No credit card · Cancel anytime'].map(f=>(
              <div key={f} className="flex items-center gap-2 text-sm" style={{color:'#696969'}}>
                <span style={{color:'#22c55e'}}>✓</span>{f}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs mb-2" style={{color:'#696969'}}>Trusted by investment professionals at</div>
          <div className="flex flex-wrap gap-2">
            {['InvestAD','Temasek','PwC MENA','MUFG','NITI Aayog'].map(org=>(
              <span key={org} className="text-xs px-2 py-1 rounded" style={{background:'rgba(10,61,98,0.1)',color:'#696969'}}>{org}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Registration form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <Logo variant="dark" href="/"/>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {[1,2].map(s=>(
              <div key={s} className="transition-all" style={{
                width: step>=s ? '24px' : '8px', height:'8px', borderRadius:'4px',
                background: step>=s ? '#74BB65' : 'rgba(10,61,98,0.3)'
              }}/>
            ))}
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold mb-1" style={{color:'#0A3D62'}}>
              {step===1 ? 'Create your account' : 'About you'}
            </h1>
            <p className="text-sm" style={{color:'#696969'}}>
              {step===1 ? 'Step 1 of 2 — Account details' : 'Step 2 of 2 — Profile information'}
            </p>
          </div>

          <div className="gfm-card p-7">
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="text-sm p-3 rounded-xl" style={{background:'rgba(239,68,68,0.08)',color:'#EF4444',border:'1px solid rgba(239,68,68,0.2)'}}>{error}</div>
              )}
              {step === 1 && <>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Work Email *</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required
                    className="w-full px-4 py-3 text-sm rounded-xl" placeholder="you@organisation.com"
                    autoComplete="email" aria-required="true"/>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Password *</label>
                  <div className="relative">
                    <input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} required
                      minLength={8} className="w-full px-4 py-3 text-sm rounded-xl pr-12"
                      placeholder="Min 8 characters" autoComplete="new-password" aria-required="true"/>
                    <button type="button" onClick={()=>setShow(s=>!s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{color:'#696969'}}>
                      {show?'Hide':'Show'}
                    </button>
                  </div>
                </div>
              </>}
              {step === 2 && <>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Full Name *</label>
                  <input value={name} onChange={e=>setName(e.target.value)} required
                    className="w-full px-4 py-3 text-sm rounded-xl" placeholder="Your name"
                    autoComplete="name" aria-required="true"/>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Organisation</label>
                  <input value={org} onChange={e=>setOrg(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl" placeholder="Your organisation"
                    autoComplete="organization"/>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Role</label>
                  <select value={role} onChange={e=>setRole(e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl">
                    <option value="">Select your role…</option>
                    {ROLES.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
              </>}
              <div className="flex gap-2">
                {step===2 && (
                  <button type="button" onClick={()=>setStep(1)}
                    className="gfm-btn-outline px-4 py-3 text-sm flex-shrink-0" style={{color:'#696969'}}>
                    ← Back
                  </button>
                )}
                <button type="submit" disabled={loading}
                  className={`gfm-btn-primary flex-1 py-3 font-extrabold ${loading?'opacity-70':''}`}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Creating…</span>
                    : step===1 ? 'Continue →' : 'Start Free Trial →'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 text-center space-y-1">
            <p className="text-sm" style={{color:'#696969'}}>
              Already have an account? <Link href="/auth/login" style={{color:'#74BB65'}}>Sign in</Link>
            </p>
            <p className="text-xs" style={{color:'#696969'}}>
              By registering you agree to our <Link href="/terms" style={{color:'#696969',textDecoration:'underline'}}>Terms</Link> and <Link href="/privacy" style={{color:'#696969',textDecoration:'underline'}}>Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
