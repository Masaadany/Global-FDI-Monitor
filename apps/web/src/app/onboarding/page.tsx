'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const STEPS = [
  { id:1, title:'Welcome to FDI Monitor', subtitle:'Tell us about yourself' },
  { id:2, title:'Your Use Case',           subtitle:'How will you use the platform?' },
  { id:3, title:'Regions of Interest',     subtitle:'Which regions do you track?' },
  { id:4, title:'Target Sectors',          subtitle:'Which sectors matter most?' },
  { id:5, title:'Ready to Launch',         subtitle:'Your intelligence dashboard awaits' },
];

const USE_CASES = [
  {id:'ipa',      label:'Investment Promotion Agency', icon:'🏛'},
  {id:'swf',      label:'Sovereign Wealth Fund',       icon:'💰'},
  {id:'pe',       label:'Private Equity / VC',         icon:'📊'},
  {id:'consult',  label:'Strategy Consultant',         icon:'🎯'},
  {id:'research', label:'Academic Research',           icon:'🔬'},
  {id:'govt',     label:'Government / Ministry',       icon:'⚖️'},
  {id:'corp',     label:'Corporate Strategy',          icon:'🏢'},
  {id:'other',    label:'Other',                       icon:'💼'},
];

const REGIONS = [
  {id:'mena',       label:'MENA',            icon:'🌍'},
  {id:'apac',       label:'Asia-Pacific',    icon:'🌏'},
  {id:'europe',     label:'Europe',          icon:'🇪🇺'},
  {id:'namerica',   label:'North America',   icon:'🌎'},
  {id:'africa',     label:'Africa',          icon:'🌍'},
  {id:'latam',      label:'Latin America',   icon:'🌎'},
  {id:'global',     label:'Global',          icon:'🌐'},
  {id:'south_asia', label:'South Asia',      icon:'🌏'},
];

const SECTORS = [
  {id:'ict',    label:'ICT & Digital',        icon:'💻'},
  {id:'energy', label:'Energy & Utilities',   icon:'⚡'},
  {id:'manuf',  label:'Manufacturing',        icon:'🏭'},
  {id:'fin',    label:'Financial Services',   icon:'💰'},
  {id:'re',     label:'Real Estate',          icon:'🏢'},
  {id:'health', label:'Health & Life Sci',   icon:'🏥'},
  {id:'infra',  label:'Infrastructure',       icon:'🏗'},
  {id:'auto',   label:'Auto & Mobility',      icon:'🚗'},
];

