'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ArrowRight, Zap, Globe, Shield, TrendingUp, BarChart3 } from 'lucide-react'

// Load Globe dynamically (WebGL needs browser)
const Globe3D = dynamic(() => import('@/components/hero/Globe3D').then(m=>({ default:m.Globe3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center" style={{aspectRatio:'16/9',maxHeight:'520px',background:'linear-gradient(135deg,#0d1f35,#1a3a5c)',borderRadius:'20px'}}>
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-green-400 rounded-full border-t-transparent animate-spin mx-auto mb-3"/>
        <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',fontFamily:'Inter,sans-serif'}}>Loading 3D Globe…</div>
      </div>
    </div>
  )
})

function AnimatedCounter({ target, suffix='' }: { target:number; suffix?:string }) {
  const [count,setCount]=useState(0)
  const ref=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        let s=0; const step=target/50
        const t=setInterval(()=>{ s+=step; if(s>=target){setCount(target);clearInterval(t)}else setCount(Math.floor(s)) },20)
      }
    },{threshold:0.5})
    if(ref.current)obs.observe(ref.current)
    return ()=>obs.disconnect()
  },[target])
  return <div ref={ref} className="font-mono font-black text-4xl text-primary-dark">{count.toLocaleString()}{suffix}</div>
}

const LIVE_SIGNALS = [
  {grade:'PLATINUM',code:'MY',country:'Malaysia',   title:'FDI cap in data centers raised to 100%',sco:96,ts:'2m'},
  {grade:'PLATINUM',code:'AE',country:'UAE',         title:'Microsoft $3.3B AI commitment',          sco:97,ts:'1h'},
  {grade:'PLATINUM',code:'TH',country:'Thailand',   title:'$2B EV battery subsidy approved',         sco:95,ts:'3h'},
  {grade:'GOLD',    code:'SA',country:'Saudi Arabia','title':'30-day FDI license guarantee live',      sco:94,ts:'6h'},
  {grade:'GOLD',    code:'VN',country:'Vietnam',     title:'Electronics exports surge 34% YoY',       sco:92,ts:'1d'},
]

const FEATURES = [
  {icon:<Globe size={22}/>,    title:'GOSA Intelligence',   desc:'4-layer composite scoring across 215+ economies using 1000+ official sources.',link:'/investment-analysis'},
  {icon:<Zap size={22}/>,      title:'Real-Time Signals',   desc:'PLATINUM, GOLD and SILVER signals delivered every 2 seconds, SHA-256 verified.',link:'/signals'},
  {icon:<BarChart3 size={22}/>,title:'GFR Ranking',         desc:'6-dimension composite ranking comparable to IMD WCR and Kearney GCR.',link:'/gfr'},
  {icon:<Shield size={22}/>,   title:'Verified Intelligence',desc:'Every signal hash-verified through AGT-03. No unverified data reaches the platform.',link:'/sources'},
  {icon:<TrendingUp size={22}/>,title:'Corridor Intelligence',desc:'12 active bilateral FDI corridors with flow data and sector mapping.',link:'/corridors'},
  {icon:<ArrowRight size={22}/>,title:'Scenario Planner',   desc:'What-if IRR and NPV modelling with up to 4 scenarios compared side-by-side.',link:'/scenario-planner'},
]

