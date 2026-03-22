'use client'
import Link from 'next/link'

const COLS = [
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard',            href: '/dashboard' },
      { label: 'GFR Ranking',          href: '/gfr' },
      { label: 'Investment Analysis',  href: '/investment-analysis' },
      { label: 'Market Signals',       href: '/signals' },
      { label: 'Sector Assessment',    href: '/sectors' },
      { label: 'Corridor Intelligence',href: '/corridors' },
    ]
  },
  {
    title: 'Intelligence',
    links: [
      { label: 'Benchmark & Impact',   href: '/investment-analysis' },
      { label: 'Foresight & Scenario', href: '/scenario-planner' },
      { label: 'Mission Planning',     href: '/pmp' },
      { label: 'Custom Reports',       href: '/reports' },
      { label: 'Pipeline Tracker',     href: '/pipeline' },
      { label: 'Agent Report',         href: '/pipeline-report' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',   href: '/about' },
      { label: 'Resources',  href: '/publications' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Sign In',    href: '/auth/login' },
      { label: 'Sign Up',    href: '/register' },
    ]
  },
]

export function Footer() {
  return (
    <footer style={{
      background:'#1A2C3E',
      borderTop:'1px solid rgba(255,255,255,0.06)',
      padding:'40px 0 20px',
      fontFamily:"'Inter','Helvetica Neue',sans-serif",
      marginTop:40,
    }}>
      <div style={{maxWidth:1540,margin:'0 auto',padding:'0 32px'}}>

        {/* Main columns */}
        <div style={{display:'grid',gridTemplateColumns:'1.8fr 1fr 1fr 1fr',gap:40,marginBottom:36}}>

          {/* Brand */}
          <div>
            <div style={{display:'flex',flexDirection:'column',lineHeight:1,marginBottom:14}}>
              <span style={{fontSize:22,fontWeight:900,color:'#FFFFFF',letterSpacing:'-0.03em'}}>FDI</span>
              <span style={{fontSize:9,fontWeight:700,color:'rgba(255,255,255,0.32)',letterSpacing:'0.28em',textTransform:'uppercase',marginTop:2}}>MONITOR</span>
            </div>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.7,marginBottom:18,maxWidth:280}}>
              The world's most advanced FDI intelligence platform. Real-time, GOSA-scored intelligence across 215+ economies, powered by 6 AI agents.
            </p>
            {/* Live status */}
            <div style={{display:'flex',alignItems:'center',gap:7,padding:'6px 12px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.18)',borderRadius:20,width:'fit-content',marginBottom:16}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'#2ECC71',boxShadow:'0 0 8px #2ECC71',animation:'footPulse 1.5s infinite'}}/>
              <span style={{fontSize:11,fontWeight:700,color:'#2ECC71'}}>Platform LIVE</span>
              <span style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>1,000+ sources · 2s updates</span>
            </div>
            {/* Coverage badge */}
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {[['215+','Economies'],['1,000+','Sources'],['6','AI Agents']].map(([v,l])=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div style={{fontSize:16,fontWeight:900,color:'#FFFFFF',fontFamily:'JetBrains Mono,monospace'}}>{v}</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {COLS.map(col=>(
            <div key={col.title}>
              <div style={{fontSize:10,fontWeight:800,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.14em',marginBottom:14}}>{col.title}</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {col.links.map(link=>(
                  <Link key={link.href} href={link.href} style={{
                    fontSize:13,fontWeight:400,color:'rgba(255,255,255,0.55)',
                    textDecoration:'none',transition:'color 0.15s',
                  }}
                  onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.9)'}}
                  onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.55)'}}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:16,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>
            © {new Date().getFullYear()} FDI Monitor. All rights reserved. · Powered by 6-stage AI agent pipeline
          </span>
          <div style={{display:'flex',gap:16}}>
            {[['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Data Sources','/sources']].map(([l,h])=>(
              <Link key={h} href={h} style={{fontSize:11,color:'rgba(255,255,255,0.25)',textDecoration:'none',transition:'color 0.15s'}}
                onMouseEnter={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.65)'}}
                onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(255,255,255,0.25)'}}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes footPulse{0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,0.4)}50%{box-shadow:0 0 0 6px rgba(46,204,113,0)}}`}</style>
    </footer>
  )
}
