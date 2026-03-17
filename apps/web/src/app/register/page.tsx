'use client';
import { useState } from 'react';
import Link from 'next/link';

const ECONOMIES = [
  {iso3:'ARE',name:'United Arab Emirates',flag:'🇦🇪',region:'MENA'},
  {iso3:'SAU',name:'Saudi Arabia',         flag:'🇸🇦',region:'MENA'},
  {iso3:'QAT',name:'Qatar',                flag:'🇶🇦',region:'MENA'},
  {iso3:'EGY',name:'Egypt',                flag:'🇪🇬',region:'MENA'},
  {iso3:'IND',name:'India',                flag:'🇮🇳',region:'South Asia'},
  {iso3:'DEU',name:'Germany',              flag:'🇩🇪',region:'Europe'},
  {iso3:'GBR',name:'United Kingdom',       flag:'🇬🇧',region:'Europe'},
  {iso3:'FRA',name:'France',               flag:'🇫🇷',region:'Europe'},
  {iso3:'IRL',name:'Ireland',              flag:'🇮🇪',region:'Europe'},
  {iso3:'SGP',name:'Singapore',            flag:'🇸🇬',region:'Asia Pacific'},
  {iso3:'USA',name:'United States',        flag:'🇺🇸',region:'North America'},
  {iso3:'BRA',name:'Brazil',               flag:'🇧🇷',region:'Latin America'},
  {iso3:'NGA',name:'Nigeria',              flag:'🇳🇬',region:'Africa'},
  {iso3:'KEN',name:'Kenya',                flag:'🇰🇪',region:'Africa'},
  {iso3:'VNM',name:'Vietnam',              flag:'🇻🇳',region:'Southeast Asia'},
  {iso3:'IDN',name:'Indonesia',            flag:'🇮🇩',region:'Southeast Asia'},
];

