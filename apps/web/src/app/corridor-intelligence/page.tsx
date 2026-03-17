'use client';
import { useState } from 'react';
const CORRIDORS = [
  {id:'C1',from:'UAE',to:'India',   vol_b:82.3,trend:'UP',  signals:12,status:'STRONG', desc:'Technology, logistics, and remittance flows driving bilateral FDI surge.'},
  {id:'C2',from:'USA',to:'UAE',     vol_b:68.1,trend:'UP',  signals:9, status:'STRONG', desc:'Data centre and financial services investment accelerating.'},
  {id:'C3',from:'CHN',to:'SAU',     vol_b:54.2,trend:'FLAT',signals:6, status:'ACTIVE', desc:'Vision 2030 infrastructure projects with Chinese contractors.'},
  {id:'C4',from:'DEU',to:'EGY',     vol_b:28.4,trend:'UP',  signals:4, status:'ACTIVE', desc:'Renewable energy and manufacturing corridor strengthening.'},
  {id:'C5',from:'USA',to:'VNM',     vol_b:22.1,trend:'UP',  signals:8, status:'STRONG', desc:'China+1 manufacturing strategy driving semiconductor investment.'},
];
export default function CorridorIntelligencePage() {
  const [selected,setSelected]=useState(CORRIDORS[0]);
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Corridor Intelligence</h1>
          <p className="text-blue-200 text-sm">Bilateral investment flow analysis across key FDI corridors.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-5 grid md:grid-cols-3 gap-5">
        <div className="space-y-2">
          {CORRIDORS.map(c=>(
            <div key={c.id} onClick={()=>setSelected(c)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${selected.id===c.id?'border-blue-400 shadow-sm':'border-slate-100 hover:border-blue-200'}`}>
              <div className="font-bold text-sm text-[#0A2540]">{c.from} → {c.to}</div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-400">${c.vol_b}B · {c.signals} signals</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.status==='STRONG'?'bg-emerald-100 text-emerald-700':'bg-blue-100 text-blue-700'}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl font-black text-[#0A2540]">{selected.from}</div>
            <div className="text-2xl text-slate-300">→</div>
            <div className="text-2xl font-black text-[#0A2540]">{selected.to}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[{l:'Total Flows',v:`$${selected.vol_b}B`},{l:'Active Signals',v:selected.signals},{l:'Trend',v:selected.trend}].map(k=>(
              <div key={k.l} className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">{k.l}</div>
                <div className="font-black text-lg text-blue-600">{k.v}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{selected.desc}</p>
        </div>
      </div>
    </div>
  );
}
