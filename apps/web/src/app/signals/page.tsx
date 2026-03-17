'use client';
import { useState, useEffect } from 'react';

const SIGNALS = [
  { id:'1', signal_code:'MSS-GFS-ARE-20260315-0001', grade:'PLATINUM', signal_type:'GFS', type_label:'Greenfield FDI', company:'Microsoft Corp', hq:'USA', economy_iso3:'ARE', economy:'UAE', sector:'J', headline:'Microsoft announces $850M data centre campus in Abu Dhabi', summary:'Microsoft Corporation has confirmed a major cloud infrastructure expansion in the UAE with a new hyperscale data centre campus in Abu Dhabi\'s industrial zone, expected to create 1,200 high-skill technology jobs.', capex_usd:850_000_000, jobs:1200, sci:91.2, date:'15 Mar 2026', hours_ago:2 },
  { id:'2', signal_code:'MSS-CES-SAU-20260315-0002', grade:'PLATINUM', signal_type:'CES', type_label:'Corporate Expansion', company:'Amazon Web Services', hq:'USA', economy_iso3:'SAU', economy:'Saudi Arabia', sector:'J', headline:'AWS announces $5.3B Saudi Arabia cloud region expansion', summary:'Amazon Web Services is investing $5.3B to expand its Saudi Arabia cloud region with new availability zones, expected to create 2,100 skilled technology jobs and support Vision 2030 digital transformation goals.', capex_usd:5_300_000_000, jobs:2100, sci:89.5, date:'14 Mar 2026', hours_ago:18 },
  { id:'3', signal_code:'MSS-GFS-VNM-20260315-0003', grade:'GOLD', signal_type:'GFS', type_label:'Greenfield FDI', company:'Samsung Electronics', hq:'South Korea', economy_iso3:'VNM', economy:'Vietnam', sector:'C', headline:'Samsung confirms $2.8B semiconductor packaging facility in Vietnam', summary:'Samsung Electronics will construct a new advanced semiconductor packaging and testing facility in Hanoi Industrial Zone with $2.8B investment over three years, creating 6,000 jobs.', capex_usd:2_800_000_000, jobs:6000, sci:82.1, date:'13 Mar 2026', hours_ago:42 },
  { id:'4', signal_code:'MSS-MAI-SAU-20260315-0004', grade:'GOLD', signal_type:'MAI', type_label:'M&A', company:'BlackRock Inc', hq:'USA', economy_iso3:'SAU', economy:'Saudi Arabia', sector:'K', headline:'BlackRock acquires leading Saudi asset management firm for $1.2B', summary:'BlackRock has completed the acquisition of Jadwa Investment Co., one of Saudi Arabia\'s leading asset management firms, as part of its MENA expansion strategy.', capex_usd:1_200_000_000, jobs:450, sci:78.4, date:'12 Mar 2026', hours_ago:66 },
  { id:'5', signal_code:'MSS-GFS-EGY-20260315-0005', grade:'GOLD', signal_type:'GFS', type_label:'Greenfield FDI', company:'Siemens Energy', hq:'Germany', economy_iso3:'EGY', economy:'Egypt', sector:'D', headline:'Siemens Energy wins $340M wind turbine contract in Suez Canal Zone', summary:'Siemens Energy will supply 200 wind turbines for a major renewable energy project in the Suez Canal Economic Zone, with plans to establish a local manufacturing hub.', capex_usd:340_000_000, jobs:800, sci:74.2, date:'11 Mar 2026', hours_ago:90 },
  { id:'6', signal_code:'MSS-VCM-IND-20260315-0006', grade:'GOLD', signal_type:'VCM', type_label:'VC/PE Investment', company:'Sequoia Capital India', hq:'USA', economy_iso3:'IND', economy:'India', sector:'J', headline:'Sequoia Capital leads $280M Series C in Indian FinTech startup', summary:'Sequoia Capital India has led a $280M Series C funding round in Razorpay competitor MindPay, valuing the Mumbai-based fintech at $2.1B ahead of planned IPO in 2027.', capex_usd:280_000_000, jobs:600, sci:70.8, date:'10 Mar 2026', hours_ago:114 },
  { id:'7', signal_code:'MSS-REI-ARE-20260315-0007', grade:'SILVER', signal_type:'REI', type_label:'Real Estate', company:'Nuveen Asset Management', hq:'USA', economy_iso3:'ARE', economy:'UAE', sector:'L', headline:'Nuveen commits $500M to UAE commercial real estate portfolio', summary:'Nuveen Asset Management has announced a $500M commitment to build a diversified UAE commercial real estate portfolio, focusing on Grade-A office and logistics assets in Dubai and Abu Dhabi.', capex_usd:500_000_000, jobs:120, sci:65.3, date:'09 Mar 2026', hours_ago:138 },
  { id:'8', signal_code:'MSS-JVP-IND-20260315-0008', grade:'SILVER', signal_type:'JVP', type_label:'Joint Venture', company:'Airbus SE', hq:'France', economy_iso3:'IND', economy:'India', sector:'C', headline:'Airbus forms JV with Tata Advanced Systems for helicopter manufacturing', summary:'Airbus and Tata Advanced Systems have formed a 51/49 joint venture to manufacture H125 helicopters in India under the Make-in-India initiative, with planned production capacity of 40 units per year.', capex_usd:180_000_000, jobs:1400, sci:62.7, date:'08 Mar 2026', hours_ago:162 },
];

