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
      style={{width:'44px',height:'24px',borderRadius:'12px',position:'relative',background:(prefs as any)[k]?'#00ffc8':'rgba(255,255,255,0.1)',border:'none',cursor:'pointer',transition:'background 200ms ease',flexShrink:0}}>
      <div style={{position:'absolute',top:'3px',left:(prefs as any)[k]?'23px':'3px',width:'18px',height:'18px',borderRadius:'50%',background:'white',transition:'left 200ms ease',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}}/>
    </button>
  );

  const Section = ({icon,title,children}: {icon:any,title:string,children:any}) => (
    <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',overflow:'hidden',marginBottom:'14px'}}>
      <div style={{padding:'12px 18px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',alignItems:'center',gap:'9px',background:'rgba(0,0,0,0.2)'}}>
        <span style={{color:'#00ffc8',display:'flex',alignItems:'center'}}>{icon}</span>
        <span style={{fontSize:'12px',fontWeight:700,color:'rgba(232,244,248,0.8)',textTransform:'uppercase',letterSpacing:'0.08em',fontFamily:"'Orbitron','Inter',sans-serif"}}>{title}</span>
      </div>
      <div style={{padding:'16px 18px'}}>{children}</div>
    </div>
  );

  const Row = ({label,sub,children}: {label:string,sub?:string,children:any}) => (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
      <div>
        <div style={{fontSize:'13px',fontWeight:500,color:'rgba(232,244,248,0.75)'}}>{label}</div>
        {sub && <div style={{fontSize:'11px',color:'rgba(232,244,248,0.35)',marginTop:'2px'}}>{sub}</div>}
      </div>
      <div style={{flexShrink:0,marginLeft:'16px'}}>{children}</div>
    </div>
  );

  const Sel = ({k, opts}: {k:string, opts:string[]}) => (
    <select value={(prefs as any)[k]} onChange={e=>set(k,e.target.value)}
      style={{padding:'6px 10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',fontSize:'12px',color:'#e8f4f8',outline:'none',cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>
      {opts.map(o=><option key={o} style={{background:'#0a1628'}}>{o}</option>)}
    </select>
  );

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'800px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',position:'relative'}}>
          <div>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'4px',fontFamily:"'Orbitron','Inter',sans-serif"}}>SETTINGS</div>
            <h1 style={{fontSize:'22px',fontWeight:900,color:'#e8f4f8'}}>Account Preferences</h1>
          </div>
          <button onClick={save} style={{display:'flex',alignItems:'center',gap:'7px',padding:'10px 22px',background:saved?'rgba(0,255,200,0.1)':'linear-gradient(135deg,#00ffc8,#00c49a)',color:saved?'#00ffc8':'#020c14',border:saved?'1px solid rgba(0,255,200,0.25)':'none',borderRadius:'10px',cursor:'pointer',fontSize:'13px',fontWeight:800,fontFamily:"'Inter',sans-serif",transition:'all 200ms',boxShadow:saved?'none':'0 4px 14px rgba(0,255,200,0.25)'}}>
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
              style={{width:'80px',accentColor:'#00ffc8',cursor:'pointer'}}/>
            <span style={{fontSize:'13px',fontWeight:800,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",marginLeft:'8px',minWidth:'24px'}}>{prefs.minSco}</span>
          </Row>
        </Section>

        <Section icon={<BarChart3 size={14}/>} title="Display Preferences">
          <Row label="Enable Animations" sub="Globe, counters, and transitions"><Toggle k="animationsEnabled"/></Row>
          <Row label="Compact Mode" sub="Reduce padding for more data density"><Toggle k="compactMode"/></Row>
        </Section>

        <Section icon={<Lock size={14}/>} title="Account">
          <Row label="Subscription" sub="Professional — $9,588/year · Renews Jan 2027">
            <span style={{fontSize:'11px',fontWeight:700,padding:'4px 10px',background:'rgba(0,255,200,0.08)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'6px',color:'#00ffc8'}}>Active</span>
          </Row>
          <Row label="API Access" sub="1,000 calls/day · api.fdimonitor.org">
            <span style={{fontSize:'11px',fontWeight:700,padding:'4px 10px',background:'rgba(0,180,216,0.08)',border:'1px solid rgba(0,180,216,0.2)',borderRadius:'6px',color:'#00b4d8'}}>Enabled</span>
          </Row>
          <Row label="Change Password">
            <button style={{padding:'6px 14px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'rgba(232,244,248,0.6)',fontFamily:"'Inter',sans-serif"}}>Update</button>
          </Row>
        </Section>
      </div>
      <Footer/>
    </div>
  );
}
