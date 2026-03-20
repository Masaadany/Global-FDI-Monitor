'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

const DEMO_TABS = [
  {
    id:'signals', label:'Live Signals', icon:'📡',
    desc:'Real-time FDI signal feed with SCI scoring and Z3 verification',
    preview: [
      {grade:'PLATINUM',company:'Microsoft',eco:'UAE',sector:'ICT',capex:'$850M',sci:96.2,flag:'🇦🇪'},
      {grade:'PLATINUM',company:'CATL',eco:'Indonesia',sector:'Manufacturing',capex:'$3.2B',sci:94.8,flag:'🇮🇩'},
      {grade:'GOLD',company:'ACWA Power',eco:'Saudi Arabia',sector:'Energy',capex:'$980M',sci:87.3,flag:'🇸🇦'},
      {grade:'GOLD',company:'Google Cloud',eco:'Singapore',sector:'ICT',capex:'$620M',sci:85.1,flag:'🇸🇬'},
    ],
  },
  {
    id:'gfr', label:'GFR Rankings', icon:'🏆',
    desc:'Global Future Readiness rankings for 215 economies across 6 dimensions',
    rankings: [
      {rank:1, eco:'Singapore',   flag:'🇸🇬',score:84.2,tier:'FRONTIER',change:'+0.4'},
      {rank:2, eco:'UAE',         flag:'🇦🇪',score:80.0,tier:'FRONTIER',change:'+4.2'},
      {rank:3, eco:'Switzerland', flag:'🇨🇭',score:79.8,tier:'FRONTIER',change:'-0.1'},
      {rank:4, eco:'Denmark',     flag:'🇩🇰',score:79.2,tier:'FRONTIER',change:'+0.8'},
      {rank:5, eco:'Netherlands', flag:'🇳🇱',score:78.9,tier:'FRONTIER',change:'+0.2'},
    ],
  },
  {
    id:'reports', label:'AI Reports', icon:'📋',
    desc:'10 AI-powered report types from Market Intelligence Briefs to Mission Planning Dossiers',
    report_types: [
      {id:'MIB',  name:'Market Intelligence Brief',     credits:5,  pages:'5–8'},
      {id:'ICR',  name:'Investment Climate Report',     credits:18, pages:'15–20'},
      {id:'FCGR', name:'Flagship GFR Report',           credits:25, pages:'30–40'},
      {id:'PMP',  name:'Mission Planning Dossier',      credits:30, pages:'35–45'},
    ],
  },
  {
    id:'forecast', label:'Foresight 2050', icon:'🔭',
    desc:'Probabilistic FDI forecasts to 2050 with scenario modelling',
    scenarios: [
      {name:'Optimistic',color:'#22c55e',cagr:'7.2%',fdi2035:'$4.1T'},
      {name:'Base',      color:'#74BB65',cagr:'5.8%',fdi2035:'$3.2T'},
      {name:'Stress',    color:'#EF4444',cagr:'2.4%',fdi2035:'$1.9T'},
    ],
  },
];

const GRADE_C: Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969',BRONZE:'#696969'};
const TIER_C: Record<string,string>  = {FRONTIER:'#0A3D62',HIGH:'#74BB65',MEDIUM:'#696969'};

