'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Target, MapPin, Clock, DollarSign, CheckCircle, ChevronRight } from 'lucide-react';

const TEMPLATES = [
  { id:'market_entry', title:'Market Entry Assessment', icon:'🌏', desc:'Evaluate a new country for initial FDI entry. Covers regulatory, tax, zones, and market intelligence layers.', steps:['Country GOSA Analysis','Sector Opportunity Mapping','Zone Selection','Incentive Identification','Risk Assessment','Entry Roadmap'] },
  { id:'site_selection', title:'Investment Zone Site Selection', icon:'📍', desc:'Compare specific investment zones across multiple countries for optimal site selection.', steps:['Zone Shortlist (3-5 zones)','Infrastructure Assessment','Cost Comparison','Tenant Mix Analysis','Incentive Stack','Recommendation Report'] },
  { id:'benchmark', title:'Competitive Benchmarking', icon:'📊', desc:'Benchmark your target location against 4 competitor economies across all scoring layers.', steps:['Select Benchmark Peers','GOSA Comparison','DB Indicators Deep-dive','Market Signals Comparison','Incentive Gap Analysis','Strategic Summary'] },
  { id:'impact', title:'Investment Impact Modeling', icon:'📈', desc:'Project economic impact, ROI, and incentive capture for a specific investment scenario.', steps:['Define Investment Parameters','GDP & Jobs Projection','Incentive Valuation','Risk Quantification','Sensitivity Analysis','Board-ready Report'] },
];

const RECENT = [
  { name:'Vietnam EV Battery Entry Assessment', type:'Market Entry', created:'Mar 18, 2026', status:'Complete', score:79.4 },
  { name:'ASEAN Data Center Site Selection', type:'Site Selection', created:'Mar 12, 2026', status:'Complete', score:82.1 },
  { name:'SEA vs Middle East Manufacturing', type:'Benchmark', created:'Mar 5, 2026', status:'Draft', score:null },
];

