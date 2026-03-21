'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Globe3D from '@/components/Globe3D';
import { ArrowRight, TrendingUp, Zap, Globe, BarChart3, FileText, Shield, ChevronRight } from 'lucide-react';

// Animated counter
function Counter({ target, suffix='' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) {
        let start = 0;
        const step = target / 60;
        const iv = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(Math.floor(start));
          if(start >= target) clearInterval(iv);
        }, 16);
      }
    });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const FEATURES = [
  { icon:'📊', color:'#00ffc8', title:'GOSA Investment Scoring', desc:'4-Layer weighted composite covering Doing Business (L1), Sector (L2), Zone (L3), and Market Intelligence (L4). Updated weekly by AGT-04.' },
  { icon:'⚡', color:'#00d4ff', title:'Live Investment Signals', desc:'Real-time signals from 304+ official sources. SHA-256 verified, SCI-scored. PLATINUM, GOLD, and SILVER grade alerts every 2 seconds.' },
  { icon:'🏆', color:'#ffd700', title:'GFR Ranking', desc:'6-dimension Global Future Readiness Ranking: ETR, ICT, TCM, DTF, SGT, GRP. 25 economies. Comparable to IMD WCR and Kearney GCR.' },
  { icon:'🌍', color:'#9b59b6', title:'Country Intelligence', desc:'20+ deep-dive country profiles with Doing Business indicators, investment zones, live signals, and FDI statistics updated weekly.' },
  { icon:'📄', color:'#e67e22', title:'AI-Generated Reports', desc:'4-page investment intelligence PDF reports. GOSA deep-dive, zone recommendations, market signals, and 5-year financial modeling.' },
  { icon:'🎯', color:'#ff4466', title:'Mission Planning', desc:'Guided investment mission workflows: Market Entry, Site Selection, Competitive Benchmark, and Impact Modeling with GOSA scoring.' },
];

const RANKINGS_PREVIEW = [
  { rank:1, flag:'🇸🇬', name:'Singapore',     gosa:88.4, gfr:91.2, trend:'+0.3' },
  { rank:2, flag:'🇩🇰', name:'Denmark',       gosa:85.3, gfr:89.8, trend:'+0.2' },
  { rank:3, flag:'🇦🇪', name:'UAE',           gosa:82.1, gfr:83.8, trend:'+1.4' },
  { rank:4, flag:'🇺🇸', name:'United States', gosa:83.9, gfr:82.6, trend:'-0.1' },
  { rank:5, flag:'🇲🇾', name:'Malaysia',      gosa:81.2, gfr:79.2, trend:'+0.4' },
];

const SIGNALS_TICKER = [
  { grade:'PLATINUM', country:'Malaysia',  title:'FDI cap data centers raised to 100%',       sco:96 },
  { grade:'PLATINUM', country:'UAE',       title:'Microsoft $3.3B AI infrastructure committed',sco:97 },
  { grade:'GOLD',     country:'Thailand',  title:'$2B EV battery subsidy package approved',    sco:95 },
  { grade:'GOLD',     country:'Vietnam',   title:'Electronics exports surge 34% YoY',          sco:92 },
  { grade:'PLATINUM', country:'Saudi Arabia','title':'30-day FDI license guarantee live',       sco:94 },
];

function GradeColor(g: string) {
  return g==='PLATINUM'?'#c39bd3':g==='GOLD'?'#ffd700':'#94a8b3';
}