export default function OnboardingPage() {
  const [step,     setStep]     = useState(1);
  const [useCase,  setUseCase]  = useState('');
  const [regions,  setRegions]  = useState<string[]>([]);
  const [sectors,  setSectors]  = useState<string[]>([]);
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  function toggleRegion(id: string) {
    setRegions(r => r.includes(id) ? r.filter(x=>x!==id) : [...r,id]);
  }
  function toggleSector(id: string) {
    setSectors(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  }

  async function finish() {
    setLoading(true);
    try {
      const token = typeof window!=='undefined' ? localStorage.getItem('gfm_token')||'' : '';
      await fetch(`${API}/api/v1/onboarding`, {
        method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({use_case:useCase, regions, sectors}),
      });
    } catch {}
    router.push('/dashboard');
  }

  const pct = Math.round((step/STEPS.length)*100);

  return (
    <div className="min-h-screen flex flex-col" style={{background:'#E2F2DF'}}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{borderBottomColor:'rgba(10,61,98,0.1)'}}>
        <Logo variant="nav" href="/"/>
        <div className="text-xs" style={{color:'#696969'}}>Step {step} of {STEPS.length}</div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5" style={{background:'rgba(10,61,98,0.1)'}}>
        <div className="h-full transition-all duration-500" style={{width:`${pct}%`,background:'#74BB65'}}/>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Step header */}
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-4">
              {STEPS.map(s=>(
                <div key={s.id} className={`w-2 h-2 rounded-full transition-all ${step>=s.id?'':'opacity-30'}`}
                  style={{background:step>=s.id?'#74BB65':'#696969'}}/>
              ))}
            </div>
            <h1 className="text-2xl font-extrabold mb-1" style={{color:'#0A3D62'}}>{STEPS[step-1].title}</h1>
            <p className="text-sm" style={{color:'#696969'}}>{STEPS[step-1].subtitle}</p>
          </div>

          {/* Step content */}
          {step === 1 && (
            <div className="gfm-card p-6 text-center">
              <div className="text-5xl mb-4">👋</div>
              <p className="text-sm leading-relaxed mb-4" style={{color:'#696969'}}>
                Welcome to FDI Monitor — the global standard for investment intelligence. This quick setup takes 2 minutes and personalises your dashboard experience.
              </p>
              <div className="grid grid-cols-3 gap-3 text-xs mt-4">
                {[['218','Live Signals'],['215','Economies'],['10','Report Types']].map(([v,l])=>(
                  <div key={l} className="p-3 rounded-xl" style={{background:'rgba(116,187,101,0.06)'}}>
                    <div className="font-extrabold font-data text-lg" style={{color:'#74BB65'}}>{v}</div>
                    <div style={{color:'#696969'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {USE_CASES.map(uc=>(
                <button key={uc.id} onClick={()=>setUseCase(uc.id)}
                  className={`gfm-card p-4 text-left transition-all border-2 ${useCase===uc.id?'':'border-transparent'}`}
                  style={useCase===uc.id?{borderColor:'#74BB65',background:'rgba(116,187,101,0.06)'}:{}}>
                  <div className="text-2xl mb-1">{uc.icon}</div>
                  <div className="text-xs font-semibold" style={{color:useCase===uc.id?'#74BB65':'#0A3D62'}}>{uc.label}</div>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {REGIONS.map(r=>(
                <button key={r.id} onClick={()=>toggleRegion(r.id)}
                  className={`gfm-card p-4 text-left transition-all border-2 ${regions.includes(r.id)?'':'border-transparent'}`}
                  style={regions.includes(r.id)?{borderColor:'#74BB65',background:'rgba(116,187,101,0.06)'}:{}}>
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-xs font-semibold" style={{color:regions.includes(r.id)?'#74BB65':'#0A3D62'}}>{r.label}</div>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-2 gap-3">
              {SECTORS.map(s=>(
                <button key={s.id} onClick={()=>toggleSector(s.id)}
                  className={`gfm-card p-4 text-left transition-all border-2 ${sectors.includes(s.id)?'':'border-transparent'}`}
                  style={sectors.includes(s.id)?{borderColor:'#74BB65',background:'rgba(116,187,101,0.06)'}:{}}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xs font-semibold" style={{color:sectors.includes(s.id)?'#74BB65':'#0A3D62'}}>{s.label}</div>
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="gfm-card p-6 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-xl font-extrabold mb-2" style={{color:'#0A3D62'}}>You are all set!</h2>
              <p className="text-sm mb-4" style={{color:'#696969'}}>
                Your dashboard is personalised for {useCase ? USE_CASES.find(u=>u.id===useCase)?.label : 'your profile'}.
                {regions.length > 0 ? ` Tracking ${regions.length} region${regions.length>1?'s':''}.` : ''}
                {sectors.length > 0 ? ` Focus on ${sectors.length} sector${sectors.length>1?'s':''}.` : ''}
              </p>
              <div className="text-xs mb-4 p-3 rounded-xl" style={{background:'rgba(34,197,94,0.06)',color:'#22c55e'}}>
                3-day free trial active · No credit card required
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={()=>setStep(s=>s-1)}
                className="gfm-btn-outline px-5 py-3 text-sm flex-shrink-0" style={{color:'#696969'}}>← Back</button>
            )}
            {step < 5 ? (
              <button onClick={()=>setStep(s=>s+1)} disabled={step===2&&!useCase}
                className={`gfm-btn-primary flex-1 py-3 font-extrabold ${step===2&&!useCase?'opacity-50':''}`}>
                Continue →
              </button>
            ) : (
              <button onClick={finish} disabled={loading}
                className={`gfm-btn-primary flex-1 py-3 font-extrabold ${loading?'opacity-70':''}`}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Loading…</span> : 'Enter Dashboard →'}
              </button>
            )}
          </div>
          {step === 2 && <p className="text-xs text-center mt-2" style={{color:'#696969'}}>Select your primary use case to continue</p>}
          <div className="text-center mt-3">
            <Link href="/dashboard" className="text-xs" style={{color:'#696969'}}>Skip onboarding →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