export default function PMP() {
  const [selected, setSelected] = useState<string|null>(null);
  const [step, setStep] = useState(0);

  const tmpl = TEMPLATES.find(t=>t.id===selected);

  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)', padding:'22px 24px', borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1440px', margin:'0 auto'}}>
          <div style={{fontSize:'10px', fontWeight:800, color:'#2ecc71', letterSpacing:'0.12em', marginBottom:'4px'}}>MISSION PLANNING</div>
          <h1 style={{fontSize:'22px', fontWeight:900, color:'white', marginBottom:'4px'}}>Investment Mission Planner</h1>
          <p style={{fontSize:'13px', color:'rgba(255,255,255,0.6)'}}>Structured intelligence workflows for investment decision-making · Guided by GOSA methodology</p>
        </div>
      </div>

      <div style={{maxWidth:'1440px', margin:'0 auto', padding:'24px'}}>
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px', alignItems:'start'}}>
          <div>
            {!selected ? (
              <>
                <div style={{fontSize:'13px', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'14px'}}>Select Mission Template</div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'24px'}}>
                  {TEMPLATES.map(t=>(
                    <div key={t.id} onClick={()=>setSelected(t.id)}
                      style={{background:'white', borderRadius:'14px', padding:'22px', cursor:'pointer', border:'2px solid rgba(26,44,62,0.07)',
                        boxShadow:'0 4px 6px -2px rgba(0,0,0,0.05)', transition:'all 0.2s'}}>
                      <div style={{fontSize:'28px', marginBottom:'10px'}}>{t.icon}</div>
                      <div style={{fontSize:'15px', fontWeight:800, color:'#1a2c3e', marginBottom:'6px'}}>{t.title}</div>
                      <div style={{fontSize:'12px', color:'#7f8c8d', lineHeight:'1.6', marginBottom:'14px'}}>{t.desc}</div>
                      <div style={{fontSize:'11px', color:'#2ecc71', fontWeight:700, display:'flex', alignItems:'center', gap:'4px'}}>
                        Start Mission <ChevronRight size={12}/>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{background:'white', borderRadius:'14px', border:'1px solid rgba(26,44,62,0.08)', overflow:'hidden'}}>
                <div style={{background:'#1a2c3e', padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', marginBottom:'4px'}}>ACTIVE MISSION</div>
                    <div style={{fontSize:'18px', fontWeight:800, color:'white'}}>{tmpl?.icon} {tmpl?.title}</div>
                  </div>
                  <button onClick={()=>{setSelected(null);setStep(0);}}
                    style={{padding:'6px 14px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'7px',
                      color:'white', cursor:'pointer', fontSize:'12px', fontFamily:'inherit'}}>
                    ← Back
                  </button>
                </div>
                {/* Steps progress */}
                <div style={{padding:'20px 22px', borderBottom:'1px solid rgba(26,44,62,0.06)', display:'flex', gap:'0', overflowX:'auto'}}>
                  {tmpl?.steps.map((s,i)=>(
                    <div key={i} style={{display:'flex', alignItems:'center', flexShrink:0}}>
                      <div onClick={()=>setStep(i)} style={{display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', minWidth:'80px'}}>
                        <div style={{width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:800,
                          background:i<step?'#2ecc71':i===step?'#1a2c3e':'rgba(26,44,62,0.08)',
                          color:i<=step?'white':'#7f8c8d', marginBottom:'4px'}}>
                          {i<step?'✓':i+1}
                        </div>
                        <div style={{fontSize:'9px', color:i===step?'#1a2c3e':'#7f8c8d', fontWeight:i===step?700:400, textAlign:'center', maxWidth:'70px', lineHeight:'1.3'}}>{s}</div>
                      </div>
                      {i<tmpl.steps.length-1 && <div style={{width:'30px', height:'1px', background:'rgba(26,44,62,0.12)', margin:'0 4px 20px'}}/>}
                    </div>
                  ))}
                </div>
                <div style={{padding:'24px 22px'}}>
                  <div style={{fontSize:'16px', fontWeight:700, color:'#1a2c3e', marginBottom:'16px'}}>{tmpl?.steps[step]}</div>
                  {step===0 && (
                    <div>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                        {[['Target Country','Select Economy'],['Primary Sector','Select Sector'],['Investment Size','Select Range'],['Timeline','Select Timeframe']].map(([l,p])=>(
                          <div key={l}>
                            <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', display:'block', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.05em'}}>{l}</label>
                            <select style={{width:'100%', padding:'9px 12px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'8px', fontSize:'13px', fontFamily:'inherit', outline:'none', background:'white'}}>
                              <option>{p}</option>
                              {l==='Target Country'&&['Vietnam','Malaysia','Thailand','Indonesia','UAE','Saudi Arabia'].map(c=><option key={c}>{c}</option>)}
                              {l==='Primary Sector'&&['EV Battery','Data Centers','Manufacturing','Renewables','Semiconductors'].map(s=><option key={s}>{s}</option>)}
                              {l==='Investment Size'&&['$10M-$50M','$50M-$250M','$250M-$1B','$1B+'].map(s=><option key={s}>{s}</option>)}
                              {l==='Timeline'&&['6-12 months','1-2 years','2-5 years','5+ years'].map(s=><option key={s}>{s}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {step>0 && step<4 && (
                    <div style={{padding:'20px', background:'rgba(46,204,113,0.04)', borderRadius:'12px', border:'1px dashed rgba(46,204,113,0.25)', textAlign:'center'}}>
                      <div style={{fontSize:'24px', marginBottom:'8px'}}>⚙️</div>
                      <div style={{fontSize:'13px', color:'#7f8c8d'}}>AGT-04 GOSA Scoring Engine processing {tmpl?.steps[step]}...</div>
                    </div>
                  )}
                  {step===5 && (
                    <div>
                      <div style={{padding:'18px', background:'rgba(46,204,113,0.06)', borderRadius:'12px', border:'1px solid rgba(46,204,113,0.2)', marginBottom:'14px'}}>
                        <div style={{fontSize:'12px', fontWeight:700, color:'#2ecc71', marginBottom:'8px'}}>MISSION COMPLETE — GOSA Score: 79.4</div>
                        <div style={{fontSize:'13px', color:'#1a2c3e'}}>All 6 mission steps completed. Your investment assessment is ready for download.</div>
                      </div>
                      <Link href="/reports" style={{display:'inline-block', padding:'10px 22px', background:'#2ecc71', color:'#0f1e2a', borderRadius:'9px', textDecoration:'none', fontSize:'13px', fontWeight:800}}>
                        Download Full Report →
                      </Link>
                    </div>
                  )}
                  <div style={{display:'flex', justifyContent:'space-between', marginTop:'20px'}}>
                    <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
                      style={{padding:'9px 18px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'8px', background:'white', cursor:step===0?'not-allowed':'pointer', fontSize:'12px', fontWeight:600, color:'#7f8c8d', fontFamily:'inherit', opacity:step===0?0.4:1}}>
                      ← Previous
                    </button>
                    <button onClick={()=>setStep(s=>Math.min((tmpl?.steps.length||6)-1,s+1))} disabled={step===(tmpl?.steps.length||6)-1}
                      style={{padding:'9px 18px', background:'#1a2c3e', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit', opacity:step===(tmpl?.steps.length||6)-1?0.4:1}}>
                      Next Step →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent missions */}
          <div>
            <div style={{fontSize:'13px', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'14px'}}>Recent Missions</div>
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              {RECENT.map(m=>(
                <div key={m.name} style={{background:'white', borderRadius:'12px', padding:'14px 16px', border:'1px solid rgba(26,44,62,0.08)'}}>
                  <div style={{fontSize:'12px', fontWeight:700, color:'#1a2c3e', marginBottom:'4px', lineHeight:'1.4'}}>{m.name}</div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'6px'}}>
                    <div style={{fontSize:'10px', color:'#7f8c8d'}}>{m.type} · {m.created}</div>
                    <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
                      {m.score && <span style={{fontSize:'11px', fontWeight:800, color:'#2ecc71', fontFamily:"'JetBrains Mono',monospace"}}>{m.score}</span>}
                      <span style={{fontSize:'9px', fontWeight:800, padding:'2px 7px', borderRadius:'8px', background:m.status==='Complete'?'rgba(46,204,113,0.1)':'rgba(241,196,15,0.1)', color:m.status==='Complete'?'#1e8449':'#7a6400'}}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/reports" style={{display:'block', padding:'10px', background:'rgba(26,44,62,0.04)', border:'1px dashed rgba(26,44,62,0.15)', borderRadius:'12px', textDecoration:'none', fontSize:'12px', fontWeight:600, color:'#7f8c8d', textAlign:'center'}}>
                + New Mission
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
