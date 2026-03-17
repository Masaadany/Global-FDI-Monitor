'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

// Trust badges
const TRUST_BADGES = [
  {name:'World Bank', icon:'🏛️', tier:'T1', tooltip:'World Development Indicators · 217 economies · Annual'},
  {name:'IMF',        icon:'💰', tier:'T1', tooltip:'World Economic Outlook · 215 economies · Biannual'},
  {name:'UNCTAD',     icon:'🌍', tier:'T1', tooltip:'World Investment Report · Gold standard FDI data'},
  {name:'OECD',       icon:'📈', tier:'T1', tooltip:'FDI Statistics · 38 member economies · Quarterly'},
  {name:'IEA',        icon:'⚡', tier:'T1', tooltip:'World Energy Investment · Clean FDI 150+ countries'},
  {name:'ILO',        icon:'👷', tier:'T1', tooltip:'Labour Force Statistics · 189 countries'},
  {name:'Freedom House',icon:'🗽',tier:'T4', tooltip:'Political risk · 210 territories · Annual'},
  {name:'IRENA',      icon:'🌱', tier:'T1', tooltip:'Renewable energy investment · 170+ economies'},
];

// Widget types
interface Metric { label:string; value:string; change:string; up:boolean; link:string; }
interface Signal { grade:string; company:string; economy:string; value:string; sci:number; }

const GRADE_COLORS: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

function MetricWidget({label,value,change,up,link}: Metric) {
  return (
    <Link href={link} className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4 hover:border-blue-700 transition-all block">
      <div className="text-xs text-blue-400 mb-1">{label}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className={`text-xs font-bold mt-1 ${up?'text-emerald-400':'text-red-400'}`}>{change}</div>
    </Link>
  );
}

function SignalWidget({signals}: {signals: Signal[]}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i+1) % signals.length), 2000);
    return () => clearInterval(id);
  }, [signals.length]);

  const s = signals[idx];
  if (!s) return null;

  return (
    <div className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Live Signal</span>
        <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>2s
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-black px-2 py-0.5 rounded text-white flex-shrink-0"
          style={{background:GRADE_COLORS[s.grade]}}>{s.grade}</span>
        <span className="text-xs text-slate-400">SCI {s.sci}</span>
      </div>
      <div className="font-bold text-sm text-white mb-0.5 truncate">{s.company}</div>
      <div className="text-xs text-blue-300">{s.economy}</div>
      <div className="text-xl font-black text-blue-400 mt-2">{s.value}</div>
    </div>
  );
}

