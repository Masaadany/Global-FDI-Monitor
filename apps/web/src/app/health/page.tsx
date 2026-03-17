'use client';
import { useState, useEffect } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || '';

type Status = { status:string; db:boolean; redis:boolean; ws:number; uptime_s:number; version:string; signals_broadcast:number; gfr_economies:number; latency_ms:number; };

export default function HealthPage() {
  const [data, setData] = useState<Status|null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/v1/health`).then(r=>r.json()).then(d=>setData(d.data||d)).catch(()=>setError(true));
    const t = setInterval(()=>{
      fetch(`${API}/api/v1/health`).then(r=>r.json()).then(d=>setData(d.data||d)).catch(()=>{});
    }, 5000);
    return ()=>clearInterval(t);
  }, []);

  function fmt(s:number){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h>0?`${h}h ${m}m`:`${m}m`;}

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-3 h-3 rounded-full ${!error&&data?.status==='ok'?'bg-emerald-400 live-dot':'bg-red-400'}`}/>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest">Platform Status</div>
          </div>
          <h1 className="text-3xl font-extrabold">System Health</h1>
          <p className="text-white/60 mt-1 text-sm">Live infrastructure status · Refreshes every 5s</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {error ? (
          <div className="gfm-card p-8 text-center">
            <div className="text-red-500 text-4xl mb-3">⚠️</div>
            <div className="font-bold text-deep">API unreachable — check network or Azure deployment</div>
          </div>
        ) : !data ? (
          <div className="gfm-card p-8 text-center text-slate-400">Checking status…</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {l:'API',v:data.status==='ok'?'✓ Online':'✗ Degraded',ok:data.status==='ok',icon:'🌐'},
                {l:'Database',v:data.db?'✓ Connected':'✗ Offline',ok:data.db,icon:'🗄️'},
                {l:'Redis Cache',v:data.redis?'✓ Connected':'✗ Offline',ok:data.redis,icon:'⚡'},
                {l:'WebSocket',v:`${data.ws} clients`,ok:true,icon:'📡'},
              ].map(s=>(
                <div key={s.l} className={`gfm-card p-4 text-center ${s.ok?'border-emerald-200 bg-emerald-50':'border-red-200 bg-red-50'}`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`font-extrabold text-sm ${s.ok?'text-emerald-700':'text-red-600'}`}>{s.v}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="gfm-card p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ['Version',data.version||'—'],
                ['Uptime',data.uptime_s?fmt(data.uptime_s):'—'],
                ['Latency',`${data.latency_ms||'—'}ms`],
                ['GFR Economies',String(data.gfr_economies||215)],
              ].map(([l,v])=>(
                <div key={String(l)}>
                  <div className="text-xs text-slate-400 mb-0.5">{l}</div>
                  <div className="font-extrabold text-deep font-mono">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-slate-400 text-center mt-6">Status: <a href="https://api.fdimonitor.org/api/v1/health" className="text-primary hover:underline">api.fdimonitor.org/api/v1/health</a></p>
      </div>
    </div>
  );
}
