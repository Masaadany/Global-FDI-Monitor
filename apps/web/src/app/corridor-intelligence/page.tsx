'use client';
import { useState } from 'react';
import { exportCSV } from '@/lib/export';

const CORRIDORS = [
  {id:'C01',from:'UAE',   to:'India',      flag1:'🇦🇪',flag2:'🇮🇳',fdi_b:4.2, growth:18.4,trend:'UP',  grade:'PLATINUM',type:'Technology + Finance',signals:12,rank:1,
   hist:[2.1,2.8,3.4,3.8,4.2],desc:'Driven by UAE sovereign funds in Indian tech startups, digital infrastructure, and Tata-UAE manufacturing partnerships.'},
  {id:'C02',from:'USA',   to:'UAE',        flag1:'🇺🇸',flag2:'🇦🇪',fdi_b:5.8, growth:22.1,trend:'UP',  grade:'PLATINUM',type:'Technology + Finance',signals:18,rank:2,
   hist:[2.8,3.4,4.0,5.0,5.8],desc:'Microsoft, AWS, Google, and BlackRock expanding UAE presence. ADGM positioning as regional financial hub.'},
  {id:'C03',from:'China', to:'Indonesia',  flag1:'🇨🇳',flag2:'🇮🇩',fdi_b:6.8, growth:28.4,trend:'UP',  grade:'PLATINUM',type:'Manufacturing + EV',signals:14,rank:3,
   hist:[3.2,4.1,5.0,5.8,6.8],desc:'CATL, BYD, and battery supply chain anchoring in Kalimantan and Java. Nickel processing upstream integration.'},
  {id:'C04',from:'Germany',to:'India',     flag1:'🇩🇪',flag2:'🇮🇳',fdi_b:3.4, growth:14.2,trend:'UP',  grade:'GOLD',   type:'Manufacturing + Engineering',signals:9,rank:4,
   hist:[1.8,2.2,2.8,3.1,3.4],desc:'Siemens, BASF, and Bosch expanding manufacturing. Green hydrogen partnership with NTPC announced.'},
  {id:'C05',from:'Saudi Arabia',to:'Egypt',flag1:'🇸🇦',flag2:'🇪🇬',fdi_b:2.8, growth:32.1,trend:'UP',  grade:'GOLD',   type:'Energy + Infra',signals:8,rank:5,
   hist:[0.8,1.2,1.6,2.2,2.8],desc:'ACWA Power wind farms, NEOM-Egypt transit corridor, and Saudi tourism infrastructure investments.'},
  {id:'C06',from:'Japan', to:'Vietnam',    flag1:'🇯🇵',flag2:'🇻🇳',fdi_b:4.2, growth:9.4, trend:'UP',  grade:'GOLD',   type:'Manufacturing',signals:11,rank:6,
   hist:[2.8,3.2,3.6,3.9,4.2],desc:'Toyota, Sony, Honda supply chain deepening. Semiconductor packaging investment surge post-China+1 shift.'},
  {id:'C07',from:'UK',    to:'India',      flag1:'🇬🇧',flag2:'🇮🇳',fdi_b:1.8, growth:8.2, trend:'FLAT',grade:'SILVER', type:'Finance + Tech',signals:6,rank:7,
   hist:[1.0,1.2,1.5,1.6,1.8],desc:'City of London capital flows. HSBC, Standard Chartered, and Vodafone expansion in digital finance.'},
  {id:'C08',from:'Korea', to:'Vietnam',    flag1:'🇰🇷',flag2:'🇻🇳',fdi_b:5.4, growth:6.8, trend:'FLAT',grade:'GOLD',   type:'Electronics + Manufacturing',signals:10,rank:8,
   hist:[3.8,4.2,4.6,5.0,5.4],desc:'Samsung, LG, and SK Hynix dominating electronics manufacturing. Semiconductor ecosystem maturation.'},
];

const GRADE_CFG: Record<string,{bg:string;text:string;border:string;dot:string}> = {
  PLATINUM:{bg:'bg-amber-50',text:'text-amber-800',border:'border-amber-200',dot:'#D97706'},
  GOLD:    {bg:'bg-emerald-50',text:'text-emerald-800',border:'border-emerald-200',dot:'#059669'},
  SILVER:  {bg:'bg-blue-50',text:'text-blue-800',border:'border-blue-200',dot:'#2563EB'},
};
const TREND_ICON: Record<string,string>  = {UP:'↑', FLAT:'→', DOWN:'↓'};
const TREND_COLOR: Record<string,string> = {UP:'text-emerald-600', FLAT:'text-slate-400', DOWN:'text-red-500'};

