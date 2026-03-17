'use client';
import { useState } from 'react';

const CORRIDORS = [
  {id:'C01',from:'UAE',    to:'India',        from3:'ARE',to3:'IND',trade_b:82,  fdi_b:4.2, signals:8, growth:12.4, sectors:['K','J','D'], status:'ACTIVE',   trend:'UP',
   desc:'UAE–India corridor driven by tech FDI, financial services, and energy. UAE is India\'s 3rd largest trade partner.',
   top_signal:{company:'Masdar',capex:'$800M',sector:'D',status:'ANNOUNCED'}},
  {id:'C02',from:'USA',    to:'UAE',          from3:'USA',to3:'ARE',trade_b:68,  fdi_b:3.8, signals:12, growth:18.2, sectors:['J','K','L'], status:'ACTIVE',   trend:'UP',
   desc:'US–UAE tech and finance corridor. Major cloud, AI and data centre investments. $28B 5-year pipeline identified.',
   top_signal:{company:'Microsoft',capex:'$850M',sector:'J',status:'CONFIRMED'}},
  {id:'C03',from:'China',  to:'Indonesia',    from3:'CHN',to3:'IDN',trade_b:124, fdi_b:6.8, signals:14, growth:22.1, sectors:['C','B','D'], status:'ACTIVE',   trend:'UP',
   desc:'China–Indonesia manufacturing and resources corridor. Battery supply chain and nickel processing dominant.',
   top_signal:{company:'CATL',capex:'$3.2B',sector:'C',status:'COMMITTED'}},
  {id:'C04',from:'Germany',to:'India',        from3:'DEU',to3:'IND',trade_b:28,  fdi_b:3.4, signals:6,  growth:14.8, sectors:['C','D','J'], status:'ACTIVE',   trend:'UP',
   desc:'Germany–India industrial and green energy corridor. Auto supply chain relocation and solar manufacturing.',
   top_signal:{company:'Siemens',capex:'$450M',sector:'C',status:'ANNOUNCED'}},
  {id:'C05',from:'Saudi Arabia',to:'Egypt',   from3:'SAU',to3:'EGY',trade_b:12,  fdi_b:2.8, signals:5,  growth:28.4, sectors:['D','F','K'], status:'GROWING',  trend:'UP',
   desc:'Saudi–Egypt energy and infrastructure corridor. $20B Neom-linked logistics and energy projects.',
   top_signal:{company:'ACWA Power',capex:'$1.1B',sector:'D',status:'ANNOUNCED'}},
  {id:'C06',from:'Japan',  to:'Vietnam',      from3:'JPN',to3:'VNM',trade_b:43,  fdi_b:4.2, signals:9,  growth:16.2, sectors:['C','J','H'], status:'ACTIVE',   trend:'STABLE',
   desc:'Japan–Vietnam manufacturing corridor. Electronics, auto parts and logistics. China+1 primary driver.',
   top_signal:{company:'Toyota',capex:'$2.1B',sector:'C',status:'CONFIRMED'}},
  {id:'C07',from:'UK',     to:'India',        from3:'GBR',to3:'IND',trade_b:28,  fdi_b:1.8, signals:4,  growth:11.2, sectors:['K','J','C'], status:'ACTIVE',   trend:'UP',
   desc:'UK–India post-Brexit trade and investment acceleration. UK-India FTA negotiations near conclusion.',
   top_signal:{company:'HSBC',capex:'$600M',sector:'K',status:'ANNOUNCED'}},
  {id:'C08',from:'Korea',  to:'Vietnam',      from3:'KOR',to3:'VNM',trade_b:84,  fdi_b:5.4, signals:11, growth:8.4,  sectors:['C','J','K'], status:'ACTIVE',   trend:'STABLE',
   desc:'Korea–Vietnam largest FDI bilateral in Asia. Samsung anchor investor. $28B cumulative FDI.',
   top_signal:{company:'Samsung',capex:'$2.8B',sector:'C',status:'COMMITTED'}},
];

