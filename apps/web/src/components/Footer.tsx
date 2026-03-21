'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{background:'#1a2c3e',color:'white',padding:'40px 24px 24px'}}>
      <div style={{maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'32px',marginBottom:'32px'}}>
          <div>
            <div style={{fontSize:'18px',fontWeight:900,marginBottom:'12px',letterSpacing:'-0.3px'}}>
              <span style={{color:'white'}}>GLOBAL </span>
              <span style={{color:'#2ecc71'}}>FDI</span>
              <span style={{color:'white'}}> MONITOR</span>
            </div>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',lineHeight:'1.7',marginBottom:'16px',maxWidth:'280px'}}>
              The world's most advanced AI-powered investment intelligence platform. 
              Real-time signals, GOSA scoring for 215 economies.
            </p>
            <a href="mailto:info@fdimonitor.org" style={{fontSize:'13px',color:'#2ecc71',textDecoration:'none'}}>
              info@fdimonitor.org
            </a>
          </div>
          <div>
            <div style={{fontSize:'11px',fontWeight:800,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'12px'}}>Platform</div>
            {[['Dashboard','/dashboard'],['Investment Analysis','/investment-analysis'],['Market Signals','/signals'],['GFR Ranking','/gfr'],['Mission Planning','/pmp']].map(([l,h])=>(
              <div key={l} style={{marginBottom:'8px'}}>
                <Link href={h} style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',textDecoration:'none'}}>{l}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:'11px',fontWeight:800,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'12px'}}>Resources</div>
            {[['Publications','/publications'],['Data Sources','/sources'],['API Docs','/api-docs'],['Pricing','/pricing'],['About','/about']].map(([l,h])=>(
              <div key={l} style={{marginBottom:'8px'}}>
                <Link href={h} style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',textDecoration:'none'}}>{l}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:'11px',fontWeight:800,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'12px'}}>Newsletter</div>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'12px',lineHeight:'1.6'}}>Weekly FDI intelligence brief</p>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              <input type="email" placeholder="your@organisation.com"
                style={{padding:'9px 12px',borderRadius:'7px',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.08)',color:'white',fontSize:'12px',outline:'none'}}/>
              <button style={{padding:'9px',background:'#2ecc71',color:'white',border:'none',borderRadius:'7px',cursor:'pointer',fontSize:'12px',fontWeight:700}}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:'20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
          <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>© 2026 Global FDI Monitor. All rights reserved.</span>
          <div style={{display:'flex',gap:'16px'}}>
            <Link href="/privacy" style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>Privacy</Link>
            <Link href="/terms" style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
