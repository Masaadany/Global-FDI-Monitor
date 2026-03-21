'use client';
import { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Globe, Zap, BarChart3, Shield, TrendingUp, ArrowRight, ChevronRight } from 'lucide-react';

const ECONOMIES = [
  {id:'SGP',code:'SG',name:'Singapore',   gosa:88.4,trend:+0.2,region:'Asia Pacific',color:'#2ECC71'},
  {id:'NZL',code:'NZ',name:'New Zealand', gosa:86.7,trend:-0.1,region:'Oceania',      color:'#2ECC71'},
  {id:'DNK',code:'DK',name:'Denmark',     gosa:85.3,trend:+0.3,region:'Europe',       color:'#2ECC71'},
  {id:'USA',code:'US',name:'United States',gosa:83.9,trend:-0.2,region:'Americas',    color:'#2ECC71'},
  {id:'ARE',code:'AE',name:'UAE',         gosa:82.1,trend:+1.2,region:'Middle East',  color:'#2ECC71'},
  {id:'MYS',code:'MY',name:'Malaysia',    gosa:81.2,trend:+0.4,region:'Asia Pacific', color:'#3498DB'},
  {id:'THA',code:'TH',name:'Thailand',    gosa:80.7,trend:+0.2,region:'Asia Pacific', color:'#3498DB'},
  {id:'VNM',code:'VN',name:'Vietnam',     gosa:79.4,trend:+0.5,region:'Asia Pacific', color:'#3498DB'},
  {id:'SAU',code:'SA',name:'Saudi Arabia',gosa:79.1,trend:+2.1,region:'Middle East',  color:'#3498DB'},
  {id:'IND',code:'IN',name:'India',       gosa:73.2,trend:+0.8,region:'Asia Pacific', color:'#F1C40F'},
];

const WORLD_DOTS = [
  {x:73,y:47,code:'SG',name:'Singapore',gosa:88.4,c:'#2ECC71',r:8},
  {x:84,y:75,code:'AU',name:'Australia', gosa:82.8,c:'#2ECC71',r:7},
  {x:53,y:40,code:'AE',name:'UAE',      gosa:82.1,c:'#2ECC71',r:7},
  {x:49,y:27,code:'GB',name:'UK',       gosa:82.5,c:'#2ECC71',r:7},
  {x:51,y:27,code:'DE',name:'Germany',  gosa:83.1,c:'#2ECC71',r:6},
  {x:20,y:37,code:'US',name:'USA',      gosa:83.9,c:'#2ECC71',r:8},
  {x:68,y:38,code:'IN',name:'India',    gosa:73.2,c:'#F1C40F',r:7},
  {x:76,y:38,code:'KR',name:'S.Korea',  gosa:84.1,c:'#2ECC71',r:6},
  {x:24,y:62,code:'BR',name:'Brazil',   gosa:71.3,c:'#F1C40F',r:6},
  {x:46,y:52,code:'MA',name:'Morocco',  gosa:66.8,c:'#F1C40F',r:5},
  {x:55,y:43,code:'SA',name:'S.Arabia', gosa:79.1,c:'#3498DB',r:6},
  {x:70,y:45,code:'TH',name:'Thailand', gosa:80.7,c:'#3498DB',r:6},
  {x:72,y:48,code:'MY',name:'Malaysia', gosa:81.2,c:'#3498DB',r:6},
  {x:73,y:46,code:'VN',name:'Vietnam',  gosa:79.4,c:'#3498DB',r:5},
];

const SIGNALS = [
  {grade:'PLATINUM',type:'POLICY',  flag:'MY',country:'Malaysia',   title:'FDI cap in data centers raised to 100%',           sco:96,impact:'HIGH',time:'2m'},
  {grade:'PLATINUM',type:'DEAL',    flag:'AE',country:'UAE',         title:'Microsoft $3.3B AI infrastructure commitment',      sco:97,impact:'HIGH',time:'1h'},
  {grade:'PLATINUM',type:'INCENTIVE',flag:'TH',country:'Thailand',  title:'$2B EV battery subsidy package approved',           sco:95,impact:'HIGH',time:'3h'},
  {grade:'GOLD',    type:'POLICY',  flag:'SA',country:'Saudi Arabia','title':'30-day FDI license guarantee live',               sco:94,impact:'HIGH',time:'6h'},
  {grade:'GOLD',    type:'GROWTH',  flag:'VN',country:'Vietnam',     title:'Electronics exports surge 34% YoY',                sco:92,impact:'MED', time:'1d'},
];

