'use client';
import { useState } from 'react';

const ALERTS = [
  {id:'ALT001',type:'SIGNAL',    priority:'HIGH',  title:'New PLATINUM signal: Microsoft Corp → UAE',        desc:'SCI 91.2 · $850M · Technology sector · Confirmed greenfield investment.',time:'2 min ago', read:false},
  {id:'ALT002',type:'SIGNAL',    priority:'HIGH',  title:'New PLATINUM signal: Vestas Wind → India',         desc:'SCI 85.9 · $420M · Renewable Energy · Announced greenfield.',           time:'18 min ago',read:false},
  {id:'ALT003',type:'GFR',       priority:'MEDIUM',title:'UAE GFR score improved: +4.2 points this quarter', desc:'New composite: 80.0. Strongest gain in index history.',                  time:'1 hr ago',  read:false},
  {id:'ALT004',type:'REGULATORY',priority:'HIGH',  title:'India raises FDI cap in insurance to 100%',        desc:'Automatic route approved. Effective immediately. Significant M&A window.',time:'3 hr ago',  read:true},
  {id:'ALT005',type:'SIGNAL',    priority:'MEDIUM',title:'New GOLD signal: Amazon AWS → Saudi Arabia',       desc:'SCI 88.4 · $5.3B · Cloud Infrastructure · Announced expansion.',          time:'5 hr ago',  read:true},
  {id:'ALT006',type:'FORECAST',  priority:'LOW',   title:'UAE FDI forecast updated: baseline raised to $36B', desc:'2026 nowcast revised upward. Energy transition driving demand.',          time:'1 day ago', read:true},
  {id:'ALT007',type:'PIPELINE',  priority:'MEDIUM',title:'Microsoft Corp deal stalled — 60+ days in NEGOTIATING',desc:'At-risk flag raised. Follow-up action recommended.',                  time:'1 day ago', read:true},
  {id:'ALT008',type:'PUBLICATION',priority:'LOW',  title:'Weekly Newsletter published: FNL-WK-2026-11',      desc:'12 signals, 3 GFR movements, sector spotlight: Green Hydrogen.',          time:'2 days ago',read:true},
];

const TYPE_STYLES: Record<string,{bg:string,text:string,icon:string}> = {
  SIGNAL:     {bg:'bg-blue-100',      text:'text-blue-700',      icon:'📡'},
  GFR:        {bg:'bg-violet-100',    text:'text-violet-700',    icon:'🏆'},
  REGULATORY: {bg:'bg-amber-100',     text:'text-amber-700',     icon:'📜'},
  FORECAST:   {bg:'bg-emerald-100',   text:'text-emerald-700',   icon:'🔮'},
  PIPELINE:   {bg:'bg-orange-100',    text:'text-orange-700',    icon:'⚠️'},
  PUBLICATION:{bg:'bg-slate-100',     text:'text-slate-600',     icon:'📰'},
};

const PRIORITY_DOT: Record<string,string> = {
  HIGH:'bg-red-500', MEDIUM:'bg-amber-500', LOW:'bg-slate-300',
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState('');

  const unread   = alerts.filter(a => !a.read).length;
  const filtered = alerts.filter(a => !filter || a.type === filter);

  function markAllRead() {
    setAlerts(prev => prev.map(a => ({...a, read:true})));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Alerts</span>
        {unread > 0 && (
          <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{unread} new</span>
        )}
        <div className="flex gap-1 ml-4">
          {['','SIGNAL','GFR','REGULATORY','FORECAST','PIPELINE'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter===t ? 'bg-[#0A2540] text-white' : 'text-slate-400 border border-slate-200'
              }`}>{t || 'All'}</button>
          ))}
        </div>
        <button onClick={markAllRead} className="ml-auto text-xs text-blue-600 font-semibold hover:underline">
          Mark all read
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-5 space-y-2">
        {filtered.map(alert => {
          const style = TYPE_STYLES[alert.type];
          return (
            <div key={alert.id} onClick={() => setAlerts(prev => prev.map(a => a.id===alert.id ? {...a,read:true} : a))}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
                !alert.read ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100'
              }`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${style.bg}`}>
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${style.bg} ${style.text}`}>{alert.type}</span>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[alert.priority]}`}/>
                    <span className="text-xs text-slate-400 font-semibold">{alert.priority}</span>
                    {!alert.read && <span className="w-2 h-2 bg-blue-500 rounded-full ml-auto flex-shrink-0"/>}
                    <span className="text-xs text-slate-400 ml-auto">{alert.time}</span>
                  </div>
                  <div className={`font-bold text-sm mb-0.5 ${!alert.read ? 'text-[#0A2540]' : 'text-slate-600'}`}>
                    {alert.title}
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">{alert.desc}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
