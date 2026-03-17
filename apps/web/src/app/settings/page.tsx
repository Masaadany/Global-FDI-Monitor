'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function SettingsPage() {
  const [user,    setUser]    = useState<any>(null);
  const [org,     setOrg]     = useState<any>(null);
  const [tab,     setTab]     = useState<'profile'|'billing'|'api'|'notifications'>('profile');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');

  useEffect(()=>{
    // Fetch latest user data from API
    const token = typeof window !== 'undefined' ? localStorage.getItem('gfm_token') : null;
    if (token) {
      fetch(`${API}/api/v1/auth/me`,{headers:{Authorization:`Bearer ${token}`}})
        .then(r=>r.json())
        .then(d=>{
          if(d.success&&d.data){
            setUser(d.data.user);
            setOrg(d.data.org);
            setName(d.data.user?.full_name||'');
            setEmail(d.data.user?.email||'');
          }
        }).catch(()=>{});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  useEffect(()=>{ // keep original local storage fallback
    if (typeof window === 'undefined') return;
    const u = localStorage.getItem('gfm_user');
    const o = localStorage.getItem('gfm_org');
    if (u) { const parsed=JSON.parse(u); setUser(parsed); setName(parsed.full_name||''); setEmail(parsed.email||''); }
    if (o) setOrg(JSON.parse(o));
  },[]);

  async function save() {
    setSaving(true);
    await new Promise(r=>setTimeout(r,800));
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false),3000);
  }

  const TOKEN_PREVIEW = typeof window!=='undefined' ? (localStorage.getItem('gfm_token')||'').slice(0,32)+'…' : '…';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-4 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Settings</span>
        <div className="flex gap-1 ml-4">
          {(['profile','billing','api','notifications'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${tab===t?'bg-[#0A2540] text-white':'text-slate-400 border border-slate-200'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-5 space-y-5">
        {tab==='profile' && (
          <>
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="font-black text-[#0A2540] mb-5">Profile Information</div>
              <div className="space-y-4">
                <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Full name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/></div>
                <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Email</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/></div>
                <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Organisation</label>
                  <input value={org?.name||''} disabled className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm bg-slate-50 text-slate-400"/></div>
              </div>
              <button onClick={save} disabled={saving}
                className={`mt-5 px-6 py-2.5 rounded-xl text-sm font-black transition-colors ${saving?'bg-slate-300 text-slate-500':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'}`}>
                {saving?'Saving…':saved?'✓ Saved':'Save Changes'}
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="font-black text-[#0A2540] mb-3">Change Password</div>
              <div className="space-y-3">
                {['Current password','New password','Confirm new password'].map(l=>(
                  <div key={l}><label className="text-xs font-bold text-slate-500 block mb-1.5">{l}</label>
                    <input type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/></div>
                ))}
              </div>
              <button className="mt-4 px-6 py-2.5 rounded-xl text-sm font-black bg-[#0A2540] text-white hover:bg-[#1D4ED8] transition-colors">Update Password</button>
            </div>
          </>
        )}

        {tab==='billing' && (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="font-black text-[#0A2540] mb-5">Billing & Subscription</div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Current Plan</div>
                <div className="font-black text-lg text-[#0A2540]">{org?.tier?.replace('_',' ').toUpperCase()||'Free Trial'}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">FIC Balance</div>
                <div className="font-black text-lg text-amber-600">⭐ {org?.fic_balance??5} credits</div>
              </div>
            </div>
            <div className="space-y-3">
              <Link href="/pricing" className="block w-full text-center bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">Upgrade Plan →</Link>
              <Link href="/fic"     className="block w-full text-center border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl hover:border-blue-300 transition-colors">Buy FIC Credits</Link>
            </div>
          </div>
        )}

        {tab==='api' && (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="font-black text-[#0A2540] mb-5">API Access</div>
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-500 mb-2">Your Access Token (Bearer)</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-500 truncate">{TOKEN_PREVIEW}</code>
                <button className="text-xs font-bold text-blue-600 hover:underline flex-shrink-0">Copy</button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
              <div className="font-black mb-2">API Base URL</div>
              <code className="block font-mono">https://fdi-backend-api.gentleglacier-ae9701ca.uaenorth.azurecontainerapps.io</code>
              <div className="font-black mt-3 mb-1">Example request</div>
              <code className="block font-mono whitespace-pre">{'curl -H "Authorization: Bearer TOKEN" \\\n     /api/v1/signals?grade=PLATINUM'}</code>
            </div>
            <a href={`${API}/api/v1/health`} target="_blank" rel="noopener"
              className="inline-block mt-4 text-xs text-blue-600 font-bold hover:underline">
              API Health Check →
            </a>
          </div>
        )}

        {tab==='notifications' && (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="font-black text-[#0A2540] mb-5">Notification Preferences</div>
            <div className="space-y-4">
              {[
                {l:'New PLATINUM signals',    sub:'Instant · Email + in-app',      def:true},
                {l:'New GOLD signals',        sub:'Hourly digest · Email + in-app', def:true},
                {l:'GFR ranking updates',     sub:'Quarterly · Email',              def:true},
                {l:'Weekly newsletter',       sub:'Every Monday · Email',           def:true},
                {l:'Pipeline stage changes',  sub:'Instant · In-app only',          def:false},
                {l:'FIC balance low (< 5)',   sub:'Threshold · Email',              def:true},
                {l:'Watchlist signal matches',sub:'Real-time · In-app',             def:true},
              ].map(n=>(
                <div key={n.l} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div>
                    <div className="text-sm font-bold text-[#0A2540]">{n.l}</div>
                    <div className="text-xs text-slate-400">{n.sub}</div>
                  </div>
                  <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors flex-shrink-0 ${n.def?'bg-blue-600':'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow ${n.def?'translate-x-5':'translate-x-0.5'}`}/>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 px-6 py-2.5 rounded-xl text-sm font-black bg-[#0A2540] text-white hover:bg-[#1D4ED8] transition-colors">Save Preferences</button>
          </div>
        )}
      </div>
    </div>
  );
}