const FEATURES = [
  { icon: <Globe size={24} color="#2ECC71"/>, title: 'GOSA Intelligence', desc: '4-layer composite scoring across 215+ economies using 1000+ official sources, updated weekly by our AI agent pipeline.', link: '/investment-analysis' },
  { icon: <Zap size={24} color="#2ECC71"/>, title: 'Real-Time Signals', desc: 'PLATINUM, GOLD and SILVER investment signals delivered every 2 seconds via WebSocket from verified T1/T2 sources.', link: '/signals' },
  { icon: <BarChart3 size={24} color="#2ECC71"/>, title: 'GFR Ranking', desc: '6-dimension composite ranking comparable to IMD WCR, Kearney GCR and the World Happiness Report.', link: '/gfr' },
  { icon: <Shield size={24} color="#2ECC71"/>, title: 'Verified Intelligence', desc: 'Every signal SHA-256 hash-verified through AGT-03. No unverified data reaches the platform.', link: '/sources' },
  { icon: <TrendingUp size={24} color="#2ECC71"/>, title: 'Corridor Intelligence', desc: '12 active bilateral FDI corridors with flow data, strategic drivers and sector mapping.', link: '/corridors' },
  { icon: <ArrowRight size={24} color="#2ECC71"/>, title: 'Scenario Planner', desc: 'What-if IRR and NPV modelling. Save and compare up to 4 investment scenarios side-by-side.', link: '/scenario-planner' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let start = 0; const step = target / 60;
        const timer = setInterval(() => { start += step; if (start >= target) { setCount(target); clearInterval(timer); } else setCount(Math.floor(start)); }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <div ref={ref} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: '40px', color: '#1A2C3E' }}>{count.toLocaleString()}{suffix}</div>;
}

