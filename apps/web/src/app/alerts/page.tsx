'use client';
import { useState } from 'react';

const ALERT_TYPES = [
  {id:'PLATINUM_SIGNAL',   label:'Platinum Signals',       desc:'Highest-grade investment signals (SCI ≥ 85)',   default:true,  fic:1},
  {id:'GOLD_SIGNAL',       label:'Gold Signals',            desc:'Gold-grade investment signals (SCI 70-84)',    default:false, fic:0},
  {id:'GFR_TIER_CHANGE',  label:'GFR Tier Changes',        desc:'Economy moves to a new GFR tier',             default:true,  fic:0},
  {id:'GFR_MOVER',        label:'GFR Top Movers',          desc:'Economy gains or loses 3+ GFR points',        default:false, fic:0},
  {id:'REGULATORY_CHANGE',label:'Regulatory Changes',      desc:'FDI policy changes in watched economies',     default:true,  fic:0},
  {id:'REPORT_READY',     label:'Report Ready',            desc:'Your generated reports are complete',          default:true,  fic:0},
  {id:'FIC_LOW',          label:'Low FIC Balance',         desc:'FIC balance falls below 50 credits',          default:true,  fic:0},
  {id:'TRIAL_EXPIRY',     label:'Trial Expiry Reminder',   desc:'2 days and 1 day before trial ends',          default:true,  fic:0},
  {id:'GEO_RISK_CHANGE',  label:'Geopolitical Risk Alerts',desc:'Risk tier change in watched economies',        default:false, fic:0},
  {id:'SANCTIONS_FLAG',   label:'Sanctions Flags',         desc:'Entity in your pipeline flagged on OFAC/EU/UN',default:true, fic:0},
];

const DELIVERY_CHANNELS = [
  {id:'in_app',  label:'In-App Notifications', desc:'Bell icon + notification tray',    always:true, free:true},
  {id:'email',   label:'Email Digest',          desc:'Instant or daily digest email',    always:false,free:true},
  {id:'push',    label:'Browser Push',          desc:'Desktop push notifications',       always:false,free:true},
  {id:'slack',   label:'Slack Webhook',          desc:'Post to any Slack channel',        always:false,free:true},
  {id:'teams',   label:'Microsoft Teams',        desc:'Post to any Teams channel',        always:false,free:true},
  {id:'webhook', label:'Custom Webhook',         desc:'POST to any endpoint in JSON',     always:false,free:true},
];

const RECENT_ALERTS = [
  {id:1, type:'PLATINUM_SIGNAL',  icon:'⚡',color:'text-amber-600 bg-amber-50', time:'2 min ago',  read:false, title:'Microsoft Corp · UAE — SCI:91.2',     detail:'$850M data centre campus confirmed in Abu Dhabi. Reference: MSS-GFS-ARE-20260315-0001'},
  {id:2, type:'GFR_TIER_CHANGE',  icon:'🏆',color:'text-violet-600 bg-violet-50',time:'18 min ago', read:false, title:'UAE advances to Top 30 · GFR +4.2',    detail:'UAE records largest quarterly GFR gain (+4.2 pts). New composite: 80.0'},
  {id:3, type:'PLATINUM_SIGNAL',  icon:'⚡',color:'text-amber-600 bg-amber-50', time:'1 hr ago',   read:false, title:'Amazon Web Services · Saudi Arabia',    detail:'$5.3B cloud region expansion. SCI:89.5. Reference: MSS-CES-SAU-20260315-0002'},
  {id:4, type:'REGULATORY_CHANGE',icon:'📜',color:'text-blue-600 bg-blue-50',   time:'6 hr ago',   read:true,  title:'India: Insurance FDI cap raised to 100%',detail:'DPIIT notification: automatic route for 100% FDI in insurance sector effective immediately'},
  {id:5, type:'REPORT_READY',     icon:'📋',color:'text-emerald-600 bg-emerald-50',time:'1 day ago', read:true, title:'Report ready: FCR-CEGP-ARE-20260314',   detail:'Your Country Economic & Geopolitical Profile for UAE is ready for download'},
  {id:6, type:'GFR_MOVER',        icon:'📈',color:'text-emerald-600 bg-emerald-50',time:'1 day ago', read:true, title:'Saudi Arabia GFR +3.1 · Now #14',        detail:'Saudi Arabia records Q1 2026 GFR improvement. Vision 2030 reform momentum continues'},
  {id:7, type:'REGULATORY_CHANGE',icon:'📜',color:'text-blue-600 bg-blue-50',   time:'5 days ago', read:true,  title:'UAE: 0% CT free zone exemption to 2035',  detail:'UAE extends Qualifying Free Zone Person regime through 2035. Enhanced substance rules clarified'},
];

