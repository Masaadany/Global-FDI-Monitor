'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function BentoDashboard() {
  const [stats, setStats] = useState({ signals:218, platinum:22, gfr_rank1:'Singapore', capex_bn:806, active_eco:47 });

  useEffect(() => {
    fetchWithAuth(`${API}/api/v1/analytics`).then(r=>r.json())
      .then(d=>{ if(d.data?.kpis) setStats(s=>({...s,...d.data.kpis})); }).catch(()=>{});
  }, []);

  return (
    <div role="region" aria-label="Intelligence dashboard" className="grid grid-cols-2 md:grid-cols-4 gap-3 p-1">
      {/* Large tile: Total Signals */}
      <div className="col-span-2 gfm-card p-5 flex flex-col justify-between" style={{minHeight:140}}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-extrabold uppercase tracking-widest" style={{color:'#696969'}}>Global FDI Signals</div>
          <span className="live-dot"/>
        </div>
        <div className="text-5xl font-extrabold font-data" style={{color:'#74BB65'}}>{stats.signals}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full" style={{background:'rgba(10,61,98,0.15)',color:'#0A3D62'}}>
            {stats.platinum} PLATINUM
          </span>
          <span className="text-xs" style={{color:'#696969'}}>this quarter</span>
        </div>
      </div>

      {/* GFR #1 */}
      <div className="gfm-card p-4 flex flex-col justify-between" style={{minHeight:140}}>
        <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#696969'}}>GFR #1</div>
        <div className="text-2xl font-extrabold" style={{color:'#0A3D62'}}>🇸🇬 {stats.gfr_rank1}</div>
        <div className="text-3xl font-extrabold font-data mt-1" style={{color:'#0A3D62'}}>88.5</div>
        <Link href="/gfr" className="text-xs font-bold mt-2" style={{color:'#74BB65'}}>View all rankings →</Link>
      </div>

      {/* CapEx pipeline */}
      <div className="gfm-card p-4 flex flex-col justify-between" style={{minHeight:140}}>
        <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#696969'}}>CapEx Pipeline</div>
        <div className="text-3xl font-extrabold font-data" style={{color:'#74BB65'}}>${stats.capex_bn}B</div>
        <div className="text-xs mt-1" style={{color:'#696969'}}>Q1 2026 YTD</div>
        <div className="gfm-progress mt-2"><div className="gfm-progress-bar" style={{width:'68%'}}/></div>
      </div>

      {/* Active economies */}
      <div className="gfm-card p-4" style={{minHeight:100}}>
        <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#696969'}}>Active Economies</div>
        <div className="text-3xl font-extrabold font-data" style={{color:'#696969'}}>{stats.active_eco}</div>
        <div className="text-xs mt-1" style={{color:'#696969'}}>of 215 total</div>
      </div>

      {/* Quick actions */}
      <div className="gfm-card p-4" style={{minHeight:100}}>
        <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#696969'}}>Quick Actions</div>
        <div className="space-y-1.5">
          {[['🎯','Mission Plan','/pmp'],['📋','Report','/reports'],['📡','Signals','/signals']].map(([i,l,h])=>(
            <Link key={String(l)} href={h as string} className="flex items-center gap-2 text-xs hover:text-bright transition-colors" style={{color:'#696969'}}>
              <span>{i}</span><span>{l}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Foresight 2050 */}
      <div className="col-span-2 gfm-card p-4 flex flex-col justify-between" style={{minHeight:100}}>
        <div className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{color:'#696969'}}>Foresight 2050</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-data" style={{color:'#74BB65'}}>$9.2T</span>
          <span className="text-sm" style={{color:'#696969'}}>Global FDI · Base Case</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-4 text-xs">
            <span style={{color:'#22c55e'}}>Optimistic: $10.8T</span>
            <span style={{color:'#EF4444'}}>Stress: $6.8T</span>
          </div>
          <Link href="/forecast" className="text-xs font-bold" style={{color:'#74BB65'}}>Explore →</Link>
        </div>
      </div>
    </div>
  );
}
