'use client';
import { useState, useMemo } from 'react';

const COMPANIES = [
  {cic:'GFM-USA-MSFT-12847',name:'Microsoft Corporation',hq:'USA',hq_city:'Redmond',sector:'J',sector_name:'ICT',ims:96,rev_b:211.9,employees:221000,listed:true,signals:12,esg:'LEADER',esg_score:77.2,footprints:['GBR','DEU','IND','SGP','ARE','JPN','SAU','IRL','NLD','AUS'],grade:'PLATINUM',founded:1975,ceo:'Satya Nadella'},
  {cic:'GFM-USA-AMZN-98120',name:'Amazon Web Services',hq:'USA',hq_city:'Seattle',sector:'J',sector_name:'ICT',ims:95,rev_b:90.8,employees:1500000,listed:true,signals:18,esg:'LEADER',esg_score:74.1,footprints:['GBR','DEU','IRL','SGP','AUS','IND','SAU','ARE','JPN','BRA'],grade:'PLATINUM',founded:2006,ceo:'Andy Jassy'},
  {cic:'GFM-DEU-SINEN-44221',name:'Siemens Energy',hq:'DEU',hq_city:'Munich',sector:'D',sector_name:'Energy',ims:85,rev_b:35.3,employees:92000,listed:true,signals:8,esg:'LEADER',esg_score:72.8,footprints:['GBR','USA','SAU','EGY','AUS','BRA','IND','ZAF','MAR'],grade:'GOLD',founded:2020,ceo:'Christian Bruch'},
  {cic:'GFM-DNK-VEST-55123',name:'Vestas Wind Systems',hq:'DNK',hq_city:'Aarhus',sector:'D',sector_name:'Energy',ims:80,rev_b:15.9,employees:29000,listed:true,signals:6,esg:'LEADER',esg_score:78.4,footprints:['GBR','DEU','USA','IND','BRA','AUS','MEX','ESP'],grade:'GOLD',founded:1945,ceo:'Henrik Andersen'},
  {cic:'GFM-USA-BLR-77891',name:'BlackRock Inc',hq:'USA',hq_city:'New York',sector:'K',sector_name:'Finance',ims:88,rev_b:17.9,employees:21000,listed:true,signals:4,esg:'STRONG',esg_score:64.2,footprints:['GBR','DEU','SGP','HKG','AUS','ARE','JPN','CHN'],grade:'SILVER',founded:1988,ceo:'Larry Fink'},
  {cic:'GFM-KOR-SAMS-33891',name:'Samsung Electronics',hq:'KOR',hq_city:'Suwon',sector:'C',sector_name:'Manufacturing',ims:91,rev_b:234.1,employees:270000,listed:true,signals:9,esg:'STRONG',esg_score:61.8,footprints:['VNM','IND','USA','DEU','GBR','BRA','MEX','IDN'],grade:'GOLD',founded:1969,ceo:'Jong-Hee Han'},
  {cic:'GFM-USA-DATA-88234',name:'Databricks',hq:'USA',hq_city:'San Francisco',sector:'J',sector_name:'ICT',ims:82,rev_b:1.6,employees:6000,listed:false,signals:5,esg:'ACTIVE',esg_score:52.0,footprints:['GBR','DEU','SGP','AUS','JPN'],grade:'SILVER',founded:2013,ceo:'Ali Ghodsi'},
  {cic:'GFM-USA-PLTR-25422',name:'Palantir Technologies',hq:'USA',hq_city:'Denver',sector:'J',sector_name:'ICT',ims:84,rev_b:2.23,employees:3900,listed:true,signals:3,esg:'STRONG',esg_score:58.0,footprints:['GBR','DEU','AUS','JPN','FRA'],grade:'GOLD',founded:2003,ceo:'Alex Karp'},
  {cic:'GFM-CHN-CATL-11234',name:'CATL',hq:'CHN',hq_city:'Ningde',sector:'C',sector_name:'Manufacturing',ims:90,rev_b:44.0,employees:102000,listed:true,signals:11,esg:'STRONG',esg_score:62.4,footprints:['DEU','HUN','IDN','AUS','MAR','CAN','MEX'],grade:'PLATINUM',founded:2011,ceo:'Robin Zeng'},
  {cic:'GFM-USA-NVDA-66234',name:'NVIDIA Corporation',hq:'USA',hq_city:'Santa Clara',sector:'J',sector_name:'ICT',ims:94,rev_b:60.9,employees:29600,listed:true,signals:14,esg:'LEADER',esg_score:71.2,footprints:['TWN','KOR','GBR','DEU','IND','SGP','JPN','IRL'],grade:'PLATINUM',founded:1993,ceo:'Jensen Huang'},
  {cic:'GFM-DEU-BAYG-22341',name:'BASF SE',hq:'DEU',hq_city:'Ludwigshafen',sector:'C',sector_name:'Manufacturing',ims:79,rev_b:68.9,employees:111000,listed:true,signals:4,esg:'STRONG',esg_score:66.8,footprints:['CHN','USA','BEL','BRA','IND','MYS','ZAF','MEX'],grade:'SILVER',founded:1865,ceo:'Markus Kamieth'},
  {cic:'GFM-FRA-TTAL-33412',name:'TotalEnergies',hq:'FRA',hq_city:'Paris',sector:'D',sector_name:'Energy',ims:82,rev_b:218.9,employees:101000,listed:true,signals:7,esg:'ACTIVE',esg_score:58.4,footprints:['NGA','SAU','ARE','QAT','USA','AUS','NOR','AZE'],grade:'GOLD',founded:1924,ceo:'Patrick Pouyanné'},
  {cic:'GBR-BHP-55123',name:'BHP Group',hq:'GBR',hq_city:'London',sector:'B',sector_name:'Mining',ims:84,rev_b:53.8,employees:80000,listed:true,signals:6,esg:'STRONG',esg_score:63.4,footprints:['AUS','CHN','USA','BRA','CHL','CAN','COL'],grade:'GOLD',founded:1885,ceo:'Mike Henry'},
  {cic:'GFM-USA-APPL-10001',name:'Apple Inc',hq:'USA',hq_city:'Cupertino',sector:'J',sector_name:'ICT',ims:93,rev_b:383.3,employees:161000,listed:true,signals:8,esg:'LEADER',esg_score:72.0,footprints:['IRL','CHN','IND','SGP','GBR','DEU','JPN','TWN'],grade:'GOLD',founded:1976,ceo:'Tim Cook'},
  {cic:'GFM-JPN-SONY-44132',name:'Sony Group',hq:'JPN',hq_city:'Tokyo',sector:'C',sector_name:'Manufacturing',ims:82,rev_b:88.0,employees:109700,listed:true,signals:4,esg:'STRONG',esg_score:60.2,footprints:['USA','GBR','DEU','IND','IDN','MYS','SGP'],grade:'SILVER',founded:1946,ceo:'Kenichiro Yoshida'},
];

