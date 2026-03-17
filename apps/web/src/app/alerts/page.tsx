'use client';
import { useState, useEffect } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const STATIC_ALERTS = [
  {id:'ALT001',type:'SIGNAL',    priority:'HIGH',  read:false,created_at:'2026-03-17T09:14:00Z',
   title:'New PLATINUM Signal: Microsoft → UAE',
   body:'MSS-GFS-ARE-20260317-0001 · $850M data centre · SCI 91.2 · CONFIRMED',
   ref:'MSS-GFS-ARE-20260317-0001',action_url:'/signals'},
  {id:'ALT002',type:'REGULATORY',priority:'HIGH',  read:false,created_at:'2026-03-17T06:00:00Z',
   title:'Policy: India raises insurance FDI cap to 100%',
   body:'Regulatory change opens $8–12B M&A pipeline in life insurance sector.',
   ref:'GFM-INS-20260317-0002',action_url:'/market-insights'},
  {id:'ALT003',type:'GFR',       priority:'MEDIUM',read:true, created_at:'2026-03-17T04:00:00Z',
   title:'GFR Update: UAE +4.2 pts — largest gain on record',
   body:'Q1 2026 GFR score: 80.0 (+4.2). Digital Foundations and Sustainability lead.',
   ref:'FGR-Q1-2026-20260317-0001',action_url:'/gfr'},
  {id:'ALT004',type:'PIPELINE',  priority:'MEDIUM',read:false,created_at:'2026-03-16T18:30:00Z',
   title:'Pipeline update: Amazon AWS deal moves to NEGOTIATING',
   body:'PIPE-002 progress: Committed → Negotiating. Term sheet under review.',
   ref:'PIPE-002',action_url:'/investment-pipeline'},
  {id:'ALT005',type:'FIC',       priority:'LOW',   read:true, created_at:'2026-03-16T12:00:00Z',
   title:'FIC balance: 4 credits remaining',
   body:'You have 4 FIC credits. Buy more to continue accessing Platinum intelligence.',
   ref:null,action_url:'/fic'},
  {id:'ALT006',type:'SIGNAL',    priority:'HIGH',  read:false,created_at:'2026-03-15T14:20:00Z',
   title:'New PLATINUM Signal: Siemens Energy → Egypt',
   body:'MSS-GFS-EGY-20260317-0003 · $340M wind JV · SCI 86.1 · CONFIRMED',
   ref:'MSS-GFS-EGY-20260317-0003',action_url:'/signals'},
  {id:'ALT007',type:'WATCHLIST', priority:'MEDIUM',read:true, created_at:'2026-03-15T08:00:00Z',
   title:'Watchlist: MENA Tech — 3 new signals this week',
   body:'Your MENA Technology watchlist has 3 new Gold+ signals since Friday.',
   ref:null,action_url:'/watchlists'},
  {id:'ALT008',type:'REPORT',    priority:'LOW',   read:true, created_at:'2026-03-14T16:00:00Z',
   title:'Report ready: UAE Country Economic Profile',
   body:'FCR-CEGP-ARE-20260314-143022-0001 is ready for download.',
   ref:'FCR-CEGP-ARE-20260314-143022-0001',action_url:'/reports'},
];

const TYPE_ICONS: Record<string,string> = {SIGNAL:'📡',REGULATORY:'📜',GFR:'🏆',PIPELINE:'💼',FIC:'⭐',WATCHLIST:'👁',REPORT:'📋'};
const PRIORITY_STYLES: Record<string,string> = {
  HIGH:  'border-l-4 border-l-red-400',
  MEDIUM:'border-l-4 border-l-amber-400',
  LOW:   'border-l-4 border-l-blue-300',
};

export default function AlertsPage() {
  const [alerts,  setAlerts]  = useState(STATIC_ALERTS);
  const [filter,  setFilter]  = useState<'all'|'unread'|'SIGNAL'|'REGULATORY'|'GFR'>('all');
  const { signals: liveSignals, connected } = useRealTimeSignals(5);

  // Convert live signals to alerts
  useEffect(() => {
    if (liveSignals.length === 0) return;
    const newest = liveSignals[0];
    if (!newest) return;
    const newAlert = {
      id: `live-${newest.reference_code}`,
      type: 'SIGNAL',
      priority: newest.grade === 'PLATINUM' ? 'HIGH' : 'MEDIUM',
      read: false,
      created_at: newest.timestamp,
      title: `New ${newest.grade}: ${newest.company} → ${newest.economy}`,
      body: `${newest.reference_code} · $${newest.capex_m}M · SCI ${newest.sci_score}`,
      ref: newest.reference_code,
      action_url: '/signals',
    };
    setAlerts(prev => {
      if (prev.find(a => a.id === newAlert.id)) return prev;
      return [newAlert, ...prev];
    });
  }, [liveSignals]);

  async function markRead(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? {...a, read:true} : a));
    try { await fetchWithAuth(`/api/v1/alerts/${id}/read`,{method:'POST'}); } catch {}
  }
  function markAllRead() {
    setAlerts(prev => prev.map(a => ({...a, read:true})));
  }

  const shown = alerts.filter(a =>
    filter === 'all'    ? true :
    filter === 'unread' ? !a.read :
    a.type === filter
  );
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Alerts</span>
        {unreadCount > 0 && (
          <span className="text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
        )}
        <div className="flex gap-1 ml-3 flex-wrap">
          {(['all','unread','SIGNAL','REGULATORY','GFR'] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${filter===f?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs font-bold ${connected?'text-emerald-600':'text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-300'}`}/>
            {connected?'Live':'Offline'}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-blue-600 font-bold hover:underline">Mark all read</button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-5 space-y-2">
        {shown.map(a => (
          <div key={a.id} onClick={() => markRead(a.id)}
            className={`bg-white rounded-xl border border-slate-100 p-4 cursor-pointer transition-all hover:shadow-sm ${PRIORITY_STYLES[a.priority]} ${!a.read?'':'opacity-70'}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{TYPE_ICONS[a.type]||'🔔'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-black text-[#0A2540]">{a.title}</span>
                  {!a.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"/>}
                </div>
                <p className="text-xs text-slate-500">{a.body}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-slate-300">{new Date(a.created_at).toLocaleString()}</span>
                  {a.ref && <span className="text-xs font-mono text-slate-300 truncate">{a.ref}</span>}
                  {a.action_url && (
                    <a href={a.action_url} onClick={e=>e.stopPropagation()}
                      className="text-xs text-blue-600 font-bold hover:underline ml-auto">View →</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🔔</div>
            <div className="text-sm font-semibold">No alerts match the filter</div>
          </div>
        )}
      </div>
    </div>
  );
}
