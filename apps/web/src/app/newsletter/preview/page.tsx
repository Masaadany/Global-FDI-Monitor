'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Download, ArrowLeft, Printer } from 'lucide-react';

// Newsletter PDF preview — exact 4-page futuristic design per spec
// Brand: Dark Blue #1a2c3e | Teal #2ecc71 | Gold #f1c40f | White #ffffff

const ISSUE = {
  number: 47,
  date: 'March 24, 2026',
  headline: 'ASEAN EV CORRIDOR: $25B SUPPLY CHAIN INVESTMENT RESHAPES SOUTHEAST ASIA',
  week: 'March 16–22, 2026',
};

function Page({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div style={{
      width: '794px', minHeight: '1123px', background: 'white',
      position: 'relative', overflow: 'hidden', marginBottom: '32px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.15)', borderRadius: '4px',
    }}>
      {children}
      {/* Page number */}
      <div style={{position:'absolute',bottom:'20px',right:'28px',
        fontSize:'10px',color:'rgba(26,44,62,0.4)',fontWeight:700,fontFamily:'monospace'}}>
        {num} / 4
      </div>
      {/* Bottom accent line */}
      <div style={{position:'absolute',bottom:'0',left:'0',right:'0',height:'4px',
        background:'linear-gradient(90deg,#1a2c3e 0%,#2ecc71 50%,#f1c40f 100%)'}}/>
    </div>
  );
}