export default function AlertsPage() {
  const [activeTypes, setActiveTypes]     = useState(() => new Set(ALERT_TYPES.filter(a=>a.default).map(a=>a.id)));
  const [channels, setChannels]           = useState(() => new Set(['in_app','email']));
  const [emailFreq, setEmailFreq]         = useState('instant');
  const [slackUrl, setSlackUrl]           = useState('');
  const [unreadOnly, setUnreadOnly]       = useState(false);
  const [typeFilter, setTypeFilter]       = useState('');
  const [showSettings, setShowSettings]  = useState(false);

  const alerts = RECENT_ALERTS.filter(a =>
    (!unreadOnly || !a.read) &&
    (!typeFilter || a.type === typeFilter)
  );
  const unreadCount = RECENT_ALERTS.filter(a => !a.read).length;

  function toggleType(id: string) {
    setActiveTypes(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleChannel(id: string, always: boolean) {
    if (always) return;
    setChannels(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Alert Centre</span>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{unreadCount} new</span>
        )}
        <div className="flex gap-1.5 ml-4">
          <button onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${unreadOnly ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
            Unread only
          </button>
          {['','PLATINUM_SIGNAL','GFR_TIER_CHANGE','REGULATORY_CHANGE','REPORT_READY'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${typeFilter===t ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
              {t === '' ? 'All' : t.replace('_',' ').replace('_',' ')}
            </button>
          ))}
        </div>
        <button onClick={() => setShowSettings(!showSettings)}
          className={`ml-auto px-4 py-2 rounded-lg text-xs font-bold transition-all ${showSettings ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}>
          ⚙ Alert Settings
        </button>
      </div>

      <div className="p-5 grid grid-cols-[1fr_320px] gap-5">
        {/* Alert feed */}
        <div>
          {showSettings && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4">
              <div className="font-bold text-sm text-blue-700 mb-4">Alert Configuration</div>
              <div className="grid grid-cols-2 gap-5">
                {/* Alert types */}
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Alert Types</div>
                  <div className="space-y-2">
                    {ALERT_TYPES.map(a => (
                      <label key={a.id} className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={activeTypes.has(a.id)} onChange={() => toggleType(a.id)}
                          className="mt-0.5 w-3.5 h-3.5 accent-blue-600"/>
                        <div>
                          <div className="text-xs font-semibold text-slate-700">{a.label}
                            {a.fic > 0 && <span className="ml-1.5 text-amber-600 font-bold">({a.fic} FIC)</span>}
                          </div>
                          <div className="text-xs text-slate-400">{a.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Delivery channels */}
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Delivery Channels</div>
                  <div className="space-y-2">
                    {DELIVERY_CHANNELS.map(c => (
                      <div key={c.id}>
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input type="checkbox" checked={channels.has(c.id) || c.always}
                            disabled={c.always} onChange={() => toggleChannel(c.id, c.always)}
                            className="mt-0.5 w-3.5 h-3.5 accent-blue-600"/>
                          <div>
                            <div className="text-xs font-semibold text-slate-700">{c.label}
                              {c.always && <span className="ml-1 text-slate-400 font-normal">(always on)</span>}
                            </div>
                            <div className="text-xs text-slate-400">{c.desc}</div>
                          </div>
                        </label>
                        {c.id === 'email' && channels.has('email') && (
                          <div className="ml-5 mt-1.5 flex gap-2">
                            {['instant','hourly','daily'].map(f => (
                              <button key={f} onClick={() => setEmailFreq(f)}
                                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${emailFreq===f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
                                {f.charAt(0).toUpperCase()+f.slice(1)}
                              </button>
                            ))}
                          </div>
                        )}
                        {c.id === 'slack' && channels.has('slack') && (
                          <div className="ml-5 mt-1.5">
                            <input className="w-full border border-slate-200 rounded text-xs px-2 py-1.5 focus:outline-none focus:border-blue-400"
                              placeholder="https://hooks.slack.com/services/…"
                              value={slackUrl} onChange={e => setSlackUrl(e.target.value)}/>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
                    Save Alert Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alert list */}
          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id}
                className={`bg-white rounded-xl border p-4 flex gap-3 items-start transition-all hover:shadow-sm ${
                  !alert.read ? 'border-blue-100 bg-blue-50/20' : 'border-slate-100'
                }`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 ${alert.color}`}>
                  {alert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!alert.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"/>}
                    <span className="text-sm font-bold text-[#0A2540]">{alert.title}</span>
                    <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{alert.detail}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <div className="text-3xl mb-3">🔔</div>
                <div className="font-semibold">No alerts match your filters</div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">Alert Summary (7d)</div>
            {[
              {label:'Total alerts',    value:'47', color:'text-blue-600'},
              {label:'Platinum signals', value:'12', color:'text-amber-600'},
              {label:'GFR updates',     value:'8',  color:'text-violet-600'},
              {label:'Policy changes',  value:'6',  color:'text-blue-600'},
              {label:'FIC-cost alerts', value:'12', color:'text-emerald-600'},
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-500">{s.label}</span>
                <span className={`text-base font-black ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-3">Active Alert Rules</div>
            {[...activeTypes].slice(0,6).map(id => {
              const t = ALERT_TYPES.find(a => a.id === id)!;
              return (
                <div key={id} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"/>
                  <span className="text-slate-600 flex-1">{t.label}</span>
                  {t.fic > 0 && <span className="text-amber-600 font-bold">{t.fic} FIC</span>}
                </div>
              );
            })}
            {activeTypes.size === 0 && (
              <div className="text-xs text-slate-400">No alert rules active. Enable alerts above.</div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="font-bold text-xs text-[#0A2540] mb-2">Delivery Channels</div>
            {[...channels].map(id => {
              const c = DELIVERY_CHANNELS.find(d => d.id === id)!;
              return (
                <div key={id} className="flex items-center gap-2 py-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                  <span className="text-slate-600">{c.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
