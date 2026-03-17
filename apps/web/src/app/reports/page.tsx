'use client';
import { useState } from 'react';

const REPORT_TYPES = [
  {code:'CEGP', name:'Country Economic & Geopolitical Profile', fic:20, time:'~3 min', desc:'Comprehensive country analysis: macro, political, regulatory, FDI trends, sector opportunities, risk assessment.', icon:'🌍'},
  {code:'MIB',  name:'Market Intelligence Brief',               fic:5,  time:'~1 min', desc:'Quick brief: current investment climate, top 5 signals, sector highlights, IPA contact.', icon:'⚡'},
  {code:'ICR',  name:'Investment Climate Report',               fic:18, time:'~2 min', desc:'Detailed analysis of investment environment, policy changes, regulatory updates, ease of doing business.', icon:'📈'},
  {code:'SPOR', name:'Sector Potential & Opportunity Report',    fic:22, time:'~3 min', desc:'Deep sector analysis: market size, competitive landscape, top investors, incentives, gap analysis.', icon:'🎯'},
  {code:'TIR',  name:'Trade Intelligence Report',               fic:18, time:'~2 min', desc:'Bilateral trade flows, tariff analysis, supply chain mapping, trade agreement assessment.', icon:'🚢'},
  {code:'SBP',  name:'Sector Benchmark Profile',                fic:15, time:'~2 min', desc:'Benchmark your economy vs. peer competitors across 12 sector-specific indicators.', icon:'📊'},
  {code:'SER',  name:'Sectoral Entry Report',                   fic:12, time:'~1 min', desc:'Market entry assessment: barriers, opportunities, regulatory requirements, investor contacts.', icon:'🚀'},
  {code:'SIR',  name:'Sector Intelligence Report',              fic:14, time:'~2 min', desc:'Sector-specific FDI signals, investor profiling, competitive intelligence.', icon:'🔍'},
  {code:'RQBR', name:'Regulatory & Policy Brief',               fic:16, time:'~1 min', desc:'Latest regulatory changes, policy updates, compliance requirements, legal framework analysis.', icon:'📜'},
  {code:'FCGR', name:'Flagship Country & GFR Report',           fic:25, time:'~4 min', desc:'Premium flagship report: full GFR analysis, FDI strategy, 5-year outlook, IPA playbook.', icon:'⭐'},
];

const RECENT = [
  {code:'FCR-CEGP-ARE-20260317-143022-0047', type:'CEGP', economy:'UAE',          date:'Today 14:30', status:'Ready'},
  {code:'FCR-MIB-SAU-20260317-091205-0046',  type:'MIB',  economy:'Saudi Arabia', date:'Today 09:12', status:'Ready'},
  {code:'FCR-SPOR-IND-20260316-163044-0045', type:'SPOR', economy:'India',        date:'Yesterday',   status:'Ready'},
  {code:'FCR-TIR-DEU-20260316-104512-0044',  type:'TIR',  economy:'Germany',      date:'Yesterday',   status:'Ready'},
];

const ECONOMIES = ['UAE','Saudi Arabia','India','Germany','UK','Singapore','Egypt','Vietnam','Indonesia','Nigeria','South Africa','Brazil','USA','China'];

export default function ReportsPage() {
  const [selected, setSelected] = useState(REPORT_TYPES[0]);
  const [economy,  setEconomy]  = useState('UAE');
  const [sector,   setSector]   = useState('J');
  const [generating, setGenerating] = useState(false);
  const [generated,  setGenerated]  = useState<string|null>(null);

  function generate() {
    setGenerating(true);
    setTimeout(() => {
      const ref = `FCR-${selected.code}-${economy.replace(' ','').slice(0,3).toUpperCase()}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*900000+100000)}-${String(Math.floor(Math.random()*9999)).padStart(4,'0')}`;
      setGenerated(ref);
      setGenerating(false);
    }, 2500);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Custom Reports Engine</span>
        <span className="ml-3 text-xs text-slate-400">10 report types · AI-generated in minutes</span>
      </div>

      <div className="max-w-7xl mx-auto p-5 grid md:grid-cols-3 gap-5">
        {/* Report type selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Select Report Type</div>
          {REPORT_TYPES.map(r => (
            <div key={r.code} onClick={() => { setSelected(r); setGenerated(null); }}
              className={`bg-white rounded-xl border p-3.5 cursor-pointer transition-all ${
                selected.code===r.code ? 'border-blue-400 bg-blue-50/30 shadow-sm' : 'border-slate-100 hover:border-blue-200'
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{r.icon}</span>
                <div className="font-bold text-xs text-[#0A2540]">{r.name}</div>
              </div>
              <div className="flex items-center gap-2 ml-7">
                <span className="text-xs font-black text-blue-600">{r.fic} FIC</span>
                <span className="text-xs text-slate-400">{r.time}</span>
                <span className="text-xs font-mono text-slate-400 ml-auto">{r.code}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Report config + generator */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="font-black text-lg text-[#0A2540] mb-1">{selected.icon} {selected.name}</div>
            <div className="flex gap-3 text-xs mb-4">
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">{selected.fic} FIC</span>
              <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">{selected.time}</span>
            </div>
            <p className="text-slate-500 text-sm mb-5">{selected.desc}</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Economy Focus</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  value={economy} onChange={e => setEconomy(e.target.value)}>
                  {ECONOMIES.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Sector Focus</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  value={sector} onChange={e => setSector(e.target.value)}>
                  {[
                    ['J','ICT & Technology'],['K','Financial Services'],['C','Manufacturing'],
                    ['D','Energy & Utilities'],['L','Real Estate'],['H','Logistics'],
                    ['Q','Healthcare'],['F','Construction'],['B','Mining'],['M','Professional Services'],
                  ].map(([v,l]) => <option key={v} value={v}>ISIC {v} — {l}</option>)}
                </select>
              </div>
            </div>

            {generated ? (
              <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-bold text-emerald-700 text-sm mb-1">Report Generated</div>
                <div className="text-xs font-mono text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded mb-3">{generated}</div>
                <button className="bg-emerald-600 text-white text-xs font-bold px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Download PDF
                </button>
              </div>
            ) : (
              <button onClick={generate} disabled={generating}
                className={`w-full mt-5 font-black py-3.5 rounded-xl transition-colors ${
                  generating ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
                }`}>
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    Generating with AI…
                  </span>
                ) : `Generate ${selected.name} — ${selected.fic} FIC`}
              </button>
            )}
          </div>
        </div>

        {/* Recent reports */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Recent Reports</div>
          <div className="space-y-2">
            {RECENT.map(r => (
              <div key={r.code} className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">{r.type}</span>
                  <span className="text-xs text-emerald-600 font-semibold ml-auto">{r.status}</span>
                </div>
                <div className="font-bold text-xs text-[#0A2540] mb-1">{r.economy}</div>
                <div className="text-xs font-mono text-slate-400 mb-2 truncate">{r.code}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{r.date}</span>
                  <button className="text-xs text-blue-600 font-semibold hover:underline">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