export default function HomePage() {
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <NavBar/>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', background: '#FFFFFF', borderBottom: '1px solid #ECF0F1', overflow: 'hidden', paddingBottom: '60px' }}>
        {/* Background video overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(248,249,250,0.97) 0%, rgba(255,255,255,0.92) 100%)', zIndex: 1 }}/>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(46,204,113,0.06) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(26,44,62,0.04) 0%, transparent 50%)', zIndex: 1 }}/>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1540px', margin: '0 auto', padding: '60px 24px 0' }}>
          {/* Hero text */}
          <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeSlideUp 0.6s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.25)', borderRadius: '50px', marginBottom: '20px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ECC71', boxShadow: '0 0 8px #2ECC71', animation: 'pulseGreen 2s infinite' }}/>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#27ae60' }}>Live · 2-second updates · 1000+ verified sources</span>
            </div>
            <h1 style={{ fontSize: '56px', fontWeight: 900, color: '#1A2C3E', lineHeight: 1.1, marginBottom: '18px', letterSpacing: '-0.02em' }}>
              Global Investment Intelligence.<br/>
              <span style={{ color: '#2ECC71' }}>Real-Time. Verified. Smart.</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#5A6874', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              The world's most advanced FDI intelligence platform. GOSA-scored intelligence across 215+ economies.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 32px', borderRadius: '50px', background: '#1A2C3E', color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 700, boxShadow: '0 4px 20px rgba(26,44,62,0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Explore Dashboard <ChevronRight size={16}/>
              </Link>
              <Link href="/signals" style={{ padding: '14px 32px', borderRadius: '50px', background: '#FFFFFF', color: '#1A2C3E', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1.5px solid #ECF0F1', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <Zap size={15} color="#2ECC71"/> View Signals
              </Link>
              <Link href="/investment-analysis" style={{ padding: '14px 32px', borderRadius: '50px', background: 'rgba(46,204,113,0.1)', color: '#27ae60', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1.5px solid rgba(46,204,113,0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Investment Analysis <ArrowRight size={15}/>
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', padding: '20px 0 40px', borderTop: '1px solid #ECF0F1', marginTop: '32px', flexWrap: 'wrap' }}>
            {[['215+','Economies'],['1000+','Official Sources'],['2s','Update Frequency']].map(([v,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#1A2C3E', fontFamily: "'JetBrains Mono',monospace" }}>{v}</div>
                <div style={{ fontSize: '12px', color: '#5A6874', marginTop: '2px', fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* World dot map */}
          <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.08)', border: '1px solid #ECF0F1', padding: '24px', position: 'relative', overflow: 'hidden', marginBottom: '0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#5A6874', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', textAlign: 'center' }}>Global Opportunity Map — 215+ Economies Tracked</div>
            <svg viewBox="0 0 100 60" style={{ width: '100%', height: 'auto', maxHeight: '320px' }}>
              <defs>
                <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EBF8FF"/>
                  <stop offset="100%" stopColor="#F8F9FA"/>
                </radialGradient>
              </defs>
              <rect width="100" height="60" fill="url(#bgGrad)"/>
              {[10,20,30,40,50].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#ECF0F1" strokeWidth="0.2"/>)}
              {[20,40,60,80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="60" stroke="#ECF0F1" strokeWidth="0.2"/>)}
              {WORLD_DOTS.map(dot => (
                <g key={dot.code} onMouseEnter={() => setHoveredDot(dot.code)} onMouseLeave={() => setHoveredDot(null)} style={{ cursor: 'pointer' }}>
                  <circle cx={dot.x} cy={dot.y} r={dot.r * 0.5 + 0.8} fill={dot.c + '20'} stroke={dot.c + '40'} strokeWidth="0.3">
                    <animate attributeName="r" values={`${dot.r*0.5+0.8};${dot.r*0.5+1.8};${dot.r*0.5+0.8}`} dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx={dot.x} cy={dot.y} r={dot.r * 0.4} fill={dot.c} opacity="0.9"/>
                  {hoveredDot === dot.code && (
                    <g>
                      <rect x={dot.x - 6} y={dot.y - 6} width="12" height="7" fill="white" stroke={dot.c} strokeWidth="0.2" rx="1"/>
                      <text x={dot.x} y={dot.y - 2.5} textAnchor="middle" fontSize="1.6" fill="#1A2C3E" fontWeight="bold" fontFamily="Inter,sans-serif">{dot.name}</text>
                      <text x={dot.x} y={dot.y + 0.2} textAnchor="middle" fontSize="1.4" fill={dot.c} fontFamily="JetBrains Mono,monospace">{dot.gosa}</text>
                    </g>
                  )}
                </g>
              ))}
              {[{x:73,y:55,l:'ASIA PACIFIC'},{x:53,y:55,l:'MIDDLE EAST'},{x:49,y:20,l:'EUROPE'},{x:20,y:50,l:'AMERICAS'},{x:45,y:57,l:'AFRICA'}].map(({x,y,l}) => (
                <text key={l} x={x} y={y} textAnchor="middle" fontSize="2.2" fill="#C8D0D6" fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.05em">{l}</text>
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
              {[['#2ECC71','TOP (≥80)'],['#3498DB','HIGH (70-79)'],['#F1C40F','DEVELOPING (<70)']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#5A6874' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c as string }}/>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LIVE SIGNALS STRIP ══ */}
      <section style={{ background: '#1A2C3E', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1540px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(46,204,113,0.6)', letterSpacing: '0.2em', marginBottom: '4px' }}>LIVE INTELLIGENCE</div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF' }}>Latest Investment Signals</h2>
            </div>
            <Link href="/signals" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.25)', borderRadius: '50px', textDecoration: 'none', fontSize: '12px', fontWeight: 700, color: '#2ECC71' }}>
              Full Feed <ArrowRight size={13}/>
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {SIGNALS.map((sig, i) => {
              const gc = sig.grade === 'PLATINUM' ? '#c39bd3' : '#F1C40F';
              return (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '4px', background: `${gc}20`, color: gc, letterSpacing: '0.05em' }}>{sig.grade}</span>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace" }}>{sig.time} ago</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                    <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${sig.flag}.svg`} width="18" height="12" style={{ borderRadius: '2px', flexShrink: 0 }} onError={e => { (e.target as any).style.display = 'none'; }}/>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{sig.country}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.45, fontWeight: 500 }}>{sig.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ TOP ECONOMIES ══ */}
      <section style={{ padding: '80px 24px', background: '#F8F9FA' }}>
        <div style={{ maxWidth: '1540px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#2ECC71', letterSpacing: '0.2em', marginBottom: '8px' }}>GOSA RANKINGS</div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1A2C3E', marginBottom: '8px' }}>Top Investment Destinations</h2>
            <p style={{ fontSize: '15px', color: '#5A6874' }}>Ranked by Global Opportunity Score (GOSA) — composite of 4 layers, 1000+ sources</p>
          </div>

          {/* Lollipop chart style */}
          <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.08)', border: '1px solid #ECF0F1', padding: '28px', marginBottom: '24px' }}>
            {ECONOMIES.map((eco, i) => (
              <Link key={eco.id} href={`/country/${eco.id}`} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: i < ECONOMIES.length - 1 ? '1px solid #F8F9FA' : 'none', textDecoration: 'none', transition: 'background 0.15s', borderRadius: '8px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F8F9FA'; e.currentTarget.style.padding = '12px 10px'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.padding = '12px 0'; }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#C8D0D6', minWidth: '24px', fontFamily: "'JetBrains Mono',monospace" }}>#{i+1}</span>
                <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${eco.code}.svg`} width="26" height="17" style={{ borderRadius: '3px', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }} onError={e => { (e.target as any).style.display = 'none'; }}/>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A2C3E', minWidth: '140px' }}>{eco.name}</span>
                <div style={{ flex: 1, position: 'relative', height: '6px', background: '#F0F2F4', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${eco.gosa}%`, background: `linear-gradient(90deg, ${eco.color}60, ${eco.color})`, borderRadius: '3px', animation: `lollipopGrow 0.8s ease ${i*0.06}s both` }}/>
                </div>
                {/* Lollipop dot */}
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: eco.color, boxShadow: `0 0 8px ${eco.color}60`, border: '2px solid white', flexShrink: 0 }}/>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#1A2C3E', fontFamily: "'JetBrains Mono',monospace", minWidth: '52px', textAlign: 'right' }}>{eco.gosa}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: eco.trend > 0 ? '#27ae60' : '#e74c3c', minWidth: '40px', fontFamily: "'JetBrains Mono',monospace" }}>
                  {eco.trend > 0 ? '▲' : '▼'}{Math.abs(eco.trend)}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#5A6874', minWidth: '100px' }}>{eco.region}</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/investment-analysis" className="btn-outline" style={{ padding: '12px 32px', borderRadius: '50px', border: '1.5px solid #1A2C3E', textDecoration: 'none', fontSize: '14px', fontWeight: 600, color: '#1A2C3E', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View Full Investment Analysis <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FEATURES GRID ══ */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1540px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#2ECC71', letterSpacing: '0.2em', marginBottom: '8px' }}>PLATFORM CAPABILITIES</div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1A2C3E' }}>Everything you need for FDI intelligence</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {FEATURES.map((f, i) => (
              <Link key={f.title} href={f.link} style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.08)', border: '1px solid #ECF0F1', textDecoration: 'none', display: 'block', transition: 'all 0.3s ease', animation: `fadeSlideUp 0.5s ease ${i*0.1}s both` }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 25px 45px -12px rgba(0,0,0,0.15)'; e.currentTarget.style.borderColor = '#2ECC71'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#ECF0F1'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(46,204,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A2C3E', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#5A6874', lineHeight: 1.7, marginBottom: '14px' }}>{f.desc}</p>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ECC71', display: 'flex', alignItems: 'center', gap: '4px' }}>Explore <ArrowRight size={13}/></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF ══ */}
      <section style={{ padding: '80px 24px', background: '#F8F9FA' }}>
        <div style={{ maxWidth: '1540px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#2ECC71', letterSpacing: '0.2em', marginBottom: '8px' }}>TRUSTED BY</div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1A2C3E' }}>Used by investment professionals worldwide</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
            {[
              { quote: '"The GOSA scoring gives us a single comparable metric across markets. We use it every Monday morning."', name: 'Head of Investment Strategy', org: 'Southeast Asian Sovereign Wealth Fund', flag: 'SG' },
              { quote: '"GFR Ranking is now part of our annual competitiveness assessment. Comparable to IMD and Kearney, but with live data."', name: 'Director of FDI Policy', org: 'Middle East Investment Promotion Agency', flag: 'AE' },
              { quote: '"We evaluated 11 locations in 6 countries. The Benchmark Tool saved 3 weeks of analyst time."', name: 'VP Corporate Development', org: 'European Manufacturing Group', flag: 'DE' },
            ].map(({ quote, name, org, flag }) => (
              <div key={name} style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.08)', border: '1px solid #ECF0F1' }}>
                <div style={{ fontSize: '32px', color: '#2ECC71', lineHeight: 1, marginBottom: '12px', fontFamily: 'Georgia,serif' }}>"</div>
                <p style={{ fontSize: '14px', color: '#1A2C3E', lineHeight: 1.8, marginBottom: '18px', fontStyle: 'italic' }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${flag}.svg`} width="22" height="15" style={{ borderRadius: '2px' }} onError={e => { (e.target as any).style.display = 'none'; }}/>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A2C3E' }}>{name}</div>
                    <div style={{ fontSize: '11px', color: '#2ECC71' }}>{org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Animated counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[{val:12847,suf:'',label:'Active Users'},{val:1000,suf:'+',label:'Verified Sources'},{val:215,suf:'+',label:'Economies'},{val:23,suf:'',label:'Country Profiles'}].map(({val,suf,label}) => (
              <div key={label} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 25px -8px rgba(0,0,0,0.06)', border: '1px solid #ECF0F1', textAlign: 'center' }}>
                <AnimatedCounter target={val} suffix={suf}/>
                <div style={{ fontSize: '13px', color: '#5A6874', marginTop: '6px', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: '80px 24px', background: '#1A2C3E', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', marginBottom: '14px' }}>Start tracking global investment opportunities</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', marginBottom: '32px', lineHeight: 1.7 }}>Join investment professionals using Global FDI Monitor for real-time intelligence.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ padding: '14px 36px', background: '#2ECC71', color: '#FFFFFF', borderRadius: '50px', textDecoration: 'none', fontSize: '15px', fontWeight: 800, boxShadow: '0 4px 20px rgba(46,204,113,0.4)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Create Account <ChevronRight size={16}/>
            </Link>
            <Link href="/dashboard" style={{ padding: '14px 36px', background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderRadius: '50px', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.15)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
