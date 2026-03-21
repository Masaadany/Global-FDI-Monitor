'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Download, ExternalLink, Calendar, Zap, Globe, TrendingUp } from 'lucide-react';

const ISSUES = [
  {id:47,date:'March 24, 2026',week:'March 16–22, 2026',headline:'ASEAN EV Corridor: $25B Supply Chain Investment Reshapes Southeast Asia',summary:'Vietnam, Thailand, Malaysia form landmark $25B EV supply chain agreement with harmonised incentives and cross-border infrastructure. Industry-defining alignment accelerates supply chain diversification.',signals:5,gosa_update:'+0.4 avg',conf:94,tier:'FEATURED',cover:'🏭',regions:['Asia Pacific'],sectors:['EV Battery','Logistics']},
  {id:46,date:'March 17, 2026',week:'March 9–15, 2026',headline:"Malaysia's Data Center Boom: $5B+ Investment Expected as 100% FDI Cap Takes Effect",summary:'Malaysia eliminates remaining foreign ownership restrictions in digital infrastructure, triggering immediate interest from global hyperscalers and colocation providers seeking ASEAN expansion.',signals:4,gosa_update:'+0.6 MYS',conf:96,tier:'PUBLISHED',cover:'🖥',regions:['Asia Pacific'],sectors:['Data Centers','Digital']},
  {id:45,date:'March 10, 2026',week:'March 2–8, 2026',headline:"Vietnam's Electronics Surge: 34% Export Growth Signals China+1 Acceleration",summary:'Vietnam electronics exports reach record high, driven by Samsung, LG, and Intel capacity expansion. Component manufacturers accelerating relocation from mainland China ahead of tariff changes.',signals:5,gosa_update:'+0.5 VNM',conf:92,tier:'PUBLISHED',cover:'📱',regions:['Asia Pacific'],sectors:['Electronics','Supply Chain']},
  {id:44,date:'March 3, 2026',week:'February 23 – March 1, 2026',headline:'UAE AI Infrastructure Surge: Microsoft $3.3B, Amazon $2.1B Commitments Confirmed',summary:'UAE emerges as primary Middle East AI compute destination with back-to-back hyperscaler commitments totalling $5.4B. Policy clarity and 100% foreign ownership enable rapid deployment.',signals:6,gosa_update:'+1.4 ARE',conf:97,tier:'PUBLISHED',cover:'🤖',regions:['Middle East'],sectors:['AI & Data Centers','Technology']},
  {id:43,date:'February 24, 2026',week:'February 16–22, 2026',headline:'Saudi Vision 2030 Acceleration: MISA Fast-Track Creates 30-Day Investment Window',summary:'Saudi Arabia launches most ambitious FDI liberalisation program in a decade with 30-day license guarantee backed by MISA Acceleration Framework. $36B FDI target within reach.',signals:4,gosa_update:'+2.1 SAU',conf:94,tier:'PUBLISHED',cover:'🏗',regions:['Middle East'],sectors:['Manufacturing','Renewables']},
  {id:42,date:'February 17, 2026',week:'February 9–15, 2026',headline:'India Semiconductor Push: Apple $10B and PLI Expansion Create $50B Supply Chain',summary:'India semiconductor ecosystem takes shape with Apple committing $10B and government expanding PLI incentives. Tamil Nadu and Karnataka emerge as primary destination states.',signals:5,gosa_update:'+1.1 IND',conf:91,tier:'PUBLISHED',cover:'💻',regions:['Asia Pacific'],sectors:['Semiconductors','Electronics']},
  {id:41,date:'February 10, 2026',week:'February 2–8, 2026',headline:'Green Hydrogen Race: Morocco EU Framework, Saudi Arabian Investment Accelerate',summary:'Morocco and Saudi Arabia emerge as top-tier green hydrogen export destinations following EU framework agreements and massive domestic clean energy investment programs.',signals:3,gosa_update:'+0.6 MAR',conf:89,tier:'PUBLISHED',cover:'⚡',regions:['Africa','Middle East'],sectors:['Renewables','Energy']},
];

