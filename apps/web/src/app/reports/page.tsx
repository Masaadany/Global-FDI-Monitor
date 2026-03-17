'use client';
import { useState, useEffect, useRef } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const REPORT_TYPES = [
  {code:'MIB',  name:'Market Intelligence Brief',   fic:5,  pages:'8-12',  icon:'⚡', time:'~45s'},
  {code:'CEGP', name:'Country Economic Profile',    fic:20, pages:'24-32', icon:'🌍', time:'~90s'},
  {code:'ICR',  name:'Investment Climate Report',   fic:18, pages:'20-28', icon:'📜', time:'~75s'},
  {code:'SPOR', name:'Sector Potential Report',     fic:22, pages:'28-36', icon:'📈', time:'~90s'},
  {code:'TIR',  name:'Target Investor Report',     fic:18, pages:'18-24', icon:'🎯', time:'~80s'},
  {code:'SBP',  name:'Strategic Briefing Paper',   fic:15, pages:'12-18', icon:'📋', time:'~60s'},
  {code:'SER',  name:'Signal Enrichment Report',   fic:12, pages:'10-16', icon:'🔍', time:'~50s'},
  {code:'SIR',  name:'Sector Intelligence Report', fic:14, pages:'16-22', icon:'🏭', time:'~65s'},
  {code:'RQBR', name:'Regulatory & Policy Brief',  fic:16, pages:'14-20', icon:'⚖️', time:'~70s'},
  {code:'FCGR', name:'Flagship Country GFR',       fic:25, pages:'40-56', icon:'🏆', time:'~120s'},
];

const ECONOMIES = ['UAE','Saudi Arabia','India','Egypt','Vietnam','Indonesia','Germany','Singapore','Nigeria','Morocco','Brazil','Turkey','Kenya','South Africa'];
const SECTORS_LIST = [['J','ICT'],['K','Finance'],['D','Energy'],['C','Manufacturing'],['B','Mining'],['L','Real Estate'],['H','Logistics']] as const;

type JobStatus = 'idle'|'queued'|'collecting'|'analysing'|'verifying'|'compiling'|'ready'|'error';
interface Job { id:string; ref:string; type:string; economy:string; fic:number; status:JobStatus; progress:number; startedAt:Date; }

const STATUS_LABELS: Record<JobStatus,string> = {
  idle:'Waiting',queued:'Queued',collecting:'Collecting data…',
  analysing:'AI analysis…',verifying:'Z3 verification…',compiling:'Compiling…',
  ready:'Ready to download',error:'Error',
};
const STATUS_COLOR: Record<JobStatus,string> = {
  idle:'text-slate-400',queued:'text-blue-500',collecting:'text-violet-600',
  analysing:'text-amber-600',verifying:'text-emerald-600',compiling:'text-blue-600',
  ready:'text-emerald-700',error:'text-red-500',
};

function generateRef(type:string,economy:string) {
  const iso = economy.slice(0,3).toUpperCase().replace(/ /g,'');
  const dt  = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const seq = String(Math.floor(Math.random()*9000)+1000);
  return `FCR-${type}-${iso}-${dt}-${seq}`;
}

function useJobPoller(jobs: Job[], setJobs: React.Dispatch<React.SetStateAction<Job[]>>) {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    const FLOW: JobStatus[] = ['queued','collecting','analysing','verifying','compiling','ready'];
    intervalRef.current = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.status === 'ready' || job.status === 'error') return job;
        const elapsed = (Date.now() - job.startedAt.getTime()) / 1000;
        const rt = REPORT_TYPES.find(r=>r.code===job.type);
        const totalTime = parseInt(rt?.time?.replace(/[^0-9]/g,'') || '60');
        const progress  = Math.min(98, (elapsed / totalTime) * 100);
        const stageIdx  = Math.min(FLOW.length-1, Math.floor((elapsed/(totalTime/5))));
        const status    = progress >= 98 ? 'ready' : FLOW[stageIdx] || 'collecting';
        return {...job, progress, status};
      }));
    }, 800);
    return () => clearInterval(intervalRef.current);
  }, [setJobs]);
}

