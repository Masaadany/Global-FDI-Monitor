'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{background:'#1a2c3e',borderBottom:'1px solid rgba(46,204,113,0.15)',position:'sticky',top:0,zIndex:100}}>
      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',height:'56px',gap:'0'}}>
        <Link href="/" style={{textDecoration:'none',marginRight:'32px',flexShrink:0}}>
          <span style={{fontSize:'16px',fontWeight:900,letterSpacing:'-0.3px'}}>
            <span style={{color:'white'}}>GLOBAL </span>
            <span style={{color:'#2ecc71'}}>FDI</span>
            <span style={{color:'white'}}> MONITOR</span>
          </span>
        </Link>
        <div style={{display:'flex',gap:'0',flex:1,overflowX:'auto'}}>
          {[
            ['Dashboard','/dashboard'],
            ['Investment Analysis','/investment-analysis'],
            ['Market Signals','/signals'],
            ['GFR Ranking','/gfr'],
            ['Mission Planning','/pmp'],
            ['Publications','/publications'],
            ['Pricing','/pricing'],
          ].map(([l,h])=>(
            <Link key={l} href={h} style={{padding:'0 14px',fontSize:'13px',fontWeight:600,color:'rgba(255,255,255,0.75)',textDecoration:'none',height:'56px',display:'flex',alignItems:'center',whiteSpace:'nowrap',borderBottom:'2px solid transparent',transition:'all 0.15s'}}>
              {l}
            </Link>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
          <Link href="/signals" style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'11px',fontWeight:800,color:'#2ecc71',textDecoration:'none'}}>
            <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#2ecc71',display:'inline-block',animation:'livePulse 2s infinite'}}/>
            LIVE
          </Link>
          <Link href="/contact" style={{padding:'7px 16px',background:'#2ecc71',color:'#1a2c3e',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:800,marginLeft:'8px'}}>
            Free Trial
          </Link>
        </div>
      </div>
    </nav>
  );
}
