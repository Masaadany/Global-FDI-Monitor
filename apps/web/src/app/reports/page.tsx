'use client';
import { useState, useRef, useEffect } from 'react';

const REPORT_TYPES = [
  {code:'MIB',  name:'Market Intelligence Brief',              pages:'8–12',   fic:5,  depth:'summary',  desc:'Quick-read investment summary with key signals and risks'},
  {code:'CEGP', name:'Country Economic & Geopolitical Profile',pages:'25–40',  fic:20, depth:'detailed', desc:'Comprehensive economy profile across all 6 GFR dimensions'},
  {code:'ICR',  name:'Investment Climate Review',              pages:'20–35',  fic:18, depth:'detailed', desc:'Full assessment of regulatory, tax, and investment environment'},
  {code:'SPOR', name:'Sector Profile & Outlook',               pages:'25–45',  fic:22, depth:'detailed', desc:'Deep-dive sector intelligence with 3-year FE forecasts'},
  {code:'TIR',  name:'Trade Intelligence Report',              pages:'20–35',  fic:18, depth:'detailed', desc:'Bilateral trade flows, RCA, TiVA and corridor analysis'},
  {code:'ZFP',  name:'Zone / Free Zone Profile',               pages:'15–25',  fic:12, depth:'standard', desc:'Zone investment case, incentives, setup process and tenants'},
  {code:'PRIB', name:'Policy & Regulatory Intelligence Brief', pages:'15–25',  fic:12, depth:'standard', desc:'Recent policy changes and regulatory outlook'},
  {code:'STD',  name:'Standard Report',                        pages:'15–25',  fic:15, depth:'standard', desc:'Versatile standard-depth intelligence report'},
  {code:'DET',  name:'Detailed Report',                        pages:'30–60',  fic:30, depth:'detailed', desc:'In-depth analysis across all priority areas'},
  {code:'DDF',  name:'Deep-Dive / Flagship',                   pages:'60–150', fic:50, depth:'flagship', desc:'Comprehensive flagship publication — board and ministry level'},
];

const ECONOMIES = [
  {iso3:'ARE',name:'United Arab Emirates'},{iso3:'SAU',name:'Saudi Arabia'},{iso3:'IND',name:'India'},
  {iso3:'DEU',name:'Germany'},{iso3:'SGP',name:'Singapore'},{iso3:'USA',name:'United States'},
  {iso3:'GBR',name:'United Kingdom'},{iso3:'QAT',name:'Qatar'},{iso3:'EGY',name:'Egypt'},
  {iso3:'VNM',name:'Vietnam'},{iso3:'KEN',name:'Kenya'},{iso3:'NGA',name:'Nigeria'},
];

const SECTORS = [
  {isic:'all',name:'All Sectors'},{isic:'J',name:'J — Information & Communication'},
  {isic:'C',name:'C — Manufacturing'},{isic:'K',name:'K — Financial Services'},
  {isic:'D',name:'D — Energy & Utilities'},{isic:'F',name:'F — Construction'},
  {isic:'L',name:'L — Real Estate'},{isic:'B',name:'B — Mining & Quarrying'},
  {isic:'Q',name:'Q — Human Health'},{isic:'H',name:'H — Transport & Logistics'},
];

const DEPTHS = [
  {id:'standard',label:'Standard (15–25pp)'},
  {id:'detailed',label:'Detailed (30–60pp)'},
  {id:'deep_dive',label:'Deep-Dive (60–150pp)'},
];

const STEPS = [
  'Querying ITIM Investment Monitor…',
  'Assembling GFR readiness data…',
  'Running sector gap analysis…',
  'Processing CIC company benchmarks…',
  'Generating AI intelligence narrative…',
  'Running Z3 factual verification…',
  'Rendering PDF + DOCX + Excel…',
  '✓ Report ready for download!',
];