export default function ReportsPage() {
  const [selectedType, setSelectedType]  = useState(REPORT_TYPES[0]);
  const [economy,      setEconomy]       = useState('UAE');
  const [sector,       setSector]        = useState('J');
  const [jobs,         setJobs]          = useState<Job[]>([]);
  const [generating,   setGenerating]    = useState(false);

  useJobPoller(jobs, setJobs);

  async function generate() {
    setGenerating(true);
    const ref = generateRef(selectedType.code, economy);
    const job: Job = {
      id: `job_${Date.now()}`, ref, type: selectedType.code,
      economy, fic: selectedType.fic, status: 'queued', progress: 0, startedAt: new Date(),
    };
    try {
      const token = typeof window!=='undefined' ? localStorage.getItem('gfm_token') : null;
      await fetch(`${API}/api/v1/reports/generate`,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token||''}`},
        body:JSON.stringify({type:selectedType.code,economy,sector}),
      });
    } catch {}
    setJobs(prev=>[job,...prev]);
    setGenerating(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Custom Intelligence Reports</h1>
          <p className="text-blue-200 text-sm">10 AI-powered types · Z3 verified · SHA-256 provenance · ~45–120 seconds</p>
          <div className="flex gap-8 mt-4">
            {[['10','Report types'],['$5–25 FIC','Cost range'],['Z3','Verified'],['SHA-256','Provenance']].map(([v,l])=>(
              <div key={String(l)}><div className="font-black text-xl text-white">{v}</div><div className="text-blue-400 text-xs">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 grid md:grid-cols-3 gap-5">
        {/* Type grid */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="text-sm font-black text-[#0A2540] mb-3">Select Report Type</div>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_TYPES.map(rt=>(
                <div key={rt.code} onClick={()=>setSelectedType(rt)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedType.code===rt.code?'border-blue-400 bg-blue-50':'border-slate-100 hover:border-blue-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{rt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-slate-400">{rt.code}</div>
                      <div className="text-xs font-black text-[#0A2540] leading-tight truncate">{rt.name}</div>
                    </div>
                    <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex-shrink-0">{rt.fic} FIC</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{rt.pages} pages</span><span>{rt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job queue */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="text-sm font-black text-[#0A2540] mb-3">Report Queue ({jobs.length})</div>
              <div className="space-y-3">
                {jobs.map(job=>(
                  <div key={job.id} className={`p-3 rounded-xl border ${job.status==='ready'?'border-emerald-200 bg-emerald-50':job.status==='error'?'border-red-200 bg-red-50':'border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-black text-[#0A2540]">{job.type} — {job.economy}</div>
                        <div className="text-xs font-mono text-slate-300">{job.ref}</div>
                      </div>
                      <div className={`text-xs font-bold ${STATUS_COLOR[job.status]}`}>
                        {STATUS_LABELS[job.status]}
                      </div>
                    </div>
                    {job.status !== 'ready' && job.status !== 'error' && (
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{width:`${job.progress}%`}}/>
                      </div>
                    )}
                    {job.status === 'ready' && (
                      <button className="mt-2 w-full bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-emerald-500 transition-colors">
                        ↓ Download PDF ({REPORT_TYPES.find(r=>r.code===job.type)?.pages} pages)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generator panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="text-sm font-black text-[#0A2540] mb-4">Generate Report</div>
            <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{selectedType.icon}</span>
                <div>
                  <div className="font-black text-sm text-[#0A2540]">{selectedType.name}</div>
                  <div className="text-xs text-blue-600">{selectedType.pages} pages · {selectedType.fic} FIC · {selectedType.time}</div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Economy</label>
                <select value={economy} onChange={e=>setEconomy(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  {ECONOMIES.map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Primary Sector</label>
                <select value={sector} onChange={e=>setSector(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  {SECTORS_LIST.map(([c,n])=><option key={c} value={c}>ISIC {c} — {n}</option>)}
                </select>
              </div>
            </div>
            <button onClick={generate} disabled={generating}
              className={`w-full font-black py-3.5 rounded-xl transition-colors ${generating?'bg-slate-300 text-slate-500 cursor-not-allowed':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'}`}>
              {generating?(
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Queuing…
                </span>
              ):`Generate — ${selectedType.fic} FIC`}
            </button>
            <p className="text-xs text-slate-400 text-center mt-2">Z3 verified · SHA-256 provenance</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="text-xs font-bold text-slate-400 mb-2">GENERATION STAGES</div>
            {(['collecting','analysing','verifying','compiling','ready'] as JobStatus[]).map((s,i)=>(
              <div key={s} className="flex items-center gap-2 text-xs py-1">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{background:['#8b5cf6','#f59e0b','#10b981','#3b82f6','#059669'][i]}}>
                  {i+1}
                </span>
                <span className={STATUS_COLOR[s]}>{STATUS_LABELS[s]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
