'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'

const Globe3D = dynamic(
  () => import('@/components/hero/Globe3D').then(m => ({ default: m.Globe3D })),
  {
    ssr: false,
    loading: () => (
      <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:56,height:56,border:'1.5px solid rgba(46,204,113,0.35)',borderRadius:'50%',
          borderTopColor:'transparent',animation:'spin 0.9s linear infinite',margin:'0 auto'}}/>
      </div>
    ),
  }
)

// ── Rotating quotes ──────────────────────────────────────────────
const QUOTES = [
  { text: 'Transforming global investment live data into strategic foresight and direction.',        accent: '#2ECC71' },
  { text: 'Where global investment flows meet intelligence\nto shape future-ready decisions.',       accent: '#3498DB' },
  { text: 'Decoding global investment movements\nto unlock sustainable competitive advantage.',      accent: '#9B59B6' },
  { text: 'Empowering organizations with actionable insights\nto advance the global investment landscape.', accent: '#E8C84A' },
  { text: 'Enabling data-driven investment strategies\nto strengthen global competitiveness.',       accent: '#E74C3C' },
  { text: 'Harnessing real-time global investment data\nto drive timely and informed strategic action.', accent: '#27ae60' },
]

export default function HomePage() {
  const [activeIdx, setActiveIdx]   = useState(0)
  const [phase,     setPhase]       = useState<'in'|'hold'|'out'>('in')
  const [globeReady, setGlobeReady] = useState(false)

  // Hide layout chrome
  useEffect(() => {
    const h = document.getElementById('site-header')
    const f = document.getElementById('site-footer')
    if (h) h.style.display = 'none'
    if (f) f.style.display = 'none'
    const t = setTimeout(() => setGlobeReady(true), 80)
    return () => {
      clearTimeout(t)
      if (h) h.style.display = ''
      if (f) f.style.display = ''
    }
  }, [])

  // Cycle quotes: in(900ms) → hold(2200ms) → out(700ms) → next
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (phase === 'in') {
      timer = setTimeout(() => setPhase('hold'), 900)
    } else if (phase === 'hold') {
      timer = setTimeout(() => setPhase('out'), 2200)
    } else {
      timer = setTimeout(() => {
        setActiveIdx(i => (i + 1) % QUOTES.length)
        setPhase('in')
      }, 700)
    }
    return () => clearTimeout(timer)
  }, [phase])

  const q     = QUOTES[activeIdx]
  const lines = q.text.split('\n')

  // Phase → CSS values
  const ty   = phase === 'in' ? '0px'   : phase === 'hold' ? '0px'   : '-22px'
  const op   = phase === 'in' ? 1       : phase === 'hold' ? 1       : 0
  const blur = phase === 'in' ? '0px'   : phase === 'hold' ? '0px'   : '6px'
  const sc   = phase === 'in' ? '1'     : phase === 'hold' ? '1'     : '0.97'
  const dur  = phase === 'in' ? '0.9s'  : phase === 'out'  ? '0.65s' : '0s'
  const ease = phase === 'in' ? 'cubic-bezier(0.16,1,0.3,1)' : 'cubic-bezier(0.4,0,1,1)'

  return (
    <div style={{position:'fixed',inset:0,overflow:'hidden',fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif"}}>

      {/* ── Deep cinematic background ────────────────────────── */}
      <div style={{position:'absolute',inset:0,zIndex:0,
        background:'radial-gradient(ellipse 170% 140% at 60% 55%, #0b1a30 0%, #060f1c 45%, #020810 100%)'}}/>
      <div style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(46,204,113,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(46,204,113,0.015) 1px,transparent 1px)',
        backgroundSize:'72px 72px'}}/>
      {/* Nebula glow */}
      <div style={{position:'absolute',right:'-5%',top:'-10%',width:'80%',height:'120%',zIndex:1,pointerEvents:'none',
        background:'radial-gradient(ellipse 65% 60% at 58% 52%, rgba(16,52,136,0.22) 0%, transparent 70%)'}}/>
      {/* Brand glow */}
      <div style={{position:'absolute',right:'10%',top:'20%',width:'50%',height:'60%',zIndex:1,pointerEvents:'none',
        background:`radial-gradient(ellipse at 55% 50%, ${q.accent}08 0%, transparent 65%)`,
        transition:`background 1.5s ease`}}/>
      {/* Vignette */}
      <div style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none',
        background:'radial-gradient(ellipse 115% 115% at 50% 50%, transparent 35%, rgba(2,8,16,0.65) 100%)'}}/>
      {/* Top fade */}
      <div style={{position:'absolute',left:0,right:0,top:0,height:'28%',zIndex:4,pointerEvents:'none',
        background:'linear-gradient(180deg,rgba(2,8,16,0.82) 0%,rgba(2,8,16,0.3) 55%,transparent 100%)'}}/>
      {/* Bottom fade */}
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:'22%',zIndex:4,pointerEvents:'none',
        background:'linear-gradient(0deg,rgba(2,8,16,0.82) 0%,transparent 100%)'}}/>

      {/* ── FULL-SCREEN GLOBE ────────────────────────────────── */}
      <div style={{position:'absolute',inset:0,top:'6%',zIndex:3}}>
        {globeReady && <Globe3D/>}
      </div>

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav style={{position:'absolute',top:0,left:0,right:0,height:64,
        display:'flex',alignItems:'center',padding:'0 36px',zIndex:60}}>

        {/* Logo — left */}
        <Link href="/" style={{textDecoration:'none',flexShrink:0}}>
          <div style={{display:'flex',flexDirection:'column',lineHeight:1}}>
            <span style={{fontSize:20,fontWeight:900,color:'#fff',letterSpacing:'-0.03em'}}>FDI</span>
            <span style={{fontSize:8.5,fontWeight:700,color:'rgba(255,255,255,0.36)',letterSpacing:'0.28em',textTransform:'uppercase',marginTop:2}}>MONITOR</span>
          </div>
        </Link>

        {/* Nav — absolute center */}
        <div style={{position:'absolute',left:'50%',transform:'translateX(-50%)',display:'flex',gap:2}}>
          {[['About Us','/about'],['Features','/dashboard'],['Contact Us','/contact']].map(([l,h])=>(
            <Link key={l} href={h} style={{padding:'7px 17px',fontSize:13,fontWeight:500,
              color:'rgba(255,255,255,0.48)',textDecoration:'none',borderRadius:7,
              letterSpacing:'0.015em',transition:'color 0.18s'}}
              onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.9)'}}
              onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.48)'}}>
              {l}
            </Link>
          ))}
        </div>

        {/* Auth — right */}
        <div style={{marginLeft:'auto',display:'flex',gap:6}}>
          <Link href="/auth/login" style={{padding:'7px 14px',fontSize:13,fontWeight:500,
            color:'rgba(255,255,255,0.42)',textDecoration:'none',borderRadius:7,transition:'color 0.15s'}}
            onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.88)'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.42)'}}>
            Sign In
          </Link>
          <Link href="/register" style={{padding:'7px 17px',fontSize:13,fontWeight:600,
            color:'rgba(255,255,255,0.8)',textDecoration:'none',
            background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.11)',
            borderRadius:7,transition:'background 0.15s'}}
            onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,0.13)'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,0.07)'}}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════
          CENTRAL HERO CONTENT — logo + rotating quote + CTAs
          All layered OVER the globe
          ════════════════════════════════════════════════════════ */}
      <div style={{
        position:'absolute',inset:0,zIndex:50,
        display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',
        pointerEvents:'none',
        textAlign:'center',
        padding:'72px 24px 40px',
        gap:0,
      }}>

        {/* ── BIG CENTRAL LOGO — FDI / MONITOR ── */}
        <div style={{
          marginBottom:32,
          pointerEvents:'auto',
          opacity: globeReady ? 1 : 0,
          transform: globeReady ? 'translateY(0)' : 'translateY(-16px)',
          transition:'opacity 1s ease 0.2s, transform 1s ease 0.2s',
        }}>
          {/* FDI — massive */}
          <div style={{
            fontSize:'clamp(64px, 12vw, 130px)',
            fontWeight:900,
            color:'#FFFFFF',
            letterSpacing:'-0.05em',
            lineHeight:0.9,
            textShadow:'0 0 80px rgba(255,255,255,0.08), 0 2px 40px rgba(0,0,0,0.6)',
            fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
          }}>FDI</div>
          {/* MONITOR — spaced caps below */}
          <div style={{
            fontSize:'clamp(12px, 2.2vw, 26px)',
            fontWeight:700,
            color:'rgba(255,255,255,0.42)',
            letterSpacing:'0.38em',
            textTransform:'uppercase',
            marginTop:4,
            fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
            textShadow:'none',
          }}>MONITOR</div>
        </div>

        {/* ── ROTATING QUOTE ── */}
        <div style={{
          position:'relative',
          minHeight:'clamp(90px,14vw,180px)',
          display:'flex',alignItems:'center',justifyContent:'center',
          width:'100%',maxWidth:860,
          marginBottom:36,
        }}>
          {/* Accent color underline that changes with each quote */}
          <div style={{
            position:'absolute',
            top:'-12px',left:'50%',transform:'translateX(-50%)',
            width:48,height:2,borderRadius:2,
            background:q.accent,
            boxShadow:`0 0 16px ${q.accent}80`,
            transition:`background 0.8s ease, box-shadow 0.8s ease`,
          }}/>

          <div style={{
            opacity: op,
            transform: `translateY(${ty}) scale(${sc})`,
            filter: `blur(${blur})`,
            transition: `opacity ${dur} ${ease}, transform ${dur} ${ease}, filter ${dur} ${ease}`,
            willChange: 'transform, opacity',
            width:'100%',
          }}>
            {lines.map((line, li) => (
              <div key={li} style={{
                fontSize: 'clamp(20px, 3.2vw, 46px)',
                fontWeight: 800,
                color: li === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.82)',
                letterSpacing: '-0.025em',
                lineHeight: 1.18,
                fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
                textShadow:'0 4px 40px rgba(0,0,0,0.7), 0 1px 0 rgba(0,0,0,0.4)',
                marginTop: li > 0 ? '0.12em' : 0,
              }}>
                {line}
                {/* Accent word — last word of first line gets color */}
                {li === 0 && (
                  <span style={{
                    color: q.accent,
                    textShadow:`0 0 40px ${q.accent}50`,
                    transition:'color 0.8s ease, text-shadow 0.8s ease',
                  }}>{''}</span>
                )}
              </div>
            ))}
          </div>

          {/* Quote progress dots */}
          <div style={{
            position:'absolute',bottom:'-28px',left:'50%',transform:'translateX(-50%)',
            display:'flex',gap:8,
          }}>
            {QUOTES.map((qq, i) => (
              <div key={i} style={{
                width: i === activeIdx ? 22 : 6,
                height:6,borderRadius:3,
                background: i === activeIdx ? qq.accent : 'rgba(255,255,255,0.18)',
                boxShadow: i === activeIdx ? `0 0 10px ${qq.accent}80` : 'none',
                transition:'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                cursor:'pointer',
              }}
              onClick={() => { setActiveIdx(i); setPhase('in') }}/>
            ))}
          </div>
        </div>

        {/* ── CTAs ── */}
        <div style={{
          display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center',
          pointerEvents:'auto',
          marginTop:20,
          opacity: globeReady ? 1 : 0,
          transform: globeReady ? 'translateY(0)' : 'translateY(20px)',
          transition:'opacity 1s ease 0.8s, transform 1s ease 0.8s',
        }}>
          <Link href="/dashboard" style={{
            display:'flex',alignItems:'center',gap:8,
            padding:'14px 34px',borderRadius:50,
            background:'#2ECC71',color:'white',
            textDecoration:'none',fontSize:15,fontWeight:800,
            letterSpacing:'0.005em',
            boxShadow:'0 8px 32px rgba(46,204,113,0.38)',
            transition:'all 0.22s',
          }}
          onMouseEnter={e=>{const t=e.currentTarget;t.style.transform='translateY(-3px)';t.style.boxShadow='0 16px 44px rgba(46,204,113,0.52)'}}
          onMouseLeave={e=>{const t=e.currentTarget;t.style.transform='none';t.style.boxShadow='0 8px 32px rgba(46,204,113,0.38)'}}>
            Explore Dashboard <ChevronRight size={16}/>
          </Link>
          <Link href="/register" style={{
            display:'flex',alignItems:'center',gap:8,
            padding:'14px 34px',borderRadius:50,
            background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.86)',
            textDecoration:'none',fontSize:15,fontWeight:600,
            border:'1.5px solid rgba(255,255,255,0.14)',
            backdropFilter:'blur(10px)',
            transition:'all 0.2s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.13)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)'}}>
            Sign Up <ArrowRight size={15}/>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @media(max-width:640px){
          /* Mobile: ensure text remains readable over globe */
        }
      `}</style>
    </div>
  )
}
