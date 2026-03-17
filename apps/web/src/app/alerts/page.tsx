'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const DEMO_ALERTS = [
  { id:'a1', type:'signal',  priority:'HIGH',   title:'PLATINUM Signal: Microsoft → UAE',     body:'$850M Cloud Region confirmed. SCI 91.2', read:false, created_at:'2026-03-17T12:00:00Z' },
  { id:'a2', type:'signal',  priority:'HIGH',   title:'PLATINUM Signal: CATL → Indonesia',    body:'$3.2B Battery Gigafactory committed',     read:false, created_at:'2026-03-17T10:00:00Z' },
  { id:'a3', type:'report',  priority:'MEDIUM', title:'Report Ready: UAE Market Brief',        body:'FCR-MIB-ARE-20260317-4821 — Download now', read:false, created_at:'2026-03-17T09:00:00Z' },
  { id:'a4', type:'fic',     priority:'LOW',    title:'FIC Balance: 3 credits remaining',      body:'Top up to continue generating reports',   read:true,  created_at:'2026-03-16T18:00:00Z' },
  { id:'a5', type:'signal',  priority:'MEDIUM', title:'GOLD Signal: Siemens Energy → Egypt',  body:'$340M Wind JV confirmed',                 read:true,  created_at:'2026-03-16T14:00:00Z' },
];

const PRIORITY_CFG: Record<string,{dot:string;bg:string;text:string}> = {
  HIGH:  {dot:'bg-red-500',  bg:'bg-red-50',  text:'text-red-700'},
  MEDIUM:{dot:'bg-amber-500',bg:'bg-amber-50',text:'text-amber-700'},
  LOW:   {dot:'bg-slate-300',bg:'bg-slate-50',text:'text-slate-500'},
};
const TYPE_ICON: Record<string,string> = { signal:'📡', report:'📋', fic:'⭐', system:'🔔' };

export default function AlertsPage() {
  const [alerts,  setAlerts]  = useState(DEMO_ALERTS);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  useEffect(() => {
    fetchWithAuth(`${API}/api/v1/alerts`).then(r=>r.json())
      .then(d => { if (d.data?.alerts?.length) setAlerts(d.data.alerts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string) {
    setAlerts(a => a.map(x => x.id===id ? {...x,read:true} : x));
    await fetchWithAuth(`${API}/api/v1/alerts/${id}/read`, { method:'POST' }).catch(()=>{});
  }

  const shown = alerts.filter(a => !filter || a.type===filter);
  const unread = alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Intelligence Alerts</div>
            <h1 className="text-3xl font-extrabold">Alerts</h1>
          </div>
          {unread > 0 && (
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-extrabold text-white">{unread}</div>
              <div className="text-xs text-white/60">Unread</div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {['','signal','report','fic'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${filter===f?'bg-primary text-white border-primary':'border-slate-200 text-slate-500 hover:border-primary'}`}>
              {f || 'All'} {f && TYPE_ICON[f]}
            </button>
          ))}
          <button onClick={()=>setAlerts(a=>a.map(x=>({...x,read:true})))} className="ml-auto text-xs text-primary hover:underline font-semibold">Mark all read</button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading alerts…</div>
        ) : shown.map(alert => {
          const cfg = PRIORITY_CFG[alert.priority] || PRIORITY_CFG.LOW;
          return (
            <div key={alert.id} onClick={()=>markRead(alert.id)}
              className={`gfm-card p-4 cursor-pointer ${alert.read?'opacity-60':''} hover:border-primary transition-all`}>
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-base">{TYPE_ICON[alert.type]||'🔔'}</div>
                  {!alert.read && <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${cfg.dot} rounded-full border-2 border-white`}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm text-deep">{alert.title}</div>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${cfg.bg} ${cfg.text}`}>{alert.priority}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{alert.body}</div>
                  <div className="text-xs text-slate-300 mt-1">{new Date(alert.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
