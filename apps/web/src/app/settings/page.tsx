'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function SettingsPage() {
  const [tab,      setTab]      = useState<'profile'|'notifications'|'api'|'billing'>('profile');
  const [name,     setName]     = useState('Demo User');
  const [email,    setEmail]    = useState('demo@fdimonitor.org');
  const [org,      setOrg]      = useState('Demo Organisation');
  const [role,     setRole]     = useState('Investment Director');
  const [saved,    setSaved]    = useState(false);
  const [apiKey,   setApiKey]   = useState('gfm_sk_••••••••••••••••••••••••••••••••');
  const [revealed, setRevealed] = useState(false);
  const [notifs,   setNotifs]   = useState({
    platinum_signals:true, gold_signals:true, gfr_changes:true,
    report_ready:true, billing:true, newsletter:false
  });

  function saveProfile() {
    setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  }

  function generateKey() {
    const key = 'gfm_sk_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    setApiKey(key); setRevealed(true);
  }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-8">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-2xl font-extrabold" style={{color:'#0A3D62'}}>Account Settings</h1>
          <p className="text-sm mt-1" style={{color:'#696969'}}>Profile · Notifications · API keys · Billing</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 flex gap-0 border-b px-6" style={{background:'rgba(240,248,238,0.96)',borderBottomColor:'rgba(10,61,98,0.15)',backdropFilter:'blur(10px)'}}>
        {[['profile','👤 Profile'],['notifications','🔔 Notifications'],['api','🔑 API'],['billing','💳 Billing']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t as any)} className={`dash-tab ${tab===t?'active':''}`}>{l}</button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">

        {/* Profile tab */}
        {tab==='profile' && (
          <div className="gfm-card p-6 space-y-4">
            <div className="font-extrabold text-sm mb-2" style={{color:'#0A3D62'}}>Profile Information</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl" aria-label="Full name"/>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Work Email</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
                  className="w-full px-3 py-2.5 text-sm rounded-xl" aria-label="Work email"/>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Organisation</label>
                <input value={org} onChange={e=>setOrg(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl" aria-label="Organisation"/>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>Role</label>
                <input value={role} onChange={e=>setRole(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl" aria-label="Role"/>
              </div>
            </div>
            <div className="pt-2">
              <button onClick={saveProfile} className="gfm-btn-primary px-6 py-2.5 text-sm">
                {saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
            <div className="pt-4 border-t" style={{borderTopColor:'rgba(10,61,98,0.1)'}}>
              <div className="font-extrabold text-sm mb-3" style={{color:'#EF4444'}}>Danger Zone</div>
              <button className="text-xs font-bold px-4 py-2 rounded-xl" style={{border:'1px solid rgba(239,68,68,0.3)',color:'#EF4444'}}>
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {tab==='notifications' && (
          <div className="gfm-card p-6 space-y-4">
            <div className="font-extrabold text-sm mb-2" style={{color:'#0A3D62'}}>Notification Preferences</div>
            {[
              ['platinum_signals',  'PLATINUM Signal alerts',   'Immediate notification for every new PLATINUM signal'],
              ['gold_signals',      'GOLD Signal alerts',       'Notification for new GOLD signals'],
              ['gfr_changes',       'GFR tier changes',         'When an economy moves to a new GFR tier'],
              ['report_ready',      'Report generation',        'When your PDF report is ready to download'],
              ['billing',           'Billing & credits',        'Subscription renewals and credit balance warnings'],
              ['newsletter',        'Weekly intelligence brief','Weekly summary of top signals and GFR movers'],
            ].map(([key, label, desc])=>(
              <div key={key} className="flex items-center justify-between py-3 border-b" style={{borderBottomColor:'rgba(10,61,98,0.08)'}}>
                <div>
                  <div className="text-sm font-semibold" style={{color:'#0A3D62'}}>{label}</div>
                  <div className="text-xs mt-0.5" style={{color:'#696969'}}>{desc}</div>
                </div>
                <button
                  onClick={()=>setNotifs(n=>({...n,[key]:!n[key as keyof typeof notifs]}))}
                  className="w-10 h-6 rounded-full transition-all flex-shrink-0"
                  style={{background:notifs[key as keyof typeof notifs]?'#74BB65':'rgba(10,61,98,0.2)'}}
                  aria-label={`Toggle ${label}`}>
                  <span className="block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1"
                    style={{transform:notifs[key as keyof typeof notifs]?'translateX(16px)':'translateX(0)'}}/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* API tab */}
        {tab==='api' && (
          <div className="space-y-4">
            <div className="gfm-card p-6">
              <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>API Key</div>
              <div className="flex gap-2 mb-3">
                <input value={revealed ? apiKey : 'gfm_sk_••••••••••••••••••••••••••••••••'}
                  readOnly className="flex-1 px-3 py-2.5 text-sm rounded-xl font-data" aria-label="API key"/>
                <button onClick={()=>setRevealed(r=>!r)} className="text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0"
                  style={{background:'rgba(10,61,98,0.1)',color:'#696969'}}>
                  {revealed?'Hide':'Show'}
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={generateKey} className="gfm-btn-primary text-sm py-2 px-4">Generate New Key</button>
                <button className="gfm-btn-outline text-sm py-2 px-4" style={{color:'#696969'}}>Copy</button>
              </div>
              <p className="text-xs mt-3" style={{color:'#EF4444'}}>Warning: generating a new key invalidates the previous one immediately.</p>
            </div>
            <div className="gfm-card p-6">
              <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Rate Limits</div>
              {[['Requests / minute','500'],['Requests / day','720,000'],['WebSocket connections','5'],['Concurrent report generations','3']].map(([l,v])=>(
                <div key={l} className="flex justify-between text-sm py-2 border-b" style={{borderBottomColor:'rgba(10,61,98,0.06)'}}>
                  <span style={{color:'#696969'}}>{l}</span>
                  <span className="font-bold font-data" style={{color:'#74BB65'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing tab */}
        {tab==='billing' && (
          <div className="space-y-4">
            <div className="gfm-card p-6">
              <div className="font-extrabold text-sm mb-4" style={{color:'#0A3D62'}}>Current Plan</div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-extrabold text-lg" style={{color:'#74BB65'}}>Professional</div>
                  <div className="text-xs" style={{color:'#696969'}}>Monthly billing · Next renewal: 2026-04-18</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold font-data text-xl" style={{color:'#0A3D62'}}>$799</div>
                  <div className="text-xs" style={{color:'#696969'}}>/ month</div>
                </div>
              </div>
              <div className="text-xs py-2 px-3 rounded-xl mb-4" style={{background:'rgba(116,187,101,0.08)',color:'#74BB65'}}>
                Switch to annual billing and save $1,440/year ($679/month)
              </div>
              <div className="flex gap-2">
                <button className="gfm-btn-primary text-sm py-2 px-4">Switch to Annual</button>
                <button className="text-xs font-bold px-4 py-2 rounded-xl" style={{border:'1px solid rgba(239,68,68,0.3)',color:'#EF4444'}}>Cancel Plan</button>
              </div>
            </div>
            <div className="gfm-card p-6">
              <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Intelligence Credits</div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-3xl font-extrabold font-data" style={{color:'#74BB65'}}>142</div>
                  <div className="text-xs" style={{color:'#696969'}}>of 200 credits remaining this month</div>
                </div>
                <button className="gfm-btn-primary text-sm py-2 px-4">Buy More</button>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(10,61,98,0.1)'}}>
                <div className="h-full rounded-full" style={{width:'71%',background:'#74BB65'}}/>
              </div>
              <div className="text-xs mt-2" style={{color:'#696969'}}>Resets on 2026-04-18</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
