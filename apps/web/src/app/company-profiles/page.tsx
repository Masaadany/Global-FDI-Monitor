'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import Link from 'next/link';

const COMPANIES = [
  { cic:'GFM-USA-MSFT', flag:'🇺🇸', name:'Microsoft',      sector:'💻 ICT',      hq:'Redmond, USA',     grade:'PLATINUM', ims:96.2, sci:94.8, capex_active_bn:8.5,  capex_pipeline_bn:12.4, yoy:22, regions:['MENA','APAC','Europe'],       latest:'$850M UAE greenfield (2026)' },
  { cic:'GFM-CHN-CATL', flag:'🇨🇳', name:'CATL',            sector:'🏭 Manuf',    hq:'Ningde, China',    grade:'PLATINUM', ims:94.8, sci:92.1, capex_active_bn:12.4, capex_pipeline_bn:18.2, yoy:38, regions:['APAC','Europe','MENA'],       latest:'$3.2B Indonesia battery (2026)' },
  { cic:'GFM-USA-NVDA', flag:'🇺🇸', name:'NVIDIA',          sector:'💻 ICT',      hq:'Santa Clara, USA', grade:'PLATINUM', ims:93.4, sci:91.8, capex_active_bn:6.2,  capex_pipeline_bn:9.8,  yoy:44, regions:['South Asia','MENA','APAC'],   latest:'$1.1B India AI campus (2026)' },
  { cic:'GFM-KOR-SAMS', flag:'🇰🇷', name:'Samsung SDI',     sector:'🏭 Manuf',    hq:'Seoul, Korea',     grade:'PLATINUM', ims:92.6, sci:90.4, capex_active_bn:9.8,  capex_pipeline_bn:15.6, yoy:31, regions:['APAC','Europe'],             latest:'$2.1B Vietnam EV battery (2026)' },
  { cic:'GFM-SAU-ACWA', flag:'🇸🇦', name:'ACWA Power',      sector:'⚡ Energy',   hq:'Riyadh, Saudi',    grade:'GOLD',     ims:87.3, sci:85.1, capex_active_bn:4.2,  capex_pipeline_bn:8.4,  yoy:19, regions:['MENA','Africa','Central Asia'], latest:'$980M Saudi greenfield (2026)' },
  { cic:'GFM-FRA-TOTE', flag:'🇫🇷', name:'TotalEnergies',   sector:'⚡ Energy',   hq:'Paris, France',    grade:'GOLD',     ims:85.1, sci:83.4, capex_active_bn:5.8,  capex_pipeline_bn:11.2, yoy:14, regions:['MENA','Africa'],             latest:'$890M Egypt greenfield (2026)' },
  { cic:'GFM-USA-GOOG', flag:'🇺🇸', name:'Google Cloud',    sector:'💻 ICT',      hq:'Sunnyvale, USA',   grade:'GOLD',     ims:88.7, sci:86.2, capex_active_bn:7.4,  capex_pipeline_bn:10.8, yoy:28, regions:['APAC','MENA','Europe'],       latest:'$620M Singapore expansion (2026)' },
  { cic:'GFM-DEU-SIEN', flag:'🇩🇪', name:'Siemens Energy',  sector:'⚡ Energy',   hq:'Munich, Germany',  grade:'GOLD',     ims:84.2, sci:82.6, capex_active_bn:3.2,  capex_pipeline_bn:6.4,  yoy:16, regions:['MENA','Europe','Africa'],     latest:'$340M UAE expansion (2026)' },
];

const GRADE_C: Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969',BRONZE:'#696969'};

