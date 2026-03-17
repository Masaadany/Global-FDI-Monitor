'use client';
import { useState } from 'react';

const REGIONS = [
  {id:'EAP',  name:'East Asia & Pacific',     total:546,yoy:12.4,top:'CHN $163B',color:'#0A66C2'},
  {id:'NAM',  name:'North America',           total:333,yoy:8.2, top:'USA $285B',color:'#059669'},
  {id:'ECA',  name:'Europe & Central Asia',   total:312,yoy:5.6, top:'IRL $94B', color:'#7C3AED'},
  {id:'LAC',  name:'Latin America & Carib.',  total:142,yoy:7.8, top:'BRA $65B', color:'#F97316'},
  {id:'MENA', name:'Middle East & N. Africa', total:88, yoy:14.2,top:'ARE $31B', color:'#D97706'},
  {id:'SAS',  name:'South Asia',              total:74, yoy:11.8,top:'IND $71B', color:'#06B6D4'},
  {id:'SSA',  name:'Sub-Saharan Africa',      total:28, yoy:6.4, top:'NGA $4B',  color:'#EF4444'},
];

const SECTOR_HEAT = [
  {s:'Technology',EAP:92,NAM:88,ECA:72,MENA:74,SAS:58,LAC:44,SSA:28},
  {s:'Energy',    EAP:68,NAM:74,ECA:76,MENA:92,SAS:64,LAC:72,SSA:54},
  {s:'Finance',   EAP:82,NAM:94,ECA:84,MENA:70,SAS:56,LAC:62,SSA:36},
  {s:'Mfg',       EAP:88,NAM:62,ECA:74,MENA:52,SAS:72,LAC:68,SSA:44},
  {s:'Mining',    EAP:48,NAM:68,ECA:54,MENA:44,SAS:38,LAC:82,SSA:88},
  {s:'Logistics', EAP:76,NAM:72,ECA:68,MENA:84,SAS:58,LAC:54,SSA:38},
];

function HeatCell({val}:{val:number}) {
  const opacity = val / 100;
  return (
    <td className="p-0">
      <div className="w-full h-10 flex items-center justify-center text-xs font-bold transition-all hover:scale-105 cursor-default"
        style={{background:`rgba(10,102,194,${opacity})`, color: val > 60 ? 'white' : val > 40 ? '#0A2540' : '#64748B'}}>
        {val}
      </div>
    </td>
  );
}

export default function InvestmentHeatmap() {
  const [view, setView] = useState<'regional'|'sector'>('regional');
  const total = REGIONS.reduce((s,r)=>s+r.total,0);

  return (
    <div className="gfm-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div>
          <div className="font-extrabold text-sm text-deep">FDI Investment Heatmap</div>
          <div className="text-xs text-slate-400 mt-0.5">2025 · ${total}B global total · 7 regions × 6 sectors</div>
        </div>
        <div className="flex gap-1">
          {[['regional','By Region'],['sector','Sector × Region']].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${view===v?'bg-primary text-white':'border border-slate-200 text-slate-500 hover:border-primary'}`}>{l}</button>
          ))}
        </div>
      </div>

      {view==='regional' && (
        <div className="p-5">
          <div className="space-y-2.5">
            {REGIONS.map(r=>{
              const pct = (r.total/total)*100;
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="text-xs font-bold text-slate-500 w-8 flex-shrink-0">{r.id}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-deep">{r.name}</span>
                      <span className="text-slate-400">{r.top}</span>
                    </div>
                    <div className="h-7 bg-slate-100 rounded-lg overflow-hidden relative">
                      <div className="h-full rounded-lg flex items-center pl-3 transition-all"
                        style={{width:`${Math.max(10,pct)}%`, background:r.color}}>
                        <span className="text-xs font-extrabold text-white whitespace-nowrap">${r.total}B</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs font-bold ${r.yoy>10?'text-emerald-600':'text-slate-500'}`}>+{r.yoy}%</div>
                    <div className="text-xs text-slate-300">{pct.toFixed(0)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-12 h-3 rounded" style={{background:'linear-gradient(to right, rgba(10,102,194,0.1), rgba(10,102,194,0.9))'}}/>
              Low → High FDI
            </div>
            <span className="text-xs text-slate-400 ml-auto">Source: UNCTAD WIR 2025</span>
          </div>
        </div>
      )}

      {view==='sector' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wide">Sector</th>
                {REGIONS.map(r=><th key={r.id} className="px-2 py-2 text-xs font-bold text-slate-400 text-center">{r.id}</th>)}
              </tr>
            </thead>
            <tbody>
              {SECTOR_HEAT.map(row=>(
                <tr key={row.s} className="border-b border-slate-50">
                  <td className="px-4 py-1 text-xs font-semibold text-deep">{row.s}</td>
                  {REGIONS.map(r=><HeatCell key={r.id} val={(row as any)[r.id]||0}/>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100">
            <div className="w-24 h-3 rounded" style={{background:'linear-gradient(to right, rgba(10,102,194,0.08), rgba(10,102,194,1))'}}/>
            <span className="text-xs text-slate-400">Low investment intensity → High</span>
          </div>
        </div>
      )}
    </div>
  );
}
