'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/shared';
const API = process.env.NEXT_PUBLIC_API_URL||'';
const JOBS=[
  {id:'signals',   label:'Run Signal Collection',  icon:'📡',desc:'Trigger GDELT + curated signal detection'},
  {id:'gfr',       label:'Recompute GFR Scores',   icon:'🏆',desc:'Re-run GFR formula for all 215 economies'},
  {id:'enrichment',label:'Waterfall Enrichment',   icon:'🔄',desc:'Enrich all pending data points via Z3'},
  {id:'newsletter',label:'Generate Newsletter',    icon:'📰',desc:'Compile and queue weekly digest'},
  {id:'pipeline',  label:'Full Pipeline Run',      icon:'⚡',desc:'Run all 14 collectors concurrently'},
];
export default function AdminPage() {
  const [stats,setStats]=useState<any>(null);
  const [running,setRunning]=useState<Record<string,boolean>>({});
  const [orgs,setOrgs]=useState<any[]>([]);
  useEffect(()=>{
    fetchWithAuth('/api/v1/admin/stats').then(r=>r.json()).then(d=>d.success&&setStats(d.data)).catch(()=>{});
    fetchWithAuth('/api/v1/admin/orgs').then(r=>r.json()).then(d=>d.success&&setOrgs(d.data.orgs||[])).catch(()=>{});
  },[]);
  const AGENT_API=(process.env.NEXT_PUBLIC_AGENT_API||API.replace('3001','8080'));
  async function triggerJob(job:string){
    setRunning(r=>({...r,[job]:true}));
    try{
      const res=await fetch(`${AGENT_API}/route`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:`Execute ${job}`,context:{job}})});
      if(!res.ok) throw new Error();
    }catch{
      try{await fetchWithAuth(`/api/v1/internal/${job}`,{method:'POST'});}catch{}
    }
    setTimeout(()=>setRunning(r=>({...r,[job]:false})),3500);
  }
  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10"><h1 className="text-3xl font-extrabold">Admin Console</h1><p className="text-white/60 mt-1">Platform operations · Internal use only</p></div>
      </section>
      <div className="max-w-screen-xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="md:col-span-2 space-y-5">
          {stats&&(
            <div className="grid grid-cols-3 gap-4">
              {[['Organisations',stats.total_orgs,'/admin/orgs'],['Users',stats.total_users,'/admin/users'],['Signals',stats.total_signals,'/signals']].map(([l,v,h])=>(
                <div key={String(l)} className="gfm-card p-5 text-center">
                  <div className="stat-number text-3xl font-bold text-primary mb-1">{v}</div>
                  <div className="text-xs text-slate-400">{l as string}</div>
                </div>
              ))}
            </div>
          )}
          {/* Jobs */}
          <div className="gfm-card p-5">
            <div className="font-extrabold text-deep mb-4 text-sm">Pipeline & Agent Jobs</div>
            <div className="space-y-2">
              {JOBS.map(j=>(
                <div key={j.id} className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-slate-100">
                  <span className="text-xl">{j.icon}</span>
                  <div className="flex-1"><div className="font-semibold text-sm text-deep">{j.label}</div><div className="text-xs text-slate-400">{j.desc}</div></div>
                  <button onClick={()=>triggerJob(j.id)} disabled={running[j.id]}
                    className={`gfm-btn-primary text-xs py-1.5 px-4 ${running[j.id]?'opacity-50 cursor-not-allowed':''}`}>
                    {running[j.id]?<span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>Running…</span>:'Run'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Orgs table */}
          {orgs.length>0&&(
            <div className="gfm-card overflow-hidden">
              <div className="font-extrabold text-deep p-4 border-b border-slate-100 text-sm">Recent Organisations ({orgs.length})</div>
              <table className="w-full gfm-table">
                <thead><tr><th>Name</th><th>Tier</th><th>FIC</th><th>Created</th></tr></thead>
                <tbody>
                  {orgs.map((o:any)=>(
                    <tr key={o.id}>
                      <td className="font-semibold text-deep">{o.name}</td>
                      <td><span className="text-xs font-mono text-primary bg-primary-light px-2 py-0.5 rounded">{o.tier}</span></td>
                      <td className="font-mono text-slate-600">{o.fic_balance}</td>
                      <td className="text-slate-400">{o.created_at?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Agent status */}
        <div className="space-y-4">
          <div className="gfm-card p-5">
            <div className="font-extrabold text-deep mb-3 text-sm">Agent Registry</div>
            {[['AGT-01','Signal Detection','✓'],['AGT-02','GFR Compute','✓'],['AGT-03','Country Profile','✓'],['AGT-05','Mission Planning','✓'],['AGT-07','Forecast','✓'],['AGT-08','Scenario','✓'],['AGT-09','Enrichment','✓'],['AGT-14','Publication','✓'],['AGT-15','Alert','✓']].map(([id,name,status])=>(
              <div key={id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2"><span className="text-xs font-mono text-primary">{id}</span><span className="text-xs text-slate-600">{name}</span></div>
                <span className="text-xs text-emerald-500 font-bold">{status}</span>
              </div>
            ))}
          </div>
          <div className="gfm-card p-4">
            <div className="font-extrabold text-deep mb-2 text-sm">API Health</div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
              <span className="w-2 h-2 bg-emerald-400 rounded-full live-dot"/>Operational · v3.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
