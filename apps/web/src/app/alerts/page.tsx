'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/shared';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';
const STATIC_ALERTS = [
  {id:'ALT001',type:'SIGNAL',priority:'HIGH',read:false,created_at:'2026-03-17T18:00:00Z',title:'New PLATINUM Signal: Microsoft → UAE',body:'$850M data centre investment confirmed in Dubai South.'},
  {id:'ALT002',type:'GFR',   priority:'MEDIUM',read:false,created_at:'2026-03-17T12:00:00Z',title:'UAE GFR +4.2 pts — New all-time record',body:'UAE achieved largest quarterly GFR gain in ranking history.'},
  {id:'ALT003',type:'SIGNAL',priority:'HIGH',read:true, created_at:'2026-03-16T09:00:00Z',title:'PLATINUM: CATL committed to Indonesia $3.2B',body:'Battery gigafactory commitment signed with BKPM. Ground-breaking Q3 2026.'},
  {id:'ALT004',type:'REPORT',priority:'LOW', read:true, created_at:'2026-03-15T14:00:00Z',title:'Your GFR Report is ready',body:'FCR-FCGR-ARE-20260315-0034 — UAE Country GFR Report (48 pages)'},
];
const PRIO: Record<string,string> = {HIGH:'text-red-500',MEDIUM:'text-amber-500',LOW:'text-slate-400'};
const TYPE_ICON: Record<string,string> = {SIGNAL:'📡',GFR:'🏆',REPORT:'📋',PIPELINE:'➕',FIC:'⭐'};
export default function AlertsPage() {
  const [alerts,setAlerts]=useState(STATIC_ALERTS);
  const { signals, connected } = useRealTimeSignals(5);
  async function markRead(id:string) {
    setAlerts(a=>a.map(x=>x.id===id?{...x,read:true}:x));
    try { await fetchWithAuth(`/api/v1/alerts/${id}/read`,{method:'POST'}); } catch {}
  }
  function markAllRead(){
    setAlerts(a=>a.map(x=>({...x,read:true})));
  }
  const unread=alerts.filter(a=>!a.read).length;
  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Alerts</h1>
            <p className="text-white/60 mt-1 text-sm">{unread} unread · {alerts.length} total</p>
          </div>
          {unread>0&&<button onClick={markAllRead} className="gfm-btn-outline text-xs py-2 px-4" style={{color:'white',borderColor:'rgba(255,255,255,.4)'}}>Mark all read</button>}
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-2">
        {/* Live signal alerts */}
        {signals.slice(0,3).filter((s:any)=>s.grade==='PLATINUM').map((s:any,i:number)=>(
          <div key={i} className="gfm-card p-4 border-l-4 border-amber-400">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">📡</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="font-bold text-sm text-deep">LIVE: PLATINUM — {s.company}</div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full live-dot"/>LIVE</span>
                </div>
                <p className="text-xs text-slate-500">${s.capex_m}M → {s.economy} · SCI {s.sci_score}</p>
              </div>
            </div>
          </div>
        ))}
        {/* Static alerts */}
        {alerts.map(a=>(
          <div key={a.id} onClick={()=>!a.read&&markRead(a.id)}
            className={`gfm-card p-4 cursor-pointer transition-all ${!a.read?'border-l-4 border-primary':''}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{TYPE_ICON[a.type]||'🔔'}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <div className={`font-bold text-sm ${a.read?'text-slate-400':'text-deep'}`}>{a.title}</div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold ${PRIO[a.priority]}`}>{a.priority}</span>
                    {!a.read&&<div className="w-2 h-2 bg-primary rounded-full"/>}
                  </div>
                </div>
                <p className="text-xs text-slate-500">{a.body}</p>
                <div className="text-xs text-slate-300 mt-1">{new Date(a.created_at).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
        {alerts.every(a=>a.read)&&signals.length===0&&(
          <div className="text-center py-14 text-slate-400">
            <div className="text-4xl mb-3">🔕</div>
            <div className="font-semibold text-sm">All caught up</div>
          </div>
        )}
      </div>
    </div>
  );
}
