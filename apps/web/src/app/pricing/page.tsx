'use client';
import { CheckCircle, ArrowRight, Globe, Zap, Shield, Users, Building2, Star, X } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import Link from 'next/link';

const PLANS = [
  {
    id:'trial',
    name:'Free Trial',
    price:'$0',
    period:'7 days',
    badge:null,
    color:'#696969',
    bg:'white',
    features:[
      {text:'Access to all platform modules',included:true},
      {text:'2 report downloads',included:true},
      {text:'3 search & result views',included:true},
      {text:'GFR Assessment for 215 economies',included:true},
      {text:'Investment Analysis — full access',included:true},
      {text:'Live signal feed (read-only)',included:true},
      {text:'Unlimited reports',included:false},
      {text:'Data export & API access',included:false},
      {text:'Mission planning dossiers',included:false},
      {text:'Dedicated support',included:false},
    ],
    cta:'Start Free Trial',
    ctaHref:'/register',
    ctaStyle:{background:'rgba(10,61,98,0.08)',color:'#0A3D62'},
  },
  {
    id:'professional',
    name:'Professional',
    price:'$9,588',
    period:'/year',
    subPrice:'equiv. $799/month',
    badge:'Most Popular',
    color:'#74BB65',
    bg:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',
    features:[
      {text:'Everything in Free Trial',included:true},
      {text:'Unlimited report downloads',included:true},
      {text:'Unlimited searches & exports',included:true},
      {text:'Full Investment Analysis suite',included:true},
      {text:'Mission Planning Dossier generation',included:true},
      {text:'API access (4,800 credits/year)',included:true},
      {text:'3 user seats',included:true},
      {text:'Data export (CSV, Excel)',included:true},
      {text:'Priority email support',included:true},
      {text:'White-label reports',included:false},
    ],
    cta:'Request Demo',
    ctaHref:'/contact',
    ctaStyle:{background:'#74BB65',color:'white'},
  },
  {
    id:'enterprise',
    name:'Enterprise',
    price:'Custom',
    period:'pricing',
    badge:'For organisations',
    color:'#0A3D62',
    bg:'white',
    features:[
      {text:'Everything in Professional',included:true},
      {text:'Unlimited user seats',included:true},
      {text:'Unlimited API credits',included:true},
      {text:'White-label reports & branding',included:true},
      {text:'Custom data integrations',included:true},
      {text:'Dedicated success manager',included:true},
      {text:'SLA & uptime guarantee',included:true},
      {text:'On-premise deployment option',included:true},
      {text:'Custom report templates',included:true},
      {text:'Training & onboarding sessions',included:true},
    ],
    cta:'Contact Sales',
    ctaHref:'/contact',
    ctaStyle:{background:'#0A3D62',color:'white'},
  },
];

const FEATURE_TABLE = [
  {category:'Investment Intelligence',rows:[
    {feature:'Global Opportunity Score Analysis',trial:'215 countries (read)',pro:'215 countries (full)',ent:'215 countries (full)'},
    {feature:'GFR Assessment — 6 dimensions',trial:'✓',pro:'✓',ent:'✓'},
    {feature:'Live FDI Signals',trial:'Read-only (3 views)',pro:'Unlimited',ent:'Unlimited'},
    {feature:'Signal detail (SCI, Z3, SHA-256)',trial:'Preview',pro:'✓ Full',ent:'✓ Full'},
    {feature:'Investment Analysis — 4 tabs',trial:'2 reports max',pro:'Unlimited',ent:'Unlimited'},
    {feature:'Corridor Intelligence',trial:'✓',pro:'✓',ent:'✓'},
  ]},
  {category:'Reports & Exports',rows:[
    {feature:'PDF Report Downloads',trial:'2 total',pro:'Unlimited',ent:'Unlimited'},
    {feature:'Mission Planning Dossier',trial:'—',pro:'✓',ent:'✓'},
    {feature:'Data Export (CSV/Excel)',trial:'—',pro:'✓',ent:'✓'},
    {feature:'White-label Reports',trial:'—',pro:'—',ent:'✓'},
    {feature:'Custom Report Templates',trial:'—',pro:'—',ent:'✓'},
  ]},
  {category:'Platform Access',rows:[
    {feature:'User Seats',trial:'1',pro:'3',ent:'Unlimited'},
    {feature:'API Access',trial:'—',pro:'4,800 credits/yr',ent:'Unlimited'},
    {feature:'Watchlists & Alerts',trial:'Preview',pro:'✓',ent:'✓'},
    {feature:'Investment Pipeline',trial:'Preview',pro:'✓',ent:'✓'},
    {feature:'Arabic (RTL) Interface',trial:'✓',pro:'✓',ent:'✓'},
  ]},
  {category:'Support',rows:[
    {feature:'Email Support',trial:'Community',pro:'Priority',ent:'Dedicated manager'},
    {feature:'SLA / Uptime Guarantee',trial:'—',pro:'—',ent:'✓ 99.9%'},
    {feature:'Onboarding & Training',trial:'Self-serve',pro:'Email guides',ent:'Live sessions'},
  ]},
];



