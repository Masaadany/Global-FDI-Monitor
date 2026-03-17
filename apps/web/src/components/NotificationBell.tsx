'use client';
import { useState, useEffect, useRef } from 'react';
import { useUnreadCount } from '@/lib/useNotifications';

interface Notification {
  id: string;
  type: 'signal' | 'report' | 'fic' | 'system';
  title: string;
  body: string;
  read: boolean;
  time: string;
  grade?: string;
}

const DEMO_NOTIFS: Notification[] = [
  { id:'n1', type:'signal',  title:'PLATINUM Signal: Microsoft → UAE', body:'$850M Cloud Region Dubai confirmed', read:false, time:'2m ago',  grade:'PLATINUM' },
  { id:'n2', type:'signal',  title:'PLATINUM Signal: CATL → Indonesia', body:'$3.2B Battery Gigafactory committed', read:false, time:'8m ago',  grade:'PLATINUM' },
  { id:'n3', type:'report',  title:'Report Ready', body:'Market Intelligence Brief — UAE ICT', read:false, time:'15m ago' },
  { id:'n4', type:'fic',     title:'FIC Balance Low', body:'You have 3 FIC remaining', read:true,  time:'1h ago' },
  { id:'n5', type:'signal',  title:'GOLD Signal: Siemens → Egypt', body:'$340M Wind JV confirmed', read:true,  time:'2h ago',  grade:'GOLD' },
];

const TYPE_ICON: Record<string,string> = { signal:'📡', report:'📋', fic:'⭐', system:'🔔' };
const GRADE_DOT: Record<string,string>  = { PLATINUM:'#D97706', GOLD:'#059669', SILVER:'#2563EB' };

export default function NotificationBell() {
  const [open,    setOpen]    = useState(false);
  const [notifs,  setNotifs]  = useState(DEMO_NOTIFS);
  const { unread: liveUnread } = useUnreadCount();
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length + Math.max(0, liveUnread - 2);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function markAllRead() {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
  }
  function markRead(id: string) {
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Notifications">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-600">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-red-500 text-white text-xs font-extrabold rounded-full flex items-center justify-center px-1 live-dot">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="font-extrabold text-deep text-sm">Notifications</span>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline font-semibold">Mark all read</button>
              )}
              <a href="/alerts" className="text-xs text-slate-400 hover:text-primary">All alerts →</a>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.map(n => (
              <button key={n.id} onClick={() => markRead(n.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 hover:bg-slate-50 transition-colors ${n.read ? 'opacity-60' : ''}`}>
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm">
                    {TYPE_ICON[n.type] || '🔔'}
                  </div>
                  {!n.read && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"/>}
                  {n.grade && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{background:GRADE_DOT[n.grade]}}/>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-deep truncate">{n.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-tight">{n.body}</div>
                  <div className="text-xs text-slate-300 mt-1">{n.time}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <a href="/alerts" className="text-xs text-primary hover:underline font-semibold">View all alerts & preferences →</a>
          </div>
        </div>
      )}
    </div>
  );
}
