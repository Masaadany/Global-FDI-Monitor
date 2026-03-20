'use client';
import { CheckCircle, Zap, Download, Key, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  useEffect(()=>{
    const t = setInterval(()=>setCountdown(n=>{
      if(n<=1){clearInterval(t);window.location.href='/dashboard';}
      return n-1;
    }),1000);
    return()=>clearInterval(t);
  },[]);

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{background:'white',borderRadius:'20px',padding:'48px',maxWidth:'500px',width:'100%',textAlign:'center',
        boxShadow:'0 24px 80px rgba(0,0,0,0.25)'}}>
        <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'rgba(116,187,101,0.12)',
          border:'2px solid rgba(116,187,101,0.3)',display:'flex',alignItems:'center',
          justifyContent:'center',margin:'0 auto 20px'}}>
          <CheckCircle size={36} color="#74BB65"/>
        </div>
        <h2 style={{fontSize:'24px',fontWeight:800,color:'#0A3D62',marginBottom:'10px'}}>
          Subscription Confirmed!
        </h2>
        <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.7',marginBottom:'24px'}}>
          Your Professional plan is now active. Welcome to full Global FDI Monitor access — unlimited reports, API access, and mission planning.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'24px'}}>
          {[{icon:Zap,label:'Unlimited Signals'},{icon:Download,label:'Unlimited Reports'},{icon:Key,label:'API Access'}].map(({icon:Icon,label})=>(
            <div key={label} style={{padding:'12px',borderRadius:'10px',background:'rgba(116,187,101,0.06)',
              border:'1px solid rgba(116,187,101,0.15)',textAlign:'center'}}>
              <Icon size={18} color="#74BB65" style={{marginBottom:'5px'}}/>
              <div style={{fontSize:'11px',fontWeight:700,color:'#0A3D62'}}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:'18px',fontSize:'13px',color:'#696969'}}>
          Redirecting to dashboard in <b style={{color:'#74BB65'}}>{countdown}</b>s…
        </div>
        <Link href="/dashboard" style={{display:'inline-flex',alignItems:'center',gap:'7px',
          padding:'12px 28px',background:'#74BB65',color:'white',borderRadius:'9px',
          textDecoration:'none',fontWeight:800,fontSize:'14px',boxShadow:'0 4px 16px rgba(116,187,101,0.3)'}}>
          Go to Dashboard <ArrowRight size={14}/>
        </Link>
      </div>
    </div>
  );
}
