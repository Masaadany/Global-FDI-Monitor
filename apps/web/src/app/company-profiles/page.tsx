'use client';
import { useState } from 'react';

const COMPANIES = [
  {cic:'GFM-USA-MSFT-12847',name:'Microsoft Corporation',hq:'USA',sector:'J',ims:96,rev_b:211.9,employees:221000,listed:true,signals:12,esg:'LEADER',esg_score:77.2,footprints:['GBR','DEU','IND','SGP','ARE','JPN','SAU'],grade:'PLATINUM'},
  {cic:'GFM-USA-AMZN-98120',name:'Amazon Web Services',hq:'USA',sector:'J',ims:95,rev_b:90.8,employees:1500000,listed:true,signals:18,esg:'LEADER',esg_score:74.1,footprints:['GBR','DEU','IRL','SGP','AUS','IND','SAU','ARE'],grade:'PLATINUM'},
  {cic:'GFM-USA-PLTR-25422',name:'Palantir Technologies',hq:'USA',sector:'J',ims:94,rev_b:2.23,employees:3900,listed:true,signals:3,esg:'STRONG',esg_score:58.0,footprints:['GBR','DEU','AUS','JPN'],grade:'GOLD'},
  {cic:'GFM-DEU-SINEN-44221',name:'Siemens Energy',hq:'DEU',sector:'D',ims:85,rev_b:35.3,employees:92000,listed:true,signals:8,esg:'LEADER',esg_score:72.8,footprints:['GBR','USA','SAU','EGY','AUS','BRA','IND'],grade:'GOLD'},
  {cic:'GFM-DNK-VEST-55123',name:'Vestas Wind Systems',hq:'DNK',sector:'D',ims:80,rev_b:15.9,employees:29000,listed:true,signals:6,esg:'LEADER',esg_score:78.4,footprints:['GBR','DEU','USA','IND','BRA','AUS'],grade:'GOLD'},
  {cic:'GFM-USA-BLR-77891',name:'BlackRock Inc',hq:'USA',sector:'K',ims:88,rev_b:17.9,employees:21000,listed:true,signals:4,esg:'STRONG',esg_score:64.2,footprints:['GBR','DEU','SGP','HKG','AUS','ARE'],grade:'SILVER'},
  {cic:'GFM-KOR-SAMS-33891',name:'Samsung Electronics',hq:'KOR',sector:'C',ims:91,rev_b:234.1,employees:270000,listed:true,signals:9,esg:'STRONG',esg_score:61.8,footprints:['VNM','IND','USA','DEU','GBR','BRA'],grade:'GOLD'},
  {cic:'GFM-USA-DATA-88234',name:'Databricks',hq:'USA',sector:'J',ims:82,rev_b:1.6,employees:6000,listed:false,signals:5,esg:'ACTIVE',esg_score:52.0,footprints:['GBR','DEU','SGP','AUS'],grade:'SILVER'},
];

const GRADE_COLORS: Record<string,string> = {PLATINUM:'#f59e0b',GOLD:'#10b981',SILVER:'#3b82f6',BRONZE:'#6b7280'};

export default function CompanyProfilesPage() {
  const [search,   setSearch]   = useState('');
  const [sector,   setSector]   = useState('');
  const [selected, setSelected] = useState(COMPANIES[0]);

  const filtered = COMPANIES.filter(c=>
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.hq.includes(search.toUpperCase())) &&
    (!sector || c.sector===sector)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Company Intelligence (CIC)</span>
        <input placeholder="Search company or HQ…" value={search} onChange={e=>setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-48 focus:outline-none focus:border-blue-400 ml-2"/>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2"
          value={sector} onChange={e=>setSector(e.target.value)}>
          <option value="">All Sectors</option>
          {[['J','Technology'],['K','Finance'],['D','Energy'],['C','Manufacturing']].map(([v,l])=>(
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} companies</span>
      </div>

      <div className="flex gap-0">
        {/* List */}
        <div className="w-80 flex-shrink-0 border-r border-slate-100 bg-white overflow-y-auto" style={{height:'calc(100vh - 7rem)'}}>
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
        </div>

        {/* Detail */}
        <div className="flex-1 p-5 overflow-y-auto" style={{height:'calc(100vh - 7rem)'}}>
          <div className="max-w-2xl space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-black text-[#0A2540]">{selected.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">{selected.cic}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-blue-600">{selected.ims}</div>
                  <div className="text-xs text-slate-400">IMS Score</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  {l:'Revenue',   v:`$${selected.rev_b}B`,c:'text-blue-600'},
                  {l:'Employees', v:selected.employees.toLocaleString(),c:'text-slate-700'},
                  {l:'HQ',        v:selected.hq,c:'text-violet-600'},
                  {l:'Listing',   v:selected.listed?'Public':'Private',c:'text-emerald-600'},
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
              <div className="font-bold text-xs text-[#0A2540] mb-2">Investment Footprint</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.footprints.map(iso=>(
                  <span key={iso} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">{iso}</span>
                ))}
              </div>
            </div>
            {/* ESG */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm text-[#0A2540]">ESG Profile</div>
                <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">{selected.esg}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{width:`${selected.esg_score}%`}}/>
                </div>
                <span className="text-xl font-black text-emerald-600">{selected.esg_score}</span>
              </div>
            </div>
            {/* Signals */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm text-[#0A2540]">Active Signals ({selected.signals})</div>
                <span className="text-xs px-2 py-0.5 rounded font-black text-white" style={{background:GRADE_COLORS[selected.grade]}}>{selected.grade}</span>
              </div>
              <button className="w-full bg-[#0A2540] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#1D4ED8] transition-colors">
                View Full CIC Report — 5 FIC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
