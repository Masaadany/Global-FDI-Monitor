'use client'
import Link from 'next/link'
import { Globe3D } from '@/components/hero/Globe3D'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ArrowRight, Zap, Globe, Shield, TrendingUp, BarChart3 } from 'lucide-react'

function AnimatedCounter({ target, suffix='' }:{ target:number; suffix?:string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
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
  {grade:'PLATINUM',type:'POLICY',  code:'MY',country:'Malaysia',   title:'FDI cap in data centers raised to 100%',sco:96,ts:'2m'},
  {grade:'PLATINUM',type:'DEAL',    code:'AE',country:'UAE',         title:'Microsoft $3.3B AI commitment',          sco:97,ts:'1h'},
  {grade:'PLATINUM',type:'INCENTIVE',code:'TH',country:'Thailand',  title:'$2B EV battery subsidy approved',         sco:95,ts:'3h'},
  {grade:'GOLD',    type:'POLICY',  code:'SA',country:'Saudi Arabia','title':'30-day FDI license guarantee',           sco:94,ts:'6h'},
  {grade:'GOLD',    type:'GROWTH',  code:'VN',country:'Vietnam',     title:'Electronics exports surge 34% YoY',       sco:92,ts:'1d'},
]

const FEATURES = [
  {icon:<Globe size={22} className="text-primary-teal"/>,title:'GOSA Intelligence',desc:'4-layer composite scoring across 215+ economies using 1000+ official sources.',link:'/investment-analysis'},
  {icon:<Zap size={22} className="text-primary-teal"/>,title:'Real-Time Signals',desc:'PLATINUM, GOLD and SILVER signals delivered every 2 seconds via WebSocket.',link:'/signals'},
  {icon:<BarChart3 size={22} className="text-primary-teal"/>,title:'GFR Ranking',desc:'6-dimension composite ranking comparable to IMD WCR and Kearney GCR.',link:'/gfr'},
  {icon:<Shield size={22} className="text-primary-teal"/>,title:'SHA-256 Verified',desc:'Every signal hash-verified through AGT-03. No unverified data reaches the platform.',link:'/sources'},
  {icon:<TrendingUp size={22} className="text-primary-teal"/>,title:'Corridor Intel',desc:'12 active bilateral FDI corridors with flow data and sector mapping.',link:'/corridors'},
  {icon:<ArrowRight size={22} className="text-primary-teal"/>,title:'Scenario Planner',desc:'What-if IRR and NPV modelling with up to 4 scenarios compared.',link:'/scenario-planner'},
]

export default function HomePage() {
  return (
    <div>
      <BackgroundVideo/>

      {/* ── HERO ── */}
      <section className="relative bg-white border-b border-border-light pb-16 overflow-hidden">
        <div className="max-w-[1540px] mx-auto px-6 pt-10">
          <div className="text-center mb-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{background:'rgba(46,204,113,0.1)',border:'1px solid rgba(46,204,113,0.25)'}}>
              <div className="w-2 h-2 rounded-full bg-primary-teal animate-pulse"/>
              <span className="text-sm font-semibold text-green-700">Live · 2-second updates · 1000+ verified sources</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-primary-dark leading-tight mb-5" style={{letterSpacing:'-0.02em'}}>
              Global Investment Intelligence.<br/>
              <span className="text-primary-teal">Real-Time. Verified. Smart.</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
              The world's most advanced FDI intelligence platform. GOSA-scored intelligence across 215+ economies.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                Explore Dashboard <ChevronRight size={16}/>
              </Link>
              <Link href="/signals" className="btn-outline flex items-center gap-2 text-base px-8 py-3">
                <Zap size={15} className="text-primary-teal"/> View Signals
              </Link>
              <Link href="/investment-analysis" className="flex items-center gap-2 text-base px-8 py-3 rounded-full font-medium text-green-700 transition-all"
                style={{background:'rgba(46,204,113,0.1)',border:'1px solid rgba(46,204,113,0.25)'}}>
                Investment Analysis <ArrowRight size={15}/>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 py-6 border-t border-b border-border-light mb-8 flex-wrap">
            {[['215+','Economies'],['1000+','Official Sources'],['2s','Update Frequency']].map(([v,l])=>(
              <div key={l} className="text-center">
                <div className="text-2xl font-black text-primary-dark font-mono">{v}</div>
                <div className="text-sm text-text-secondary font-medium mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          {/* Globe */}
          <div className="floating-card !p-5 !rounded-3xl" style={{animation:'fadeIn 0.8s ease 0.3s both',opacity:0}}>
            <div className="text-xs font-bold text-text-secondary uppercase tracking-widest text-center mb-3">
              Global Opportunity Map — Click any economy to explore
            </div>
            <Globe3D />
          </div>
        </div>
      </section>

      {/* ── LIVE SIGNALS STRIP ── */}
      <section className="bg-primary-dark py-12">
        <div className="max-w-[1540px] mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="section-label opacity-70">LIVE INTELLIGENCE</div>
              <h2 className="text-2xl font-black text-white">Latest Investment Signals</h2>
            </div>
            <Link href="/signals" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-primary-teal"
              style={{background:'rgba(46,204,113,0.12)',border:'1px solid rgba(46,204,113,0.25)'}}>
              Full Feed <ArrowRight size={13}/>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {LIVE_SIGNALS.map((sig,i)=>{
              const gc=sig.grade==='PLATINUM'?'#9B59B6':'#F1C40F'
              return (
                <div key={i} className="p-4 rounded-2xl border transition-all hover:-translate-y-1"
                  style={{background:'rgba(255,255,255,0.05)',borderColor:'rgba(255,255,255,0.08)'}}>
                  <div className="flex justify-between mb-3">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{background:`${gc}20`,color:gc}}>{sig.grade}</span>
                    <span className="text-[9px] text-white/30 font-mono">{sig.ts} ago</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CountryFlag code={sig.code} size={18}/>
                    <span className="text-xs font-bold text-white/70">{sig.country}</span>
                  </div>
                  <div className="text-xs text-white/80 leading-snug font-medium">{sig.title}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-background-offwhite">
        <div className="max-w-[1540px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label">PLATFORM CAPABILITIES</div>
            <h2 className="text-4xl font-black text-primary-dark">Everything you need for FDI intelligence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f,i)=>(
              <Link key={f.title} href={f.link} className="floating-card group block"
                style={{animationDelay:`${i*80}ms`}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{background:'rgba(46,204,113,0.1)'}}>
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

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1540px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label">TRUSTED BY</div>
            <h2 className="text-4xl font-black text-primary-dark">Used by 12,847 investment professionals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {q:'"The GOSA scoring gives us a single comparable metric across markets. We use it every Monday morning."',name:'Head of Investment Strategy',org:'Southeast Asian Sovereign Wealth Fund',flag:'SG'},
              {q:'"GFR Ranking is now part of our annual competitiveness assessment. Comparable to IMD and Kearney, but with live data."',name:'Director of FDI Policy',org:'Middle East Investment Promotion Agency',flag:'AE'},
              {q:'"We evaluated 11 locations in 6 countries. The Benchmark Tool saved 3 weeks of analyst time."',name:'VP Corporate Development',org:'European Manufacturing Group',flag:'DE'},
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
          {/* Animated counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{val:12847,suf:'',label:'Active Users'},{val:1000,suf:'+',label:'Verified Sources'},{val:215,suf:'+',label:'Economies'},{val:23,suf:'',label:'Country Profiles'}].map(({val,suf,label})=>(
              <div key={label} className="floating-card text-center !py-6">
                <AnimatedCounter target={val} suffix={suf}/>
                <div className="text-sm text-text-secondary mt-2 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary-dark text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black text-white mb-4">Start tracking global investment opportunities</h2>
          <p className="text-white/55 text-lg mb-8 leading-relaxed">Join investment professionals using Global FDI Monitor for real-time intelligence.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register" className="flex items-center gap-2 px-9 py-3.5 rounded-full font-black text-white text-base"
              style={{background:'#2ECC71',boxShadow:'0 4px 20px rgba(46,204,113,0.4)'}}>
              Create Account <ChevronRight size={16}/>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-9 py-3.5 rounded-full font-semibold text-white text-base"
              style={{background:'rgba(255,255,255,0.08)',border:'1.5px solid rgba(255,255,255,0.15)'}}>
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        [style*="animation:fadeIn"] { animation: fadeIn 0.8s ease 0.3s both !important; }
      `}</style>
    </div>
  )
}
