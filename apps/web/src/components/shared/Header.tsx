'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

// ── FDI MONITOR text-only logo (matches attached brand: navy FDI + MONITOR) ──
function Logo() {
  return (
    <Link href="/" style={{textDecoration:'none',display:'flex',flexDirection:'column',gap:0,lineHeight:1}}>
      <span style={{
        fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
        fontSize:26,fontWeight:900,
        color:'#1A2C3E',
        letterSpacing:'-0.03em',
        lineHeight:1,display:'block',
      }}>FDI</span>
      <span style={{
        fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
        fontSize:11,fontWeight:700,
        color:'#1A2C3E',
        letterSpacing:'0.22em',
        lineHeight:1,display:'block',
        textTransform:'uppercase',
        marginTop:1,
      }}>MONITOR</span>
    </Link>
  )
}

// Dark version for hero overlay
function LogoDark() {
  return (
    <Link href="/" style={{textDecoration:'none',display:'flex',flexDirection:'column',gap:0,lineHeight:1}}>
      <span style={{fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",fontSize:26,fontWeight:900,color:'#FFFFFF',letterSpacing:'-0.03em',lineHeight:1,display:'block'}}>FDI</span>
      <span style={{fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.7)',letterSpacing:'0.22em',lineHeight:1,display:'block',textTransform:'uppercase',marginTop:1}}>MONITOR</span>
    </Link>
  )
}

const NAV_LINKS = [
  { label:'About Us',  href:'/about'   },
  { label:'Features',  href:'/dashboard'},
  { label:'Contact Us',href:'/contact' },
]

export function Header({ dark=false }: { dark?:boolean }) {
  const [mobile,setMobile]=useState(false)
  const fg = dark ? 'rgba(255,255,255,0.7)' : '#5A6874'
  const fgHover = dark ? '#FFFFFF' : '#1A2C3E'
  const border = dark ? 'rgba(255,255,255,0.12)' : '#ECF0F1'
  const bg = dark ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.98)'

  return (
    <header style={{
      position:'fixed',top:0,left:0,right:0,
      zIndex:100,
      background: dark ? 'transparent' : bg,
      borderBottom: dark ? 'none' : `1px solid ${border}`,
      backdropFilter: dark ? 'none' : 'blur(8px)',
    }}>
      <div style={{maxWidth:1540,margin:'0 auto',padding:'0 28px',height:64,display:'flex',alignItems:'center',gap:12}}>
        {dark ? <LogoDark/> : <Logo/>}

        {/* Desktop nav */}
        <nav style={{display:'flex',alignItems:'center',gap:2,marginLeft:'auto'}}>
          {NAV_LINKS.map(n=>(
            <Link key={n.label} href={n.href}
              style={{padding:'8px 16px',borderRadius:8,fontSize:14,fontWeight:500,color:fg,textDecoration:'none',transition:'color 0.15s',fontFamily:"'Inter',sans-serif"}}
              onMouseEnter={e=>{(e.currentTarget as any).style.color=fgHover}}
              onMouseLeave={e=>{(e.currentTarget as any).style.color=fg}}>
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button onClick={()=>setMobile(!mobile)} style={{display:'none',background:'none',border:'none',cursor:'pointer',marginLeft:8,color:dark?'white':'#1A2C3E'}} className="mobile-toggle">
          {mobile?<X size={20}/>:<Menu size={20}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {mobile&&(
        <div style={{background:'white',borderTop:`1px solid ${border}`,padding:'12px 20px',display:'flex',flexDirection:'column',gap:4}}>
          {NAV_LINKS.map(n=>(
            <Link key={n.label} href={n.href} onClick={()=>setMobile(false)}
              style={{padding:'10px 12px',fontSize:14,fontWeight:500,color:'#5A6874',textDecoration:'none',borderRadius:8,fontFamily:"'Inter',sans-serif"}}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){.mobile-toggle{display:flex!important}nav{display:none!important}}`}</style>
    </header>
  )
}
