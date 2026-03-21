'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { CheckCircle, Bell, Globe, BarChart3, Lock, Mail, Zap } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    emailDigest: true, signalAlerts: true, weeklyBrief: true, pricingAlerts: false,
    defaultRegion: 'Asia Pacific', defaultView: 'dashboard', defaultSector: 'EV Battery',
    currency: 'USD', dateFormat: 'DD/MM/YYYY',
    theme: 'dark', compactMode: false, animationsEnabled: true,
    platinumOnly: false, highImpactOnly: false, minSco: '70',
  });

  function toggle(key: string) { setPrefs(p => ({...p, [key]: !(p as any)[key]})); }
  function set(key: string, val: string) { setPrefs(p => ({...p, [key]: val})); }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const Toggle = ({k}: {k:string}) => (
    <button onClick={()=>toggle(k)}
      style={{width:'44px',height:'24px',borderRadius:'12px',position:'relative',background:(prefs as any)[k]?'#2ECC71':'rgba(255,255,255,0.1)',border:'none',cursor:'pointer',transition:'background 200ms ease',flexShrink:0}}>
      <div style={{position:'absolute',top:'3px',left:(prefs as any)[k]?'23px':'3px',width:'18px',height:'18px',borderRadius:'50%',background:'white',transition:'left 200ms ease',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}}/>
    </button>
  );

  const Section = ({icon,title,children}: {icon:any,title:string,children:any}) => (
    <div style={{background:'white',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden',marginBottom:'14px'}}>
      <div style={{padding:'12px 18px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',alignItems:'center',gap:'9px',background:'var(--bg-subtle)'}}>
        <span style={{color:'var(--accent-green)',display:'flex',alignItems:'center'}}>{icon}</span>
        <span style={{fontSize:'12px',fontWeight:700,color:'#1A2C3E',textTransform:'uppercase',letterSpacing:'0.08em',fontFamily:'var(--font-display)'}}>{title}</span>
      </div>
      <div style={{padding:'16px 18px'}}>{children}</div>
    </div>
  );

  const Row = ({label,sub,children}: {label:string,sub?:string,children:any}) => (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
      <div>
        <div style={{fontSize:'13px',fontWeight:500,color:'var(--text-secondary)'}}>{label}</div>
        {sub && <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>{sub}</div>}
      </div>
      <div style={{flexShrink:0,marginLeft:'16px'}}>{children}</div>
    </div>
  );

  const Sel = ({k, opts}: {k:string, opts:string[]}) => (
    <select value={(prefs as any)[k]} onChange={e=>set(k,e.target.value)}
      style={{padding:'6px 10px',background:'var(--bg-subtle)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',fontSize:'12px',color:'var(--text-primary)',outline:'none',cursor:'pointer',fontFamily:'var(--font-ui)'}}>
      {opts.map(o=><option key={o} style={{background:'white'}}>{o}</option>)}
    </select>
  );

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#FFFFFF,#060f1a)',padding:'24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'800px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',position:'relative'}}>
          <div>
            <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'4px',fontFamily:'var(--font-display)'}}>SETTINGS</div>
            <h1 style={{fontSize:'22px',fontWeight:900,color:'var(--text-primary)'}}>Account Preferences</h1>
          </div>
          <button onClick={save} style={{display:'flex',alignItems:'center',gap:'7px',padding:'10px 22px',background:saved?'rgba(46,204,113,0.1)':'linear-gradient(135deg,#00ffc8,#00c49a)',color:saved?'#2ECC71':'var(--primary)',border:saved?'1px solid rgba(0,255,200,0.25)':'none',borderRadius:'10px',cursor:'pointer',fontSize:'13px',fontWeight:800,fontFamily:'var(--font-ui)',transition:'all 200ms',boxShadow:saved?'none':'0 4px 14px rgba(0,255,200,0.25)'}}>
            {saved?<><CheckCircle size={14}/>Saved!</>:<>Save Changes</>}
          </button>
        </div>
      </div>

      <div style={{maxWidth:'800px',margin:'0 auto',padding:'28px 24px'}}>
        <Section icon={<Bell size={14}/>} title="Notifications">
          <Row label="Weekly Intelligence Brief" sub="Every Tuesday 08:00 GMT — 12,847 subscribers"><Toggle k="weeklyBrief"/></Row>
          <Row label="Signal Alerts" sub="PLATINUM and HIGH-impact signals in real time"><Toggle k="signalAlerts"/></Row>
          <Row label="Email Digest" sub="Daily summary of top signals"><Toggle k="emailDigest"/></Row>
          <Row label="Pricing Change Alerts" sub="Plan updates and promotions"><Toggle k="pricingAlerts"/></Row>
        </Section>

        <Section icon={<Globe size={14}/>} title="Default Views">
          <Row label="Default Region" sub="Pre-filter dashboards to your focus region"><Sel k="defaultRegion" opts={['All Regions','Asia Pacific','Middle East','Americas','Europe','Africa','Oceania']}/></Row>
          <Row label="Default Sector" sub="Pre-filter signal feed to preferred sector"><Sel k="defaultSector" opts={['All Sectors','EV Battery','Data Centers','Semiconductors','Renewables','Manufacturing','AI & Technology']}/></Row>
          <Row label="Home Page" sub="First page after login"><Sel k="defaultView" opts={['dashboard','signals','gfr','investment-analysis']}/></Row>
          <Row label="Currency Display"><Sel k="currency" opts={['USD','EUR','GBP','AED','SAR','MYR','SGD']}/></Row>
          <Row label="Date Format"><Sel k="dateFormat" opts={['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD']}/></Row>
        </Section>

        <Section icon={<Zap size={14}/>} title="Signal Filters">
          <Row label="PLATINUM Signals Only" sub="Hide GOLD and SILVER signals from feed"><Toggle k="platinumOnly"/></Row>
          <Row label="HIGH Impact Only" sub="Filter out MED and LOW impact signals"><Toggle k="highImpactOnly"/></Row>
          <Row label="Minimum SCI Score" sub="Only show signals above this threshold">
            <input type="range" min="60" max="95" value={prefs.minSco} onChange={e=>set('minSco',e.target.value)}
              style={{width:'80px',accentColor:'#2ECC71',cursor:'pointer'}}/>
            <span style={{fontSize:'13px',fontWeight:800,color:'var(--accent-green)',fontFamily:'var(--font-mono)',marginLeft:'8px',minWidth:'24px'}}>{prefs.minSco}</span>
          </Row>
        </Section>

        <Section icon={<BarChart3 size={14}/>} title="Display Preferences">
          <Row label="Enable Animations" sub="Globe, counters, and transitions"><Toggle k="animationsEnabled"/></Row>
          <Row label="Compact Mode" sub="Reduce padding for more data density"><Toggle k="compactMode"/></Row>
        </Section>

        <Section icon={<Lock size={14}/>} title="Account">
          <Row label="Subscription" sub="Professional — $9,588/year · Renews Jan 2027">
            <span style={{fontSize:'11px',fontWeight:700,padding:'4px 10px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'6px',color:'var(--accent-green)'}}>Active</span>
          </Row>
          <Row label="API Access" sub="1,000 calls/day · api.fdimonitor.org">
            <span style={{fontSize:'11px',fontWeight:700,padding:'4px 10px',background:'rgba(0,180,216,0.08)',border:'1px solid #ECF0F1,0.2)',borderRadius:'6px',color:'#3498DB'}}>Enabled</span>
          </Row>
          <Row label="Change Password">
            <button style={{padding:'6px 14px',background:'var(--bg-subtle)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'var(--text-secondary)',fontFamily:'var(--font-ui)'}}>Update</button>
          </Row>
        </Section>
      </div>
      <Footer/>
    </div>
  );
}
