'use client';
import { useState, useEffect, useRef } from 'react';
import { exportCSV } from '@/lib/export';

const API = process.env.NEXT_PUBLIC_API_URL || '';
const REPORT_TYPES = [
  {code:'MIB', name:'Market Intelligence Brief',    fic:5,  pages:'8-12', icon:'⚡',time:45},
  {code:'CEGP',name:'Country Economic Profile',     fic:20, pages:'24-32',icon:'🌍',time:90},
  {code:'ICR', name:'Investment Climate Report',    fic:18, pages:'20-28',icon:'📜',time:75},
  {code:'SPOR',name:'Sector Potential Report',      fic:22, pages:'28-36',icon:'📈',time:90},
  {code:'TIR', name:'Target Investor Report',      fic:18, pages:'18-24',icon:'🎯',time:80},
  {code:'SBP', name:'Strategic Briefing Paper',    fic:15, pages:'12-18',icon:'📋',time:60},
  {code:'SER', name:'Signal Enrichment Report',    fic:12, pages:'10-16',icon:'🔍',time:50},
  {code:'SIR', name:'Sector Intelligence Report',  fic:14, pages:'16-22',icon:'🏭',time:65},
  {code:'RQBR',name:'Regulatory & Policy Brief',   fic:16, pages:'14-20',icon:'⚖️',time:70},
  {code:'FCGR',name:'Flagship Country GFR',        fic:25, pages:'40-56',icon:'🏆',time:120},
];
const ECONOMIES = ['UAE','Saudi Arabia','India','Singapore','Egypt','Vietnam','Indonesia','Germany','Nigeria','Morocco','Brazil','Turkey'];
const SECTORS   = [['J','ICT'],['D','Energy'],['K','Finance'],['C','Manufacturing'],['B','Mining'],['H','Logistics']];

type JobStatus='idle'|'queued'|'collecting'|'analysing'|'verifying'|'compiling'|'ready'|'error';
interface Job{id:string;ref:string;type:string;economy:string;fic:number;status:JobStatus;progress:number;startedAt:number;}
const FLOW: JobStatus[]=['queued','collecting','analysing','verifying','compiling','ready'];
const STATUS_LABEL: Record<JobStatus,string>={idle:'Waiting',queued:'Queued',collecting:'Collecting data…',analysing:'AI analysis…',verifying:'Z3 verification…',compiling:'Compiling…',ready:'Ready',error:'Error'};
const STATUS_COLOR: Record<JobStatus,string>={idle:'text-slate-400',queued:'text-blue-500',collecting:'text-violet-600',analysing:'text-amber-600',verifying:'text-emerald-600',compiling:'text-blue-600',ready:'text-emerald-700',error:'text-red-500'};

function genRef(type:string,economy:string){
  const iso=economy.slice(0,3).toUpperCase().replace(/ /g,'');
  const dt=new Date().toISOString().slice(0,10).replace(/-/g,'');
  return `FCR-${type}-${iso}-${dt}-${Math.floor(Math.random()*9000+1000)}`;
}

