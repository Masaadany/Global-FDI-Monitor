'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const DEMO_LISTS = [
  { id:'wl1', name:'MENA Technology', economies:['UAE','SAU','QAT','EGY'], sectors:['J'], signal_count:14, created_at:'2026-02-01' },
  { id:'wl2', name:'ASEAN Battery Chain', economies:['IDN','VNM','THA','MYS'], sectors:['C'], signal_count:9, created_at:'2026-02-15' },
  { id:'wl3', name:'Africa Energy', economies:['NGA','ZAF','EGY','MAR'], sectors:['D'], signal_count:5, created_at:'2026-03-01' },
];

export default function WatchlistsPage() {
  const [lists,   setLists]   = useState(DEMO_LISTS);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating,setCreating]= useState(false);

  useEffect(() => {
    fetchWithAuth(`${API}/api/v1/watchlists`).then(r => r.json())
      .then(d => { if (d.data?.watchlists?.length) setLists(d.data.watchlists); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function create() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const r = await fetchWithAuth(`${API}/api/v1/watchlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      const d = await r.json();
      if (d.data) setLists(l => [d.data, ...l]);
      else setLists(l => [{ id:`wl${Date.now()}`, name:newName, economies:[], sectors:[], signal_count:0, created_at:new Date().toISOString().slice(0,10) }, ...l]);
    } catch {}
    setNewName(''); setCreating(false);
  }

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Intelligence Tracking</div>
            <h1 className="text-3xl font-extrabold">Watchlists</h1>
            <p className="text-white/60 mt-1 text-sm">Track economies, corridors, and sectors. Alerts auto-generated.</p>
          </div>
          <div className="stat-number text-3xl font-bold text-white">{lists.length}</div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
        {/* Create */}
        <div className="gfm-card p-5">
          <div className="font-bold text-deep text-sm mb-3">Create Watchlist</div>
          <div className="flex gap-3">
            <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&create()}
              placeholder="e.g. India Manufacturing 2026" className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"/>
            <button onClick={create} disabled={creating||!newName.trim()} className={`gfm-btn-primary px-5 py-2.5 rounded-xl text-sm ${creating||!newName.trim()?'opacity-50':''}`}>
              {creating ? '…' : '+ Create'}
            </button>
          </div>
        </div>

        {/* Lists */}
        {loading ? (
          Array(3).fill(0).map((_,i) => <div key={i} className="gfm-card p-5 h-24 animate-pulse bg-slate-50"/>)
        ) : lists.map(list => (
          <div key={list.id} className="gfm-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-extrabold text-deep text-base">{list.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">Created {list.created_at?.slice(0,10)}</div>
              </div>
              <div className="flex gap-2">
                <a href={`/signals?watchlist=${list.id}`} className="gfm-btn-outline text-xs py-1.5 px-3">View Signals</a>
                <button className="text-xs text-red-400 hover:text-red-600 px-2">✕</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(list.economies||[]).map((e:string) => (
                <a key={e} href={`/country/${e}`} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded font-mono border border-blue-200 hover:bg-primary hover:text-white transition-all">{e}</a>
              ))}
              {(list.sectors||[]).map((s:string) => (
                <span key={s} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-semibold">ISIC-{s}</span>
              ))}
              <span className="text-xs text-slate-400 ml-auto">{list.signal_count} signals</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
