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
        <div style={{textAlign:'center'}}>
          <div style={{width:52,height:52,border:'1.5px solid rgba(46,204,113,0.4)',borderRadius:'50%',borderTopColor:'transparent',animation:'spin 0.85s linear infinite',margin:'0 auto 14px'}}/>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.25)',fontFamily:'Inter,sans-serif',letterSpacing:'0.1em',textTransform:'uppercase'}}>Initialising Globe</span>
        </div>
      </div>
    ),
  }
)

// ── 6 strategic messages with position + animation config ──────────────────
const MESSAGES = [
  {
    text: 'Transforming global investment live data into strategic foresight and direction',
    color: '#2ECC71',
    delay: 0.0,
    x: '2%',   y: '14%',
    floatAmp: 8, floatDur: 6.2,
  },
  {
    text: 'Where global investment flows meet intelligence to shape future-ready decisions',
    color: '#3498DB',
    delay: 0.22,
    x: '2%',   y: '28%',
    floatAmp: 6, floatDur: 7.1,
  },
  {
    text: 'Decoding global investment movements to unlock sustainable competitive advantage',
    color: '#9B59B6',
    delay: 0.44,
    x: '2%',   y: '42%',
    floatAmp: 9, floatDur: 5.8,
  },
  {
    text: 'Empowering organizations with actionable insights to advance the global investment landscape',
    color: '#E8C84A',
    delay: 0.66,
    x: '2%',   y: '56%',
    floatAmp: 7, floatDur: 6.6,
  },
  {
    text: 'Enabling data-driven investment strategies to strengthen global competitiveness and resilience',
    color: '#E74C3C',
    delay: 0.88,
    x: '2%',   y: '70%',
    floatAmp: 8, floatDur: 7.4,
  },
  {
    text: 'Harnessing real-time global investment data to drive timely and informed strategic action',
    color: '#27ae60',
    delay: 1.10,
    x: '2%',   y: '84%',
    floatAmp: 6, floatDur: 6.0,
  },
]