const RECENT = [
  {code:'FCR-CEGP-ARE-20260315-143022-0047',type:'CEGP',eco:'UAE',time:'12 min ago',fic:20},
  {code:'FCR-MIB-SAU-20260314-091500-0031', type:'MIB', eco:'Saudi Arabia',time:'1 day ago',fic:5},
  {code:'FCR-SPOR-IND-20260313-162211-0019',type:'SPOR',eco:'India',time:'2 days ago',fic:22},
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('CEGP');
  const [economy, setEconomy]   = useState('ARE');
  const [sector, setSector]     = useState('all');
  const [depth, setDepth]       = useState('standard');
  const [language, setLanguage] = useState('en');
  const [peers, setPeers]       = useState<string[]>(['SAU','SGP']);
  const [generating, setGenerating] = useState(false);
  const [stepIdx, setStepIdx]   = useState(0);
  const [done, setDone]         = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const rtype = REPORT_TYPES.find(r => r.code === selectedType)!;
  const ficCost = rtype?.fic ?? 15;

  function generate() {
    if (generating) return;
    setGenerating(true); setStepIdx(0); setDone(false);
    const now = new Date();
    const dateStr = now.toISOString().slice(0,10).replace(/-/g,'');
    const timeStr = now.toISOString().slice(11,19).replace(/:/g,'');
    setGeneratedRef(`FCR-${selectedType}-${economy}-${dateStr}-${timeStr}-0048`);

    timerRef.current = setInterval(() => {
      setStepIdx(prev => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          clearInterval(timerRef.current!);
          setDone(true);
          setGenerating(false);
        }
        return next;
      });
    }, 600);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const pct = Math.round((stepIdx / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3">
        <div>
          <span className="font-black text-sm text-[#0A2540]">Custom Reports Engine (CODRE)</span>
          <span className="text-xs text-slate-400 ml-3">10 report types · AI-generated · Z3 SMT verified · Under 60 seconds</span>
        </div>
        <button className="ml-auto bg-white border border-slate-200 text-slate-500 text-xs px-3 py-2 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors">
          Report History
        </button>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5 p-5">
        <div>
          {/* Report type selector */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Select Report Type</div>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_TYPES.map(rt => (
                <button key={rt.code}
                  onClick={() => {setSelectedType(rt.code); setDone(false);}}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selectedType === rt.code
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xs font-black ${selectedType===rt.code?'text-blue-700':'text-slate-400'}`}>{rt.code}</span>
                    <span className="text-xs text-slate-400">{rt.pages}pp</span>
                    <span className={`ml-auto text-xs font-bold ${selectedType===rt.code?'text-blue-600':'text-slate-400'}`}>{rt.fic} FIC</span>
                  </div>
                  <div className={`text-xs font-semibold mt-0.5 ${selectedType===rt.code?'text-[#0A2540]':'text-slate-600'}`}>{rt.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{rt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Report Parameters</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Economy</label>
                <select className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-400"
                  value={economy} onChange={e=>setEconomy(e.target.value)}>
                  {ECONOMIES.map(e => <option key={e.iso3} value={e.iso3}>{e.name} ({e.iso3})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Sector (ISIC)</label>
                <select className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-400"
                  value={sector} onChange={e=>setSector(e.target.value)}>
                  {SECTORS.map(s => <option key={s.isic} value={s.isic}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Report Depth</label>
                <select className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-400"
                  value={depth} onChange={e=>setDepth(e.target.value)}>
                  {DEPTHS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Language</label>
                <select className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-400"
                  value={language} onChange={e=>setLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="fr">French (Français)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="zh">Chinese (中文)</option>
                  <option value="de">German (Deutsch)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 block mb-2">Benchmark Peers</label>
                <div className="flex flex-wrap gap-2">
                  {['SAU','SGP','IRL','NLD','KOR','DEU'].map(iso => (
                    <button key={iso}
                      onClick={() => setPeers(prev => prev.includes(iso) ? prev.filter(p=>p!==iso) : [...prev,iso])}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        peers.includes(iso) ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
                      }`}>{iso}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FIC cost + generate */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="text-2xl font-black text-blue-700">{ficCost}</div>
            <div>
              <div className="text-sm font-bold text-blue-700">FIC cost · {rtype?.name} ({depth})</div>
              <div className="text-xs text-blue-500">Estimated generation time: ~45 seconds · Reference code assigned automatically</div>
            </div>
          </div>
          <button onClick={generate} disabled={generating || done}
            className={`w-full py-3 rounded-xl text-sm font-black transition-all ${
              done ? 'bg-emerald-600 text-white cursor-default' :
              generating ? 'bg-slate-300 text-slate-500 cursor-not-allowed' :
              'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
            }`}>
            {done ? `✓ Report Ready — ${generatedRef}` :
             generating ? 'Generating…' :
             `Generate ${rtype?.code} Report — ${ficCost} FIC`}
          </button>

          {/* Progress */}
          {(generating || done) && (
            <div className="mt-4 bg-white border border-slate-100 rounded-xl p-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-[#0A2540]">{done ? '✓ Report Generated!' : 'Generating…'}</span>
                <span className="text-slate-400 font-mono">{pct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{width:`${pct}%`}} />
              </div>
              <div className="text-xs text-slate-500">{STEPS[Math.min(stepIdx, STEPS.length-1)]}</div>
              {done && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  <button className="bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">↓ Download PDF</button>
                  <button className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg hover:border-blue-300 transition-colors">↓ DOCX</button>
                  <button className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg hover:border-blue-300 transition-colors">↓ Excel Data</button>
                  <div className="text-xs text-slate-400 self-center ml-auto font-mono">{generatedRef}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent reports */}
        <div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 mb-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">Recent Reports</div>
            {RECENT.map(r => (
              <div key={r.code} className="flex gap-2 items-start py-2.5 border-b border-slate-50 last:border-0">
                <span className="text-xs font-black text-blue-600 w-10">{r.type}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#0A2540] truncate">{r.eco}</div>
                  <div className="text-xs text-slate-400">{r.time} · {r.fic} FIC</div>
                  <div className="text-xs text-slate-300 font-mono truncate mt-0.5">{r.code}</div>
                </div>
                <button className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors flex-shrink-0">↓</button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">All 10 Report Types</div>
            <div className="space-y-2">
              {REPORT_TYPES.map(rt => (
                <div key={rt.code} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-500 w-10 inline-block">{rt.code}</span>
                    <span className="text-slate-600">{rt.name.split(' ').slice(0,3).join(' ')}…</span>
                  </div>
                  <span className="font-bold text-blue-600 flex-shrink-0">{rt.fic} FIC</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
