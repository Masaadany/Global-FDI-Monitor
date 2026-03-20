'use client';
import { useState } from 'react';
import { Lock, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function ResetPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try { await fetch(`${API}/api/v1/auth/reset`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})}); }
    catch {}
    setLoading(false); setSent(true);
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#061E30 0%,#0A3D62 100%)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{background:'white',borderRadius:'20px',padding:'44px',maxWidth:'400px',width:'100%',
        boxShadow:'0 24px 80px rgba(0,0,0,0.2)',textAlign:'center'}}>
        <Link href="/" style={{textDecoration:'none',display:'block',marginBottom:'28px'}}>
          <span style={{fontSize:'18px',fontWeight:900,color:'#0A3D62'}}>GLOBAL </span>
          <span style={{fontSize:'18px',fontWeight:900,color:'#74BB65'}}>FDI </span>
          <span style={{fontSize:'18px',fontWeight:900,color:'#0A3D62'}}>MONITOR</span>
        </Link>
        {sent ? (
          <>
            <div style={{width:'60px',height:'60px',borderRadius:'50%',background:'rgba(116,187,101,0.1)',
              display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <CheckCircle size={30} color="#74BB65"/>
            </div>
            <h2 style={{fontSize:'20px',fontWeight:800,color:'#0A3D62',marginBottom:'10px'}}>Check your email</h2>
            <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.7',marginBottom:'20px'}}>
              We've sent password reset instructions to <b style={{color:'#0A3D62'}}>{email}</b>. Check your inbox and spam folder.
            </p>
            <Link href="/auth/login" style={{display:'inline-flex',alignItems:'center',gap:'6px',
              padding:'11px 22px',background:'#0A3D62',color:'white',borderRadius:'8px',
              textDecoration:'none',fontWeight:700,fontSize:'13px'}}>
              Back to Sign In <ArrowRight size={13}/>
            </Link>
          </>
        ) : (
          <>
            <div style={{width:'60px',height:'60px',borderRadius:'50%',background:'rgba(10,61,98,0.06)',
              display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <Lock size={28} color="#0A3D62"/>
            </div>
            <h2 style={{fontSize:'20px',fontWeight:800,color:'#0A3D62',marginBottom:'6px'}}>Reset your password</h2>
            <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.6',marginBottom:'22px'}}>
              Enter your work email and we'll send you a secure reset link.
            </p>
            <form onSubmit={handleReset} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div style={{position:'relative'}}>
                <Mail size={16} color="#696969" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)'}}/>
                <input value={email} onChange={e=>setEmail(e.target.value)} required type="email"
                  placeholder="your@organisation.com" autoComplete="email"
                  style={{width:'100%',padding:'11px 13px 11px 38px',borderRadius:'9px',
                    border:'1px solid rgba(10,61,98,0.15)',fontSize:'14px',outline:'none',color:'#000'}}/>
              </div>
              <button type="submit" disabled={loading}
                style={{padding:'12px',background:'#74BB65',color:'white',border:'none',borderRadius:'9px',
                  fontSize:'14px',fontWeight:800,cursor:loading?'wait':'pointer',opacity:loading?0.75:1,
                  display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',
                  boxShadow:'0 4px 14px rgba(116,187,101,0.3)'}}>
                {loading?'Sending…':<><ArrowRight size={14}/> Send Reset Link</>}
              </button>
              <Link href="/auth/login" style={{fontSize:'13px',color:'#696969',textDecoration:'none',
                display:'flex',alignItems:'center',justifyContent:'center',gap:'4px'}}>
                ← Back to Sign In
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
