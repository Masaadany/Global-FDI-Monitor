'use client';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FicSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  useEffect(()=>{
    const t = setInterval(()=>setCountdown(n=>{
      if(n<=1){clearInterval(t); window.location.href='/reports';}
      return n-1;
    }),1000);
    return()=>clearInterval(t);
  },[]);

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{background:'white',borderRadius:'20px',padding:'48px',maxWidth:'480px',
        width:'100%',textAlign:'center',boxShadow:'0 24px 80px rgba(0,0,0,0.2)'}}>
        <div style={{width:'72px',height:'72px',borderRadius:'50%',
          background:'rgba(116,187,101,0.12)',border:'2px solid rgba(116,187,101,0.3)',
          display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
          <CheckCircle size={36} color="#74BB65"/>
        </div>
        <h2 style={{fontSize:'24px',fontWeight:800,color:'#0A3D62',marginBottom:'10px'}}>
          Credits Added Successfully!
        </h2>
        <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.7',marginBottom:'22px'}}>
          Your intelligence credits have been added to your account. You can now generate reports and use advanced platform features.
        </p>
        <div style={{display:'flex',alignItems:'center',gap:'8px',justifyContent:'center',
          padding:'12px',borderRadius:'10px',background:'rgba(116,187,101,0.06)',
          border:'1px solid rgba(116,187,101,0.2)',marginBottom:'20px'}}>
          <Zap size={16} color="#74BB65"/>
          <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>Ready to generate intelligence reports</span>
        </div>
        <div style={{marginBottom:'16px',fontSize:'13px',color:'#696969'}}>
          Redirecting to Reports in <b style={{color:'#74BB65'}}>{countdown}</b>s…
        </div>
        <div style={{display:'flex',gap:'8px',justifyContent:'center'}}>
          <Link href="/reports" style={{display:'inline-flex',alignItems:'center',gap:'6px',
            padding:'11px 22px',background:'#74BB65',color:'white',borderRadius:'8px',
            textDecoration:'none',fontWeight:800,fontSize:'14px'}}>
            Generate Reports <ArrowRight size={13}/>
          </Link>
          <Link href="/dashboard" style={{padding:'11px 16px',border:'1px solid rgba(10,61,98,0.15)',
            color:'#0A3D62',borderRadius:'8px',textDecoration:'none',fontWeight:600,fontSize:'14px'}}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
