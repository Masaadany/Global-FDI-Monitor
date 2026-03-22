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
        <div style={{width:52,height:52,border:'1.5px solid rgba(46,204,113,0.35)',borderRadius:'50%',
          borderTopColor:'transparent',animation:'spin 0.9s linear infinite'}}/>
      </div>
    ),
  }
)

const QUOTES = [
  { text:'Transforming global investment live data into strategic foresight and direction.',          accent:'#2ECC71' },
  { text:'Where global investment flows meet intelligence to shape future-ready decisions.',           accent:'#3498DB' },
  { text:'Decoding global investment movements to unlock sustainable competitive advantage.',           accent:'#9B59B6' },
  { text:'Empowering organizations with actionable insights to advance the global investment landscape.', accent:'#E8C84A' },
  { text:'Enabling data-driven investment strategies to strengthen global competitiveness and resilience.', accent:'#E74C3C' },
  { text:'Harnessing real-time global investment data to drive timely and informed strategic action.',  accent:'#27ae60' },
]

export default function HomePage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [phase, setPhase]         = useState<'in'|'hold'|'out'>('in')
  const [ready, setReady]         = useState(false)

  useEffect(() => {
    const h = document.getElementById('site-header')
    const f = document.getElementById('site-footer')
    if (h) h.style.display = 'none'
    if (f) f.style.display = 'none'
    const t = setTimeout(() => setReady(true), 100)
    return () => { clearTimeout(t); if (h) h.style.display=''; if (f) f.style.display='' }
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if      (phase==='in')   timer = setTimeout(() => setPhase('hold'), 900)
    else if (phase==='hold') timer = setTimeout(() => setPhase('out'),  2400)
    else                     timer = setTimeout(() => { setActiveIdx(i=>(i+1)%QUOTES.length); setPhase('in') }, 650)
    return () => clearTimeout(timer)
  }, [phase])

  const q    = QUOTES[activeIdx]
  const op   = phase==='out' ? 0     : 1
  const ty   = phase==='in'  ? '0px' : phase==='out' ? '-24px' : '0px'
  const bl   = phase==='out' ? '8px' : '0px'
  const dur  = phase==='out' ? '0.6s' : '0.9s'
  const ease = phase==='in'  ? 'cubic-bezier(0.16,1,0.3,1)' : 'cubic-bezier(0.4,0,1,1)'

  return (
    <div style={{position:'fixed',inset:0,overflow:'hidden',fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif"}}>

      {/* ══ CINEMATIC BACKGROUND ════════════════════════════════════ */}
      {/* Deep space — richer on right where globe lives */}
      <div style={{position:'absolute',inset:0,zIndex:0,
        background:'radial-gradient(ellipse 200% 180% at 52% 52%, #0d1e34 0%, #070f1e 45%, #020810 100%)'}}/>
      {/* Nebula — right side behind globe */}
      <div style={{position:'absolute',right:'-8%',top:'-10%',width:'75%',height:'120%',zIndex:1,pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 70% at 52% 52%, rgba(14,46,120,0.18) 0%, transparent 72%)'}}/>
      {/* Accent glow — shifts with quote color, on LEFT behind text */}
      <div style={{position:'absolute',left:'2%',top:'20%',width:'48%',height:'65%',zIndex:1,pointerEvents:'none',
        background:`radial-gradient(ellipse at 40% 50%, ${q.accent}06 0%, transparent 65%)`,
        transition:'background 1.2s ease'}}/>
      {/* Precision grid */}
      <div style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(46,204,113,0.014) 1px,transparent 1px),linear-gradient(90deg,rgba(46,204,113,0.014) 1px,transparent 1px)',
        backgroundSize:'72px 72px'}}/>
      {/* Corner vignette */}
      <div style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none',
        background:'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 42%, rgba(2,8,16,0.58) 100%)'}}/>
      {/* Top fade */}
      <div style={{position:'absolute',left:0,right:0,top:0,height:'26%',zIndex:4,pointerEvents:'none',
        background:'linear-gradient(180deg,rgba(2,8,16,0.85) 0%,rgba(2,8,16,0.25) 60%,transparent 100%)'}}/>
      {/* Bottom fade */}
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:'20%',zIndex:4,pointerEvents:'none',
        background:'linear-gradient(0deg,rgba(2,8,16,0.82) 0%,transparent 100%)'}}/>
      {/* Seamless blend — very soft, no visible line */}
      <div style={{position:'absolute',left:'44%',top:0,bottom:0,width:'220px',zIndex:15,pointerEvents:'none',
        background:'linear-gradient(90deg,rgba(2,8,16,0.55) 0%,rgba(2,8,16,0.22) 40%,transparent 100%)'}}/>

      {/* ══ GLOBE — RIGHT SIDE ════════════════════════════════════ */}
      <div style={{
        position:'absolute',
        right:'-3%',          /* slight cinematic overflow on right */
        top:'5%',
        bottom:'-3%',
        width:'62%',          /* takes right 62% */
        zIndex:10,
      }}>
        {ready && <Globe3D/>}
      </div>

      {/* ══ NAVBAR ════════════════════════════════════════════════ */}
      <nav style={{position:'absolute',top:0,left:0,right:0,height:64,
        display:'flex',alignItems:'center',padding:'0 36px',zIndex:60}}>

        {/* Logo — far left */}
        <Link href="/" style={{textDecoration:'none',flexShrink:0}}>
          <div style={{display:'flex',flexDirection:'column',lineHeight:1}}>
            <span style={{fontSize:20,fontWeight:900,color:'#fff',letterSpacing:'-0.03em'}}>FDI</span>
            <span style={{fontSize:8.5,fontWeight:700,color:'rgba(255,255,255,0.35)',
              letterSpacing:'0.28em',textTransform:'uppercase',marginTop:2}}>MONITOR</span>
          </div>
        </Link>

        {/* ── About Us · Features · Contact Us — ABSOLUTE CENTER ── */}
        <div style={{
          position:'absolute',left:'50%',transform:'translateX(-50%)',
          display:'flex',gap:2,
        }}>
          {[['About Us','/about'],['Features','/dashboard'],['Contact Us','/contact']].map(([l,h])=>(
            <Link key={l} href={h} style={{
              padding:'7px 17px',fontSize:13,fontWeight:500,
              color:'rgba(255,255,255,0.46)',textDecoration:'none',borderRadius:7,
              letterSpacing:'0.015em',transition:'color 0.18s',
            }}
            onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.92)'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.46)'}}>
              {l}
            </Link>
          ))}
        </div>

        {/* Sign In / Sign Up — far right */}
        <div style={{marginLeft:'auto',display:'flex',gap:6,alignItems:'center'}}>
          <Link href="/auth/login" style={{padding:'7px 14px',fontSize:13,fontWeight:500,
            color:'rgba(255,255,255,0.4)',textDecoration:'none',borderRadius:7,transition:'color 0.15s'}}
            onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.88)'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.4)'}}>
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

      {/* ══ LEFT PANEL — rotating quote + CTAs ═══════════════════ */}
      <div style={{
        position:'absolute',
        left:0, top:0, bottom:0,
        width:'50%',          /* left 50% for quotes */
        zIndex:50,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
        padding:'80px 32px 60px 44px',
        pointerEvents:'none',
      }}>

        {/* Accent line */}
        <div style={{
          width:44, height:2.5, borderRadius:2,
          background:q.accent,
          boxShadow:`0 0 18px ${q.accent}80`,
          marginBottom:28,
          opacity: ready ? 1 : 0,
          transition:`background 0.9s ease, box-shadow 0.9s ease, opacity 0.8s ease 0.4s`,
        }}/>

        {/* LARGE ROTATING QUOTE */}
        <div style={{
          minHeight:'clamp(120px,22vw,250px)',
          display:'flex',alignItems:'flex-start',
          width:'100%',
          marginBottom:38,
        }}>
          <div style={{
            opacity:op,
            transform:`translateY(${ty})`,
            filter:`blur(${bl})`,
            transition:`opacity ${dur} ${ease}, transform ${dur} ${ease}, filter ${dur} ${ease}`,
            willChange:'transform,opacity,filter',
          }}>
            <p style={{
              margin:0,
              fontSize:'clamp(22px,2.8vw,40px)',
              fontWeight:800,
              color:'#FFFFFF',
              letterSpacing:'-0.028em',
              lineHeight:1.22,
              fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
              textShadow:'0 4px 40px rgba(0,0,0,0.7)',
              textAlign:'left',
            }}>
              {q.text}
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{display:'flex',gap:8,marginBottom:34,pointerEvents:'auto'}}>
          {QUOTES.map((qq,i)=>(
            <div key={i}
              onClick={()=>{setActiveIdx(i);setPhase('in')}}
              style={{
                width:i===activeIdx?24:6, height:6, borderRadius:3,
                background:i===activeIdx?qq.accent:'rgba(255,255,255,0.16)',
                boxShadow:i===activeIdx?`0 0 12px ${qq.accent}90`:'none',
                transition:'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                cursor:'pointer',
              }}/>
          ))}
        </div>

        {/* CTAs */}
        <div style={{
          display:'flex',gap:12,flexWrap:'wrap',
          pointerEvents:'auto',
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(18px)',
          transition:'opacity 1s ease 0.9s, transform 1s ease 0.9s',
        }}>
          <Link href="/dashboard" style={{
            display:'flex',alignItems:'center',gap:8,
            padding:'14px 32px',borderRadius:50,
            background:'#2ECC71',color:'white',
            textDecoration:'none',fontSize:15,fontWeight:800,
            letterSpacing:'0.005em',
            boxShadow:'0 8px 30px rgba(46,204,113,0.38)',
            transition:'all 0.22s',
          }}
          onMouseEnter={e=>{const t=e.currentTarget;t.style.transform='translateY(-3px)';t.style.boxShadow='0 16px 44px rgba(46,204,113,0.52)'}}
          onMouseLeave={e=>{const t=e.currentTarget;t.style.transform='none';t.style.boxShadow='0 8px 30px rgba(46,204,113,0.38)'}}>
            Explore Dashboard <ChevronRight size={16}/>
          </Link>
          <Link href="/register" style={{
            display:'flex',alignItems:'center',gap:8,
            padding:'14px 32px',borderRadius:50,
            background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.85)',
            textDecoration:'none',fontSize:15,fontWeight:600,
            border:'1.5px solid rgba(255,255,255,0.13)',
            backdropFilter:'blur(10px)',
            transition:'all 0.2s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.13)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)'}}>
            Sign Up <ArrowRight size={15}/>
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
