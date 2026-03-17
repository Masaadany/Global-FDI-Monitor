'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const MOCK_ORGS = [
  {id:'org_001',name:'UAE Investment Authority',tier:'professional',fic_balance:3840,users:2,created:'2026-01-15',status:'active'},
  {id:'org_002',name:'NEOM Company',              tier:'enterprise',  fic_balance:48200,users:8,created:'2026-02-01',status:'active'},
  {id:'org_003',name:'Saudi MISA',                tier:'professional',fic_balance:2100,users:3,created:'2026-02-10',status:'active'},
  {id:'org_004',name:'EDB Singapore',             tier:'professional',fic_balance:980, users:1,created:'2026-03-01',status:'active'},
  {id:'org_005',name:'Invest in Africa',          tier:'free_trial',  fic_balance:2,   users:1,created:'2026-03-16',status:'trial'},
  {id:'org_006',name:'IDA Ireland',               tier:'enterprise',  fic_balance:55000,users:10,created:'2026-01-01',status:'active'},
];

const MOCK_USERS = [
  {id:'usr_001',name:'Ahmed Al-Rashid',email:'ahmed@uia.ae',org:'UAE Investment Authority',role:'admin',last_login:'2026-03-17',status:'active'},
  {id:'usr_002',name:'Sarah Chen',     email:'sarah@neom.com',org:'NEOM Company',          role:'admin',last_login:'2026-03-17',status:'active'},
  {id:'usr_003',name:'James Park',     email:'james@misa.sa',org:'Saudi MISA',              role:'member',last_login:'2026-03-16',status:'active'},
  {id:'usr_004',name:'Wei Lin',        email:'wei@edb.gov.sg',org:'EDB Singapore',          role:'admin',last_login:'2026-03-15',status:'active'},
  {id:'usr_005',name:'Demo User',      email:'demo@example.com',org:'Invest in Africa',    role:'member',last_login:'2026-03-16',status:'trial'},
];

const TIER_STYLES: Record<string,string> = {
  enterprise:'bg-amber-100 text-amber-700',professional:'bg-blue-100 text-blue-700',
  free_trial:'bg-slate-100 text-slate-600',
};

