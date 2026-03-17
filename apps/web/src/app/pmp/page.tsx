'use client';
import { useState } from 'react';

const TARGETS = [
  {mfs:94,tier:1,co:'Palantir Technologies',hq:'USA',isic:'J',sector:'Technology / AI',signals:['GFS signal — SAU','CES signal — GBR'],tags:['Active expansion','No UAE presence','AI strategy announced']},
  {mfs:91,tier:1,co:'Stripe Inc',hq:'USA',isic:'K',sector:'Financial Technology',signals:['GFS signal — SAU','VC-backed $6.5B'],tags:['MENA market entry','FinTech focus','Comparable: Ireland']},
  {mfs:88,tier:1,co:'Nvidia Corporation',hq:'USA',isic:'J',sector:'Semiconductor / AI',signals:['CES signal — ARE','Government deal'],tags:['Active CES signal','Data centre fit','$60B+ revenue']},
  {mfs:85,tier:2,co:'Nuveen Asset Management',hq:'USA',isic:'K',sector:'Financial Services',signals:['FMI signal — ARE','SWF dialogue'],tags:['Infrastructure focus','$900B+ AUM','GCC interest']},
  {mfs:82,tier:2,co:'Boston Dynamics',hq:'USA',isic:'C',sector:'Robotics / Automation',signals:['GFS signal — DEU'],tags:['C-Suite change','Tech zone fit','Greenfield target']},
  {mfs:79,tier:2,co:'Databricks',hq:'USA',isic:'J',sector:'Data / AI Platform',signals:['CES signal — SAU'],tags:['Series I funded','$43B valuation','Cloud infrastructure']},
  {mfs:76,tier:2,co:'Adyen NV',hq:'NLD',isic:'K',sector:'Payments Technology',signals:['GFS signal — IND'],tags:['MENA expansion','Listed (AMS)','Comparable: UK, SG']},
];

const STEPS = ['Mission Setup','Target Config','Company Screen','Generate Dossier'];

const SECTORS = ['J — Technology','K — Financial','C — Manufacturing','Q — Healthcare','D — Energy','L — Real Estate'];

