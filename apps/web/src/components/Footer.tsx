'use client';
import Link from 'next/link';

const COLS = [
  {title:'Platform', links:[['Dashboard','/dashboard'],['Investment Analysis','/investment-analysis'],['Market Signals','/signals'],['GFR Ranking','/gfr'],['Mission Planning','/pmp']]},
  {title:'Resources', links:[['Publications','/publications'],['Data Sources','/sources'],['API Docs','/api-docs'],['Pricing','/pricing'],['About','/about']]},
];

export default function Footer() {
  return (
    <footer style={{background:'#0f1e2a',color:'white',padding:'48px 24px 24px',borderTop:'1px solid rgba(46,204,113,0.1)'}}>
      <div style={{maxWidth:'1440px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1.5fr',gap:'40px',marginBottom:'40px'}}>
          {/* Brand */}
          <div>
            <div style={{fontSize:'16px',fontWeight:900,marginBottom:'14px',letterSpacing:'0.02em'}}>
              <span>GLOBAL </span><span style={{color:'#2ecc71'}}>FDI</span><span> MONITOR</span>
            </div>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.55)',lineHeight:'1.75',marginBottom:'18px',maxWidth:'300px'}}>
              The world's most advanced AI-powered FDI intelligence platform. Real-time signals, GOSA scoring, and actionable investment insights.
            </p>
            <a href="mailto:info@fdimonitor.org" style={{fontSize:'13px',color:'#2ecc71',textDecoration:'none',fontWeight:600}}>
              info@fdimonitor.org
            </a>
            <div style={{marginTop:'16px',display:'flex',gap:'10px'}}>
              {['LinkedIn','Twitter'].map(s=>(
                <span key={s} style={{fontSize:'11px',padding:'4px 10px',background:'rgba(255,255,255,0.06)',borderRadius:'6px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>{s}</span>
              ))}
            </div>
          </div>
          {COLS.map(col=>(
            <div key={col.title}>
              <div style={{fontSize:'10px',fontWeight:800,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'14px'}}>{col.title}</div>
              {col.links.map(([l,h])=>(
                <div key={l} style={{marginBottom:'9px'}}>
                  <Link href={h} style={{fontSize:'13px',color:'rgba(255,255,255,0.65)',textDecoration:'none',transition:'color 0.15s'}}>{l}</Link>
                </div>
              ))}
            </div>
          ))}
          {/* Newsletter */}
          <div>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'14px'}}>Weekly Brief</div>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.55)',marginBottom:'14px',lineHeight:'1.65'}}>Top FDI signals & investment intelligence, every Monday.</p>
            <input type="email" placeholder="your@organisation.com"
              style={{width:'100%',padding:'9px 12px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.06)',color:'white',fontSize:'12px',outline:'none',fontFamily:'inherit',marginBottom:'8px'}}/>
            <button style={{width:'100%',padding:'9px',background:'#2ecc71',color:'#0f1e2a',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:800,fontFamily:'inherit'}}>
              Subscribe →
            </button>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:'20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
          <span style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>© 2026 Global FDI Monitor. All rights reserved.</span>
          <div style={{display:'flex',gap:'20px'}}>
            {['Privacy','Terms','Security'].map(l=>(
              <Link key={l} href={`/${l.toLowerCase()}`} style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
