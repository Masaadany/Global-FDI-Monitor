'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BentoDashboard      from '@/components/BentoDashboard';
import GlobeMap            from '@/components/GlobeMap';
import LiveTicker          from '@/components/LiveTicker';
import { fetchWithAuth }   from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function DashboardPage() {
  const [signals,  setSignals]  = useState<any[]>([]);
  const [stats,    setStats]    = useState({ signals_today: 0, platinum_count: 0, fic_balance: 5 });
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetchWithAuth(`${API}/api/v1/signals?size=5`).then(r=>r.json()).catch(()=>({ data:{ signals:[] }})),
      fetchWithAuth(`${API}/api/v1/auth/trial-status`).then(r=>r.json()).catch(()=>({ data:{ fic_balance:5 }})),
    ]).then(([sig, trial]) => {
      const sigs = sig?.data?.signals || sig?.signals || [];
      setSignals(sigs.slice(0, 5));
      setStats({
        signals_today:  sigs.length,
        platinum_count: sigs.filter((s: any) => s.grade === 'PLATINUM').length,
        fic_balance:    trial?.data?.fic_balance ?? trial?.fic_balance ?? 5,
      });
      setLoading(false);
    });
  }, []);

  const GRADE_DOT: Record<string,string> = { PLATINUM:'#D97706', GOLD:'#059669', SILVER:'#2563EB', BRONZE:'#6B7280' };

  return (
    <div className="min-h-screen bg-surface">
      {/* KPI bento */}
      <div className="px-6 pt-6 max-w-screen-xl mx-auto">
        <BentoDashboard />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-4 grid md:grid-cols-3 gap-4">
        {/* Live signals feed */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-deep text-sm">Latest Signals</div>
            <Link href="/signals" className="text-xs text-primary hover:underline font-semibold">View all →</Link>
          </div>
          {loading ? (
            Array(4).fill(0).map((_,i) => (
              <div key={i} className="gfm-card p-3 h-14 animate-pulse bg-slate-50" />
            ))
          ) : signals.length > 0 ? signals.map((s: any, i: number) => (
            <div key={i} className="gfm-card p-3.5 flex items-center gap-3 hover:border-primary transition-all cursor-pointer" onClick={()=>window.location.href='/signals'}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GRADE_DOT[s.grade] || '#6B7280' }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-deep truncate">{s.company} → {s.economy}</div>
                <div className="text-xs text-slate-400">${s.capex_m}M · {s.signal_type} · SCI {s.sci_score}</div>
              </div>
              <span className="text-xs font-extrabold flex-shrink-0" style={{ color: GRADE_DOT[s.grade] || '#6B7280' }}>{s.grade}</span>
            </div>
          )) : (
            // Demo signals when API unavailable
            [
              { company:'Microsoft', economy:'UAE',       grade:'PLATINUM', capex_m:850,  sci_score:91.2, signal_type:'Greenfield' },
              { company:'CATL',      economy:'Indonesia', grade:'PLATINUM', capex_m:3200, sci_score:85.4, signal_type:'Greenfield' },
              { company:'NVIDIA',    economy:'Singapore', grade:'PLATINUM', capex_m:4400, sci_score:89.2, signal_type:'Greenfield' },
              { company:'Siemens',   economy:'Egypt',     grade:'GOLD',     capex_m:340,  sci_score:86.1, signal_type:'JV' },
              { company:'Vestas',    economy:'India',     grade:'GOLD',     capex_m:420,  sci_score:85.9, signal_type:'Greenfield' },
            ].map((s, i) => (
              <div key={i} className="gfm-card p-3.5 flex items-center gap-3 hover:border-primary transition-all cursor-pointer" onClick={()=>window.location.href='/signals'}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GRADE_DOT[s.grade] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-deep truncate">{s.company} → {s.economy}</div>
                  <div className="text-xs text-slate-400">${s.capex_m}M · {s.signal_type} · SCI {s.sci_score}</div>
                </div>
                <span className="text-xs font-extrabold flex-shrink-0" style={{ color: GRADE_DOT[s.grade] }}>{s.grade}</span>
              </div>
            ))
          )}
          <Link href="/signals" className="block gfm-btn-outline text-xs py-2.5 text-center rounded-xl mt-1">
            View all 218+ signals →
          </Link>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* FIC balance */}
          <div className="gfm-card p-5">
            <div className="font-bold text-deep text-sm mb-3">FIC Credits</div>
            <div className="text-5xl font-extrabold text-amber-600 font-mono mb-1">{stats.fic_balance}</div>
            <div className="text-xs text-slate-400 mb-4">Intelligence credits remaining</div>
            <div className="gfm-progress mb-3">
              <div className="gfm-progress-fill bg-amber-400" style={{ width: `${Math.min(100, (stats.fic_balance / 4800) * 100)}%` }} />
            </div>
            <Link href="/fic" className="block gfm-btn-primary text-xs py-2 text-center rounded-lg">Top Up Credits →</Link>
          </div>

          {/* Quick actions */}
          <div className="gfm-card p-5">
            <div className="font-bold text-deep text-sm mb-3">Quick Actions</div>
            <div className="space-y-2">
              {[
                { href:'/reports',  icon:'📋', label:'Generate Report',  sub:'From 5 FIC' },
                { href:'/gfr',      icon:'🏆', label:'GFR Rankings',     sub:'Q1 2026' },
                { href:'/pmp',      icon:'🎯', label:'Mission Planning', sub:'Company targets' },
                { href:'/forecast', icon:'🔮', label:'Forecast 2030',    sub:'AI projections' },
              ].map(a => (
                <Link key={a.href} href={a.href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200">
                  <span className="text-lg">{a.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-deep">{a.label}</div>
                    <div className="text-xs text-slate-400">{a.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