export default function HomePage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Hide global header/footer
    const h = document.getElementById('site-header')
    const f = document.getElementById('site-footer')
    if (h) h.style.display = 'none'
    if (f) f.style.display = 'none'
    // Trigger entrance animations after mount
    const t = setTimeout(() => setVisible(true), 120)
    return () => {
      clearTimeout(t)
      if (h) h.style.display = ''
      if (f) f.style.display = ''
    }
  }, [])

  return (
    <div style={{
      position:'fixed', inset:0,
      fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
      overflow:'hidden',
    }}>

      {/* ════════════════════════════════════════════════════════
          CINEMATIC BACKGROUND LAYERS
          ════════════════════════════════════════════════════════ */}

      {/* L0 — deep space base */}
      <div style={{position:'absolute',inset:0,zIndex:0,
        background:'radial-gradient(ellipse 160% 130% at 65% 60%, #0b1a2f 0%, #06101c 45%, #020810 100%)'}}/>

      {/* L1 — nebula cloud behind globe */}
      <div style={{position:'absolute',zIndex:1,pointerEvents:'none',
        right:'-8%', top:'-15%', width:'85%', height:'130%',
        background:'radial-gradient(ellipse 70% 65% at 55% 52%, rgba(18,58,148,0.22) 0%, rgba(8,24,60,0.10) 50%, transparent 72%)'}}/>

      {/* L2 — brand green glow from globe */}
      <div style={{position:'absolute',zIndex:1,pointerEvents:'none',
        right:'8%', top:'25%', width:'55%', height:'55%',
        background:'radial-gradient(ellipse at 60% 50%, rgba(46,204,113,0.05) 0%, transparent 65%)'}}/>

      {/* L3 — precision grid */}
      <div style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(46,204,113,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(46,204,113,0.016) 1px,transparent 1px)',
        backgroundSize:'72px 72px'}}/>

      {/* L4 — corner vignette for depth */}
      <div style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none',
        background:'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 38%, rgba(2,8,16,0.62) 100%)'}}/>

      {/* L5 — top fade (navbar depth) */}
      <div style={{position:'absolute',left:0,right:0,top:0,height:'22%',zIndex:5,pointerEvents:'none',
        background:'linear-gradient(180deg,rgba(2,8,16,0.72) 0%,rgba(2,8,16,0.22) 60%,transparent 100%)'}}/>

      {/* L6 — bottom fade */}
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:'18%',zIndex:5,pointerEvents:'none',
        background:'linear-gradient(0deg,rgba(2,8,16,0.75) 0%,transparent 100%)'}}/>

      {/* L7 — left vignette (blends messages → globe) */}
      <div style={{position:'absolute',left:'36%',top:0,bottom:0,width:'140px',zIndex:15,pointerEvents:'none',
        background:'linear-gradient(90deg,rgba(2,8,16,0.92) 0%,transparent 100%)'}}/>


      {/* ════════════════════════════════════════════════════════
          TRANSPARENT DARK NAVBAR
          ════════════════════════════════════════════════════════ */}
      <nav style={{
        position:'absolute',top:0,left:0,right:0,height:66,
        display:'flex',alignItems:'center',padding:'0 40px',
        zIndex:60,
      }}>
        {/* FDI MONITOR — left */}
        <Link href="/" style={{textDecoration:'none',display:'flex',flexDirection:'column',lineHeight:1,flexShrink:0}}>
          <span style={{fontSize:21,fontWeight:900,color:'#FFFFFF',letterSpacing:'-0.03em',lineHeight:1,
            textShadow:'0 0 30px rgba(255,255,255,0.08)'}}>FDI</span>
          <span style={{fontSize:9,fontWeight:700,color:'rgba(255,255,255,0.38)',letterSpacing:'0.28em',
            textTransform:'uppercase',lineHeight:1,marginTop:2}}>MONITOR</span>
        </Link>

        {/* Nav links — ABSOLUTE CENTER */}
        <div style={{
          position:'absolute',left:'50%',transform:'translateX(-50%)',
          display:'flex',alignItems:'center',gap:4,
        }}>
          {[['About Us','/about'],['Features','/dashboard'],['Contact Us','/contact']].map(([l,h])=>(
            <Link key={l} href={h} style={{
              padding:'7px 18px',borderRadius:8,fontSize:13,fontWeight:500,
              color:'rgba(255,255,255,0.5)',textDecoration:'none',
              letterSpacing:'0.02em',transition:'color 0.18s',
            }}
            onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.92)'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.5)'}}>
              {l}
            </Link>
          ))}
        </div>

        {/* Right auth */}
        <div style={{marginLeft:'auto',display:'flex',gap:6,alignItems:'center'}}>
          <Link href="/auth/login" style={{padding:'7px 15px',fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.45)',textDecoration:'none',transition:'color 0.15s',borderRadius:8}}
            onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.88)'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.45)'}}>
            Sign In
          </Link>
          <Link href="/register" style={{
            padding:'7px 18px',fontSize:13,fontWeight:600,
            color:'rgba(255,255,255,0.82)',textDecoration:'none',
            background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.11)',
            borderRadius:8,transition:'all 0.15s',
          }}
          onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,0.11)'}}
          onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,0.06)'}}>
            Sign Up
          </Link>
        </div>
      </nav>


      {/* ════════════════════════════════════════════════════════
          3D GLOBE — right side, shifted DOWN for visual balance
          ════════════════════════════════════════════════════════ */}
      <div style={{
        position:'absolute',
        right:'-4%',
        top:'8%',          /* ← shifted DOWN from top for breathing room */
        bottom:'-4%',      /* allow slight overflow at bottom */
        width:'68%',
        zIndex:10,
      }}>
        <Globe3D/>
      </div>


      {/* ════════════════════════════════════════════════════════
          6 FLOATING ANIMATED MESSAGES — left panel
          ════════════════════════════════════════════════════════ */}
      <div style={{
        position:'absolute',
        left:0, top:66, bottom:0,
        width:'40%',
        zIndex:30,
        pointerEvents:'none',  /* allow globe interaction through */
        padding:'0 16px 0 36px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        gap:10,
      }}>
        {MESSAGES.map((msg, i) => (
          <div
            key={i}
            style={{
              pointerEvents:'auto',
              /* Staggered entrance: fadeSlideIn with delay */
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0) translateY(0)' : 'translateX(-28px) translateY(8px)',
              transition: `opacity 0.75s cubic-bezier(0.2,0.9,0.4,1) ${msg.delay + 0.3}s, transform 0.75s cubic-bezier(0.2,0.9,0.4,1) ${msg.delay + 0.3}s`,
              /* Continuous float animation after entering */
              animation: visible ? `float${i} ${msg.floatDur}s ease-in-out ${msg.delay + 1.2}s infinite` : 'none',
              /* Card style */
              position:'relative',
              padding:'13px 18px 13px 22px',
              borderRadius:13,
              background:'rgba(2,8,16,0.58)',
              backdropFilter:'blur(22px)',
              WebkitBackdropFilter:'blur(22px)',
              border:`1px solid ${msg.color}20`,
              boxShadow:`0 4px 22px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.024)`,
              cursor:'default',
              overflow:'hidden',
            }}
            onMouseEnter={e=>{
              const el=e.currentTarget
              el.style.background='rgba(4,12,24,0.82)'
              el.style.border=`1px solid ${msg.color}48`
              el.style.boxShadow=`0 10px 36px rgba(0,0,0,0.52), 0 0 22px ${msg.color}14, inset 0 1px 0 rgba(255,255,255,0.04)`
              el.style.transform='translateX(6px)'
            }}
            onMouseLeave={e=>{
              const el=e.currentTarget
              el.style.background='rgba(2,8,16,0.58)'
              el.style.border=`1px solid ${msg.color}20`
              el.style.boxShadow='0 4px 22px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.024)'
              el.style.transform='translateX(0)'
            }}
          >
            {/* Accent bar */}
            <div style={{position:'absolute',left:0,top:'18%',bottom:'18%',width:'2.5px',borderRadius:'0 2px 2px 0',background:msg.color,opacity:0.7}}/>

            {/* Content row */}
            <div style={{display:'flex',alignItems:'flex-start',gap:11}}>
              {/* Glowing dot */}
              <div style={{
                width:8,height:8,borderRadius:'50%',background:msg.color,
                flexShrink:0,marginTop:5,
                boxShadow:`0 0 12px ${msg.color}70, 0 0 4px ${msg.color}`,
                animation:`dotPulse${i} ${msg.floatDur * 0.7}s ease-in-out ${msg.delay}s infinite`,
              }}/>

              {/* HIGH-IMPACT TYPOGRAPHY */}
              <p style={{
                margin:0,
                fontSize:13,
                fontWeight:500,
                color:'rgba(255,255,255,0.68)',
                lineHeight:1.58,
                fontFamily:"'Inter',sans-serif",
                letterSpacing:'0.01em',
              }}>
                {msg.text}
              </p>
            </div>

            {/* Subtle shimmer line at top */}
            <div style={{
              position:'absolute',top:0,left:'10%',right:'10%',height:'1px',
              background:`linear-gradient(90deg, transparent, ${msg.color}30, transparent)`,
              opacity: visible ? 1 : 0,
              transition:`opacity 0.8s ease ${msg.delay + 1}s`,
            }}/>
          </div>
        ))}

        {/* CTAs — below messages */}
        <div style={{
          display:'flex',gap:10,marginTop:10,
          flexWrap:'wrap',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition:'opacity 0.8s ease 1.6s, transform 0.8s ease 1.6s',
          pointerEvents:'auto',
        }}>
          <Link href="/dashboard" style={{
            display:'flex',alignItems:'center',gap:7,
            padding:'12px 28px',borderRadius:50,
            background:'#2ECC71',color:'white',
            textDecoration:'none',fontSize:14,fontWeight:800,
            boxShadow:'0 6px 28px rgba(46,204,113,0.34)',
            letterSpacing:'0.01em',transition:'all 0.22s',
          }}
          onMouseEnter={e=>{const t=e.currentTarget;t.style.transform='translateY(-3px)';t.style.boxShadow='0 14px 38px rgba(46,204,113,0.5)'}}
          onMouseLeave={e=>{const t=e.currentTarget;t.style.transform='none';t.style.boxShadow='0 6px 28px rgba(46,204,113,0.34)'}}>
            Explore Dashboard <ChevronRight size={15}/>
          </Link>
          <Link href="/register" style={{
            display:'flex',alignItems:'center',gap:7,
            padding:'12px 28px',borderRadius:50,
            background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.84)',
            textDecoration:'none',fontSize:14,fontWeight:600,
            border:'1.5px solid rgba(255,255,255,0.13)',
            backdropFilter:'blur(8px)',transition:'all 0.2s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)'}}>
            Sign Up <ArrowRight size={14}/>
          </Link>
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════
          KEYFRAMES — per-card float + dot pulse animations
          ════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* Staggered float for each of the 6 cards */
        @keyframes float0 { 0%,100%{transform:translateY(0px) translateX(0)} 50%{transform:translateY(-8px) translateX(2px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px) translateX(0)} 50%{transform:translateY(-6px) translateX(-2px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) translateX(0)} 50%{transform:translateY(-9px) translateX(2px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px) translateX(0)} 50%{transform:translateY(-7px) translateX(-1px)} }
        @keyframes float4 { 0%,100%{transform:translateY(0px) translateX(0)} 50%{transform:translateY(-8px) translateX(3px)} }
        @keyframes float5 { 0%,100%{transform:translateY(0px) translateX(0)} 50%{transform:translateY(-6px) translateX(-2px)} }

        /* Dot pulse per card */
        @keyframes dotPulse0 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.35)} }
        @keyframes dotPulse1 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.35)} }
        @keyframes dotPulse2 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.35)} }
        @keyframes dotPulse3 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.35)} }
        @keyframes dotPulse4 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.35)} }
        @keyframes dotPulse5 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.35)} }

        /* Mobile responsive */
        @media (max-width: 768px) {
          /* On mobile: messages stacked on top, globe below */
        }
      `}</style>
    </div>
  )
}
