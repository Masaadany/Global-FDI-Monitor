'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import FDIFlowMap from '@/components/FDIFlowMap';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectorDonut from '@/components/SectorDonut';
import {
  Zap, Globe, BarChart3, Award, Target, BookOpen, TrendingUp, Shield,
  ArrowRight, Play, CheckCircle, Users, Building2, Activity,
} from '@/lib/icons';

const QUOTES = [
  "Evidence-based investment intelligence is fundamental to sustainable economic development and national prosperity.",
  "Real-time data and predictive analytics empower decision-makers to drive sustainable impact.",
  "Strategic investment promotion, grounded in comprehensive market intelligence, is essential for enhancing global competitiveness.",
  "Transparent, accessible, and reliable investment data strengthens international cooperation and fosters investment development.",
];

const FEATURES = [
  { icon: Zap,       title:'Live Market Signals',        desc:'218+ real-time FDI signals graded PLATINUM to BRONZE. Z3 verified, SHA-256 provenance, 2-second updates.', href:'/signals',         color:'#74BB65' },
  { icon: Award,     title:'Future Readiness assessment',   desc:'GFR assessments for 215 economies across 6 dimensions. Quarterly recalculation with full methodology.', href:'/gfr',              color:'#0A3D62' },
  { icon: Target,    title:'Investment Mission Planning', desc:'Match destination economies, target companies, government entities and sector leads for IPA missions.', href:'/pmp',             color:'#1B6CA8' },
  { icon: BookOpen,  title:'Custom Intelligence Reports', desc:'10 Smart intelligence report types. Market briefs to flagship GFR reports. PDF only, dynamically watermarked.', href:'/reports',        color:'#74BB65' },
  { icon: TrendingUp,title:'Foresight & Outlook 2050',   desc:'Probabilistic FDI forecasts to 2050. Optimistic, base, and stress scenarios with what-if analysis.', href:'/forecast',        color:'#0A3D62' },
  { icon: Globe,     title:'Resources & Insights',        desc:'Sector deep dives, regional briefs, policy notes, and research publications from our intelligence team.', href:'/market-insights', color:'#1B6CA8' },
  { icon: BarChart3, title:'Publications Library',        desc:'Quarterly briefs, annual reports, and economy profiles available to Professional subscribers.', href:'/publications',     color:'#74BB65' },
  { icon: Activity,  title:'Latest Intelligence',         desc:'Platform-curated investment news, signal highlights, and GFR tier movements in real time.', href:'/dashboard',        color:'#0A3D62' },
];

const SECTORS_DATA = [
  {label:'Technology',      value:45, color:'#0A3D62'},
  {label:'Energy',          value:18, color:'#74BB65'},
  {label:'Manufacturing',   value:14, color:'#1B6CA8'},
  {label:'Finance',         value:10, color:'#2E86AB'},
  {label:'Healthcare',      value: 7, color:'#696969'},
  {label:'Infrastructure',  value: 6, color:'#9E9E9E'},
];

const TESTIMONIALS = [
  { org:'Investment Promotion Agency',  role:'Director General', quote:'GFR assessments transformed how we benchmark national competitiveness and target inward investment missions.' },
  { org:'Sovereign Wealth Fund',        role:'Head of Strategy',  quote:'The signal intelligence and corridor analysis gives us an edge in identifying greenfield opportunities.' },
  { org:'Strategy Consulting Firm',     role:'Senior Partner',    quote:'Our clients rely on FDI Monitor\'s 2050 foresight engine for long-horizon strategic planning.' },
];

