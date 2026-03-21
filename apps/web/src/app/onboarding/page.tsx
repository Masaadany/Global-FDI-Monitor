'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, Globe, Zap, BarChart3, Target } from 'lucide-react';

const STEPS = [
  { id:'role',    icon:'👤', title:'Tell us about yourself',   sub:'Personalise your experience' },
  { id:'regions', icon:'🌍', title:'Select your focus regions', sub:'We\'ll surface the most relevant intelligence' },
  { id:'sectors', icon:'🏭', title:'Choose investment sectors', sub:'Tailor your signal feed and reports' },
  { id:'done',    icon:'🚀', title:'You\'re all set!',          sub:'Your platform is ready' },
];

const ROLES = [
  {id:'ipa',    label:'Investment Promotion Agency', icon:'🏛', desc:'Attract FDI to your country or region'},
  {id:'pe',     label:'Private Equity / VC',         icon:'💼', desc:'Screen and evaluate investment opportunities'},
  {id:'corp',   label:'Corporate Strategy',          icon:'🏢', desc:'Site selection and market entry decisions'},
  {id:'swf',    label:'Sovereign Wealth Fund',       icon:'🏦', desc:'Portfolio screening and country allocation'},
  {id:'govt',   label:'Government / Economic Dev',  icon:'🏗', desc:'Policy benchmarking and competitiveness'},
  {id:'consult',label:'Advisory / Consulting',       icon:'📊', desc:'Client intelligence and research'},
];

