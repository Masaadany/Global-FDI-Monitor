'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const REGIONS    = ['MENA','EAP','ECA','SAS','SSA','LAC','NAM'];
const SECTORS    = [['J','ICT / Technology'],['D','Energy & Utilities'],['K','Finance & Insurance'],['C','Manufacturing'],['B','Mining & Resources'],['H','Logistics & Transport'],['L','Real Estate'],['F','Construction']];
const ORG_TYPES  = ['IPA — Investment Promotion Agency','Government Ministry','Development Finance Institution','Institutional Investor','Private Equity / VC','Consultancy','Academic / Research'];
const USE_CASES  = ['FDI attraction & promotion','Investment targeting','Portfolio monitoring','Country benchmarking','Trade flow analysis','Research & policy'];

const STEPS = ['Welcome','Focus Areas','Preferences','You&apos;re Ready'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step,    setStep]    = useState(0);
  const [regions, setRegions] = useState<string[]>(['MENA']);
  const [sectors, setSectors] = useState<string[]>(['J']);
  const [useCase, setUseCase] = useState('FDI attraction & promotion');
  const [alerts,  setAlerts]  = useState(true);
  const [grade,   setGrade]   = useState<string[]>(['PLATINUM','GOLD']);

  function toggle<T>(arr: T[], setArr: (a:T[])=>void, val: T) {
    setArr(arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]);
  }

  function finish() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gfm_onboarded','true');
      localStorage.setItem('gfm_prefs', JSON.stringify({regions,sectors,useCase,alerts,grade}));
    }
    router.push('/dashboard');
  }

  const progress = ((step+1)/STEPS.length)*100;

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-blue-400 mb-2">
            {STEPS.map((s,i)=><span key={s} className={i===step?'text-white font-bold':i<step?'text-emerald-400':''}>{i+1}. {s}</span>)}
          </div>
          <div className="h-1 bg-blue-900 rounded-full">
            <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{width:`${progress}%`}}/>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          {step === 0 && (
            <div className="text-center space-y-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-2xl font-black text-[#0A2540]">Welcome to Global FDI Monitor</h2>
              <p className="text-slate-500 text-sm">Let&apos;s personalise your experience in 3 quick steps so you see the most relevant intelligence.</p>
              <div className="bg-blue-50 rounded-xl p-4 text-left border border-blue-200">
                <div className="text-xs font-bold text-blue-700 mb-2">Your free trial includes:</div>
                {['5 FIC credits (no card charged)','Live Gold + Silver signal feed','GFR Rankings for all 215 economies','Market Insights digest','3 days full access'].map(f=>(
                  <div key={f} className="flex items-center gap-2 text-xs text-blue-600 mb-1">
                    <span className="text-emerald-500 font-bold">✓</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={()=>setStep(1)} className="w-full bg-[#0A2540] text-white font-black py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                Personalise My Dashboard →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-[#0A2540]">Which regions matter to you?</h2>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(r=>(
                  <button key={r} onClick={()=>toggle(regions,setRegions,r)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${regions.includes(r)?'bg-blue-600 text-white border-blue-600':'text-slate-500 border-slate-200 hover:border-blue-300'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <h3 className="text-sm font-black text-[#0A2540]">Which sectors are you focused on?</h3>
              <div className="grid grid-cols-2 gap-2">
                {SECTORS.map(([c,n])=>(
                  <button key={c} onClick={()=>toggle(sectors,setSectors,c)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${sectors.includes(c)?'bg-blue-600 text-white border-blue-600':'text-slate-500 border-slate-200 hover:border-blue-300'}`}>
                    <span className="font-black">ISIC {c}</span> — {n.split(' ')[0]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={()=>setStep(0)} className="flex-1 border border-slate-200 text-slate-500 font-bold py-3 rounded-xl">← Back</button>
                <button onClick={()=>setStep(2)} className="flex-1 bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#0A2540]">How will you use GFM?</h2>
              <div className="space-y-2">
                {USE_CASES.map(u=>(
                  <button key={u} onClick={()=>setUseCase(u)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${useCase===u?'border-blue-400 bg-blue-50 text-blue-700':'border-slate-200 text-slate-600 hover:border-blue-200'}`}>
                    {useCase===u && '✓ '}{u}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 pb-1 border-t border-slate-100">
                <div>
                  <div className="text-sm font-bold text-[#0A2540]">Email alerts for new signals</div>
                  <div className="text-xs text-slate-400">PLATINUM + GOLD in your regions</div>
                </div>
                <button onClick={()=>setAlerts(a=>!a)}
                  className={`w-12 h-6 rounded-full transition-colors ${alerts?'bg-blue-600':'bg-slate-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform shadow ${alerts?'translate-x-6':'translate-x-0.5'}`}/>
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setStep(1)} className="flex-1 border border-slate-200 text-slate-500 font-bold py-3 rounded-xl">← Back</button>
                <button onClick={()=>setStep(3)} className="flex-1 bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">Finish Setup →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-5">
              <div className="text-5xl">🚀</div>
              <h2 className="text-2xl font-black text-[#0A2540]">You&apos;re all set!</h2>
              <div className="bg-slate-50 rounded-xl p-4 text-left text-sm">
                <div className="font-bold text-[#0A2540] mb-2">Your personalised setup:</div>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>📍 Regions: <strong>{regions.join(', ')}</strong></div>
                  <div>🏭 Sectors: <strong>ISIC {sectors.join(', ')}</strong></div>
                  <div>🎯 Use case: <strong>{useCase}</strong></div>
                  <div>🔔 Alerts: <strong>{alerts?'On':'Off'}</strong></div>
                </div>
              </div>
              <button onClick={finish} className="w-full bg-[#0A2540] text-white font-black py-4 rounded-xl hover:bg-[#1D4ED8] transition-colors text-lg">
                Open My Dashboard →
              </button>
              <Link href="/signals" className="block text-sm text-blue-600 font-bold hover:underline">
                Or browse live signals first →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