export default function NewsletterPreviewPage() {
  const [zoom, setZoom] = useState(0.75);

  return (
    <div style={{minHeight:'100vh',background:'#1a1a2e',padding:'0'}}>
      {/* Toolbar */}
      <div style={{position:'sticky',top:0,zIndex:100,background:'#0a0a1a',
        borderBottom:'1px solid rgba(46,204,113,0.2)',padding:'10px 20px',
        display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
          <Link href="/newsletter" style={{display:'flex',alignItems:'center',gap:'5px',
            fontSize:'12px',color:'rgba(255,255,255,0.6)',textDecoration:'none'}}>
            <ArrowLeft size={13}/> Back to Review
          </Link>
          <span style={{color:'rgba(255,255,255,0.25)'}}>|</span>
          <span style={{fontSize:'12px',fontWeight:700,color:'white'}}>
            Issue #{ISSUE.number} — 4-Page PDF Preview
          </span>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.5)'}}>Zoom:</span>
          {[0.5,0.65,0.75,0.9,1.0].map(z=>(
            <button key={z} onClick={()=>setZoom(z)}
              style={{padding:'4px 10px',borderRadius:'5px',border:'none',cursor:'pointer',
                fontSize:'11px',fontWeight:700,
                background:zoom===z?'#2ecc71':'rgba(255,255,255,0.1)',
                color:zoom===z?'white':'rgba(255,255,255,0.6)'}}>
              {Math.round(z*100)}%
            </button>
          ))}
          <button style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 14px',
            background:'#2ecc71',color:'white',border:'none',borderRadius:'7px',
            cursor:'pointer',fontSize:'12px',fontWeight:700,marginLeft:'8px'}}>
            <Download size={13}/> Download PDF
          </button>
        </div>
      </div>

      <div style={{padding:'40px',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{transform:`scale(${zoom})`,transformOrigin:'top center',
          display:'flex',flexDirection:'column',alignItems:'center',
          width:'794px',marginBottom:`${(zoom-1)*1123*4}px`}}>

          {/* ═══ PAGE 1: COVER ═══ */}
          <Page num={1}>
            <div style={{height:'100%',minHeight:'1123px',
              background:'linear-gradient(160deg,#1a2c3e 0%,#0d1f2d 60%,#0a1520 100%)',
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
              padding:'60px 48px',position:'relative',overflow:'hidden'}}>
              {/* Background grid */}
              <div style={{position:'absolute',inset:0,
                backgroundImage:'linear-gradient(rgba(46,204,113,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(46,204,113,0.04) 1px,transparent 1px)',
                backgroundSize:'40px 40px'}}/>
              {/* Glowing orb */}
              <div style={{position:'absolute',top:'-80px',right:'-80px',width:'400px',height:'400px',
                borderRadius:'50%',background:'radial-gradient(circle,rgba(46,204,113,0.08) 0%,transparent 70%)'}}/>
              <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'300px',height:'300px',
                borderRadius:'50%',background:'radial-gradient(circle,rgba(241,196,15,0.05) 0%,transparent 70%)'}}/>

              {/* Logo */}
              <div style={{position:'relative',zIndex:1,textAlign:'center',marginBottom:'48px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0',marginBottom:'8px'}}>
                  <span style={{fontSize:'32px',fontWeight:900,color:'white',letterSpacing:'-1px'}}>GLOBAL </span>
                  <span style={{fontSize:'32px',fontWeight:900,color:'#2ecc71',letterSpacing:'-1px',margin:'0 6px'}}>FDI</span>
                  <span style={{fontSize:'32px',fontWeight:900,color:'white',letterSpacing:'-1px'}}> MONITOR</span>
                </div>
                <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'0.25em',textTransform:'uppercase'}}>
                  Investment Intelligence Platform
                </div>
              </div>

              {/* Weekly label */}
              <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:'12px',marginBottom:'32px'}}>
                <div style={{height:'1px',width:'60px',background:'rgba(46,204,113,0.4)'}}/>
                <span style={{fontSize:'12px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.2em',textTransform:'uppercase'}}>
                  Weekly Intelligence Brief
                </span>
                <div style={{height:'1px',width:'60px',background:'rgba(46,204,113,0.4)'}}/>
              </div>

              {/* Issue + Date */}
              <div style={{position:'relative',zIndex:1,textAlign:'center',marginBottom:'40px'}}>
                <div style={{fontSize:'48px',fontWeight:900,color:'white',lineHeight:1,fontFamily:'monospace',
                  letterSpacing:'-2px',marginBottom:'6px'}}>
                  ISSUE #{String(ISSUE.number).padStart(3,'0')}
                </div>
                <div style={{fontSize:'16px',color:'rgba(255,255,255,0.5)',fontWeight:600,letterSpacing:'0.08em'}}>
                  {ISSUE.date.toUpperCase()}
                </div>
              </div>

              {/* Main title box */}
              <div style={{position:'relative',zIndex:1,width:'100%',marginBottom:'36px'}}>
                <div style={{border:'2px solid #2ecc71',borderRadius:'12px',padding:'28px 32px',
                  background:'rgba(46,204,113,0.07)',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',
                    background:'linear-gradient(90deg,#2ecc71,#f1c40f,#2ecc71)'}}/>
                  <div style={{fontSize:'22px',fontWeight:900,color:'white',lineHeight:'1.3',textAlign:'center',
                    letterSpacing:'-0.3px'}}>
                    ASEAN EV CORRIDOR: $25B SUPPLY CHAIN<br/>INVESTMENT RESHAPES SOUTHEAST ASIA
                  </div>
                </div>
              </div>

              {/* Featured inside */}
              <div style={{position:'relative',zIndex:1,width:'100%'}}>
                <div style={{border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'20px 24px',
                  background:'rgba(255,255,255,0.04)'}}>
                  <div style={{fontSize:'10px',fontWeight:800,color:'rgba(255,255,255,0.4)',
                    textTransform:'uppercase',letterSpacing:'0.15em',marginBottom:'12px'}}>
                    Featured Inside
                  </div>
                  {[
                    'Top Global Update: ASEAN EV Corridor Agreement',
                    'Regional Investment Analysis — 3 Major Regions',
                    'Sector Spotlight: EV Battery & AI Data Centers',
                    'Top 5 Global Investment Signals',
                    'Executive Summary & Strategic Implications',
                  ].map((item,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',
                      padding:'6px 0',borderBottom:i<4?'1px solid rgba(255,255,255,0.06)':'none'}}>
                      <span style={{color:'#2ecc71',fontSize:'14px',fontWeight:900,
                        minWidth:'18px',fontFamily:'monospace'}}>0{i+1}</span>
                      <span style={{fontSize:'12px',color:'rgba(255,255,255,0.75)',fontWeight:600}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{position:'absolute',bottom:'32px',left:0,right:0,textAlign:'center',zIndex:1}}>
                <div style={{fontSize:'10px',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',
                  textTransform:'uppercase',fontWeight:700}}>
                  Created by Global FDI Monitor · www.fdimonitor.org
                </div>
              </div>
            </div>
          </Page>

          {/* ═══ PAGE 2: EXECUTIVE SUMMARY ═══ */}
          <Page num={2}>
            <div style={{padding:'48px',minHeight:'1123px'}}>
              {/* Header band */}
              <div style={{background:'#1a2c3e',margin:'-48px -48px 36px -48px',padding:'20px 48px',
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <span style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.2em',textTransform:'uppercase'}}>
                    Global FDI Monitor
                  </span>
                  <span style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',marginLeft:'12px'}}>
                    Weekly Intelligence Brief · Issue #{ISSUE.number}
                  </span>
                </div>
                <span style={{fontSize:'10px',color:'rgba(255,255,255,0.5)'}}>{ISSUE.date}</span>
              </div>

              {/* Section title */}
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px'}}>
                <div style={{width:'4px',height:'28px',background:'#2ecc71',borderRadius:'2px'}}/>
                <h2 style={{fontSize:'18px',fontWeight:900,color:'#1a2c3e',textTransform:'uppercase',
                  letterSpacing:'0.08em',margin:0}}>Executive Summary</h2>
              </div>

              <p style={{fontSize:'13px',color:'#333',lineHeight:'1.8',marginBottom:'24px'}}>
                This week's intelligence confirms a structural shift in global supply chains toward Southeast Asia. 
                The ASEAN EV Corridor represents the most significant regional investment integration in a decade, 
                with Vietnam, Thailand, and Malaysia capturing the lion's share of $25B in committed capital.
              </p>

              {/* Key takeaways */}
              <div style={{fontSize:'11px',fontWeight:800,color:'#1a2c3e',textTransform:'uppercase',
                letterSpacing:'0.12em',marginBottom:'14px'}}>Key Takeaways for Investors</div>
              {[
                {n:'01',title:'EV BATTERY SUPPLY CHAIN',body:'Vietnam offers fastest land acquisition; Thailand provides strongest incentives; Malaysia delivers most mature semiconductor base. Diversify across all three for supply chain resilience.'},
                {n:'02',title:'AI DATA CENTERS',body:"Malaysia's 100% FDI cap opens immediate opportunities. Power availability is the binding constraint — prioritize locations with committed renewable energy infrastructure."},
                {n:'03',title:'REGIONAL DYNAMICS',body:'Asia Pacific continues to outperform (78.4 score, +0.6). Europe & Middle East facing temporary headwinds. Americas & Africa showing steady growth with Brazil emerging as leading destination.'},
              ].map(item=>(
                <div key={item.n} style={{display:'flex',gap:'16px',padding:'16px',
                  background:'rgba(26,44,62,0.04)',border:'1px solid rgba(26,44,62,0.1)',
                  borderLeft:'4px solid #2ecc71',borderRadius:'0 8px 8px 0',marginBottom:'12px'}}>
                  <div style={{fontSize:'18px',fontWeight:900,color:'#2ecc71',fontFamily:'monospace',
                    minWidth:'28px',paddingTop:'2px',lineHeight:1}}>{item.n}</div>
                  <div>
                    <div style={{fontSize:'11px',fontWeight:800,color:'#1a2c3e',textTransform:'uppercase',
                      letterSpacing:'0.06em',marginBottom:'5px'}}>{item.title}</div>
                    <div style={{fontSize:'12px',color:'#555',lineHeight:'1.65'}}>{item.body}</div>
                  </div>
                </div>
              ))}

              {/* Top Global Update */}
              <div style={{display:'flex',alignItems:'center',gap:'10px',margin:'28px 0 16px'}}>
                <div style={{width:'4px',height:'28px',background:'#f1c40f',borderRadius:'2px'}}/>
                <h2 style={{fontSize:'18px',fontWeight:900,color:'#1a2c3e',textTransform:'uppercase',
                  letterSpacing:'0.08em',margin:0}}>Top Global Update</h2>
              </div>

              <div style={{background:'rgba(26,44,62,0.02)',border:'1px solid rgba(26,44,62,0.1)',
                borderRadius:'8px',padding:'20px',marginBottom:'16px'}}>
                <h3 style={{fontSize:'15px',fontWeight:900,color:'#1a2c3e',lineHeight:'1.3',marginBottom:'12px'}}>
                  Vietnam, Thailand, Malaysia Form "ASEAN EV Corridor" — $25B Supply Chain Investment
                </h3>
                <p style={{fontSize:'12px',color:'#555',lineHeight:'1.75',marginBottom:'12px'}}>
                  Three Southeast Asian nations have signed a landmark agreement to create an integrated electric 
                  vehicle supply chain spanning the region. The pact includes harmonized incentives, cross-border 
                  tariff elimination, and joint infrastructure development.
                </p>
                <p style={{fontSize:'12px',color:'#555',lineHeight:'1.75'}}>
                  Total committed investment exceeds $25 billion, with battery manufacturing in Vietnam, assembly in 
                  Thailand, and semiconductor production in Malaysia forming the core investment triangle.
                </p>
              </div>

              {/* Strategic implication */}
              <div style={{background:'#1a2c3e',borderRadius:'8px',padding:'16px 20px'}}>
                <div style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',textTransform:'uppercase',
                  letterSpacing:'0.15em',marginBottom:'7px'}}>Strategic Implication</div>
                <p style={{fontSize:'12px',color:'rgba(255,255,255,0.85)',lineHeight:'1.7',margin:0}}>
                  Southeast Asia consolidates position as the world's fastest-growing EV manufacturing hub. 
                  Expected to attract additional $15–20B in ancillary investments over 24 months across charging 
                  infrastructure, logistics, and component manufacturing.
                </p>
              </div>

              {/* Sources */}
              <div style={{marginTop:'14px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {['Ministry of Investment Vietnam ✓','Thailand BOI ✓','MITI Malaysia ✓'].map(s=>(
                  <span key={s} style={{fontSize:'10px',padding:'3px 9px',borderRadius:'10px',
                    background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',
                    color:'#2ecc71',fontWeight:700}}>{s}</span>
                ))}
              </div>
            </div>
          </Page>

          {/* ═══ PAGE 3: REGIONAL + SECTOR + SIGNALS ═══ */}
          <Page num={3}>
            <div style={{padding:'48px',minHeight:'1123px'}}>
              {/* Header band */}
              <div style={{background:'#1a2c3e',margin:'-48px -48px 32px -48px',padding:'20px 48px',
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.2em',textTransform:'uppercase'}}>
                  Global FDI Monitor · Intelligence Brief #{ISSUE.number}
                </span>
                <span style={{fontSize:'10px',color:'rgba(255,255,255,0.5)'}}>{ISSUE.date}</span>
              </div>

              {/* Regional */}
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
                <div style={{width:'4px',height:'24px',background:'#2ecc71',borderRadius:'2px'}}/>
                <h2 style={{fontSize:'16px',fontWeight:900,color:'#1a2c3e',textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>Regional Investment Analysis</h2>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'12px'}}>
                {[{r:'Asia Pacific',s:78.4,c:'+0.6',up:true,eco:'Vietnam',h:'EV battery subsidy approved'},
                  {r:'Europe & Middle East',s:74.2,c:'-0.2',up:false,eco:'UAE',h:'$10B AI fund launched'},
                  {r:'Americas & Africa',s:69.8,c:'+0.3',up:true,eco:'Brazil',h:'$5B data center investment'},
                ].map(r=>(
                  <div key={r.r} style={{padding:'14px',borderRadius:'8px',
                    background:'rgba(26,44,62,0.03)',border:'1px solid rgba(26,44,62,0.1)'}}>
                    <div style={{fontSize:'10px',fontWeight:800,color:'#696969',textTransform:'uppercase',
                      letterSpacing:'0.06em',marginBottom:'6px'}}>{r.r}</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:'7px',marginBottom:'5px'}}>
                      <span style={{fontSize:'20px',fontWeight:900,color:'#1a2c3e',fontFamily:'monospace'}}>{r.s}</span>
                      <span style={{fontSize:'12px',fontWeight:700,color:r.up?'#2ecc71':'#e74c3c'}}>{r.c}</span>
                    </div>
                    <div style={{fontSize:'11px',fontWeight:700,color:'#1a2c3e',marginBottom:'3px'}}>{r.eco}</div>
                    <div style={{fontSize:'10px',color:'#696969'}}>{r.h}</div>
                  </div>
                ))}
              </div>
              {/* Heatmap */}
              <div style={{background:'rgba(26,44,62,0.03)',border:'1px solid rgba(26,44,62,0.08)',
                borderRadius:'8px',padding:'14px',marginBottom:'24px'}}>
                <div style={{fontSize:'10px',fontWeight:800,color:'#696969',textTransform:'uppercase',
                  letterSpacing:'0.08em',marginBottom:'12px'}}>Regional Momentum Heatmap</div>
                {[{n:'Singapore',v:88.4},{n:'Malaysia',v:81.2},{n:'Thailand',v:80.7},{n:'Vietnam',v:79.4}].map(e=>(
                  <div key={e.n} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                    <span style={{fontSize:'11px',color:'#1a2c3e',minWidth:'80px',fontWeight:600}}>{e.n}</span>
                    <div style={{flex:1,height:'10px',borderRadius:'5px',background:'rgba(26,44,62,0.08)',overflow:'hidden'}}>
                      <div style={{height:'100%',borderRadius:'5px',width:`${e.v}%`,
                        background:'linear-gradient(90deg,#2ecc71,#f1c40f)'}}/>
                    </div>
                    <span style={{fontSize:'11px',fontWeight:800,color:'#1a2c3e',fontFamily:'monospace',minWidth:'36px'}}>{e.v}</span>
                  </div>
                ))}
              </div>

              {/* Sectors */}
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px'}}>
                <div style={{width:'4px',height:'24px',background:'#f1c40f',borderRadius:'2px'}}/>
                <h2 style={{fontSize:'16px',fontWeight:900,color:'#1a2c3e',textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>Sector Investment Analysis</h2>
              </div>
              {[{name:'EV Battery Manufacturing',m:92,c:'+12',tier:'HIGH-GROWTH',
                items:['🇻🇳 Vietnam approves $15B battery mega-plant','🇮🇩 Indonesia secures $8B nickel processing','🇹🇭 Thailand launches $2B incentive package'],
                impl:'Global EV battery demand will outpace supply by 2028. Southeast Asia positioned to capture 30% of new investment.',col:'#2ecc71'},
               {name:'AI Data Centers',m:78,c:'+8',tier:'EMERGING',
                items:['🇲🇾 Malaysia raises FDI cap to 100% — $5B+ expected','🇸🇬 Singapore approves 5 new facilities','🇹🇭 Thailand announces digital economy corridor'],
                impl:'Southeast Asia emerging as fastest-growing data center market globally.',col:'#3498db'},
              ].map(s=>(
                <div key={s.name} style={{border:'1px solid rgba(26,44,62,0.1)',borderRadius:'8px',
                  padding:'14px',marginBottom:'12px',borderLeft:`4px solid ${s.col}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                    <div>
                      <span style={{fontSize:'10px',fontWeight:800,padding:'2px 7px',borderRadius:'8px',
                        background:`${s.col}15`,color:s.col,marginRight:'8px'}}>{s.tier}</span>
                      <span style={{fontSize:'13px',fontWeight:800,color:'#1a2c3e'}}>{s.name}</span>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span style={{fontSize:'20px',fontWeight:900,color:s.col,fontFamily:'monospace'}}>{s.m}</span>
                      <span style={{fontSize:'11px',color:s.col,marginLeft:'4px'}}>▲{s.c}</span>
                      <span style={{fontSize:'10px',color:'#696969',marginLeft:'3px'}}>/100</span>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'12px'}}>
                    <div style={{flex:1}}>
                      {s.items.map(item=>(
                        <div key={item} style={{fontSize:'11px',color:'#555',padding:'2px 0'}}>{item}</div>
                      ))}
                    </div>
                    <div style={{width:'180px',padding:'10px',borderRadius:'6px',background:`${s.col}08`}}>
                      <div style={{fontSize:'9px',fontWeight:800,color:s.col,textTransform:'uppercase',
                        letterSpacing:'0.08em',marginBottom:'5px'}}>Strategic Implication</div>
                      <div style={{fontSize:'10px',color:'#555',lineHeight:'1.5'}}>{s.impl}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Top 5 Signals */}
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px',marginTop:'4px'}}>
                <div style={{width:'4px',height:'24px',background:'#1a2c3e',borderRadius:'2px'}}/>
                <h2 style={{fontSize:'16px',fontWeight:900,color:'#1a2c3e',textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>Top 5 Global Investment Signals</h2>
              </div>
              {[
                {n:1,c:'🔴',t:'POLICY CHANGE',eco:'Malaysia',txt:'FDI cap in data centers raised to 100%',pri:'HIGH'},
                {n:2,c:'🟢',t:'NEW INCENTIVE',eco:'Thailand',txt:'$2B EV battery subsidy package approved',pri:'HIGH'},
                {n:3,c:'🔵',t:'SECTOR GROWTH',eco:'Vietnam',txt:'Electronics exports surge 34% YoY',pri:'MEDIUM'},
                {n:4,c:'🟡',t:'ZONE AVAILABILITY',eco:'Indonesia',txt:'New Batam zone with 200ha ready',pri:'MEDIUM'},
                {n:5,c:'🔵',t:'COMPETITOR MOVEMENT',eco:'Indonesia',txt:'$15B nickel processing investment',pri:'HIGH'},
              ].map(sig=>(
                <div key={sig.n} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 12px',
                  borderRadius:'7px',background:'rgba(26,44,62,0.02)',border:'1px solid rgba(26,44,62,0.07)',
                  marginBottom:'6px'}}>
                  <span style={{fontSize:'14px',fontWeight:900,color:'rgba(26,44,62,0.25)',fontFamily:'monospace',minWidth:'20px'}}>#{sig.n}</span>
                  <span style={{fontSize:'14px'}}>{sig.c}</span>
                  <div style={{flex:1}}>
                    <span style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',marginRight:'6px'}}>{sig.t}</span>
                    <span style={{fontSize:'12px',color:'#1a2c3e',fontWeight:600}}>{sig.eco} — {sig.txt}</span>
                  </div>
                  <span style={{fontSize:'10px',fontWeight:800,padding:'2px 8px',borderRadius:'7px',
                    background:sig.pri==='HIGH'?'rgba(231,76,60,0.08)':'rgba(241,196,15,0.1)',
                    color:sig.pri==='HIGH'?'#e74c3c':'#f39c12'}}>{sig.pri}</span>
                </div>
              ))}
              <div style={{textAlign:'right',marginTop:'8px'}}>
                <span style={{fontSize:'10px',color:'#2ecc71',fontWeight:700}}>
                  View All Signals → www.fdimonitor.org/signals
                </span>
              </div>
            </div>
          </Page>

          {/* ═══ PAGE 4: ABOUT + CTA + CONTACT ═══ */}
          <Page num={4}>
            <div style={{minHeight:'1123px',display:'flex',flexDirection:'column'}}>
              {/* Header band */}
              <div style={{background:'#1a2c3e',padding:'20px 48px',
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.2em',textTransform:'uppercase'}}>
                  Global FDI Monitor · Intelligence Brief #{ISSUE.number}
                </span>
                <span style={{fontSize:'10px',color:'rgba(255,255,255,0.5)'}}>{ISSUE.date}</span>
              </div>

              <div style={{flex:1,padding:'40px 48px',display:'flex',flexDirection:'column',gap:'0'}}>
                {/* About */}
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px',marginTop:'8px'}}>
                  <div style={{width:'4px',height:'24px',background:'#2ecc71',borderRadius:'2px'}}/>
                  <h2 style={{fontSize:'16px',fontWeight:900,color:'#1a2c3e',textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>About Global FDI Monitor</h2>
                </div>
                <p style={{fontSize:'12px',color:'#555',lineHeight:'1.75',marginBottom:'20px'}}>
                  Global FDI Monitor is the world's most advanced Smart intelligence investment intelligence platform. 
                  Combining World Bank Doing Business methodology with sector-level intelligence, zone-specific 
                  reality data, and real-time market signals across all countries and all sectors, we deliver 
                  actionable investment insights for global investors, governments, and economic development organisations.
                </p>

                {/* Methodology */}
                <div style={{background:'rgba(26,44,62,0.03)',border:'1px solid rgba(26,44,62,0.1)',
                  borderRadius:'8px',padding:'16px 20px',marginBottom:'20px'}}>
                  <div style={{fontSize:'10px',fontWeight:800,color:'#696969',textTransform:'uppercase',
                    letterSpacing:'0.12em',marginBottom:'12px'}}>Our Methodology — Global Opportunity Score Analysis</div>
                  {[
                    {n:1,name:'Doing Business Indicators',  w:'30%',desc:'10 indicators normalized via Distance-to-Frontier'},
                    {n:2,name:'Sector Indicators',          w:'20%',desc:'Regulations, incentives, labor, infrastructure'},
                    {n:3,name:'Investment Zone Indicators',  w:'25%',desc:'Land, occupancy, infrastructure, incentives'},
                    {n:4,name:'Market Intelligence Matrix',  w:'25%',desc:'Institutional data, real-time signals'},
                  ].map(l=>(
                    <div key={l.n} style={{display:'flex',gap:'10px',marginBottom:'7px',alignItems:'flex-start'}}>
                      <span style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',minWidth:'22px',fontFamily:'monospace'}}>L{l.n}</span>
                      <div style={{flex:1,fontSize:'11px',color:'#555'}}>{l.name} — {l.desc}</div>
                      <span style={{fontSize:'11px',fontWeight:800,color:'#1a2c3e',minWidth:'30px',textAlign:'right'}}>{l.w}</span>
                    </div>
                  ))}
                  <div style={{borderTop:'1px solid rgba(26,44,62,0.1)',paddingTop:'10px',marginTop:'8px'}}>
                    <div style={{fontSize:'11px',fontFamily:'monospace',color:'#1a2c3e',fontWeight:700}}>
                      GOSA = (0.30 × L1) + (0.20 × L2) + (0.25 × L3) + (0.25 × L4)
                    </div>
                    <div style={{fontSize:'10px',color:'#696969',marginTop:'5px'}}>
                      Tiers: <span style={{fontWeight:700,color:'#2ecc71'}}>Top Tier 80–100</span> · 
                      <span style={{fontWeight:700,color:'#1a2c3e',margin:'0 4px'}}>High Tier 60–79</span> · 
                      <span style={{fontWeight:700,color:'#696969'}}>Developing Tier below 60</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div style={{background:'linear-gradient(135deg,#1a2c3e 0%,#0d1f2d 100%)',
                  borderRadius:'12px',padding:'24px 28px',marginBottom:'20px',
                  border:'1px solid rgba(46,204,113,0.2)',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:'-30px',right:'-30px',width:'120px',height:'120px',
                    borderRadius:'50%',background:'radial-gradient(circle,rgba(46,204,113,0.12) 0%,transparent 70%)'}}/>
                  <div style={{position:'relative',zIndex:1}}>
                    <h3 style={{fontSize:'17px',fontWeight:900,color:'white',marginBottom:'8px',lineHeight:'1.3'}}>
                      Generate Your Custom Investment Analysis
                    </h3>
                    <p style={{fontSize:'12px',color:'rgba(255,255,255,0.7)',lineHeight:'1.65',marginBottom:'16px'}}>
                      Benchmark countries. Analyse sectors. Model investment scenarios. 
                      Download PDF reports with full methodology.
                    </p>
                    <div style={{display:'inline-block',background:'#2ecc71',borderRadius:'8px',
                      padding:'11px 24px',fontSize:'13px',fontWeight:800,color:'white',
                      letterSpacing:'0.02em'}}>
                      VISIT GLOBAL FDI MONITOR PLATFORM
                    </div>
                    <div style={{marginTop:'8px',fontSize:'11px',color:'rgba(255,255,255,0.4)',fontFamily:'monospace'}}>
                      www.fdimonitor.org
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',flex:1,alignItems:'end'}}>
                  <div>
                    <div style={{fontSize:'10px',fontWeight:800,color:'#696969',textTransform:'uppercase',
                      letterSpacing:'0.1em',marginBottom:'8px'}}>Contact Us</div>
                    {[['🌐','www.fdimonitor.org'],['✉','info@fdimonitor.org'],['📍','info@fdimonitor.org']].map(([i,v])=>(
                      <div key={v} style={{fontSize:'11px',color:'#555',marginBottom:'5px',display:'flex',gap:'7px'}}>
                        <span>{i}</span><span>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{fontSize:'10px',fontWeight:800,color:'#696969',textTransform:'uppercase',
                      letterSpacing:'0.1em',marginBottom:'8px'}}>Follow Us</div>
                    {[['💼','LinkedIn: Global FDI Monitor'],['🐦','Twitter: @GlobalFDIMonitor']].map(([i,v])=>(
                      <div key={v} style={{fontSize:'11px',color:'#555',marginBottom:'5px',display:'flex',gap:'7px'}}>
                        <span>{i}</span><span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div style={{background:'#1a2c3e',padding:'14px 48px',
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'10px',color:'rgba(255,255,255,0.4)'}}>
                  Created by Global FDI Monitor
                </span>
                <span style={{fontSize:'10px',color:'rgba(255,255,255,0.4)'}}>
                  © 2026 Global FDI Monitor. All rights reserved.
                </span>
              </div>
            </div>
          </Page>

        </div>
      </div>
    </div>
  );
}