export default function DemoPage() {
  const [tab, setTab] = useState('signals');
  const active = DEMO_TABS.find(t=>t.id===tab)!;

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 text-center">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Interactive Demo</div>
          <h1 className="text-3xl font-extrabold mb-2" style={{color:'#0A3D62'}}>See FDI Monitor in Action</h1>
          <p className="text-sm mb-6" style={{color:'#696969'}}>Explore the platform before you sign up · No account required</p>
          <Link href="/register" className="gfm-btn-primary px-8 py-3 text-sm">
            Start Free 3-Day Trial →
          </Link>
        </div>
      </section>

      {/* Tab bar */}
      <div className="sticky top-16 z-30 flex gap-0 border-b px-6" style={{background:'rgba(240,248,238,0.96)',borderBottomColor:'rgba(10,61,98,0.15)',backdropFilter:'blur(10px)'}}>
        {DEMO_TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`dash-tab ${tab===t.id?'active':''}`}
            aria-selected={tab===t.id}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        <div className="mb-4">
          <div className="text-sm font-bold mb-1" style={{color:'#0A3D62'}}>{active.desc}</div>
          <div className="text-xs" style={{color:'#696969'}}>Demo data only — sign up for live intelligence</div>
        </div>

        {/* Signals tab */}
        {tab === 'signals' && (
          <div className="gfm-card overflow-hidden">
            <table className="gfm-table">
              <thead><tr>
                <th>Grade</th><th>Company</th><th>Economy</th><th>Sector</th>
                <th>CapEx</th><th>SCI Score</th>
              </tr></thead>
              <tbody>
                {active.preview?.map((s,i)=>(
                  <tr key={i}>
                    <td><span className={`gfm-badge grade-${s.grade}`}>{s.grade}</span></td>
                    <td className="font-semibold" style={{color:'#0A3D62'}}>{s.company}</td>
                    <td><span className="mr-1">{s.flag}</span>{s.eco}</td>
                    <td style={{color:'#696969'}}>{s.sector}</td>
                    <td className="font-data font-bold" style={{color:'#74BB65'}}>{s.capex}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{background:'rgba(10,61,98,0.2)'}}>
                          <div className="h-full rounded-full" style={{width:`${s.sci}%`,background:GRADE_C[s.grade]}}/>
                        </div>
                        <span className="font-data text-xs" style={{color:GRADE_C[s.grade]}}>{s.sci}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GFR tab */}
        {tab === 'gfr' && (
          <div className="gfm-card overflow-hidden">
            <table className="gfm-table">
              <thead><tr><th>Rank</th><th>Economy</th><th>GFR Score</th><th>Tier</th><th>Change</th></tr></thead>
              <tbody>
                {active.rankings?.map(r=>(
                  <tr key={r.rank}>
                    <td className="font-extrabold font-data" style={{color:'#74BB65'}}>#{r.rank}</td>
                    <td className="font-semibold" style={{color:'#0A3D62'}}><span className="mr-1">{r.flag}</span>{r.eco}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full overflow-hidden" style={{background:'rgba(10,61,98,0.2)'}}>
                          <div className="h-full rounded-full" style={{width:`${r.score}%`,background:TIER_C[r.tier]}}/>
                        </div>
                        <span className="font-data font-bold" style={{color:TIER_C[r.tier]}}>{r.score}</span>
                      </div>
                    </td>
                    <td><span className="text-xs font-bold px-2 py-0.5 rounded" style={{background:`${TIER_C[r.tier]}18`,color:TIER_C[r.tier]}}>{r.tier}</span></td>
                    <td className="font-bold font-data" style={{color:r.change.startsWith('+')?'#22c55e':'#EF4444'}}>{r.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reports tab */}
        {tab === 'reports' && (
          <div className="grid md:grid-cols-2 gap-4">
            {active.report_types?.map(rt=>(
              <div key={rt.id} className="gfm-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold mb-1" style={{color:'#74BB65'}}>{rt.id}</div>
                    <div className="font-extrabold text-sm" style={{color:'#0A3D62'}}>{rt.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold font-data" style={{color:'#74BB65'}}>{rt.credits} cr</div>
                    <div className="text-xs" style={{color:'#696969'}}>{rt.pages} pages</div>
                  </div>
                </div>
                <button className="gfm-btn-outline w-full py-2 text-xs mt-3" style={{color:'#696969'}} disabled>
                  Preview (requires subscription)
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Forecast tab */}
        {tab === 'forecast' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {active.scenarios?.map(s=>(
                <div key={s.name} className="gfm-card p-5 text-center">
                  <div className="font-extrabold text-sm mb-3" style={{color:s.color}}>{s.name} Scenario</div>
                  <div className="text-3xl font-extrabold font-data mb-1" style={{color:s.color}}>{s.fdi2035}</div>
                  <div className="text-xs mb-3" style={{color:'#696969'}}>Global FDI by 2035</div>
                  <div className="text-sm font-bold" style={{color:'#696969'}}>CAGR {s.cagr}</div>
                </div>
              ))}
            </div>
            <div className="gfm-card p-5 text-center">
              <p className="text-sm mb-3" style={{color:'#696969'}}>Access full foresight engine with timeline charts, top 20 economies, and what-if sliders</p>
              <Link href="/register" className="gfm-btn-primary px-8 py-2.5 text-sm">Unlock Foresight →</Link>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm mb-3" style={{color:'#696969'}}>Ready for live intelligence?</p>
          <div className="flex gap-3 justify-center">
            <Link href="/register"     className="gfm-btn-primary px-8 py-3 text-sm">Start Free Trial →</Link>
            <Link href="/pricing"      className="gfm-btn-outline px-6 py-3 text-sm" style={{color:'#696969'}}>View Pricing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
