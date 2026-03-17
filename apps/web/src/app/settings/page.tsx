'use client';
import { useState, useEffect } from 'react';
import { getUser, getOrg, fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function SettingsPage() {
  const [tab, setTab]   = useState<'profile'|'notifications'|'security'|'api'>('profile');
  const [saved, setSaved] = useState(false);
  const user = getUser();
  const org  = getOrg();

  const [prefs, setPrefs] = useState({
    emailSignals:   true,
    emailReports:   true,
    emailFicLow:    true,
    browserSignals: false,
    weeklyDigest:   true,
    minGrade:       'GOLD',
  });

  async function saveNotifPrefs() {
    try {
      await fetchWithAuth(`${API}/api/v1/notifications/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Account</div>
          <h1 className="text-3xl font-extrabold">Settings</h1>
        </div>
      </section>

      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-3xl mx-auto flex gap-0">
          {[['profile','👤 Profile'],['notifications','🔔 Notifications'],['security','🔐 Security'],['api','🔑 API Access']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
        {tab === 'profile' && (
          <>
            <div className="gfm-card p-6">
              <div className="font-bold text-deep text-sm mb-4">Account Information</div>
              <div className="space-y-4">
                {[
                  ['Email', user?.email || 'user@example.com', 'email'],
                  ['Full Name', user?.full_name || 'User', 'text'],
                  ['Organisation', org?.name || 'Organisation', 'text'],
                ].map(([label, val, type]) => (
                  <div key={String(label)}>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">{label}</label>
                    <input type={String(type)} defaultValue={String(val)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"/>
                  </div>
                ))}
                <button className="gfm-btn-primary px-6 py-2.5 rounded-xl text-sm">Save Profile</button>
              </div>
            </div>
            <div className="gfm-card p-5">
              <div className="font-bold text-deep text-sm mb-3">Subscription</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-primary">{org?.tier === 'free_trial' ? 'Free Trial' : 'Professional'}</div>
                  <div className="text-xs text-slate-400 mt-0.5">FIC Balance: <strong className="text-amber-600">{org?.fic_balance ?? 5}</strong></div>
                </div>
                <a href="/subscription" className="gfm-btn-outline text-sm px-5 py-2">Manage →</a>
              </div>
            </div>
          </>
        )}

        {tab === 'notifications' && (
          <div className="gfm-card p-6">
            <div className="font-bold text-deep text-sm mb-4">Alert Preferences</div>
            <div className="space-y-4">
              {[
                {k:'emailSignals',   l:'Email: PLATINUM/GOLD signals', d:'Get emailed when top signals are detected'},
                {k:'emailReports',   l:'Email: Report ready', d:'Notified when your generated reports are ready'},
                {k:'emailFicLow',    l:'Email: Low FIC balance', d:'Alert when FIC balance drops below 3'},
                {k:'browserSignals', l:'Browser: PLATINUM push', d:'Desktop notification for PLATINUM signals'},
                {k:'weeklyDigest',   l:'Email: Weekly digest', d:'Free weekly intelligence digest'},
              ].map(({k,l,d})=>(
                <div key={k} className="flex items-start justify-between gap-4 pb-3 border-b border-slate-50">
                  <div>
                    <div className="text-sm font-semibold text-deep">{l}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{d}</div>
                  </div>
                  <button onClick={()=>setPrefs(p=>({...p,[k]:!p[k as keyof typeof p]}))}
                    className={`flex-shrink-0 w-11 h-6 rounded-full relative transition-all ${prefs[k as keyof typeof prefs]?'bg-primary':'bg-slate-200'}`}
                    role="switch" aria-checked={!!prefs[k as keyof typeof prefs]}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${prefs[k as keyof typeof prefs]?'left-5':'left-0.5'}`}/>
                  </button>
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Minimum Grade for Notifications</label>
                <select value={prefs.minGrade} onChange={e=>setPrefs(p=>({...p,minGrade:e.target.value}))}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary w-full">
                  {['PLATINUM','GOLD','SILVER','BRONZE'].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <button onClick={saveNotifPrefs} className="gfm-btn-primary px-6 py-2.5 rounded-xl text-sm">
                {saved ? '✓ Saved!' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="space-y-4">
            <div className="gfm-card p-6">
              <div className="font-bold text-deep text-sm mb-4">Change Password</div>
              <div className="space-y-3">
                {['Current password','New password','Confirm new password'].map(l=>(
                  <div key={l}>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">{l}</label>
                    <input type="password" placeholder="••••••••"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"/>
                  </div>
                ))}
                <button className="gfm-btn-primary px-6 py-2.5 rounded-xl text-sm mt-1">Update Password</button>
              </div>
            </div>
            <div className="gfm-card p-5">
              <div className="font-bold text-deep text-sm mb-3">Session</div>
              <button onClick={()=>{localStorage.clear();window.location.href='/auth/login';}}
                className="gfm-btn-outline text-sm px-5 py-2 text-red-600 border-red-200 hover:bg-red-50">
                Sign Out All Devices
              </button>
            </div>
          </div>
        )}

        {tab === 'api' && (
          <div className="gfm-card p-6">
            <div className="font-bold text-deep text-sm mb-1">API Access</div>
            <p className="text-xs text-slate-400 mb-5">Enterprise plans include direct API access with your organisation JWT.</p>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-green-400 mb-4">
              <div className="text-slate-500 mb-2"># Example: Fetch GFR Rankings</div>
              <div>curl https://api.fdimonitor.org/api/v1/gfr \</div>
              <div className="text-blue-400">  -H &quot;Authorization: Bearer YOUR_TOKEN&quot;</div>
            </div>
            <a href="https://api.fdimonitor.org/api/v1/openapi.json" target="_blank"
              className="gfm-btn-outline text-sm px-5 py-2 inline-block">View OpenAPI Spec →</a>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              API access requires Enterprise plan. <a href="/subscription" className="font-bold underline">Upgrade →</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
