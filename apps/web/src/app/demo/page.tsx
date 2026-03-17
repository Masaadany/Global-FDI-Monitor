'use client';
import { useState, useEffect } from 'react';
import { useRealTimeSignals } from '@/lib/useRealTimeSignals';
import Link from 'next/link';

const GRADE_DOT: Record<string,string> = {PLATINUM:'#D97706',GOLD:'#059669',SILVER:'#2563EB',BRONZE:'#6B7280'};
const GRADE_ORDER = ['PLATINUM','GOLD','SILVER','BRONZE'];

// Mini sparkline
function Spark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data)*0.9;
  const pts = data.map((v,i) => `${i*16},${20 - (v-min)/(max-min)*18}`).join(' ');
  return <svg viewBox={`0 ${0} ${(data.length-1)*16} 20`} className="w-16 h-5"><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"/></svg>;
}

export default function DemoPage() {
  const { signals, connected } = useRealTimeSignals(8);
  const [tab, setTab] = useState<'signals'|'gfr'|'map'>('signals');
  const [gfr] = useState([
    {rank:1,iso:'SGP',name:'Singapore',    score:88.5,tier:'FRONTIER',delta:+0.2,spark:[86,87,87.8,88,88.5]},
    {rank:2,iso:'CHE',name:'Switzerland',  score:87.5,tier:'FRONTIER',delta:+0.1,spark:[86.5,87,87.2,87.4,87.5]},
    {rank:3,iso:'USA',name:'United States',score:84.5,tier:'FRONTIER',delta:-0.3,spark:[85,84.8,84.6,84.4,84.5]},
    {rank:6,iso:'ARE',name:'UAE',          score:80.0,tier:'FRONTIER',delta:+4.2,spark:[74,75.5,77,79,80.0]},
    {rank:10,iso:'SAU',name:'Saudi Arabia',score:68.1,tier:'HIGH',    delta:+1.8,spark:[64,65,66.2,67,68.1]},
    {rank:12,iso:'SGP',name:'India',       score:62.3,tier:'MEDIUM',  delta:+0.9,spark:[60,60.8,61.2,61.8,62.3]},
  ]);

  const gradeCounts = GRADE_ORDER.reduce((acc, g) => ({...acc, [g]: signals.filter((s:any) => s.grade===g).length}), {} as Record<string,number>);

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-2 h-2 rounded-full ${connected?'bg-emerald-400 live-dot':'bg-slate-500'}`}/>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest">{connected ? 'Live Connected' : 'Demo Mode'}</div>
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Live Platform Demo</h1>
          <p className="text-white/70">Real signals, real rankings. No login required — start free trial for full access.</p>
          <div className="flex gap-6 mt-5">
            {[
              [String(signals.length),'Live signals', '#34D399'],
              [String(gradeCounts.PLATINUM||'2'),'PLATINUM', '#D97706'],
              ['215','Economies','#60A5FA'],
              ['47','API routes', '#A78BFA'],
            ].map(([v,l,c])=>(
              <div key={l}><div className="text-2xl font-extrabold font-mono" style={{color:c}}>{v}</div><div className="text-white/40 text-xs">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-screen-xl mx-auto flex gap-0">
          {[['signals','📡 Live Signals'],['gfr','🏆 GFR Rankings'],['map','🌍 World Map']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        {tab === 'signals' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {GRADE_ORDER.map(g => (
                  <div key={g} className="flex items-center gap-1.5 text-xs font-semibold">
                    <div className="w-2 h-2 rounded-full" style={{background:GRADE_DOT[g]}}/>
                    <span className="text-slate-500">{g}</span>
                    <span className="font-extrabold" style={{color:GRADE_DOT[g]}}>{gradeCounts[g]||0}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" className="gfm-btn-primary text-xs py-2 px-4">Unlock All Signals →</Link>
            </div>
            <div className="space-y-2">
              {signals.slice(0,6).map((s:any, i:number) => (
                <div key={s.reference_code||i} className="gfm-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:GRADE_DOT[s.grade]||'#6B7280'}}/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-deep">{s.company}</span>
                        <span className="text-slate-400 text-xs">→</span>
                        <a href={`/country/${s.iso3}`} className="text-xs font-semibold text-primary hover:underline">{s.economy}</a>
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{background:GRADE_DOT[s.grade]}}>{s.grade}</span>
                      </div>
                      <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                        <span>${s.capex_m}M</span>
                        <span>{s.signal_type}</span>
                        <span>SCI {s.sci_score}</span>
                        <span className="font-mono text-slate-300">{s.reference_code}</span>
                      </div>
                    </div>
                    {s.provenance?.verified && <span className="text-xs text-emerald-600 font-bold flex-shrink-0">✓ Verified</span>}
                  </div>
                </div>
              ))}
              <div className="gfm-card p-4 text-center border-dashed">
                <p className="text-sm text-slate-400 mb-3">Start free trial to access all 218+ signals, filtering, and export</p>
                <Link href="/register" className="gfm-btn-primary text-sm px-6 py-2.5">Start Free Trial — 5 FIC</Link>
              </div>
            </div>
          </div>
        )}

        {tab === 'gfr' && (
          <div className="gfm-card overflow-hidden">
            <table className="w-full gfm-table">
              <thead><tr><th>Rank</th><th>Economy</th><th>GFR Score</th><th>Tier</th><th>Δ Q1</th><th>Trend</th></tr></thead>
              <tbody>
                {gfr.map(e => (
                  <tr key={e.iso}>
                    <td className="font-extrabold text-slate-300 font-mono">#{e.rank}</td>
                    <td>
                      <a href={`/country/${e.iso}`} className="font-bold text-deep hover:text-primary text-sm">{e.name}</a>
                      <div className="text-xs text-slate-400 font-mono">{e.iso}</div>
                    </td>
                    <td><span className="font-extrabold font-mono text-primary text-xl">{e.score}</span></td>
                    <td><span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${e.tier==='FRONTIER'?'bg-violet-600':e.tier==='HIGH'?'bg-primary':'bg-slate-500'}`}>{e.tier}</span></td>
                    <td className={`font-bold text-sm ${e.delta>0?'text-emerald-600':'text-red-500'}`}>{e.delta>0?'+':''}{e.delta}</td>
                    <td><Spark data={e.spark} color={e.delta>0?'#059669':'#EF4444'}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-slate-50 text-center">
              <Link href="/gfr" className="gfm-btn-primary text-sm px-6 py-2.5">View All 215 Rankings →</Link>
            </div>
          </div>
        )}

        {tab === 'map' && (
          <div className="gfm-card p-8 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="font-extrabold text-deep text-xl mb-2">Interactive World Map</h3>
            <p className="text-slate-500 text-sm mb-5">Full platform includes a real-time FDI world map with signal overlays, country detail drill-down, and corridor animation.</p>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-5">
              {[['24','Active economies'],['218+','Live signals'],['8','Hot corridors']].map(([v,l])=>(
                <div key={l} className="gfm-card p-3 text-center">
                  <div className="font-extrabold text-primary font-mono text-lg">{v}</div>
                  <div className="text-xs text-slate-400">{l}</div>
                </div>
              ))}
            </div>
            <Link href="/register" className="gfm-btn-primary text-sm px-8 py-3">Access Full Map →</Link>
          </div>
        )}

        {/* CTA Bar */}
        <div className="mt-6 gfm-card p-5 bg-deep text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-extrabold text-white">Ready to go beyond the demo?</div>
            <div className="text-white/60 text-sm">Professional plan from $799/month · 3-day free trial · 5 FIC credits</div>
          </div>
          <div className="flex gap-3">
            <Link href="/register" className="bg-white text-deep font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-slate-100 transition-all">Start Free Trial</Link>
            <Link href="/pricing"  className="border border-white/40 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:border-white transition-all">View Pricing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
