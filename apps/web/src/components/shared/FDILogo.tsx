'use client'
import Link from 'next/link'

// FDI MONITOR logo — matches attached brand image: navy bold "FDI" + "MONITOR" subtitle
export function FDILogo({ size='md', href='/' }: { size?:'sm'|'md'|'lg'; href?:string }) {
  const sizes = { sm:{fdi:18,monitor:10,gap:6}, md:{fdi:24,monitor:12,gap:8}, lg:{fdi:36,monitor:16,gap:12} }
  const s = sizes[size]
  return (
    <Link href={href} className="inline-flex flex-col items-center text-center no-underline group" style={{textDecoration:'none',gap:'1px',lineHeight:1}}>
      <span style={{
        fontFamily:"'Inter','Helvetica Neue',sans-serif",
        fontSize:s.fdi+'px',
        fontWeight:900,
        color:'#1A2C3E',
        letterSpacing:'-0.02em',
        lineHeight:1,
        display:'block',
      }}>FDI</span>
      <span style={{
        fontFamily:"'Inter','Helvetica Neue',sans-serif",
        fontSize:s.monitor+'px',
        fontWeight:700,
        color:'#1A2C3E',
        letterSpacing:'0.18em',
        lineHeight:1,
        display:'block',
        textTransform:'uppercase',
      }}>MONITOR</span>
    </Link>
  )
}

// Inline horizontal version for NavBar
export function FDILogoHorizontal({ href='/' }: { href?:string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 no-underline" style={{textDecoration:'none'}}>
      {/* Icon mark — eye/globe symbol */}
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="34" height="34" rx="8" fill="#1A2C3E"/>
        <ellipse cx="17" cy="17" rx="10" ry="6" stroke="#2ECC71" strokeWidth="1.8" fill="none"/>
        <circle cx="17" cy="17" r="3.5" fill="#2ECC71"/>
        <circle cx="18.2" cy="15.8" r="1.2" fill="white"/>
      </svg>
      <div style={{display:'flex',flexDirection:'column',gap:0,lineHeight:1}}>
        <span style={{fontFamily:"'Inter',sans-serif",fontSize:'17px',fontWeight:900,color:'#1A2C3E',letterSpacing:'-0.01em',lineHeight:1}}>FDI</span>
        <span style={{fontFamily:"'Inter',sans-serif",fontSize:'9px',fontWeight:800,color:'#1A2C3E',letterSpacing:'0.2em',lineHeight:1,textTransform:'uppercase'}}>MONITOR</span>
      </div>
    </Link>
  )
}
