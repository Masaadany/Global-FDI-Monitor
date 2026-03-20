'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const DEMO_ALERTS = [
  { id:1, type:'SIGNAL', priority:'HIGH',   title:'New PLATINUM: Microsoft UAE +$850M',         read:false, ts:'2m ago'  },
  { id:2, type:'GFR',    priority:'MEDIUM', title:'UAE GFR upgraded to 80.0 (+4.2)',             read:false, ts:'1h ago'  },
  { id:3, type:'SIGNAL', priority:'HIGH',   title:'New PLATINUM: CATL Indonesia $3.2B',          read:true,  ts:'3h ago'  },
  { id:4, type:'POLICY', priority:'LOW',    title:'Saudi Arabia: New FDI incentive framework',   read:true,  ts:'1d ago'  },
  { id:5, type:'REPORT', priority:'MEDIUM', title:'Report ready: UAE MIB Q1 2026',               read:true,  ts:'2d ago'  },
];

const PRIO_COLORS: Record<string,string> = { HIGH:'#EF4444', MEDIUM:'#74BB65', LOW:'#696969' };
const TYPE_ICONS:  Record<string,string>  = { SIGNAL:'📡', GFR:'🏆', POLICY:'⚖️', REPORT:'📋' };

export default function NotificationBell() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [open,   setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = alerts.filter(a=>!a.read).length;

  useEffect(() => {
    fetchWithAuth(`${API}/api/v1/alerts?limit=5`).then(r=>r.json())
      .then(d=>{ const a=d.data?.alerts||d.alerts; if(a?.length) setAlerts(a); }).catch(()=>{});
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function markRead(id: number) {
    setAlerts(prev=>prev.map(a=>a.id===id?{...a,read:true}:a));
    fetchWithAuth(`${API}/api/v1/alerts/${id}/read`,{method:'PUT'}).catch(()=>{});
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={()=>setOpen(p=>!p)}
        className="relative p-2 rounded-xl hover:bg-white/5 transition-all"
        aria-label={`${unread} unread alerts`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#696969" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs font-extrabold flex items-center justify-center"
                style={{background:'#74BB65',color:'#fff',fontSize:9}}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50 glass rounded-2xl shadow-glow-orange overflow-hidden"
             style={{border:'1px solid rgba(10,61,98,0.2)'}}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderBottomColor:'rgba(10,61,98,0.1)'}}>
            <span className="font-extrabold text-sm" style={{color:'#0A3D62'}}>Notifications</span>
            {unread > 0 && (
              <button onClick={()=>setAlerts(p=>p.map(a=>({...a,read:true})))}
                className="text-xs" style={{color:'#74BB65'}}>Mark all read</button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {alerts.slice(0,5).map(alert=>(
              <div key={alert.id} onClick={()=>markRead(alert.id)}
                className={`px-4 py-3 border-b cursor-pointer hover:bg-white/3 transition-all ${!alert.read?'border-l-2':''}`}
                style={{borderColor:'rgba(10,61,98,0.08)',...(!alert.read?{borderLeftColor:PRIO_COLORS[alert.priority]}:{})}}>
                <div className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0">{TYPE_ICONS[alert.type]||'🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{color: alert.read ? '#696969' : '#0A3D62'}}>{alert.title}</div>
                    <div className="text-xs mt-0.5" style={{color:'#696969'}}>{alert.ts}</div>
                  </div>
                  {!alert.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{background:'#74BB65'}}/>}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 text-center border-t" style={{borderTopColor:'rgba(10,61,98,0.08)'}}>
            <Link href="/alerts" onClick={()=>setOpen(false)} className="text-xs font-bold" style={{color:'#74BB65'}}>
              View all alerts →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
