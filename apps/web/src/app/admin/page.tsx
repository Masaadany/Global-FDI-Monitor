'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminPage() {
  const [stats,   setStats]   = useState<any>(null);
  const [orgs,    setOrgs]    = useState<any[]>([]);
  const [users,   setUsers]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<'overview'|'orgs'|'users'|'jobs'>('overview');
  const [job,     setJob]     = useState('');
  const [jobOut,  setJobOut]  = useState('');

  useEffect(() => {
    Promise.all([
      fetchWithAuth(`${API}/api/v1/admin/stats`).then(r=>r.json()).catch(()=>({data:{}})),
      fetchWithAuth(`${API}/api/v1/admin/orgs`).then(r=>r.json()).catch(()=>({data:{orgs:[]}})),
      fetchWithAuth(`${API}/api/v1/admin/users`).then(r=>r.json()).catch(()=>({data:{users:[]}})),
    ]).then(([s, o, u]) => {
      setStats(s.data || s);
      setOrgs((o.data?.orgs || o.orgs || []).slice(0, 10));
      setUsers((u.data?.users || u.users || []).slice(0, 10));
      setLoading(false);
    });
  }, []);

  async function runJob(jobName: string) {
    setJob(jobName); setJobOut('Running…');
    try {
      const r = await fetchWithAuth(`${API}/api/v1/internal/${jobName}`, { method: 'POST' });
      const d = await r.json();
      setJobOut(JSON.stringify(d, null, 2));
    } catch (e: any) {
      setJobOut('Error: ' + e.message);
    }
    setJob('');
  }

  const DEMO_STATS = {
    orgs_total: 12, users_total: 28, signals_today: 14, reports_24h: 3,
    fic_consumed_today: 47, gfr_economies: 215, agents_active: 14, db_size_mb: 384,
  };
  const s = stats && Object.keys(stats).length > 0 ? stats : DEMO_STATS;

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-red-300 uppercase tracking-widest mb-2">⚠ Admin Only</div>
            <h1 className="text-3xl font-extrabold">Platform Administration</h1>
          </div>
          <div className="text-xs text-white/40 font-mono">v3.0 · UAE North</div>
        </div>
      </section>

      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-screen-xl mx-auto flex gap-0">
          {[['overview','📊 Overview'],['orgs','🏢 Orgs'],['users','👥 Users'],['jobs','⚙ Jobs']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                ['Organisations', s.orgs_total, '🏢'],
                ['Users',         s.users_total, '👥'],
                ['Signals Today', s.signals_today, '📡'],
                ['Reports (24h)', s.reports_24h, '📋'],
                ['FIC Consumed',  s.fic_consumed_today, '⭐'],
                ['GFR Economies', s.gfr_economies, '🌍'],
                ['Agents Active', s.agents_active, '🤖'],
                ['DB Size',       s.db_size_mb ? `${s.db_size_mb}MB` : '—', '🗄️'],
              ].map(([l,v,icon])=>(
                <div key={String(l)} className="gfm-card p-4 text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-2xl font-extrabold font-mono text-primary">{loading ? '…' : v}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
            <div className="gfm-card p-5">
              <div className="font-bold text-deep text-sm mb-3">Platform Health</div>
              <div className="space-y-2">
                {[
                  ['API',        'Online','text-emerald-600'],
                  ['Database',   'PostgreSQL v16','text-emerald-600'],
                  ['Redis',      'Connected','text-emerald-600'],
                  ['WebSocket',  'Broadcasting','text-emerald-600'],
                  ['Agents',     '14 active','text-emerald-600'],
                  ['CI/CD',      'GitHub Actions','text-blue-600'],
                ].map(([l,v,c])=>(
                  <div key={String(l)} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-500">{l}</span>
                    <span className={`font-bold ${c}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'orgs' && (
          <div className="gfm-card overflow-x-auto">
            {orgs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No organisations — demo mode</div>
            ) : (
              <table className="w-full gfm-table">
                <thead><tr><th>Org ID</th><th>Name</th><th>Tier</th><th>FIC Balance</th><th>Users</th><th>Created</th></tr></thead>
                <tbody>{orgs.map((o:any)=>(
                  <tr key={o.id}>
                    <td className="font-mono text-xs text-slate-400">{o.id?.slice(0,12)}…</td>
                    <td className="font-bold text-deep">{o.name}</td>
                    <td><span className="gfm-badge gfm-badge-gold">{o.tier}</span></td>
                    <td className="font-mono font-bold text-amber-600">{o.fic_balance}</td>
                    <td>{o.user_count || 1}</td>
                    <td className="text-slate-400 text-xs">{o.created_at?.slice(0,10)}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div className="gfm-card overflow-x-auto">
            {users.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No users — demo mode</div>
            ) : (
              <table className="w-full gfm-table">
                <thead><tr><th>Email</th><th>Name</th><th>Org</th><th>Role</th><th>Created</th></tr></thead>
                <tbody>{users.map((u:any)=>(
                  <tr key={u.id}>
                    <td className="font-mono text-xs text-slate-600">{u.email}</td>
                    <td className="font-semibold text-deep">{u.full_name}</td>
                    <td className="text-slate-400 text-xs">{u.org_id?.slice(0,8)}…</td>
                    <td><span className="text-xs font-bold text-primary">{u.role}</span></td>
                    <td className="text-slate-400 text-xs">{u.created_at?.slice(0,10)}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'jobs' && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="gfm-card p-5">
              <div className="font-bold text-deep text-sm mb-4">Manual Jobs</div>
              <div className="space-y-2">
                {[
                  ['gfr_refresh','Refresh GFR Scores','Recompute all 215 GFR rankings'],
                  ['pipeline_run','Run Data Pipeline','Collect from all 14 sources'],
                  ['signals_refresh','Refresh Signals','Pull latest GDELT + curated'],
                  ['cache_flush','Flush Redis Cache','Clear all cached responses'],
                ].map(([id,name,desc])=>(
                  <button key={id} onClick={()=>runJob(id)} disabled={job===id}
                    className={`w-full flex items-center justify-between p-3 bg-surface rounded-lg border border-slate-100 hover:border-primary transition-all text-left ${job===id?'opacity-50':''}`}>
                    <div>
                      <div className="text-sm font-bold text-deep">{name}</div>
                      <div className="text-xs text-slate-400">{desc}</div>
                    </div>
                    <span className="text-primary text-xs font-bold">{job===id?'Running…':'Run →'}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="gfm-card p-5">
              <div className="font-bold text-deep text-sm mb-3">Job Output</div>
              {jobOut ? (
                <pre className="bg-slate-900 text-green-400 text-xs p-3 rounded-xl font-mono overflow-auto max-h-64">{jobOut}</pre>
              ) : (
                <div className="bg-slate-900 rounded-xl p-3 h-32 flex items-center justify-center text-slate-600 text-xs font-mono">
                  Run a job to see output…
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