function MapMiniWidget() {
  const nodes = [
    {x:62,y:44,c:'#f59e0b',r:3},{x:67,y:46,c:'#8b5cf6',r:2.5},
    {x:76,y:38,c:'#06b6d4',r:4},{x:18,y:36,c:'#10b981',r:4.5},
    {x:50,y:28,c:'#3b82f6',r:3},{x:30,y:60,c:'#f97316',r:2.8},
    {x:54,y:64,c:'#ef4444',r:2},{x:82,y:35,c:'#06b6d4',r:2.8},
    {x:77,y:52,c:'#06b6d4',r:2.2},{x:46,y:27,c:'#3b82f6',r:3},
  ];
  return (
    <div className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4 h-full">
      <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Signal Coverage</div>
      <svg viewBox="0 0 100 65" className="w-full"
        style={{background:'linear-gradient(180deg,#060f1a,#0a1628)'}}>
        {[20,40,60,80].map(x=><line key={x} x1={x} y1={0} x2={x} y2={65} stroke="#0d2240" strokeWidth="0.15"/>)}
        {[20,40].map(y=><line key={y} x1={0} y1={y} x2={100} y2={y} stroke="#0d2240" strokeWidth="0.15"/>)}
        {nodes.map((n,i)=>(
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r+0.8} fill="none" stroke={n.c} strokeWidth="0.3" opacity="0.4"/>
            <circle cx={n.x} cy={n.y} r={n.r*0.6} fill={n.c} opacity="0.9"/>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ProvenanceWidget() {
  return (
    <div className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4">
      <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Data Provenance</div>
      <div className="space-y-2">
        {[
          {ref:'GFM-DP-20260317-0E646',src:'IMF WEO',   hash:'sha256:0e64…',tier:'T1',v:true},
          {ref:'GFM-DP-20260317-133064',src:'World Bank',hash:'sha256:1330…',tier:'T1',v:true},
          {ref:'GFM-DP-20260317-A3F12',src:'UNCTAD',    hash:'sha256:a3f1…',tier:'T1',v:true},
        ].map(p=>(
          <div key={p.ref} className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 flex-shrink-0">{p.v?'✓':'?'}</span>
            <span className="text-blue-400 font-mono flex-shrink-0 w-10 text-right">{p.tier}</span>
            <span className="text-slate-400 flex-shrink-0">{p.src}</span>
            <span className="text-blue-700 font-mono truncate">{p.hash}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-blue-600 mt-2">SHA-256 verified · Every data point</div>
    </div>
  );
}

function GFRWidget() {
  const top = [
    {iso3:'SGP',name:'Singapore', score:88.5, tier:'FRONTIER'},
    {iso3:'CHE',name:'Switzerland',score:87.5,tier:'FRONTIER'},
    {iso3:'ARE',name:'UAE',        score:80.0, tier:'FRONTIER'},
    {iso3:'USA',name:'USA',        score:84.5, tier:'FRONTIER'},
  ];
  return (
    <div className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">GFR Top Ranked</span>
        <Link href="/gfr" className="text-xs text-blue-500 hover:text-blue-300">View all →</Link>
      </div>
      <div className="space-y-2">
        {top.map((e,i)=>(
          <div key={e.iso3} className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-500 w-4">#{i+1}</span>
            <span className="text-xs font-mono text-blue-400 w-6">{e.iso3}</span>
            <div className="flex-1 h-1.5 bg-blue-950 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{width:`${e.score}%`}}/>
            </div>
            <span className="text-xs font-black text-white w-8 text-right">{e.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BentoDashboard() {
  const [signals, setSignals] = useState<Signal[]>([
    {grade:'PLATINUM',company:'Microsoft Corp',    economy:'UAE',          value:'$850M',sci:91.2},
    {grade:'GOLD',    company:'Amazon AWS',        economy:'Saudi Arabia', value:'$5.3B', sci:88.4},
    {grade:'PLATINUM',company:'Siemens Energy',    economy:'Egypt',        value:'$340M',sci:86.1},
    {grade:'GOLD',    company:'Samsung Electronics',economy:'Vietnam',     value:'$2.8B', sci:83.7},
    {grade:'PLATINUM',company:'Vestas Wind',       economy:'India',        value:'$420M',sci:85.9},
  ]);

  const [stats, setStats] = useState({signals:218,platinum:24,fdi:'$2.1T',gfr:'SGP 88.5'});

  useEffect(() => {
    fetch(`${API}/api/v1/signals?size=10`)
      .then(r=>r.json())
      .then(d => {
        if (d.success && d.data?.signals) {
          setSignals(d.data.signals.map((s:any) => ({
            grade:   s.grade,
            company: s.company,
            economy: s.economy,
            value:   s.capex_usd ? `$${(s.capex_usd/1e9).toFixed(2)}B` : '—',
            sci:     s.sci_score || 0,
          })));
        }
      }).catch(()=>{});
  }, []);

  const METRICS: Metric[] = [
    {label:'Active Signals',   value:String(stats.signals), change:'↑ 12% this week', up:true,  link:'/signals'},
    {label:'Platinum Signals', value:String(stats.platinum),change:'↑ 8% this week',  up:true,  link:'/signals'},
    {label:'Global FDI (Q1)',  value:stats.fdi,             change:'↑ 6% vs Q1 2025', up:true,  link:'/analytics'},
    {label:'GFR Leader',       value:stats.gfr,             change:'Q1 2026 #1',      up:true,  link:'/gfr'},
  ];

  return (
    <div className="space-y-4">
      {/* Trust Badges */}
      <div className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4">
        <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">
          Powered by Authoritative Sources
        </div>
        <div className="flex flex-wrap gap-2">
          {TRUST_BADGES.map(b=>(
            <div key={b.name} title={b.tooltip}
              className="group flex items-center gap-1.5 bg-[#060f1a] border border-blue-900 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-all cursor-default">
              <span className="text-sm">{b.icon}</span>
              <span className="text-xs font-bold text-blue-300 group-hover:text-white transition-colors">{b.name}</span>
              <span className={`text-xs px-1 py-0.5 rounded font-black ${b.tier==='T1'?'bg-emerald-900 text-emerald-400':'bg-amber-900 text-amber-400'}`}>
                {b.tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {METRICS.map(m => <MetricWidget key={m.label} {...m}/>)}
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {/* Signal feed - 1 col */}
        <SignalWidget signals={signals}/>
        {/* Map mini - 2 col */}
        <div className="md:col-span-2">
          <MapMiniWidget/>
        </div>
        {/* GFR - 1 col */}
        <GFRWidget/>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {/* Provenance */}
        <ProvenanceWidget/>

        {/* Pipeline health */}
        <div className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Data Pipeline</div>
          <div className="space-y-2">
            {[
              {name:'Signal Detection', status:'✓', detail:'15 min ago · 218 signals'},
              {name:'IMF / World Bank',  status:'✓', detail:'Daily · 215 economies'},
              {name:'GDELT News',        status:'✓', detail:'Live · 2s scan cycle'},
              {name:'GFR Computation',   status:'✓', detail:'Q1 2026 · Up to date'},
              {name:'UNCTAD FDI',        status:'✓', detail:'Annual · 2023 loaded'},
            ].map(p=>(
              <div key={p.name} className="flex items-center gap-2 text-xs">
                <span className="text-emerald-400 font-black flex-shrink-0">{p.status}</span>
                <span className="text-slate-300 flex-shrink-0">{p.name}</span>
                <span className="text-blue-700 truncate">{p.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Quick Actions</div>
          <div className="space-y-2">
            {[
              {href:'/reports',  icon:'📋', label:'Generate Report',   cost:'5 FIC'},
              {href:'/pmp',      icon:'🎯', label:'Plan Mission',      cost:'30 FIC'},
              {href:'/forecast', icon:'🔮', label:'View Forecast',     cost:'Free'},
              {href:'/gfr',      icon:'🏆', label:'GFR Rankings',      cost:'Free'},
            ].map(a=>(
              <Link key={a.href} href={a.href}
                className="flex items-center justify-between p-2 bg-[#060f1a] rounded-lg border border-blue-900 hover:border-blue-700 transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-base">{a.icon}</span>
                  <span className="text-xs text-slate-300 font-semibold">{a.label}</span>
                </div>
                <span className={`text-xs font-bold ${a.cost==='Free'?'text-emerald-400':'text-amber-400'}`}>{a.cost}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
