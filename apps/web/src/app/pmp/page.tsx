'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Target, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';

const TEMPLATES = [
  {id:'market_entry',emoji:'🌏',title:'Market Entry Assessment',color:'var(--accent-green)',desc:'Evaluate a new country for FDI entry. Covers regulatory, tax, zones, and market intelligence.',steps:['Country GOSA Analysis','Sector Opportunity Mapping','Zone Selection','Incentive Identification','Risk Assessment','Entry Roadmap']},
  {id:'site_selection',emoji:'📍',title:'Investment Zone Site Selection',color:'var(--accent-blue)',desc:'Compare specific investment zones across multiple countries for optimal site selection.',steps:['Zone Shortlist (3-5)','Infrastructure Assessment','Cost Comparison','Tenant Mix Analysis','Incentive Stack','Recommendation Report']},
  {id:'benchmark',emoji:'📊',title:'Competitive Benchmarking',color:'#ffd700',desc:'Benchmark target location against 4 competitor economies across all GOSA scoring layers.',steps:['Select Benchmark Peers','GOSA Comparison','DB Indicators Deep-dive','Market Signals Compare','Incentive Gap Analysis','Strategic Summary']},
  {id:'impact',emoji:'📈',title:'Investment Impact Modeling',color:'#9b59b6',desc:'Project economic impact, ROI, and incentive capture for a specific investment scenario.',steps:['Define Parameters','GDP & Jobs Projection','Incentive Valuation','Risk Quantification','Sensitivity Analysis','Board-ready Report']},
];

const RECENT = [
  {name:'Vietnam EV Battery Entry Assessment',type:'Market Entry',date:'Mar 18, 2026',status:'Complete',score:79.4,color:'var(--accent-green)'},
  {name:'ASEAN Data Center Site Selection',type:'Site Selection',date:'Mar 12, 2026',status:'Complete',score:82.1,color:'var(--accent-blue)'},
  {name:'SEA vs Middle East Manufacturing',type:'Benchmark',date:'Mar 5, 2026',status:'Draft',score:null,color:'#ffd700'},
];