export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'60px 40px',textAlign:'center'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',
            background:'rgba(116,187,101,0.15)',border:'1px solid rgba(116,187,101,0.3)',
            padding:'5px 14px',borderRadius:'20px',marginBottom:'20px'}}>
            <Star size={12} color="#74BB65"/>
            <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em'}}>TRANSPARENT PRICING</span>
          </div>
          <h1 style={{fontSize:'clamp(28px,4vw,46px)',fontWeight:900,color:'white',marginBottom:'14px',lineHeight:'1.1'}}>
            Simple, Powerful Investment Intelligence
          </h1>
          <p style={{fontSize:'16px',color:'rgba(226,242,223,0.8)',lineHeight:'1.7'}}>
            Start with a 7-day free trial. No credit card required. Upgrade when you're ready.
          </p>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'48px 24px',display:'flex',flexDirection:'column',gap:'40px'}}>

        {/* Plan cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',alignItems:'stretch'}}>
          {PLANS.map(plan=>(
            <div key={plan.id} style={{borderRadius:'16px',overflow:'hidden',
              background:plan.bg,border:plan.id==='professional'?'none':'1px solid rgba(10,61,98,0.1)',
              boxShadow:plan.id==='professional'?'0 12px 40px rgba(10,61,98,0.25)':'0 2px 12px rgba(10,61,98,0.07)',
              display:'flex',flexDirection:'column',position:'relative'}}>
              {plan.badge && (
                <div style={{position:'absolute',top:'16px',right:'16px',
                  fontSize:'10px',fontWeight:800,padding:'3px 10px',borderRadius:'20px',
                  background:plan.id==='professional'?'#74BB65':'rgba(10,61,98,0.1)',
                  color:plan.id==='professional'?'white':'#0A3D62',letterSpacing:'0.05em'}}>
                  {plan.badge}
                </div>
              )}
              <div style={{padding:'28px 24px 20px'}}>
                <div style={{fontSize:'12px',fontWeight:700,color:plan.id==='professional'?'rgba(226,242,223,0.7)':'#696969',
                  textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>{plan.name}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'4px'}}>
                  <span style={{fontSize:'clamp(28px,3vw,40px)',fontWeight:900,
                    color:plan.id==='professional'?'white':'#0A3D62'}}>{plan.price}</span>
                  <span style={{fontSize:'14px',color:plan.id==='professional'?'rgba(226,242,223,0.7)':'#696969'}}>{plan.period}</span>
                </div>
                {plan.subPrice && (
                  <div style={{fontSize:'12px',color:plan.id==='professional'?'rgba(226,242,223,0.6)':'#696969',marginBottom:'4px'}}>{plan.subPrice}</div>
                )}
              </div>
              <div style={{flex:1,padding:'0 24px 20px'}}>
                {plan.features.map((f,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'8px',marginBottom:'10px'}}>
                    {f.included
                      ? <CheckCircle size={14} color={plan.id==='professional'?'#74BB65':'#74BB65'} style={{flexShrink:0,marginTop:'1px'}}/>
                      : <X size={14} color={plan.id==='professional'?'rgba(226,242,223,0.3)':'rgba(10,61,98,0.25)'} style={{flexShrink:0,marginTop:'1px'}}/>}
                    <span style={{fontSize:'13px',color:plan.id==='professional'
                      ? (f.included?'rgba(226,242,223,0.9)':'rgba(226,242,223,0.35)')
                      : (f.included?'#0A3D62':'rgba(10,61,98,0.35)')}}>{f.text}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:'20px 24px 28px'}}>
                <Link href={plan.ctaHref} style={{
                  display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',
                  padding:'13px',borderRadius:'10px',textDecoration:'none',fontWeight:700,fontSize:'14px',
                  ...plan.ctaStyle,
                  boxShadow:plan.id==='professional'?'0 4px 16px rgba(116,187,101,0.35)':'none',
                }}>
                  {plan.cta} <ArrowRight size={14}/>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="gfm-card" style={{overflow:'hidden'}}>
          <div style={{padding:'20px 24px',borderBottom:'1px solid rgba(10,61,98,0.06)',
            display:'flex',alignItems:'center',gap:'8px'}}>
            <Shield size={16} color="#74BB65"/>
            <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>Full Feature Comparison</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'rgba(10,61,98,0.03)'}}>
                  <th style={{padding:'12px 20px',textAlign:'left',fontSize:'12px',fontWeight:700,color:'#696969',width:'40%'}}>Feature</th>
                  {['Free Trial','Professional','Enterprise'].map(h=>(
                    <th key={h} style={{padding:'12px 16px',textAlign:'center',fontSize:'12px',fontWeight:700,
                      color:h==='Professional'?'#74BB65':'#696969'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_TABLE.map(cat=>(
                  <>
                    <tr key={cat.category} style={{background:'rgba(10,61,98,0.04)'}}>
                      <td colSpan={4} style={{padding:'10px 20px',fontSize:'11px',fontWeight:800,
                        color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.07em'}}>{cat.category}</td>
                    </tr>
                    {cat.rows.map(row=>(
                      <tr key={row.feature} style={{borderBottom:'1px solid rgba(10,61,98,0.04)'}}>
                        <td style={{padding:'10px 20px',fontSize:'13px',color:'#0A3D62'}}>{row.feature}</td>
                        {[row.trial,row.pro,row.ent].map((v,i)=>(
                          <td key={i} style={{padding:'10px 16px',textAlign:'center',fontSize:'12px',
                            color:v==='✓'?'#74BB65':v==='—'?'rgba(10,61,98,0.2)':'#696969',
                            fontWeight:v==='✓'||v.includes('Unlimited')?700:400}}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',padding:'36px',background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'16px'}}>
          <h3 style={{fontSize:'24px',fontWeight:800,color:'white',marginBottom:'10px'}}>
            Start exploring global investment intelligence today
          </h3>
          <p style={{color:'rgba(226,242,223,0.8)',marginBottom:'24px',fontSize:'14px'}}>
            7-day free trial · No credit card · Full platform access
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{padding:'13px 32px',background:'#74BB65',color:'white',
              borderRadius:'9px',textDecoration:'none',fontWeight:800,fontSize:'15px',
              display:'flex',alignItems:'center',gap:'7px',boxShadow:'0 4px 16px rgba(116,187,101,0.35)'}}>
              Start Free Trial <ArrowRight size={15}/>
            </Link>
            <Link href="/contact" style={{padding:'13px 24px',border:'1px solid rgba(226,242,223,0.35)',
              color:'rgba(226,242,223,0.9)',borderRadius:'9px',textDecoration:'none',
              fontWeight:600,fontSize:'15px'}}>
              Request Demo
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