const SECTORS  = [...new Set(COMPANIES.map(c=>c.sector_name))];
const HQS      = [...new Set(COMPANIES.map(c=>c.hq))];
const GRADES   = ['PLATINUM','GOLD','SILVER','BRONZE'];
const GRADE_COLORS: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

export default function CompanyProfilesPage() {
  const [search,   setSearch]   = useState('');
  const [sector,   setSector]   = useState('');
  const [hq,       setHQ]       = useState('');
  const [grade,    setGrade]    = useState('');
  const [selected, setSelected] = useState(COMPANIES[0]);

  const filtered = useMemo(()=>COMPANIES.filter(c=>
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.hq.includes(search.toUpperCase())) &&
    (!sector || c.sector_name===sector) &&
    (!hq     || c.hq===hq) &&
    (!grade  || c.grade===grade)
  ),[search,sector,hq,grade]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Company Intelligence</span>
        <input placeholder="Search company, HQ…" value={search} onChange={e=>setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-40 focus:outline-none focus:border-blue-400 ml-2"/>
        {[
          {val:sector,set:setSector,opts:['',  ...SECTORS],placeholder:'All Sectors'},
          {val:hq,    set:setHQ,    opts:['',  ...HQS],    placeholder:'All HQs'},
          {val:grade, set:setGrade, opts:['',  ...GRADES],  placeholder:'All Grades'},
        ].map((f,i)=>(
          <select key={i} value={f.val} onChange={e=>f.set(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs px-2 py-2 focus:outline-none">
            <option value="">{f.placeholder}</option>
            {f.opts.filter(Boolean).map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} of {COMPANIES.length} companies</span>
      </div>

      <div className="flex gap-0" style={{height:'calc(100vh - 7rem)'}}>
        {/* List */}
        <div className="w-80 flex-shrink-0 border-r border-slate-100 bg-white overflow-y-auto">
          {filtered.map(co=>(
            <div key={co.cic} onClick={()=>setSelected(co)}
              className={`px-4 py-3.5 border-b border-slate-50 cursor-pointer transition-all ${selected.cic===co.cic?'bg-blue-50 border-l-2 border-l-blue-500':'hover:bg-slate-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{background:GRADE_COLORS[co.grade]}}>{co.sector}</div>
                <div className="font-bold text-sm text-[#0A2540] truncate">{co.name}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 ml-8">
                <span>{co.hq}</span><span>·</span>
                <span className="font-bold text-blue-600">IMS:{co.ims}</span><span>·</span>
                <span>{co.signals} signals</span>
              </div>
            </div>
          ))}
          {filtered.length===0 && (
            <div className="text-center py-12 text-slate-400">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm">No companies match</div>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="max-w-2xl space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-black text-[#0A2540]">{selected.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{selected.cic}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selected.hq_city}, {selected.hq} · Founded {selected.founded} · CEO: {selected.ceo}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-blue-600">{selected.ims}</div>
                  <div className="text-xs text-slate-400">IMS Score</div>
                  <span className="text-xs font-black px-2 py-0.5 rounded mt-1 inline-block text-white"
                    style={{background:GRADE_COLORS[selected.grade]}}>{selected.grade}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  {l:'Revenue',    v:`$${selected.rev_b}B`, c:'text-blue-600'},
                  {l:'Employees',  v:selected.employees>=1000000?`${(selected.employees/1000000).toFixed(1)}M`:selected.employees.toLocaleString(), c:'text-slate-700'},
                  {l:'Sector',     v:`ISIC ${selected.sector}`, c:'text-violet-600'},
                  {l:'Listing',    v:selected.listed?'Public':'Private', c:'text-emerald-600'},
                ].map(s=>(
                  <div key={s.l} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                    <div className={`text-sm font-black ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Investment Motivation Score (IMS)</span>
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

            {/* ESG */}
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

            {/* Actions */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="font-bold text-sm text-[#0A2540] mb-3">Intelligence Actions</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {label:'Full CIC Report',    cost:'5 FIC',  icon:'📋'},
                  {label:'Add to Pipeline',    cost:'Free',   icon:'➕'},
                  {label:'View Signals',       cost:'Free',   icon:'📡'},
                  {label:'Mission Dossier',    cost:'30 FIC', icon:'🎯'},
                ].map(a=>(
                  <button key={a.label} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors text-xs text-left">
                    <span className="text-lg">{a.icon}</span>
                    <div>
                      <div className="font-bold text-[#0A2540]">{a.label}</div>
                      <div className="text-slate-400">{a.cost}</div>
                    </div>
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
