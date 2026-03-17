'use client';
import { useState } from 'react';

const MISSIONS = [
  {
    id:'PMP-ARE-J-20260317-0001', economy:'UAE', sector:'Technology', date:'Today',
    status:'ACTIVE', targets:5, engaged:2, committed:1,
    companies:[
      {name:'Microsoft Corp',      hq:'USA', mfs:94.2, stage:'ENGAGED',   action:'Board presentation scheduled April 15'},
      {name:'Amazon Web Services', hq:'USA', mfs:91.8, stage:'COMMITTED', action:'MoU signed — site selection in progress'},
      {name:'Databricks',          hq:'USA', mfs:88.4, stage:'ENGAGED',   action:'Technical team visit arranged March 25'},
      {name:'Palantir Technologies',hq:'USA',mfs:85.1, stage:'TARGETED',  action:'Initial outreach sent — awaiting response'},
      {name:'Snowflake Inc',       hq:'USA', mfs:82.7, stage:'TARGETED',  action:'Target identified via signal MSS-GFS-ARE-0247'},
    ]
  },
];

const STAGE_STYLES: Record<string,string> = {
  COMMITTED:'bg-emerald-100 text-emerald-700',
  ENGAGED:  'bg-blue-100 text-blue-700',
  TARGETED: 'bg-amber-100 text-amber-700',
};

const NEW_ECONOMIES = ['UAE','Saudi Arabia','India','Egypt','Vietnam','Indonesia','Nigeria','South Africa'];
const NEW_SECTORS   = [['J','Technology'],['K','Finance'],['D','Energy'],['C','Manufacturing'],['L','Real Estate'],['H','Logistics']];

export default function PMPPage() {
  const [view,       setView]       = useState<'missions'|'new'>('missions');
  const [economy,    setEconomy]    = useState('UAE');
  const [sector,     setSector]     = useState('J');
  const [generating, setGenerating] = useState(false);
  const [generated,  setGenerated]  = useState(false);

  function generate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 3000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Promotion Mission Planning</span>
        <div className="flex gap-1 ml-4">
          {(['missions','new'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                view===v ? 'bg-[#0A2540] text-white' : 'text-slate-400 border border-slate-200'
              }`}>{v === 'missions' ? 'My Missions' : '+ New Mission'}</button>
          ))}
        </div>
      </div>

      {view === 'missions' && (
        <div className="max-w-6xl mx-auto p-5">
          {MISSIONS.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden mb-5">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <div className="font-black text-[#0A2540]">{m.economy} · {m.sector} Sector Mission</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{m.id}</div>
                </div>
                <div className="flex gap-4 text-center">
                  {[
                    {l:'Targets',  v:m.targets,   c:'text-slate-600'},
                    {l:'Engaged',  v:m.engaged,    c:'text-blue-600'},
                    {l:'Committed',v:m.committed,  c:'text-emerald-600'},
                  ].map(s => (
                    <div key={s.l}>
                      <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
                      <div className="text-xs text-slate-400">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Company','HQ','MFS Score','Stage','Next Action'].map(h => (
                      <th key={h} className="text-left px-5 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {m.companies.map(c => (
                    <tr key={c.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-bold text-[#0A2540]">{c.name}</td>
                      <td className="px-5 py-3 text-slate-500">{c.hq}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-blue-600">{c.mfs}</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-16">
                            <div className="h-full bg-blue-500 rounded-full" style={{width:`${c.mfs}%`}}/>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${STAGE_STYLES[c.stage]}`}>{c.stage}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{c.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {view === 'new' && (
        <div className="max-w-2xl mx-auto p-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-7">
            <h2 className="font-black text-xl text-[#0A2540] mb-5">Generate Investment Promotion Mission</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Target Economy (Promoting)</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  value={economy} onChange={e=>setEconomy(e.target.value)}>
                  {NEW_ECONOMIES.map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Priority Sector</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  value={sector} onChange={e=>setSector(e.target.value)}>
                  {NEW_SECTORS.map(([v,l])=><option key={v} value={v}>ISIC {v} — {l}</option>)}
                </select>
              </div>

              {generated ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center mt-2">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-black text-emerald-700 mb-1">Mission Dossier Generated</div>
                  <div className="text-xs font-mono text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded mb-3 inline-block">
                    PMP-{economy.replace(' ','').slice(0,3).toUpperCase()}-{sector}-{new Date().toISOString().slice(0,10).replace(/-/g,'')}-0001
                  </div>
                  <div className="text-xs text-emerald-600 mb-3">5 target companies identified · 2 PRIORITY gaps</div>
                  <div className="flex gap-2 justify-center">
                    <button className="bg-emerald-600 text-white text-xs font-bold px-5 py-2 rounded-lg">Download Dossier</button>
                    <button onClick={() => {setGenerated(false); setView('missions');}}
                      className="border border-emerald-300 text-emerald-700 text-xs font-bold px-5 py-2 rounded-lg">View Mission</button>
                  </div>
                </div>
              ) : (
                <button onClick={generate} disabled={generating}
                  className={`w-full font-black py-3.5 rounded-xl transition-colors mt-2 ${
                    generating ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
                  }`}>
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      AI generating mission dossier… 30 FIC
                    </span>
                  ) : 'Generate Mission Dossier — 30 FIC'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
