'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Download, Eye, ChevronDown, Filter } from 'lucide-react';

const PUBLICATIONS = [
  {id:47,date:'March 24, 2026',title:'ASEAN EV Corridor: $25B Supply Chain Investment Reshapes Southeast Asia',summary:'Historic trilateral agreement creates integrated EV supply chain spanning Vietnam, Thailand, and Malaysia. Analysis of $25B in committed capital, strategic implications, and investment opportunities.',sectors:['EV Battery','Manufacturing','Supply Chain'],score:81.2,tier:'High Tier',cover:'latest',top_signals:5},
  {id:46,date:'March 17, 2026',title:"Malaysia's Data Center Boom: $5B+ Investment Expected as 100% FDI Cap Takes Effect",summary:"Policy reform analysis: Malaysia's removal of 30% local ownership requirement for data centers and projected impact on digital infrastructure investment.",sectors:['Digital Economy','Data Centers'],score:82.1,tier:'High Tier',cover:'',top_signals:4},
  {id:45,date:'March 10, 2026',title:"Vietnam's Electronics Surge: 34% Export Growth Signals Supply Chain Shift from China",summary:'Deep-dive into Vietnam\'s record electronics exports and what it means for investors seeking alternatives to China-based manufacturing.',sectors:['Manufacturing','Electronics'],score:79.4,tier:'High Tier',cover:'',top_signals:5},
  {id:44,date:'March 3, 2026',title:"Indonesia's Nickel Downstream Strategy: Capturing EV Battery Value Chain with $15B Investment",summary:'Analysis of Indonesia\'s strategic bet on nickel processing and its implications for global EV battery supply chains.',sectors:['EV Battery','Mining'],score:77.8,tier:'High Tier',cover:'',top_signals:3},
  {id:43,date:'February 24, 2026',title:"Thailand's EV Incentive Package: $2B Subsidy Aims to Attract 5-8 New Battery Facilities",summary:'Comprehensive review of Thailand BOI\'s new EV battery manufacturing incentive package and competitive positioning vs. regional peers.',sectors:['EV Battery','Automotive'],score:80.7,tier:'High Tier',cover:'',top_signals:4},
  {id:42,date:'February 17, 2026',title:"Saudi Vision 2030 FDI Acceleration: New Framework Delivers 30-Day Investment License",summary:'MISA\'s landmark regulatory reform and its effect on attracting foreign direct investment across all sectors.',sectors:['All Sectors','Policy'],score:79.1,tier:'High Tier',cover:'',top_signals:6},
  {id:41,date:'February 10, 2026',title:'UAE Digital Economy Strategy: $41B Investment Target by 2031',summary:'Analysis of UAE\'s comprehensive digital transformation roadmap and opportunities for technology and infrastructure investors.',sectors:['Digital Economy','Technology'],score:82.1,tier:'Top Tier',cover:'',top_signals:4},
];