export default function HomePage() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [fade,     setFade]     = useState(true);
  const [demoPlaying, setDemoPlaying] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setQuoteIdx(q => (q+1)%QUOTES.length); setFade(true); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{background:'#E2F2DF',minHeight:'100vh'}}>
      <NavBar/>

      {/* ── CINEMATIC HERO ── */}
      <section style={{
        position:'relative', minHeight:'90vh',
        background:'linear-gradient(135deg,#061E30 0%,#0A3D62 45%,#0E4F7A 100%)',
        display:'flex', alignItems:'center', overflow:'hidden',
      }}>
        {/* Animated grid overlay */}
        <div style={{position:'absolute',inset:0,
          backgroundImage:'linear-gradient(rgba(116,187,101,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(116,187,101,0.06) 1px,transparent 1px)',
          backgroundSize:'48px 48px', opacity:0.8}}/>
        {/* Gradient overlay */}
        <div style={{position:'absolute',inset:0,
          background:'radial-gradient(ellipse at 70% 50%, rgba(116,187,101,0.08) 0%, transparent 60%)'}}/>

        {/* Hero content */}
        <div style={{position:'relative',zIndex:10,maxWidth:'1400px',margin:'0 auto',padding:'60px 40px',
          display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'center'}}>
          <div>
            {/* Live badge */}
            <div style={{display:'inline-flex',alignItems:'center',gap:'8px',
              background:'rgba(116,187,101,0.12)',border:'1px solid rgba(116,187,101,0.3)',
              padding:'6px 16px',borderRadius:'24px',marginBottom:'28px'}}>
              <Zap size={13} color="#74BB65" fill="#74BB65"/>
              <span style={{fontSize:'12px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em'}}>
                LIVE · 218 ACTIVE SIGNALS · REAL-TIME
              </span>
            </div>

            <h1 style={{
              fontSize:'clamp(32px,4vw,58px)',fontWeight:900,color:'white',
              lineHeight:1.05,marginBottom:'20px',letterSpacing:'-1.5px',
            }}>
              The next generation<br/>
              <span style={{color:'#74BB65'}}>global investment</span><br/>
              intelligence platform.
            </h1>
            <p style={{fontSize:'17px',color:'rgba(226,242,223,0.82)',lineHeight:'1.72',
              marginBottom:'36px',maxWidth:'520px'}}>
              Designed to transform complex global investment data into actionable strategic decisions for governments, IPAs, and institutional investors worldwide.
            </p>

            {/* CTA buttons */}
            <div style={{display:'flex',gap:'14px',flexWrap:'wrap',marginBottom:'40px'}}>
              <Link href="/register" style={{
                display:'inline-flex',alignItems:'center',gap:'8px',
                padding:'15px 32px',borderRadius:'10px',background:'#74BB65',color:'white',
                fontWeight:800,fontSize:'15px',textDecoration:'none',
                boxShadow:'0 6px 24px rgba(116,187,101,0.4)',transition:'transform 0.2s',
              }}>
                Start Access <ArrowRight size={16}/>
              </Link>
              <button onClick={()=>setDemoPlaying(true)} style={{
                display:'inline-flex',alignItems:'center',gap:'8px',
                padding:'15px 28px',borderRadius:'10px',background:'rgba(255,255,255,0.08)',
                border:'1px solid rgba(255,255,255,0.25)',color:'rgba(226,242,223,0.9)',
                fontWeight:600,fontSize:'15px',cursor:'pointer',
              }}>
                <Play size={14} fill="currentColor"/> Watch Demo
              </button>
            </div>

            {/* Animated stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',maxWidth:'440px'}}>
              {[
                {icon:Globe,     val:215,   suffix:'',   label:'Economies'},
                {icon:Building2, val:1400,  suffix:'+',  label:'Free Zones'},
                {icon:Activity,  val:218,   suffix:'+',  label:'Live Signals'},
              ].map(({icon:Icon,val,suffix,label})=>(
                <div key={label} style={{textAlign:'center'}}>
                  <Icon size={18} color="#74BB65" style={{marginBottom:'4px'}}/>
                  <div style={{fontSize:'24px',fontWeight:900,color:'white',fontFamily:'monospace',lineHeight:1}}>
                    <AnimatedCounter value={val} suffix={suffix} duration={2200}/>
                  </div>
                  <div style={{fontSize:'11px',color:'rgba(226,242,223,0.55)',marginTop:'3px'}}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero right: FDI Flow Map */}
          <div style={{position:'relative'}}>
            <FDIFlowMap height={340}/>
            {/* Floating signal card */}
            <div style={{
              position:'absolute',bottom:'-10px',right:'-8px',
              background:'white',borderRadius:'12px',padding:'12px 16px',
              boxShadow:'0 8px 30px rgba(10,61,98,0.2)',minWidth:'200px',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'6px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',animation:'livePulse 2s infinite'}}/>
                <span style={{fontSize:'10px',fontWeight:800,color:'#74BB65',letterSpacing:'0.05em'}}>LATEST SIGNAL</span>
              </div>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>Microsoft · 🇦🇪 UAE</div>
              <div style={{fontSize:'12px',color:'#696969'}}>$5.2B · Technology · PLATINUM</div>
              <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'6px'}}>
                <Shield size={11} color="#74BB65"/>
                <span style={{fontSize:'10px',color:'#74BB65',fontWeight:600}}>Z3 Verified · SCI 96.2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROTATING QUOTE CAROUSEL ── */}
      <section style={{background:'white',padding:'0'}}>
        <div style={{maxWidth:'860px',margin:'0 auto',padding:'52px 40px',textAlign:'center'}}>
          <div style={{opacity:fade?1:0,transition:'opacity 0.4s ease'}}>
            <div style={{fontSize:'28px',color:'#74BB65',lineHeight:0,verticalAlign:'-10px',marginRight:'6px',fontFamily:'Georgia,serif'}}>"</div>
            <span style={{fontSize:'clamp(16px,2.5vw,20px)',fontWeight:500,color:'#0A3D62',lineHeight:'1.65',fontStyle:'italic'}}>
              {QUOTES[quoteIdx]}
            </span>
            <div style={{fontSize:'28px',color:'#74BB65',lineHeight:0,verticalAlign:'-10px',marginLeft:'4px',fontFamily:'Georgia,serif'}}>"</div>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px'}}>
            {QUOTES.map((_,i)=>(
              <button key={i} onClick={()=>{setFade(false);setTimeout(()=>{setQuoteIdx(i);setFade(true)},200);}}
                aria-label={`Quote ${i+1}`}
                style={{width:i===quoteIdx?28:8,height:'8px',borderRadius:'4px',border:'none',cursor:'pointer',
                  background:i===quoteIdx?'#74BB65':'rgba(10,61,98,0.15)',transition:'all 0.3s ease'}}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANIMATED STATS BAND ── */}
      <section style={{background:'#0A3D62',padding:'40px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'20px',textAlign:'center'}}>
          {[
            {val:215,   suffix:'',   label:'Economies',       icon:Globe},
            {val:1400,  suffix:'+',  label:'Free Zones',      icon:Building2},
            {val:30,    suffix:'+',  label:'Years Data',      icon:BarChart3},
            {val:21,    suffix:'',   label:'Sectors',  icon:Target},
            {val:300,   suffix:'+',  label:'Data Sources',    icon:BookOpen},
            {val:218,   suffix:'+',  label:'Live Signals',    icon:Zap},
          ].map(({val,suffix,label,icon:Icon})=>(
            <div key={label}>
              <Icon size={20} color="#74BB65" style={{marginBottom:'8px'}}/>
              <div style={{fontSize:'clamp(22px,3vw,30px)',fontWeight:900,color:'white',fontFamily:'monospace',lineHeight:1}}>
                <AnimatedCounter value={val} suffix={suffix} duration={2500}/>
              </div>
              <div style={{fontSize:'11px',color:'rgba(226,242,223,0.65)',marginTop:'5px',fontWeight:600}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8 FEATURE CARDS ── */}
      <section style={{padding:'72px 40px',background:'#E2F2DF'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'52px'}}>
            <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',
              color:'#74BB65',marginBottom:'12px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
              <CheckCircle size={13} color="#74BB65"/> Platform Features
            </div>
            <h2 style={{fontSize:'clamp(28px,4vw,40px)',fontWeight:900,color:'#0A3D62',marginBottom:'14px',lineHeight:'1.15'}}>
              Everything you need for<br/>intelligent investment decisions
            </h2>
            <p style={{fontSize:'16px',color:'#696969',maxWidth:'520px',margin:'0 auto',lineHeight:'1.65'}}>
              From real-time signals to 2050 foresight — a complete intelligence suite for investment professionals.
            </p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px'}}>
            {FEATURES.map(({icon:Icon, title, desc, href, color}, i)=>(
              <Link key={title} href={href} style={{textDecoration:'none'}}>
                <div style={{
                  background:'white',borderRadius:'16px',padding:'28px 24px',height:'100%',
                  boxShadow:'0 2px 12px rgba(10,61,98,0.07)',
                  border:'1px solid rgba(10,61,98,0.06)',
                  transition:'all 0.25s ease',cursor:'pointer',
                  display:'flex',flexDirection:'column',gap:'12px',
                }}>
                  <div style={{
                    width:'48px',height:'48px',borderRadius:'14px',
                    background:`${color}12`,display:'flex',alignItems:'center',justifyContent:'center',
                  }}>
                    <Icon size={24} color={color}/>
                  </div>
                  <h3 style={{fontSize:'15px',fontWeight:700,color:'#0A3D62',lineHeight:'1.3',margin:0}}>{title}</h3>
                  <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.6',margin:0,flex:1}}>{desc}</p>
                  <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',fontWeight:700,color}}>
                    Learn more <ArrowRight size={12}/>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYTICS SHOWCASE ── */}
      <section style={{background:'white',padding:'72px 40px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',
              color:'#74BB65',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
              <Activity size={13} color="#74BB65"/> Live Analytics
            </div>
            <h2 style={{fontSize:'clamp(24px,3vw,36px)',fontWeight:900,color:'#0A3D62',marginBottom:'16px',lineHeight:'1.2'}}>
              Real-time FDI intelligence at sector and regional level
            </h2>
            <p style={{fontSize:'15px',color:'#696969',lineHeight:'1.7',marginBottom:'24px'}}>
              Track investment flows across 21 ISIC sectors and 7 regions in real time. Our SCI-scored signal feed updates every 2 seconds.
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[
                {icon:CheckCircle, text:'Z3 formal verification on every signal'},
                {icon:CheckCircle, text:'SHA-256 provenance hash for audit trail'},
                {icon:CheckCircle, text:'Cross-source validation against 300+ databases'},
              ].map(({icon:Icon,text})=>(
                <div key={text} style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'14px',color:'#0A3D62',fontWeight:500}}>
                  <Icon size={16} color="#74BB65"/>{text}
                </div>
              ))}
            </div>
            <Link href="/signals" style={{
              display:'inline-flex',alignItems:'center',gap:'6px',marginTop:'24px',
              padding:'12px 24px',borderRadius:'8px',background:'#0A3D62',color:'white',
              textDecoration:'none',fontWeight:700,fontSize:'14px',
            }}>
              View Live Signals <ArrowRight size={14}/>
            </Link>
          </div>
          <div>
            <SectorDonut slices={SECTORS_DATA} size={220} title="2025 FDI"/>
          </div>
        </div>
      </section>

      {/* ── TRUST / TESTIMONIALS ── */}
      <section style={{background:'#E2F2DF',padding:'72px 40px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'44px'}}>
            <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',
              color:'#74BB65',marginBottom:'10px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
              <Users size={13} color="#74BB65"/> Trusted by investment professionals
            </div>
            <h2 style={{fontSize:'clamp(24px,3vw,34px)',fontWeight:900,color:'#0A3D62'}}>
              What our clients say
            </h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
            {TESTIMONIALS.map(t=>(
              <div key={t.org} style={{background:'white',borderRadius:'16px',padding:'28px',
                boxShadow:'0 2px 12px rgba(10,61,98,0.06)'}}>
                <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.7',fontStyle:'italic',
                  marginBottom:'20px'}}>"{t.quote}"</p>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'rgba(116,187,101,0.15)',
                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Users size={16} color="#74BB65"/>
                  </div>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>{t.role}</div>
                    <div style={{fontSize:'11px',color:'#696969'}}>{t.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'80px 40px',textAlign:'center'}}>
        <div style={{maxWidth:'620px',margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(28px,4vw,42px)',fontWeight:900,color:'white',marginBottom:'16px',lineHeight:'1.15'}}>
            Ready to elevate your<br/>investment intelligence?
          </h2>
          <p style={{color:'rgba(226,242,223,0.82)',marginBottom:'32px',fontSize:'16px',lineHeight:'1.7'}}>
            Start with a free 7-day trial — no credit card required. Full access to signals, GFR assessments, benchmarking, and foresight tools.
          </p>
          <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{
              display:'inline-flex',alignItems:'center',gap:'8px',
              padding:'16px 36px',borderRadius:'10px',background:'#74BB65',color:'white',
              fontWeight:900,fontSize:'16px',textDecoration:'none',
              boxShadow:'0 6px 24px rgba(116,187,101,0.4)',
            }}>
              Start Access <ArrowRight size={16}/>
            </Link>
            <Link href="/contact" style={{
              display:'inline-flex',alignItems:'center',gap:'8px',
              padding:'16px 28px',borderRadius:'10px',
              border:'1px solid rgba(226,242,223,0.35)',color:'rgba(226,242,223,0.9)',
              textDecoration:'none',fontWeight:600,fontSize:'16px',
            }}>
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer/>

      {/* Demo modal */}
      {demoPlaying && (
        <div onClick={()=>setDemoPlaying(false)} style={{
          position:'fixed',inset:0,zIndex:9999,background:'rgba(10,61,98,0.92)',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        }}>
          <div style={{background:'white',borderRadius:'16px',padding:'40px',maxWidth:'560px',width:'90%',textAlign:'center'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:'40px',marginBottom:'16px'}}>🎬</div>
            <h3 style={{fontSize:'20px',fontWeight:800,color:'#0A3D62',marginBottom:'8px'}}>Platform Demo</h3>
            <p style={{fontSize:'14px',color:'#696969',marginBottom:'20px'}}>Explore the full platform demo — no login required.</p>
            <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
              <Link href="/demo" style={{padding:'12px 24px',background:'#74BB65',color:'white',
                borderRadius:'8px',textDecoration:'none',fontWeight:700,fontSize:'14px'}}>
                Interactive Demo →
              </Link>
              <button onClick={()=>setDemoPlaying(false)}
                style={{padding:'12px 20px',border:'1px solid rgba(10,61,98,0.15)',color:'#696969',
                  background:'transparent',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
