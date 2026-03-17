'use client';
import { useState } from 'react';
const SCENARIOS = [
  {id:'S1',name:'Baseline',gdp_growth:3.4,fdi_b:31.5,color:'#3b82f6'},
  {id:'S2',name:'Optimistic — Oil $120+',gdp_growth:4.8,fdi_b:42.0,color:'#10b981'},
  {id:'S3',name:'Stress — Geopolitical shock',gdp_growth:1.2,fdi_b:18.5,color:'#ef4444'},
  {id:'S4',name:'Green transition acceleration',gdp_growth:3.9,fdi_b:38.0,color:'#8b5cf6'},
];
export default function ScenarioPlannerPage() {
  const [active,setActive]=useState('S1');
  const sc=SCENARIOS.find(s=>s.id===active)!;
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Scenario Planner</h1>
          <p className="text-blue-200 text-sm">Model investment outcomes across macro scenarios.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-5">
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          {SCENARIOS.map(s=>(
            <div key={s.id} onClick={()=>setActive(s.id)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${active===s.id?'border-blue-400 shadow-sm':'border-slate-100 hover:border-blue-200'}`}>
              <div className="font-bold text-xs text-[#0A2540] mb-2">{s.name}</div>
              <div className="text-2xl font-black" style={{color:s.color}}>+{s.gdp_growth}%</div>
              <div className="text-xs text-slate-400">GDP growth</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="font-black text-xl text-[#0A2540] mb-1">{sc.name}</div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              {l:'GDP Growth',v:`+${sc.gdp_growth}%`,c:'text-blue-600'},
              {l:'FDI Inflows',v:`$${sc.fdi_b}B`,c:'text-emerald-600'},
              {l:'Probability',v:'35%',c:'text-amber-600'},
            ].map(k=>(
              <div key={k.l} className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-xs text-slate-400 mb-1">{k.l}</div>
                <div className={`text-2xl font-black ${k.c}`}>{k.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