export default function CompanyProfilesPage() {
  const [expanded, setExpanded] = useState<string|null>(null);
  const [grade,    setGrade]    = useState('');
  const [sector,   setSector]   = useState('');

  const filtered = COMPANIES.filter(c=>{
    const mg = !grade  || c.grade  === grade;
    const ms = !sector || c.sector.includes(sector);
    return mg && ms;
  });

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-wrap justify-between gap-4 items-end">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Investor Intelligence</div>
            <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>Company Profiles</h1>
            <p className="text-sm mt-1" style={{color:'#696969'}}>IMS scores · SCI grades · Active CapEx · Investment history · Pipeline signals</p>
          </div>
          <div className="flex gap-5">
            {[['8','Companies'],['PLATINUM/GOLD','Coverage'],['$57B','Active CapEx'],['Real-time','Updated']].map(([v,l])=>(
              <div key={l} className="text-center">
                <div className="text-xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div>
                <div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 border-b px-6 py-2.5 flex gap-2 flex-wrap items-center"
        style={{background:'rgba(240,248,238,0.96)',borderBottomColor:'rgba(10,61,98,0.15)',backdropFilter:'blur(10px)'}}>
        {['','PLATINUM','GOLD'].map(g=>(
          <button key={g} onClick={()=>setGrade(g)}
            className="text-xs px-3 py-1.5 rounded-lg font-bold border"
            style={grade===g?{background:GRADE_C[g]||'#74BB65',color:'#E2F2DF',borderColor:GRADE_C[g]||'#74BB65'}:{borderColor:'rgba(10,61,98,0.2)',color:'#696969'}}>
            {g||'All Grades'}
          </button>
        ))}
        {['','ICT','Energy','Manuf'].map(s=>(
          <button key={s} onClick={()=>setSector(s)}
            className="text-xs px-3 py-1.5 rounded-lg font-bold border"
            style={sector===s?{background:'#74BB65',color:'#E2F2DF',borderColor:'#74BB65'}:{borderColor:'rgba(10,61,98,0.2)',color:'#696969'}}>
            {s||'All Sectors'}
          </button>
        ))}
        <span className="ml-auto text-xs" style={{color:'#696969'}}>{filtered.length} companies</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <PreviewGate feature="full_profile">
          <div className="space-y-3">
            {filtered.map(co=>(
              <div key={co.cic}>
                <div
                  className="gfm-card p-5 cursor-pointer"
                  onClick={()=>setExpanded(expanded===co.cic?null:co.cic)}>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-3xl flex-shrink-0">{co.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold" style={{color:'#0A3D62'}}>{co.name}</span>
                        <span className="text-xs" style={{color:'#696969'}}>{co.sector}</span>
                        <span className="text-xs" style={{color:'#696969'}}>{co.hq}</span>
                      </div>
                      <div className="text-xs mt-1" style={{color:'#696969'}}>{co.latest}</div>
                    </div>
                    <div className="flex gap-4 items-center flex-shrink-0">
                      <div className="text-center">
                        <div className="text-xs" style={{color:'#696969'}}>IMS</div>
                        <div className="font-extrabold font-data" style={{color:'#74BB65'}}>{co.ims}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs" style={{color:'#696969'}}>Active CapEx</div>
                        <div className="font-extrabold font-data" style={{color:'#0A3D62'}}>${co.capex_active_bn}B</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs" style={{color:'#696969'}}>YoY</div>
                        <div className="font-extrabold font-data" style={{color:'#22c55e'}}>+{co.yoy}%</div>
                      </div>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded"
                        style={{background:`${GRADE_C[co.grade]}15`,color:GRADE_C[co.grade]}}>
                        {co.grade}
                      </span>
                      <span style={{color:'#696969'}}>{expanded===co.cic?'▲':'▼'}</span>
                    </div>
                  </div>
                </div>

                {expanded === co.cic && (
                  <div className="gfm-card mt-1 p-5 border-t-0 rounded-t-none"
                    style={{borderTopColor:'rgba(10,61,98,0.05)'}}>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs font-bold mb-2" style={{color:'#696969'}}>Score Profile</div>
                        {[['IMS Score',co.ims,'#74BB65'],['SCI Grade',co.sci,'#74BB65'],['Active CapEx',`$${co.capex_active_bn}B`,'#0A3D62'],['Pipeline CapEx',`$${co.capex_pipeline_bn}B`,'#696969']].map(([l,v,c])=>(
                          <div key={String(l)} className="flex justify-between py-1 border-b text-xs" style={{borderBottomColor:'rgba(10,61,98,0.06)'}}>
                            <span style={{color:'#696969'}}>{l}</span>
                            <span className="font-extrabold font-data" style={{color:c as string}}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-xs font-bold mb-2" style={{color:'#696969'}}>Focus Regions</div>
                        <div className="flex flex-wrap gap-1.5">
                          {co.regions.map(r=>(
                            <span key={r} className="text-xs px-2 py-0.5 rounded"
                              style={{background:'rgba(116,187,101,0.1)',color:'#74BB65'}}>
                              {r}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 text-xs font-bold mb-1" style={{color:'#696969'}}>CapEx Distribution</div>
                        <div className="space-y-1">
                          {[['Active',co.capex_active_bn,'#74BB65'],['Pipeline',co.capex_pipeline_bn,'#696969']].map(([l,v,c])=>{
                            const max = co.capex_pipeline_bn;
                            return (
                              <div key={String(l)} className="flex items-center gap-2">
                                <span className="text-xs w-14" style={{color:'#696969'}}>{l}</span>
                                <div className="flex-1 bg-white/5 rounded-full h-1.5">
                                  <div className="h-1.5 rounded-full" style={{width:`${((v as number)/max)*100}%`,background:c as string}}/>
                                </div>
                                <span className="text-xs font-data" style={{color:c as string}}>${v}B</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold mb-2" style={{color:'#696969'}}>Latest Signal</div>
                        <p className="text-sm" style={{color:'#0A3D62'}}>{co.latest}</p>
                        <div className="mt-3">
                          <Link href="/signals" className="gfm-btn-primary text-xs py-2 px-4 block text-center">
                            View All Signals →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </PreviewGate>
      </div>
    </div>
  );
}
