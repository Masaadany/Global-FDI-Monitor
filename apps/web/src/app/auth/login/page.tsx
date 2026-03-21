'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,1000));
    window.location.href = '/dashboard';
  }

  return (
    <div style={{minHeight:'100vh', background:'#0f1e2a', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <div style={{background:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px', boxShadow:'0 24px 48px rgba(0,0,0,0.3)'}}>
        <Link href="/" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'10px', marginBottom:'32px', justifyContent:'center'}}>
          <span style={{fontSize:'16px', fontWeight:900}}>
            <span style={{color:'#1a2c3e'}}>GLOBAL </span><span style={{color:'#2ecc71'}}>FDI</span><span style={{color:'#1a2c3e'}}> MONITOR</span>
          </span>
        </Link>
        <h1 style={{fontSize:'22px', fontWeight:800, color:'#1a2c3e', marginBottom:'6px', textAlign:'center'}}>Sign in to your account</h1>
        <p style={{fontSize:'13px', color:'#7f8c8d', marginBottom:'28px', textAlign:'center'}}>Access your FDI intelligence dashboard</p>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:'14px'}}>
            <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:'4px'}}>Email</label>
            <input required type="email" placeholder="you@organisation.com" value={email} onChange={e=>setEmail(e.target.value)}
              style={{width:'100%', padding:'10px 14px', border:'1px solid rgba(26,44,62,0.15)', borderRadius:'9px', fontSize:'13px', fontFamily:'inherit', outline:'none'}}/>
          </div>
          <div style={{marginBottom:'20px', position:'relative'}}>
            <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:'4px'}}>Password</label>
            <input required type={showPass?'text':'password'} placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)}
              style={{width:'100%', padding:'10px 40px 10px 14px', border:'1px solid rgba(26,44,62,0.15)', borderRadius:'9px', fontSize:'13px', fontFamily:'inherit', outline:'none'}}/>
            <button type="button" onClick={()=>setShowPass(!showPass)}
              style={{position:'absolute', right:'12px', top:'28px', background:'none', border:'none', cursor:'pointer', color:'#7f8c8d', padding:'0'}}>
              {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
            </button>
          </div>
          <button type="submit" disabled={loading}
            style={{width:'100%', padding:'12px', background:'#1a2c3e', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'14px', fontWeight:800, fontFamily:'inherit', marginBottom:'12px'}}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <div style={{textAlign:'center', fontSize:'12px', color:'#7f8c8d'}}>
          No account? <Link href="/register" style={{color:'#2ecc71', fontWeight:600, textDecoration:'none'}}>Start free trial</Link>
          <span style={{margin:'0 8px'}}>·</span>
          <Link href="/contact" style={{color:'#7f8c8d', textDecoration:'none'}}>Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}
