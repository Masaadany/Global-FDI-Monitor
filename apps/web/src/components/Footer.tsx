'use client';
import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { label:'About Us',               href:'/about' },
  { label:'Global Dashboard',       href:'/dashboard' },
  { label:'Global Ranking',         href:'/gfr' },
  { label:'Foresight & Planning',   href:'/forecast' },
  { label:'Promotion Mission',      href:'/pmp' },
  { label:'Resources & Insights',   href:'/market-insights' },
  { label:'Contact Us',             href:'/contact' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  return (
    <footer role="contentinfo" style={{background:'white',borderTop:'1px solid rgba(10,61,98,0.1)',marginTop:'auto'}}>
      {/* Main footer */}
      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'48px 24px 32px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',marginBottom:'40px'}}>
          {/* Brand col */}
          <div>
            <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'16px'}}>
              <span style={{fontSize:'18px',fontWeight:'900',color:'#0A3D62',letterSpacing:'-0.5px'}}>GLOBAL</span>
              <span style={{fontSize:'18px',fontWeight:'900',color:'#74BB65',letterSpacing:'-0.5px',marginLeft:'4px'}}>FDI</span>
              <span style={{fontSize:'18px',fontWeight:'900',color:'#0A3D62',letterSpacing:'-0.5px',marginLeft:'4px'}}>MONITOR</span>
            </div>
            <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.6',maxWidth:'280px'}}>
              The global standard for investment intelligence. Empowering nations with real-time FDI signals, rankings, and foresight to 2050.
            </p>
          </div>

          {/* Links + contact */}
          <div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px 20px',marginBottom:'20px'}}>
              {LINKS.map(l=>(
                <Link key={l.href} href={l.href} style={{fontSize:'13px',color:'#696969',textDecoration:'none'}} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              <a href="mailto:info@fdimonitor.org" style={{fontSize:'13px',color:'#0A3D62',textDecoration:'none',display:'flex',alignItems:'center',gap:'6px'}}>
                📧 info@fdimonitor.org
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                style={{fontSize:'13px',color:'#0A3D62',textDecoration:'none',display:'flex',alignItems:'center',gap:'6px'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A3D62"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div style={{background:'#E2F2DF',borderRadius:'12px',padding:'24px',marginBottom:'24px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
            <span>📬</span>
            <span style={{fontWeight:'700',color:'#0A3D62',fontSize:'14px'}}>NEWSLETTER</span>
          </div>
          <p style={{fontSize:'13px',color:'#696969',marginBottom:'12px'}}>Subscribe for investment insights and platform updates</p>
          {!subbed ? (
            <div style={{display:'flex',gap:'8px',maxWidth:'420px'}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{flex:1,padding:'10px 14px',borderRadius:'8px',border:'1.5px solid rgba(10,61,98,0.15)',fontSize:'13px'}}
                aria-label="Newsletter email"/>
              <button onClick={()=>{if(email.includes('@')){setSubbed(true);}}}
                style={{background:'#74BB65',color:'white',border:'none',borderRadius:'8px',padding:'10px 18px',fontWeight:'700',fontSize:'13px',cursor:'pointer',whiteSpace:'nowrap'}}>
                SUBSCRIBE
              </button>
            </div>
          ) : (
            <p style={{fontSize:'13px',color:'#2d7a20',fontWeight:'600'}}>✓ Subscribed! Thank you.</p>
          )}
        </div>

        {/* Copyright */}
        <div style={{borderTop:'1px solid rgba(10,61,98,0.08)',paddingTop:'16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <p style={{fontSize:'12px',color:'#696969'}}>© 2026 Global FDI Monitor. All rights reserved.</p>
          <div style={{display:'flex',gap:'16px'}}>
            <Link href="/terms"   style={{fontSize:'12px',color:'#696969',textDecoration:'none'}}>Terms</Link>
            <Link href="/privacy" style={{fontSize:'12px',color:'#696969',textDecoration:'none'}}>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