const REGIONS = ['Asia Pacific','Middle East','Americas','Europe','Africa','Oceania'];
const SECTORS_LIST = ['EV Battery','Data Centers','Semiconductors','Renewables','Manufacturing','AI & Technology','Financial Services','Pharmaceutical'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);

  function toggleRegion(r: string) { setRegions(p => p.includes(r)?p.filter(x=>x!==r):[...p,r]); }
  function toggleSector(s: string) { setSectors(p => p.includes(s)?p.filter(x=>x!==s):[...p,s]); }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-page)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:"'Inter','Helvetica Neue',sans-serif",position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'800px',height:'400px',background:'radial-gradient(ellipse, rgba(0,80,120,0.1), transparent)',pointerEvents:'none'}}/>

      <div style={{width:'100%',maxWidth:'640px',position:'relative'}}>
        {/* Progress */}
        <div style={{display:'flex',gap:'8px',marginBottom:'32px',justifyContent:'center'}}>
          {STEPS.map((s,i) => (
            <div key={s.id} style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:800,transition:'all 300ms',background:i<step?'#2ECC71':i===step?'rgba(46,204,113,0.15)':'rgba(255,255,255,0.06)',color:i<step?'var(--primary)':i===step?'#2ECC71':'rgba(232,244,248,0.3)',border:`1px solid ${i<=step?'rgba(46,204,113,0.5)':'rgba(255,255,255,0.07)'}`,boxShadow:i===step?'0 0 12px rgba(0,255,200,0.3)':'none'}}>
                {i < step ? '✓' : i+1}
              </div>
              {i < STEPS.length-1 && <div style={{width:'40px',height:'1px',background:`linear-gradient(90deg, ${i<step?'#2ECC71':'rgba(255,255,255,0.1)'}, ${i<step-1?'#2ECC71':'rgba(255,255,255,0.06)'})`}}/>}
            </div>
          ))}
        </div>

        {/* Panel */}
        <div style={{background:'white',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'18px',padding:'36px',boxShadow:'0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,200,0.06)'}}>
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <div style={{fontSize:'36px',marginBottom:'10px'}}>{STEPS[step].icon}</div>
            <h1 style={{fontSize:'22px',fontWeight:900,color:'var(--text-primary)',marginBottom:'5px'}}>{STEPS[step].title}</h1>
            <p style={{fontSize:'13px',color:'var(--text-muted)'}}>{STEPS[step].sub}</p>
          </div>

          {/* Step 0: Role */}
          {step === 0 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {ROLES.map(r => (
                <button key={r.id} onClick={()=>{setRole(r.id);}}
                  style={{padding:'14px',background:role===r.id?'rgba(46,204,113,0.08)':'rgba(255,255,255,0.03)',border:`1px solid ${role===r.id?'rgba(46,204,113,0.5)':'rgba(255,255,255,0.07)'}`,borderRadius:'10px',cursor:'pointer',textAlign:'left',transition:'all 150ms',fontFamily:'var(--font-ui)'}}>
                  <div style={{fontSize:'18px',marginBottom:'5px'}}>{r.icon}</div>
                  <div style={{fontSize:'12px',fontWeight:700,color:role===r.id?'#2ECC71':'rgba(232,244,248,0.8)',marginBottom:'2px'}}>{r.label}</div>
                  <div style={{fontSize:'10px',color:'var(--text-muted)',lineHeight:1.4}}>{r.desc}</div>
                  {role===r.id && <div style={{position:'absolute',top:'10px',right:'10px',color:'var(--accent-green)',fontSize:'12px'}}>✓</div>}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Regions */}
          {step === 1 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
              {REGIONS.map(r => (
                <button key={r} onClick={()=>toggleRegion(r)}
                  style={{padding:'14px 12px',background:regions.includes(r)?'rgba(46,204,113,0.08)':'rgba(255,255,255,0.03)',border:`1px solid ${regions.includes(r)?'rgba(46,204,113,0.5)':'rgba(255,255,255,0.07)'}`,borderRadius:'10px',cursor:'pointer',textAlign:'center',transition:'all 150ms',fontFamily:'var(--font-ui)',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                  <Globe size={20} color={regions.includes(r)?'#2ECC71':'rgba(232,244,248,0.4)'}/>
                  <span style={{fontSize:'12px',fontWeight:regions.includes(r)?700:400,color:regions.includes(r)?'#2ECC71':'rgba(232,244,248,0.7)'}}>{r}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Sectors */}
          {step === 2 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {SECTORS_LIST.map(s => (
                <button key={s} onClick={()=>toggleSector(s)}
                  style={{padding:'12px',background:sectors.includes(s)?'rgba(46,204,113,0.08)':'rgba(255,255,255,0.03)',border:`1px solid ${sectors.includes(s)?'rgba(46,204,113,0.5)':'rgba(255,255,255,0.07)'}`,borderRadius:'10px',cursor:'pointer',textAlign:'left',transition:'all 150ms',fontFamily:'var(--font-ui)',display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'20px',height:'20px',borderRadius:'50%',border:`2px solid ${sectors.includes(s)?'#2ECC71':'rgba(255,255,255,0.15)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 150ms',background:sectors.includes(s)?'#2ECC71':'transparent'}}>
                    {sectors.includes(s) && <span style={{fontSize:'10px',color:'var(--primary)',fontWeight:900}}>✓</span>}
                  </div>
                  <span style={{fontSize:'12px',fontWeight:sectors.includes(s)?700:400,color:sectors.includes(s)?'#2ECC71':'rgba(232,244,248,0.7)'}}>{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div style={{textAlign:'center'}}>
              <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'rgba(46,204,113,0.1)',border:'2px solid rgba(0,255,200,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 0 24px rgba(0,255,200,0.2)'}}>
                <CheckCircle size={36} color="#00ffc8" style={{filter:'drop-shadow(0 0 10px rgba(0,255,200,0.6))'}}/>
              </div>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap',justifyContent:'center',marginBottom:'20px'}}>
                {[['Role',ROLES.find(r=>r.id===role)?.label||'—'],['Regions',regions.length>0?regions.join(', '):'All'],['Sectors',sectors.length>0?sectors.join(', '):'All']].map(([k,v])=>(
                  <div key={k} style={{padding:'8px 14px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.1)',borderRadius:'8px',fontSize:'11px',color:'var(--text-secondary)'}}>
                    <span style={{color:'#2ECC71',fontWeight:700,marginRight:'5px'}}>{k}:</span>{v as string}
                  </div>
                ))}
              </div>
              <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:1.75,marginBottom:'20px'}}>
                Your platform is personalised and ready. Head to the dashboard to explore live GOSA scores, signals, and your GFR ranking.
              </p>
              <Link href="/dashboard" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 32px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'var(--primary)',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:800,boxShadow:'0 4px 16px rgba(0,255,200,0.3)'}}>
                Go to Dashboard <ChevronRight size={15}/>
              </Link>
            </div>
          )}

          {/* Nav buttons */}
          {step < 3 && (
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'24px',alignItems:'center'}}>
              <button onClick={()=>step>0&&setStep(step-1)} disabled={step===0}
                style={{padding:'9px 18px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'9px',cursor:step===0?'not-allowed':'pointer',fontSize:'12px',fontWeight:600,color:step===0?'rgba(232,244,248,0.2)':'rgba(232,244,248,0.55)',fontFamily:'var(--font-ui)',opacity:step===0?0.4:1}}>
                ← Back
              </button>
              <button onClick={()=>setStep(s=>Math.min(3,s+1))}
                disabled={step===0&&!role}
                style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 24px',background:(!role&&step===0)?'rgba(255,255,255,0.06)':'linear-gradient(135deg,#00ffc8,#00c49a)',color:(!role&&step===0)?'rgba(232,244,248,0.3)':'var(--primary)',border:'none',borderRadius:'9px',cursor:(!role&&step===0)?'not-allowed':'pointer',fontSize:'13px',fontWeight:800,fontFamily:'var(--font-ui)',boxShadow:(!role&&step===0)?'none':'0 4px 14px rgba(0,255,200,0.25)'}}>
                {step===2?'Finish Setup':'Continue'} <ChevronRight size={13}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
