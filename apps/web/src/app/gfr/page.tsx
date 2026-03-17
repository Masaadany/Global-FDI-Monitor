'use client';
import { useState } from 'react';

const GFR_DATA = [
  {rank:1, iso3:'SGP',name:'Singapore',     region:'EAP',composite:88.5,tier:'FRONTIER',macro:87,policy:91,digital:87,human:63,infra:94,sustain:62,grade:'A+'},
  {rank:2, iso3:'CHE',name:'Switzerland',   region:'ECA',composite:87.5,tier:'FRONTIER',macro:88,policy:90,digital:85,human:78,infra:91,sustain:74,grade:'A+'},
  {rank:3, iso3:'ARE',name:'UAE',           region:'MENA',composite:80.0,tier:'FRONTIER',macro:82,policy:78,digital:84,human:54,infra:92,sustain:53,grade:'A'},
  {rank:4, iso3:'DEU',name:'Germany',       region:'ECA',composite:78.1,tier:'HIGH',    macro:81,policy:86,digital:78,human:70,infra:84,sustain:77,grade:'A'},
  {rank:5, iso3:'IRL',name:'Ireland',       region:'ECA',composite:76.5,tier:'HIGH',    macro:82,policy:85,digital:80,human:72,infra:78,sustain:58,grade:'A'},
  {rank:6, iso3:'USA',name:'United States', region:'NAM',composite:84.5,tier:'FRONTIER',macro:89,policy:83,digital:91,human:74,infra:86,sustain:68,grade:'A+'},
  {rank:7, iso3:'GBR',name:'United Kingdom',region:'ECA',composite:78.5,tier:'HIGH',    macro:80,policy:84,digital:82,human:71,infra:80,sustain:72,grade:'A'},
  {rank:8, iso3:'NOR',name:'Norway',        region:'ECA',composite:83.2,tier:'FRONTIER',macro:85,policy:88,digital:84,human:75,infra:82,sustain:91,grade:'A+'},
  {rank:9, iso3:'SAU',name:'Saudi Arabia',  region:'MENA',composite:68.1,tier:'HIGH',    macro:74,policy:62,digital:68,human:45,infra:72,sustain:47,grade:'B+'},
  {rank:10,iso3:'IND',name:'India',         region:'SAS',composite:62.3,tier:'MEDIUM',  macro:68,policy:56,digital:59,human:69,infra:65,sustain:38,grade:'B'},
  {rank:11,iso3:'BRA',name:'Brazil',        region:'LAC',composite:54.2,tier:'MEDIUM',  macro:58,policy:52,digital:55,human:62,infra:56,sustain:48,grade:'B'},
  {rank:12,iso3:'ZAF',name:'South Africa',  region:'SSA',composite:51.3,tier:'MEDIUM',  macro:55,policy:58,digital:48,human:54,infra:52,sustain:42,grade:'C+'},
  {rank:13,iso3:'NGA',name:'Nigeria',       region:'SSA',composite:42.1,tier:'EMERGING', macro:48,policy:38,digital:40,human:44,infra:38,sustain:35,grade:'C'},
];

const DIMS = ['macro','policy','digital','human','infra','sustain'];
const DIM_LABELS: Record<string,string> = {
  macro:'Macro Foundations', policy:'Policy & Institutional',
  digital:'Digital Foundations', human:'Human Capital',
  infra:'Infrastructure', sustain:'Sustainability',
};
const TIER_STYLES: Record<string,string> = {
  FRONTIER:'bg-emerald-100 text-emerald-700',
  HIGH:    'bg-blue-100 text-blue-700',
  MEDIUM:  'bg-amber-100 text-amber-700',
  EMERGING:'bg-orange-100 text-orange-700',
  DEVELOPING:'bg-red-100 text-red-700',
};

