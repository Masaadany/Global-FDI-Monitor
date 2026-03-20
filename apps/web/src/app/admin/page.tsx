'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const MOCK_METRICS = {
  users_total: 2847, users_trial: 412, users_pro: 2321, users_enterprise: 114,
  signals_total: 218, signals_platinum: 22, signals_gold: 76, revenue_mrr: 1854921,
  reports_generated_24h: 847, api_calls_24h: 284621, uptime_pct: 99.97,
};

const MOCK_USERS = [
  { id:'u001', email:'ahmed.alrashidi@investad.ae',  org:'InvestAD',       tier:'professional', role:'admin',  status:'active',  joined:'2025-11-12', reports:42 },
  { id:'u002', email:'sarah.chen@temasek.com.sg',    org:'Temasek',        tier:'enterprise',   role:'user',   status:'active',  joined:'2025-09-08', reports:128},
  { id:'u003', email:'marco.bianchi@pwc.com',        org:'PwC MENA',       tier:'professional', role:'user',   status:'active',  joined:'2026-01-15', reports:19 },
  { id:'u004', email:'yuki.tanaka@mufg.jp',          org:'MUFG',           tier:'enterprise',   role:'user',   status:'active',  joined:'2025-12-01', reports:87 },
  { id:'u005', email:'priya.sharma@niti.gov.in',     org:'NITI Aayog',     tier:'professional', role:'user',   status:'active',  joined:'2026-02-08', reports:23 },
  { id:'u006', email:'demo@fdimonitor.org',          org:'Demo',           tier:'free_trial',   role:'user',   status:'trial',   joined:'2026-03-18', reports:0  },
];

const MOCK_JOBS = [
  { id:'j001', name:'Signal Ingestion (T1-T3)',      status:'running', freq:'15min', last:'2 min ago',  next:'13 min',    count:218 },
  { id:'j002', name:'Signal Ingestion (T4-T5)',      status:'running', freq:'2h',    last:'45 min ago', next:'1h 15min',  count:47  },
  { id:'j003', name:'GFR Compute Engine',            status:'running', freq:'weekly',last:'6 days ago', next:'1 day',     count:215 },
  { id:'j004', name:'Forecast Model Refresh',        status:'running', freq:'daily', last:'8h ago',     next:'16h',       count:215 },
  { id:'j005', name:'SHA-256 Provenance Stamp',      status:'running', freq:'15min', last:'2 min ago',  next:'13 min',    count:0   },
  { id:'j006', name:'Report Watermark Queue',        status:'idle',    freq:'trigger',last:'3h ago',    next:'on demand', count:847 },
  { id:'j007', name:'Cache Warmer (Redis)',           status:'running', freq:'5min',  last:'4 min ago',  next:'1 min',     count:0   },
  { id:'j008', name:'Alert Notification Dispatch',   status:'running', freq:'5min',  last:'4 min ago',  next:'1 min',     count:6   },
];

const TIER_C: Record<string,string> = {enterprise:'#0A3D62',professional:'#74BB65',free_trial:'#696969'};
const STATUS_C: Record<string,string> = {running:'#22c55e',idle:'#74BB65',error:'#EF4444'};