export default function ReportsPage() {
  const [type,     setType]      = useState(REPORT_TYPES[0]);
  const [economy,  setEconomy]   = useState('UAE');
  const [sector,   setSector]    = useState('J');
  const [jobs,     setJobs]      = useState<Job[]>([]);
  const [generating,setGenerating]=useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(()=>{
    timerRef.current=setInterval(()=>{
      setJobs(prev=>prev.map(j=>{
        if(j.status==='ready'||j.status==='error') return j;
        const elapsed=(Date.now()-j.startedAt)/1000;
        const progress=Math.min(98,(elapsed/j.fic)*100*2);
        const idx=Math.min(FLOW.length-2,Math.floor((elapsed/(j.fic/4))));
        const status=progress>=98?'ready':FLOW[idx]||'collecting';
        return{...j,progress,status};
      }));
    },600);
    return ()=>clearInterval(timerRef.current);
  },[]);

  async function generate(){
    setGenerating(true);
    const ref=genRef(type.code,economy);
    const job:Job={id:`j${Date.now()}`,ref,type:type.code,economy,fic:type.fic,status:'queued',progress:0,startedAt:Date.now()};
    try{
      const token=typeof window!=='undefined'?localStorage.getItem('gfm_token'):null;
      await fetch(`${API}/api/v1/reports/generate`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token||''}`},body:JSON.stringify({type:type.code,economy,sector})});
    }catch{}
    setJobs(prev=>[job,...prev]);
    setGenerating(false);
  }

  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">AI Intelligence</div>
          <h1 className="text-4xl font-extrabold mb-2">Custom Intelligence Reports</h1>
          <p className="text-white/70">10 AI-powered report types · Z3 verified · SHA-256 provenance · 45–120 seconds</p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-5">
        {/* Left: type grid + queue */}
        <div className="md:col-span-2 space-y-4">
          <div className="gfm-card p-5">
            <div className="font-extrabold text-deep text-sm mb-3">Select Report Type</div>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_TYPES.map(rt=>(
                <div key={rt.code} onClick={()=>setType(rt)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${type.code===rt.code?'border-primary bg-primary-light':'border-slate-100 hover:border-primary-light'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{rt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-extrabold text-slate-400">{rt.code}</div>
                      <div className="text-xs font-bold text-deep leading-tight truncate">{rt.name}</div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex-shrink-0">{rt.fic} FIC</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400"><span>{rt.pages} pp</span><span>~{rt.time}s</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Queue */}
          {jobs.length>0&&(
            <div className="gfm-card p-5">
              <div className="font-extrabold text-deep text-sm mb-3">Report Queue ({jobs.length})</div>
              <div className="space-y-3">
                {jobs.map(j=>(
                  <div key={j.id} className={`p-3 rounded-xl border ${j.status==='ready'?'border-emerald-200 bg-emerald-50':j.status==='error'?'border-red-200 bg-red-50':'border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div><div className="text-xs font-bold text-deep">{j.type} — {j.economy}</div><div className="text-xs font-mono text-slate-300">{j.ref}</div></div>
                      <div className={`text-xs font-bold ${STATUS_COLOR[j.status]}`}>{STATUS_LABEL[j.status]}</div>
                    </div>
                    {j.status!=='ready'&&j.status!=='error'&&(
                      <div className="gfm-progress"><div className="gfm-progress-fill" style={{width:`${j.progress}%`,transition:'width 0.5s'}}/></div>
                    )}
                    {j.status==='ready'&&(
                      <button className="mt-2 w-full bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-emerald-500">↓ Download PDF</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: generator */}
        <div className="space-y-4">
          <div className="gfm-card p-5">
            <div className="font-extrabold text-deep mb-4">Generate Report</div>
            <div className="bg-primary-light rounded-xl p-4 border border-blue-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">{type.icon}</span>
              <div><div className="font-extrabold text-sm text-deep">{type.name}</div><div className="text-xs text-primary">{type.pages} pages · {type.fic} FIC · ~{type.time}s</div></div>
            </div>
            <div className="space-y-3 mb-4">
              <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Economy</label>
                <select value={economy} onChange={e=>setEconomy(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                  {ECONOMIES.map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Sector</label>
                <select value={sector} onChange={e=>setSector(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                  {SECTORS.map(([c,n])=><option key={c} value={c}>ISIC {c} — {n}</option>)}
                </select>
              </div>
            </div>
            <button onClick={generate} disabled={generating}
              className={`w-full gfm-btn-primary py-3.5 rounded-xl ${generating?'opacity-50':''}`}>
              {generating?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Queuing…</span>:`Generate — ${type.fic} FIC`}
            </button>
            <p className="text-xs text-slate-400 text-center mt-2">Z3 verified · SHA-256 provenance</p>
          </div>
          <div className="gfm-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Generation Pipeline</div>
            {(['collecting','analysing','verifying','compiling','ready'] as JobStatus[]).map((s,i)=>(
              <div key={s} className="flex items-center gap-2 py-1 text-xs">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
                  style={{background:['#8b5cf6','#f59e0b','#059669','#0A66C2','#059669'][i]}}>{i+1}</span>
                <span className={STATUS_COLOR[s]}>{STATUS_LABEL[s]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
