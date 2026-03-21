'use client';
import { Zap, Globe, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

const PREVIEW_KEY = 'fdimonitor2026';

const QUOTES = [
  "Evidence-based investment intelligence is fundamental to sustainable economic development and national prosperity.",
  "Real-time data and predictive analytics empower decision-makers to drive sustainable impact.",
  "Strategic investment promotion, grounded in comprehensive market intelligence, is essential for enhancing global competitiveness.",
  "Transparent, accessible, and reliable investment data strengthens international cooperation and fosters investment development.",
];

const FEATURES = [
  { icon:'📡', title:'Live Market Signals',         desc:'Real-time FDI signals PLATINUM to BRONZE' },
  { icon:'🏆', title:'Future Readiness assessment',    desc:'215 economies across 6 dimensions' },
  { icon:'✈️', title:'Investment Mission Planning', desc:'Target companies, free zones, opportunities' },
  { icon:'📋', title:'Custom Reports',              desc:'Smart intelligence PDF intelligence reports' },
  { icon:'🔮', title:'Foresight & Outlook 2050',   desc:'Scenario modelling to 2050' },
  { icon:'📚', title:'Resources & Insights',        desc:'Expert publications and briefings' },
  { icon:'📰', title:'Publications Library',        desc:'Sector and country deep dives' },
  { icon:'⚡', title:'Latest News',                 desc:'Real-time investment news and alerts' },
];

function HoldingPageInner() {
  const params = useSearchParams();
  const [authorized, setAuthorized] = useState(false);
  const [checked,    setChecked]    = useState(false);
  const [quoteIdx,   setQuoteIdx]   = useState(0);
  const [email,      setEmail]      = useState('');
  const [submitted,  setSubmitted]  = useState(false);

  useEffect(() => {
    const key = params.get('preview');
    if (key === PREVIEW_KEY) {
      try { localStorage.setItem('gfm_preview', PREVIEW_KEY); } catch {}
      setAuthorized(true);
    } else {
      try { if (localStorage.getItem('gfm_preview') === PREVIEW_KEY) setAuthorized(true); } catch {}
    }
    setChecked(true);
    const t = setInterval(()=>setQuoteIdx(q=>(q+1)%QUOTES.length), 5000);
    return ()=>clearInterval(t);
  }, [params]);

  useEffect(() => {
    if (authorized && checked) window.location.href = '/dashboard';
  }, [authorized, checked]);

  if (!checked) return null;
  if (authorized) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#E2F2DF'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:'32px',height:'32px',border:'3px solid #74BB65',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 12px'}}/>
        <p style={{color:'#696969',fontSize:'14px'}}>Loading platform…</p>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#E2F2DF'}}>

      {/* Header */}
      <header style={{background:'white',boxShadow:'0 2px 12px rgba(10,61,98,0.08)',position:'sticky',top:0,zIndex:50}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:'64px'}}>
          <Logo/>
          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <Link href="/auth/login" style={{fontSize:'13px',fontWeight:'600',color:'#0A3D62',textDecoration:'none',padding:'6px 12px'}}>Sign In</Link>
            <Link href="/register"  style={{fontSize:'13px',fontWeight:'700',color:'white',background:'#74BB65',borderRadius:'6px',padding:'8px 16px',textDecoration:'none'}}>Sign Up</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#0d4f7a 60%,#1a6b9e 100%)',color:'white',padding:'100px 24px 80px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2374BB65' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}/>
        <div style={{position:'relative',zIndex:1,maxWidth:'800px',margin:'0 auto'}}>
          {/* Under Development badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(116,187,101,0.15)',border:'1px solid rgba(116,187,101,0.4)',borderRadius:'20px',padding:'6px 16px',marginBottom:'32px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',animation:'pulse 2s infinite'}}/>
            <span style={{fontSize:'13px',fontWeight:'700',color:'#74BB65',letterSpacing:'0.08em'}}>UNDER DEVELOPMENT · COMING SOON</span>
          </div>

          <h1 style={{fontSize:'48px',fontWeight:'800',color:'white',lineHeight:'1.15',marginBottom:'24px',letterSpacing:'-1px'}}>
            The next generation<br/>
            <span style={{color:'#74BB65'}}>global investment intelligence</span>
          </h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.8)',lineHeight:'1.6',marginBottom:'40px',maxWidth:'600px',margin:'0 auto 40px'}}>
            Designed to transform data into strategic decision-making.
          </p>
          <Link href="/register" style={{display:'inline-block',background:'#74BB65',color:'white',fontWeight:'800',fontSize:'16px',padding:'16px 40px',borderRadius:'8px',textDecoration:'none',letterSpacing:'0.04em'}}>
            EXPLORE PLATFORM
          </Link>
        </div>
      </section>

      {/* Quote carousel */}
      <section style={{background:'#0A3D62',padding:'32px 24px',textAlign:'center'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <p style={{fontSize:'16px',fontStyle:'italic',color:'rgba(255,255,255,0.85)',lineHeight:'1.7',transition:'opacity 0.5s'}}>
            "{QUOTES[quoteIdx]}"
          </p>
          <div style={{display:'flex',justifyContent:'center',gap:'6px',marginTop:'16px'}}>
            {QUOTES.map((_,i)=>(
              <div key={i} style={{width:i===quoteIdx?'20px':'6px',height:'6px',borderRadius:'3px',background:i===quoteIdx?'#74BB65':'rgba(255,255,255,0.3)',transition:'all 0.3s',cursor:'pointer'}} onClick={()=>setQuoteIdx(i)}/>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{padding:'80px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'48px'}}>
            <div style={{fontSize:'12px',fontWeight:'700',color:'#74BB65',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'8px'}}>PLATFORM FEATURES</div>
            <h2 style={{fontSize:'32px',fontWeight:'700',color:'#0A3D62'}}>Everything you need for investment intelligence</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px'}}>
            {FEATURES.map((f,i)=>(
              <div key={f.title} className="gfm-card" style={{padding:'24px',animationDelay:`${i*0.05}s`}}>
                <div style={{fontSize:'32px',marginBottom:'12px'}}>{f.icon}</div>
                <div style={{fontWeight:'700',color:'#0A3D62',fontSize:'15px',marginBottom:'6px'}}>{f.title}</div>
                <div style={{fontSize:'13px',color:'#696969',lineHeight:'1.5'}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early access form */}
      <section style={{background:'white',padding:'64px 24px'}}>
        <div style={{maxWidth:'520px',margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:'28px',fontWeight:'700',color:'#0A3D62',marginBottom:'8px'}}>Get Early Access</h2>
          <p style={{color:'#696969',fontSize:'14px',marginBottom:'28px'}}>Be notified when we launch. No spam, ever.</p>
          {!submitted ? (
            <div style={{display:'flex',gap:'8px'}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="your@organisation.com" aria-label="Early access email"
                style={{flex:1,padding:'12px 16px',borderRadius:'8px',border:'1.5px solid rgba(10,61,98,0.15)',fontSize:'14px'}}/>
              <button onClick={()=>{if(email.includes('@'))setSubmitted(true);}}
                style={{background:'#74BB65',color:'white',border:'none',borderRadius:'8px',padding:'12px 24px',fontWeight:'700',fontSize:'14px',cursor:'pointer',whiteSpace:'nowrap'}}>
                Notify Me
              </button>
            </div>
          ) : (
            <div style={{background:'#E2F2DF',border:'1px solid rgba(116,187,101,0.3)',borderRadius:'8px',padding:'16px',color:'#2d7a20',fontWeight:'600'}}>
              ✓ You're on the list! We'll notify you at {email}.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{background:'#0A3D62',padding:'24px',textAlign:'center'}}>
        <p style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>© 2026 Global FDI Monitor. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}

export default function HoldingPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#E2F2DF'}}/>}>
      <HoldingPageInner/>
    </Suspense>
  );
}
