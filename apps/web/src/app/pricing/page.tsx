'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, XCircle, Zap, Globe, BarChart3, Shield } from 'lucide-react';

const PLANS = [
  {id:'trial',name:'Free Trial',price:'$0',period:'7 days, no card',tag:null,
    desc:'Full platform access to explore with usage limits',
    features:[
      {l:'Dashboard — 7 live HUD widgets',y:true},{l:'Investment Analysis',y:true},
      {l:'GFR Ranking — 25 economies',y:true},{l:'Live Signals Feed',y:true},
      {l:'Country Profiles',y:true},{l:'Benchmark tool',y:true},
      {l:'PDF Reports',y:'2 downloads'},{l:'Country searches',y:'3 searches'},
      {l:'Export to CSV',y:false},{l:'Weekly Intelligence Brief',y:false},
      {l:'API Access',y:false},{l:'Priority support',y:false},
    ],cta:'Start Free Trial',ctaLink:'/register',
    style:{bg:'rgba(10,22,40,0.6)',border:'rgba(0,180,216,0.15)',glow:'none',badge:null}},
  {id:'pro',name:'Professional',price:'$9,588',period:'per year · $799/mo',tag:'MOST POPULAR',
    desc:'Complete access for investment professionals and analysts',
    features:[
      {l:'Everything in Free Trial',y:true},{l:'Unlimited PDF reports',y:true},
      {l:'Unlimited searches & exports',y:true},{l:'Export to CSV / Excel',y:true},
      {l:'Weekly Intelligence Brief',y:true},{l:'API access (1,000 calls/day)',y:true},
      {l:'Mission Planning module',y:true},{l:'Custom report branding',y:false},
      {l:'Team seats',y:'add-on'},{l:'Dedicated account manager',y:false},
      {l:'SLA guarantee',y:false},{l:'SSO / SAML',y:false},
    ],cta:'Get Professional',ctaLink:'/contact?plan=professional',
    style:{bg:'rgba(0,255,200,0.04)',border:'rgba(0,255,200,0.25)',glow:'0 0 40px rgba(0,255,200,0.1)',badge:'MOST POPULAR'}},
  {id:'ent',name:'Enterprise',price:'Custom',period:'bespoke pricing',tag:null,
    desc:'Full platform with white-labelling and dedicated support',
    features:[
      {l:'Everything in Professional',y:true},{l:'Unlimited API access',y:true},
      {l:'White-label PDF reports',y:true},{l:'Custom data integrations',y:true},
      {l:'Unlimited team seats',y:true},{l:'Dedicated account manager',y:true},
      {l:'99.9% SLA guarantee',y:true},{l:'Custom signal monitoring',y:true},
      {l:'On-site briefings',y:true},{l:'Private AI agent deployment',y:true},
      {l:'SSO / SAML integration',y:true},{l:'Custom GFR sub-index',y:true},
    ],cta:'Contact Sales',ctaLink:'/contact?plan=enterprise',
    style:{bg:'rgba(10,22,40,0.6)',border:'rgba(0,180,216,0.15)',glow:'none',badge:null}},
];

const FAQS = [
  {q:'Do I need a credit card for the free trial?',a:'No. The free trial requires no credit card and automatically expires after 7 days with no charges.'},
  {q:'What payment methods are accepted?',a:'Major credit cards, bank transfer, and invoicing for annual plans. Enterprise supports PO/contract billing.'},
  {q:'Is the data updated in real time?',a:'Yes. Investment signals update every 2-5 seconds via WebSocket. GOSA scores and GFR rankings update weekly by our AI agent pipeline.'},
  {q:'Can I export data to Excel?',a:'Professional and Enterprise plans include full CSV/Excel export from all tables and the Investment Analysis module.'},
  {q:'How is the GOSA score calculated?',a:'GOSA = (0.30×L1 Doing Business) + (0.20×L2 Sector) + (0.25×L3 Zones) + (0.25×L4 Market Intelligence). Updated weekly by AGT-04.'},
  {q:'Is this comparable to IMD WCR or Kearney GCR?',a:'Our GFR Ranking is designed to be comparable in methodology and rigour to IMD World Competitiveness Ranking, Kearney GCR, and the World Happiness Report, covering 25 economies across 6 weighted dimensions.'},
];