function RadarMini({dims}: {dims: Record<string,number>}) {
  const n=6, cx=50, cy=50, r=38;
  const keys = DIMS;
  function polar(i:number, v:number) {
    const a = (i*360/n - 90) * Math.PI/180;
    return {x: cx + (v/100)*r*Math.cos(a), y: cy + (v/100)*r*Math.sin(a)};
  }
  const pts  = keys.map((k,i) => polar(i, dims[k] || 0));
  const path = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')+'Z';
  const rings = [25,50,75,100].map(ring => {
    const rpts = keys.map((_,i) => polar(i,ring));
    return rpts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')+'Z';
  });
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24">
      {rings.map((d,i) => <path key={i} d={d} fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>)}
      {keys.map((_,i) => { const p=polar(i,100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="0.5"/>; })}
      <path d={path} fill="#3b82f630" stroke="#3b82f6" strokeWidth="1.5"/>
    </svg>
  );
}

export default function GFRPage() {
  const [selected, setSelected] = useState(GFR_DATA[0]);
  const [region,   setRegion]   = useState('');
  const [tier,     setTier]     = useState('');

  const filtered = GFR_DATA.filter(e =>
    (!region || e.region === region) &&
    (!tier   || e.tier === tier)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Quarterly Update — Q1 2026</div>
          <h1 className="text-3xl font-black mb-2">Global Future Readiness Ranking</h1>
          <p className="text-blue-200 text-sm max-w-2xl">215 economies scored across 6 dimensions: Macro Foundations (20%), Policy & Institutional (18%), Digital Foundations (15%), Human Capital (15%), Infrastructure (15%), Sustainability (17%).</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {['','MENA','ECA','EAP','SAS','NAM','LAC','SSA'].map(r => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                region===r ? 'bg-[#0A2540] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}>{r || 'All Regions'}</button>
          ))}
          <div className="ml-auto flex gap-2">
            {['','FRONTIER','HIGH','MEDIUM','EMERGING'].map(t => (
              <button key={t} onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  tier===t ? 'bg-[#0A2540] text-white' : 'bg-white border border-slate-200 text-slate-500'
                }`}>{t || 'All Tiers'}</button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Rankings table */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Rank','Economy','Region','Composite','Tier','Grade'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.iso3} onClick={() => setSelected(e)}
                    className={`border-b border-slate-50 cursor-pointer transition-colors ${
                      selected.iso3===e.iso3 ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}>
                    <td className="px-4 py-3 font-black text-slate-400">#{e.rank}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#0A2540]">{e.name}</div>
                      <div className="text-slate-400 font-mono">{e.iso3}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{e.region}</td>
                    <td className="px-4 py-3">
                      <div className="font-black text-lg text-blue-600">{e.composite}</div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 w-20">
                        <div className="h-full bg-blue-500 rounded-full" style={{width:`${e.composite}%`}}/>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TIER_STYLES[e.tier]}`}>{e.tier}</span>
                    </td>
                    <td className="px-4 py-3 font-black text-slate-600">{e.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Economy detail */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-black text-[#0A2540]">{selected.name}</div>
                  <div className="text-sm text-slate-400">{selected.region} · Rank #{selected.rank}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-blue-600">{selected.composite}</div>
                  <div className="text-xs text-slate-400">Composite</div>
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <RadarMini dims={selected as any}/>
              </div>

              <div className="space-y-2">
                {DIMS.map(dim => (
                  <div key={dim}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-slate-500">{DIM_LABELS[dim]}</span>
                      <span className="font-bold text-[#0A2540]">{(selected as any)[dim]}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width:`${(selected as any)[dim]}%`,
                          background: (selected as any)[dim] >= 75 ? '#10b981' : (selected as any)[dim] >= 55 ? '#3b82f6' : '#f59e0b'
                        }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="font-bold text-xs text-[#0A2540] mb-2">Investment Grade</div>
              <div className={`text-center py-2 rounded-lg font-black text-lg ${TIER_STYLES[selected.tier]}`}>
                {selected.grade} — {selected.tier}
              </div>
              <button className="w-full mt-3 bg-[#0A2540] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">
                Download GFR Report — 10 FIC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