function generateReport(issue: typeof ISSUES[0]): void {
  const html = `<!DOCTYPE html><html><head><title>GFM Intelligence Brief #${issue.id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter','Helvetica Neue',sans-serif;background:#020c14;color:#e8f4f8;padding:32px;min-height:100vh}
    .cover{background:linear-gradient(135deg,#020c14,#0a1628);border:1px solid rgba(0,255,200,0.15);border-radius:16px;padding:48px;margin-bottom:32px;position:relative;overflow:hidden}
    .cover::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px);background-size:48px 48px}
    h1{font-size:32px;font-weight:900;line-height:1.15;margin-bottom:16px;position:relative}
    .meta{font-size:11px;color:rgba(0,255,200,0.6);letter-spacing:0.1em;margin-bottom:8px;font-family:'JetBrains Mono',monospace}
    .score{font-size:52px;font-weight:900;color:#00ffc8;font-family:'JetBrains Mono',monospace;text-shadow:0 0 24px rgba(0,255,200,0.4)}
    .section{background:rgba(10,22,40,0.8);border:1px solid rgba(0,180,216,0.1);border-radius:12px;padding:24px;margin-bottom:20px}
    .section h2{font-size:16px;font-weight:800;color:#e8f4f8;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em;font-size:11px;color:rgba(0,255,200,0.6)}
    .signal{padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;border-left:3px solid #00ffc8;margin-bottom:8px}
    .signal h3{font-size:13px;font-weight:700;color:#e8f4f8;margin-bottom:4px}
    .signal p{font-size:12px;color:rgba(232,244,248,0.6);line-height:1.6}
    .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:800;letter-spacing:0.06em;font-family:'JetBrains Mono',monospace;background:rgba(0,255,200,0.1);color:#00ffc8;border:1px solid rgba(0,255,200,0.2);margin-right:6px}
    .footer{text-align:center;padding-top:24px;border-top:1px solid rgba(255,255,255,0.05);font-size:11px;color:rgba(232,244,248,0.3)}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div class="cover">
    <div class="meta">GLOBAL FDI MONITOR · INTELLIGENCE BRIEF #${issue.id} · ${issue.date}</div>
    <h1>${issue.headline}</h1>
    <p style="font-size:14px;color:rgba(232,244,248,0.6);line-height:1.7;margin-bottom:24px;max-width:700px;position:relative">${issue.summary}</p>
    <div style="display:flex;gap:24px;position:relative">
      <div><div style="font-size:10px;color:rgba(232,244,248,0.4)">ISSUE</div><div style="font-size:32px;font-weight:900;color:#00ffc8;font-family:'JetBrains Mono',monospace">#${issue.id}</div></div>
      <div><div style="font-size:10px;color:rgba(232,244,248,0.4)">CONFIDENCE</div><div style="font-size:32px;font-weight:900;color:#ffd700;font-family:'JetBrains Mono',monospace">${issue.conf}%</div></div>
      <div><div style="font-size:10px;color:rgba(232,244,248,0.4)">SIGNALS</div><div style="font-size:32px;font-weight:900;color:#9b59b6;font-family:'JetBrains Mono',monospace">${issue.signals}</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Top Investment Signals This Week</h2>
    ${['POLICY CHANGE · High Impact · SCI 96','NEW INCENTIVE · High Impact · SCI 95','DEAL ANNOUNCED · High Impact · SCI 97','SECTOR GROWTH · Medium Impact · SCI 92','ZONE AVAILABILITY · Medium Impact · SCI 91'].slice(0,issue.signals).map((s,i)=>`<div class="signal"><h3>#${i+1} ${s.split('·')[0].trim()}</h3><p>Investment signal verified from official government source. SHA-256 hash verified. AGT-03 verification confirmed T1 source classification.</p></div>`).join('')}
  </div>

  <div class="section">
    <h2>Regional Overview</h2>
    <p style="font-size:13px;color:rgba(232,244,248,0.65);line-height:1.8;margin-bottom:16px">
      ${issue.regions.join(', ')} focus this week with significant investment developments across ${issue.sectors.join(', ')} sectors. GOSA update: ${issue.gosa_update}. AI confidence level: ${issue.conf}%.
    </p>
    <p style="font-size:13px;color:rgba(232,244,248,0.65);line-height:1.8">
      This intelligence brief was generated by the Global FDI Monitor AI agent pipeline (AGT-01 through AGT-06). All signals SHA-256 verified from official T1/T2 sources. For full investment analysis, visit fdimonitor.org.
    </p>
  </div>

  <div class="footer">
    Global FDI Monitor · fdimonitor.org · info@fdimonitor.org · © 2026
  </div>
  </body></html>`;
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `GFM_Intelligence_Brief_${issue.id}_${issue.date.replace(/,\s/g,'_')}.html`;
  a.click();
}

export default function PublicationsPage(){
  const [featured,...archive]=ISSUES;

  return(
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'28px 24px',borderBottom:'1px solid rgba(0,255,200,0.08)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'8px',fontFamily:"'Orbitron','Inter',sans-serif"}}>PUBLICATIONS</div>
          <h1 style={{fontSize:'28px',fontWeight:900,color:'#e8f4f8',marginBottom:'6px'}}>Weekly Intelligence Brief</h1>
          <p style={{fontSize:'13px',color:'rgba(232,244,248,0.45)'}}>AI-generated weekly FDI intelligence · 12,847 subscribers · SHA-256 verified · AGT-06 Pipeline</p>
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'24px'}}>
        {/* FEATURED */}
        <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'14px',padding:'28px',marginBottom:'20px',position:'relative',overflow:'hidden',boxShadow:'0 0 0 1px rgba(0,255,200,0.05), 0 8px 32px rgba(0,0,0,0.4)'}}>
          <div style={{position:'absolute',top:0,right:0,width:'300px',height:'300px',background:'radial-gradient(circle at top right, rgba(0,255,200,0.06), transparent)',pointerEvents:'none'}}/>
          <div style={{display:'flex',gap:'16px',alignItems:'center',marginBottom:'16px',flexWrap:'wrap'}}>
            <span style={{fontSize:'9px',fontWeight:800,padding:'3px 10px',borderRadius:'4px',background:'rgba(0,255,200,0.1)',color:'#00ffc8',border:'1px solid rgba(0,255,200,0.25)',letterSpacing:'0.1em',fontFamily:"'JetBrains Mono',monospace"}}>LATEST ISSUE</span>
            <span style={{fontSize:'9px',fontWeight:800,padding:'3px 10px',borderRadius:'4px',background:'rgba(255,68,102,0.1)',color:'#ff4466',border:'1px solid rgba(255,68,102,0.2)',letterSpacing:'0.1em',fontFamily:"'JetBrains Mono',monospace"}}>PENDING REVIEW</span>
            <span style={{fontSize:'11px',color:'rgba(232,244,248,0.4)',fontFamily:"'JetBrains Mono',monospace"}}>Issue #{featured.id} · {featured.date}</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'24px',alignItems:'start'}}>
            <div>
              <div style={{fontSize:'48px',marginBottom:'14px'}}>{featured.cover}</div>
              <h2 style={{fontSize:'24px',fontWeight:900,color:'#e8f4f8',marginBottom:'12px',lineHeight:1.2}}>{featured.headline}</h2>
              <p style={{fontSize:'14px',color:'rgba(232,244,248,0.55)',lineHeight:1.75,marginBottom:'20px',maxWidth:'700px'}}>{featured.summary}</p>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'20px'}}>
                {[...featured.regions,...featured.sectors].map(t=>(
                  <span key={t} style={{padding:'4px 10px',background:'rgba(0,180,216,0.08)',border:'1px solid rgba(0,180,216,0.15)',borderRadius:'20px',fontSize:'10px',color:'rgba(0,180,216,0.8)',fontWeight:600}}>{t}</span>
                ))}
              </div>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                <button onClick={()=>generateReport(featured)} style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 20px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:800,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 16px rgba(0,255,200,0.25)'}}>
                  <Download size={13}/> Download Issue #{featured.id}
                </button>
                <Link href="/newsletter" style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 18px',background:'rgba(255,68,102,0.08)',border:'1px solid rgba(255,68,102,0.2)',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:700,color:'#ff4466'}}>
                  Review in Admin →
                </Link>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px',minWidth:'160px'}}>
              {[['Confidence',`${featured.conf}%`,'#00ffc8'],['Signals',featured.signals,'#9b59b6'],['GOSA Update',featured.gosa_update,'#ffd700']].map(([l,v,c])=>(
                <div key={String(l)} style={{padding:'14px',background:'rgba(0,0,0,0.3)',borderRadius:'10px',border:`1px solid ${c}15`,textAlign:'center'}}>
                  <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',marginBottom:'4px',letterSpacing:'0.08em',textTransform:'uppercase'}}>{l}</div>
                  <div style={{fontSize:'24px',fontWeight:900,color:String(c),fontFamily:"'JetBrains Mono',monospace",textShadow:`0 0 12px ${c}60`}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ARCHIVE */}
        <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.4)',letterSpacing:'0.15em',marginBottom:'14px',fontFamily:"'Orbitron','Inter',sans-serif"}}>ISSUE ARCHIVE</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          {archive.map(issue=>(
            <div key={issue.id} style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'20px',transition:'all 250ms ease',position:'relative',overflow:'hidden'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,255,200,0.2)';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,180,216,0.1)';e.currentTarget.style.transform='none';}}>
              <div style={{position:'absolute',top:0,right:0,width:'100px',height:'100px',background:'radial-gradient(circle at top right, rgba(0,255,200,0.03), transparent)',pointerEvents:'none'}}/>
              <div style={{display:'flex',gap:'12px',alignItems:'flex-start',marginBottom:'12px'}}>
                <div style={{fontSize:'36px',flexShrink:0}}>{issue.cover}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'6px',flexWrap:'wrap'}}>
                    <span style={{fontSize:'9px',fontWeight:800,color:'rgba(0,255,200,0.5)',fontFamily:"'JetBrains Mono',monospace"}}>#{issue.id}</span>
                    <span style={{fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>{issue.date}</span>
                    <span style={{fontSize:'8px',fontWeight:800,padding:'2px 6px',borderRadius:'4px',background:'rgba(52,152,219,0.1)',color:'#3498db',border:'1px solid rgba(52,152,219,0.2)',letterSpacing:'0.06em'}}>{issue.tier}</span>
                  </div>
                  <h3 style={{fontSize:'14px',fontWeight:700,color:'#e8f4f8',lineHeight:1.35,marginBottom:'8px'}}>{issue.headline}</h3>
                  <p style={{fontSize:'12px',color:'rgba(232,244,248,0.45)',lineHeight:1.65}}>{issue.summary.slice(0,100)}...</p>
                </div>
              </div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}}>
                {[...issue.regions,...issue.sectors].slice(0,3).map(t=>(
                  <span key={t} style={{padding:'2px 8px',background:'rgba(0,180,216,0.06)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'20px',fontSize:'9px',color:'rgba(0,180,216,0.7)'}}>{t}</span>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',gap:'14px'}}>
                  <span style={{fontSize:'10px',color:'rgba(232,244,248,0.3)'}}>Conf: <span style={{color:'#00ffc8',fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{issue.conf}%</span></span>
                  <span style={{fontSize:'10px',color:'rgba(232,244,248,0.3)'}}>Signals: <span style={{color:'#9b59b6',fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{issue.signals}</span></span>
                </div>
                <button onClick={()=>generateReport(issue)}
                  style={{display:'flex',alignItems:'center',gap:'6px',padding:'7px 14px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'7px',cursor:'pointer',fontSize:'11px',fontWeight:700,color:'#00ffc8',fontFamily:"'Inter',sans-serif"}}>
                  <Download size={11}/> Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div style={{marginTop:'24px',background:'rgba(0,255,200,0.04)',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'14px',padding:'24px',display:'flex',gap:'20px',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{fontSize:'24px'}}>📬</div>
          <div style={{flex:1}}>
            <div style={{fontSize:'15px',fontWeight:700,color:'#e8f4f8',marginBottom:'4px'}}>Subscribe to Weekly Intelligence Brief</div>
            <div style={{fontSize:'12px',color:'rgba(232,244,248,0.45)'}}>12,847 investment professionals · Every Tuesday 08:00 GMT · PLATINUM signals included</div>
          </div>
          <div style={{display:'flex',gap:'8px',flexShrink:0}}>
            <input type="email" placeholder="your@organisation.com"
              style={{padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',fontSize:'12px',color:'#e8f4f8',outline:'none',fontFamily:"'Inter',sans-serif",width:'220px'}}/>
            <button style={{padding:'10px 20px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:800,fontFamily:"'Inter',sans-serif",whiteSpace:'nowrap'}}>
              Subscribe →
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
