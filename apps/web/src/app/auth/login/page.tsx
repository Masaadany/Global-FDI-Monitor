'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [showPass,setShowPass]=useState(false);
  const [loading,setLoading]=useState(false);

  async function handleLogin(e:React.FormEvent){
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,1000));
    window.location.href='/dashboard';
  }

  return(
    <div style={{minHeight:'100vh',background:'var(--bg-page)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:"'Inter','Helvetica Neue',sans-serif",position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
      <div style={{background:'white',borderRadius:'18px',padding:'40px',width:'100%',maxWidth:'420px',boxShadow:'0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,200,0.08)',border:'1px solid var(--border)',position:'relative'}}>
        <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'10px',marginBottom:'32px',justifyContent:'center'}}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="rgba(0,255,200,0.4)" strokeWidth="1.5"/>
            <path d="M20 32 L24 18 L20 6" stroke="#00ffc8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <circle cx="24" cy="18" r="3" fill="#00ffc8" style={{filter:'drop-shadow(0 0 6px #00ffc8)'}}/>
          </svg>
          <span style={{fontSize:'14px',fontWeight:900,fontFamily:'var(--font-display)'}}>
            <span style={{color:'var(--text-primary)'}}>GLOBAL </span><span style={{color:'var(--accent-green)'}}>FDI</span><span style={{color:'var(--text-primary)'}}> MONITOR</span>
          </span>
        </Link>
        <h1 style={{fontSize:'22px',fontWeight:800,color:'var(--text-primary)',marginBottom:'6px',textAlign:'center'}}>Sign in</h1>
        <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'28px',textAlign:'center'}}>Access your FDI intelligence dashboard</p>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:'14px'}}>
            <label style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',textTransform:'uppercase',letterSpacing:'0.08em',display:'block',marginBottom:'4px'}}>Email</label>
            <input required type="email" placeholder="you@organisation.com" value={email} onChange={e=>setEmail(e.target.value)}
              style={{width:'100%',padding:'10px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)'}}
              onFocus={e=>{e.target.style.borderColor='rgba(46,204,113,0.5)';}}
              onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)';}}/>
          </div>
          <div style={{marginBottom:'22px',position:'relative'}}>
            <label style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',textTransform:'uppercase',letterSpacing:'0.08em',display:'block',marginBottom:'4px'}}>Password</label>
            <input required type={showPass?'text':'password'} placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)}
              style={{width:'100%',padding:'10px 40px 10px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)'}}/>
            <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'12px',top:'28px',background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',padding:0,lineHeight:1}}>
              {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
            </button>
          </div>
          <button type="submit" disabled={loading}
            style={{width:'100%',padding:'12px',background:loading?'rgba(46,204,113,0.1)':'linear-gradient(135deg,#00ffc8,#00c49a)',color:loading?'rgba(232,244,248,0.4)':'var(--primary)',border:'none',borderRadius:'10px',cursor:loading?'not-allowed':'pointer',fontSize:'14px',fontWeight:800,fontFamily:'var(--font-ui)',marginBottom:'14px',transition:'all 200ms',boxShadow:loading?'none':'0 4px 16px rgba(0,255,200,0.25)'}}>
            {loading?'Signing in...':'Sign In →'}
          </button>
        </form>
        <div style={{textAlign:'center',fontSize:'12px',color:'var(--text-muted)'}}>
          No account? <Link href="/register" style={{color:'var(--accent-green)',fontWeight:600,textDecoration:'none'}}>Start access</Link>
          <span style={{margin:'0 8px',opacity:0.4}}>·</span>
          <Link href="/contact" style={{color:'var(--text-muted)',textDecoration:'none'}}>Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}
