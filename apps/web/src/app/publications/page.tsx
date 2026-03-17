'use client';
import { useState } from 'react';

// ─── PUBLICATIONS DATA ────────────────────────────────────────────────────────

const PUBS = [
  {ref:'FNL-WK-2026-11-20260317-001',type:'WEEKLY',color:'#10B981',badge:'Weekly Digest',fic:0,
   title:'Global FDI Monitor Weekly Intelligence Digest — Week 11, 2026',
   date:'17 March 2026',
   excerpt:'This week: 1,247 investment signals detected globally. UAE leads MENA with 89 Platinum signals. Amazon AWS confirms $5.3B Saudi Arabia expansion. Samsung Vietnam semiconductor facility breaks ground.'},
  {ref:'FPB-MON-2026-02-20260301-001',type:'MONTHLY',color:'#1D4ED8',badge:'Monthly Monitor',fic:0,
   title:'Global FDI Monitor Monthly Investment & Trade Monitor — February 2026',
   date:'1 March 2026',
   excerpt:'February FDI signal volumes up 18% year-on-year. Technology sector leads with 34% share of all Greenfield signals. India overtakes Germany as third-largest signal destination economy.'},
  {ref:'FGR-QTR-2025-Q4-20260115-001',type:'GFR_QTR',color:'#7C3AED',badge:'GFR Quarterly',fic:0,
   title:'GFR Quarterly Score Update — Q4 2025',
   date:'15 January 2026',
   excerpt:'UAE records largest quarterly GFR gain (+4.2 points) in history of the ranking. 23 economies improve tier classification. Saudi Arabia enters Top 20 for first time. Singapore retains #1.'},
  {ref:'FPB-ANN-2026-20260228-001',type:'ANNUAL',color:'#F59E0B',badge:'Annual Flagship',fic:0,
   title:'Global FDI Monitor Annual Investment & Trade Intelligence Report 2026',
   date:'28 February 2026',
   excerpt:'Flagship annual publication. 162 pages of decision-ready intelligence covering global FDI trends, 215-economy profiles, sector intelligence, and 10-year forecasts. Includes full GFR 2026 rankings.'},
  {ref:'FPB-QTR-2025-Q3-20251015-001',type:'QUARTERLY',color:'#7C3AED',badge:'Quarterly Review',fic:2,
   title:'Forecasta Quarterly Investment Review — Q3 2025',
   date:'15 October 2025',
   excerpt:'Q3 2025 sees record VC/PE investment activity in MENA. Green technology FDI accelerates globally. Supply chain reconfiguration signals surge across Southeast Asia and South Asia.'},
  {ref:'FPB-SEC-J-ANN-2026-20260228-002',type:'SECTOR',color:'#10B981',badge:'Sector Outlook',fic:2,
   title:'Technology Sector Annual Intelligence Outlook — ISIC J — 2026',
   date:'28 February 2026',
   excerpt:'ICT/Technology sector FDI reached $1.2T globally in 2025. Data centre infrastructure dominates greenfield investment. AI infrastructure drives new investment corridors to MENA and Southeast Asia.'},
  {ref:'FPB-REG-MENA-ANN-2026-20260228-001',type:'REGIONAL',color:'#EF4444',badge:'Regional Annual',fic:2,
   title:'MENA Regional Investment & Trade Intelligence Report 2026',
   date:'28 February 2026',
   excerpt:'MENA FDI inflows reached $88B in 2025, highest in a decade. UAE and Saudi Arabia jointly account for 65% of regional flows. Vision 2030 drives transformation of the Saudi investment landscape.'},
  {ref:'FNL-WK-2026-10-20260310-001',type:'WEEKLY',color:'#10B981',badge:'Weekly Digest',fic:0,
   title:'Global FDI Monitor Weekly Intelligence Digest — Week 10, 2026',
   date:'10 March 2026',
   excerpt:'Week 10 highlights: 8,742 signals tracked globally. MENA economies account for 28% of total Platinum signals. Saudi MISA announces new manufacturing zone incentive package.'},
];

const TYPE_FILTERS = [
  {id:'',label:'All Publications'},
  {id:'WEEKLY',label:'Weekly Digest',color:'#10B981'},
  {id:'MONTHLY',label:'Monthly Monitor',color:'#1D4ED8'},
  {id:'GFR_QTR',label:'GFR Quarterly',color:'#7C3AED'},
  {id:'ANNUAL',label:'Annual Flagship',color:'#F59E0B'},
  {id:'QUARTERLY',label:'Quarterly Review',color:'#7C3AED'},
  {id:'SECTOR',label:'Sector Outlooks',color:'#10B981'},
  {id:'REGIONAL',label:'Regional Annual',color:'#EF4444'},
];