export default function HomePage() {
  const [activeSignal, setActiveSignal] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const iv = setInterval(() => setActiveSignal(s => (s+1)%SIGNALS_TICKER.length), 3500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight:'100vh', background:'#020c14', fontFamily:"'Inter','Helvetica Neue',sans-serif", overflow:'hidden' }}>
      <NavBar/>

      {/* ══════════════════ HERO ══════════════════════════════════════ */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>
        {/* Animated background grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)', backgroundSize:'64px 64px' }}/>

        {/* Radial glow */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,100,180,0.12) 0%, rgba(0,255,200,0.04) 40%, transparent 70%)' }}/>
        <div style={{ position:'absolute', top:'-20%', right:'-5%', width:'60vw', height:'60vw', background:'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 60%)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-10%', left:'-10%', width:'40vw', height:'40vw', background:'radial-gradient(circle, rgba(0,255,200,0.05) 0%, transparent 60%)', borderRadius:'50%', pointerEvents:'none' }}/>

        {/* Scan line */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(0,255,200,0.6),transparent)', animation:'scanLine 4s ease-in-out infinite' }}/>

        <div style={{ maxWidth:'1540px', margin:'0 auto', padding:'80px 24px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'64px', alignItems:'center', position:'relative', zIndex:2 }}>
          {/* LEFT — text content */}
          <div>
            {/* Status badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', padding:'6px 16px', background:'rgba(0,255,200,0.06)', border:'1px solid rgba(0,255,200,0.2)', borderRadius:'30px', marginBottom:'24px' }}>
              <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#00ffc8', boxShadow:'0 0 10px #00ffc8', animation:'pulse 2s infinite' }}/>
              <span style={{ fontSize:'11px', fontWeight:700, color:'rgba(0,255,200,0.9)', letterSpacing:'0.08em', fontFamily:"'JetBrains Mono',monospace" }}>LIVE · 12,847 INVESTMENT PROFESSIONALS</span>
            </div>

            <h1 style={{ fontSize:'clamp(36px,4.5vw,60px)', fontWeight:900, lineHeight:1.08, marginBottom:'22px', letterSpacing:'-0.02em' }}>
              <span style={{ display:'block', color:'#e8f4f8' }}>The World's Most</span>
              <span style={{ display:'block', color:'#e8f4f8' }}>Advanced</span>
              <span style={{ display:'block', background:'linear-gradient(135deg, #00ffc8, #00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 0 30px rgba(0,255,200,0.4))' }}>FDI Intelligence</span>
              <span style={{ display:'block', color:'#e8f4f8' }}>Platform</span>
            </h1>

            <p style={{ fontSize:'16px', color:'rgba(232,244,248,0.6)', lineHeight:1.8, marginBottom:'36px', maxWidth:'480px' }}>
              GOSA-scored investment intelligence across 215+ economies. Real-time signals, GFR rankings, AI-generated reports — powered by a 6-stage agent pipeline processing 304+ official sources.
            </p>

            {/* CTAs */}
            <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'48px' }}>
              <Link href="/register" style={{ display:'inline-flex', alignItems:'center', gap:'10px', padding:'14px 32px', background:'linear-gradient(135deg, #00ffc8, #00c49a)', color:'#020c14', borderRadius:'8px', textDecoration:'none', fontSize:'14px', fontWeight:800, boxShadow:'0 8px 32px rgba(0,255,200,0.35)', transition:'all 200ms ease', letterSpacing:'0.02em' }}>
                Start Free 7-Day Trial <ArrowRight size={16}/>
              </Link>
              <Link href="/dashboard" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 28px', background:'rgba(232,244,248,0.06)', border:'1px solid rgba(232,244,248,0.15)', borderRadius:'8px', textDecoration:'none', fontSize:'14px', fontWeight:600, color:'rgba(232,244,248,0.85)', transition:'all 200ms ease' }}>
                View Live Dashboard <ChevronRight size={14}/>
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display:'flex', gap:'32px', flexWrap:'wrap' }}>
              {[['215+','Economies','+0','#00ffc8'],['304+','Official Sources','#00d4ff'],['$71B','Top FDI Inflow','#ffd700'],['6','AI Agents','#9b59b6']].map(([v,l,c]:any) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'26px', fontWeight:900, color:c||'#00ffc8', fontFamily:"'JetBrains Mono',monospace", textShadow:`0 0 20px ${c||'#00ffc8'}60` }}>{v}</div>
                  <div style={{ fontSize:'10px', color:'rgba(232,244,248,0.4)', marginTop:'2px', letterSpacing:'0.06em', textTransform:'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Globe + floating cards */}
          <div style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center' }}>
            {mounted && (
              <Globe3D width={520} height={520} onCountryClick={setSelectedCountry}/>
            )}

            {/* Floating signal card */}
            <div style={{ position:'absolute', top:'6%', right:'-5%', padding:'12px 16px', background:'rgba(6,15,26,0.92)', border:'1px solid rgba(0,255,200,0.2)', borderRadius:'10px', backdropFilter:'blur(16px)', width:'200px', boxShadow:'0 8px 32px rgba(0,0,0,0.5)', animation:'float 4s ease-in-out infinite' }}>
              <div style={{ fontSize:'9px', fontWeight:800, color:'rgba(0,255,200,0.6)', letterSpacing:'0.1em', marginBottom:'6px', fontFamily:"'JetBrains Mono',monospace" }}>LATEST SIGNAL</div>
              <div style={{ fontSize:'11px', fontWeight:700, color:GradeColor(SIGNALS_TICKER[activeSignal].grade), marginBottom:'2px' }}>{SIGNALS_TICKER[activeSignal].grade}</div>
              <div style={{ fontSize:'10px', color:'rgba(232,244,248,0.8)', lineHeight:1.5, marginBottom:'6px' }}>{SIGNALS_TICKER[activeSignal].title}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'9px', color:'rgba(232,244,248,0.4)' }}>🇲🇾 {SIGNALS_TICKER[activeSignal].country}</span>
                <span style={{ fontSize:'14px', fontWeight:900, color:'#9b59b6', fontFamily:"'JetBrains Mono',monospace" }}>SCI {SIGNALS_TICKER[activeSignal].sco}</span>
              </div>
            </div>

            {/* Floating GFR card */}
            <div style={{ position:'absolute', bottom:'8%', left:'-8%', padding:'12px 16px', background:'rgba(6,15,26,0.92)', border:'1px solid rgba(255,215,0,0.2)', borderRadius:'10px', backdropFilter:'blur(16px)', width:'180px', boxShadow:'0 8px 32px rgba(0,0,0,0.5)', animation:'float 5s ease-in-out infinite', animationDelay:'-2s' }}>
              <div style={{ fontSize:'9px', fontWeight:800, color:'rgba(255,215,0,0.6)', letterSpacing:'0.1em', marginBottom:'8px', fontFamily:"'JetBrains Mono',monospace" }}>GFR RANKING #1</div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                <span style={{ fontSize:'24px' }}>🇸🇬</span>
                <div>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'#e8f4f8' }}>Singapore</div>
                  <div style={{ fontSize:'10px', color:'rgba(232,244,248,0.4)' }}>Asia Pacific</div>
                </div>
              </div>
              <div style={{ fontSize:'28px', fontWeight:900, color:'#00ffc8', fontFamily:"'JetBrains Mono',monospace", textShadow:'0 0 16px rgba(0,255,200,0.5)' }}>91.2</div>
            </div>

            {/* Country popup */}
            {selectedCountry && (
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', padding:'16px 20px', background:'rgba(6,15,26,0.96)', border:'1px solid rgba(0,255,200,0.3)', borderRadius:'12px', backdropFilter:'blur(20px)', width:'220px', zIndex:10, boxShadow:'0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,200,0.1)' }}>
                <button onClick={()=>setSelectedCountry(null)} style={{ position:'absolute', top:'8px', right:'10px', background:'none', border:'none', color:'rgba(232,244,248,0.4)', cursor:'pointer', fontSize:'16px' }}>×</button>
                <div style={{ fontSize:'9px', color:'rgba(0,255,200,0.5)', letterSpacing:'0.1em', marginBottom:'8px', fontFamily:"'JetBrains Mono',monospace" }}>ECONOMY PROFILE</div>
                <div style={{ fontSize:'20px', fontWeight:800, color:'#e8f4f8', marginBottom:'6px' }}>{selectedCountry.country}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'12px' }}>
                  <div style={{ padding:'8px', background:'rgba(0,255,200,0.05)', borderRadius:'7px' }}>
                    <div style={{ fontSize:'9px', color:'rgba(0,255,200,0.5)' }}>GOSA</div>
                    <div style={{ fontSize:'20px', fontWeight:900, color:'#00ffc8', fontFamily:"'JetBrains Mono',monospace" }}>{selectedCountry.gosa}</div>
                  </div>
                  <div style={{ padding:'8px', background:'rgba(255,215,0,0.05)', borderRadius:'7px' }}>
                    <div style={{ fontSize:'9px', color:'rgba(255,215,0,0.5)' }}>FDI</div>
                    <div style={{ fontSize:'14px', fontWeight:800, color:'#ffd700', fontFamily:"'JetBrains Mono',monospace" }}>{selectedCountry.fdi}</div>
                  </div>
                </div>
                <Link href={`/investment-analysis`} style={{ display:'block', textAlign:'center', padding:'8px', background:'linear-gradient(135deg,#00ffc8,#00c49a)', color:'#020c14', borderRadius:'7px', textDecoration:'none', fontSize:'11px', fontWeight:800 }}>
                  Full Analysis →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', animation:'float 2s ease-in-out infinite' }}>
          <span style={{ fontSize:'10px', color:'rgba(0,255,200,0.4)', letterSpacing:'0.1em', fontFamily:"'JetBrains Mono',monospace" }}>SCROLL</span>
          <div style={{ width:'1px', height:'32px', background:'linear-gradient(180deg,rgba(0,255,200,0.4),transparent)' }}/>
        </div>
      </section>

      {/* ══════════════════ LIVE TICKER ══════════════════════════════ */}
      <div style={{ background:'rgba(6,15,26,0.8)', borderTop:'1px solid rgba(0,255,200,0.1)', borderBottom:'1px solid rgba(0,255,200,0.08)', padding:'10px 0', overflow:'hidden', position:'relative' }}>
        <div style={{ display:'flex', gap:'0', whiteSpace:'nowrap', animation:'ticker 30s linear infinite' }}>
          {[...SIGNALS_TICKER, ...SIGNALS_TICKER, ...SIGNALS_TICKER].map((s,i)=>(
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0 24px', fontSize:'11px', color:'rgba(232,244,248,0.7)', fontFamily:"'JetBrains Mono',monospace" }}>
              <span style={{ color:GradeColor(s.grade), fontWeight:800 }}>{s.grade}</span>
              <span style={{ color:'rgba(232,244,248,0.4)' }}>·</span>
              <span>{s.title}</span>
              <span style={{ color:'rgba(0,255,200,0.6)', fontWeight:700 }}>SCI {s.sco}</span>
              <span style={{ color:'rgba(0,255,200,0.2)', padding:'0 16px' }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════ PLATFORM STATS ═══════════════════════════ */}
      <section style={{ padding:'80px 24px', background:'rgba(6,15,26,0.5)', position:'relative' }}>
        <div style={{ maxWidth:'1540px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
            {[
              {icon:'🌍', v:215, suf:'+', l:'Economies Tracked', sub:'Weekly GOSA updates', c:'#00ffc8'},
              {icon:'📡', v:304, suf:'+', l:'Official Sources', sub:'T1/T2 verified', c:'#00d4ff'},
              {icon:'⚡', v:1847, suf:'', l:'Signals Processed', sub:'Last 7 days', c:'#ffd700'},
              {icon:'👥', v:12847, suf:'', l:'Subscribers', sub:'+124 this week', c:'#9b59b6'},
            ].map(({icon,v,suf,l,sub,c})=>(
              <div key={l} style={{ padding:'28px', background:'rgba(13,29,48,0.6)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'14px', borderTop:`2px solid ${c}`, transition:'all 300ms ease', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, right:0, width:'80px', height:'80px', background:`radial-gradient(circle at top right, ${c}10, transparent)`, pointerEvents:'none' }}/>
                <div style={{ fontSize:'28px', marginBottom:'10px' }}>{icon}</div>
                <div style={{ fontSize:'32px', fontWeight:900, color:c, fontFamily:"'JetBrains Mono',monospace", marginBottom:'4px', textShadow:`0 0 20px ${c}40` }}>
                  <Counter target={v} suffix={suf}/>
                </div>
                <div style={{ fontSize:'14px', fontWeight:700, color:'rgba(232,244,248,0.8)', marginBottom:'4px' }}>{l}</div>
                <div style={{ fontSize:'11px', color:'rgba(232,244,248,0.35)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════════════════════ */}
      <section style={{ padding:'100px 24px', position:'relative' }}>
        <div style={{ maxWidth:'1540px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'64px' }}>
            <div style={{ fontSize:'11px', fontWeight:800, color:'rgba(0,255,200,0.6)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'12px', fontFamily:"'Orbitron','Inter',sans-serif" }}>PLATFORM CAPABILITIES</div>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,44px)', fontWeight:900, color:'#e8f4f8', marginBottom:'14px', lineHeight:1.15 }}>
              Everything for FDI Intelligence
            </h2>
            <p style={{ fontSize:'16px', color:'rgba(232,244,248,0.5)', maxWidth:'520px', margin:'0 auto', lineHeight:1.7 }}>
              Purpose-built for investment professionals, governments, and economic development organizations worldwide.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
            {FEATURES.map(({icon,color,title,desc},i)=>(
              <div key={title} style={{ padding:'30px', background:'rgba(13,29,48,0.7)', border:`1px solid rgba(255,255,255,0.05)`, borderRadius:'14px', position:'relative', overflow:'hidden', transition:'all 300ms ease', cursor:'default' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}30`;e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow=`0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px ${color}20`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.05)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                <div style={{ position:'absolute', top:0, right:0, width:'120px', height:'120px', background:`radial-gradient(circle at top right, ${color}08, transparent)`, pointerEvents:'none' }}/>
                <div style={{ width:'52px', height:'52px', borderRadius:'13px', background:`${color}10`, border:`1px solid ${color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', marginBottom:'18px' }}>{icon}</div>
                <h3 style={{ fontSize:'17px', fontWeight:800, color:'#e8f4f8', marginBottom:'10px' }}>{title}</h3>
                <p style={{ fontSize:'13px', color:'rgba(232,244,248,0.5)', lineHeight:1.75 }}>{desc}</p>
                <div style={{ marginTop:'18px', fontSize:'12px', fontWeight:600, color:color, display:'flex', alignItems:'center', gap:'5px' }}>
                  Learn more <ChevronRight size={12}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ RANKINGS PREVIEW ═══════════════════════════ */}
      <section style={{ padding:'80px 24px', background:'rgba(4,10,20,0.8)', position:'relative' }}>
        <div style={{ maxWidth:'1540px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'64px', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'11px', fontWeight:800, color:'rgba(255,215,0,0.6)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'12px', fontFamily:"'Orbitron','Inter',sans-serif" }}>GFR RANKING PREVIEW</div>
            <h2 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:900, color:'#e8f4f8', marginBottom:'14px', lineHeight:1.2 }}>
              Comparable to IMD WCR,<br/>Kearney GCR, World Happiness
            </h2>
            <p style={{ fontSize:'15px', color:'rgba(232,244,248,0.5)', marginBottom:'32px', lineHeight:1.75 }}>
              Our Global Future Readiness Ranking covers 25 economies across 6 dimensions — Economic & Trade Resilience, Innovation, Trade & Capital Mobility, Digital Frontier, Sustainable Growth, and Governance.
            </p>
            <Link href="/gfr" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 26px', background:'rgba(255,215,0,0.08)', border:'1px solid rgba(255,215,0,0.25)', borderRadius:'8px', textDecoration:'none', fontSize:'13px', fontWeight:700, color:'#ffd700' }}>
              View Full GFR Ranking <ArrowRight size={14}/>
            </Link>
          </div>
          <div>
            {RANKINGS_PREVIEW.map((c,i)=>(
              <div key={c.name} style={{ display:'flex', alignItems:'center', gap:'16px', padding:'14px 18px', background:i===0?'rgba(255,215,0,0.05)':'rgba(13,29,48,0.5)', border:`1px solid ${i===0?'rgba(255,215,0,0.2)':'rgba(255,255,255,0.04)'}`, borderRadius:'10px', marginBottom:'8px', transition:'all 200ms ease' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:`${i===0?'rgba(255,215,0,0.15)':'rgba(255,255,255,0.06)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'13px', color:i===0?'#ffd700':'rgba(232,244,248,0.5)', fontFamily:"'JetBrains Mono',monospace" }}>{c.rank}</div>
                <span style={{ fontSize:'24px' }}>{c.flag}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'#e8f4f8' }}>{c.name}</div>
                  <div style={{ fontSize:'10px', color:'rgba(232,244,248,0.4)' }}>GOSA {c.gosa}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'20px', fontWeight:900, color:'#00ffc8', fontFamily:"'JetBrains Mono',monospace" }}>{c.gfr}</div>
                  <div style={{ fontSize:'10px', color:c.trend.startsWith('+')?'#00ffc8':'#ff4466', fontWeight:700 }}>{c.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ PLATFORM NAVIGATION CARDS ════════════════ */}
      <section style={{ padding:'80px 24px', position:'relative' }}>
        <div style={{ maxWidth:'1540px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:900, color:'#e8f4f8', marginBottom:'10px' }}>Explore the Platform</h2>
            <p style={{ fontSize:'14px', color:'rgba(232,244,248,0.45)' }}>Navigate to any section of the intelligence platform</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px' }}>
            {[
              {href:'/dashboard',emoji:'📊',title:'Dashboard',desc:'7 live HUD widgets',color:'#00ffc8'},
              {href:'/investment-analysis',emoji:'🌍',title:'Investment Analysis',desc:'15 economies · 4 tabs',color:'#00d4ff'},
              {href:'/signals',emoji:'⚡',title:'Market Signals',desc:'Live PLATINUM/GOLD feed',color:'#ffd700'},
              {href:'/gfr',emoji:'🏆',title:'GFR Ranking',desc:'6-dimension · 25 economies',color:'#9b59b6'},
              {href:'/reports',emoji:'📄',title:'PDF Reports',desc:'4-page AI intelligence',color:'#e67e22'},
              {href:'/pmp',emoji:'🎯',title:'Mission Planning',desc:'4 guided workflows',color:'#ff4466'},
              {href:'/sources',emoji:'📡',title:'Data Sources',desc:'304+ official sources',color:'#00d4ff'},
              {href:'/api-docs',emoji:'🔌',title:'API Access',desc:'REST + WebSocket',color:'#00ffc8'},
            ].map(({href,emoji,title,desc,color})=>(
              <Link key={href} href={href} style={{ padding:'22px', background:'rgba(13,29,48,0.7)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'12px', textDecoration:'none', display:'flex', flexDirection:'column', gap:'8px', transition:'all 250ms ease', position:'relative', overflow:'hidden' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}30`;e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}15`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.05)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                <div style={{ position:'absolute', top:0, right:0, width:'60px', height:'60px', background:`radial-gradient(circle at top right, ${color}08, transparent)` }}/>
                <span style={{ fontSize:'28px' }}>{emoji}</span>
                <span style={{ fontSize:'13px', fontWeight:700, color:'#e8f4f8' }}>{title}</span>
                <span style={{ fontSize:'11px', color:`${color}80` }}>{desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════════════════════════ */}
      <section style={{ padding:'100px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,100,140,0.12), transparent)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:'800px', margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(0,255,200,0.08)', border:'1px solid rgba(0,255,200,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:'28px' }}>🚀</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#e8f4f8', marginBottom:'16px', lineHeight:1.2 }}>
            Ready to access global<br/><span style={{ background:'linear-gradient(135deg, #00ffc8, #00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FDI intelligence?</span>
          </h2>
          <p style={{ fontSize:'16px', color:'rgba(232,244,248,0.5)', marginBottom:'36px', lineHeight:1.7 }}>Start your free 7-day trial. No credit card required. Full access to all platform features.</p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/register" style={{ padding:'14px 36px', background:'linear-gradient(135deg, #00ffc8, #00c49a)', color:'#020c14', borderRadius:'9px', textDecoration:'none', fontSize:'15px', fontWeight:800, boxShadow:'0 8px 32px rgba(0,255,200,0.35)' }}>
              Start Free Trial — 7 Days
            </Link>
            <Link href="/contact?plan=enterprise" style={{ padding:'14px 28px', border:'1px solid rgba(232,244,248,0.15)', color:'rgba(232,244,248,0.8)', borderRadius:'9px', textDecoration:'none', fontSize:'15px', fontWeight:600 }}>
              Enterprise Sales
            </Link>
          </div>
          <p style={{ fontSize:'12px', color:'rgba(232,244,248,0.3)', marginTop:'18px' }}>Professional: $9,588/year · Enterprise: Custom pricing · info@fdimonitor.org</p>
        </div>
      </section>

      <Footer/>

      <style>{`
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,255,200,0.4)}50%{box-shadow:0 0 0 8px rgba(0,255,200,0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        @keyframes scanLine{0%{top:0;opacity:1}70%{opacity:1}100%{top:100%;opacity:0}}
      `}</style>
    </div>
  );
}