export default function PMP(){
  const [selected,setSelected]=useState<string|null>(null);
  const [step,setStep]=useState(0);
  const tmpl=TEMPLATES.find(t=>t.id===selected);

  return(
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#FFFFFF,#060f1a)',padding:'28px 24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'6px',fontFamily:'var(--font-display)'}}>MISSION PLANNING</div>
          <h1 style={{fontSize:'24px',fontWeight:900,color:'var(--text-primary)',marginBottom:'4px'}}>Investment Mission Planner</h1>
          <p style={{fontSize:'13px',color:'var(--text-muted)'}}>Structured intelligence workflows for investment decision-making · Guided by GOSA methodology</p>
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'20px',alignItems:'start'}}>
          <div>
            {!selected?(
              <>
                <div style={{fontSize:'10px',fontWeight:800,color:'#27ae60',letterSpacing:'0.15em',marginBottom:'14px',fontFamily:'var(--font-display)'}}>SELECT MISSION TEMPLATE</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'24px'}}>
                  {TEMPLATES.map(t=>(
                    <div key={t.id} onClick={()=>setSelected(t.id)}
                      style={{padding:'24px',background:'white',border:`1px solid rgba(255,255,255,0.05)`,borderRadius:'14px',cursor:'pointer',transition:'all 250ms ease',position:'relative',overflow:'hidden'}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${t.color}25`;e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${t.color}15`;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.05)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                      <div style={{position:'absolute',top:0,right:0,width:'80px',height:'80px',background:`radial-gradient(circle at top right, ${t.color}08, transparent)`,pointerEvents:'none'}}/>
                      <div style={{fontSize:'32px',marginBottom:'12px'}}>{t.emoji}</div>
                      <div style={{fontSize:'16px',fontWeight:800,color:'var(--text-primary)',marginBottom:'8px'}}>{t.title}</div>
                      <div style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:1.65,marginBottom:'16px'}}>{t.desc}</div>
                      <div style={{fontSize:'12px',color:t.color,fontWeight:700,display:'flex',alignItems:'center',gap:'5px'}}>
                        Start Mission <ChevronRight size={12}/>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ):(
              <div style={{background:'white',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
                <div style={{background:'var(--bg-subtle)',padding:'18px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(0,255,200,0.06)'}}>
                  <div>
                    <div style={{fontSize:'10px',color:'#27ae60',letterSpacing:'0.1em',marginBottom:'4px',fontFamily:'var(--font-display)'}}>ACTIVE MISSION</div>
                    <div style={{fontSize:'18px',fontWeight:800,color:'var(--text-primary)'}}>{tmpl?.emoji} {tmpl?.title}</div>
                  </div>
                  <button onClick={()=>{setSelected(null);setStep(0);}}
                    style={{padding:'7px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',color:'var(--text-secondary)',cursor:'pointer',fontSize:'12px',fontFamily:'var(--font-ui)'}}>
                    ← Back
                  </button>
                </div>
                {/* Steps */}
                <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',gap:'0',overflowX:'auto'}}>
                  {tmpl?.steps.map((s,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',flexShrink:0}}>
                      <div onClick={()=>setStep(i)} style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer',minWidth:'90px',padding:'0 4px'}}>
                        <div style={{width:'30px',height:'30px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:800,marginBottom:'5px',transition:'all 200ms',background:i<step?`${tmpl.steps?TEMPLATES.find(t=>t.id===selected)?.color||'#2ECC71':'#2ECC71'}`:i===step?'rgba(46,204,113,0.15)':'rgba(255,255,255,0.05)',border:`1px solid ${i<=step?'#27ae60':'rgba(255,255,255,0.08)'}`,color:i<=step?'#2ECC71':'rgba(232,244,248,0.3)'}}>
                          {i<step?'✓':i+1}
                        </div>
                        <div style={{fontSize:'9px',color:i===step?'#e8f4f8':'rgba(232,244,248,0.3)',fontWeight:i===step?700:400,textAlign:'center',maxWidth:'80px',lineHeight:1.3}}>{s}</div>
                      </div>
                      {i<(tmpl?.steps.length||0)-1&&<div style={{width:'24px',height:'1px',background:'rgba(46,204,113,0.1)',margin:'0 2px 20px'}}/>}
                    </div>
                  ))}
                </div>
                <div style={{padding:'24px 22px'}}>
                  <div style={{fontSize:'16px',fontWeight:700,color:'var(--text-primary)',marginBottom:'16px'}}>{tmpl?.steps[step]}</div>
                  {step===0&&(
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                      {[['Target Country','Select Economy'],['Primary Sector','Select Sector'],['Investment Size','Select Range'],['Timeline','Select Timeframe']].map(([l,p])=>(
                        <div key={l}>
                          <label style={{fontSize:'10px',fontWeight:700,color:'#27ae60',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{l}</label>
                          <select style={{width:'100%',padding:'9px 12px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'12px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)'}}>
                            <option style={{background:'white'}}>{p}</option>
                            {l==='Target Country'&&['Vietnam','Malaysia','Thailand','Indonesia','UAE','Saudi Arabia'].map(c=><option key={c} style={{background:'white'}}>{c}</option>)}
                            {l==='Primary Sector'&&['EV Battery','Data Centers','Manufacturing','Renewables','Semiconductors'].map(s=><option key={s} style={{background:'white'}}>{s}</option>)}
                            {l==='Investment Size'&&['$10M-$50M','$50M-$250M','$250M-$1B','$1B+'].map(s=><option key={s} style={{background:'white'}}>{s}</option>)}
                            {l==='Timeline'&&['6-12 months','1-2 years','2-5 years','5+ years'].map(s=><option key={s} style={{background:'white'}}>{s}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                  {step>0&&step<5&&(
                    <div style={{padding:'24px',background:'rgba(0,255,200,0.03)',borderRadius:'12px',border:'1px dashed rgba(0,255,200,0.15)',textAlign:'center'}}>
                      <div style={{fontSize:'28px',marginBottom:'10px'}}>⚙️</div>
                      <div style={{fontSize:'13px',color:'var(--text-muted)'}}>AGT-04 GOSA Engine processing {tmpl?.steps[step]}...</div>
                    </div>
                  )}
                  {step===5&&(
                    <div>
                      <div style={{padding:'18px',background:'rgba(0,255,200,0.05)',borderRadius:'12px',border:'1px solid rgba(0,255,200,0.15)',marginBottom:'14px'}}>
                        <div style={{fontSize:'12px',fontWeight:700,color:'var(--accent-green)',marginBottom:'8px'}}>✅ MISSION COMPLETE — GOSA Score: 79.4</div>
                        <div style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.65}}>All 6 mission steps completed. Investment assessment ready for download.</div>
                      </div>
                      <Link href="/reports" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'10px 22px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'var(--primary)',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800}}>
                        Download Full Report →
                      </Link>
                    </div>
                  )}
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:'22px'}}>
                    <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{padding:'9px 18px',border:'1px solid var(--border)',borderRadius:'8px',background:'transparent',cursor:step===0?'not-allowed':'pointer',fontSize:'12px',fontWeight:600,color:'var(--text-muted)',fontFamily:'var(--font-ui)',opacity:step===0?0.4:1}}>← Previous</button>
                    <button onClick={()=>setStep(s=>Math.min((tmpl?.steps.length||6)-1,s+1))} disabled={step===(tmpl?.steps.length||6)-1} style={{padding:'9px 20px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:700,color:'var(--accent-green)',fontFamily:'var(--font-ui)',opacity:step===(tmpl?.steps.length||6)-1?0.4:1}}>Next Step →</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent missions */}
          <div>
            <div style={{fontSize:'10px',fontWeight:800,color:'#27ae60',letterSpacing:'0.15em',marginBottom:'14px',fontFamily:'var(--font-display)'}}>RECENT MISSIONS</div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {RECENT.map(m=>(
                <div key={m.name} style={{background:'white',border:'1px solid var(--border)',borderRadius:'12px',padding:'14px 16px',transition:'border-color 200ms ease'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(46,204,113,0.25)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,180,216,0.1)';}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#1A2C3E',marginBottom:'6px',lineHeight:1.35}}>{m.name}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'6px'}}>
                    <div style={{fontSize:'10px',color:'var(--text-muted)'}}>{m.type} · {m.date}</div>
                    <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                      {m.score&&<span style={{fontSize:'14px',fontWeight:900,color:'var(--accent-green)',fontFamily:'var(--font-mono)'}}>{m.score}</span>}
                      <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:m.status==='Complete'?'rgba(46,204,113,0.1)':'rgba(255,215,0,0.1)',color:m.status==='Complete'?'#2ECC71':'#ffd700',letterSpacing:'0.06em'}}>{m.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