export default function AdminPage() {
  const [tab,    setTab]    = useState<'health'|'orgs'|'users'|'jobs'>('health');
  const [health, setHealth] = useState<any>(null);
  const [running,setRunning]= useState<Record<string,boolean>>({});

  useEffect(() => {
    fetch(`${API}/api/v1/health`).then(r=>r.json()).then(d=>setHealth(d?.data||d)).catch(()=>{});
  }, []);

  const AGENT_API = process.env.NEXT_PUBLIC_AGENT_API || API.replace('/api/v1','').replace('3001','8080');
  
  async function triggerJob(job: string) {
    setRunning(r=>({...r,[job]:true}));
    try {
      // Try super agent HTTP endpoint first
      const agentRes = await fetch(`${AGENT_API}/route`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({query:`Execute ${job}`,context:{job}}),
      });
      if (!agentRes.ok) throw new Error('Agent API unavailable');
    } catch {
      // Fallback to API internal endpoint
      try { await fetch(`${API}/api/v1/internal/${job}`,{method:'POST'}); } catch {}
    }
    setTimeout(()=>setRunning(r=>({...r,[job]:false})),3000);
  }

  const JOBS = [
    {k:'pipeline/signal-detection',l:'Signal Detection',   i:'📡',d:'Scan GDELT for FDI signals (15min cadence)'},
    {k:'pipeline/master',          l:'Master Pipeline',    i:'🔄',d:'Run all 14 collectors concurrently'},
    {k:'pipeline/worldbank',       l:'World Bank Refresh', i:'🌍',d:'Refresh WDI indicators (daily)'},
    {k:'agents/newsletter',        l:'Weekly Newsletter',  i:'📰',d:'Generate Week newsletter (AGT-07)'},
    {k:'agents/gfr-compute',       l:'GFR Recompute',      i:'🏆',d:'Full GFR quarterly update (AGT-09)'},
    {k:'agents/publication-monthly',l:'Monthly Report',   i:'📋',d:'Generate monthly publication (AGT-22)'},
    {k:'agents/sanctions-refresh', l:'Sanctions Update',   i:'🚨',d:'Refresh OFAC/UN sanctions lists (AGT-18)'},
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div><h1 className="text-2xl font-black">Platform Administration</h1><p className="text-blue-300 text-xs mt-1">Internal operations console · admin only</p></div>
          <div className="text-xs text-blue-400">v3.0.0 · {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        <div className="flex gap-2 mb-5">
          {(['health','orgs','users','jobs'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all ${tab===t?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>{t}</button>
          ))}
        </div>

        {tab==='health' && (
          <div className="space-y-5">
            {/* System health grid */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="font-black text-sm text-[#0A2540] mb-4">System Health</div>
              {health ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {l:'API Status',     v:health.status==='ok'?'✓ Online':'✗ Offline',  c:health.status==='ok'?'text-emerald-600':'text-red-500'},
                    {l:'Mode',           v:health.mode||'demo',                           c:'text-blue-600'},
                    {l:'Database',       v:health.db||'unavailable',                      c:health.db==='connected'?'text-emerald-600':'text-amber-600'},
                    {l:'Redis Cache',    v:health.redis||'unavailable',                   c:health.redis==='connected'?'text-emerald-600':'text-amber-600'},
                    {l:'Version',        v:health.version||'3.0.0',                       c:'text-slate-600'},
                    {l:'Uptime',         v:`${health.uptime||0}s`,                        c:'text-slate-600'},
                    {l:'WS Clients',     v:health.ws_clients||0,                          c:'text-blue-600'},
                    {l:'Signals Sent',   v:health.signals_broadcast||0,                   c:'text-emerald-600'},
                  ].map(s=>(
                    <div key={s.l} className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-0.5">{s.l}</div>
                      <div className={`text-sm font-bold ${s.c}`}>{String(s.v)}</div>
                    </div>
                  ))}
                </div>
              ) : <div className="h-20 bg-slate-100 rounded-lg animate-pulse"/>}
            </div>

            {/* Platform stats */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {title:'Platform',    items:[['Pages','34'],['API Routes','~45'],['Tests','31 passing'],['Build','✓ Compiled']]},
                {title:'Data',        items:[['Economies','215'],['Collectors','14/14'],['Data Points','598/run'],['Sectors','21 ISIC']]},
                {title:'Intelligence',items:[['Agents','50 (15 modules)'],['Languages','40 (EN+AR live)'],['GFR Dimensions','6'],['Signal Types','12']]},
              ].map(s=>(
                <div key={s.title} className="bg-white rounded-xl border border-slate-100 p-5">
                  <div className="font-bold text-sm text-[#0A2540] mb-3">{s.title}</div>
                  {s.items.map(([l,v])=>(
                    <div key={l} className="flex justify-between text-xs py-1 border-b border-slate-50">
                      <span className="text-slate-400">{l}</span><span className="font-bold text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='orgs' && (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="font-black text-sm text-[#0A2540]">Organisations ({MOCK_ORGS.length})</div>
              <div className="text-xs text-slate-400">Total MRR: ${MOCK_ORGS.filter(o=>o.tier==='professional').length * 899 + MOCK_ORGS.filter(o=>o.tier==='enterprise').length * 2458}​/month</div>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['Organisation','Tier','FIC Balance','Users','Created','Status'].map(h=>(
                  <th key={h} className="text-left px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {MOCK_ORGS.map(o=>(
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-[#0A2540]">{o.name}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TIER_STYLES[o.tier]}`}>{o.tier}</span></td>
                    <td className="px-4 py-3 font-bold text-amber-600">⭐ {o.fic_balance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500">{o.users}</td>
                    <td className="px-4 py-3 text-slate-400">{o.created}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${o.status==='active'?'bg-emerald-100 text-emerald-700':o.status==='trial'?'bg-blue-100 text-blue-700':'bg-slate-100 text-slate-500'}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='users' && (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 font-black text-sm text-[#0A2540]">Users ({MOCK_USERS.length})</div>
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['Name','Email','Organisation','Role','Last Login','Status'].map(h=>(
                  <th key={h} className="text-left px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {MOCK_USERS.map(u=>(
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-[#0A2540]">{u.name}</td>
                    <td className="px-4 py-3 text-blue-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-500">{u.org}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role==='admin'?'bg-violet-100 text-violet-700':'bg-slate-100 text-slate-500'}`}>{u.role}</span></td>
                    <td className="px-4 py-3 text-slate-400">{u.last_login}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.status==='active'?'bg-emerald-100 text-emerald-700':'bg-blue-100 text-blue-700'}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-4 mt-5">
              {/* Signal volume chart */}
              <div className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="font-bold text-sm text-[#0A2540] mb-3">Signal Volume — Last 14 Days</div>
                <svg viewBox="0 0 300 80" className="w-full">
                  {[18,22,15,28,31,24,19,35,42,38,27,44,48,52].map((v,i)=>{
                    const x=i*(300/13); const h=(v/60)*65;
                    return <g key={i}>
                      <rect x={x+2} y={75-h} width="18" height={h} fill={i>=12?'#1D4ED8':'#dbeafe'} rx="2"/>
                      {i%3===0&&<text x={x+10} y={78} fontSize="6" textAnchor="middle" fill="#94a3b8">{14-i}d</text>}
                    </g>;
                  })}
                </svg>
              </div>
              {/* FDI by region */}
              <div className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="font-bold text-sm text-[#0A2540] mb-3">FDI Signals by Region</div>
                <div className="space-y-2">
                  {[['MENA','#f59e0b',38],['EAP','#06b6d4',28],['ECA','#3b82f6',18],['SAS','#8b5cf6',10],['SSA','#ef4444',6]].map(([r,c,pct])=>(
                    <div key={String(r)} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-10">{r}</span>
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${pct}%`,background:String(c)}}/>
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-6">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        {tab==='jobs' && (
          <div className="grid md:grid-cols-2 gap-3">
            {JOBS.map(j=>(
              <div key={j.k} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{j.i}</span>
                  <div><div className="font-bold text-sm text-[#0A2540]">{j.l}</div><div className="text-xs text-slate-400">{j.d}</div></div>
                </div>
                <button onClick={()=>triggerJob(j.k)} disabled={running[j.k]}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ml-3 ${running[j.k]?'bg-slate-200 text-slate-400 cursor-not-allowed':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'}`}>
                  {running[j.k]?<span className="flex items-center gap-1"><span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"/>Running</span>:'▶ Run'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
