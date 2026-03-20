'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';
import PreviewGate from '@/components/PreviewGate';

const INIT_LISTS = [
  { id:1, name:'MENA Priority Economies', type:'ECONOMY',  color:'#74BB65',
    items:[{flag:'🇦🇪',name:'UAE',iso3:'ARE'},{flag:'🇸🇦',name:'Saudi Arabia',iso3:'SAU'},{flag:'🇶🇦',name:'Qatar',iso3:'QAT'},{flag:'🇪🇬',name:'Egypt',iso3:'EGY'}],
    signals_7d:12, gfr_changes:2 },
  { id:2, name:'ICT Sector Watch',        type:'SECTOR',   color:'#0A3D62',
    items:[{flag:'💻',name:'ICT'},{flag:'🤖',name:'AI/Data Centers'},{flag:'⚡',name:'Semiconductors'}],
    signals_7d:18, gfr_changes:0 },
  { id:3, name:'Key Investors',           type:'COMPANY',  color:'#22c55e',
    items:[{flag:'🇺🇸',name:'Microsoft'},{flag:'🇺🇸',name:'Google Cloud'},{flag:'🇸🇦',name:'ACWA Power'}],
    signals_7d:6, gfr_changes:0 },
];

const TYPE_C: Record<string,string> = {ECONOMY:'#74BB65',SECTOR:'#0A3D62',COMPANY:'#22c55e'};

export default function WatchlistsPage() {
  const [lists, setLists] = useState(INIT_LISTS);
  const [modal, setModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('ECONOMY');

  function addList() {
    if (!newName.trim()) return;
    setLists(p=>[...p,{id:Date.now(),name:newName,type:newType as any,color:TYPE_C[newType],items:[],signals_7d:0,gfr_changes:0}]);
    setNewName(''); setModal(false);
  }

  function removeList(id: number) { setLists(p=>p.filter(l=>l.id!==id)); }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-8">
        <div className="max-w-screen-xl mx-auto relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{color:'#74BB65'}}>Intelligence</div>
            <h1 className="text-2xl font-extrabold" style={{color:'#0A3D62'}}>Watchlists</h1>
            <p className="text-sm mt-1" style={{color:'#696969'}}>Monitor economies, sectors, and companies · Real-time alerts</p>
          </div>
          <button onClick={()=>setModal(true)} className="gfm-btn-primary text-sm py-2 px-5">+ New Watchlist</button>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={()=>setModal(false)}>
            <div className="gfm-card p-6 max-w-sm w-full" onClick={e=>e.stopPropagation()}>
              <div className="font-extrabold text-sm mb-4" style={{color:'#0A3D62'}}>Create Watchlist</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Name</label>
                  <input value={newName} onChange={e=>setNewName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl" placeholder="My MENA Watch…"/>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Type</label>
                  <select value={newType} onChange={e=>setNewType(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-xl">
                    {['ECONOMY','SECTOR','COMPANY'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={addList} className="gfm-btn-primary flex-1 py-2.5 text-sm">Create</button>
                <button onClick={()=>setModal(false)} className="gfm-btn-outline px-4 text-sm" style={{color:'#696969'}}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <PreviewGate feature="full_profile">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map(list=>(
            <div key={list.id} className="gfm-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{background:`${list.color}15`,color:list.color}}>{list.type}</span>
                  </div>
                  <div className="font-extrabold text-sm" style={{color:'#0A3D62'}}>{list.name}</div>
                </div>
                <button onClick={()=>removeList(list.id)} className="text-sm" style={{color:'#696969'}} aria-label="Remove watchlist">✕</button>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {list.items.slice(0,3).map((item:any,i:number)=>(
                  <span key={i} className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{background:'rgba(10,61,98,0.1)',color:'#696969'}}>
                    {item.flag} {item.name}
                  </span>
                ))}
                {list.items.length > 3 && <span className="text-xs" style={{color:'#696969'}}>+{list.items.length-3} more</span>}
              </div>

              <div className="flex gap-4 text-xs mb-3">
                <div><span style={{color:'#696969'}}>Signals 7d: </span><span className="font-bold" style={{color:'#22c55e'}}>{list.signals_7d}</span></div>
                <div><span style={{color:'#696969'}}>GFR changes: </span><span className="font-bold" style={{color:'#74BB65'}}>{list.gfr_changes}</span></div>
              </div>

              <Link href="/signals" className="text-xs font-bold" style={{color:'#74BB65'}}>View Signals →</Link>
            </div>
          ))}

          {lists.length === 0 && (
            <div className="md:col-span-3 text-center py-16" style={{color:'#696969'}}>
              <div className="text-4xl mb-3">📋</div>
              <div className="font-extrabold mb-2" style={{color:'#696969'}}>No watchlists yet</div>
              <button onClick={()=>setModal(true)} className="gfm-btn-primary text-sm px-5 py-2.5">Create First Watchlist</button>
            </div>
          )}
        </div>
        </PreviewGate>
      </div>
    </div>
  );
}
