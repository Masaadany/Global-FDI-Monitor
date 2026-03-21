'use client';
import { Mail, MapPin, Clock, Linkedin, ArrowRight, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import { useTrial } from '@/lib/trialContext';

const API = process.env.NEXT_PUBLIC_API_URL || '';
const COUNTRIES = ['Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Austria','Bahrain','Bangladesh',
  'Belgium','Brazil','Canada','Chile','China','Colombia','Czech Republic','Denmark','Egypt','Ethiopia','Finland',
  'France','Germany','Ghana','Greece','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan',
  'Jordan','Kazakhstan','Kenya','Kuwait','Lebanon','Malaysia','Mexico','Morocco','Netherlands','New Zealand',
  'Nigeria','Norway','Oman','Pakistan','Philippines','Poland','Portugal','Qatar','Romania','Russia',
  'Saudi Arabia','Singapore','South Africa','South Korea','Spain','Sri Lanka','Sweden','Switzerland',
  'Thailand','Turkey','UAE','Ukraine','United Kingdom','United States','Vietnam','Zambia'];

const TRIGGER_LABELS: Record<string,{icon:string,title:string,body:string}> = {
  time:    { icon:'⏰', title:'7-Day Trial Expired',         body:'Your free trial period has ended. Request a platform demo to continue with full access.' },
  reports: { icon:'📋', title:'Report Download Limit Reached', body:'You have used both report downloads included in your free trial. Request a demo to unlock unlimited reports.' },
  searches:{ icon:'🔍', title:'Search Limit Reached',         body:'You have completed 3 search and result views included in your free trial. Request a demo to continue.' },
};



export default function ContactPage() {
  const params  = useSearchParams();
  const trial   = useTrial();

  const trigger  = params?.get('trigger') || null;
  const isExpiry = params?.get('reason') === 'trial_expired';

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [org,     setOrg]     = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [ref,     setRef]     = useState('');

  // Pre-fill message with contextual reason
  useEffect(() => {
    if (isExpiry && trigger && !message) {
      const ctx = TRIGGER_LABELS[trigger];
      if (ctx) setMessage(`I would like to request a full platform demo.\n\nContext: ${ctx.body}`);
    }
  }, [isExpiry, trigger]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/v1/contact`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, org, country, message, trigger, is_demo_request: isExpiry }),
      });
      const d = await r.json();
      setRef(d.data?.ref || 'GFM-DEMO-'+Math.random().toString(36).slice(2,8).toUpperCase());
      // Mark demo as submitted → unlocks the gate
      trial.submitDemoRequest();
      setSent(true);
    } catch {
      setRef('GFM-DEMO-'+Math.random().toString(36).slice(2,8).toUpperCase());
      trial.submitDemoRequest();
      setSent(true);
    } finally { setLoading(false); }
  }

  // Success state
  if (sent) return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <div style={{maxWidth:'560px',margin:'0 auto',padding:'60px 24px',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'20px'}}>✅</div>
        <h2 style={{fontSize:'26px',fontWeight:800,color:'#0A3D62',marginBottom:'10px'}}>Demo Request Submitted</h2>
        <p style={{fontSize:'15px',color:'#696969',marginBottom:'16px',lineHeight:'1.7'}}>
          Thank you! Our investment intelligence team will review your request and contact you within 24 hours to schedule your personalised platform demo.
        </p>
        <div style={{padding:'10px 20px',borderRadius:'24px',background:'rgba(116,187,101,0.1)',border:'1px solid rgba(116,187,101,0.3)',
          fontFamily:'monospace',fontSize:'13px',color:'#0A3D62',display:'inline-block',marginBottom:'28px'}}>
          {ref}
        </div>
        <p style={{fontSize:'13px',color:'#696969',marginBottom:'24px'}}>
          Your access restriction has been noted. You will receive full platform access upon account upgrade.
        </p>
        <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/dashboard" style={{padding:'12px 24px',background:'#74BB65',color:'white',borderRadius:'8px',
            textDecoration:'none',fontWeight:700,fontSize:'14px'}}>
            Return to Dashboard →
          </a>
          <a href="/pricing" style={{padding:'12px 20px',border:'1px solid rgba(10,61,98,0.15)',color:'#0A3D62',
            borderRadius:'8px',textDecoration:'none',fontWeight:600,fontSize:'14px'}}>
            View Pricing
          </a>
        </div>
      </div>
    </div>
  );

  const triggerCtx = trigger ? TRIGGER_LABELS[trigger] : null;

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Contextual expiry banner */}
      {isExpiry && triggerCtx && (
        <div role="alert" style={{
          background:'linear-gradient(90deg,#C62828 0%,#E53935 100%)',
          padding:'14px 24px',display:'flex',gap:'14px',alignItems:'flex-start',flexWrap:'wrap',
        }}>
          <span style={{fontSize:'22px',flexShrink:0}}>{triggerCtx.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,color:'white',fontSize:'14px',marginBottom:'3px'}}>{triggerCtx.title}</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.88)',lineHeight:'1.5'}}>{triggerCtx.body}</div>
          </div>
          <div style={{display:'flex',gap:'6px',flexShrink:0}}>
            <a href="/pricing" style={{padding:'6px 14px',borderRadius:'6px',fontSize:'12px',fontWeight:700,
              background:'rgba(255,255,255,0.15)',color:'white',textDecoration:'none',border:'1px solid rgba(255,255,255,0.3)'}}>
              View Pricing
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'44px 24px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#74BB65',marginBottom:'8px'}}>
            {isExpiry ? 'Request Platform Demo' : 'Contact Us'}
          </div>
          <h1 style={{fontSize:'30px',fontWeight:800,color:'white',marginBottom:'8px',lineHeight:'1.2'}}>
            {isExpiry ? 'Get Full Access to FDI Monitor' : 'Contact Our Team'}
          </h1>
          <p style={{color:'rgba(226,242,223,0.8)',fontSize:'14px',lineHeight:'1.6'}}>
            {isExpiry
              ? 'Our investment intelligence experts will contact you within 24 hours to schedule a personalised platform demo.'
              : 'Our team of investment intelligence experts is ready to assist you.'}
          </p>
        </div>
      </section>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'32px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'32px',alignItems:'start'}}>

          {/* Left: info */}
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {isExpiry && (
              <div style={{background:'white',borderRadius:'12px',padding:'20px',
                border:'1px solid rgba(116,187,101,0.25)',boxShadow:'0 2px 12px rgba(116,187,101,0.1)'}}>
                <div style={{fontSize:'12px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#74BB65',marginBottom:'10px'}}>
                  What happens next?
                </div>
                {[
                  {n:'1',txt:'Submit the form with your contact details'},
                  {n:'2',txt:'Our team reviews and contacts you within 24 hours'},
                  {n:'3',txt:'Join a personalised 45-minute platform demonstration'},
                  {n:'4',txt:'Receive full Professional access for your organisation'},
                ].map(s=>(
                  <div key={s.n} style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'10px'}}>
                    <div style={{width:'22px',height:'22px',borderRadius:'50%',flexShrink:0,background:'#74BB65',color:'white',
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:800}}>{s.n}</div>
                    <div style={{fontSize:'12px',color:'#696969',lineHeight:'1.5',paddingTop:'2px'}}>{s.txt}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{background:'white',borderRadius:'12px',padding:'20px',
              boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
              <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Contact Details</div>
              <div style={{display:'flex',flexDirection:'column',gap:'9px',fontSize:'13px',color:'#696969'}}>
                <div style={{display:'flex',gap:'8px'}}><span>📧</span>
                  <a href="mailto:info@fdimonitor.org" style={{color:'#0A3D62',fontWeight:600}}>info@fdimonitor.org</a>
                </div>
                <div style={{display:'flex',gap:'8px'}}><span>📍</span><span>info@fdimonitor.org</span></div>
                <div style={{display:'flex',gap:'8px'}}><span>⏱</span><span>Response within 24 hours</span></div>
                <div style={{display:'flex',gap:'8px'}}><span>🔗</span>
                  <a href="https://linkedin.com/company/fdimonitor" target="_blank" rel="noopener"
                    style={{color:'#0A3D62',fontWeight:600}}>LinkedIn</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div style={{background:'white',borderRadius:'12px',padding:'32px',
            boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',marginBottom:'20px'}}>
              {isExpiry ? '🎯 Request Your Platform Demo' : 'Your Information'}
            </div>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'15px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'13px'}}>
                {[{l:'Full Name *',v:name,s:setName,p:'Your full name',t:'text',a:'name'},
                  {l:'Work Email *',v:email,s:setEmail,p:'you@organisation.com',t:'email',a:'email'}
                ].map(({l,v,s,p,t,a})=>(
                  <div key={l}>
                    <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>{l}</label>
                    <input value={v} onChange={e=>s(e.target.value)} required type={t} autoComplete={a}
                      style={{width:'100%',padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                        fontSize:'14px',outline:'none',color:'#000',background:'white'}}
                      placeholder={p} aria-required="true"/>
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'13px'}}>
                <div>
                  <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>Organisation</label>
                  <input value={org} onChange={e=>setOrg(e.target.value)} autoComplete="organization"
                    style={{width:'100%',padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                      fontSize:'14px',outline:'none',color:'#000',background:'white'}} placeholder="Your organisation"/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>Country</label>
                  <select value={country} onChange={e=>setCountry(e.target.value)}
                    style={{width:'100%',padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                      fontSize:'14px',outline:'none',color:'#000',background:'white'}}>
                    <option value="">Select country…</option>
                    {COUNTRIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>
                  {isExpiry ? 'Your Message / Use Case *' : 'Message *'}
                </label>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} required rows={5}
                  style={{width:'100%',padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                    fontSize:'14px',outline:'none',resize:'vertical',color:'#000',background:'white'}}
                  placeholder={isExpiry ? 'Tell us about your organisation and investment intelligence needs…' : 'How can we help you?'}
                  aria-required="true"/>
              </div>
              <button type="submit" disabled={loading}
                style={{
                  padding:'14px',background:'#74BB65',color:'white',border:'none',
                  borderRadius:'10px',fontSize:'15px',fontWeight:800,cursor:loading?'wait':'pointer',
                  boxShadow:'0 4px 16px rgba(116,187,101,0.3)',opacity:loading?0.75:1,
                }}>
                {loading
                  ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                      <span style={{width:'16px',height:'16px',border:'2px solid white',borderTopColor:'transparent',
                        borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/>Submitting…
                    </span>
                  : isExpiry ? 'Submit Demo Request →' : 'Send Message →'}
              </button>
              <p style={{fontSize:'11px',color:'#696969',textAlign:'center',lineHeight:'1.5'}}>
                {isExpiry
                  ? 'Submitting this form lifts the access restriction for your session. Full access requires account upgrade.'
                  : 'Our team will review your request and get back to you shortly.'}
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
