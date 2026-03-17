'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/shared';
const MOCK = [
  {id:'wl_001',name:'MENA Technology',economies:['ARE','SAU','QAT'],sectors:['J','K'],signals:8,  alerts:2,created_at:'2026-03-01'},
  {id:'wl_002',name:'ASEAN Renewable Energy',economies:['VNM','IDN','THA'],sectors:['D'],signals:6,  alerts:1,created_at:'2026-03-10'},
  {id:'wl_003',name:'Africa Critical Minerals',economies:['NGA','KEN','ZAF'],sectors:['B'],signals:3,  alerts:0,created_at:'2026-03-15'},
];
export default function WatchlistsPage() {
  const [lists,setLists]=useState(MOCK);
  const [showNew,setShowNew]=useState(false);
  const [name,setName]=useState('');
  async function create() {
    if(!name.trim()) return;
    const newWL={id:`wl_${Date.now()}`,name,economies:[],sectors:[],signals:0,alerts:0,created_at:new Date().toISOString().slice(0,10)};
    setLists(l=>[...l,newWL]);
    try { await fetchWithAuth('/api/v1/watchlists',{method:'POST',body:JSON.stringify({name})}); } catch {}
    setName('');setShowNew(false);
  }
  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Signal Monitoring</div>
            <h1 className="text-3xl font-extrabold">My Watchlists</h1>
            <p className="text-white/70 mt-1">Monitor economy–sector combinations for new FDI signals</p>
          </div>
          <button onClick={()=>setShowNew(v=>!v)} className="gfm-btn-primary bg-white text-primary hover:opacity-90 px-5 py-2.5">+ New Watchlist</button>
        </div>
      </section>
      {showNew&&(
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-screen-xl mx-auto flex gap-3 items-center">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Watchlist name…" autoFocus
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary flex-1 max-w-sm"
              onKeyDown={e=>e.key==='Enter'&&create()}/>
            <button onClick={create} className="gfm-btn-primary px-5 py-2.5">Create</button>
            <button onClick={()=>setShowNew(false)} className="text-slate-400 hover:text-slate-600 px-3">×</button>
          </div>
        </div>
      )}
      <div className="max-w-screen-xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-5">
        {lists.map(wl=>(
          <div key={wl.id} className="gfm-card p-5">
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-bold text-deep text-lg">{wl.name}</h2>
              {wl.alerts>0&&<span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{wl.alerts}</span>}
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {wl.economies.map(e=><span key={e} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded font-mono">{e}</span>)}
              {wl.sectors.map(s=><span key={s} className="text-xs bg-surface border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-mono">ISIC {s}</span>)}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
              <span className="font-bold text-primary">{wl.signals} signals</span>
              <span>Since {wl.created_at}</span>
            </div>
            <div className="flex gap-2">
              <button className="gfm-btn-primary text-xs py-1.5 flex-1">View Signals</button>
              <button className="gfm-btn-outline text-xs py-1.5 px-3">Edit</button>
            </div>
          </div>
        ))}
        <div className="gfm-card p-5 border-dashed flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors" onClick={()=>setShowNew(true)}>
          <div className="text-3xl mb-2">➕</div>
          <div className="font-bold text-slate-400">Add Watchlist</div>
          <p className="text-xs text-slate-300 mt-1">Monitor any economy–sector combination</p>
        </div>
      </div>
    </div>
  );
}