export default function PricingPage(){
  const [billingA,setBillingA]=useState(true);
  const [openFaq,setOpenFaq]=useState<number|null>(null);

  return(
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'60px 24px 72px',textAlign:'center',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.02) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'300px',background:'radial-gradient(ellipse, rgba(0,100,140,0.08), transparent)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'12px',fontFamily:"'Orbitron','Inter',sans-serif"}}>PRICING</div>
          <h1 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:900,color:'#e8f4f8',marginBottom:'12px',lineHeight:1.1}}>Simple, transparent pricing</h1>
          <p style={{fontSize:'15px',color:'rgba(232,244,248,0.5)',maxWidth:'480px',margin:'0 auto 28px',lineHeight:1.75}}>
            Start free. Upgrade when you need unlimited access. Enterprise plans for teams and governments.
          </p>
          {/* Billing toggle */}
          <div style={{display:'inline-flex',background:'rgba(255,255,255,0.04)',borderRadius:'30px',padding:'4px',border:'1px solid rgba(255,255,255,0.08)'}}>
            {[['Monthly',false],['Annual (save 20%)',true]].map(([label,annual])=>(
              <button key={String(label)} onClick={()=>setBillingA(annual as boolean)}
                style={{padding:'8px 20px',borderRadius:'25px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:"'Inter',sans-serif",transition:'all 200ms ease',background:billingA===(annual as boolean)?'rgba(0,255,200,0.12)':'transparent',color:billingA===(annual as boolean)?'#00ffc8':'rgba(232,244,248,0.5)'}}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'48px 24px'}}>
        {/* Plans */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'20px',marginBottom:'72px'}}>
          {PLANS.map((plan,pi)=>(
            <div key={plan.id} style={{borderRadius:'16px',border:`1px solid ${plan.style.border}`,overflow:'hidden',position:'relative',background:plan.style.bg,boxShadow:plan.style.glow||'0 4px 24px rgba(0,0,0,0.3)',transform:pi===1?'scale(1.03)':'none'}}>
              {plan.style.badge&&(
                <div style={{position:'absolute',top:'16px',right:'16px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',fontSize:'9px',fontWeight:900,padding:'4px 10px',borderRadius:'20px',letterSpacing:'0.06em',fontFamily:"'Orbitron','Inter',sans-serif"}}>
                  {plan.style.badge}
                </div>
              )}
              <div style={{padding:'28px 28px 22px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:pi===1?'rgba(0,255,200,0.6)':'rgba(232,244,248,0.4)',marginBottom:'8px',letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:"'Orbitron','Inter',sans-serif"}}>{plan.name}</div>
                <div style={{fontSize:'40px',fontWeight:900,color:pi===1?'#00ffc8':'#e8f4f8',fontFamily:"'JetBrains Mono',monospace",lineHeight:1,marginBottom:'4px',textShadow:pi===1?'0 0 20px rgba(0,255,200,0.4)':'none'}}>{plan.price}</div>
                <div style={{fontSize:'12px',color:'rgba(232,244,248,0.35)',marginBottom:'14px'}}>{plan.period}</div>
                <div style={{fontSize:'13px',color:'rgba(232,244,248,0.55)',lineHeight:1.6,marginBottom:'22px'}}>{plan.desc}</div>
                <Link href={plan.ctaLink}
                  style={{display:'block',padding:'12px',background:pi===1?'linear-gradient(135deg,#00ffc8,#00c49a)':'rgba(232,244,248,0.06)',color:pi===1?'#020c14':'rgba(232,244,248,0.8)',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800,textAlign:'center',border:pi===1?'none':'1px solid rgba(232,244,248,0.1)',marginBottom:'24px',boxShadow:pi===1?'0 4px 16px rgba(0,255,200,0.25)':'none'}}>
                  {plan.cta}
                </Link>
              </div>
              <div style={{borderTop:`1px solid rgba(255,255,255,${pi===1?0.08:0.04})`,padding:'20px 28px 28px'}}>
                {plan.features.map(({l,y})=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:'10px',padding:'5px 0',fontSize:'12px'}}>
                    {y===true?<CheckCircle size={13} color="#00ffc8"/>:y===false?<XCircle size={13} color="rgba(232,244,248,0.15)"/>:<CheckCircle size={13} color="#ffd700"/>}
                    <span style={{color:y===false?'rgba(232,244,248,0.25)':'rgba(232,244,248,0.75)'}}>
                      {y===true||y===false?l:`${l}: ${y}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div style={{textAlign:'center',marginBottom:'64px'}}>
          <div style={{fontSize:'10px',fontWeight:700,color:'rgba(232,244,248,0.25)',letterSpacing:'0.15em',marginBottom:'20px',textTransform:'uppercase'}}>TRUSTED BY INVESTMENT PROFESSIONALS AT</div>
          <div style={{display:'flex',justifyContent:'center',gap:'28px',flexWrap:'wrap',opacity:0.4}}>
            {['MISA Saudi Arabia','UAE DIFC','Vietnam MPI','Thailand BOI','Indonesia BKPM','World Bank','IMF','OECD'].map(org=>(
              <span key={org} style={{fontSize:'12px',fontWeight:700,color:'#e8f4f8'}}>{org}</span>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{maxWidth:'720px',margin:'0 auto'}}>
          <h2 style={{fontSize:'24px',fontWeight:900,color:'#e8f4f8',marginBottom:'24px',textAlign:'center'}}>Frequently Asked Questions</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {FAQS.map(({q,a},i)=>(
              <div key={q} style={{background:'rgba(10,22,40,0.7)',borderRadius:'10px',border:'1px solid rgba(0,180,216,0.1)',overflow:'hidden',transition:'border-color 200ms ease',borderColor:openFaq===i?'rgba(0,255,200,0.2)':'rgba(0,180,216,0.1)'}}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                  style={{width:'100%',padding:'16px 20px',background:'transparent',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Inter',sans-serif"}}>
                  <span style={{fontSize:'14px',fontWeight:600,color:'rgba(232,244,248,0.85)',textAlign:'left'}}>{q}</span>
                  <span style={{fontSize:'20px',color:'rgba(0,255,200,0.5)',flexShrink:0,marginLeft:'12px',transition:'transform 200ms ease',transform:openFaq===i?'rotate(45deg)':'none'}}>+</span>
                </button>
                {openFaq===i&&(
                  <div style={{padding:'0 20px 16px',fontSize:'13px',color:'rgba(232,244,248,0.55)',lineHeight:1.75,borderTop:'1px solid rgba(0,255,200,0.06)',paddingTop:'14px'}}>{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
