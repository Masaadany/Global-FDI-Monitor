'use client';
import { useState } from 'react';

const ECONOMIES = [
  {r:1,  iso3:'SGP',flag:'🇸🇬',name:'Singapore',    region:'East Asia & Pacific',   comp:88.5,etr:88,ict:86,tcm:92,dtf:88,sgt:87,grp:90,tier:'TOP_30',chg:'+0.8',income:'HIC'},
  {r:2,  iso3:'USA',flag:'🇺🇸',name:'United States', region:'North America',         comp:84.5,etr:85,ict:94,tcm:82,dtf:88,sgt:77,grp:78,tier:'TOP_30',chg:'+0.3',income:'HIC'},
  {r:3,  iso3:'CHE',flag:'🇨🇭',name:'Switzerland',   region:'Europe & Central Asia', comp:87.5,etr:82,ict:90,tcm:85,dtf:88,sgt:90,grp:92,tier:'TOP_30',chg:'+0.5',income:'HIC'},
  {r:4,  iso3:'DEU',flag:'🇩🇪',name:'Germany',       region:'Europe & Central Asia', comp:81.5,etr:74,ict:87,tcm:88,dtf:82,sgt:82,grp:86,tier:'TOP_30',chg:'-0.2',income:'HIC'},
  {r:5,  iso3:'SWE',flag:'🇸🇪',name:'Sweden',        region:'Europe & Central Asia', comp:80.0,etr:76,ict:88,tcm:80,dtf:85,sgt:90,grp:88,tier:'TOP_30',chg:'+1.1',income:'HIC'},
  {r:6,  iso3:'IRL',flag:'🇮🇪',name:'Ireland',       region:'Europe & Central Asia', comp:78.5,etr:80,ict:82,tcm:85,dtf:80,sgt:80,grp:88,tier:'TOP_30',chg:'+0.4',income:'HIC'},
  {r:7,  iso3:'NLD',flag:'🇳🇱',name:'Netherlands',   region:'Europe & Central Asia', comp:78.0,etr:75,ict:84,tcm:88,dtf:82,sgt:82,grp:88,tier:'TOP_30',chg:'+0.2',income:'HIC'},
  {r:8,  iso3:'ARE',flag:'🇦🇪',name:'UAE',           region:'MENA',                  comp:80.0,etr:82,ict:72,tcm:92,dtf:88,sgt:91,grp:85,tier:'TOP_30',chg:'+4.2',income:'HIC'},
  {r:14, iso3:'SAU',flag:'🇸🇦',name:'Saudi Arabia',  region:'MENA',                  comp:68.1,etr:75,ict:62,tcm:80,dtf:78,sgt:56,grp:68,tier:'RISING', chg:'+3.1',income:'HIC'},
  {r:17, iso3:'QAT',flag:'🇶🇦',name:'Qatar',         region:'MENA',                  comp:66.2,etr:72,ict:58,tcm:78,dtf:75,sgt:60,grp:72,tier:'RISING', chg:'+2.0',income:'HIC'},
  {r:22, iso3:'IND',flag:'🇮🇳',name:'India',         region:'South Asia',            comp:62.3,etr:88,ict:65,tcm:62,dtf:60,sgt:45,grp:62,tier:'RISING', chg:'+2.8',income:'LMIC'},
  {r:28, iso3:'VNM',flag:'🇻🇳',name:'Vietnam',       region:'East Asia & Pacific',   comp:58.2,etr:82,ict:52,tcm:62,dtf:55,sgt:42,grp:58,tier:'RISING', chg:'+2.1',income:'LMIC'},
  {r:31, iso3:'KEN',flag:'🇰🇪',name:'Kenya',         region:'Sub-Saharan Africa',    comp:54.8,etr:65,ict:32,tcm:55,dtf:48,sgt:40,grp:58,tier:'STABLE',  chg:'+1.9',income:'LMIC'},
  {r:35, iso3:'EGY',flag:'🇪🇬',name:'Egypt',         region:'MENA',                  comp:50.2,etr:58,ict:38,tcm:55,dtf:48,sgt:35,grp:52,tier:'STABLE',  chg:'+1.2',income:'LMIC'},
  {r:40, iso3:'NGA',flag:'🇳🇬',name:'Nigeria',       region:'Sub-Saharan Africa',    comp:42.5,etr:62,ict:28,tcm:45,dtf:38,sgt:32,grp:48,tier:'STABLE',  chg:'+0.8',income:'LMIC'},
];

