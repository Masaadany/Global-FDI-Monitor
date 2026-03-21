'use client';
import Link from 'next/link';

const LINKS = {
  Platform: [
    {l:'Dashboard',         h:'/dashboard'},
    {l:'Investment Analysis',h:'/investment-analysis'},
    {l:'Market Signals',    h:'/signals'},
    {l:'GFR Ranking',       h:'/gfr'},
    {l:'Mission Planning',  h:'/pmp'},
    {l:'Publications',      h:'/publications'},
  ],
  Intelligence: [
    {l:'GOSA Methodology',  h:'/about#gosa'},
    {l:'Signal Grades',     h:'/about#signals'},
    {l:'AI Agent Pipeline', h:'/about#agents'},
    {l:'Data Sources',      h:'/sources'},
    {l:'API Documentation', h:'/api-docs'},
    {l:'Changelog',         h:'/about'},
  ],
  Company: [
    {l:'About Us',          h:'/about'},
    {l:'Pricing',           h:'/pricing'},
    {l:'Contact',           h:'/contact'},
    {l:'Privacy Policy',    h:'/privacy'},
    {l:'Terms of Service',  h:'/terms'},
  ],
};

export default function Footer() {
  return (
    <footer style={{background:'#0f1e2a',borderTop:'1px solid rgba(46,204,113,0.1)',padding:'48px 24px 24px',marginTop:'auto'}}>
      <div style={{maxWidth:'1440px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'48px',marginBottom:'40px'}}>
          {/* Brand col */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px'}}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#2ecc71" strokeWidth="1.5" opacity="0.4"/>
                <circle cx="16" cy="16" r="10" stroke="#2ecc71" strokeWidth="1" opacity="0.6"/>
                <path d="M16 26 L20 14 L16 6" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="20" cy="14" r="2.5" fill="#2ecc71"/>
              </svg>
              <span style={{fontSize:'13px',fontWeight:900}}>
                <span style={{color:'white'}}>GLOBAL </span>
                <span style={{color:'#2ecc71'}}>FDI</span>
                <span style={{color:'white'}}> MONITOR</span>
              </span>
            </div>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.45)',lineHeight:'1.75',maxWidth:'300px',marginBottom:'20px'}}>
              The world's most advanced FDI intelligence platform. 215+ economies, 304+ official sources, 6-stage AI agent pipeline.
            </p>
            <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'12px'}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#2ecc71',display:'inline-block'}}/>
              <span style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Live signals updating every 2 seconds</span>
            </div>
            <Link href="/register" style={{display:'inline-block',padding:'9px 20px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:800}}>
              Start Free Trial →
            </Link>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([section,links])=>(
            <div key={section}>
              <div style={{fontSize:'11px',fontWeight:800,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>
                {section}
              </div>
              {links.map(({l,h})=>(
                <Link key={l} href={h} style={{display:'block',fontSize:'13px',color:'rgba(255,255,255,0.55)',textDecoration:'none',marginBottom:'8px',transition:'color 0.15s'}}>
                  {l}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
          <span style={{fontSize:'12px',color:'rgba(255,255,255,0.25)'}}>
            © 2026 Global FDI Monitor. All rights reserved.
          </span>
          <div style={{display:'flex',gap:'16px'}}>
            {[['Privacy','/privacy'],['Terms','/terms'],['Contact','mailto:info@fdimonitor.org']].map(([l,h])=>(
              <Link key={l} href={h} style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.2)'}}>info@fdimonitor.org</span>
        </div>
      </div>
    </footer>
  );
}