const GRADE_STYLES: Record<string,string> = {
  PLATINUM: 'bg-amber-50 text-amber-700 border-amber-200',
  GOLD:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  SILVER:   'bg-blue-50 text-blue-700 border-blue-200',
  BRONZE:   'bg-slate-100 text-slate-500 border-slate-200',
};

const TYPE_COLORS: Record<string,string> = {
  GFS:'bg-blue-100 text-blue-700',
  MAI:'bg-violet-100 text-violet-700',
  VCM:'bg-emerald-100 text-emerald-700',
  CES:'bg-orange-100 text-orange-700',
  REI:'bg-pink-100 text-pink-700',
  JVP:'bg-teal-100 text-teal-700',
  EOC:'bg-yellow-100 text-yellow-700',
  ESG:'bg-lime-100 text-lime-700',
};

function formatCapex(n: number) {
  if (n>=1e12) return `$${(n/1e12).toFixed(1)}T`;
  if (n>=1e9)  return `$${(n/1e9).toFixed(1)}B`;
  if (n>=1e6)  return `$${(n/1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export default function SignalsPage() {
  const [filters, setFilters] = useState({grade:'',type:'',economy:'',sector:'',search:''});
  const [selected, setSelected] = useState<typeof SIGNALS[0]|null>(null);
  const [liveCount, setLiveCount] = useState(8742);

  useEffect(() => {
    const id = setInterval(() => setLiveCount(c => c + Math.floor(Math.random()*2)), 2000);
    return () => clearInterval(id);
  }, []);

  const filtered = SIGNALS.filter(s => {
    if (filters.grade && s.grade !== filters.grade) return false;
    if (filters.type && s.signal_type !== filters.type) return false;
    if (filters.economy && s.economy_iso3 !== filters.economy) return false;
    if (filters.sector && s.sector !== filters.sector) return false;
    if (filters.search && !s.headline.toLowerCase().includes(filters.search.toLowerCase()) &&
        !s.company.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Filter bar */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <input
          placeholder="Search signals, companies..."
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-56 focus:outline-none focus:border-blue-400"
          value={filters.search}
          onChange={e => setFilters(f=>({...f,search:e.target.value}))}
        />
        {[
          { key:'grade', label:'Grade', opts:[['','All Grades'],['PLATINUM','Platinum'],['GOLD','Gold'],['SILVER','Silver'],['BRONZE','Bronze']] },
          { key:'type', label:'Type', opts:[['','All Types'],['GFS','Greenfield FDI'],['MAI','M&A'],['VCM','VC/PE'],['CES','Expansion'],['REI','Real Estate'],['JVP','Joint Venture'],['EOC','Energy'],['ESG','ESG']] },
          { key:'economy', label:'Economy', opts:[['','All Economies'],['ARE','UAE'],['SAU','Saudi Arabia'],['IND','India'],['EGY','Egypt'],['VNM','Vietnam']] },
          { key:'sector', label:'Sector', opts:[['','All Sectors'],['J','Technology (J)'],['K','Financial (K)'],['C','Manufacturing (C)'],['D','Energy (D)'],['L','Real Estate (L)']] },
        ].map(f => (
          <select key={f.key}
            className="border border-slate-200 rounded-lg text-xs px-2 py-2 text-slate-600 bg-white focus:outline-none focus:border-blue-400"
            value={(filters as any)[f.key]}
            onChange={e => setFilters(prev => ({...prev,[f.key]:e.target.value}))}>
            {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <button onClick={() => setFilters({grade:'',type:'',economy:'',sector:'',search:''})}
          className="text-xs text-slate-400 hover:text-blue-600 transition-colors px-2">
          Clear all
        </button>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1.5 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {liveCount.toLocaleString()} signals (7d)
          </div>
          <span className="text-xs text-slate-400">{filtered.length} shown</span>
        </div>
      </div>

      <div className="flex">
        {/* Signal list */}
        <div className="flex-1 p-5">
          <div className="space-y-3">
            {filtered.map(sig => (
              <div key={sig.id}
                onClick={() => setSelected(selected?.id===sig.id ? null : sig)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
                  selected?.id===sig.id ? 'border-blue-300 shadow-sm bg-blue-50/30' : 'border-slate-100'
                }`}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${GRADE_STYLES[sig.grade]}`}>
                      {sig.grade.slice(0,4)}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${TYPE_COLORS[sig.signal_type] ?? 'bg-slate-100 text-slate-500'}`}>
                      {sig.signal_type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-[#0A2540] mb-1 leading-snug">{sig.headline}</div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-600">{sig.company}</span>
                      <span>·</span><span>{sig.hq}</span>
                      <span>·</span><span>→ {sig.economy}</span>
                      <span>·</span><span>{sig.hours_ago}h ago</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {formatCapex(sig.capex_usd)}
                      </span>
                      <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded text-xs">
                        {sig.jobs.toLocaleString()} jobs
                      </span>
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs">
                        SCI: {sig.sci}
                      </span>
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-mono">
                        {sig.signal_code}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Expanded view */}
                {selected?.id===sig.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{sig.summary}</p>
                    <div className="flex gap-3">
                      <button className="bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        View Full Record — 1 FIC
                      </button>
                      <button className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-colors">
                        Add to Watchlist
                      </button>
                      <button className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-colors">
                        Generate Report →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <div className="text-3xl mb-3">🔍</div>
                <div className="font-semibold">No signals match your filters</div>
                <div className="text-sm mt-1">Try adjusting the filter criteria above</div>
              </div>
            )}
          </div>
        </div>

        {/* Intelligence sidebar */}
        <aside className="w-72 bg-white border-l border-slate-100 p-5 flex-shrink-0 sticky top-28 self-start">
          <div className="font-bold text-sm text-[#0A2540] mb-4">Signal Intelligence</div>
          {[
            {label:'Total Signals (7d)', value: liveCount.toLocaleString(), color:'text-blue-700'},
            {label:'Platinum Signals (7d)', value:'312', color:'text-amber-600'},
            {label:'New Today', value:'89', color:'text-emerald-600'},
          ].map(k => (
            <div key={k.label} className="bg-slate-50 rounded-lg p-3 mb-3">
              <div className="text-xs text-slate-400 font-medium mb-1">{k.label}</div>
              <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
            </div>
          ))}
          <div className="font-semibold text-xs text-[#0A2540] mb-3 mt-4">Top Sectors (7d)</div>
          {[['Technology',342],['Financial Services',287],['Energy',198],['Manufacturing',176],['Real Estate',154]].map(([s,n]) => (
            <div key={s} className="flex items-center gap-2 py-1.5 border-b border-slate-50">
              <span className="text-xs text-slate-600 flex-1">{s}</span>
              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{width:`${Number(n)/3.5}%`}}/>
              </div>
              <span className="text-xs font-bold text-slate-500 w-7 text-right">{n}</span>
            </div>
          ))}
          <div className="font-semibold text-xs text-[#0A2540] mb-3 mt-5">Top Investors by IMS</div>
          {[['Microsoft','USA',98],['Amazon (AWS)','USA',95],['Siemens','Germany',91],['Samsung','Korea',89],['LVMH','France',84]].map(([co,hq,ims]) => (
            <div key={co} className="flex items-center gap-2 py-1.5 border-b border-slate-50">
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#0A2540]">{co}</div>
                <div className="text-xs text-slate-400">{hq}</div>
              </div>
              <div className="text-base font-black text-blue-600">{ims}</div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
