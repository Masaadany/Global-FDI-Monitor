'use client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const PLANS = [
  {
    title:'Professional', primary:true,
    features:['Full platform access','All 23+ country profiles','Live signal feed (every 2s)','GFR Ranking (25 economies)','PDF report generation','API access (1,000 calls/day)','Weekly Intelligence Brief'],
    cta:'Create Account', href:'/register',
  },
  {
    title:'Enterprise', primary:false,
    features:['Everything in Professional','Unlimited API access','White-label PDF reports','Custom data integrations','Unlimited team seats','Dedicated account manager','99.9% SLA guarantee'],
    cta:'Contact Us', href:'/contact',
  },
];

export default function PricingPage() {
  return (
    <div style={{minHeight:'100vh',background:'#F8F9FA',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:'820px',margin:'0 auto',padding:'80px 24px',textAlign:'center'}}>
        <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'12px',textTransform:'uppercase'}}>ACCESS</div>
        <h1 style={{fontSize:'36px',fontWeight:900,color:'#1A2C3E',marginBottom:'12px'}}>Get Access to Global FDI Monitor</h1>
        <p style={{fontSize:'16px',color:'#5A6874',marginBottom:'40px',lineHeight:1.75}}>
          Create your account to access the world's most advanced FDI intelligence platform. Real-time data. Verified intelligence.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'40px'}}>
          {PLANS.map(plan => (
            <div key={plan.title} style={{background:'#FFFFFF',borderRadius:'24px',boxShadow:'0 20px 35px -10px rgba(0,0,0,0.08)',border:`2px solid ${plan.primary?'#2ECC71':'#ECF0F1'}`,padding:'32px',textAlign:'left'}}>
              <h2 style={{fontSize:'22px',fontWeight:900,color:'#1A2C3E',marginBottom:'20px'}}>{plan.title}</h2>
              <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'28px'}}>
                {plan.features.map(f => (
                  <div key={f} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#1A2C3E'}}>
                    <span style={{color:'#2ECC71',fontWeight:700,fontSize:'15px',flexShrink:0}}>✓</span>{f}
                  </div>
                ))}
              </div>
              <Link href={plan.href} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'13px 24px',background:plan.primary?'#2ECC71':'#1A2C3E',color:'#FFFFFF',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:800,boxShadow:plan.primary?'0 4px 16px rgba(46,204,113,0.35)':'0 4px 16px rgba(26,44,62,0.25)'}}>
                {plan.cta} <ChevronRight size={15}/>
              </Link>
            </div>
          ))}
        </div>
        <p style={{fontSize:'13px',color:'#5A6874'}}>Questions? <Link href="/contact" style={{color:'#2ECC71',textDecoration:'none',fontWeight:600}}>Contact us</Link> · <a href="mailto:info@fdimonitor.org" style={{color:'#2ECC71',textDecoration:'none',fontWeight:600}}>info@fdimonitor.org</a></p>
      </div>
      <Footer/>
    </div>
  );
}
