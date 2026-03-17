'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const ORG_TYPES = ['IPA — Investment Promotion Agency','Government Ministry','Development Finance Institution','Institutional Investor','Private Equity / Venture Capital','Consultancy / Advisory','Academic / Research','Corporate Treasury','Other'];
const COUNTRIES = ['United Arab Emirates','Saudi Arabia','United States','United Kingdom','India','Germany','Singapore','France','China','Japan','Canada','Australia','Brazil','Netherlands','Ireland','Norway','Switzerland','Denmark','Sweden','Finland','South Korea','Indonesia','Vietnam','Egypt','Morocco','Nigeria','Kenya','South Africa','Turkey','Poland'];

function PasswordStrength({ pwd }: { pwd: string }) {
  const checks = [
    { label:'8+ characters',  pass: pwd.length >= 8 },
    { label:'Uppercase',       pass: /[A-Z]/.test(pwd) },
    { label:'Lowercase',       pass: /[a-z]/.test(pwd) },
    { label:'Number',          pass: /\d/.test(pwd) },
    { label:'Symbol',          pass: /[!@#$%^&*]/.test(pwd) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['', 'bg-red-500', 'bg-red-400', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-500'];
  const labels = ['', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

  if (!pwd) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i<=score ? colors[score] : 'bg-slate-200'}`}/>
        ))}
      </div>
      <div className={`text-xs font-bold ${['','text-red-500','text-red-400','text-amber-500','text-blue-600','text-emerald-600'][score]}`}>
        {labels[score]}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {checks.map(c => (
          <span key={c.label} className={`text-xs px-1.5 py-0.5 rounded ${c.pass ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            {c.pass ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState({ email:'', password:'', confirm:'', full_name:'', org_name:'', org_type:'', country:'', accept_terms:false });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  function set(k: string, v: string | boolean) { setForm(f => ({...f,[k]:v})); }

  function validateStep1() {
    if (!form.full_name.trim()) { setError('Full name required'); return false; }
    if (!form.email.includes('@')) { setError('Valid work email required'); return false; }
    if (form.password.length < 8) { setError('Password must be 8+ characters'); return false; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return false; }
    return true;
  }
  function validateStep2() {
    if (!form.org_name.trim()) { setError('Organisation name required'); return false; }
    if (!form.org_type) { setError('Please select organisation type'); return false; }
    if (!form.country) { setError('Please select your country'); return false; }
    if (!form.accept_terms) { setError('Please accept the Terms of Service'); return false; }
    return true;
  }

  function nextStep() {
    setError('');
    if (step === 1 && validateStep1()) setStep(2);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API}/api/v1/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('gfm_token',       data.data.access_token);
        localStorage.setItem('gfm_refresh',     data.data.refresh_token || '');
        localStorage.setItem('gfm_user',        JSON.stringify(data.data.user));
        localStorage.setItem('gfm_org',         JSON.stringify(data.data.org));
        router.push('/onboarding');
      } else {
        setError(data.error?.message || 'Registration failed');
      }
    } catch {
      // Demo mode — still proceed
      localStorage.setItem('gfm_demo', 'true');
      router.push('/onboarding');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-[#0A2540] text-2xl mx-auto mb-4">G</div>
          <h1 className="text-2xl font-black text-white">Start your free trial</h1>
          <p className="text-blue-300 text-sm mt-1">3 days · 5 FIC credits · No credit card</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1,2].map(s=>(
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${s<=step?'bg-blue-400':'bg-blue-900'}`}/>
              <div className={`text-xs mt-1 font-bold ${s===step?'text-blue-300':s<step?'text-emerald-400':'text-blue-800'}`}>
                {s===1?'Account':'Organisation'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          <form onSubmit={submit} className="space-y-4">
            {step === 1 && (
              <>
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
                    placeholder="8+ characters"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
                  <PasswordStrength pwd={form.password}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Confirm password</label>
                  <input type="password" value={form.confirm} onChange={e=>set('confirm',e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${form.confirm && form.password!==form.confirm?'border-red-300 focus:border-red-400':'border-slate-200 focus:border-blue-400'}`}/>
                  {form.confirm && form.password!==form.confirm && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
                {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg font-semibold">{error}</p>}
                <button type="button" onClick={nextStep}
                  className="w-full gfm-btn-primary rounded-xl py-3.5 rounded-xl hover:bg-primary-dark transition-colors">
                  Continue →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Organisation name</label>
                  <input value={form.org_name} onChange={e=>set('org_name',e.target.value)}
                    placeholder="Your IPA or company name" autoFocus
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Organisation type</label>
                  <select value={form.org_type} onChange={e=>set('org_type',e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400">
                    <option value="">Select type…</option>
                    {ORG_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Country</label>
                  <select value={form.country} onChange={e=>set('country',e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400">
                    <option value="">Select country…</option>
                    {COUNTRIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.accept_terms} onChange={e=>set('accept_terms',e.target.checked)}
                    className="mt-0.5 accent-blue-600"/>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg font-semibold">{error}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={()=>{setStep(1);setError('');}}
                    className="flex-1 border border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:border-blue-300">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className={`flex-1 font-black py-3 rounded-xl transition-colors ${loading?'bg-slate-300 text-slate-500':'bg-[#0A2540] text-white hover:bg-primary-dark'}`}>
                    {loading?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Creating…</span>:'Start Trial'}
                  </button>
                </div>
              </>
            )}
          </form>
          <p className="text-center text-xs text-slate-400 mt-4">
            Already have an account? <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