const SECTORS = [
  {isic:'J',name:'Information & Communication Technology'},
  {isic:'K',name:'Financial & Insurance Services'},
  {isic:'C',name:'Manufacturing'},
  {isic:'D',name:'Energy & Utilities'},
  {isic:'L',name:'Real Estate'},
  {isic:'F',name:'Construction & Infrastructure'},
  {isic:'H',name:'Transportation & Logistics'},
  {isic:'Q',name:'Healthcare & Life Sciences'},
  {isic:'B',name:'Mining & Natural Resources'},
  {isic:'M',name:'Professional & Technical Services'},
];

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const [step, setStep]       = useState<Step>(1);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const [orgName, setOrgName] = useState('');
  const [economy, setEconomy] = useState('');
  const [sector, setSector]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);

  async function handleSubmit() {
    if (!email || !password || !name || !orgName || !economy || !sector) {
      setError('Please complete all fields.'); return;
    }
    setLoading(true); setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, password, full_name: name,
          org_name: orgName, economy_iso3: economy, sector_isic: sector,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        const msg: Record<string,string> = {
          EMAIL_EXISTS: 'An account with this email already exists.',
          DOMAIN_ALREADY_REGISTERED: 'Your organisation already has an account. Ask your admin to add you as a user.',
          VALIDATION_ERROR: data.error?.message ?? 'Please check your input.',
        };
        setError(msg[data.error?.code] ?? data.error?.message ?? 'Registration failed.');
        return;
      }

      // Store tokens
      localStorage.setItem('gfm_access_token',  data.data.tokens.accessToken);
      localStorage.setItem('gfm_refresh_token', data.data.tokens.refreshToken);
      setDone(true);
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <div className="text-xl font-black text-[#0A2540] mb-2">Trial Started!</div>
          <div className="text-sm text-slate-400">Redirecting to your dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#0A2540] text-lg">G</div>
            <span className="font-black text-white text-xl">Global <span className="text-[#1D4ED8]">FDI</span> Monitor</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A2540] to-[#1D4ED8] p-6 text-center">
            <div className="text-white font-black text-xl mb-1">Start Your Free Trial</div>
            <div className="text-blue-200 text-sm">3 days · 5 FIC credits · No credit card required</div>
          </div>

          {/* Step indicator */}
          <div className="flex border-b border-slate-100">
            {[
              {n:1,label:'Your Details'},
              {n:2,label:'Organisation'},
              {n:3,label:'Your Focus'},
            ].map(s => (
              <div key={s.n} className={`flex-1 py-3 text-center text-xs font-semibold transition-all ${
                step === s.n ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' :
                step > s.n  ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                {step > s.n ? '✓ ' : `${s.n}. `}{s.label}
              </div>
            ))}
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            {/* Step 1: Personal details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Full Name</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Your full name" value={name}
                    onChange={e => setName(e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Work Email</label>
                  <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="you@organisation.com" value={email}
                    onChange={e => setEmail(e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Password</label>
                  <input type="password" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Minimum 8 characters" value={password}
                    onChange={e => setPassword(e.target.value)}/>
                </div>
                <button onClick={() => {
                    if (!name || !email || !password) { setError('Please complete all fields.'); return; }
                    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
                    setError(''); setStep(2);
                  }}
                  className="w-full bg-[#1D4ED8] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2">
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Organisation */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Organisation Name</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="e.g. Dubai FDI, Invest India, ABC Corporation"
                    value={orgName} onChange={e => setOrgName(e.target.value)}/>
                  <div className="text-xs text-slate-400 mt-1">Your IPA, company, or government entity name</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  <strong>One account per organisation domain.</strong> After signup, you can invite up to 2 additional team members on the Professional plan.
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 border border-slate-200 text-slate-500 font-semibold py-3 rounded-lg hover:border-slate-300 transition-colors text-sm">
                    ← Back
                  </button>
                  <button onClick={() => { if (!orgName) { setError('Organisation name required.'); return; } setError(''); setStep(3); }}
                    className="flex-1 bg-[#1D4ED8] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Economy + Sector focus */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">
                    Primary Economy Focus <span className="text-amber-600">(1 economy — upgrade for all 215)</span>
                  </label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    value={economy} onChange={e => setEconomy(e.target.value)}>
                    <option value="">Select your primary economy…</option>
                    {ECONOMIES.map(e => (
                      <option key={e.iso3} value={e.iso3}>
                        {e.flag} {e.name} ({e.region})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">
                    Primary Sector Focus <span className="text-amber-600">(1 sector — upgrade for all 21)</span>
                  </label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    value={sector} onChange={e => setSector(e.target.value)}>
                    <option value="">Select your primary sector…</option>
                    {SECTORS.map(s => (
                      <option key={s.isic} value={s.isic}>
                        ISIC {s.isic} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* What you get */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="text-xs font-bold text-[#0A2540] mb-2">Your 3-day trial includes:</div>
                  <div className="space-y-1">
                    {[
                      `Live signals for ${ECONOMIES.find(e=>e.iso3===economy)?.name ?? 'your chosen economy'}`,
                      'Gold + Silver + Bronze signal grades',
                      '5 FIC credits (Platinum signals: 1 FIC each)',
                      'GFR composite score for your economy',
                      'Weekly newsletter (1 edition)',
                      'Platform demo access — all 18 pages',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="text-emerald-500 flex-shrink-0">✓</span>{item}
                      </div>
                    ))}
                    {[
                      'Report generation (requires Professional)',
                      'All 215 economies (requires Professional)',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="flex-shrink-0">–</span>{item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)}
                    className="border border-slate-200 text-slate-500 font-semibold py-3 px-5 rounded-lg hover:border-slate-300 transition-colors text-sm">
                    ← Back
                  </button>
                  <button onClick={handleSubmit} disabled={loading || !economy || !sector}
                    className={`flex-1 font-black py-3 rounded-lg transition-colors text-sm ${
                      loading || !economy || !sector
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
                    }`}>
                    {loading ? 'Creating account…' : 'Start Free Trial — No Credit Card'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 text-xs text-slate-400">
          By signing up you agree to our{' '}
          <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