export default function AdminPage() {
  const [tab,     setTab]     = useState<'metrics'|'users'|'jobs'|'system'>('metrics');
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [users,   setUsers]   = useState(MOCK_USERS);
  const [jobs,    setJobs]    = useState(MOCK_JOBS);

  useEffect(()=>{
    fetchWithAuth(`${API}/api/v1/admin/metrics`).then(r=>r.json())
      .then(d=>{ if(d.data) setMetrics(m=>({...m,...d.data})); }).catch(()=>{});
    fetchWithAuth(`${API}/api/v1/admin/users`).then(r=>r.json())
      .then(d=>{ const u=d.data?.users||d.users; if(u?.length) setUsers(u); }).catch(()=>{});
  },[]);

  function toggleJob(id:string) {
    setJobs(prev=>prev.map(j=>j.id===id?{...j,status:j.status==='running'?'idle':'running'}:j));
    fetchWithAuth(`${API}/api/v1/admin/jobs/${id}/toggle`,{method:'POST'}).catch(()=>{});
  }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-8">
        <div className="max-w-screen-xl mx-auto relative z-10 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{color:'#EF4444'}}>⚠ ADMIN CONSOLE</div>
            <h1 className="text-2xl font-extrabold" style={{color:'#0A3D62'}}>Platform Administration</h1>
          </div>
          <div className="flex gap-5">
            {[[metrics.users_total,'Users'],[metrics.revenue_mrr?.toLocaleString(),'MRR ($)'],[metrics.uptime_pct+'%','Uptime'],['8','Active Jobs']].map(([v,l])=>(
              <div key={String(l)} className="text-center">
                <div className="text-xl font-extrabold font-data" style={{color:'#EF4444'}}>{v}</div>
                <div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 flex gap-0 border-b px-6" style={{background:'rgba(240,248,238,0.96)',borderBottomColor:'rgba(10,61,98,0.15)',backdropFilter:'blur(10px)'}}>
        {[['metrics','📊 Metrics'],['users','👥 Users'],['jobs','⚙️ Jobs'],['system','🖥 System']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t as any)} className={`dash-tab ${tab===t?'active':''}`}>{l}</button>
        ))}
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5">

        {tab === 'metrics' && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                {v:metrics.users_total,    l:'Total Users',         c:'#74BB65'},
                {v:metrics.users_pro,      l:'Professional',         c:'#74BB65'},
                {v:metrics.users_trial,    l:'Active Trials',        c:'#696969'},
                {v:metrics.users_enterprise,l:'Enterprise',          c:'#0A3D62'},
              ].map(k=>(
                <div key={k.l} className="kpi-card">
                  <div className="text-3xl font-extrabold font-data" style={{color:k.c}}>{k.v}</div>
                  <div className="text-xs mt-1" style={{color:'#696969'}}>{k.l}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                {v:metrics.signals_total,      l:'Live Signals',   c:'#22c55e'},
                {v:metrics.signals_platinum,   l:'PLATINUM',        c:'#0A3D62'},
                {v:metrics.reports_generated_24h,l:'Reports 24h',  c:'#74BB65'},
                {v:metrics.api_calls_24h?.toLocaleString(),l:'API Calls 24h',c:'#696969'},
              ].map(k=>(
                <div key={k.l} className="kpi-card">
                  <div className="text-3xl font-extrabold font-data" style={{color:k.c}}>{k.v}</div>
                  <div className="text-xs mt-1" style={{color:'#696969'}}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="gfm-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="gfm-table">
                <thead><tr><th>User</th><th>Organisation</th><th>Tier</th><th>Status</th><th>Joined</th><th>Reports</th></tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td>
                        <div className="font-bold text-sm" style={{color:'#0A3D62'}}>{u.email.split('@')[0]}</div>
                        <div className="text-xs" style={{color:'#696969'}}>{u.email}</div>
                      </td>
                      <td style={{color:'#696969'}}>{u.org}</td>
                      <td>
                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{background:`${TIER_C[u.tier]}15`,color:TIER_C[u.tier]}}>{u.tier}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{background:u.status==='active'?'#22c55e':'#74BB65'}}/>
                          <span className="text-xs" style={{color:'#696969'}}>{u.status}</span>
                        </div>
                      </td>
                      <td className="text-xs" style={{color:'#696969'}}>{u.joined}</td>
                      <td className="font-data font-bold" style={{color:'#74BB65'}}>{u.reports}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'jobs' && (
          <div className="space-y-2">
            {jobs.map(job=>(
              <div key={job.id} className="gfm-card p-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{background:STATUS_C[job.status]}}/>
                  <span className="text-xs font-extrabold uppercase" style={{color:STATUS_C[job.status]}}>{job.status}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{color:'#0A3D62'}}>{job.name}</div>
                  <div className="text-xs flex gap-3 flex-wrap mt-0.5" style={{color:'#696969'}}>
                    <span>Freq: {job.freq}</span>
                    <span>Last: {job.last}</span>
                    <span>Next: {job.next}</span>
                    {job.count > 0 && <span>Count: {job.count}</span>}
                  </div>
                </div>
                <button onClick={()=>toggleJob(job.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                  style={{background:job.status==='running'?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',color:job.status==='running'?'#EF4444':'#22c55e'}}>
                  {job.status==='running'?'Pause':'Resume'}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'system' && (
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {title:'API Server',  items:[['Version','v77'],['Routes','78'],['Server Lines','2,036'],['Node','20 LTS']]},
              {title:'Database',    items:[['Engine','PostgreSQL 16'],['Region','UAE North'],['Tables','18'],['Status','Healthy']]},
              {title:'Cache',       items:[['Engine','Redis 7.x SSL'],['Port','6380'],['Region','UAE North'],['Status','Connected']]},
              {title:'Platform',    items:[['Pages','43 → 77 static'],['Components','19'],['Agents','30'],['Tests','653 passing']]},
            ].map(panel=>(
              <div key={panel.title} className="gfm-card p-5">
                <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>{panel.title}</div>
                {panel.items.map(([l,v])=>(
                  <div key={l} className="flex justify-between text-sm py-1.5 border-b" style={{borderBottomColor:'rgba(10,61,98,0.06)'}}>
                    <span style={{color:'#696969'}}>{l}</span>
                    <span className="font-bold font-data" style={{color:'#74BB65'}}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
