'use client';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const REPORT_TYPES = [
  {code:'MIB',  name:'Market Intelligence Brief',       fic:5,  pages:'8-12',  desc:'Sector snapshot with top signals, regulatory updates, and 3-year outlook.',     icon:'⚡'},
  {code:'CEGP', name:'Country Economic Profile',        fic:20, pages:'24-32', desc:'Full economy deep-dive: GFR scorecard, FDI history, key sectors, investment climate.', icon:'🌍'},
  {code:'ICR',  name:'Investment Climate Report',       fic:18, pages:'20-28', desc:'Policy, regulatory, and institutional FDI readiness assessment.',              icon:'📜'},
  {code:'SPOR', name:'Sector Potential Report',         fic:22, pages:'28-36', desc:'ISIC sector FDI potential, top investors, supply chain maps, incentive matrix.', icon:'📈'},
  {code:'TIR',  name:'Target Investor Report',         fic:18, pages:'18-24', desc:'Company intelligence: IMS score, investment footprint, decision-maker profiles.', icon:'🎯'},
  {code:'SBP',  name:'Strategic Briefing Paper',       fic:15, pages:'12-18', desc:'Executive briefing on an FDI trend, corridor, or policy development.',          icon:'📋'},
  {code:'SER',  name:'Signal Enrichment Report',       fic:12, pages:'10-16', desc:'Deep-dive on a specific FDI signal: verification, context, probability.',       icon:'🔍'},
  {code:'SIR',  name:'Sector Intelligence Report',     fic:14, pages:'16-22', desc:'Cross-economy sector comparison, competitive landscape, investment opportunities.',icon:'🏭'},
  {code:'RQBR', name:'Regulatory & Policy Brief',      fic:16, pages:'14-20', desc:'FDI regulatory change analysis: impact assessment, opportunity mapping.',       icon:'⚖️'},
  {code:'FCGR', name:'Flagship Country GFR Report',    fic:25, pages:'40-56', desc:'Comprehensive GFR deep-dive: all dimensions, peer comparison, 3-year trajectory.',icon:'🏆'},
];

const ECONOMIES = ['UAE','Saudi Arabia','India','Egypt','Vietnam','Indonesia','Germany','Singapore','Nigeria','South Africa','Kenya','Morocco','Brazil','Turkey','Poland'];
const SECTORS_LIST = [['J','ICT'],['K','Finance'],['D','Energy'],['C','Manufacturing'],['B','Mining'],['L','Real Estate'],['H','Logistics']];

export default function ReportsPage() {
  const [selectedType,  setSelectedType]  = useState(REPORT_TYPES[0]);
  const [economy,       setEconomy]       = useState('UAE');
  const [sector,        setSector]        = useState('J');
  const [generating,    setGenerating]    = useState(false);
  const [result,        setResult]        = useState<{reference_code:string,fic_charged:number}|null>(null);
  const [history,       setHistory]       = useState<any[]>([]);

  async function generate() {
    setGenerating(true); setResult(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
      const res   = await fetch(`${API}/api/v1/reports/generate`, {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token||''}`},
        body: JSON.stringify({type:selectedType.code, economy, sector}),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setHistory(prev => [data.data, ...prev].slice(0,10));
      }
    } catch {}
    finally { setGenerating(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Custom Intelligence Reports</h1>
          <p className="text-blue-200 text-sm">10 AI-powered report types. Every claim verified with Z3 logic engine and source-attributed with SHA-256 provenance.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 grid md:grid-cols-3 gap-5">
        {/* Report type grid */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="text-sm font-black text-[#0A2540] mb-3">Select Report Type</div>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_TYPES.map(rt=>(
                <div key={rt.code} onClick={()=>setSelectedType(rt)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedType.code===rt.code?'border-blue-400 bg-blue-50':'border-slate-100 hover:border-blue-200'
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{rt.icon}</span>
                    <div>
                      <span className="text-xs font-black text-slate-500">{rt.code}</span>
                      <div className="text-xs font-black text-[#0A2540] leading-tight">{rt.name}</div>
                    </div>
                    <span className="ml-auto text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{rt.fic} FIC</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{rt.desc}</p>
                  <div className="text-xs text-slate-300 mt-1">{rt.pages} pages</div>
                </div>
              ))}
            </div>
          </div>

          {/* Report history */}
          {history.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="text-sm font-black text-[#0A2540] mb-3">Generated Reports</div>
              <div className="space-y-2">
                {history.map(h=>(
                  <div key={h.reference_code} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <div className="font-bold text-[#0A2540]">{h.reference_code}</div>
                      <div className="text-slate-400">{h.type} · {h.economy} · {h.fic_charged} FIC charged</div>
                    </div>
                    <button className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg hover:bg-blue-500 transition-colors">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generator panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="text-sm font-black text-[#0A2540] mb-4">Generate Report</div>

            <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{selectedType.icon}</span>
                <div>
                  <div className="font-black text-sm text-[#0A2540]">{selectedType.name}</div>
                  <div className="text-xs text-blue-600">{selectedType.pages} pages · {selectedType.fic} FIC</div>
                </div>
              </div>
              <p className="text-xs text-blue-700">{selectedType.desc}</p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Economy</label>
                <select value={economy} onChange={e=>setEconomy(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  {ECONOMIES.map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Primary Sector</label>
                <select value={sector} onChange={e=>setSector(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  {SECTORS_LIST.map(([c,n])=><option key={c} value={c}>ISIC {c} — {n}</option>)}
                </select>
              </div>
            </div>

            {result && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
                <div className="text-xs font-bold text-emerald-700 mb-1">✓ Report Generated</div>
                <div className="font-mono text-xs text-emerald-800 break-all">{result.reference_code}</div>
                <div className="text-xs text-emerald-600 mt-1">{result.fic_charged} FIC deducted</div>
                <button className="w-full mt-2 bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-emerald-500 transition-colors">
                  Download PDF
                </button>
              </div>
            )}

            <button onClick={generate} disabled={generating}
              className={`w-full font-black py-3.5 rounded-xl transition-colors ${
                generating?'bg-slate-300 text-slate-500 cursor-not-allowed':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
              }`}>
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Generating…
                </span>
              ) : `Generate — ${selectedType.fic} FIC`}
            </button>
            <p className="text-xs text-slate-400 text-center mt-2">Z3 verified · SHA-256 provenance on all claims</p>
          </div>

          {/* Credit guide */}
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="text-xs font-bold text-slate-400 mb-2">FIC COST GUIDE</div>
            {REPORT_TYPES.slice(0,5).map(rt=>(
              <div key={rt.code} className="flex justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-500">{rt.code} — {rt.name.split(' ').slice(0,2).join(' ')}</span>
                <span className="font-bold text-amber-600">{rt.fic} FIC</span>
              </div>
            ))}
            <a href="/fic" className="text-xs text-blue-600 font-bold hover:underline mt-2 block">Buy FIC Credits →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
