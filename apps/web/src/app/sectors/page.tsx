'use client';
import { useState } from 'react';

const SECTORS = [
  {code:'J',name:'Information & Communication Technology',fdi_global_b:1840,growth:22.4,signal_count:284,top_dest:['USA','SGP','IRL','IND','ARE'],risk:'LOW',    icon:'💻',
   highlights:'AI/ML infrastructure, cloud data centres, cybersecurity. Dominant sector globally. $28B pipeline in MENA alone.'},
  {code:'K',name:'Financial & Insurance Services',       fdi_global_b:1210,growth:14.8,signal_count:178,top_dest:['GBR','USA','SGP','IRL','ARE'],risk:'LOW',    icon:'🏦',
   highlights:'Fintech expansion, ESG-linked finance, digital banking licences. UAE and Singapore competing for regional HQs.'},
  {code:'D',name:'Electricity, Gas & Energy',            fdi_global_b:980, growth:31.2,signal_count:142,top_dest:['IND','VNM','SAU','EGY','ZAF'],risk:'MEDIUM', icon:'⚡',
   highlights:'Renewables dominate: $40B clean energy pipeline. Nuclear renaissance adds uranium demand. Green hydrogen corridors opening.'},
  {code:'C',name:'Manufacturing',                        fdi_global_b:820, growth:8.4, signal_count:198,top_dest:['VNM','IDN','IND','MEX','MAR'],risk:'MEDIUM', icon:'🏭',
   highlights:'China+1 supply chain relocation accelerating. EV battery gigafactories primary driver. Semiconductor fabs second.'},
  {code:'B',name:'Mining & Quarrying',                   fdi_global_b:440, growth:12.1,signal_count:88, top_dest:['AUS','CHL','CAN','ZAF','IDN'],risk:'HIGH',   icon:'⛏️',
   highlights:'Critical minerals race: lithium, cobalt, nickel, copper. Energy transition creating new mining FDI supercycle.'},
  {code:'H',name:'Transportation & Logistics',           fdi_global_b:360, growth:9.8, signal_count:76, top_dest:['ARE','SGP','NLD','EGY','PAN'],risk:'LOW',    icon:'🚢',
   highlights:'Port expansion, logistics hubs, e-commerce warehousing. UAE and Singapore competing for regional logistics supremacy.'},
  {code:'L',name:'Real Estate',                          fdi_global_b:680, growth:6.2, signal_count:94, top_dest:['ARE','USA','GBR','AUS','CAN'],risk:'MEDIUM', icon:'🏢',
   highlights:'Data centres classified under real estate. Luxury residential resilient. Commercial office recovering post-COVID.'},
  {code:'F',name:'Construction',                         fdi_global_b:280, growth:18.4,signal_count:52, top_dest:['SAU','EGY','IND','IDN','NGA'],risk:'MEDIUM', icon:'🏗️',
   highlights:'NEOM mega-project driving $100B+ construction FDI to Saudi Arabia. Africa infrastructure gap attracting Chinese capital.'},
];

const RISK_COLORS: Record<string,string> = {
  LOW:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  MEDIUM:'bg-amber-100 text-amber-700 border-amber-200',
  HIGH:  'bg-red-100 text-red-700 border-red-200',
};

export default function SectorsPage() {
  const [selected, setSelected]  = useState(SECTORS[0]);
  const [sortKey,  setSortKey]   = useState<'fdi_global_b'|'growth'|'signal_count'>('fdi_global_b');
  const [risk,     setRisk]      = useState('');

  const sorted = [...SECTORS]
    .filter(s => !risk || s.risk === risk)
    .sort((a,b) => b[sortKey]-a[sortKey]);

  const maxFDI = Math.max(...SECTORS.map(s=>s.fdi_global_b));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Sector Intelligence</h1>
          <p className="text-blue-200 text-sm">ISIC sector FDI analysis across 21 classifications. Global flows, growth trends, top destinations, and risk assessment.</p>
          <div className="grid grid-cols-3 gap-6 mt-6">
            {[
              {l:'Total Global FDI',  v:`$${(SECTORS.reduce((s,c)=>s+c.fdi_global_b,0)/1000).toFixed(1)}T`},
              {l:'Fastest Growing',   v:`ISIC D +${Math.max(...SECTORS.map(s=>s.growth))}%`},
              {l:'Total Signals',     v:SECTORS.reduce((s,c)=>s+c.signal_count,0)},
            ].map(s=>(
              <div key={s.l}><div className="text-2xl font-black">{s.v}</div><div className="text-blue-400 text-xs mt-0.5">{s.l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-5">
          {([['fdi_global_b','FDI Volume'],['growth','Growth'],['signal_count','Signals']] as const).map(([k,l])=>(
            <button key={k} onClick={()=>setSortKey(k)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sortKey===k?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>{l}</button>
          ))}
          {['','LOW','MEDIUM','HIGH'].map(r=>(
            <button key={r} onClick={()=>setRisk(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${risk===r?'bg-blue-600 text-white':'text-slate-400 border border-slate-200'}`}>
              {r||'All Risk'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Bar chart list */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
            <div className="text-sm font-black text-[#0A2540] mb-4">Sector FDI Comparison</div>
            <div className="space-y-3">
              {sorted.map(s=>(
                <div key={s.code} onClick={()=>setSelected(s)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${selected.code===s.code?'border-blue-400 bg-blue-50':'border-transparent hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl w-8 text-center flex-shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-black text-[#0A2540] truncate">ISIC {s.code} — {s.name.split(',')[0]}</span>
                        <span className="text-xs font-black text-blue-600 flex-shrink-0 ml-2">${s.fdi_global_b}B</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{width:`${(s.fdi_global_b/maxFDI)*100}%`}}/>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded border flex-shrink-0 ${RISK_COLORS[s.risk]}`}>{s.risk}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 ml-11">
                    <span className="text-emerald-600 font-bold">↑ {s.growth}% YoY</span>
                    <span>{s.signal_count} signals</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector detail */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selected.icon}</span>
                <div>
                  <div className="font-black text-[#0A2540]">ISIC {selected.code}</div>
                  <div className="text-xs text-slate-400 leading-snug">{selected.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  {l:'Global FDI', v:`$${selected.fdi_global_b}B`, c:'text-blue-600'},
                  {l:'YoY Growth', v:`+${selected.growth}%`,       c:'text-emerald-600'},
                  {l:'Signals',    v:selected.signal_count,         c:'text-violet-600'},
                  {l:'Risk Level', v:selected.risk,                 c:'text-amber-600'},
                ].map(m=>(
                  <div key={m.l} className="bg-slate-50 rounded-lg p-2.5 text-center">
                    <div className={`font-black text-sm ${m.c}`}>{m.v}</div>
                    <div className="text-xs text-slate-400">{m.l}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{selected.highlights}</p>
              <div className="mb-3">
                <div className="text-xs font-bold text-slate-400 mb-1.5">Top Destinations</div>
                <div className="flex flex-wrap gap-1">
                  {selected.top_dest.map((iso,i)=>(
                    <span key={iso} className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${i===0?'bg-amber-50 border-amber-300 text-amber-700':'bg-blue-50 border-blue-200 text-blue-700'}`}>
                      {i===0&&'#1 '}{iso}
                    </span>
                  ))}
                </div>
              </div>
              <button className="w-full bg-[#0A2540] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                Sector Intelligence Report — 14 FIC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
