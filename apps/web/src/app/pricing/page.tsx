'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';

const PLANS = [
  {
    id:'trial', name:'Free Trial', price:'$0', period:'7 days', highlight:false,
    desc:'Full access to explore the platform with usage limits',
    features:[
      { label:'Dashboard (7 widgets)', included:true },
      { label:'Investment Analysis', included:true },
      { label:'GFR Ranking', included:true },
      { label:'Live Signals Feed', included:true },
      { label:'PDF Reports', included:'2 downloads' },
      { label:'Country searches', included:'3 searches' },
      { label:'Benchmark tool', included:true },
      { label:'Export to CSV', included:false },
      { label:'Weekly newsletter', included:false },
      { label:'API Access', included:false },
      { label:'Priority support', included:false },
    ],
    cta:'Start Free Trial', ctaLink:'/register', bg:'white', border:'rgba(26,44,62,0.12)',
  },
  {
    id:'professional', name:'Professional', price:'$9,588', period:'per year ($799/mo)', highlight:true,
    desc:'Complete access for investment professionals and analysts',
    badge:'MOST POPULAR',
    features:[
      { label:'Everything in Free Trial', included:true },
      { label:'Unlimited PDF reports', included:true },
      { label:'Unlimited country searches', included:true },
      { label:'Export to CSV / Excel', included:true },
      { label:'Weekly Intelligence Brief', included:true },
      { label:'API access (1,000 calls/day)', included:true },
      { label:'Mission Planning module', included:true },
      { label:'Custom report branding', included:false },
      { label:'Team seats (add-on)', included:false },
      { label:'Dedicated account manager', included:false },
      { label:'SLA guarantee', included:false },
    ],
    cta:'Get Professional', ctaLink:'/contact?plan=professional', bg:'#1a2c3e', border:'rgba(46,204,113,0.3)',
  },
  {
    id:'enterprise', name:'Enterprise', price:'Custom', period:'bespoke pricing', highlight:false,
    desc:'Full-platform access with white-labelling and dedicated support',
    features:[
      { label:'Everything in Professional', included:true },
      { label:'Unlimited API access', included:true },
      { label:'White-label PDF reports', included:true },
      { label:'Custom data integrations', included:true },
      { label:'Unlimited team seats', included:true },
      { label:'Dedicated account manager', included:true },
      { label:'99.9% SLA guarantee', included:true },
      { label:'Custom signal monitoring', included:true },
      { label:'On-site briefings', included:true },
      { label:'Private AI agent deployment', included:true },
      { label:'SSO / SAML integration', included:true },
    ],
    cta:'Contact Sales', ctaLink:'/contact?plan=enterprise', bg:'white', border:'rgba(26,44,62,0.12)',
  },
];

const FAQS = [
  { q:'Can I cancel the trial at any time?', a:'Yes. The free trial requires no credit card and automatically expires after 7 days with no charges.' },
  { q:'What payment methods are accepted?', a:'We accept major credit cards, bank transfer, and invoicing for annual plans. Enterprise plans support PO/contract billing.' },
  { q:'Is the data updated in real time?', a:'Yes. Investment signals update every 2 seconds via WebSocket. Country scores and rankings update weekly via our AI agent pipeline.' },
  { q:'Can I export data to Excel or CSV?', a:'Professional and Enterprise plans include full CSV/Excel export from all tables and the Investment Analysis module.' },
  { q:'How is the GOSA score calculated?', a:'GOSA = (0.30×Doing Business) + (0.20×Sector Indicators) + (0.25×Zone Indicators) + (0.25×Market Intelligence). Updated weekly by AGT-04.' },
];

