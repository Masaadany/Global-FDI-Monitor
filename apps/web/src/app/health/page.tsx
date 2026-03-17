'use client';
import { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL||'';
export default function HealthPage() {
  const [data,setData]=useState<any>(null);
  const [t,setT]=useState(Date.now());
  useEffect(()=>{
    fetch(`${API}/api/v1/health`).then(r=>r.json()).then(setData).catch(()=>setData({status:'error'}));
  },[t]);
  const ok = data?.status==='ok';
  return(
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="gfm-card p-8 max-w-sm w-full text-center">
        <div className={`text-5xl mb-4`}>{!data?'⏳':ok?'✅':'❌'}</div>
        <h1 className="text-2xl font-extrabold text-deep mb-1">System Health</h1>
        <p className="text-slate-400 text-sm mb-5">Global FDI Monitor API Status</p>
        {data && (
          <div className="space-y-2 text-left mb-5">
            {[['API',ok?'Operational':'Degraded'],['Version',data.version||'3.0.0'],['DB',data.db?'Connected':'Disconnected'],['WS',data.ws?'Active':'Offline'],['Uptime',data.uptime_s?`${Math.floor(data.uptime_s/3600)}h ${Math.floor((data.uptime_s%3600)/60)}m`:'—']].map(([k,v])=>(
              <div key={String(k)} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{k}</span>
                <span className={`text-xs font-semibold ${v==='Operational'||v==='Connected'||v==='Active'?'text-emerald-600':'text-slate-600'}`}>{v as string}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={()=>setT(Date.now())} className="gfm-btn-outline text-xs py-2 px-4 w-full">Refresh</button>
        <p className="text-xs text-slate-300 mt-3 font-mono">{new Date().toISOString()}</p>
      </div>
    </div>
  );
}
