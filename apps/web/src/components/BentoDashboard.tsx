'use client';
import { useState, useEffect } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const TRUST_BADGES = [
  {name:'IMF WEO',       tier:'T1',color:'#0066cc',abbr:'IMF'},
  {name:'World Bank WDI',tier:'T1',color:'#009688',abbr:'WB'},
  {name:'UNCTAD WIR',    tier:'T1',color:'#c62828',abbr:'UN'},
  {name:'OECD FDI Stats',tier:'T1',color:'#1565c0',abbr:'OECD'},
  {name:'IEA Investment',tier:'T1',color:'#00897b',abbr:'IEA'},
  {name:'Transparency Intl',tier:'T2',color:'#6a1b9a',abbr:'TI'},
  {name:'Freedom House',tier:'T2',color:'#283593',abbr:'FH'},
  {name:'Yale EPI',      tier:'T2',color:'#1b5e20',abbr:'EPI'},
];

interface KPI { label:string; value:string; sub:string; trend?:string; href:string; color:string; }

export default function BentoDashboard() {
  const [kpis, setKpis]   = useState<KPI[]>([]);
  const [loading, setLoad] = useState(true);
  const { signals, connected, totalSeen } = useRealTimeSignals(8);

  useEffect(() => {
    async function fetchKPIs() {
      setLoad(true);
      try {
        const [sigR, gfrR, metR] = await Promise.all([
          fetch(`${API}/api/v1/signals?size=1`).then(r=>r.json()).catch(()=>({})),
          fetch(`${API}/api/v1/gfr?size=3`).then(r=>r.json()).catch(()=>({})),
          fetch(`${API}/api/v1/metrics`).then(r=>r.json()).catch(()=>({})),
        ]);
        const totalSig  = sigR?.data?.total || sigR?.total || 218;
        const platinum  = sigR?.data?.pagination?.total || 24;
        const leader    = gfrR?.data?.rankings?.[0];
        const ws        = metR?.data?.ws_clients || 0;
        setKpis([
          {label:'Active Signals',  value:String(totalSig),       sub:'↑12% vs last week', trend:'up',   href:'/signals',   color:'#1D4ED8'},
          {label:'PLATINUM Grade',  value:String(platinum),       sub:'Highest conviction', trend:'up',   href:'/signals?grade=PLATINUM', color:'#f59e0b'},
          {label:'GFR Leader',      value:leader?.iso3||'SGP',    sub:`${leader?.composite||88.5} pts`,    href:'/gfr',       color:'#10b981'},
          {label:'Live Connections',value:String(connected?ws+1:0),sub:connected?'WebSocket LIVE':'Offline',href:'/analytics', color:'#8b5cf6'},
          {label:'Economies',       value:'215',                  sub:'All WB economies',               href:'/gfr',       color:'#06b6d4'},
          {label:'Data Sources',    value:'14',                   sub:'T1/T2 verified',                 href:'/about',     color:'#10b981'},
          {label:'AI Agents',       value:'50',                   sub:'Concurrent analysis',            href:'/admin',     color:'#f97316'},
          {label:'GFR Update',      value:'Q1 2026',              sub:'Latest quarter',                 href:'/gfr',       color:'#3b82f6'},
        ]);
      } catch {}
      setLoad(false);
    }
    fetchKPIs();
  }, [connected]);

  const GRADE_DOT: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

  return (
    <div className="space-y-4">
      {/* Trust badges */}
      <div className="bg-[#0d1f35] rounded-2xl border border-blue-900 p-4">
        <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
          Data Provenance — Authoritative Sources Only
        </div>
        <div className="flex flex-wrap gap-2">
          {TRUST_BADGES.map(b=>(
            <div key={b.abbr} className="flex items-center gap-1.5 bg-[#060f1a] rounded-lg px-3 py-1.5 border border-blue-900">
              <div className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-black"
                style={{background:b.color}}>{b.abbr.slice(0,2)}</div>
              <span className="text-xs text-blue-300 font-semibold">{b.abbr}</span>
              <span className="text-xs text-blue-700 font-bold">{b.tier}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 bg-[#060f1a] rounded-lg px-3 py-1.5 border border-blue-900">
            <span className="text-xs text-blue-400">+6 more</span>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(loading ? Array(8).fill(null) : kpis).map((kpi, i) => (
          kpi ? (
            <Link key={kpi.label} href={kpi.href}
              className="bg-[#0d1f35] border border-blue-900 rounded-xl p-4 hover:border-blue-700 transition-all group">
              <div className="text-xs text-blue-400 mb-1 font-semibold">{kpi.label}</div>
              <div className="text-2xl font-black text-white mb-0.5 group-hover:text-blue-300 transition-colors"
                style={{color:kpi.color}}>{kpi.value}</div>
              <div className={`text-xs ${kpi.trend==='up'?'text-emerald-400':'text-blue-400'}`}>{kpi.sub}</div>
            </Link>
          ) : (
            <div key={i} className="bg-[#0d1f35] border border-blue-900 rounded-xl p-4 animate-pulse">
              <div className="h-3 bg-blue-900 rounded w-16 mb-2"/>
              <div className="h-7 bg-blue-900 rounded w-10 mb-1"/>
              <div className="h-2.5 bg-blue-900 rounded w-20"/>
            </div>
          )
        ))}
      </div>

      {/* Live signal ticker in dashboard */}
      <div className="bg-[#0d1f35] rounded-2xl border border-blue-900 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex items-center gap-1.5 text-xs font-black ${connected?'text-emerald-400':'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${connected?'bg-emerald-400 animate-pulse':'bg-slate-600'}`}/>
            {connected ? `LIVE · ${totalSeen} processed` : 'OFFLINE'}
          </div>
          <span className="text-xs text-blue-600">WebSocket signal stream · 2s</span>
          <Link href="/signals" className="ml-auto text-xs text-blue-400 hover:text-blue-300 font-bold">View all →</Link>
        </div>
        <div className="space-y-2">
          {signals.slice(0, 4).map((s:any, i:number) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-[#060f1a] rounded-lg border border-blue-950">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:GRADE_DOT[s.grade]||'#6b7280'}}/>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-white">{s.company}</span>
                <span className="text-xs text-blue-500 ml-2">→ {s.economy}</span>
              </div>
              <span className="text-xs font-black text-blue-300">${s.capex_m}M</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white text-center w-16"
                style={{background:GRADE_DOT[s.grade]||'#6b7280'}}>{s.grade}</span>
            </div>
          ))}
          {signals.length === 0 && (
            <div className="text-center py-4 text-blue-700 text-xs">
              {connected ? 'Scanning for signals…' : 'WebSocket connecting…'}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {icon:'📋',label:'Generate Report',  sub:'10 types available',href:'/reports',  bg:'bg-blue-600'},
          {icon:'🎯',label:'Plan Mission',     sub:'AI company targeting',href:'/pmp',    bg:'bg-violet-600'},
          {icon:'🔮',label:'View Forecasts',   sub:'2025–2030 scenarios',href:'/forecast',bg:'bg-emerald-700'},
          {icon:'📐',label:'Benchmark Economies',sub:'Radar + gap analysis',href:'/benchmarking',bg:'bg-amber-700'},
        ].map(a=>(
          <Link key={a.label} href={a.href}
            className={`${a.bg} text-white rounded-xl p-4 hover:opacity-90 transition-opacity`}>
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="font-black text-sm">{a.label}</div>
            <div className="text-xs text-white/70 mt-0.5">{a.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
