'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';

const DEMO_ALERTS = [
  { id:1, type:'SIGNAL',    priority:'HIGH',   flag:'🇦🇪', title:'New PLATINUM signal: Microsoft UAE',              body:'$850M greenfield ICT investment confirmed · SCI 96.2 · Z3 verified',               time:'2 min ago', read:false },
  { id:2, type:'GFR',       priority:'HIGH',   flag:'🇦🇪', title:'UAE GFR rises to 80.0 (+4.2)',                   body:'UAE advances to FRONTIER tier for Q1 2026. Digital and Infrastructure dimensions lead.',time:'1h ago',  read:false },
  { id:3, type:'SIGNAL',    priority:'MEDIUM', flag:'🇮🇩', title:'New PLATINUM signal: CATL Indonesia',            body:'$3.2B battery manufacturing greenfield · APAC corridor · SCI 94.8',                time:'3h ago',  read:false },
  { id:4, type:'REPORT',    priority:'MEDIUM', flag:'📋',  title:'Your ICR report is ready',                       body:'Egypt Investment Climate Report (ICR) has been generated. Download from Reports.',   time:'5h ago',  read:true  },
  { id:5, type:'POLICY',    priority:'LOW',    flag:'🌍',  title:'New FDI incentive: Saudi SAGIA announcement',    body:'SAGIA announces new fast-track FDI licensing for tech sector investors.',              time:'8h ago',  read:true  },
  { id:6, type:'SIGNAL',    priority:'MEDIUM', flag:'🇻🇳', title:'New PLATINUM signal: Samsung SDI Vietnam',       body:'$2.1B EV battery greenfield · Northern provinces · SCI 92.6',                       time:'12h ago', read:true  },
];

const PRIORITY_C: Record<string,string> = {HIGH:'#EF4444',MEDIUM:'#74BB65',LOW:'#696969'};
const TYPE_C: Record<string,string>     = {SIGNAL:'#74BB65',GFR:'#0A3D62',REPORT:'#22c55e',POLICY:'#696969'};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [filter, setFilter] = useState('');

  const unread = alerts.filter(a=>!a.read).length;

  function markAllRead() { setAlerts(p=>p.map(a=>({...a,read:true}))); }
  function markRead(id: number) { setAlerts(p=>p.map(a=>a.id===id?{...a,read:true}:a)); }
  function dismiss(id: number) { setAlerts(p=>p.filter(a=>a.id!==id)); }

  const filtered = filter ? alerts.filter(a=>a.type===filter) : alerts;

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-8">
        <div className="max-w-screen-xl mx-auto relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{color:'#74BB65'}}>Intelligence</div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{color:'#0A3D62'}}>
              Alerts
              {unread > 0 && <span className="text-sm font-extrabold px-2 py-0.5 rounded-full" style={{background:'#EF4444',color:'#fff'}}>{unread}</span>}
            </h1>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs font-bold" style={{color:'#696969'}}>Mark all read</button>
          )}
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b px-6 py-2 flex gap-2 flex-wrap"
        style={{background:'rgba(240,248,238,0.96)',borderBottomColor:'rgba(10,61,98,0.15)',backdropFilter:'blur(10px)'}}>
        {['','SIGNAL','GFR','REPORT','POLICY'].map(t=>(
          <button key={t} onClick={()=>setFilter(t)}
            className="text-xs px-3 py-1.5 rounded-lg font-bold border transition-all"
            style={filter===t?{background:TYPE_C[t]||'#74BB65',color:'#E2F2DF',borderColor:TYPE_C[t]||'#74BB65'}:{borderColor:'rgba(10,61,98,0.2)',color:'#696969'}}>
            {t||'All'}{!t&&unread>0?` (${unread})`:''}
          </button>
        ))}
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-4 space-y-2">
        {filtered.map(a=>(
          <div key={a.id}
            className={`gfm-card p-4 flex items-start gap-3 transition-all ${!a.read?'border-l-2':''}`}
            style={!a.read?{borderLeftColor:PRIORITY_C[a.priority]}:{}}>
            <span className="text-xl flex-shrink-0 mt-0.5">{a.flag}</span>
            <div className="flex-1 min-w-0" onClick={()=>markRead(a.id)} style={{cursor:'pointer'}}>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{background:`${TYPE_C[a.type]}15`,color:TYPE_C[a.type]}}>{a.type}</span>
                <span className="text-xs font-bold" style={{color:PRIORITY_C[a.priority]}}>{a.priority}</span>
                <span className="text-xs" style={{color:'#696969'}}>{a.time}</span>
                {!a.read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:'#EF4444'}}/>}
              </div>
              <div className="font-bold text-sm mb-1" style={{color:'#0A3D62'}}>{a.title}</div>
              <p className="text-xs" style={{color:'#696969'}}>{a.body}</p>
            </div>
            <button onClick={()=>dismiss(a.id)} className="flex-shrink-0 text-sm mt-0.5" style={{color:'#696969'}} aria-label="Dismiss alert">✕</button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16" style={{color:'#696969'}}>
            <div className="text-4xl mb-3">🔔</div>
            <div className="font-extrabold" style={{color:'#696969'}}>No alerts</div>
          </div>
        )}
      </div>
    </div>
  );
}