export default function PricingPage() {
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)', padding:'40px 24px 48px', textAlign:'center', borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{fontSize:'10px', fontWeight:800, color:'#2ecc71', letterSpacing:'0.12em', marginBottom:'8px'}}>PRICING</div>
        <h1 style={{fontSize:'32px', fontWeight:900, color:'white', marginBottom:'12px'}}>Simple, transparent pricing</h1>
        <p style={{fontSize:'14px', color:'rgba(255,255,255,0.6)', maxWidth:'480px', margin:'0 auto 28px', lineHeight:'1.65'}}>
          Start free. Upgrade when you need unlimited access. Enterprise plans available for teams and governments.
        </p>
        {/* Billing toggle */}
        <div style={{display:'inline-flex', background:'rgba(255,255,255,0.08)', borderRadius:'30px', padding:'4px', border:'1px solid rgba(255,255,255,0.12)'}}>
          {[['Monthly',false],['Annual (save 20%)',true]].map(([label,annual])=>(
            <button key={String(label)} onClick={()=>setBillingAnnual(annual as boolean)}
              style={{padding:'8px 20px', borderRadius:'25px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, fontFamily:'inherit', transition:'all 0.2s',
                background:billingAnnual===(annual as boolean)?'white':'transparent',
                color:billingAnnual===(annual as boolean)?'#1a2c3e':'rgba(255,255,255,0.7)'}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'40px 24px'}}>
        {/* Plans */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'60px'}}>
          {PLANS.map(plan=>(
            <div key={plan.id} style={{borderRadius:'20px', border:`2px solid ${plan.border}`, overflow:'hidden', position:'relative',
              background:plan.bg, boxShadow:plan.highlight?'0 20px 40px rgba(26,44,62,0.25)':'0 4px 6px -2px rgba(0,0,0,0.05)',
              transform:plan.highlight?'scale(1.02)':'none'}}>
              {(plan as any).badge && (
                <div style={{position:'absolute', top:'16px', right:'16px', background:'#2ecc71', color:'#0f1e2a', fontSize:'9px', fontWeight:900, padding:'4px 10px', borderRadius:'20px', letterSpacing:'0.06em'}}>
                  {(plan as any).badge}
                </div>
              )}
              <div style={{padding:'28px 28px 20px'}}>
                <div style={{fontSize:'13px', fontWeight:700, color:plan.highlight?'rgba(255,255,255,0.5)':'#7f8c8d', marginBottom:'6px'}}>{plan.name.toUpperCase()}</div>
                <div style={{fontSize:'36px', fontWeight:900, color:plan.highlight?'#2ecc71':'#1a2c3e', fontFamily:"'JetBrains Mono',monospace", lineHeight:1, marginBottom:'4px'}}>{plan.price}</div>
                <div style={{fontSize:'12px', color:plan.highlight?'rgba(255,255,255,0.4)':'#7f8c8d', marginBottom:'14px'}}>{plan.period}</div>
                <div style={{fontSize:'13px', color:plan.highlight?'rgba(255,255,255,0.65)':'#2c3e50', lineHeight:'1.55', marginBottom:'20px'}}>{plan.desc}</div>
                <Link href={plan.ctaLink}
                  style={{display:'block', padding:'12px', background:plan.highlight?'#2ecc71':'#1a2c3e', color:plan.highlight?'#0f1e2a':'white',
                    borderRadius:'10px', textDecoration:'none', fontSize:'13px', fontWeight:800, textAlign:'center', marginBottom:'24px'}}>
                  {plan.cta}
                </Link>
              </div>
              <div style={{borderTop:`1px solid ${plan.highlight?'rgba(255,255,255,0.1)':'rgba(26,44,62,0.07)'}`, padding:'20px 28px 28px'}}>
                {plan.features.map(({label,included})=>(
                  <div key={label} style={{display:'flex', alignItems:'center', gap:'10px', padding:'5px 0', fontSize:'12px'}}>
                    {included===true ? <CheckCircle size={14} color="#2ecc71"/> :
                     included===false ? <XCircle size={14} color={plan.highlight?'rgba(255,255,255,0.2)':'rgba(26,44,62,0.2)'}/> :
                     <CheckCircle size={14} color="#f1c40f"/>}
                    <span style={{color:included===false?(plan.highlight?'rgba(255,255,255,0.3)':'rgba(26,44,62,0.3)'):(plan.highlight?'rgba(255,255,255,0.85)':'#1a2c3e')}}>
                      {included===true||included===false ? label : `${label}: ${included}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div style={{textAlign:'center', marginBottom:'48px'}}>
          <div style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', letterSpacing:'0.1em', marginBottom:'18px'}}>TRUSTED BY INVESTMENT PROFESSIONALS AT</div>
          <div style={{display:'flex', justifyContent:'center', gap:'32px', flexWrap:'wrap', opacity:0.5}}>
            {['MISA Saudi Arabia','UAE DIFC','Vietnam MPI','Thailand BOI','Indonesia BKPM','World Bank'].map(org=>(
              <div key={org} style={{fontSize:'12px', fontWeight:700, color:'#1a2c3e'}}>{org}</div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{fontSize:'22px', fontWeight:800, color:'#1a2c3e', marginBottom:'20px', textAlign:'center'}}>Frequently Asked Questions</h2>
          <div style={{maxWidth:'700px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'8px'}}>
            {FAQS.map(({q,a},i)=>(
              <div key={q} style={{background:'white', borderRadius:'12px', border:'1px solid rgba(26,44,62,0.08)', overflow:'hidden'}}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                  style={{width:'100%', padding:'16px 20px', background:'transparent', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'inherit'}}>
                  <span style={{fontSize:'14px', fontWeight:600, color:'#1a2c3e', textAlign:'left'}}>{q}</span>
                  <span style={{fontSize:'18px', color:'#7f8c8d', flexShrink:0, marginLeft:'12px'}}>{openFaq===i?'−':'+'}</span>
                </button>
                {openFaq===i && (
                  <div style={{padding:'0 20px 16px', fontSize:'13px', color:'#7f8c8d', lineHeight:'1.7', borderTop:'1px solid rgba(26,44,62,0.06)'}}>{a}</div>
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