export default function PMPPage() {
  const [step, setStep] = useState(0);
  const [dest, setDest] = useState('USA');
  const [city, setCity] = useState('New York, NY');
  const [start, setStart] = useState('2026-04-15');
  const [end, setEnd]     = useState('2026-04-19');
  const [mtype, setMtype] = useState('roadshow');
  const [sectors, setSectors] = useState(['J','K']);
  const [generating, setGenerating] = useState(false);
  const [dossierDone, setDossierDone] = useState(false);
  const [dossierRef, setDossierRef] = useState('');

  function toggleSector(s: string) {
    const code = s.split(' ')[0];
    setSectors(prev => prev.includes(code) ? prev.filter(x=>x!==code) : [...prev,code]);
  }

  function generate() {
    setGenerating(true);
    const ref = `PMP-${dest}-${sectors[0] ?? 'J'}-${start.replace(/-/g,'').slice(0,8)}-0003`;
    setDossierRef(ref);
    setTimeout(() => { setGenerating(false); setDossierDone(true); }, 3000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3">
        <div>
          <span className="font-black text-sm text-[#0A2540]">Promotion Mission Planning</span>
          <span className="text-xs text-slate-400 ml-3">Auto-generates complete mission dossiers in under 5 minutes · 30 FIC standard</span>
        </div>
        <button className="ml-auto bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Mission Library
        </button>
      </div>

      <div className="p-5 max-w-5xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-start mb-8 gap-0">
          {STEPS.map((s,i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-blue-600 border-blue-600 text-white' :
                  i === step ? 'border-blue-600 text-blue-600 bg-white' :
                  'border-slate-200 text-slate-400 bg-white'
                }`}>{i < step ? '✓' : i+1}</div>
                <div className={`text-xs mt-1 font-semibold ${i===step?'text-blue-600':i<step?'text-emerald-600':'text-slate-400'}`}>{s}</div>
              </div>
              {i < STEPS.length-1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-16px] ${i<step?'bg-blue-600':'bg-slate-200'}`}/>
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="text-sm font-black text-[#0A2540] mb-5">Step 1 — Mission Setup</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Destination Economy</label>
                <select className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:border-blue-400"
                  value={dest} onChange={e=>setDest(e.target.value)}>
                  <option value="USA">United States of America</option>
                  <option value="DEU">Germany</option>
                  <option value="GBR">United Kingdom</option>
                  <option value="SGP">Singapore</option>
                  <option value="JPN">Japan</option>
                  <option value="FRA">France</option>
                  <option value="KOR">South Korea</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Destination City</label>
                <select className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5"
                  value={city} onChange={e=>setCity(e.target.value)}>
                  <option>New York, NY</option>
                  <option>San Francisco, CA</option>
                  <option>Chicago, IL</option>
                  <option>Los Angeles, CA</option>
                  <option>Boston, MA</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Mission Start</label>
                <input type="date" value={start} onChange={e=>setStart(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Mission End</label>
                <input type="date" value={end} onChange={e=>setEnd(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Mission Type</label>
                <select className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5"
                  value={mtype} onChange={e=>setMtype(e.target.value)}>
                  <option value="roadshow">Investor Targeting Roadshow</option>
                  <option value="bilateral">Bilateral Trade Mission</option>
                  <option value="sector">Sector-Specific Investment Mission</option>
                  <option value="government">Government High-Level Mission</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Priority Sectors (up to 5)</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {SECTORS.map(s => {
                    const code = s.split(' ')[0];
                    return (
                      <button key={code} onClick={() => toggleSector(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          sectors.includes(code) ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
                        }`}>{s}</button>
                    );
                  })}
                </div>
              </div>
            </div>
            <button onClick={() => setStep(1)}
              className="mt-6 bg-[#0A2540] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#1D4ED8] transition-colors">
              Continue to Target Config →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="text-sm font-black text-[#0A2540] mb-5">Step 2 — Target Company Configuration</div>
            <div className="grid grid-cols-2 gap-5">
              {[
                {label:'Company Source Geography', opts:['Any country (global)','USA only','EU + UK','North America','APAC'], default:'Any country (global)'},
                {label:'Company Size', opts:['Large Cap + Mid Cap ($100M–$1B+)','Global 2000 only','Fortune 500 only','Any size'], default:'Large Cap + Mid Cap ($100M–$1B+)'},
                {label:'Investment Momentum Score', opts:['High (IMS > 75)','Active (IMS 50–75)','Any IMS score'], default:'High (IMS > 75)'},
                {label:'Target Count', opts:['Standard (top 50 companies)','Extended (top 200 companies)'], default:'Standard (top 50 companies)'},
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">{f.label}</label>
                  <select className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5">
                    {f.opts.map(o => <option key={o} selected={o===f.default}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-span-2">
                <div className="text-xs font-bold text-slate-500 mb-2">Core Filters (all active by default)</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'NOT currently in destination economy (new investor targets)',
                    'Active in comparable economies (regional expansion appetite)',
                    'Investment Momentum Score > 75 (actively expanding)',
                    'No sanctions screening flags (OFAC/EU/UN)',
                  ].map(f => (
                    <label key={f} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-blue-600"/>
                      {f}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(0)} className="border border-slate-200 text-slate-500 text-sm font-semibold px-6 py-2.5 rounded-lg hover:border-slate-300 transition-colors">
                ← Back
              </button>
              <button onClick={() => setStep(2)} className="bg-[#0A2540] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#1D4ED8] transition-colors">
                Screen Companies →
              </button>
            </div>
          </div>
        )}

        {(step === 2 || step === 3) && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-black text-sm text-[#0A2540]">AI-Identified Target Companies</div>
                <div className="text-xs text-slate-400 mt-0.5">{TARGETS.length} companies · Ranked by Mission Fit Score (MFS) · Sectors: {sectors.join(', ')}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs border border-slate-200 text-slate-500 px-3 py-2 rounded-lg hover:border-blue-300 transition-colors">
                  Adjust Filters
                </button>
                {!dossierDone ? (
                  <button onClick={generate} disabled={generating}
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                      generating ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#1D4ED8] text-white hover:bg-blue-700'
                    }`}>
                    {generating ? 'Generating (3–5 min)…' : 'Generate Mission Dossier — 30 FIC'}
                  </button>
                ) : (
                  <div className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold">
                    ✓ Dossier Ready
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {TARGETS.map((t,i) => (
                <div key={t.co} className={`bg-white rounded-xl border p-4 flex gap-3 items-center transition-colors ${t.tier===1?'border-amber-200 bg-amber-50/30':'border-slate-100'}`}>
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black flex-shrink-0 ${
                    t.tier===1 ? 'border-amber-400 text-amber-600' : 'border-blue-400 text-blue-600'
                  }`} style={{fontSize:t.mfs>=90?'18px':'16px'}}>{t.mfs}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-sm text-[#0A2540]">{t.co}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${t.tier===1?'bg-amber-50 text-amber-700 border-amber-200':'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        Tier {t.tier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mb-1.5">{t.hq} · {t.sector} (ISIC-{t.isic})</div>
                    <div className="flex flex-wrap gap-1.5">
                      {t.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 rounded font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="text-xs bg-white border border-slate-200 text-slate-500 px-2.5 py-1.5 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors">
                      CIC Profile
                    </button>
                    <button className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-semibold">
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dossier ready */}
            {dossierDone && (
              <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <div className="font-black text-emerald-700 text-sm mb-1">✓ Mission Dossier Generated</div>
                <div className="text-xs text-emerald-600 font-mono mb-4">{dossierRef}</div>
                <div className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Your dossier contains: {TARGETS.length} MFS-ranked company profiles · {3} stakeholder contacts ·
                  6 events in mission window · 2 sector opportunity briefs (IGS analysis) · Full contact directory · Engagement scenarios for Tier 1 companies
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">↓ Download PDF Dossier</button>
                  <button className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg hover:border-blue-300 transition-colors">↓ DOCX (Editable)</button>
                  <button className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg hover:border-blue-300 transition-colors">↓ Excel Contact Directory</button>
                  <button className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg hover:border-blue-300 transition-colors">↓ PPTX Delegation Brief</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
