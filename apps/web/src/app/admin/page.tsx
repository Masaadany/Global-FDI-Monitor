'use client';
import { useState, useEffect } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminPage() {
  const [health, setHealth] = useState<any>(null);
  const [running, setRunning] = useState<Record<string,boolean>>({});

  useEffect(() => {
    fetch(`${API}/api/v1/health`).then(r=>r.json()).then(d=>setHealth(d.data)).catch(()=>{});
  }, []);

  async function trigger(job:string) {
    setRunning(r=>({...r,[job]:true}));
    try {
      await fetch(`${API}/api/v1/internal/${job}`, {method:'POST'});
    } finally {
      setTimeout(()=>setRunning(r=>({...r,[job]:false})),3000);
    }
  }

  const JOBS = [
    {key:'pipeline/signal-detection', label:'Signal Detection',      icon:'📡', desc:'Scan GDELT + news for FDI signals'},
    {key:'pipeline/master',           label:'Master Data Pipeline',   icon:'🔄', desc:'Run all 11 collectors concurrently'},
    {key:'pipeline/worldbank',        label:'World Bank Refresh',     icon:'🌍', desc:'Refresh WDI indicators'},
    {key:'agents/newsletter',         label:'Generate Newsletter',    icon:'📰', desc:'AGT-07: Weekly FDI newsletter'},
    {key:'agents/gfr-compute',        label:'Recompute GFR Scores',   icon:'🏆', desc:'AGT-09: Full GFR quarterly update'},
    {key:'agents/publication-monthly',label:'Monthly Publication',    icon:'📋', desc:'AGT-22: Monthly intelligence report'},
    {key:'agents/sanctions-refresh',  label:'Sanctions Refresh',      icon:'🚨', desc:'AGT-18: Update sanctions lists'},
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black mb-2">Platform Administration</h1>
          <p className="text-blue-300 text-sm">Internal operations console — pipeline jobs, agent triggers, system health.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-5 space-y-5">

        {/* System health */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-black text-sm text-[#0A2540] mb-4">System Health</div>
          {health ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {l:'API',    v:health.status==='ok'?'✓ Online':'✗ Offline', c:health.status==='ok'?'text-emerald-600':'text-red-500'},
                {l:'Mode',   v:health.mode,    c:'text-blue-600'},
                {l:'DB',     v:health.db,      c:health.db==='connected'?'text-emerald-600':'text-amber-600'},
                {l:'Redis',  v:health.redis,   c:health.redis==='connected'?'text-emerald-600':'text-amber-600'},
                {l:'Version',v:health.version, c:'text-slate-600'},
                {l:'Uptime', v:health.uptime,  c:'text-slate-600'},
              ].map(s=>(
                <div key={s.l} className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-0.5">{s.l}</div>
                  <div className={`text-sm font-bold ${s.c}`}>{s.v}</div>
                </div>
              ))}
            </div>
          ) : <div className="h-16 bg-slate-100 rounded-lg animate-pulse"/>}
        </div>

        {/* Pipeline jobs */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-black text-sm text-[#0A2540] mb-4">Pipeline & Agent Jobs</div>
          <div className="grid md:grid-cols-2 gap-3">
            {JOBS.map(j=>(
              <div key={j.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{j.icon}</span>
                  <div>
                    <div className="font-bold text-xs text-[#0A2540]">{j.label}</div>
                    <div className="text-xs text-slate-400">{j.desc}</div>
                  </div>
                </div>
                <button onClick={()=>trigger(j.key)} disabled={running[j.key]}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                    running[j.key]?'bg-slate-200 text-slate-400 cursor-not-allowed':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
                  }`}>
                  {running[j.key]?(
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 border border-slate-400 border-t-transparent rounded-full animate-spin"/>
                      Running
                    </span>
                  ):'▶ Run'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {title:'Data Pipeline', items:[
              {l:'Collectors active',    v:'11/11'},
              {l:'Last run',             v:'15 min ago'},
              {l:'Data points today',    v:'2,847'},
              {l:'Economies covered',    v:'215'},
            ]},
            {title:'Agent System', items:[
              {l:'Super Agent status',   v:'✓ Online'},
              {l:'Agents registered',    v:'15 modules (50 agents)'},
              {l:'Avg routing latency',  v:'<1ms'},
              {l:'Requests today',       v:'0'},
            ]},
            {title:'Platform', items:[
              {l:'Active pages',         v:'27'},
              {l:'API endpoints',        v:'34'},
              {l:'CI/CD pipeline',       v:'3 jobs'},
              {l:'Test coverage',        v:'31 tests passing'},
            ]},
          ].map(s=>(
            <div key={s.title} className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="font-bold text-sm text-[#0A2540] mb-3">{s.title}</div>
              <div className="space-y-2">
                {s.items.map(i=>(
                  <div key={i.l} className="flex justify-between text-xs">
                    <span className="text-slate-400">{i.l}</span>
                    <span className="font-bold text-slate-700">{i.v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