export default function HomePage() {
  return (
    <div>
      {/* ── CINEMATIC DARK HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{background:'linear-gradient(135deg,#060d18 0%,#0d1f35 50%,#0a1628 100%)',minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'linear-gradient(rgba(46,204,113,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(46,204,113,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(26,60,110,0.4) 0%, transparent 70%)'}}/>

        <div className="max-w-[1540px] mx-auto px-6 pt-24 pb-8 relative z-10 w-full">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)'}}>
              <div className="w-2 h-2 rounded-full bg-green-400" style={{animation:'pulseGreen 1.5s infinite',boxShadow:'0 0 8px #2ECC71'}}/>
              <span style={{fontSize:'12px',fontWeight:700,color:'rgba(46,204,113,0.9)',fontFamily:'Inter,sans-serif',letterSpacing:'0.04em'}}>
                Live · 2-second updates · 1000+ verified sources · SHA-256 provenance
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h1 style={{fontSize:'clamp(36px,5vw,68px)',fontWeight:900,color:'#FFFFFF',lineHeight:1.08,letterSpacing:'-0.03em',marginBottom:'20px',fontFamily:'Inter,sans-serif'}}>
              Global Investment Intelligence.<br/>
              <span style={{color:'#2ECC71'}}>Real-Time. Verified. Smart.</span>
            </h1>
            <p style={{fontSize:'18px',color:'rgba(255,255,255,0.5)',maxWidth:'560px',margin:'0 auto 32px',lineHeight:1.7,fontFamily:'Inter,sans-serif'}}>
              The world's most advanced FDI intelligence platform. GOSA-scored intelligence across 215+ economies, powered by 6 AI agents.
            </p>
            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dashboard" style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 32px',borderRadius:'50px',background:'#2ECC71',color:'white',textDecoration:'none',fontSize:'15px',fontWeight:800,boxShadow:'0 4px 24px rgba(46,204,113,0.35)',fontFamily:'Inter,sans-serif',transition:'all 0.2s'}}
                onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-2px)';(e.currentTarget as any).style.boxShadow='0 8px 32px rgba(46,204,113,0.45)'}}
                onMouseLeave={e=>{(e.currentTarget as any).style.transform='none';(e.currentTarget as any).style.boxShadow='0 4px 24px rgba(46,204,113,0.35)'}}>
                Explore Dashboard <ChevronRight size={16}/>
              </Link>
              <Link href="/signals" style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 32px',borderRadius:'50px',background:'rgba(255,255,255,0.06)',color:'white',textDecoration:'none',fontSize:'15px',fontWeight:600,border:'1px solid rgba(255,255,255,0.12)',fontFamily:'Inter,sans-serif',backdropFilter:'blur(6px)'}}>
                <Zap size={15} color="#2ECC71"/> View Signals
              </Link>
              <Link href="/investment-analysis" style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 32px',borderRadius:'50px',background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.75)',textDecoration:'none',fontSize:'15px',fontWeight:600,border:'1px solid rgba(255,255,255,0.08)',fontFamily:'Inter,sans-serif'}}>
                Investment Analysis <ArrowRight size={15}/>
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-10 mb-8 flex-wrap">
            {[['215+','Economies'],['1,000+','Official Sources'],['2s','Update Frequency'],['6','AI Agents']].map(([v,l])=>(
              <div key={l} className="text-center">
                <div style={{fontSize:'24px',fontWeight:900,color:'#FFFFFF',fontFamily:'JetBrains Mono,monospace',lineHeight:1}}>{v}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',fontFamily:'Inter,sans-serif',marginTop:'3px',fontWeight:500,letterSpacing:'0.03em'}}>{l}</div>
              </div>
            ))}
          </div>

          {/* ── 3D WEBGL GLOBE ── */}
          <div style={{background:'linear-gradient(135deg,#060d18,#0d1f35)',borderRadius:'24px',padding:'4px',border:'1px solid rgba(46,204,113,0.12)',boxShadow:'0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)'}}>
            <div style={{borderRadius:'20px',overflow:'hidden',position:'relative'}}>
              <Globe3D/>
            </div>
          </div>

          {/* Caption */}
          <p style={{textAlign:'center',marginTop:'12px',fontSize:'11px',color:'rgba(255,255,255,0.2)',fontFamily:'Inter,sans-serif',letterSpacing:'0.04em'}}>
            INTERACTIVE 3D GLOBE · CLICK ANY ECONOMY · DRAG TO ROTATE · {19} ECONOMIES TRACKED
          </p>
        </div>
      </section>

      {/* ── LIVE SIGNALS STRIP ──────────────────────────────────────────── */}
      <section style={{background:'#1A2C3E',padding:'48px 24px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="max-w-[1540px] mx-auto">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <div style={{fontSize:'10px',fontWeight:800,color:'rgba(46,204,113,0.6)',letterSpacing:'0.2em',marginBottom:'4px',textTransform:'uppercase',fontFamily:'Inter,sans-serif'}}>LIVE INTELLIGENCE</div>
              <h2 style={{fontSize:'22px',fontWeight:900,color:'#FFFFFF',fontFamily:'Inter,sans-serif'}}>Latest Investment Signals</h2>
            </div>
            <Link href="/signals" style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 18px',background:'rgba(46,204,113,0.1)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'50px',textDecoration:'none',fontSize:'12px',fontWeight:700,color:'#2ECC71',fontFamily:'Inter,sans-serif'}}>
              Full Feed <ArrowRight size={13}/>
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-4" style={{gridTemplateColumns:'repeat(5,1fr)'}}>
            {LIVE_SIGNALS.map((sig,i)=>{
              const gc=sig.grade==='PLATINUM'?'#9B59B6':'#F1C40F'
              return (
                <div key={i} style={{background:'rgba(255,255,255,0.04)',borderRadius:'16px',padding:'16px',border:'1px solid rgba(255,255,255,0.07)',transition:'all 0.2s'}}
                  onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,0.07)';(e.currentTarget as any).style.transform='translateY(-3px)'}}
                  onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,0.04)';(e.currentTarget as any).style.transform='none'}}>
                  <div className="flex justify-between mb-3">
                    <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:`${gc}18`,color:gc,letterSpacing:'0.05em'}}>{sig.grade}</span>
                    <span style={{fontSize:'9px',color:'rgba(255,255,255,0.25)',fontFamily:'JetBrains Mono,monospace'}}>{sig.ts} ago</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CountryFlag code={sig.code} size={18}/>
                    <span style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.65)',fontFamily:'Inter,sans-serif'}}>{sig.country}</span>
                  </div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',lineHeight:1.45,fontWeight:500,fontFamily:'Inter,sans-serif'}}>{sig.title}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{background:'#F8F9FA'}}>
        <div className="max-w-[1540px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label">PLATFORM CAPABILITIES</div>
            <h2 className="text-4xl font-black text-primary-dark">Everything you need for FDI intelligence</h2>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {FEATURES.map((f,i)=>(
              <Link key={f.title} href={f.link} className="floating-card group block">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{background:'rgba(46,204,113,0.1)',color:'#2ECC71'}}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-black text-primary-dark mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{f.desc}</p>
                <span className="text-sm font-bold text-primary-teal flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={14}/>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1540px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label">TRUSTED BY</div>
            <h2 className="text-4xl font-black text-primary-dark">Used by 12,847 investment professionals</h2>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-12">
            {[
              {q:'"The GOSA scoring gives us a single comparable metric across markets. We use it every Monday morning."',name:'Head of Investment Strategy',org:'Southeast Asian Sovereign Wealth Fund',flag:'SG'},
              {q:'"GFR Ranking is now part of our annual competitiveness assessment. Comparable to IMD and Kearney, but with live data."',name:'Director of FDI Policy',org:'Middle East Investment Promotion Agency',flag:'AE'},
              {q:'"We evaluated 11 locations in 6 countries. The Export Report tool saved 3 weeks of analyst time."',name:'VP Corporate Development',org:'European Manufacturing Group',flag:'DE'},
            ].map(({q,name,org,flag})=>(
              <div key={name} className="floating-card">
                <div className="text-4xl text-primary-teal font-serif mb-3">"</div>
                <p className="text-sm text-text-primary leading-relaxed mb-5 italic">{q}</p>
                <div className="flex items-center gap-3">
                  <CountryFlag code={flag} size={22}/>
                  <div>
                    <div className="text-sm font-bold text-primary-dark">{name}</div>
                    <div className="text-xs text-primary-teal">{org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[{val:12847,suf:'',label:'Active Users'},{val:1000,suf:'+',label:'Verified Sources'},{val:215,suf:'+',label:'Economies'},{val:23,suf:'',label:'Country Profiles'}].map(({val,suf,label})=>(
              <div key={label} className="floating-card text-center !py-6">
                <AnimatedCounter target={val} suffix={suf}/>
                <div className="text-sm text-text-secondary mt-2 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 text-center" style={{background:'linear-gradient(135deg,#1A2C3E,#0d1f35)'}}>
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black text-white mb-4">Start tracking global investment opportunities</h2>
          <p className="text-white/55 text-lg mb-8 leading-relaxed">Join investment professionals using Global FDI Monitor for real-time intelligence.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register" style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 36px',borderRadius:'50px',background:'#2ECC71',color:'white',textDecoration:'none',fontSize:'15px',fontWeight:800,boxShadow:'0 4px 20px rgba(46,204,113,0.4)',fontFamily:'Inter,sans-serif'}}>
              Create Account <ChevronRight size={16}/>
            </Link>
            <Link href="/dashboard" style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 36px',borderRadius:'50px',background:'rgba(255,255,255,0.07)',color:'white',textDecoration:'none',fontSize:'15px',fontWeight:600,border:'1.5px solid rgba(255,255,255,0.12)',fontFamily:'Inter,sans-serif'}}>
              Explore Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
