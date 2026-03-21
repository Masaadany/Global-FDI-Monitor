'use client';
import Link from 'next/link';

const COLS = {
  Platform:[
    {l:'Dashboard',h:'/dashboard'},{l:'Investment Analysis',h:'/investment-analysis'},
    {l:'Market Signals',h:'/signals'},{l:'GFR Ranking',h:'/gfr'},
    {l:'Sector Monitor',h:'/sectors'},{l:'Corridor Intel',h:'/corridors'},
    {l:'Alerts Centre',h:'/alerts'},{l:'Onboarding',h:'/onboarding'},
    {l:'Market Insights',h:'/insights'},{l:'Pipeline Tracker',h:'/pipeline'},
    {l:'Scenario Planner',h:'/scenario-planner'},{l:'PDF Reports',h:'/reports'},
  ],
  Intelligence:[
    {l:'Sector Monitor',h:'/sectors'},
    {l:'GOSA Methodology',h:'/about#gosa'},{l:'Signal Grades',h:'/about#signals'},
    {l:'AI Agent Pipeline',h:'/about#agents'},{l:'Data Sources (304+)',h:'/sources'},
    {l:'API Documentation',h:'/api-docs'},{l:'Publications',h:'/publications'},
  ],
  Company:[
    {l:'About Us',h:'/about'},{l:'Pricing',h:'/pricing'},
    {l:'Contact',h:'/contact'},{l:'FAQ',h:'/faq'},
    {l:'Settings',h:'/settings'},{l:'FAQ',h:'/faq'},
    {l:'Privacy Policy',h:'/privacy'},{l:'Terms of Service',h:'/terms'},
  ],
};

export default function Footer() {
  return (
    <footer style={{background:'linear-gradient(180deg,#060f1a,#020c14)',borderTop:'1px solid rgba(0,255,200,0.08)',padding:'56px 24px 28px',marginTop:'auto',position:'relative',overflow:'hidden'}}>
      {/* Background grid */}
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.02) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
      {/* Glow at top */}
      <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'60%',height:'1px',background:'linear-gradient(90deg,transparent,rgba(0,255,200,0.4),transparent)'}}/>

      <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
        <div style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr 1fr',gap:'56px',marginBottom:'48px'}}>
          {/* Brand column */}
          <div>
            <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'10px',marginBottom:'18px'}}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="17" stroke="rgba(0,255,200,0.3)" strokeWidth="1.5"/>
                <circle cx="20" cy="20" r="11" stroke="rgba(0,212,255,0.4)" strokeWidth="1"/>
                <path d="M20 32 L24 18 L20 6" stroke="#00ffc8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="24" cy="18" r="3" fill="#00ffc8" style={{filter:'drop-shadow(0 0 6px #00ffc8)'}}/>
              </svg>
              <div>
                <div style={{fontSize:'13px',fontWeight:900,letterSpacing:'0.06em',fontFamily:"'Orbitron','Inter',sans-serif"}}>
                  <span style={{color:'#e8f4f8'}}>GLOBAL </span>
                  <span style={{color:'#00ffc8',textShadow:'0 0 16px rgba(0,255,200,0.5)'}}>FDI</span>
                  <span style={{color:'#e8f4f8'}}> MONITOR</span>
                </div>
                <div style={{fontSize:'8px',color:'rgba(0,255,200,0.4)',letterSpacing:'0.2em',marginTop:'1px',fontFamily:"'JetBrains Mono',monospace"}}>INTELLIGENCE PLATFORM</div>
              </div>
            </Link>
            <p style={{fontSize:'13px',color:'rgba(232,244,248,0.4)',lineHeight:'1.8',maxWidth:'280px',marginBottom:'22px'}}>
              The world's most advanced FDI intelligence platform. 215+ economies, 304+ official sources, 6-stage AI agent pipeline.
            </p>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'18px',padding:'8px 12px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.1)',borderRadius:'8px',width:'fit-content'}}>
              <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'#00ffc8',boxShadow:'0 0 8px #00ffc8'}}/>
              <span style={{fontSize:'11px',fontWeight:600,color:'rgba(0,255,200,0.8)',fontFamily:"'JetBrains Mono',monospace"}}>LIVE · Signals updating every 2s</span>
            </div>
            <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'9px 20px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:800,boxShadow:'0 4px 16px rgba(0,255,200,0.25)'}}>
              Start Free Trial →
            </Link>
          </div>
          {/* Link columns */}
          {Object.entries(COLS).map(([section,links])=>(
            <div key={section}>
              <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'16px',fontFamily:"'Orbitron','Inter',sans-serif"}}>{section}</div>
              {links.map(({l,h})=>(
                <Link key={l} href={h} style={{display:'block',fontSize:'12px',color:'rgba(232,244,248,0.45)',textDecoration:'none',marginBottom:'9px',transition:'color 150ms ease',fontWeight:400}}
                  onMouseEnter={(e:any)=>e.target.style.color='#00ffc8'}
                  onMouseLeave={(e:any)=>e.target.style.color='rgba(232,244,248,0.45)'}>
                  {l}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'22px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
          <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
            {[['#00ffc8','API'],['#00b4d8','GOSA'],['#ffd700','GFR'],['#9b59b6','AGT']].map(([c,l])=>(
              <span key={l} style={{fontSize:'9px',fontWeight:700,padding:'2px 7px',borderRadius:'4px',background:`${c}10`,color:c,border:`1px solid ${c}20`,letterSpacing:'0.06em',fontFamily:"'JetBrains Mono',monospace"}}>{l}</span>
            ))}
          </div>
          <span style={{fontSize:'11px',color:'rgba(232,244,248,0.2)'}}>© 2026 Global FDI Monitor. All rights reserved.</span>
          <div style={{display:'flex',gap:'16px'}}>
            {[['Privacy','/privacy'],['Terms','/terms'],['info@fdimonitor.org','mailto:info@fdimonitor.org']].map(([l,h])=>(
              <Link key={l} href={h} style={{fontSize:'11px',color:'rgba(232,244,248,0.25)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
