'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'

const Globe3D = dynamic(
  () => import('@/components/hero/Globe3D').then(m => ({ default: m.Globe3D })),
  {
    ssr: false,
    loading: () => (
      <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:56,height:56,border:'1.5px solid rgba(46,204,113,0.45)',borderRadius:'50%',borderTopColor:'transparent',animation:'spin 0.85s linear infinite',margin:'0 auto 14px'}}/>
          <span style={{fontSize:12,color:'rgba(255,255,255,0.3)',fontFamily:'Inter,sans-serif',letterSpacing:'0.06em',textTransform:'uppercase'}}>Initialising Globe…</span>
        </div>
      </div>
    ),
  }
)

const MESSAGES = [
  'Transforming global investment live data into strategic foresight and direction',
  'Where global investment flows meet intelligence to shape future-ready decisions',
  'Decoding global investment movements to unlock sustainable competitive advantage',
  'Empowering organizations with actionable insights to advance the global investment landscape',
  'Enabling data-driven investment strategies to strengthen global competitiveness and resilience',
  'Harnessing real-time global investment data to drive timely and informed strategic action',
]
const MSG_COLORS = ['#2ECC71','#3498DB','#9B59B6','#E8C84A','#E74C3C','#27ae60']

export default function HomePage() {
  useEffect(() => {
    const h = document.getElementById('site-header')
    const f = document.getElementById('site-footer')
    if (h) h.style.display = 'none'
    if (f) f.style.display = 'none'
    return () => {
      if (h) h.style.display = ''
      if (f) f.style.display = ''
    }
  }, [])

  return (
    <div style={{
      position:'fixed',inset:0,
      fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
      overflow:'hidden',
    }}>

      {/* ── CINEMATIC BACKGROUND ─────────────────────────────────── */}
      {/* Deep space gradient — rich dark blue/navy */}
      <div style={{
        position:'absolute',inset:0,zIndex:0,
        background:'radial-gradient(ellipse 140% 120% at 70% 50%, #0a1628 0%, #060c16 40%, #030810 100%)',
      }}/>
      {/* Subtle nebula glow behind globe */}
      <div style={{
        position:'absolute',zIndex:0,
        right:'-10%',top:'-20%',
        width:'90%',height:'130%',
        background:'radial-gradient(ellipse at 60% 50%, rgba(22,65,140,0.28) 0%, rgba(10,30,70,0.14) 40%, transparent 70%)',
        pointerEvents:'none',
      }}/>
      {/* Green tint glow — FDI brand color emanating from globe */}
      <div style={{
        position:'absolute',zIndex:0,
        right:'5%',top:'20%',
        width:'60%',height:'60%',
        background:'radial-gradient(ellipse at 60% 50%, rgba(46,204,113,0.055) 0%, transparent 65%)',
        pointerEvents:'none',
      }}/>
      {/* Fine grain texture overlay for 4K cinematic feel */}
      <div style={{
        position:'absolute',inset:0,zIndex:1,pointerEvents:'none',
        backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.022\'/%3E%3C/svg%3E")',
        backgroundSize:'256px 256px',
        opacity:0.55,
        mixBlendMode:'overlay',
      }}/>
      {/* Precision grid */}
      <div style={{
        position:'absolute',inset:0,zIndex:0,pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(46,204,113,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(46,204,113,0.018) 1px,transparent 1px)',
        backgroundSize:'72px 72px',
      }}/>
      {/* Vignette — edges dark, center clear */}
      <div style={{
        position:'absolute',inset:0,zIndex:2,pointerEvents:'none',
        background:'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(3,8,16,0.55) 100%)',
      }}/>

      {/* ── DARK NAVBAR ──────────────────────────────────────────── */}
      <nav style={{
        position:'absolute',top:0,left:0,right:0,height:68,
        display:'flex',alignItems:'center',padding:'0 40px',
        zIndex:60,
        background:'linear-gradient(180deg,rgba(3,8,16,0.7) 0%,rgba(3,8,16,0) 100%)',
        backdropFilter:'blur(0px)',
      }}>
        {/* Logo — left */}
        <Link href="/" style={{textDecoration:'none',display:'flex',flexDirection:'column',lineHeight:1,flexShrink:0}}>
          <span style={{
            fontSize:22,fontWeight:900,color:'#FFFFFF',
            letterSpacing:'-0.03em',lineHeight:1,
            textShadow:'0 0 24px rgba(255,255,255,0.12)',
          }}>FDI</span>
          <span style={{
            fontSize:9.5,fontWeight:700,
            color:'rgba(255,255,255,0.45)',
            letterSpacing:'0.26em',textTransform:'uppercase',
            lineHeight:1,marginTop:2,
          }}>MONITOR</span>
        </Link>

        {/* ── NAV LINKS — CENTER ── */}
        <div style={{
          position:'absolute',left:'50%',transform:'translateX(-50%)',
          display:'flex',alignItems:'center',gap:2,
        }}>
          {[['About Us','/about'],['Features','/dashboard'],['Contact Us','/contact']].map(([label,href])=>(
            <Link key={label} href={href} style={{
              padding:'8px 20px',borderRadius:8,
              fontSize:13,fontWeight:500,
              color:'rgba(255,255,255,0.55)',
              textDecoration:'none',
              letterSpacing:'0.02em',
              transition:'color 0.18s',
              fontFamily:"'Inter',sans-serif",
            }}
            onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.95)'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.55)'}}>
              {label}
            </Link>
          ))}
        </div>

        {/* Sign In — right */}
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8}}>
          <Link href="/auth/login" style={{
            padding:'7px 16px',borderRadius:8,
            fontSize:13,fontWeight:500,
            color:'rgba(255,255,255,0.5)',
            textDecoration:'none',
            transition:'color 0.15s',
          }}
          onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.9)'}}
          onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.5)'}}>
            Sign In
          </Link>
          <Link href="/register" style={{
            padding:'7px 18px',borderRadius:8,
            fontSize:13,fontWeight:600,
            color:'rgba(255,255,255,0.85)',
            textDecoration:'none',
            background:'rgba(255,255,255,0.07)',
            border:'1px solid rgba(255,255,255,0.12)',
            transition:'all 0.15s',
          }}
          onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,0.12)'}}
          onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,0.07)'}}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ── LEFT PANEL — 6 floating messages ─────────────────────── */}
      <div style={{
        position:'absolute',
        left:0,top:0,bottom:0,
        width:'40%',
        zIndex:20,
        display:'flex',flexDirection:'column',
        justifyContent:'center',
        padding:'80px 20px 64px 40px',
        gap:9,
      }}>
        {MESSAGES.map((msg,i)=>(
          <div key={i} style={{
            position:'relative',
            padding:'12px 16px 12px 22px',
            borderRadius:12,
            background:'rgba(3,8,16,0.62)',
            backdropFilter:'blur(20px)',
            WebkitBackdropFilter:'blur(20px)',
            border:`1px solid ${MSG_COLORS[i]}1e`,
            boxShadow:`0 4px 20px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.025)`,
            display:'flex',alignItems:'flex-start',gap:11,
            transition:'all 0.22s cubic-bezier(0.2,0,0,1)',
            cursor:'default',
            overflow:'hidden',
          }}
          onMouseEnter={e=>{
            const el=e.currentTarget
            el.style.background='rgba(3,8,16,0.82)'
            el.style.border=`1px solid ${MSG_COLORS[i]}42`
            el.style.transform='translateX(5px)'
            el.style.boxShadow=`0 8px 32px rgba(0,0,0,0.5),0 0 20px ${MSG_COLORS[i]}12,inset 0 1px 0 rgba(255,255,255,0.04)`
          }}
          onMouseLeave={e=>{
            const el=e.currentTarget
            el.style.background='rgba(3,8,16,0.62)'
            el.style.border=`1px solid ${MSG_COLORS[i]}1e`
            el.style.transform='none'
            el.style.boxShadow='0 4px 20px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.025)'
          }}>
            {/* Accent bar */}
            <div style={{position:'absolute',left:0,top:'18%',bottom:'18%',width:'2.5px',borderRadius:'0 2px 2px 0',background:MSG_COLORS[i],opacity:0.65}}/>
            {/* Dot */}
            <div style={{width:7,height:7,borderRadius:'50%',background:MSG_COLORS[i],flexShrink:0,marginTop:'4px',boxShadow:`0 0 10px ${MSG_COLORS[i]}55`}}/>
            {/* Text */}
            <p style={{margin:0,fontSize:12,fontWeight:400,color:'rgba(255,255,255,0.62)',lineHeight:1.6,fontFamily:"'Inter',sans-serif",letterSpacing:'0.01em'}}>
              {msg}
            </p>
          </div>
        ))}

        {/* CTAs */}
        <div style={{display:'flex',gap:10,marginTop:8,flexWrap:'wrap'}}>
          <Link href="/dashboard" style={{
            display:'flex',alignItems:'center',gap:7,
            padding:'12px 28px',borderRadius:50,
            background:'#2ECC71',color:'white',
            textDecoration:'none',fontSize:14,fontWeight:800,
            fontFamily:"'Inter',sans-serif",
            boxShadow:'0 6px 28px rgba(46,204,113,0.35)',
            letterSpacing:'0.01em',
            transition:'all 0.2s',
          }}
          onMouseEnter={e=>{const t=e.currentTarget;t.style.transform='translateY(-2px)';t.style.boxShadow='0 12px 36px rgba(46,204,113,0.48)'}}
          onMouseLeave={e=>{const t=e.currentTarget;t.style.transform='none';t.style.boxShadow='0 6px 28px rgba(46,204,113,0.35)'}}>
            Explore Dashboard <ChevronRight size={15}/>
          </Link>
          <Link href="/register" style={{
            display:'flex',alignItems:'center',gap:7,
            padding:'12px 28px',borderRadius:50,
            background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.85)',
            textDecoration:'none',fontSize:14,fontWeight:600,
            fontFamily:"'Inter',sans-serif",
            border:'1.5px solid rgba(255,255,255,0.13)',
            backdropFilter:'blur(8px)',
            transition:'all 0.2s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.11)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)'}}>
            Sign Up <ArrowRight size={14}/>
          </Link>
        </div>
      </div>

      {/* ── RIGHT — 3D GLOBE (shifted right for cinematic crop) ───── */}
      <div style={{
        position:'absolute',
        right:'-3%',top:0,bottom:0,
        width:'68%',
        zIndex:10,
      }}>
        <Globe3D/>
      </div>

      {/* ── Left vignette blends messages into globe ─────────────── */}
      <div style={{
        position:'absolute',left:'35%',top:0,bottom:0,
        width:'130px',zIndex:15,pointerEvents:'none',
        background:'linear-gradient(90deg,rgba(3,8,16,0.88) 0%,transparent 100%)',
      }}/>

      {/* ── Bottom gradient for depth ─────────────────────────────── */}
      <div style={{
        position:'absolute',left:0,right:0,bottom:0,
        height:'18%',zIndex:5,pointerEvents:'none',
        background:'linear-gradient(0deg,rgba(3,8,16,0.7) 0%,transparent 100%)',
      }}/>

      {/* ── Top gradient for depth ───────────────────────────────── */}
      <div style={{
        position:'absolute',left:0,right:0,top:0,
        height:'15%',zIndex:5,pointerEvents:'none',
        background:'linear-gradient(180deg,rgba(3,8,16,0.6) 0%,transparent 100%)',
      }}/>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  )
}
