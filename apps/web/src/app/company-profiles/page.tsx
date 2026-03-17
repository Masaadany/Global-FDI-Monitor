'use client';

const SIGNAL_HISTORY: Record<string,number[]> = {
  'GFM-USA-MSFT-12847':[2,3,4,3,5,4,6,5,7,8,9,12],
  'GFM-USA-AMZN-98120':[3,4,5,6,5,7,8,9,10,12,15,18],
  'GFM-CHN-CATL-11234':[1,2,2,3,4,5,6,7,8,9,10,11],
  'GFM-USA-GOOG-77234':[2,3,3,4,5,5,6,7,7,8,9,10],
};

function SignalMiniChart({cic}: {cic:string}) {
  const data = SIGNAL_HISTORY[cic] || [1,2,2,3,3,4];
  const max  = Math.max(...data);
  const W=120, H=32;
  const pts  = data.map((v,i)=>`${(i/(data.length-1)*W).toFixed(1)},${(H-(v/max)*H*0.85+2).toFixed(1)}`).join(' ');
  const area = `0,${H} ${pts} ${W},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-28 h-8">
      <polygon points={area} fill="#3b82f625"/>
      <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
      <circle cx={data.length?W:0} cy={H-(data[data.length-1]/max)*H*0.85+2} r={2.5} fill="#3b82f6"/>
    </svg>
  );
}

import { useState, useMemo, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const COMPANIES_STATIC = [
  {cic:'GFM-USA-MSFT-12847',name:'Microsoft Corporation',hq:'USA',hq_city:'Redmond',sector:'J',sector_name:'ICT',ims:96,rev_b:211.9,employees:221000,listed:true,signals:12,esg:'LEADER',esg_score:77.2,footprints:['GBR','DEU','IND','SGP','ARE','JPN','SAU','IRL','NLD','AUS'],grade:'PLATINUM',founded:1975,ceo:'Satya Nadella',fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-AMZN-98120',name:'Amazon Web Services',hq:'USA',hq_city:'Seattle',sector:'J',sector_name:'ICT',ims:95,rev_b:90.8,employees:1500000,listed:true,signals:18,esg:'LEADER',esg_score:74.1,footprints:['GBR','DEU','IRL','SGP','AUS','IND','SAU','ARE','JPN'],grade:'PLATINUM',founded:2006,ceo:'Andy Jassy',fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-NVDA-66234',name:'NVIDIA Corporation',hq:'USA',hq_city:'Santa Clara',sector:'J',sector_name:'ICT',ims:94,rev_b:60.9,employees:29600,listed:true,signals:14,esg:'LEADER',esg_score:71.2,footprints:['TWN','KOR','GBR','DEU','IND','SGP','IRL'],grade:'PLATINUM',founded:1993,ceo:'Jensen Huang',fdi_stage:'ACTIVE'},
  {cic:'GFM-CHN-CATL-11234',name:'CATL',hq:'CHN',hq_city:'Ningde',sector:'C',sector_name:'Manufacturing',ims:90,rev_b:44.0,employees:102000,listed:true,signals:11,esg:'STRONG',esg_score:62.4,footprints:['DEU','HUN','IDN','AUS','MAR','CAN','MEX'],grade:'PLATINUM',founded:2011,ceo:'Robin Zeng',fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-GOOG-77234',name:'Google (Alphabet)',hq:'USA',hq_city:'Mountain View',sector:'J',sector_name:'ICT',ims:92,rev_b:307.4,employees:181000,listed:true,signals:10,esg:'LEADER',esg_score:73.8,footprints:['IRL','GBR','DEU','SGP','IND','ARE','JPN'],grade:'GOLD',founded:1998,ceo:'Sundar Pichai',fdi_stage:'ACTIVE'},
  {cic:'GFM-KOR-SAMS-33891',name:'Samsung Electronics',hq:'KOR',hq_city:'Suwon',sector:'C',sector_name:'Manufacturing',ims:91,rev_b:234.1,employees:270000,listed:true,signals:9,esg:'STRONG',esg_score:61.8,footprints:['VNM','IND','USA','DEU','GBR','BRA','MEX','IDN'],grade:'GOLD',founded:1969,ceo:'Jong-Hee Han',fdi_stage:'ACTIVE'},
  {cic:'GFM-JPN-TOYT-88123',name:'Toyota Motor Corp',hq:'JPN',hq_city:'Toyota',sector:'C',sector_name:'Manufacturing',ims:87,rev_b:274.5,employees:375000,listed:true,signals:7,esg:'STRONG',esg_score:67.4,footprints:['VNM','IDN','THA','IND','USA','GBR','MEX'],grade:'GOLD',founded:1937,ceo:'Koji Sato',fdi_stage:'ACTIVE'},
  {cic:'GFM-DEU-SINEN-44221',name:'Siemens Energy',hq:'DEU',hq_city:'Munich',sector:'D',sector_name:'Energy',ims:85,rev_b:35.3,employees:92000,listed:true,signals:8,esg:'LEADER',esg_score:72.8,footprints:['GBR','USA','SAU','EGY','AUS','BRA','IND','ZAF'],grade:'GOLD',founded:2020,ceo:'Christian Bruch',fdi_stage:'ACTIVE'},
  {cic:'GFM-DNK-VEST-55123',name:'Vestas Wind Systems',hq:'DNK',hq_city:'Aarhus',sector:'D',sector_name:'Energy',ims:80,rev_b:15.9,employees:29000,listed:true,signals:6,esg:'LEADER',esg_score:78.4,footprints:['GBR','DEU','USA','IND','BRA','AUS','MEX'],grade:'GOLD',founded:1945,ceo:'Henrik Andersen',fdi_stage:'ACTIVE'},
  {cic:'GFM-SAU-ACWA-44512',name:'ACWA Power',hq:'SAU',hq_city:'Riyadh',sector:'D',sector_name:'Energy',ims:86,rev_b:4.2,employees:4000,listed:true,signals:9,esg:'LEADER',esg_score:74.1,footprints:['EGY','MAR','SAU','JOR','PAK','ZAF','UZB'],grade:'GOLD',founded:2004,ceo:'Marco Arcelli',fdi_stage:'ACTIVE'},
  {cic:'GFM-FRA-TTAL-33412',name:'TotalEnergies',hq:'FRA',hq_city:'Paris',sector:'D',sector_name:'Energy',ims:82,rev_b:218.9,employees:101000,listed:true,signals:7,esg:'ACTIVE',esg_score:58.4,footprints:['NGA','SAU','ARE','QAT','USA','AUS','NOR'],grade:'GOLD',founded:1924,ceo:'Patrick Pouyanné',fdi_stage:'ACTIVE'},
  {cic:'GFM-GBR-BHP-55123',name:'BHP Group',hq:'GBR',hq_city:'London',sector:'B',sector_name:'Mining',ims:84,rev_b:53.8,employees:80000,listed:true,signals:6,esg:'STRONG',esg_score:63.4,footprints:['AUS','CHN','USA','BRA','CHL','CAN','COL'],grade:'GOLD',founded:1885,ceo:'Mike Henry',fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-BLR-77891',name:'BlackRock Inc',hq:'USA',hq_city:'New York',sector:'K',sector_name:'Finance',ims:88,rev_b:17.9,employees:21000,listed:true,signals:4,esg:'STRONG',esg_score:64.2,footprints:['GBR','DEU','SGP','HKG','AUS','ARE','JPN'],grade:'SILVER',founded:1988,ceo:'Larry Fink',fdi_stage:'WATCHING'},
  {cic:'GFM-USA-DATA-88234',name:'Databricks',hq:'USA',hq_city:'San Francisco',sector:'J',sector_name:'ICT',ims:82,rev_b:1.6,employees:6000,listed:false,signals:5,esg:'ACTIVE',esg_score:52.0,footprints:['GBR','DEU','SGP','AUS','JPN'],grade:'SILVER',founded:2013,ceo:'Ali Ghodsi',fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-PLTR-25422',name:'Palantir Technologies',hq:'USA',hq_city:'Denver',sector:'J',sector_name:'ICT',ims:84,rev_b:2.23,employees:3900,listed:true,signals:3,esg:'STRONG',esg_score:58.0,footprints:['GBR','DEU','AUS','JPN','FRA'],grade:'GOLD',founded:2003,ceo:'Alex Karp',fdi_stage:'WATCHING'},
  {cic:'GFM-USA-SNOW-11234',name:'Snowflake Inc',hq:'USA',hq_city:'San Mateo',sector:'J',sector_name:'ICT',ims:79,rev_b:2.8,employees:7000,listed:true,signals:3,esg:'STRONG',esg_score:55.0,footprints:['GBR','DEU','SGP','AUS','JPN'],grade:'SILVER',founded:2012,ceo:'Sridhar Ramaswamy',fdi_stage:'WATCHING'},
  {cic:'GFM-DEU-BAYG-22341',name:'BASF SE',hq:'DEU',hq_city:'Ludwigshafen',sector:'C',sector_name:'Manufacturing',ims:79,rev_b:68.9,employees:111000,listed:true,signals:4,esg:'STRONG',esg_score:66.8,footprints:['CHN','USA','BEL','BRA','IND','MYS'],grade:'SILVER',founded:1865,ceo:'Markus Kamieth',fdi_stage:'WATCHING'},
  {cic:'GFM-JPN-SONY-44132',name:'Sony Group',hq:'JPN',hq_city:'Tokyo',sector:'C',sector_name:'Manufacturing',ims:82,rev_b:88.0,employees:109700,listed:true,signals:4,esg:'STRONG',esg_score:60.2,footprints:['USA','GBR','DEU','IND','IDN','MYS'],grade:'SILVER',founded:1946,ceo:'Kenichiro Yoshida',fdi_stage:'WATCHING'},
  {cic:'GFM-USA-APPL-10001',name:'Apple Inc',hq:'USA',hq_city:'Cupertino',sector:'J',sector_name:'ICT',ims:93,rev_b:383.3,employees:161000,listed:true,signals:8,esg:'LEADER',esg_score:72.0,footprints:['IRL','CHN','IND','SGP','GBR','DEU','TWN'],grade:'GOLD',founded:1976,ceo:'Tim Cook',fdi_stage:'WATCHING'},
  {cic:'GFM-CHN-HUAW-55312',name:'Huawei Technologies',hq:'CHN',hq_city:'Shenzhen',sector:'J',sector_name:'ICT',ims:78,rev_b:99.5,employees:207000,listed:false,signals:3,esg:'ACTIVE',esg_score:51.2,footprints:['EGY','NGA','SAU','ARE','IDN','PAK'],grade:'SILVER',founded:1987,ceo:'Ren Zhengfei',fdi_stage:'WATCHING'},
];
const GRADE_COLORS: Record<string,string>={PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};
const STAGE_COLORS: Record<string,string>={ACTIVE:'text-emerald-600',WATCHING:'text-blue-600',EXITED:'text-slate-400'};
const SECTORS=[...new Set(COMPANIES_STATIC.map(c=>c.sector_name))];
const HQS=[...new Set(COMPANIES_STATIC.map(c=>c.hq))].sort();
const GRADES=['PLATINUM','GOLD','SILVER'];

export default function CompanyProfilesPage(){
  const [search,setSearch]=useState('');
  const [sector,setSector]=useState('');
  const [hq,setHQ]=useState('');
  const [grade,setGrade]=useState('');
  const [selected,setSelected]=useState(COMPANIES_STATIC[0]);
  const [sortBy,setSortBy]=useState<'ims'|'signals'|'rev_b'>('ims');

  const filtered=useMemo(()=>COMPANIES_STATIC.filter(c=>
    (!search||c.name.toLowerCase().includes(search.toLowerCase())||c.hq.includes(search.toUpperCase()))&&
    (!sector||c.sector_name===sector)&&(!hq||c.hq===hq)&&(!grade||c.grade===grade)
  ).sort((a,b)=>b[sortBy]-a[sortBy]),[search,sector,hq,grade,sortBy]);

  return(
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Company Intelligence (CIC)</span>
        <input placeholder="Search company, HQ…" value={search} onChange={e=>setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-40 focus:outline-none focus:border-blue-400 ml-2"/>
        {[{v:sector,s:setSector,opts:['',...SECTORS],p:'All Sectors'},
          {v:hq,s:setHQ,opts:['',...HQS],p:'All HQs'},
          {v:grade,s:setGrade,opts:['',...GRADES],p:'All Grades'}
        ].map((f,i)=>(
          <select key={i} value={f.v} onChange={e=>f.s(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs px-2 py-2 focus:outline-none">
            <option value="">{f.p}</option>
            {f.opts.filter(Boolean).map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
        <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)}
          className="border border-slate-200 rounded-lg text-xs px-2 py-2">
          <option value="ims">Sort: IMS Score</option>
          <option value="signals">Sort: Signals</option>
          <option value="rev_b">Sort: Revenue</option>
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length}/{COMPANIES_STATIC.length}</span>
      </div>
      <div className="flex gap-0" style={{height:'calc(100vh-7rem)'}}>
        {/* List */}
        <div className="w-72 flex-shrink-0 border-r border-slate-100 bg-white overflow-y-auto" style={{height:'calc(100vh - 7rem)'}}>
          {filtered.map(co=>(
            <div key={co.cic} onClick={()=>setSelected(co)}
              className={`px-4 py-3.5 border-b border-slate-50 cursor-pointer transition-all ${selected.cic===co.cic?'bg-blue-50 border-l-2 border-l-blue-500':'hover:bg-slate-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{background:GRADE_COLORS[co.grade]}}>{co.sector}</div>
                <div className="font-bold text-sm text-[#0A2540] truncate">{co.name}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 ml-8">
                <span>{co.hq_city}</span><span>·</span>
                <span className="font-bold text-blue-600">IMS:{co.ims}</span><span>·</span>
                <span className={`font-bold ${STAGE_COLORS[co.fdi_stage]}`}>{co.fdi_stage}</span>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div className="text-center py-12 text-slate-400 text-sm">No companies match</div>}
        </div>
        {/* Detail */}
        <div className="flex-1 p-5 overflow-y-auto" style={{height:'calc(100vh - 7rem)'}}>
          <div className="max-w-2xl space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-black text-[#0A2540]">{selected.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{selected.cic}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selected.hq_city}, {selected.hq} · Founded {selected.founded} · {selected.listed?'Public':'Private'} · CEO: {selected.ceo}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-blue-600">{selected.ims}</div>
                  <div className="text-xs text-slate-400">IMS Score</div>
                  <span className="text-xs font-black px-2 py-0.5 rounded mt-1 inline-block text-white"
                    style={{background:GRADE_COLORS[selected.grade]}}>{selected.grade}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[{l:'Revenue',v:`$${selected.rev_b}B`,c:'text-blue-600'},
                  {l:'Employees',v:selected.employees>=1e6?`${(selected.employees/1e6).toFixed(1)}M`:selected.employees.toLocaleString(),c:'text-slate-700'},
                  {l:'Sector',v:`ISIC ${selected.sector}`,c:'text-violet-600'},
                  {l:'FDI Stage',v:selected.fdi_stage,c:STAGE_COLORS[selected.fdi_stage]},
                ].map(s=>(
                  <div key={s.l} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                    <div className={`text-sm font-black ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">IMS Score</span>
                  <span className="font-bold text-blue-600">{selected.ims}/100</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{width:`${selected.ims}%`}}/>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 mb-2">Investment Footprint ({selected.footprints.length} economies)</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.footprints.map(iso=>(
                    <span key={iso} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">{iso}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm text-[#0A2540]">ESG Profile</div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{selected.esg}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{width:`${selected.esg_score}%`}}/>
                </div>
                <span className="text-xl font-black text-emerald-600">{selected.esg_score}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="font-bold text-sm text-[#0A2540] mb-3">Intelligence Actions</div>
              <div className="grid grid-cols-2 gap-2">
                {[{label:'Full CIC Report',cost:'5 FIC',icon:'📋'},{label:'Add to Pipeline',cost:'Free',icon:'➕'},
                  {label:'View Signals',cost:'Free',icon:'📡'},{label:'Mission Dossier',cost:'30 FIC',icon:'🎯'}
                ].map(a=>(
                  <button key={a.label} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors text-xs text-left">
                    <span className="text-lg">{a.icon}</span>
                    <div><div className="font-bold text-[#0A2540]">{a.label}</div><div className="text-slate-400">{a.cost}</div></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
