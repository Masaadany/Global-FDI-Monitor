'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// /investment-pipeline PAGE — IPA deal pipeline management
// ═══════════════════════════════════════════════════════════════════════════════

const STAGES = ['PROSPECTING','ENGAGEMENT','PRESENTING','NEGOTIATING','COMMITTED','LIVE'];
const STAGE_COLORS: Record<string,string> = {
  PROSPECTING:'bg-slate-200 text-slate-600',  ENGAGEMENT:'bg-blue-100 text-blue-700',
  PRESENTING: 'bg-violet-100 text-violet-700', NEGOTIATING:'bg-amber-100 text-amber-700',
  COMMITTED:  'bg-orange-100 text-orange-700', LIVE:       'bg-emerald-100 text-emerald-700',
};

const PIPELINE = [
  {id:'PL001',company:'Microsoft Corp',    hq:'USA',sector:'J',capex:850,stage:'NEGOTIATING',owner:'JS',prob:0.72,risk:true,  added:'Aug 2025'},
  {id:'PL002',company:'Siemens Energy',    hq:'DEU',sector:'D',capex:340,stage:'COMMITTED',  owner:'SR',prob:0.91,risk:false, added:'Jun 2025'},
  {id:'PL003',company:'BlackRock Inc',     hq:'USA',sector:'K',capex:500,stage:'PRESENTING', owner:'AH',prob:0.58,risk:false, added:'Nov 2025'},
  {id:'PL004',company:'Airbus SE',         hq:'FRA',sector:'C',capex:220,stage:'ENGAGEMENT', owner:'JS',prob:0.45,risk:false, added:'Jan 2026'},
  {id:'PL005',company:'Vestas Wind',       hq:'DNK',sector:'D',capex:180,stage:'PROSPECTING',owner:'SR',prob:0.35,risk:false, added:'Feb 2026'},
  {id:'PL006',company:'Databricks',        hq:'USA',sector:'J',capex:150,stage:'ENGAGEMENT', owner:'AH',prob:0.48,risk:false, added:'Jan 2026'},
  {id:'PL007',company:'Nuveen AM',          hq:'USA',sector:'K',capex:600,stage:'NEGOTIATING',owner:'SR',prob:0.68,risk:true, added:'Sep 2025'},
  {id:'PL008',company:'Samsung Electronics','hq':'KOR',sector:'C',capex:420,stage:'COMMITTED',owner:'JS',prob:0.88,risk:false,added:'Jul 2025'},
];