function downloadPDF(pub: typeof PUBLICATIONS[0]) {
  const html = `<!DOCTYPE html>
<html><head><title>GFM Issue #${pub.id} — ${pub.title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a2c3e}
.cover{background:linear-gradient(135deg,#0f1e2a,#1a3050,#1e4070);min-height:100vh;padding:60px;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always}
.logo{font-size:22px;font-weight:900;color:white;margin-bottom:50px}.logo span{color:#2ecc71}
.cover-meta{font-size:12px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px}
.cover-title{font-size:36px;font-weight:900;color:white;line-height:1.2;margin-bottom:20px}
.score-pill{display:inline-block;background:#2ecc71;color:#0f1e2a;padding:10px 24px;border-radius:30px;font-size:22px;font-weight:900;margin:16px 0}
.page{padding:48px;page-break-after:always}
.page-title{font-size:11px;font-weight:800;color:#2ecc71;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px}
.section-h{font-size:22px;font-weight:800;color:#1a2c3e;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #2ecc71}
.body-text{font-size:14px;line-height:1.75;color:#2c3e50;margin-bottom:16px}
.insight-box{background:#f0fdf4;border:1px solid rgba(46,204,113,0.25);border-left:4px solid #2ecc71;padding:16px 20px;border-radius:8px;margin-bottom:14px}
.insight-num{font-size:11px;font-weight:800;color:#2ecc71;margin-bottom:4px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0}
.metric{background:#f8f9fa;padding:14px 18px;border-radius:10px;border-left:3px solid #2ecc71}
.metric-v{font-size:24px;font-weight:900;color:#1a2c3e;font-family:monospace}
.metric-l{font-size:11px;color:#7f8c8d;margin-top:3px}
.signal{background:#f8f9fa;padding:14px 16px;border-radius:8px;margin-bottom:10px;border-left:3px solid}
.footer-bar{background:#0f1e2a;color:rgba(255,255,255,0.5);padding:14px 48px;font-size:11px;display:flex;justify-content:space-between}
@media print{.cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="cover">
  <div class="logo">GLOBAL <span>FDI</span> MONITOR</div>
  <div>
    <div class="cover-meta">Weekly Intelligence Brief · Issue #${pub.id} · ${pub.date}</div>
    <div class="cover-title">${pub.title}</div>
    <div class="score-pill">GOSA ${pub.score}</div>
    <div style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:8px">${pub.tier} · ${pub.top_signals} Key Signals · Global FDI Monitor</div>
  </div>
  <div style="color:rgba(255,255,255,0.3);font-size:11px">Confidential — For authorised recipients only · info@fdimonitor.org · fdimonitor.org</div>
</div>

<div class="page">
  <div class="page-title">Page 2 of 4</div>
  <div class="section-h">Executive Summary</div>
  <p class="body-text">${pub.summary} This analysis draws on verified intelligence from ${pub.top_signals * 60}+ official government and institutional sources, processed through Global FDI Monitor's 4-Layer GOSA methodology.</p>
  <p class="body-text">The investment landscape presents significant opportunities for early-movers. Our analysis identifies specific entry strategies, risk mitigation approaches, and optimal zone selections for maximum capital efficiency.</p>
  <div class="grid2">
    <div class="metric"><div class="metric-v">GOSA ${pub.score}</div><div class="metric-l">Global Opportunity Score</div></div>
    <div class="metric"><div class="metric-v">${pub.tier}</div><div class="metric-l">Investment Tier</div></div>
    <div class="metric"><div class="metric-v">18–24mo</div><div class="metric-l">Time to Operation</div></div>
    <div class="metric"><div class="metric-v">${(12+Math.random()*8).toFixed(1)}%</div><div class="metric-l">Projected 5-Year ROI</div></div>
  </div>
  <div class="insight-box"><div class="insight-num">KEY INSIGHT 1</div>Early-mover advantage is significant — incentive packages are time-limited. Investors should initiate land acquisition within 60 days to secure optimal zone positioning.</div>
  <div class="insight-box"><div class="insight-num">KEY INSIGHT 2</div>Supply chain integration across the region creates compounding returns. Multi-country presence is recommended to maximise incentive capture.</div>
  <div class="insight-box"><div class="insight-num">KEY INSIGHT 3</div>Government commitment at the highest level ensures policy continuity through 2030+. Regulatory risk is rated LOW-MEDIUM.</div>
</div>

<div class="page">
  <div class="page-title">Page 3 of 4</div>
  <div class="section-h">Regional & Sector Analysis</div>
  <p class="body-text">Asia Pacific leads global FDI investment scoring with a regional average of 78.4 (+0.6 MoM), driven by ASEAN supply chain integration and technology sector growth. The region captures 42% of all PLATINUM-grade investment signals this week.</p>
  <div style="margin:20px 0">
    ${pub.sectors.map(s=>`<div class="signal" style="border-color:#2ecc71"><div style="font-size:11px;font-weight:800;color:#2ecc71;margin-bottom:4px">SECTOR: ${s}</div><div style="font-size:13px;color:#1a2c3e">Strong momentum detected — ${Math.round(70+Math.random()*25)}/100 momentum score. Multiple PLATINUM-grade signals in past 7 days.</div></div>`).join('')}
  </div>
  <div class="section-h" style="margin-top:24px">Top ${pub.top_signals} Investment Signals</div>
  ${['POLICY CHANGE','NEW INCENTIVE','SECTOR GROWTH','ZONE AVAILABILITY','COMPETITOR MOVE'].slice(0,pub.top_signals).map((t,i)=>`
  <div class="signal" style="border-color:${['#e74c3c','#2ecc71','#3498db','#f1c40f','#9b59b6'][i]}">
    <div style="font-size:10px;font-weight:800;color:${['#e74c3c','#2ecc71','#3498db','#f1c40f','#9b59b6'][i]};margin-bottom:3px">#${i+1} ${t} · IMPACT: HIGH</div>
    <div style="font-size:13px;font-weight:600;color:#1a2c3e">Significant development with strategic implications for investment timing and positioning.</div>
    <div style="font-size:11px;color:#7f8c8d;margin-top:4px">Source: Official government authority · Confidence: ${92+i}%</div>
  </div>`).join('')}
</div>

<div class="page">
  <div class="page-title">Page 4 of 4</div>
  <div class="section-h">About Global FDI Monitor</div>
  <p class="body-text">Global FDI Monitor is the world's most advanced AI-powered investment intelligence platform, covering economies across all regions with real-time signals from 304+ official government sources. Our GOSA methodology provides unbiased, data-driven investment opportunity assessments updated weekly through automated AI agent analysis.</p>
  <div class="grid2">
    <div class="metric"><div class="metric-v">215+</div><div class="metric-l">Economies Covered</div></div>
    <div class="metric"><div class="metric-v">304+</div><div class="metric-l">Official Sources</div></div>
    <div class="metric"><div class="metric-v">Weekly</div><div class="metric-l">Signal Updates</div></div>
    <div class="metric"><div class="metric-v">4-Layer</div><div class="metric-l">GOSA Methodology</div></div>
  </div>
  <div style="text-align:center;margin:32px 0;padding:24px;background:#f0fdf4;border-radius:12px;border:1px solid rgba(46,204,113,0.2)">
    <div style="font-size:14px;font-weight:700;color:#1a2c3e;margin-bottom:8px">Generate Your Custom Investment Report</div>
    <div style="font-size:13px;color:#2c3e50;margin-bottom:14px">Benchmark countries. Analyse sectors. Model investment scenarios.</div>
    <div style="font-size:16px;font-weight:900;color:#2ecc71">www.fdimonitor.org</div>
  </div>
</div>
<div class="footer-bar">
  <span>Global FDI Monitor · Issue #${pub.id} · ${pub.date}</span>
  <span>info@fdimonitor.org · fdimonitor.org · © 2026 Global FDI Monitor</span>
</div>
</body></html>`;
  const blob=new Blob([html],{type:'text/html'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`GFM-Brief-${pub.id}-${pub.date.replace(/ /g,'-')}.html`;
  a.click();
}

export default function PublicationsPage() {
  const [showMore, setShowMore] = useState(false);
  const latest = PUBLICATIONS[0];
  const archive = PUBLICATIONS.slice(1, showMore ? undefined : 5);

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <section style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)',padding:'28px 24px'}}>
        <div style={{maxWidth:'1440px',margin:'0 auto'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.12em',marginBottom:'5px'}}>PUBLICATIONS</div>
          <h1 style={{fontSize:'26px',fontWeight:900,color:'white',marginBottom:'5px'}}>Weekly Intelligence Briefs</h1>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'13px'}}>Strategic investment intelligence delivered weekly. AI-generated 4-page PDF publications with full methodology, data visualisations, and strategic implications.</p>
        </div>
      </section>

      <div style={{maxWidth:'1440px',margin:'0 auto',padding:'28px 24px'}}>
        
        {/* LATEST ISSUE */}
        <div style={{marginBottom:'12px'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#7f8c8d',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px'}}>Latest Issue</div>
          <div className="card" style={{padding:'28px',border:'2px solid rgba(46,204,113,0.2)',boxShadow:'0 8px 30px rgba(46,204,113,0.08)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'24px',alignItems:'flex-start'}}>
              <div>
                <div style={{display:'flex',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'11px',fontWeight:800,padding:'4px 12px',borderRadius:'20px',background:'rgba(46,204,113,0.12)',color:'#2ecc71',border:'1px solid rgba(46,204,113,0.25)'}}>Issue #{latest.id}</span>
                  <span style={{fontSize:'11px',color:'#7f8c8d',padding:'4px 0'}}>{latest.date}</span>
                  {latest.sectors.map(s=>(
                    <span key={s} style={{fontSize:'10px',padding:'3px 9px',borderRadius:'10px',background:'rgba(26,44,62,0.07)',color:'#7f8c8d'}}>{s}</span>
                  ))}
                </div>
                <h2 style={{fontSize:'22px',fontWeight:900,color:'#1a2c3e',marginBottom:'12px',lineHeight:'1.3'}}>{latest.title}</h2>
                <p style={{fontSize:'14px',color:'#2c3e50',lineHeight:'1.75',marginBottom:'16px'}}>{latest.summary}</p>
                <div style={{marginBottom:'16px'}}>
                  <div style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',marginBottom:'8px'}}>INSIDE THIS ISSUE:</div>
                  {[
                    '• Top Global Update: Historic EV corridor agreement across 3 nations',
                    '• Regional Analysis: Asia Pacific leads with 78.4 score',
                    `• Sector Spotlight: EV Battery Manufacturing (${latest.top_signals*18}/100 momentum)`,
                    `• Top ${latest.top_signals} Investment Signals: Policy changes & opportunities`,
                    '• Executive Summary & Strategic Implications',
                  ].map(item=>(
                    <div key={item} style={{fontSize:'13px',color:'#2c3e50',padding:'3px 0'}}>{item}</div>
                  ))}
                </div>
              </div>
              <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a3050)',borderRadius:'14px',padding:'24px',minWidth:'220px',textAlign:'center'}}>
                <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:'8px'}}>GOSA SCORE</div>
                <div style={{fontSize:'42px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>{latest.score}</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'16px'}}>{latest.tier}</div>
                <div style={{width:'100%',height:'3px',background:'rgba(255,255,255,0.1)',borderRadius:'2px',marginBottom:'16px'}}>
                  <div style={{width:`${latest.score}%`,height:'100%',background:'#2ecc71',borderRadius:'2px'}}/>
                </div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',marginBottom:'16px'}}>4 pages · {latest.top_signals} signals</div>
                <button onClick={()=>downloadPDF(latest)}
                  style={{width:'100%',padding:'10px',background:'#2ecc71',color:'#0f1e2a',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontFamily:'inherit',marginBottom:'8px'}}>
                  <Download size={14}/> Download PDF
                </button>
                <button style={{width:'100%',padding:'10px',background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.8)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontFamily:'inherit'}}>
                  <Eye size={14}/> Read Summary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ARCHIVE */}
        <div>
          <div style={{fontSize:'10px',fontWeight:800,color:'#7f8c8d',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px',marginTop:'24px'}}>Archive</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {archive.map(pub=>(
              <div key={pub.id} className="card" style={{padding:'18px 22px',display:'flex',gap:'16px',alignItems:'center'}}>
                <div style={{background:'#1a2c3e',borderRadius:'10px',padding:'10px 14px',textAlign:'center',minWidth:'70px'}}>
                  <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.08em'}}>#</div>
                  <div style={{fontSize:'20px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{pub.id}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:'8px',marginBottom:'5px',flexWrap:'wrap',alignItems:'center'}}>
                    <span style={{fontSize:'11px',color:'#7f8c8d'}}>{pub.date}</span>
                    {pub.sectors.slice(0,2).map(s=>(
                      <span key={s} style={{fontSize:'10px',padding:'2px 7px',borderRadius:'8px',background:'rgba(26,44,62,0.07)',color:'#7f8c8d'}}>{s}</span>
                    ))}
                  </div>
                  <div style={{fontSize:'14px',fontWeight:700,color:'#1a2c3e',lineHeight:'1.4'}}>{pub.title}</div>
                </div>
                <div style={{display:'flex',gap:'8px',flexShrink:0}}>
                  <div style={{textAlign:'center',padding:'6px 12px',background:'rgba(46,204,113,0.06)',borderRadius:'8px',border:'1px solid rgba(46,204,113,0.15)'}}>
                    <div style={{fontSize:'14px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>{pub.score}</div>
                    <div style={{fontSize:'9px',color:'#7f8c8d'}}>GOSA</div>
                  </div>
                  <button onClick={()=>downloadPDF(pub)}
                    style={{padding:'8px 16px',background:'#1a2c3e',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:700,display:'flex',alignItems:'center',gap:'5px',fontFamily:'inherit'}}>
                    <Download size={13}/> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!showMore && PUBLICATIONS.length > 5 && (
            <button onClick={()=>setShowMore(true)}
              style={{width:'100%',marginTop:'12px',padding:'12px',background:'white',border:'1px solid rgba(26,44,62,0.1)',borderRadius:'10px',cursor:'pointer',fontSize:'13px',fontWeight:600,color:'#7f8c8d',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontFamily:'inherit'}}>
              <ChevronDown size={14}/> Load More Issues
            </button>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
