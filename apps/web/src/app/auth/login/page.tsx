'use client';
import { useState } from 'react';
import { Lock, Globe, TrendingUp, CheckCircle, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API}/api/v1/auth/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email, password}),
      });
      const d = await r.json();
      if (!d.success) { setError(d.error?.message || 'Invalid credentials'); }
      else { window.location.href = '/dashboard'; }
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#061E30 0%,#0A3D62 45%,#0E4F7A 100%)',
      display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,
        backgroundImage:'linear-gradient(rgba(116,187,101,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(116,187,101,0.05) 1px,transparent 1px)',
        backgroundSize:'40px 40px'}}/>

      {/* Left: Platform highlights */}
      <div style={{padding:'60px',position:'relative',zIndex:1}}>
        <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'baseline',gap:'2px',marginBottom:'48px'}}>
          <span style={{fontSize:'20px',fontWeight:900,color:'white'}}>GLOBAL</span>
          <span style={{fontSize:'20px',fontWeight:900,color:'#74BB65',margin:'0 4px'}}>FDI</span>
          <span style={{fontSize:'20px',fontWeight:900,color:'white'}}>MONITOR</span>
        </Link>
        <h2 style={{fontSize:'clamp(24px,2.5vw,34px)',fontWeight:900,color:'white',lineHeight:'1.2',marginBottom:'14px'}}>
          Welcome back to<br/><span style={{color:'#74BB65'}}>FDI Intelligence</span>
        </h2>
        <p style={{color:'rgba(226,242,223,0.75)',fontSize:'14px',lineHeight:'1.75',marginBottom:'32px'}}>
          Real-time investment signals, GFR assessment, and Investment Analysis for 215 economies.
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          {[{icon:Zap,  color:'#74BB65',text:'218+ live signals updated every 2 seconds'},
            {icon:Globe,color:'#74BB65',text:'Investment Analysis — Global Opportunity Score Analysis'},
            {icon:BarChart3,color:'#74BB65',text:'GFR Assessment across 6 dimensions · 38 indicators'},
            {icon:Shield,color:'#74BB65',text:'Z3 verified · SHA-256 provenance · DIFC registered'},
          ].map(({icon:Icon,color,text})=>(
            <div key={text} style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'8px',flexShrink:0,
                background:'rgba(116,187,101,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon size={14} color={color}/>
              </div>
              <span style={{fontSize:'13px',color:'rgba(226,242,223,0.8)',lineHeight:'1.6',paddingTop:'4px'}}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:'40px',display:'flex',alignItems:'center',gap:'8px',
          padding:'14px 18px',borderRadius:'12px',background:'rgba(116,187,101,0.08)',
          border:'1px solid rgba(116,187,101,0.2)'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',
            animation:'livePulse 2s infinite'}}/>
          <span style={{fontSize:'12px',color:'rgba(226,242,223,0.8)'}}>
            <b style={{color:'#74BB65'}}>218+</b> live signals active right now
          </span>
        </div>
      </div>

      {/* Right: Login form */}
      <div style={{padding:'48px',position:'relative',zIndex:1}}>
        <div style={{background:'white',borderRadius:'20px',padding:'40px',
          boxShadow:'0 24px 80px rgba(0,0,0,0.2)',maxWidth:'420px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'14px',
              background:'rgba(116,187,101,0.1)',border:'1px solid rgba(116,187,101,0.2)',
              display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
              <Lock size={22} color="#74BB65"/>
            </div>
            <h3 style={{fontSize:'20px',fontWeight:800,color:'#0A3D62',marginBottom:'4px'}}>Sign in to your account</h3>
            <p style={{fontSize:'13px',color:'#696969'}}>Enter your credentials to access the platform</p>
          </div>

          {error && (
            <div style={{padding:'10px 14px',borderRadius:'8px',background:'rgba(229,115,115,0.08)',
              border:'1px solid rgba(229,115,115,0.25)',fontSize:'13px',color:'#C62828',
              marginBottom:'16px',display:'flex',alignItems:'center',gap:'7px'}}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div>
              <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>
                Work Email
              </label>
              <input value={email} onChange={e=>setEmail(e.target.value)} required type="email"
                autoComplete="email" placeholder="you@organisation.com"
                style={{width:'100%',padding:'11px 13px',borderRadius:'9px',
                  border:'1px solid rgba(10,61,98,0.15)',fontSize:'14px',outline:'none',color:'#000',background:'white'}}/>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
                <label style={{fontSize:'12px',fontWeight:700,color:'#696969'}}>Password</label>
                <Link href="/auth/reset" style={{fontSize:'11px',color:'#74BB65',textDecoration:'none',fontWeight:600}}>
                  Forgot password?
                </Link>
              </div>
              <input value={password} onChange={e=>setPassword(e.target.value)} required type="password"
                autoComplete="current-password" placeholder="Your password"
                style={{width:'100%',padding:'11px 13px',borderRadius:'9px',
                  border:'1px solid rgba(10,61,98,0.15)',fontSize:'14px',outline:'none',color:'#000',background:'white'}}/>
            </div>
            <button type="submit" disabled={loading}
              style={{padding:'13px',background:'#0A3D62',color:'white',border:'none',
                borderRadius:'9px',fontSize:'15px',fontWeight:800,cursor:loading?'wait':'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
                boxShadow:'0 4px 16px rgba(10,61,98,0.2)',opacity:loading?0.75:1}}>
              {loading ? 'Signing in…' : <><ArrowRight size={14}/> Sign In</>}
            </button>
            <div style={{textAlign:'center',fontSize:'13px',color:'#696969'}}>
              Don't have an account?{' '}
              <Link href="/register" style={{color:'#74BB65',fontWeight:700,textDecoration:'none'}}>
                Start free trial →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