const TREND_COLORS: Record<string,string> = { UP:'text-emerald-600', STABLE:'text-blue-600', DOWN:'text-red-500' };
const TREND_ICONS: Record<string,string>  = { UP:'↑', STABLE:'→', DOWN:'↓' };
const STATUS_STYLES: Record<string,string> = {
  ACTIVE:'bg-emerald-100 text-emerald-700 border-emerald-200',
  GROWING:'bg-blue-100 text-blue-700 border-blue-200',
  EMERGING:'bg-amber-100 text-amber-700 border-amber-200',
};
const SECTOR_NAMES: Record<string,string> = {J:'ICT',K:'Finance',D:'Energy',C:'Mfg',B:'Mining',L:'Real Estate',H:'Logistics',F:'Construction'};

export default function CorridorIntelligencePage() {
  const [selected, setSelected] = useState(CORRIDORS[0]);
  const [sort,     setSort]     = useState<'fdi_b'|'growth'|'signals'>('fdi_b');

  const sorted = [...CORRIDORS].sort((a,b)=>b[sort]-a[sort]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Bilateral Analysis · Q1 2026</div>
          <h1 className="text-3xl font-black mb-2">Corridor Intelligence</h1>
          <p className="text-blue-200 text-sm">Deep analysis of the world's most active FDI bilateral corridors. Trade flows, investment signals, and growth trajectories.</p>
          <div className="flex gap-8 mt-5">
            {[
              {l:'Total corridor FDI', v:`$${CORRIDORS.reduce((s,c)=>s+c.fdi_b,0).toFixed(1)}B`},
              {l:'Active signals',     v:CORRIDORS.reduce((s,c)=>s+c.signals,0)},
              {l:'Avg growth YoY',     v:`${(CORRIDORS.reduce((s,c)=>s+c.growth,0)/CORRIDORS.length).toFixed(1)}%`},
            ].map(s=>(
              <div key={s.l}><div className="text-2xl font-black text-white">{s.v}</div><div className="text-blue-400 text-xs mt-0.5">{s.l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        {/* Sort */}
        <div className="flex gap-2 mb-5">
          {([['fdi_b','FDI Volume'],['growth','YoY Growth'],['signals','Signals']] as const).map(([k,l])=>(
            <button key={k} onClick={()=>setSort(k)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sort===k?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* List */}
          <div className="md:col-span-1 space-y-2">
            {sorted.map(c=>(
              <div key={c.id} onClick={()=>setSelected(c)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${selected.id===c.id?'border-blue-400 shadow-md':'border-slate-100 hover:border-blue-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-black text-sm text-[#0A2540]">{c.from} → {c.to}</div>
                  <span className={`text-xs font-black ${TREND_COLORS[c.trend]}`}>{TREND_ICONS[c.trend]} {c.growth}%</span>
                </div>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span className="font-bold text-blue-600">${c.fdi_b}B FDI</span>
                  <span>{c.signals} signals</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border mt-2 inline-block ${STATUS_STYLES[c.status]||STATUS_STYLES.ACTIVE}`}>{c.status}</span>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-black text-[#0A2540]">{selected.from} ⟷ {selected.to}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selected.from3} · {selected.to3}</div>
                </div>
                <span className={`text-lg font-black ${TREND_COLORS[selected.trend]}`}>
                  {TREND_ICONS[selected.trend]} {selected.growth}% YoY
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">{selected.desc}</p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  {l:'Trade Volume',v:`$${selected.trade_b}B`,c:'text-blue-600'},
                  {l:'FDI Inflows', v:`$${selected.fdi_b}B`, c:'text-emerald-600'},
                  {l:'Active Signals',v:selected.signals,   c:'text-violet-600'},
                ].map(s=>(
                  <div key={s.l} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className={`text-xl font-black ${s.c}`}>{s.v}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold text-slate-400 mb-2">Leading Sectors</div>
                <div className="flex gap-2">
                  {selected.sectors.map(s=>(
                    <span key={s} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full font-bold">
                      ISIC {s} — {SECTOR_NAMES[s]||s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="text-xs font-bold text-emerald-700 mb-2">Latest Signal</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-black text-sm text-[#0A2540]">{selected.top_signal.company}</div>
                    <div className="text-xs text-slate-500">ISIC {selected.top_signal.sector} · {selected.top_signal.status}</div>
                  </div>
                  <div className="text-xl font-black text-blue-600">{selected.top_signal.capex}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
