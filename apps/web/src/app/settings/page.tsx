'use client';
import { useState, useEffect } from 'react';
import { getUser, getOrg, clearAuth, fetchWithAuth } from '@/lib/shared';
import { useRouter } from 'next/navigation';
const TABS=['Account','Notifications','Security','Billing'] as const;
export default function SettingsPage() {
  const router=useRouter();
  const [tab,setTab]=useState<typeof TABS[number]>('Account');
  const [user,setUser]=useState<any>(null);
  const [org,setOrg]=useState<any>(null);
  const [saved,setSaved]=useState(false);
  const [notifs,setNotifs]=useState({platinum:true,gold:true,gfr:true,newsletter:true,fic_low:true,pipeline:false});
  useEffect(()=>{
    setUser(getUser());setOrg(getOrg());
    fetchWithAuth('/api/v1/auth/me').then(r=>r.json()).then(d=>{if(d.success){setUser(d.data.user);setOrg(d.data.org);}}).catch(()=>{});
  },[]);
  function logout(){clearAuth();router.push('/');}
  async function saveNotifs(){
    try{await fetchWithAuth('/api/v1/notifications/preferences',{method:'PUT',body:JSON.stringify(notifs)});}catch{}
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  }
  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10"><h1 className="text-3xl font-extrabold">Settings</h1></div>
      </section>
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1">
          {TABS.map(t=><button key={t} onClick={()=>setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t?'bg-primary text-white':'text-slate-500 hover:text-deep'}`}>{t}</button>)}
        </div>
        {tab==='Account'&&(
          <div className="gfm-card p-6 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-extrabold">{user?.full_name?.[0]||'U'}</div>
              <div><div className="font-extrabold text-deep text-lg">{user?.full_name||'Loading…'}</div><div className="text-sm text-slate-400">{user?.email||''}</div><div className="text-xs text-slate-400 mt-0.5">{org?.name} · {org?.tier?.toUpperCase()}</div></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Full Name',user?.full_name],['Email',user?.email],['Organisation',org?.name],['Plan',org?.tier?.toUpperCase()]].map(([l,v])=>(
                <div key={String(l)}>
                  <div className="text-xs font-bold text-slate-400 mb-1">{l}</div>
                  <div className="text-sm text-deep font-medium">{v||'—'}</div>
                </div>
              ))}
            </div>
            {org?.tier==='free_trial'&&(
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div><div className="font-bold text-amber-800 text-sm">Free Trial Active</div><div className="text-xs text-amber-600">{org?.fic_balance} FIC remaining · Expires {org?.trial_end?.slice(0,10)}</div></div>
                <a href="/subscription" className="gfm-btn-primary text-xs py-2 px-4">Upgrade</a>
              </div>
            )}
            <button onClick={logout} className="text-xs text-red-500 hover:underline font-semibold">Sign out of this device</button>
          </div>
        )}
        {tab==='Notifications'&&(
          <div className="gfm-card p-6 space-y-4">
            {[['platinum','PLATINUM signal alerts',true],['gold','GOLD signal alerts',true],['gfr','GFR ranking updates',true],['newsletter','Weekly intelligence digest',true],['fic_low','Low FIC balance warning',true],['pipeline','Pipeline stage changes',false]].map(([k,l,def])=>(
              <div key={String(k)} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div><div className="text-sm font-semibold text-deep">{l}</div></div>
                <button onClick={()=>setNotifs(n=>({...n,[String(k)]:!n[String(k) as keyof typeof n]}))}
                  className={`w-12 h-6 rounded-full relative transition-all ${notifs[String(k) as keyof typeof notifs]?'bg-primary':'bg-slate-200'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${notifs[String(k) as keyof typeof notifs]?'left-6':'left-0.5'}`}/>
                </button>
              </div>
            ))}
            <button onClick={saveNotifs} className={`gfm-btn-primary py-3 w-full rounded-xl ${saved?'bg-emerald-600':''}`}>{saved?'✓ Saved':'Save Preferences'}</button>
          </div>
        )}
        {tab==='Security'&&(
          <div className="gfm-card p-6 space-y-4">
            <div className="font-bold text-deep mb-2">Password</div>
            <input type="password" placeholder="Current password" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"/>
            <input type="password" placeholder="New password" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"/>
            <input type="password" placeholder="Confirm new password" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"/>
            <button className="gfm-btn-primary py-3 w-full rounded-xl">Update Password</button>
            <div className="pt-2 border-t border-slate-100">
              <div className="font-bold text-deep mb-2 text-sm">Active Sessions</div>
              <div className="gfm-card p-3 bg-surface flex justify-between items-center">
                <div className="text-xs text-slate-600">Current browser · {new Date().toLocaleDateString()}</div>
                <span className="text-xs font-bold text-emerald-600">Active</span>
              </div>
            </div>
          </div>
        )}
        {tab==='Billing'&&(
          <div className="gfm-card p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div><div className="font-bold text-deep">Current Plan</div><div className="text-sm text-slate-400 capitalize">{org?.tier?.replace('_',' ')||'Free Trial'}</div></div>
              <a href="/subscription" className="gfm-btn-primary text-xs py-2 px-4">Manage Plan</a>
            </div>
            <div className="flex justify-between items-center">
              <div><div className="font-bold text-deep">FIC Balance</div><div className="text-sm text-slate-400">Forecasta Intelligence Credits</div></div>
              <div className="text-2xl font-extrabold text-primary font-mono">{org?.fic_balance??5}</div>
            </div>
            <a href="/fic" className="gfm-btn-outline w-full text-center py-3 rounded-xl block">Buy FIC Credits</a>
          </div>
        )}
      </div>
    </div>
  );
}