function Sparkline({data, color}: {data:number[]; color:string}) {
  const max = Math.max(...data), min = Math.min(...data)*0.85;
  const W=80, H=28;
  const pts = data.map((v,i)=>`${(i/(data.length-1)*W).toFixed(1)},${(H-(v-min)/(max-min)*H*0.9+2).toFixed(1)}`).join(' ');
  const area= `0,${H} ${pts} ${W},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-20 h-7">
      <polygon points={area} fill={color} opacity="0.12"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"/>
      <circle cx={(data.length-1)*W/(data.length-1)} cy={H-(data[data.length-1]-min)/(max-min)*H*0.9+2} r={2.5} fill={color}/>
    </svg>
  );
}

export default function CorridorPage() {
  const [selected, setSelected] = useState<string|null>(null);
  const [filter,   setFilter]   = useState('');
  const [sort,     setSort]     = useState<'fdi_b'|'growth'|'rank'>('rank');

  const filtered = [...CORRIDORS]
    .filter(c => !filter || c.grade === filter)
    .sort((a, b) => sort==='rank' ? a.rank-b.rank : b[sort]-a[sort]);

  const totalFDI = CORRIDORS.reduce((s,c)=>s+c.fdi_b,0);

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Bilateral Intelligence</div>
          <h1 className="text-4xl font-extrabold mb-2">Corridor Intelligence</h1>
          <p className="text-white/70">Bilateral investment flow analysis · Trend tracking · Signal density by corridor</p>
          <div className="flex gap-6 mt-4">
            {[['8','Active corridors'],['$'+totalFDI.toFixed(0)+'B','Total monitored FDI'],['92','Average signals/quarter']].map(([v,l])=>(
              <div key={l}><div className="stat-number text-xl font-bold text-white">{v}</div><div className="text-white/40 text-xs">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2 items-center">
          {['','PLATINUM','GOLD','SILVER'].map(g=>(
            <button key={g} onClick={()=>setFilter(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter===g?'bg-primary text-white':'border border-slate-200 text-slate-500 hover:border-primary'}`}>
              {g||'All Grades'}
            </button>
          ))}
          <div className="flex gap-1 ml-3">
            {[['rank','Rank'],['fdi_b','FDI'],['growth','Growth']].map(([k,l])=>(
              <button key={k} onClick={()=>setSort(k as any)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${sort===k?'bg-deep text-white':'text-slate-500 hover:bg-slate-100'}`}>{l}</button>
            ))}
          </div>
          <button onClick={()=>exportCSV(filtered.map(c=>({From:c.from,To:c.to,'FDI $B':c.fdi_b,'Growth%':c.growth,Grade:c.grade,Signals:c.signals})),'GFM_Corridors')}
            className="ml-auto gfm-btn-outline text-xs py-1.5">Export CSV</button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5 space-y-3">
        {filtered.map(c => {
          const gc  = GRADE_CFG[c.grade] || GRADE_CFG.SILVER;
          const sel = selected === c.id;
          return (
            <div key={c.id} onClick={()=>setSelected(sel?null:c.id)}
              className={`gfm-card cursor-pointer ${sel?'border-primary ring-2 ring-primary ring-offset-1':''}`}>
              <div className="flex items-center gap-4 p-4">
                {/* Rank */}
                <div className="text-2xl font-extrabold text-slate-200 font-mono w-8 text-center flex-shrink-0">#{c.rank}</div>
                {/* Flags + route */}
                <div className="flex items-center gap-2 flex-shrink-0 min-w-36">
                  <span className="text-2xl">{c.flag1}</span>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-700">{c.from}</div>
                    <div className="text-slate-300 text-xs">→</div>
                    <div className="text-xs font-bold text-slate-700">{c.to}</div>
                  </div>
                  <span className="text-2xl">{c.flag2}</span>
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-deep">{c.from} → {c.to}</span>
                    <span className={`gfm-badge ${gc.bg} ${gc.text} ${gc.border}`}>{c.grade}</span>
                    <span className="text-xs text-slate-400">{c.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="font-extrabold text-deep font-mono">${c.fdi_b}B</span>
                    <span className={`font-bold ${TREND_COLOR[c.trend]}`}>{TREND_ICON[c.trend]} {c.growth}% YoY</span>
                    <span className="text-slate-300">|</span>
                    <span>{c.signals} signals</span>
                  </div>
                </div>
                {/* Sparkline */}
                <div className="flex-shrink-0">
                  <Sparkline data={c.hist} color={gc.dot}/>
                  <div className="text-xs text-slate-300 text-center mt-0.5">2021 → 2025</div>
                </div>
              </div>

              {/* Expanded detail */}
              {sel && (
                <div className="border-t border-slate-100 p-5 bg-surface space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                  {/* Historical data table */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">5-Year Historical FDI ($B)</div>
                    <div className="flex gap-3 overflow-x-auto">
                      {[2021,2022,2023,2024,2025].map((yr,i)=>(
                        <div key={yr} className="text-center min-w-12">
                          <div className="h-16 flex items-end justify-center mb-1">
                            <div className="w-8 rounded-t-md transition-all" style={{height:`${(c.hist[i]/Math.max(...c.hist))*100}%`,background:gc.dot,opacity:0.7+(i*0.06)}}/>
                          </div>
                          <div className="text-xs font-mono font-bold text-slate-600">${c.hist[i]}</div>
                          <div className="text-xs text-slate-400">{yr}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>window.location.href='/subscription'} className="gfm-btn-primary text-xs py-1.5 px-5">Corridor Brief — 5 FIC</button>
                    <button className="gfm-btn-outline text-xs py-1.5 px-4">+ Watchlist</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
