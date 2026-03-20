'use client';
import { useState } from 'react';
import { User, Globe, CheckCircle, ArrowRight, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function RegisterPage() {
  const [step,     setStep]     = useState(1);
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [org,      setOrg]      = useState('');
  const [country,  setCountry]  = useState('');
  const [role,     setRole]     = useState('');
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const ROLES = ['Investment Promotion Agency','Government / Ministry','Sovereign Wealth Fund',
                 'Strategy Consulting','Private Equity / VC','Corporate / Multinational','Other'];

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API}/api/v1/auth/register`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name,email,password,org,country,role}),
      });
    } catch {}
    setLoading(false);
    setDone(true);
  }

  if (done) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0A3D62 0%,#0E4F7A 100%)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{background:'white',borderRadius:'20px',padding:'48px',maxWidth:'440px',width:'100%',textAlign:'center'}}>
        <div style={{fontSize:'56px',marginBottom:'16px'}}>🎉</div>
        <h2 style={{fontSize:'22px',fontWeight:800,color:'#0A3D62',marginBottom:'10px'}}>Account Created!</h2>
        <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.7',marginBottom:'20px'}}>
          Welcome to Global FDI Monitor. Your free 7-day trial starts now.
          Check <b style={{color:'#0A3D62'}}>{email}</b> for your verification link.
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          <Link href="/onboarding" style={{padding:'13px',background:'#74BB65',color:'white',
            borderRadius:'9px',textDecoration:'none',fontWeight:800,fontSize:'14px',
            display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',
            boxShadow:'0 4px 16px rgba(116,187,101,0.3)'}}>
            Set Up Your Account <ArrowRight size={14}/>
          </Link>
          <Link href="/dashboard" style={{padding:'11px',border:'1px solid rgba(10,61,98,0.15)',
            color:'#0A3D62',borderRadius:'9px',textDecoration:'none',fontWeight:600,fontSize:'14px',
            textAlign:'center'}}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#061E30 0%,#0A3D62 45%,#0E4F7A 100%)',
      display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center',position:'relative',overflow:'hidden'}}>
      {/* Grid overlay */}
      <div style={{position:'absolute',inset:0,
        backgroundImage:'linear-gradient(rgba(116,187,101,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(116,187,101,0.05) 1px,transparent 1px)',
        backgroundSize:'40px 40px'}}/>

      {/* Left: Feature list */}
      <div style={{padding:'60px',position:'relative',zIndex:1}}>
        <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'baseline',gap:'2px',marginBottom:'48px'}}>
          <span style={{fontSize:'20px',fontWeight:900,color:'white'}}>GLOBAL</span>
          <span style={{fontSize:'20px',fontWeight:900,color:'#74BB65',margin:'0 4px'}}>FDI</span>
          <span style={{fontSize:'20px',fontWeight:900,color:'white'}}>MONITOR</span>
        </Link>
        <h2 style={{fontSize:'clamp(24px,2.5vw,36px)',fontWeight:900,color:'white',lineHeight:'1.2',marginBottom:'14px'}}>
          Start your free<br/><span style={{color:'#74BB65'}}>7-day trial</span> today
        </h2>
        <p style={{color:'rgba(226,242,223,0.75)',fontSize:'15px',lineHeight:'1.75',marginBottom:'32px'}}>
          Full access to all platform modules. No credit card required.
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          {[
            {icon:Zap,  text:'218+ live FDI signals · PLATINUM to BRONZE · Z3 verified'},
            {icon:Globe,text:'Investment Analysis for 215 economies · 4-layer GOSA scoring'},
            {icon:Shield,text:'PDF reports · Mission planning dossiers · API access'},
            {icon:CheckCircle,text:'7 days · 2 report downloads · 3 search views · No credit card'},
          ].map(({icon:Icon,text})=>(
            <div key={text} style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'8px',background:'rgba(116,187,101,0.15)',
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={14} color="#74BB65"/>
              </div>
              <span style={{fontSize:'13px',color:'rgba(226,242,223,0.8)',lineHeight:'1.6',paddingTop:'4px'}}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:'40px',padding:'16px',borderRadius:'12px',background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(255,255,255,0.1)',fontSize:'13px',color:'rgba(226,242,223,0.7)'}}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{color:'#74BB65',fontWeight:700,textDecoration:'none'}}>Sign in →</Link>
        </div>
      </div>

      {/* Right: Form */}
      <div style={{padding:'48px',position:'relative',zIndex:1}}>
        <div style={{background:'white',borderRadius:'20px',padding:'40px',
          boxShadow:'0 24px 80px rgba(0,0,0,0.2)',maxWidth:'440px',margin:'0 auto'}}>
          {/* Progress */}
          <div style={{display:'flex',gap:'8px',marginBottom:'28px'}}>
            {[1,2].map(s=>(
              <div key={s} style={{flex:1,height:'4px',borderRadius:'2px',
                background:s<=step?'#74BB65':'rgba(10,61,98,0.1)',transition:'background 0.3s'}}/>
            ))}
          </div>
          <div style={{fontSize:'11px',color:'#696969',marginBottom:'6px'}}>Step {step} of 2</div>
          <h3 style={{fontSize:'20px',fontWeight:800,color:'#0A3D62',marginBottom:'20px'}}>
            {step===1 ? 'Create your account' : 'Tell us about yourself'}
          </h3>

          {step===1 && (
            <form onSubmit={handleStep1} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {[{l:'Full Name',v:name,s:setName,p:'Your full name',t:'text',a:'name'},
                {l:'Work Email',v:email,s:setEmail,p:'you@company.com',t:'email',a:'email'},
                {l:'Password',v:password,s:setPassword,p:'Min. 8 characters',t:'password',a:'new-password'}
              ].map(({l,v,s,p,t,a})=>(
                <div key={l}>
                  <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>{l} *</label>
                  <input value={v} onChange={e=>s(e.target.value)} required type={t} autoComplete={a}
                    minLength={t==='password'?8:undefined} placeholder={p}
                    style={{width:'100%',padding:'11px 13px',borderRadius:'9px',border:'1px solid rgba(10,61,98,0.15)',
                      fontSize:'14px',outline:'none',color:'#000',background:'white'}}/>
                </div>
              ))}
              <button type="submit"
                style={{padding:'13px',background:'#74BB65',color:'white',border:'none',
                  borderRadius:'9px',fontSize:'15px',fontWeight:800,cursor:'pointer',
                  display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',
                  boxShadow:'0 4px 16px rgba(116,187,101,0.3)'}}>
                Continue <ArrowRight size={14}/>
              </button>
              <p style={{fontSize:'11px',color:'#696969',textAlign:'center',lineHeight:'1.5',margin:0}}>
                By continuing you agree to our{' '}
                <Link href="/terms" style={{color:'#0A3D62'}}>Terms</Link> and{' '}
                <Link href="/privacy" style={{color:'#0A3D62'}}>Privacy Policy</Link>
              </p>
            </form>
          )}

          {step===2 && (
            <form onSubmit={handleStep2} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div>
                <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>Organisation</label>
                <input value={org} onChange={e=>setOrg(e.target.value)} autoComplete="organization"
                  placeholder="Your organisation" style={{width:'100%',padding:'11px 13px',borderRadius:'9px',
                    border:'1px solid rgba(10,61,98,0.15)',fontSize:'14px',outline:'none',color:'#000',background:'white'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>Country</label>
                <input value={country} onChange={e=>setCountry(e.target.value)} autoComplete="country"
                  placeholder="Your country" style={{width:'100%',padding:'11px 13px',borderRadius:'9px',
                    border:'1px solid rgba(10,61,98,0.15)',fontSize:'14px',outline:'none',color:'#000',background:'white'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'8px'}}>Your Role</label>
                <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                  {ROLES.map(r=>(
                    <label key={r} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#0A3D62',cursor:'pointer'}}>
                      <input type="radio" name="role" value={r} checked={role===r} onChange={()=>setRole(r)}/>
                      {r}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <button type="button" onClick={()=>setStep(1)}
                  style={{padding:'11px 18px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'9px',
                    background:'transparent',cursor:'pointer',fontSize:'14px',fontWeight:600,color:'#696969'}}>
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  style={{flex:1,padding:'11px',background:'#74BB65',color:'white',border:'none',
                    borderRadius:'9px',fontSize:'15px',fontWeight:800,cursor:loading?'wait':'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',opacity:loading?0.75:1}}>
                  {loading ? 'Creating…' : <><CheckCircle size={14}/> Create Account</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
