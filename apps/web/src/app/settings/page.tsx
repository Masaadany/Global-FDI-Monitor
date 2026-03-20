'use client';
import { useState } from 'react';
import { Settings, User, Bell, CreditCard, Key, Shield, Eye, EyeOff, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import { useTrial } from '@/lib/trialContext';

const LANGUAGES = ['English','Arabic (العربية)','French (Français)','Spanish (Español)','German (Deutsch)','Chinese (中文)','Japanese (日本語)'];
const NOTIF_TYPES = [
  {id:'platinum_signals',  label:'PLATINUM signals',         desc:'Instant alert for every PLATINUM-grade FDI signal',    default:true},
  {id:'gold_signals',      label:'GOLD signals',             desc:'Alert for GOLD-grade signals',                          default:true},
  {id:'gfr_changes',       label:'GFR Assessment changes',   desc:'When economy tier or score changes',                    default:true},
  {id:'watchlist',         label:'Watchlist updates',        desc:'New signals for your watched economies/companies',     default:true},
  {id:'report_ready',      label:'Report ready',             desc:'When a PDF report finishes generating',                 default:true},
  {id:'weekly_brief',      label:'Weekly intelligence brief',desc:'Curated FDI intelligence email every Monday',          default:false},
  {id:'product_updates',   label:'Product updates',          desc:'New features and platform improvements',                default:false},
];

export default function SettingsPage() {
  const [tab,     setTab]     = useState<'profile'|'notifications'|'api'|'billing'>('profile');
  const [name,    setName]    = useState('');
  const [org,     setOrg]     = useState('');
  const [email,   setEmail]   = useState('');
  const [lang,    setLang]    = useState('English');
  const [country, setCountry] = useState('UAE');
  const [showKey, setShowKey] = useState(false);
  const [notifs,  setNotifs]  = useState<Record<string,boolean>>(
    Object.fromEntries(NOTIF_TYPES.map(n=>[n.id,n.default]))
  );
  const [saved,   setSaved]   = useState(false);
  const trial = useTrial();

  function saveProfile() {
    setSaved(true);
    setTimeout(()=>setSaved(false), 3000);
  }

  const TABS = [
    {id:'profile',       label:'Profile',       icon:User},
    {id:'notifications', label:'Notifications', icon:Bell},
    {id:'api',           label:'API Access',    icon:Key},
    {id:'billing',       label:'Billing',       icon:CreditCard},
  ];

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'28px 24px 0'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
            <Settings size={18} color="#74BB65"/>
            <h1 style={{fontSize:'24px',fontWeight:800,color:'white',margin:0}}>Account Settings</h1>
          </div>
          <div style={{display:'flex',gap:'0'}}>
            {TABS.map(({id,label,icon:Icon})=>(
              <button key={id} onClick={()=>setTab(id as any)}
                style={{display:'flex',alignItems:'center',gap:'6px',padding:'10px 18px',
                  border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  borderBottom:tab===id?'3px solid #74BB65':'3px solid transparent',
                  background:'transparent',color:tab===id?'white':'rgba(226,242,223,0.6)',transition:'all 0.2s'}}>
                <Icon size={13}/>{label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'24px'}}>

        {/* PROFILE */}
        {tab==='profile' && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'18px',display:'flex',alignItems:'center',gap:'6px'}}>
                <User size={14} color="#74BB65"/> Profile Information
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'14px'}}>
                {[{l:'Full Name',v:name,s:setName,p:'Your full name',a:'name'},
                  {l:'Email Address',v:email,s:setEmail,p:'your@email.com',a:'email'},
                  {l:'Organisation',v:org,s:setOrg,p:'Your organisation',a:'organization'},
                ].map(({l,v,s,p,a})=>(
                  <div key={l}>
                    <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>{l}</label>
                    <input value={v} onChange={e=>s(e.target.value)} autoComplete={a}
                      placeholder={p}
                      style={{width:'100%',padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                        fontSize:'14px',outline:'none',color:'#000',background:'white'}}/>
                  </div>
                ))}
                <div>
                  <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>Country</label>
                  <input value={country} onChange={e=>setCountry(e.target.value)}
                    style={{width:'100%',padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                      fontSize:'14px',outline:'none',color:'#000',background:'white'}}/>
                </div>
              </div>
              <div style={{marginBottom:'14px'}}>
                <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>
                  <Globe size={11} style={{marginRight:'4px',verticalAlign:'middle'}}/> Platform Language
                </label>
                <select value={lang} onChange={e=>setLang(e.target.value)}
                  style={{padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                    fontSize:'14px',color:'#0A3D62',background:'white',minWidth:'220px'}}>
                  {LANGUAGES.map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
              <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                <button onClick={saveProfile} className="gfm-btn-primary" style={{padding:'10px 24px',fontSize:'14px'}}>
                  Save Changes
                </button>
                {saved && (
                  <div style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'#74BB65',fontWeight:600}}>
                    <CheckCircle size={14}/> Saved successfully
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Shield size={14} color="#74BB65"/> Security
              </div>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                {['Change Password','Enable 2FA','Active Sessions'].map(a=>(
                  <button key={a} style={{padding:'9px 16px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',
                    background:'transparent',cursor:'pointer',fontSize:'13px',fontWeight:600,color:'#0A3D62',
                    display:'flex',alignItems:'center',gap:'5px'}}>
                    {a} <ArrowRight size={12}/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab==='notifications' && (
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'18px',display:'flex',alignItems:'center',gap:'6px'}}>
              <Bell size={14} color="#74BB65"/> Notification Preferences
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
              {NOTIF_TYPES.map((n,i)=>(
                <div key={n.id} style={{display:'flex',alignItems:'center',gap:'14px',
                  padding:'14px 0',borderBottom:i<NOTIF_TYPES.length-1?'1px solid rgba(10,61,98,0.06)':'none'}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'13px',fontWeight:600,color:'#0A3D62',marginBottom:'2px'}}>{n.label}</div>
                    <div style={{fontSize:'11px',color:'#696969'}}>{n.desc}</div>
                  </div>
                  <label style={{position:'relative',display:'inline-block',width:'44px',height:'24px',cursor:'pointer',flexShrink:0}}>
                    <input type="checkbox" checked={notifs[n.id]||false}
                      onChange={e=>setNotifs(p=>({...p,[n.id]:e.target.checked}))}
                      style={{opacity:0,width:0,height:0}}/>
                    <span style={{
                      position:'absolute',top:0,left:0,right:0,bottom:0,
                      background:notifs[n.id]?'#74BB65':'rgba(10,61,98,0.15)',
                      borderRadius:'12px',transition:'background 0.2s',
                    }}>
                      <span style={{
                        position:'absolute',top:'3px',
                        left:notifs[n.id]?'22px':'3px',
                        width:'18px',height:'18px',borderRadius:'50%',
                        background:'white',transition:'left 0.2s',
                        boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
                      }}/>
                    </span>
                  </label>
                </div>
              ))}
            </div>
            <button className="gfm-btn-primary" style={{marginTop:'16px',padding:'10px 24px',fontSize:'14px'}}>
              Save Notification Settings
            </button>
          </div>
        )}

        {/* API */}
        {tab==='api' && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Key size={14} color="#74BB65"/> API Access
              </div>
              {trial.isProfessional ? (
                <>
                  <div style={{marginBottom:'14px'}}>
                    <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>API Key</label>
                    <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                      <input readOnly value={showKey?'gfm_live_a1b2c3d4e5f6g7h8i9j0':'••••••••••••••••••••••••••••'}
                        style={{flex:1,padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                          fontSize:'13px',fontFamily:'monospace',color:'#0A3D62',background:'rgba(10,61,98,0.02)'}}/>
                      <button onClick={()=>setShowKey(s=>!s)}
                        style={{padding:'10px 14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                          background:'transparent',cursor:'pointer',color:'#696969'}}>
                        {showKey?<EyeOff size={14}/>:<Eye size={14}/>}
                      </button>
                      <button style={{padding:'10px 14px',borderRadius:'8px',background:'#0A3D62',color:'white',
                        border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700}}>Copy</button>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'14px'}}>
                    {[['Credits Used','2,401 / 4,800'],['Reset Date','Apr 1, 2026'],['Rate Limit','100 req/min']].map(([l,v])=>(
                      <div key={l} style={{padding:'12px',borderRadius:'8px',background:'rgba(10,61,98,0.03)',border:'1px solid rgba(10,61,98,0.07)',textAlign:'center'}}>
                        <div style={{fontSize:'15px',fontWeight:800,color:'#0A3D62',fontFamily:'monospace'}}>{v}</div>
                        <div style={{fontSize:'10px',color:'#696969',marginTop:'3px'}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <a href="/api-docs" style={{display:'inline-flex',alignItems:'center',gap:'5px',
                    fontSize:'13px',fontWeight:600,color:'#74BB65',textDecoration:'none'}}>
                    View API Documentation <ArrowRight size={13}/>
                  </a>
                </>
              ) : (
                <div style={{textAlign:'center',padding:'32px'}}>
                  <Key size={36} color="#696969" style={{marginBottom:'12px'}}/>
                  <div style={{fontSize:'15px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>API access requires Professional plan</div>
                  <p style={{fontSize:'13px',color:'#696969',marginBottom:'16px'}}>Upgrade to Professional to get your API key and 4,800 credits/year.</p>
                  <a href="/contact" style={{display:'inline-flex',alignItems:'center',gap:'6px',
                    padding:'10px 22px',background:'#74BB65',color:'white',borderRadius:'8px',
                    textDecoration:'none',fontWeight:700,fontSize:'14px'}}>
                    Request Demo <ArrowRight size={14}/>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BILLING */}
        {tab==='billing' && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
                <CreditCard size={14} color="#74BB65"/> Subscription & Billing
              </div>
              <div style={{padding:'16px',borderRadius:'10px',background:'rgba(116,187,101,0.06)',
                border:'1px solid rgba(116,187,101,0.2)',marginBottom:'16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px'}}>
                  <div>
                    <div style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',marginBottom:'3px'}}>
                      {trial.isProfessional?'Professional Plan':'Free Trial'}
                    </div>
                    <div style={{fontSize:'13px',color:'#696969'}}>
                      {trial.isProfessional?'$9,588/year · Next renewal: Apr 1, 2027':`${trial.daysLeft} day${trial.daysLeft!==1?'s':''} remaining · ${trial.reportsLeft} reports left`}
                    </div>
                  </div>
                  {!trial.isProfessional && (
                    <a href="/contact" style={{padding:'8px 18px',background:'#74BB65',color:'white',
                      borderRadius:'8px',textDecoration:'none',fontWeight:700,fontSize:'13px',
                      display:'flex',alignItems:'center',gap:'5px'}}>
                      Upgrade <ArrowRight size={13}/>
                    </a>
                  )}
                </div>
              </div>
              {trial.isProfessional && (
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#696969',marginBottom:'4px'}}>Recent Invoices</div>
                  {['Apr 1, 2026 — $9,588','Apr 1, 2025 — $9,588'].map(inv=>(
                    <div key={inv} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                      padding:'10px 14px',borderRadius:'8px',background:'rgba(10,61,98,0.03)',border:'1px solid rgba(10,61,98,0.07)'}}>
                      <span style={{fontSize:'13px',color:'#0A3D62'}}>{inv}</span>
                      <button style={{padding:'5px 12px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'6px',
                        background:'transparent',cursor:'pointer',fontSize:'11px',fontWeight:600,color:'#696969'}}>
                        Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
