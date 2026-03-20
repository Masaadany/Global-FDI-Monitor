'use client';
import { useState } from 'react';
import { CheckCircle, ArrowRight, Globe, Zap, Shield, CreditCard, Users, Download, Key, Star } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import Footer from '@/components/Footer';
import { useTrial } from '@/lib/trialContext';
import Link from 'next/link';

const FEATURES_PRO = [
  {icon:Zap,      text:'Unlimited FDI signal access — all grades'},
  {icon:Download, text:'Unlimited PDF report downloads'},
  {icon:Globe,    text:'Full Investment Analysis — 215 economies'},
  {icon:Key,      text:'API access — 4,800 credits/year'},
  {icon:Users,    text:'3 user seats included'},
  {icon:Shield,   text:'Priority email support'},
];

const FEATURES_ENT = [
  {icon:Zap,      text:'Everything in Professional'},
  {icon:Users,    text:'Unlimited user seats'},
  {icon:Key,      text:'Unlimited API credits'},
  {icon:Star,     text:'White-label reports & branding'},
  {icon:Shield,   text:'Dedicated success manager + SLA'},
  {icon:Globe,    text:'Custom data integrations & on-premise option'},
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'annual'|'monthly'>('annual');
  const trial = useTrial();

  const proPrice  = billingCycle==='annual' ? '$9,588/year' : '$999/month';
  const savings   = billingCycle==='annual' ? 'Save 20%' : null;

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'52px 24px',textAlign:'center'}}>
        <div style={{maxWidth:'640px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',
            background:'rgba(116,187,101,0.15)',border:'1px solid rgba(116,187,101,0.3)',
            padding:'5px 16px',borderRadius:'20px',marginBottom:'18px'}}>
            <Star size={12} color="#74BB65"/>
            <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em'}}>UPGRADE YOUR ACCOUNT</span>
          </div>
          <h1 style={{fontSize:'clamp(26px,3.5vw,42px)',fontWeight:900,color:'white',marginBottom:'12px',lineHeight:'1.15'}}>
            Unlock Full Investment Intelligence
          </h1>
          <p style={{color:'rgba(226,242,223,0.82)',fontSize:'15px',lineHeight:'1.7'}}>
            {trial.isProfessional
              ? 'You are on the Professional plan. Manage your subscription below.'
              : 'Upgrade from your free trial to Professional for unlimited access.'}
          </p>
          {/* Billing toggle */}
          {!trial.isProfessional && (
            <div style={{display:'inline-flex',background:'rgba(255,255,255,0.1)',borderRadius:'10px',
              padding:'4px',marginTop:'20px',gap:'4px'}}>
              {(['annual','monthly'] as const).map(cycle=>(
                <button key={cycle} onClick={()=>setBillingCycle(cycle)}
                  style={{padding:'8px 20px',borderRadius:'7px',border:'none',cursor:'pointer',
                    fontSize:'13px',fontWeight:700,transition:'all 0.2s',
                    background:billingCycle===cycle?'white':'transparent',
                    color:billingCycle===cycle?'#0A3D62':'rgba(255,255,255,0.8)'}}>
                  {cycle==='annual'?'Annual':'Monthly'}
                  {cycle==='annual' && (
                    <span style={{marginLeft:'6px',fontSize:'10px',fontWeight:800,
                      color:'#74BB65',background:'rgba(116,187,101,0.15)',padding:'1px 6px',borderRadius:'8px'}}>
                      Save 20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'36px 24px',display:'flex',flexDirection:'column',gap:'24px'}}>
        {/* Current plan status */}
        {trial.isProfessional ? (
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
              <div>
                <div style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',marginBottom:'4px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <CheckCircle size={18} color="#74BB65"/> Professional Plan — Active
                </div>
                <div style={{fontSize:'13px',color:'#696969'}}>$9,588/year · Renews: April 1, 2027 · 3 user seats</div>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <Link href="/settings?tab=billing" style={{padding:'9px 18px',border:'1px solid rgba(10,61,98,0.15)',
                  borderRadius:'8px',color:'#0A3D62',textDecoration:'none',fontWeight:600,fontSize:'13px'}}>
                  Manage Billing
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start'}}>
            {/* Professional card */}
            <div style={{borderRadius:'16px',overflow:'hidden',
              background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',
              boxShadow:'0 12px 40px rgba(10,61,98,0.25)'}}>
              <div style={{padding:'28px 26px 20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <div>
                    <div style={{fontSize:'11px',fontWeight:700,color:'rgba(226,242,223,0.7)',
                      textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>PROFESSIONAL</div>
                    <div style={{fontSize:'38px',fontWeight:900,color:'white',lineHeight:1}}>{proPrice}</div>
                    {savings && (
                      <div style={{fontSize:'12px',color:'#74BB65',fontWeight:700,marginTop:'4px'}}>{savings}</div>
                    )}
                  </div>
                  <div style={{padding:'4px 12px',borderRadius:'20px',background:'#74BB65',
                    fontSize:'10px',fontWeight:800,color:'white',letterSpacing:'0.05em'}}>POPULAR</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'20px'}}>
                  {FEATURES_PRO.map(({icon:Icon,text})=>(
                    <div key={text} style={{display:'flex',alignItems:'center',gap:'9px'}}>
                      <Icon size={14} color="#74BB65"/>
                      <span style={{fontSize:'13px',color:'rgba(226,242,223,0.9)'}}>{text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',
                  padding:'14px',borderRadius:'10px',background:'#74BB65',color:'white',
                  textDecoration:'none',fontWeight:800,fontSize:'15px',
                  boxShadow:'0 4px 16px rgba(116,187,101,0.35)'}}>
                  Get Professional <ArrowRight size={14}/>
                </Link>
              </div>
            </div>
            {/* Enterprise card */}
            <div className="gfm-card" style={{padding:'28px 26px',border:'1px solid rgba(10,61,98,0.1)'}}>
              <div style={{marginBottom:'16px'}}>
                <div style={{fontSize:'11px',fontWeight:700,color:'#696969',
                  textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>ENTERPRISE</div>
                <div style={{fontSize:'32px',fontWeight:900,color:'#0A3D62',lineHeight:1}}>Custom</div>
                <div style={{fontSize:'12px',color:'#696969',marginTop:'4px'}}>Negotiated pricing · Unlimited scale</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'20px'}}>
                {FEATURES_ENT.map(({icon:Icon,text})=>(
                  <div key={text} style={{display:'flex',alignItems:'center',gap:'9px'}}>
                    <Icon size={14} color="#0A3D62"/>
                    <span style={{fontSize:'13px',color:'#696969'}}>{text}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',
                padding:'13px',borderRadius:'10px',background:'#0A3D62',color:'white',
                textDecoration:'none',fontWeight:700,fontSize:'14px'}}>
                Contact Sales <ArrowRight size={14}/>
              </Link>
            </div>
          </div>
        )}

        {/* Trial status card */}
        {!trial.isProfessional && (
          <div className="gfm-card" style={{padding:'20px',
            background:'rgba(116,187,101,0.04)',border:'1px solid rgba(116,187,101,0.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
              <div>
                <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>
                  Free Trial — {trial.daysLeft} day{trial.daysLeft!==1?'s':''} remaining
                </div>
                <div style={{fontSize:'12px',color:'#696969'}}>
                  {trial.reportsUsed}/{trial.reportsMax} reports used · {trial.searchesUsed}/{trial.searchesMax} searches used
                </div>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <div style={{height:'8px',width:'120px',borderRadius:'4px',background:'rgba(10,61,98,0.08)',overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:'4px',
                    width:`${((7-trial.daysLeft)/7)*100}%`,
                    background:trial.daysLeft<=1?'#E57373':'#74BB65'}}/>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