export function InvestmentPipelinePage() {
  const [view, setView] = useState<'kanban'|'table'>('kanban');
  const [filter, setFilter] = useState('');

  const deals = PIPELINE.filter(d => !filter || d.stage === filter);
  const totalValue = PIPELINE.reduce((s,d) => s+d.capex, 0);
  const expectedValue = Math.round(PIPELINE.reduce((s,d) => s+d.capex*d.prob, 0));
  const atRisk = PIPELINE.filter(d => d.risk).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Investment Pipeline</span>
        <div className="flex gap-1.5 ml-4">
          {(['kanban','table'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${view===v ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
              {v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-4 text-xs">
          {[
            {l:'Total Pipeline',v:`$${totalValue.toLocaleString()}M`,c:'text-blue-700'},
            {l:'Expected Value',v:`$${expectedValue.toLocaleString()}M`,c:'text-emerald-600'},
            {l:'At Risk',v:atRisk,c:'text-amber-600'},
          ].map(s => (
            <div key={s.l}>
              <span className="text-slate-400">{s.l}: </span>
              <span className={`font-black ${s.c}`}>{s.v}</span>
            </div>
          ))}
          <button className="bg-[#1D4ED8] text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Add Deal
          </button>
        </div>
      </div>

      <div className="p-5">
        {view === 'kanban' ? (
          <div className="flex gap-3 overflow-x-auto pb-3">
            {STAGES.map(stage => {
              const stageCo = deals.filter(d => d.stage === stage);
              const stageVal = stageCo.reduce((s,d) => s+d.capex, 0);
              return (
                <div key={stage} className="w-52 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STAGE_COLORS[stage]}`}>{stage}</span>
                    <span className="text-xs text-slate-400">${stageVal.toLocaleString()}M</span>
                  </div>
                  <div className="space-y-2">
                    {stageCo.map(d => (
                      <div key={d.id}
                        className={`bg-white rounded-xl border p-3 cursor-pointer hover:shadow-sm transition-all ${d.risk ? 'border-amber-200' : 'border-slate-100'}`}>
                        <div className="font-semibold text-xs text-[#0A2540] mb-1">{d.company}</div>
                        <div className="text-xs text-slate-400 mb-1.5">{d.hq} · ISIC-{d.sector}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-blue-600">${d.capex}M</span>
                          <span className="text-xs text-emerald-600 font-bold">{Math.round(d.prob*100)}%</span>
                        </div>
                        {d.risk && <div className="text-xs text-amber-600 mt-1 font-semibold">⚠ Stage stalled</div>}
                      </div>
                    ))}
                    {stageCo.length === 0 && <div className="text-xs text-slate-300 text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">Drop deal here</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Company','HQ','Sector','CapEx (M)','Stage','Prob.','Expected','Owner','Added'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PIPELINE.map(d => (
                  <tr key={d.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${d.risk ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3 font-bold text-[#0A2540]">{d.company}{d.risk && ' ⚠'}</td>
                    <td className="px-4 py-3 text-slate-500">{d.hq}</td>
                    <td className="px-4 py-3 text-slate-500">{d.sector}</td>
                    <td className="px-4 py-3 font-black text-blue-600">${d.capex.toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full font-semibold ${STAGE_COLORS[d.stage]}`}>{d.stage}</span></td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{Math.round(d.prob*100)}%</td>
                    <td className="px-4 py-3 font-bold text-slate-600">${Math.round(d.capex*d.prob).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-400">{d.owner}</td>
                    <td className="px-4 py-3 text-slate-400">{d.added}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// /company-profiles PAGE — CIC company deep-dive
// ═══════════════════════════════════════════════════════════════════════════════

const COMPANIES = [
  {cic:'GFM-USA-MSFT-12847',name:'Microsoft Corporation',  hq:'USA',isic:'J',ims:96,rev_b:211.9,employees:221000,status:'listed', signals:12,esg:'LEADER', esg_score:77.2,footprints:['GBR','DEU','IND','SGP','ARE','JPN']},
  {cic:'GFM-USA-PLTR-25422',name:'Palantir Technologies', hq:'USA',isic:'J',ims:94,rev_b:2.23,  employees:3900, status:'listed',  signals:3, esg:'STRONG', esg_score:58.0,footprints:['GBR','DEU','AUS','JPN']},
  {cic:'GFM-USA-AWS-98120',name:'Amazon Web Services',     hq:'USA',isic:'J',ims:95,rev_b:90.8,  employees:1500000,status:'listed',signals:18,esg:'LEADER',esg_score:74.1,footprints:['GBR','DEU','IRL','SGP','AUS','IND','SAU','ARE']},
  {cic:'GFM-DEU-SINEN-44221',name:'Siemens Energy',        hq:'DEU',isic:'D',ims:85,rev_b:35.3,  employees:92000, status:'listed',signals:8, esg:'LEADER', esg_score:72.8,footprints:['GBR','USA','SAU','EGY','AUS','BRA','IND']},
  {cic:'GFM-DNK-VEST-55123', name:'Vestas Wind Systems',   hq:'DNK',isic:'D',ims:80,rev_b:15.9,  employees:29000, status:'listed',signals:6, esg:'LEADER', esg_score:78.4,footprints:['GBR','DEU','USA','IND','BRA','AUS']},
  {cic:'GFM-USA-BLR-77891',  name:'BlackRock Inc',         hq:'USA',isic:'K',ims:88,rev_b:17.9,  employees:21000, status:'listed',signals:4, esg:'STRONG', esg_score:64.2,footprints:['GBR','DEU','SGP','HKG','AUS','ARE']},
];

export function CompanyProfilesPage() {
  const [search, setSearch]   = useState('');
  const [sector, setSector]   = useState('');
  const [selected, setSelected] = useState(COMPANIES[0]);

  const filtered = COMPANIES.filter(c =>
    (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
    (!sector || c.isic === sector)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Company Intelligence (CIC)</span>
        <input placeholder="Search companies…"
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-52 focus:outline-none focus:border-blue-400 ml-4"
          value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2"
          value={sector} onChange={e=>setSector(e.target.value)}>
          <option value="">All Sectors</option>
          <option value="J">J — Technology</option>
          <option value="K">K — Financial</option>
          <option value="D">D — Energy</option>
          <option value="C">C — Manufacturing</option>
        </select>
        <button className="ml-auto bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Full CIC Profile — 5 FIC
        </button>
      </div>

      <div className="flex gap-4 p-5">
        {/* Company list */}
        <div className="w-72 flex-shrink-0 space-y-2">
          {filtered.map(co => (
            <div key={co.cic} onClick={() => setSelected(co)}
              className={`bg-white rounded-xl border p-3.5 cursor-pointer transition-all hover:shadow-sm ${
                selected.cic===co.cic ? 'border-blue-300 bg-blue-50/30' : 'border-slate-100'
              }`}>
              <div className="font-bold text-sm text-[#0A2540] mb-1">{co.name}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>{co.hq}</span><span>·</span><span>ISIC-{co.isic}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">IMS:{co.ims}</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">{co.signals} signals</span>
                <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded font-bold">{co.esg}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Company detail */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xl font-black text-[#0A2540]">{selected.name}</div>
                <div className="text-xs text-slate-400 mt-1 font-mono">{selected.cic}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-600">{selected.ims}</div>
                <div className="text-xs text-slate-400 font-bold">IMS Score</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                {l:'Revenue',v:`$${selected.rev_b.toFixed(1)}B`,c:'text-blue-600'},
                {l:'Employees',v:selected.employees.toLocaleString(),c:'text-slate-700'},
                {l:'Sector',v:`ISIC-${selected.isic}`,c:'text-violet-600'},
                {l:'Listing',v:selected.status,c:'text-emerald-600'},
              ].map(s => (
                <div key={s.l} className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                  <div className={`text-sm font-black ${s.c}`}>{s.v}</div>
                </div>
              ))}
            </div>
            <div className="font-bold text-xs text-[#0A2540] mb-2">Active Signals ({selected.signals})</div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-blue-500 rounded-full" style={{width:`${selected.ims}%`}}/>
            </div>
            <div className="font-bold text-xs text-[#0A2540] mb-2">Investment Footprint</div>
            <div className="flex flex-wrap gap-1.5">
              {selected.footprints.map(iso => (
                <span key={iso} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">{iso}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="font-bold text-xs text-[#0A2540] mb-3">ESG Profile — {selected.esg}</div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${selected.esg==='LEADER' ? 'bg-emerald-500' : 'bg-blue-400'}`} style={{width:`${selected.esg_score}%`}}/>
              </div>
              <span className="text-lg font-black text-emerald-600">{selected.esg_score}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// /market-insights PAGE — Aggregated intelligence digest
// ═══════════════════════════════════════════════════════════════════════════════

const INSIGHTS = [
  {id:'1',type:'MACRO_TREND',    icon:'📊',title:'MENA FDI hits 5-year high at $88B',    region:'MENA',    urgency:'HIGH',  summary:'FDI inflows to the MENA region reached $88B in 2025, the highest level since 2020. UAE and Saudi Arabia jointly account for 65% of regional flows. Energy transition and tech infrastructure are the primary drivers.', date:'Today'},
  {id:'2',type:'REGULATORY',     icon:'📜',title:'India 100% insurance FDI opens significant M&A window',region:'SAS',urgency:'HIGH',summary:'Following the raising of the FDI cap in insurance to 100% under automatic route, senior advisors expect 8-12 major cross-border M&A deals in the sector within 18 months. Key targets identified in life insurance and reinsurance.',date:'2 days ago'},
  {id:'3',type:'SECTOR_SIGNAL',  icon:'💡',title:'Data centre FDI to MENA projected at $28B by 2028',region:'MENA',urgency:'MEDIUM',summary:'New analysis from GFM intelligence models projects $28B in data centre FDI to the MENA region by 2028, up from $4.2B in 2025. UAE accounts for 62% of current capacity and 55% of announced pipeline.',date:'3 days ago'},
  {id:'4',type:'GEOPOLITICAL',   icon:'🌐',title:'ASEAN supply chain reconfiguration accelerates',region:'EAP', urgency:'MEDIUM',summary:'Vietnam, Indonesia and Malaysia are receiving accelerating supply chain investment as manufacturers execute China+1 strategies. Electronics and semiconductor packaging leading the shift. 42 new facility announcements in Q1 2026.',date:'4 days ago'},
  {id:'5',type:'COMMODITY_LINK', icon:'⛏',title:'Uranium price surge (+52% YoY) unlocking $40B nuclear FDI pipeline',region:'GLOBAL',urgency:'HIGH', summary:'The global uranium price has surged to $88/lb (+52% YoY) as nuclear renaissance gathers pace. Kazakhstan, Australia and Canada are primary beneficiaries. 18 new nuclear power plant approvals globally in 2025.',date:'5 days ago'},
  {id:'6',type:'GFR_UPDATE',     icon:'🏆',title:'UAE records largest quarterly GFR gain in index history',region:'MENA', urgency:'MEDIUM',summary:'UAE achieves +4.2 point GFR improvement in Q1 2026, the single largest quarterly gain in the 8-year history of the Global Future Readiness Ranking. Digital Foundations and Sustainability dimensions drive the improvement.',date:'6 days ago'},
];

const URGENCY_STYLES: Record<string,string> = {
  HIGH:   'bg-red-50 text-red-700 border-red-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  LOW:    'bg-blue-50 text-blue-700 border-blue-200',
};

export function MarketInsightsPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const [region, setRegion]         = useState('');

  const shown = INSIGHTS.filter(i =>
    (!typeFilter || i.type === typeFilter) &&
    (!region || i.region === region)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Market Insights</span>
        <div className="flex gap-1.5 ml-4 flex-wrap">
          {[['','All'],['MACRO_TREND','Macro'],['REGULATORY','Regulatory'],['SECTOR_SIGNAL','Sector'],['GEOPOLITICAL','Geo'],['COMMODITY_LINK','Commodities'],['GFR_UPDATE','GFR']].map(([v,l]) => (
            <button key={v} onClick={() => setTypeFilter(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${typeFilter===v ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'}`}>{l}</button>
          ))}
        </div>
        <select className="border border-slate-200 rounded-lg text-xs px-2 py-2 ml-2"
          value={region} onChange={e=>setRegion(e.target.value)}>
          <option value="">All Regions</option>
          {['MENA','EAP','SAS','ECA','LAC','SSA','NAM','GLOBAL'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="p-5 grid grid-cols-[1fr_280px] gap-5">
        <div className="space-y-3">
          {shown.map(insight => (
            <div key={insight.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${URGENCY_STYLES[insight.urgency]}`}>
                      {insight.urgency}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-semibold">{insight.type.replace(/_/g,' ')}</span>
                    <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-bold">{insight.region}</span>
                    <span className="text-xs text-slate-400 ml-auto">{insight.date}</span>
                  </div>
                  <div className="font-black text-sm text-[#0A2540] mb-2">{insight.title}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{insight.summary}</p>
                </div>
              </div>
            </div>
          ))}
          {shown.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <div className="text-3xl mb-3">💡</div>
              <div className="font-semibold">No insights match your filter</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">This Week's Intelligence</div>
            {[
              {l:'High urgency alerts',v:2,c:'text-red-600'},
              {l:'New regulatory changes',v:3,c:'text-amber-600'},
              {l:'Sector spotlights',v:4,c:'text-violet-600'},
              {l:'GFR movements',v:8,c:'text-blue-600'},
            ].map(s => (
              <div key={s.l} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-500">{s.l}</span>
                <span className={`text-base font-black ${s.c}`}>{s.v}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">Intelligence by Region</div>
            {[{l:'MENA',v:3},{l:'EAP',v:2},{l:'SAS',v:1},{l:'GLOBAL',v:1}].map(s => (
              <div key={s.l} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500 w-16">{s.l}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{width:`${s.v*33}%`}}/>
                </div>
                <span className="text-xs font-bold text-slate-600">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export for Next.js routing
export default InvestmentPipelinePage;
