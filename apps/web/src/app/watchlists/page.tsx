'use client';
import { useState } from 'react';
import Link from 'next/link';

const WATCHLISTS = [
  {
    id:'WL001', name:'MENA FDI Targets', economies:['ARE','SAU','QAT','EGY','JOR'],
    sectors:['J','K','D'], signals:28, alerts:3, created:'Jan 2026',
    latest:[
      {grade:'PLATINUM',co:'Microsoft Corp',eco:'UAE',val:'$850M',sci:91.2},
      {grade:'GOLD',co:'Amazon AWS',eco:'Saudi Arabia',val:'$5.3B',sci:88.4},
      {grade:'GOLD',co:'Siemens Energy',eco:'Egypt',val:'$340M',sci:86.1},
    ]
  },
  {
    id:'WL002', name:'Asia Pacific Tech', economies:['SGP','VNM','IDN','IND','KOR'],
    sectors:['J','C'], signals:19, alerts:1, created:'Feb 2026',
    latest:[
      {grade:'GOLD',co:'Samsung Electronics',eco:'Vietnam',val:'$2.8B',sci:83.7},
      {grade:'SILVER',co:'Databricks',eco:'Singapore',val:'$150M',sci:79.3},
    ]
  },
  {
    id:'WL003', name:'Green Energy Global', economies:['IND','EGY','ZAF','BRA','VNM'],
    sectors:['D','F'], signals:12, alerts:2, created:'Mar 2026',
    latest:[
      {grade:'PLATINUM',co:'Vestas Wind',eco:'India',val:'$420M',sci:85.9},
    ]
  },
];

const GRADE_STYLES: Record<string,string> = {
  PLATINUM:'bg-amber-100 text-amber-700 border-amber-300',
  GOLD:    'bg-emerald-100 text-emerald-700 border-emerald-300',
  SILVER:  'bg-blue-100 text-blue-700 border-blue-300',
  BRONZE:  'bg-slate-100 text-slate-500 border-slate-300',
};

export default function WatchlistsPage() {
  const [selected, setSelected]       = useState(WATCHLISTS[0]);
  const [creating, setCreating]       = useState(false);
  const [newName,  setNewName]        = useState('');
  const [newEcos,  setNewEcos]        = useState<string[]>([]);

  const ECOS = ['ARE','SAU','QAT','EGY','IND','SGP','VNM','IDN','DEU','GBR','USA','CHN','BRA','NGA','ZAF'];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Watchlists</span>
        <span className="text-xs text-slate-400">{WATCHLISTS.length} active watchlists</span>
        <button onClick={() => setCreating(true)}
          className="ml-auto bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + New Watchlist
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-5 grid md:grid-cols-3 gap-5">
        {/* List */}
        <div className="space-y-3">
          {WATCHLISTS.map(wl => (
            <div key={wl.id} onClick={() => setSelected(wl)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                selected.id===wl.id ? 'border-blue-400 shadow-sm' : 'border-slate-100 hover:border-blue-200'
              }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-sm text-[#0A2540]">{wl.name}</div>
                {wl.alerts > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-black px-1.5 py-0.5 rounded-full">
                    {wl.alerts}
                  </span>
                )}
              </div>
              <div className="flex gap-2 text-xs text-slate-400 mb-2">
                <span>{wl.economies.length} economies</span>
                <span>·</span>
                <span>{wl.sectors.length} sectors</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {wl.economies.slice(0,4).map(e => (
                  <span key={e} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">{e}</span>
                ))}
                {wl.economies.length > 4 && <span className="text-xs text-slate-400">+{wl.economies.length-4}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-black text-xl text-[#0A2540]">{selected.name}</h2>
                <div className="text-xs text-slate-400 mt-0.5">Created {selected.created} · {selected.signals} total signals</div>
              </div>
              <div className="flex gap-2">
                <button className="border border-slate-200 text-slate-500 text-xs font-semibold px-3 py-1.5 rounded-lg hover:border-blue-300 transition-colors">Edit</button>
                <button className="border border-red-200 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg">Delete</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-blue-600">{selected.signals}</div>
                <div className="text-xs text-slate-400">Total Signals</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-amber-600">{selected.alerts}</div>
                <div className="text-xs text-slate-400">New Alerts</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-emerald-600">{selected.economies.length}</div>
                <div className="text-xs text-slate-400">Economies</div>
              </div>
            </div>

            <div className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-3">Latest Signals</div>
            <div className="space-y-2">
              {selected.latest.map((s,i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className={`text-xs font-black px-2 py-0.5 rounded border ${GRADE_STYLES[s.grade]}`}>{s.grade}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-xs text-[#0A2540]">{s.co}</div>
                    <div className="text-xs text-slate-400">{s.eco}</div>
                  </div>
                  <div className="text-xs font-black text-blue-600">{s.val}</div>
                  <div className="text-xs text-slate-400">SCI {s.sci}</div>
                </div>
              ))}
            </div>

            <Link href="/signals" className="block mt-4 text-center text-xs text-blue-600 font-semibold hover:underline">
              View all {selected.signals} signals for this watchlist →
            </Link>
          </div>
        </div>
      </div>

      {/* Create modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="font-black text-lg text-[#0A2540] mb-4">New Watchlist</div>
            <div className="space-y-3">
              <input placeholder="Watchlist name" value={newName} onChange={e=>setNewName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2">Select Economies</div>
                <div className="flex flex-wrap gap-1.5">
                  {ECOS.map(e => (
                    <button key={e} onClick={() => setNewEcos(prev => prev.includes(e) ? prev.filter(x=>x!==e) : [...prev,e])}
                      className={`text-xs px-2 py-1 rounded font-mono font-bold transition-all ${
                        newEcos.includes(e) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}>{e}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setCreating(false)}
                  className="flex-1 border border-slate-200 text-slate-500 font-semibold py-2.5 rounded-xl text-sm">Cancel</button>
                <button onClick={() => setCreating(false)}
                  className="flex-1 bg-[#0A2540] text-white font-black py-2.5 rounded-xl text-sm hover:bg-[#1D4ED8] transition-colors">
                  Create Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
