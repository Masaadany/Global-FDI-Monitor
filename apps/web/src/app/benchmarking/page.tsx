'use client';
import { useState } from 'react';

const ECONOMIES = [
  {iso3:'ARE',name:'UAE',           composite:80.0,macro:82,policy:78,digital:84,human:54,infra:92,sustain:53,fdi_b:30.7,rank:3},
  {iso3:'SGP',name:'Singapore',     composite:88.5,macro:87,policy:91,digital:87,human:63,infra:94,sustain:62,fdi_b:141.2,rank:1},
  {iso3:'SAU',name:'Saudi Arabia',  composite:68.1,macro:74,policy:62,digital:68,human:45,infra:72,sustain:47,fdi_b:28.3,rank:6},
  {iso3:'IND',name:'India',         composite:62.3,macro:68,policy:56,digital:59,human:69,infra:65,sustain:38,fdi_b:71.0,rank:10},
  {iso3:'DEU',name:'Germany',       composite:78.1,macro:81,policy:86,digital:78,human:70,infra:84,sustain:77,fdi_b:35.4,rank:4},
  {iso3:'GBR',name:'UK',            composite:78.5,macro:80,policy:84,digital:82,human:71,infra:80,sustain:72,fdi_b:52.0,rank:7},
];

const DIMS = ['macro','policy','digital','human','infra','sustain'];
const DIM_LABELS: Record<string,string> = {macro:'Macro',policy:'Policy',digital:'Digital',human:'Human',infra:'Infra',sustain:'Sustain'};
const COLORS = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#f97316','#06b6d4'];

export default function BenchmarkingPage() {
  const [primary,   setPrimary]   = useState('ARE');
  const [compareTo, setCompareTo] = useState(['SGP','DEU']);

  const selected = [primary,...compareTo].slice(0,4).map(iso3=>ECONOMIES.find(e=>e.iso3===iso3)!).filter(Boolean);
  const primary_eco  = ECONOMIES.find(e=>e.iso3===primary)!;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Benchmarking</h1>
          <p className="text-blue-200 text-sm">Compare investment readiness across economies. Up to 4 economies side-by-side.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        {/* Economy selector */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Primary Economy</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                value={primary} onChange={e=>setPrimary(e.target.value)}>
                {ECONOMIES.map(e=><option key={e.iso3} value={e.iso3}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Compare With (up to 3)</label>
              <div className="flex gap-2 flex-wrap">
                {ECONOMIES.filter(e=>e.iso3!==primary).map(e=>(
                  <button key={e.iso3} onClick={()=>setCompareTo(prev=>
                    prev.includes(e.iso3) ? prev.filter(x=>x!==e.iso3) :
                    prev.length<3 ? [...prev,e.iso3] : prev
                  )}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      compareTo.includes(e.iso3) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>{e.iso3}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Composite score comparison */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 mb-5">
          <div className="font-black text-[#0A2540] mb-4">Composite GFR Score</div>
          <div className="grid grid-cols-4 gap-3">
            {selected.map((eco,i)=>(
              <div key={eco.iso3} className={`rounded-xl p-4 text-center ${eco.iso3===primary?'bg-blue-50 border-2 border-blue-300':'bg-slate-50 border border-slate-200'}`}>
                <div className="text-xs font-bold text-slate-400 mb-1">{eco.iso3===primary?'PRIMARY':'COMPARE'}</div>
                <div className="text-3xl font-black mb-1" style={{color:COLORS[i]}}>{eco.composite}</div>
                <div className="font-bold text-sm text-[#0A2540]">{eco.name}</div>
                <div className="text-xs text-slate-400 mt-1">Rank #{eco.rank}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dimension bars */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 mb-5">
          <div className="font-black text-[#0A2540] mb-4">Dimension Comparison</div>
          <div className="space-y-4">
            {DIMS.map(dim=>(
              <div key={dim}>
                <div className="text-xs font-bold text-slate-500 mb-1.5">{DIM_LABELS[dim]}</div>
                <div className="space-y-1.5">
                  {selected.map((eco,i)=>(
                    <div key={eco.iso3} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-16">{eco.iso3}</span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{width:`${(eco as any)[dim]}%`,background:COLORS[i]}}/>
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-8">{(eco as any)[dim]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gap analysis */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-black text-[#0A2540] mb-4">Gap Analysis vs. {primary_eco.name}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-2.5 font-bold text-slate-400">Dimension</th>
                  <th className="text-left px-4 py-2.5 font-bold text-slate-400">{primary_eco.name}</th>
                  {selected.filter(e=>e.iso3!==primary).map(e=>(
                    <th key={e.iso3} className="text-left px-4 py-2.5 font-bold text-slate-400">{e.name} Gap</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DIMS.map(dim=>(
                  <tr key={dim} className="border-b border-slate-50">
                    <td className="px-4 py-2.5 font-semibold text-slate-600">{DIM_LABELS[dim]}</td>
                    <td className="px-4 py-2.5 font-black text-blue-600">{(primary_eco as any)[dim]}</td>
                    {selected.filter(e=>e.iso3!==primary).map(e=>{
                      const gap=(e as any)[dim]-(primary_eco as any)[dim];
                      return (
                        <td key={e.iso3} className="px-4 py-2.5">
                          <span className={`font-bold ${gap>0?'text-emerald-600':gap<0?'text-red-500':'text-slate-400'}`}>
                            {gap>0?'+':''}{gap}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
