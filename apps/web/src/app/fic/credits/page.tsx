'use client';
import { CreditCard, Zap, FileText, CheckCircle, Star } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import Link from 'next/link';

const CREDIT_PACKS = [
  {credits:1200,  price:'$199',  per:'$0.166/credit', popular:false, icon:'⚡', label:'Starter'},
  {credits:4800,  price:'$599',  per:'$0.125/credit', popular:true,  icon:'🔋', label:'Professional'},
  {credits:12000, price:'$999',  per:'$0.083/credit', popular:false, icon:'⚡⚡', label:'Enterprise'},
];

const USES = [
  {icon:'🌍',action:'Country Intelligence Report',credits:5},
  {icon:'🔄',action:'Bilateral Corridor Report',  credits:8},
  {icon:'🎯',action:'Mission Planning Dossier',   credits:15},
  {icon:'📊',action:'Investment Analysis Report', credits:8},
  {icon:'⚡',action:'Signal Intelligence Brief',  credits:3},
  {icon:'📈',action:'Foresight 2050 Report',      credits:10},
];

export default function FicCreditsPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'48px 24px',textAlign:'center'}}>
        <div style={{maxWidth:'620px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',
            background:'rgba(116,187,101,0.15)',border:'1px solid rgba(116,187,101,0.3)',
            padding:'5px 16px',borderRadius:'20px',marginBottom:'16px'}}>
            <Zap size={12} color="#74BB65"/>
            <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em'}}>INTELLIGENCE CREDITS</span>
          </div>
          <h1 style={{fontSize:'clamp(24px,3.5vw,38px)',fontWeight:900,color:'white',marginBottom:'12px',lineHeight:'1.15'}}>
            Purchase Intelligence Credits
          </h1>
          <p style={{color:'rgba(226,242,223,0.82)',fontSize:'15px',lineHeight:'1.7'}}>
            Credits power report generation, advanced analysis, and API calls. Unused credits roll over for 12 months.
          </p>
        </div>
      </section>

      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'36px 24px',display:'flex',flexDirection:'column',gap:'24px'}}>
        {/* Credit packs */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
          {CREDIT_PACKS.map(pack=>(
            <div key={pack.label} style={{borderRadius:'14px',overflow:'hidden',
              border:pack.popular?'2px solid #74BB65':'1px solid rgba(10,61,98,0.1)',
              background:pack.popular?'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)':'white',
              boxShadow:pack.popular?'0 12px 40px rgba(10,61,98,0.2)':'0 2px 12px rgba(10,61,98,0.07)',
              padding:'28px 24px',position:'relative'}}>
              {pack.popular && (
                <div style={{position:'absolute',top:'12px',right:'12px',
                  fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'12px',
                  background:'#74BB65',color:'white'}}>BEST VALUE</div>
              )}
              <div style={{fontSize:'32px',marginBottom:'10px'}}>{pack.icon}</div>
              <div style={{fontSize:'13px',fontWeight:700,
                color:pack.popular?'rgba(226,242,223,0.7)':'#696969',
                textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'6px'}}>{pack.label}</div>
              <div style={{fontSize:'32px',fontWeight:900,
                color:pack.popular?'white':'#0A3D62',lineHeight:1,marginBottom:'4px'}}>{pack.price}</div>
              <div style={{fontSize:'20px',fontWeight:800,
                color:pack.popular?'#74BB65':'#74BB65',marginBottom:'6px',fontFamily:'monospace'}}>
                {pack.credits.toLocaleString()} credits
              </div>
              <div style={{fontSize:'11px',
                color:pack.popular?'rgba(226,242,223,0.6)':'#696969',marginBottom:'18px'}}>{pack.per}</div>
              <Link href="/contact" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',
                padding:'11px',borderRadius:'9px',textDecoration:'none',fontWeight:700,fontSize:'14px',
                background:pack.popular?'#74BB65':'#0A3D62',color:'white',
                boxShadow:pack.popular?'0 4px 14px rgba(116,187,101,0.35)':'none'}}>
                <CreditCard size={13}/> Purchase
              </Link>
            </div>
          ))}
        </div>

        {/* Credit usage guide */}
        <div className="gfm-card" style={{padding:'24px'}}>
          <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
            display:'flex',alignItems:'center',gap:'6px'}}>
            <FileText size={14} color="#74BB65"/> Credit Usage Guide
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
            {USES.map(u=>(
              <div key={u.action} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                padding:'12px',borderRadius:'9px',background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.07)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'18px'}}>{u.icon}</span>
                  <span style={{fontSize:'12px',color:'#696969'}}>{u.action}</span>
                </div>
                <span style={{fontSize:'13px',fontWeight:800,color:'#74BB65',fontFamily:'monospace',flexShrink:0}}>
                  {u.credits}
                </span>
              </div>
            ))}
          </div>
          <div style={{marginTop:'14px',fontSize:'12px',color:'#696969'}}>
            Professional subscriptions include 4,800 credits/year. Credits never expire if you maintain an active subscription.
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
