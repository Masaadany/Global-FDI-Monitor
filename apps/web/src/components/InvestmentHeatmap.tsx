'use client';
import { useState } from 'react';

type MetricKey = 'fdi_b'|'gfr'|'signals'|'gdp_b';

const HEATMAP_DATA = [
  // [iso3, name, region, fdi_b, gfr, signals, gdp_b]
  ['USA','United States','NAM',285,84.5,28,27360],['CHN','China','EAP',163,61.8,22,17795],
  ['SGP','Singapore','EAP',141,88.5,15,501],['IRL','Ireland','ECA',94,76.5,6,529],
  ['NLD','Netherlands','ECA',92,80.5,7,1081],['IND','India','SAS',71,62.3,18,3730],
  ['BRA','Brazil','LAC',65,54.2,10,2130],['AUS','Australia','EAP',59,82.1,7,1688],
  ['DEU','Germany','ECA',35,78.1,8,4430],['ARE','UAE','MENA',30,80.0,12,504],
  ['JPN','Japan','EAP',30,79.3,6,4213],['GBR','UK','ECA',52,78.5,11,3079],
  ['SAU','Saudi Arabia','MENA',28,68.1,9,1069],['FRA','France','ECA',28,76.2,7,2924],
  ['KOR','S.Korea','EAP',18,77.8,5,1710],['VNM','Vietnam','EAP',18,58.2,9,430],
  ['CAN','Canada','NAM',48,83.1,6,2140],['MEX','Mexico','LAC',36,54.0,7,1328],
  ['IDN','Indonesia','EAP',22,57.1,8,1371],['THA','Thailand','EAP',9,63.1,5,545],
  ['MYS','Malaysia','EAP',14,66.4,6,430],['TUR','Turkey','ECA',12,52.0,5,1108],
  ['POL','Poland','ECA',20,62.0,4,750],['ESP','Spain','ECA',27,70.0,5,1580],
  ['ZAF','S.Africa','SSA',5,51.3,4,373],['NGA','Nigeria','SSA',4,42.1,3,477],
  ['KEN','Kenya','SSA',1,51.3,2,118],['EGY','Egypt','MENA',9,52.4,4,395],
  ['QAT','Qatar','MENA',5,71.2,5,236],['CHE','Switzerland','ECA',26,87.5,5,884],
];

const METRIC_CONFIG: Record<MetricKey,{label:string,min:number,max:number,unit:string,fmt:(v:number)=>string}> = {
  fdi_b:   {label:'FDI Inflows',   min:0,   max:300, unit:'$B', fmt:v=>`$${v}B`},
  gfr:     {label:'GFR Score',     min:20,  max:90,  unit:'pts',fmt:v=>`${v}`},
  signals: {label:'Active Signals',min:0,   max:30,  unit:'',   fmt:v=>`${v}`},
  gdp_b:   {label:'GDP',           min:0,   max:30000,unit:'$B',fmt:v=>v>=1000?`$${(v/1000).toFixed(1)}T`:`$${v}B`},
};

const REGION_ORDER = ['MENA','SAS','EAP','ECA','NAM','LAC','SSA'];
const REGION_LABELS: Record<string,string> = {
  MENA:'Middle East & N.Africa',SAS:'South Asia',EAP:'East Asia & Pacific',
  ECA:'Europe & C.Asia',NAM:'North America',LAC:'Latin America',SSA:'Sub-Saharan Africa',
};

function heatColor(value: number, min: number, max: number): string {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  if (t < 0.2)  return '#1e3a5f';
  if (t < 0.4)  return '#1d4ed8';
  if (t < 0.6)  return '#0891b2';
  if (t < 0.75) return '#059669';
  if (t < 0.9)  return '#d97706';
  return '#dc2626';
}

export default function InvestmentHeatmap() {
  const [metric, setMetric] = useState<MetricKey>('fdi_b');
  const [region, setRegion] = useState('');
  const [tooltip, setTooltip] = useState<any>(null);

  const cfg = METRIC_CONFIG[metric];
  const metricIdx = {fdi_b:3,gfr:4,signals:5,gdp_b:6}[metric];

  const filtered = HEATMAP_DATA.filter(d => !region || d[2] === region);
  const grouped  = REGION_ORDER.reduce<Record<string,typeof HEATMAP_DATA>>((acc, r) => {
    acc[r] = filtered.filter(d => d[2] === r);
    return acc;
  }, {});

  const maxVal = Math.max(...filtered.map(d => d[metricIdx] as number));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-slate-100">
        <div className="font-black text-sm text-[#0A2540]">Investment Heatmap</div>
        <div className="flex gap-1">
          {(Object.keys(METRIC_CONFIG) as MetricKey[]).map(m=>(
            <button key={m} onClick={()=>setMetric(m)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                metric===m?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'
              }`}>{METRIC_CONFIG[m].label}</button>
          ))}
        </div>
        <select className="ml-auto text-xs border border-slate-200 rounded-lg px-2 py-1.5"
          value={region} onChange={e=>setRegion(e.target.value)}>
          <option value="">All Regions</option>
          {REGION_ORDER.map(r=><option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="p-4 space-y-3">
        {REGION_ORDER.filter(r => !region || r === region).map(r => {
          const economies = grouped[r];
          if (!economies?.length) return null;
          return (
            <div key={r}>
              <div className="text-xs font-bold text-slate-400 mb-1.5">{REGION_LABELS[r]}</div>
              <div className="flex flex-wrap gap-1.5">
                {economies
                  .sort((a,b) => (b[metricIdx] as number) - (a[metricIdx] as number))
                  .map(eco => {
                    const val   = eco[metricIdx] as number;
                    const bgCol = heatColor(val, cfg.min, Math.max(cfg.max, maxVal * 0.3));
                    return (
                      <div key={eco[0]}
                        onMouseEnter={() => setTooltip({iso3:eco[0],name:eco[1],val,region:r})}
                        onMouseLeave={() => setTooltip(null)}
                        className="relative rounded-lg cursor-default transition-transform hover:scale-105"
                        style={{
                          background:  bgCol,
                          width:       Math.max(48, Math.min(100, (val/maxVal)*80 + 40)),
                          height:      48,
                          display:     'flex',
                          flexDirection:'column',
                          alignItems:  'center',
                          justifyContent:'center',
                          padding:     '4px',
                        }}>
                        <div className="text-white text-xs font-black leading-none">{eco[0]}</div>
                        <div className="text-white/80 text-xs leading-none mt-0.5">{cfg.fmt(val)}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Color scale */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Low</span>
          <div className="flex-1 h-2 rounded-full"
            style={{background:'linear-gradient(to right, #1e3a5f, #1d4ed8, #0891b2, #059669, #d97706, #dc2626)'}}/>
          <span>High</span>
          <span className="ml-2 font-bold text-slate-600">{cfg.label}</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="fixed bg-[#0A2540] text-white text-xs rounded-lg px-3 py-2 pointer-events-none z-50 shadow-lg"
          style={{bottom:20,right:20}}>
          <div className="font-black">{tooltip.name} ({tooltip.iso3})</div>
          <div className="text-blue-200">{tooltip.region}</div>
          <div className="text-white font-black mt-0.5">{cfg.label}: {cfg.fmt(tooltip.val)}</div>
        </div>
      )}
    </div>
  );
}
