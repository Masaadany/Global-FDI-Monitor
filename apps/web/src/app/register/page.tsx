'use client';
import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const STEPS = ['Account','Organisation','Access'];

export default function RegisterPage() {
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');
  const [form,    setForm]    = useState({
    email:'', password:'', full_name:'',
    org_name:'', org_type:'IPA', country:'UAE',
    use_case:''
  });

  function set(k: string, v: string) { setForm(f=>({...f,[k]:v})); }

  async function finish() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gfm_token', data.data.tokens.accessToken);
          localStorage.setItem('gfm_user',  JSON.stringify(data.data.user));
          localStorage.setItem('gfm_org',   JSON.stringify(data.data.org));
        }
        setDone(true);
      } else {
        setError(data.error?.message || 'Registration failed');
      }
    } catch {
      setError('Connection error — please try again');
    } finally {
      setLoading(false);
    }
  }

  if (done) return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-black text-2xl text-[#0A2540] mb-2">Welcome to Global FDI Monitor</h2>
        <p className="text-slate-500 text-sm mb-2">Your free trial is active.</p>
        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <div className="text-xs font-bold text-blue-700 mb-2">Your trial includes:</div>
          {['5 FIC credits','Live signal feed (Gold + Silver)','GFR rankings preview','Market Insights digest'].map(f=>(
            <div key={f} className="flex items-center gap-2 text-xs text-blue-600 mb-1">
              <span className="text-emerald-500">✓</span>{f}
            </div>
          ))}
        </div>
        <a href="/dashboard" className="block w-full bg-[#0A2540] text-white font-black py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
          Open Dashboard →
        </a>
        <p className="text-slate-400 text-xs mt-4">3-day trial · No credit card charged</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-[#0A2540] text-xl mx-auto mb-3">G</div>
          <h1 className="text-xl font-black text-white">Start your free trial</h1>
          <p className="text-blue-300 text-xs mt-1">3 days · 5 FIC credits · No card required</p>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-5">
          {STEPS.map((s,i)=>(
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${i<=step?'bg-blue-400':'bg-blue-900'}`}/>
              <div className={`text-xs mt-1 text-center font-bold ${i===step?'text-blue-300':i<step?'text-emerald-400':'text-blue-800'}`}>{s}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          {step===0 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Full name</label>
                <input value={form.full_name} onChange={e=>set('full_name',e.target.value)}
                  placeholder="Your name" autoFocus
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Work email</label>
                <input type="email" value={form.email} onChange={e=>set('email',e.target.value)}
                  placeholder="you@organisation.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={e=>set('password',e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <button onClick={()=>form.email&&form.password&&form.full_name?setStep(1):null}
                disabled={!form.email||!form.password||!form.full_name}
                className="w-full bg-[#0A2540] text-white font-black py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-40">
                Continue →
              </button>
            </div>
          )}

          {step===1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Organisation name</label>
                <input value={form.org_name} onChange={e=>set('org_name',e.target.value)}
                  placeholder="Your IPA or company" autoFocus
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Organisation type</label>
                <select value={form.org_type} onChange={e=>set('org_type',e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400">
                  {['IPA — Investment Promotion Agency','Government Ministry','Development Finance Institution',
                    'Institutional Investor','Private Equity / VC','Corporate','Consultancy','Academic / Research'].map(o=>(
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Primary economy focus</label>
                <select value={form.country} onChange={e=>set('country',e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400">
                  {['UAE','Saudi Arabia','India','Germany','UK','Singapore','Egypt','Vietnam','Indonesia','Nigeria','South Africa','Brazil','USA','China','Other'].map(c=>(
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setStep(0)} className="flex-1 border border-slate-200 text-slate-500 font-bold py-3 rounded-xl">← Back</button>
                <button onClick={()=>form.org_name?setStep(2):null} disabled={!form.org_name}
                  className="flex-1 bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-40">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step===2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Primary use case</label>
                <select value={form.use_case} onChange={e=>set('use_case',e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400">
                  <option value="">Select use case…</option>
                  {['FDI attraction & promotion','Investment targeting & prospecting','Portfolio monitoring',
                    'Country/sector intelligence','FDI benchmarking','Trade flow analysis','Research & policy'].map(u=>(
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700">
                <div className="font-bold mb-1">Free trial includes:</div>
                {['5 FIC credits (no card required)','Live Gold + Silver signals','GFR rankings preview','3 days full access'].map(f=>(
                  <div key={f} className="flex items-center gap-1.5 mb-0.5"><span className="text-emerald-500">✓</span>{f}</div>
                ))}
              </div>
              {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg font-semibold">{error}</p>}
              <div className="flex gap-2">
                <button onClick={()=>setStep(1)} className="flex-1 border border-slate-200 text-slate-500 font-bold py-3 rounded-xl">← Back</button>
                <button onClick={finish} disabled={loading}
                  className={`flex-1 font-black py-3 rounded-xl transition-colors ${loading?'bg-slate-300 text-slate-500 cursor-not-allowed':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'}`}>
                  {loading?(
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      Creating…
                    </span>
                  ):'Start Free Trial 🚀'}
                </button>
              </div>
              <p className="text-slate-400 text-xs text-center">By registering you agree to our Terms of Service</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400">Already have an account? </span>
            <Link href="/auth/login" className="text-xs text-blue-600 font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