export function PublicationsPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = PUBS.filter(p =>
    (!typeFilter || p.type === typeFilter) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-wrap gap-2 items-center sticky top-14 z-30">
        <input placeholder="Search publications…"
          className="border border-slate-200 rounded-lg text-xs px-3 py-2 w-48 focus:outline-none focus:border-blue-400"
          value={search} onChange={e=>setSearch(e.target.value)}/>
        <div className="flex gap-1.5 flex-wrap">
          {TYPE_FILTERS.map(f => (
            <button key={f.id} onClick={() => setTypeFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                typeFilter === f.id ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}>{f.label}</button>
          ))}
        </div>
        <button className="ml-auto bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Subscribe to Newsletter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
        {filtered.map(pub => (
          <div key={pub.ref} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer group">
            <div className="h-1" style={{background: pub.color}} />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style={{background:`${pub.color}18`,color:pub.color}}>{pub.badge}</span>
                {pub.fic === 0
                  ? <span className="text-xs text-emerald-600 font-semibold ml-auto">Free</span>
                  : <span className="text-xs text-blue-600 font-semibold ml-auto">{pub.fic} FIC</span>}
              </div>
              <h3 className="font-bold text-sm text-[#0A2540] mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                {pub.title}
              </h3>
              <div className="text-xs text-slate-400 mb-3">{pub.date}</div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{pub.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-mono truncate max-w-[180px]">{pub.ref}</span>
                <button className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-semibold flex-shrink-0">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-400">
            <div className="text-3xl mb-3">📚</div>
            <div className="font-semibold">No publications found</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DATA SOURCES ADMIN PAGE ─────────────────────────────────────────────────

const FREE_SOURCES = [
  {name:'IMF World Economic Outlook',type:'IO',tier:'T1',status:'active',freq:'Biannual',eco:'215',health:99.8},
  {name:'World Bank Open Data',type:'IO',tier:'T1',status:'active',freq:'Annual',eco:'215',health:99.5},
  {name:'UNCTAD STAT',type:'IO',tier:'T1',status:'active',freq:'Annual',eco:'215',health:98.9},
  {name:'Federal Reserve FRED',type:'IO',tier:'T1',status:'active',freq:'Real-time',eco:'US',health:99.9},
  {name:'Eurostat',type:'IO',tier:'T1',status:'active',freq:'Quarterly',eco:'EU',health:99.2},
  {name:'WTO Statistics Portal',type:'IO',tier:'T1',status:'active',freq:'Annual',eco:'164',health:98.4},
  {name:'OECD Data Portal',type:'IO',tier:'T1',status:'active',freq:'Annual',eco:'38+',health:99.1},
  {name:'UN Comtrade',type:'IO',tier:'T1',status:'active',freq:'Monthly',eco:'200+',health:97.8},
  {name:'Transparency International CPI',type:'NGO',tier:'T4',status:'active',freq:'Annual',eco:'180',health:99.9},
  {name:'Freedom House',type:'NGO',tier:'T4',status:'active',freq:'Annual',eco:'195',health:99.7},
  {name:'Heritage Foundation',type:'NGO',tier:'T4',status:'active',freq:'Annual',eco:'180',health:99.6},
  {name:'ACLED Conflict Data',type:'NGO',tier:'T6',status:'active',freq:'Real-time',eco:'All',health:98.2},
  {name:'SEC EDGAR',type:'GOV',tier:'T2',status:'active',freq:'Real-time',eco:'USA',health:99.3},
  {name:'UK Companies House',type:'GOV',tier:'T2',status:'active',freq:'Real-time',eco:'GBR',health:99.1},
  {name:'NewsAPI',type:'MEDIA',tier:'T3',status:'active',freq:'Real-time',eco:'Global',health:97.5},
  {name:'GDELT Project',type:'OPEN',tier:'T6',status:'active',freq:'15min',eco:'Global',health:98.8},
];

const PREMIUM_SOURCES = [
  {name:'Bloomberg Terminal API',type:'COM',tier:'T3',status:'pending',cost:'~$24,000+/yr',notes:'Enterprise sales cycle 6–12 wks'},
  {name:'Reuters Connect',type:'COM',tier:'T3',status:'pending',cost:'~$18,000+/yr',notes:'Activate via Reuters Connect portal'},
  {name:'fDi Markets (FT)',type:'COM',tier:'T4',status:'pending',cost:'Contact FT',notes:'Greenfield FDI project database'},
  {name:'Oxford Economics',type:'COM',tier:'T4',status:'pending',cost:'~$8,000+/yr',notes:'Country forecast models'},
  {name:'EIU Economist Intelligence Unit',type:'COM',tier:'T4',status:'pending',cost:'Contact EIU',notes:'Country risk ratings'},
  {name:'S&P Capital IQ',type:'COM',tier:'T4',status:'pending',cost:'~$15,000+/yr',notes:'Company financials + M&A data'},
  {name:'Moody\'s Analytics',type:'COM',tier:'T4',status:'pending',cost:'~$12,000+/yr',notes:'Credit ratings + country risk'},
  {name:'PitchBook',type:'COM',tier:'T4',status:'pending',cost:'~$20,000+/yr',notes:'VC/PE deal data'},
];

const STATUS_STYLES: Record<string,string> = {
  active:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  error:   'bg-red-50 text-red-600 border-red-200',
};

export function DataSourcesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [newSource, setNewSource] = useState({name:'',url:'',type:'IO',tier:'T1',freq:'daily',premium:false});

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Data Source Management Interface</span>
        <span className="text-xs text-slate-400">Admin only · Add, monitor, and toggle data sources</span>
        <button onClick={() => setShowAdd(!showAdd)}
          className="ml-auto bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Source
        </button>
      </div>

      <div className="p-5">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            {label:'Active Free Sources',value:'67',color:'text-emerald-600',sub:'Tier 1–4'},
            {label:'Premium Ready',value:'24',color:'text-amber-600',sub:'Awaiting budget'},
            {label:'Pipeline Health',value:'98.7%',color:'text-blue-700',sub:'Uptime 30 days'},
            {label:'Signals Today',value:'1,247',color:'text-violet-600',sub:'From 89 sources'},
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{k.label}</div>
              <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Add source form */}
        {showAdd && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5">
            <div className="font-bold text-sm text-blue-700 mb-4">Add New Data Source</div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Source Name</label>
                <input className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-400"
                  placeholder="e.g. Bank of Japan Statistics"
                  value={newSource.name} onChange={e=>setNewSource(s=>({...s,name:e.target.value}))}/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">URL</label>
                <input className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-400"
                  placeholder="https://..."
                  value={newSource.url} onChange={e=>setNewSource(s=>({...s,url:e.target.value}))}/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Type</label>
                <select className="w-full border border-slate-200 rounded-lg text-xs px-2 py-2">
                  <option>IO</option><option>GOV</option><option>MEDIA</option>
                  <option>NGO</option><option>OPEN</option><option>COM</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Tier</label>
                <select className="w-full border border-slate-200 rounded-lg text-xs px-2 py-2">
                  <option>T1</option><option>T2</option><option>T3</option>
                  <option>T4</option><option>T5</option><option>T6</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Update Frequency</label>
                <select className="w-full border border-slate-200 rounded-lg text-xs px-2 py-2">
                  <option>real-time</option><option>hourly</option><option>daily</option>
                  <option>weekly</option><option>monthly</option><option>annual</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Test Connection
                </button>
                <button onClick={() => setShowAdd(false)}
                  className="bg-white border border-slate-200 text-slate-500 text-xs px-4 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active free sources */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden mb-4">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="font-bold text-xs text-[#0A2540]">Active Free Sources — 67 Sources (Tier 1–4)</div>
            <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-bold">All Live</span>
          </div>
          <div className="divide-y divide-slate-50">
            {FREE_SOURCES.map(s => (
              <div key={s.name} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <div className="text-xs font-bold text-[#0A2540]">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.type} · Tier {s.tier} · {s.freq} · {s.eco} economies</div>
                </div>
                <div className="text-xs font-mono text-emerald-600">{s.health}%</div>
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width:`${s.health}%`}}/>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${STATUS_STYLES[s.status]}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium sources */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-amber-700">Premium Sources — 24 Ready (Budget Approval Required)</div>
              <div className="text-xs text-amber-500 mt-0.5">Infrastructure built · API connectors coded · Toggle ON when budgets approved</div>
            </div>
            <button className="text-xs bg-amber-100 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-200 transition-colors">
              Budget Approval Guide
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {PREMIUM_SOURCES.map(s => (
              <div key={s.name} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <div className="text-xs font-bold text-[#0A2540]">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.type} · Tier {s.tier} · Est. cost: {s.cost}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{s.notes}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${STATUS_STYLES.pending}`}>
                  Budget Pending
                </span>
                <button className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-100 transition-colors">
                  Activate →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export both pages
export default PublicationsPage;