const TIER_STYLES: Record<string,string> = {
  TOP_30:  'bg-amber-50 text-amber-700 border-amber-200',
  RISING:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  STABLE:  'bg-blue-50 text-blue-700 border-blue-200',
  LAGGARD: 'bg-red-50 text-red-600 border-red-200',
};

const TIER_LABELS: Record<string,string> = {
  TOP_30:'Top 30', RISING:'Rising', STABLE:'Stable', LAGGARD:'Laggard'
};

const DIM_LABELS = ['ETR','ICT','TCM','DTF','SGT','GRP'];
const DIM_FULL = ['Economic Transformation','Innovation & Technology','Trade Connectivity','Digital Foundations','Sustainability & Gov.','Geopolitical Risk Profile'];

export default function GFRPage() {
  const [region, setRegion] = useState('');
  const [tier, setTier] = useState('');
  const [selected, setSelected] = useState(ECONOMIES[7]); // UAE default
  const [sort, setSort] = useState<'rank'|'chg'>('rank');

  const filtered = ECONOMIES
    .filter(e => (!region || e.region === region) && (!tier || e.tier === tier))
    .sort((a,b) => sort === 'rank' ? a.r - b.r : parseFloat(b.chg) - parseFloat(a.chg));

  const dims = selected ? [selected.etr,selected.ict,selected.tcm,selected.dtf,selected.sgt,selected.grp] : [];
  const avg30 = [75,80,78,78,78,82];

  // Simple radar as SVG
  const radar = (scores: number[], ref: number[], W=180, H=180) => {
    const cx=W/2, cy=H/2, r=70;
    const pts = (arr: number[]) => arr.map((v,i) => {
      const angle = (i/6)*2*Math.PI - Math.PI/2;
      const dist = (v/100)*r;
      return [cx+dist*Math.cos(angle), cy+dist*Math.sin(angle)];
    });
    const toStr = (pts: number[][]) => pts.map(p=>p.join(',')).join(' ');
    const subjectPts = pts(scores);
    const refPts = pts(ref);
    const labelPts = pts([108,108,108,108,108,108]);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height:H}}>
        {[20,40,60,80,100].map(p => {
          const rpts = pts([p,p,p,p,p,p]);
          return <polygon key={p} points={toStr(rpts)} fill="none" stroke="#E2E8F0" strokeWidth="0.8" />;
        })}
        {DIM_LABELS.map((_,i) => {
          const angle = (i/6)*2*Math.PI - Math.PI/2;
          return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(angle)} y2={cy+r*Math.sin(angle)} stroke="#E2E8F0" strokeWidth="0.8"/>;
        })}
        <polygon points={toStr(refPts)} fill="rgba(100,116,139,0.08)" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,2" />
        <polygon points={toStr(subjectPts)} fill="rgba(29,78,216,0.12)" stroke="#1D4ED8" strokeWidth="1.5" />
        {subjectPts.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#1D4ED8"/>)}
        {DIM_LABELS.map((l,i) => {
          const [x,y] = labelPts[i];
          return <text key={i} x={x} y={y} textAnchor="middle" fontSize="9" fill="#64748B" fontWeight="600">{l}</text>;
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2 text-slate-600 bg-white"
          value={region} onChange={e=>setRegion(e.target.value)}>
          <option value="">All Regions</option>
          <option value="MENA">MENA</option>
          <option value="East Asia & Pacific">East Asia & Pacific</option>
          <option value="Europe & Central Asia">Europe & Central Asia</option>
          <option value="North America">North America</option>
          <option value="South Asia">South Asia</option>
          <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
        </select>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2 text-slate-600 bg-white"
          value={tier} onChange={e=>setTier(e.target.value)}>
          <option value="">All Tiers</option>
          <option value="TOP_30">Top 30</option>
          <option value="RISING">Rising</option>
          <option value="STABLE">Stable</option>
          <option value="LAGGARD">Laggard</option>
        </select>
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          {(['rank','chg'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${sort===s ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
              {s === 'rank' ? 'By Rank' : 'By Change'}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button className="bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Download Rankings — 5 FIC
          </button>
        </div>
      </div>

      <div className="flex gap-4 p-5">
        {/* Rankings table */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-[48px_1fr_100px_80px_70px_90px] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wide">
              <span>Rank</span><span>Economy</span><span>GFR Score</span>
              <span>Q1 Change</span><span>Tier</span><span>Action</span>
            </div>
            {filtered.map(eco => (
              <div key={eco.iso3}
                onClick={() => setSelected(eco)}
                className={`grid grid-cols-[48px_1fr_100px_80px_70px_90px] gap-3 px-4 py-3 border-b border-slate-50 cursor-pointer items-center transition-colors ${
                  selected?.iso3 === eco.iso3 ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50'
                }`}>
                <span className="text-lg font-black text-blue-600">#{eco.r}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{eco.flag}</span>
                  <div>
                    <div className="text-sm font-bold text-[#0A2540]">{eco.name}</div>
                    <div className="text-xs text-slate-400">{eco.region}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width:`${eco.comp}%`}} />
                  </div>
                  <span className="text-sm font-black text-blue-600 min-w-[28px]">{eco.comp}</span>
                </div>
                <span className={`text-sm font-bold ${parseFloat(eco.chg)>0?'text-emerald-600':'text-red-500'}`}>
                  {eco.chg}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${TIER_STYLES[eco.tier]}`}>
                  {TIER_LABELS[eco.tier]}
                </span>
                <button
                  onClick={e => {e.stopPropagation()}}
                  className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                  Economy Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {selected && (
            <>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{selected.flag}</span>
                  <div>
                    <div className="font-black text-[#0A2540] text-sm">{selected.name}</div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded border inline-block mt-0.5 ${TIER_STYLES[selected.tier]}`}>
                      #{selected.r} · {TIER_LABELS[selected.tier]}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-black text-blue-600">{selected.comp}</div>
                    <div className={`text-xs font-bold ${parseFloat(selected.chg)>0?'text-emerald-600':'text-red-500'}`}>{selected.chg} Q1</div>
                  </div>
                </div>
                {radar(dims, avg30)}
                <div className="flex flex-wrap gap-1 mt-3">
                  {DIM_LABELS.map((d,i) => (
                    <div key={d} className="flex-1 min-w-[45px] bg-slate-50 rounded p-1.5 text-center">
                      <div className="text-[10px] font-bold text-slate-500 mb-0.5">{d}</div>
                      <div className="text-sm font-black text-blue-600">{dims[i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="font-bold text-xs text-[#0A2540] mb-3">Rapid Risers — Q1 2026</div>
                {[{flag:'🇦🇪',name:'UAE',chg:'+4.2'},{flag:'🇸🇦',name:'Saudi Arabia',chg:'+3.1'},{flag:'🇮🇳',name:'India',chg:'+2.8'},{flag:'🇷🇼',name:'Rwanda',chg:'+2.4'},{flag:'🇻🇳',name:'Vietnam',chg:'+2.1'}].map(e => (
                  <div key={e.name} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0 text-xs">
                    <span>{e.flag} {e.name}</span>
                    <span className="font-black text-emerald-600">{e.chg}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="font-bold text-xs text-[#0A2540] mb-2">GFR Intelligence Actions</div>
                <div className="space-y-2">
                  <button className="w-full text-left text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors font-semibold">
                    Economy Profile PDF — 3 FIC
                  </button>
                  <button className="w-full text-left text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:border-blue-300 transition-colors font-semibold">
                    Reform Simulation — 5 FIC
                  </button>
                  <button className="w-full text-left text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:border-blue-300 transition-colors font-semibold">
                    5-Year GFR Trajectory Data
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
