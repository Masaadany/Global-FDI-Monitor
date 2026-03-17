'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';

export default function NotificationBell() {
  const [open, setOpen]   = useState(false);
  const [readCount, setRead] = useState(0);
  const { signals, connected } = useRealTimeSignals(10);

  const unread = Math.max(0, signals.filter(s=>s.grade==='PLATINUM').length - readCount);

  function markRead() { setRead(signals.filter(s=>s.grade==='PLATINUM').length); setOpen(false); }

  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors">
        <span className="text-slate-500 text-lg">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-72 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="font-black text-sm text-[#0A2540]">Notifications</div>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-300'}`}/>
              <button onClick={markRead} className="text-xs text-blue-600 font-bold hover:underline">Mark all read</button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {signals.slice(0,6).map((s:any,i:number)=>(
              <Link key={i} href="/signals" onClick={()=>setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50">
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                  style={{background:s.grade==='PLATINUM'?'#f59e0b':s.grade==='GOLD'?'#10b981':'#3b82f6'}}/>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#0A2540] truncate">{s.grade}: {s.company}</div>
                  <div className="text-xs text-slate-400">{s.economy} · ${s.capex_m}M</div>
                </div>
                {i < unread && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"/>}
              </Link>
            ))}
            {signals.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-sm">
                {connected?'No new notifications':'Connecting…'}
              </div>
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
            <Link href="/alerts" onClick={()=>setOpen(false)}
              className="block text-center text-xs text-blue-600 font-bold hover:underline">
              View all alerts →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
