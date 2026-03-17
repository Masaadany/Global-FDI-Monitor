'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/shared';

const STEPS = ['Welcome','Your Role','Interests','Access'] as const;
const ROLES = [
  {v:'ipa',l:'Investment Promotion Agency',icon:'🏛'},
  {v:'fund',l:'Sovereign / Private Fund',icon:'💰'},
  {v:'corp',l:'Corporate Strategy',icon:'🏢'},
  {v:'gov',l:'Government / Policy',icon:'⚖️'},
  {v:'consult',l:'Consultant / Advisor',icon:'📊'},
  {v:'research',l:'Research / Academia',icon:'🔬'},
];
const REGIONS = ['MENA','ASEAN','Sub-Saharan Africa','South Asia','Europe','North America','Latin America','East Asia'];
const SECTORS = [
  {v:'J',l:'Technology & ICT'},
  {v:'D',l:'Renewable Energy'},
  {v:'K',l:'Finance & Insurance'},
  {v:'C',l:'Manufacturing'},
  {v:'H',l:'Logistics & Transport'},
  {v:'B',l:'Mining & Resources'},
  {v:'Q',l:'Healthcare'},
  {v:'I',l:'Education & Tourism'},
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step,     setStep]     = useState(0);
  const [role,     setRole]     = useState('');
  const [regions,  setRegions]  = useState<string[]>([]);
  const [sectors,  setSectors]  = useState<string[]>([]);
  const [loading,  setLoading]  = useState(false);

  function toggle<T>(arr: T[], val: T, set: (a: T[]) => void) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  async function finish() {
    setLoading(true);
    try {
      await fetchWithAuth('/api/v1/auth/me', { method: 'GET' });
    } catch {}
    router.push('/dashboard/success');
  }

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-3">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="gfm-card p-8">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-light rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">🌍</div>
              <h2 className="font-extrabold text-2xl text-deep mb-2">Welcome to Global FDI Monitor</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                You have <strong className="text-primary">5 FIC credits</strong> to start. Let&apos;s personalise your experience so we can surface the most relevant FDI intelligence for you.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                {[
                  ['📡','Live FDI Signals','218+ signals across 215 economies'],
                  ['🏆','GFR Rankings','Quarterly readiness scores'],
                  ['📋','AI Reports','10 report types, 45–120s'],
                  ['🎯','Mission Planning','Company targeting maps'],
                ].map(([icon,title,desc]) => (
                  <div key={String(title)} className="bg-surface rounded-xl p-3 border border-slate-100">
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="font-bold text-xs text-deep">{title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="w-full gfm-btn-primary py-3.5 rounded-xl">
                Get Started →
              </button>
            </div>
          )}

          {/* Step 1: Role */}
          {step === 1 && (
            <div>
              <h2 className="font-extrabold text-xl text-deep mb-1">What best describes your role?</h2>
              <p className="text-sm text-slate-400 mb-5">We&apos;ll tailor your dashboard and default filters.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {ROLES.map(r => (
                  <button key={r.v} onClick={() => setRole(r.v)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role === r.v ? 'border-primary bg-primary-light' : 'border-slate-200 hover:border-primary'
                    }`}>
                    <div className="text-2xl mb-1.5">{r.icon}</div>
                    <div className={`text-xs font-bold leading-tight ${role === r.v ? 'text-primary' : 'text-deep'}`}>{r.l}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="gfm-btn-outline px-6 py-2.5 rounded-xl">Back</button>
                <button onClick={() => setStep(2)} disabled={!role} className={`flex-1 gfm-btn-primary py-2.5 rounded-xl ${!role ? 'opacity-40' : ''}`}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div>
              <h2 className="font-extrabold text-xl text-deep mb-1">Your focus areas</h2>
              <p className="text-sm text-slate-400 mb-4">Select the regions and sectors you track most.</p>
              <div className="mb-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Regions</div>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(r => (
                    <button key={r} onClick={() => toggle(regions, r, setRegions)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        regions.includes(r) ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-500 hover:border-primary'
                      }`}>{r}</button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Sectors</div>
                <div className="grid grid-cols-2 gap-2">
                  {SECTORS.map(s => (
                    <button key={s.v} onClick={() => toggle(sectors, s.v, setSectors)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all border ${
                        sectors.includes(s.v) ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-500 hover:border-primary'
                      }`}>{s.l}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="gfm-btn-outline px-6 py-2.5 rounded-xl">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 gfm-btn-primary py-2.5 rounded-xl">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3: Access */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">✅</div>
              <h2 className="font-extrabold text-2xl text-deep mb-2">You&apos;re ready to go!</h2>
              <div className="bg-surface rounded-xl p-4 border border-slate-200 mb-5 text-left space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Role:</span><span className="font-bold text-deep">{ROLES.find(r=>r.v===role)?.l||'—'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Regions:</span><span className="font-bold text-deep">{regions.length > 0 ? regions.slice(0,2).join(', ')+(regions.length>2?` +${regions.length-2}`:'') : 'All regions'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Sectors:</span><span className="font-bold text-deep">{sectors.length > 0 ? `${sectors.length} selected` : 'All sectors'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">FIC Balance:</span><span className="font-extrabold text-amber-600">5 credits</span></div>
              </div>
              <button onClick={finish} disabled={loading}
                className={`w-full gfm-btn-primary py-3.5 rounded-xl text-base font-bold ${loading ? 'opacity-50' : ''}`}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Setting up…</span> : 'Launch Dashboard →'}
              </button>
              <button onClick={() => setStep(2)} className="text-sm text-slate-400 hover:text-slate-600 mt-3 block w-full">← Edit preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
