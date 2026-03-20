'use client';
import { useState } from 'react';
import { TrendingUp, Activity, BarChart3, Globe, Zap, Target, ArrowRight, RefreshCw } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';

const PRESETS = [
  {id:'base',       label:'Base Case',   color:'#0A3D62', prob:60, fdi:'$9.2T', tech:'+72%', renew:'+68%', gdp:2.8},
  {id:'optimistic', label:'Optimistic',  color:'#74BB65', prob:25, fdi:'$10.8T',tech:'+85%', renew:'+78%', gdp:4.2},
  {id:'stress',     label:'Stress',      color:'#E57373', prob:15, fdi:'$6.8T', tech:'+28%', renew:'+22%', gdp:0.8},
];

const LEVERS = [
  {id:'gdp',    label:'Global GDP Growth Rate',   min:-2,  max:6,   step:0.1, default:2.8,  unit:'% CAGR',  suffix:'%'},
  {id:'tech',   label:'Technology Adoption Speed', min:0,   max:100, step:5,   default:60,   unit:'index',   suffix:''},
  {id:'energy', label:'Green Energy Transition',   min:0,   max:100, step:5,   default:50,   unit:'pace',    suffix:''},
  {id:'trade',  label:'Trade Openness',            min:0,   max:100, step:5,   default:70,   unit:'index',   suffix:''},
  {id:'gov',    label:'Governance Reform',         min:0,   max:100, step:5,   default:55,   unit:'index',   suffix:''},
];

function ScenarioBar({ label, val, max, color }: {label:string,val:number,max:number,color:string}) {
  return (
    <div style={{marginBottom:'8px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px',fontSize:'11px'}}>
        <span style={{color:'#696969'}}>{label}</span>
        <span style={{fontWeight:700,color,fontFamily:'monospace'}}>{val}</span>
      </div>
      <div style={{height:'7px',borderRadius:'4px',background:'rgba(10,61,98,0.08)'}}>
        <div style={{height:'100%',borderRadius:'4px',width:`${(val/max)*100}%`,background:color,transition:'width 0.4s ease'}}/>
      </div>
    </div>
  );
}

export default function ScenarioPlannerPage() {
  const [preset,  setPreset]  = useState<string|null>(null);
  const [levers,  setLevers]  = useState<Record<string,number>>({gdp:2.8,tech:60,energy:50,trade:70,gov:55});
  const [ran,     setRan]     = useState(false);
  const [running, setRunning] = useState(false);

  function setLever(id:string, v:number) {
    setLevers(l=>({...l,[id]:v}));
    setPreset(null); setRan(false);
  }

  function applyPreset(p:typeof PRESETS[0]) {
    setPreset(p.id);
    setLevers({gdp:p.gdp, tech:p.id==='optimistic'?80:p.id==='stress'?25:60,
               energy:p.id==='optimistic'?75:p.id==='stress'?20:50, trade:70, gov:55});
    setRan(false);
  }

  function runScenario() {
    setRunning(true);
    setTimeout(()=>{setRunning(false);setRan(true);},1200);
  }

  function resetAll() {
    setLevers({gdp:2.8,tech:60,energy:50,trade:70,gov:55});
    setPreset(null); setRan(false);
  }

  // Derived outputs
  const fdiT = +(9.2*(1+(levers.gdp-2.8)/100*12)*(1+levers.tech/100*0.25)*(1+levers.energy/100*0.18)).toFixed(1);
  const techT = +(3.8*(1+levers.tech/100*0.35)).toFixed(1);
  const renewT= +(2.2*(1+levers.energy/100*0.45)).toFixed(1);
  const topWinners = levers.gdp>3 ? '🇦🇪 UAE · 🇮🇳 India · 🇸🇬 Singapore' : levers.energy>70 ? '🇩🇪 Germany · 🇦🇺 Australia · 🇸🇪 Sweden' : '🇺🇸 USA · 🇨🇳 China · 🇩🇪 Germany';

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'12px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <Activity size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Scenario Planner</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white'}}>FDI Scenario Planning 2050</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px',marginTop:'4px'}}>
              Model optimistic, base, and stress scenarios or build your custom 2050 projection.
            </p>
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>

        {/* Preset cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
          {PRESETS.map(p=>(
            <div key={p.id} onClick={()=>applyPreset(p)}
              style={{background:'white',borderRadius:'12px',padding:'20px',cursor:'pointer',
                boxShadow:'0 2px 8px rgba(10,61,98,0.06)',
                border:preset===p.id?`2px solid ${p.color}`:'1px solid rgba(10,61,98,0.06)',
                borderTop:`4px solid ${p.color}`,transition:'all 0.15s'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:p.color,marginBottom:'3px'}}>{p.label}</div>
              <div style={{fontSize:'11px',color:'#696969',marginBottom:'12px',fontStyle:'italic'}}>
                {p.id==='base'?'"Moderate Growth Continuation"':p.id==='optimistic'?'"Accelerated Global Growth"':'"Geopolitical Fragmentation"'}
              </div>
              {[['Global FDI 2050',p.fdi],['Technology',p.tech],['Renewable',p.renew]].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'12px',
                  padding:'4px 0',borderBottom:'1px solid rgba(10,61,98,0.04)'}}>
                  <span style={{color:'#696969'}}>{l}</span>
                  <span style={{fontWeight:700,color:p.color,fontFamily:'monospace'}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:'10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px',fontSize:'11px'}}>
                  <span style={{color:'#696969'}}>Probability</span>
                  <span style={{fontWeight:700,color:p.color}}>{p.prob}%</span>
                </div>
                <div style={{height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.07)'}}>
                  <div style={{height:'100%',borderRadius:'3px',width:`${p.prob}%`,background:p.color}}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom levers */}
        <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'10px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <Target size={16} color="#74BB65"/>
              <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>What-If Analysis — Adjust Levers</span>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={resetAll} style={{display:'flex',alignItems:'center',gap:'5px',
                padding:'7px 14px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',
                background:'transparent',cursor:'pointer',fontSize:'12px',color:'#696969',fontWeight:600}}>
                <RefreshCw size={12}/> Reset
              </button>
              <button onClick={runScenario} disabled={running}
                style={{display:'flex',alignItems:'center',gap:'5px',
                  padding:'8px 18px',background:'#74BB65',border:'none',borderRadius:'7px',
                  color:'white',cursor:'pointer',fontSize:'13px',fontWeight:700,
                  opacity:running?0.7:1}}>
                {running ? <><RefreshCw size={13} style={{animation:'spin 0.8s linear infinite'}}/> Running…</> : <><Zap size={13}/> Run Scenario</>}
              </button>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            {LEVERS.map(l=>(
              <div key={l.id}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                  <label style={{fontSize:'13px',fontWeight:600,color:'#0A3D62'}}>{l.label}</label>
                  <span style={{fontSize:'13px',fontWeight:700,color:'#74BB65',fontFamily:'monospace'}}>
                    {levers[l.id]?.toFixed(l.step<1?1:0)}{l.suffix}
                  </span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'10px',color:'#696969',minWidth:'24px'}}>{l.min}</span>
                  <input type="range" min={l.min} max={l.max} step={l.step} value={levers[l.id]||l.default}
                    onChange={e=>setLever(l.id,+e.target.value)}
                    style={{flex:1,accentColor:'#74BB65',height:'4px'}}/>
                  <span style={{fontSize:'10px',color:'#696969',minWidth:'24px',textAlign:'right'}}>{l.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <PreviewGate feature="full_profile">
          {ran && (
            <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)',
              border:'1px solid rgba(116,187,101,0.25)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
                <TrendingUp size={16} color="#74BB65"/>
                <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>Your Custom Scenario Results · 2050</span>
                <span style={{marginLeft:'auto',fontSize:'11px',padding:'3px 10px',borderRadius:'10px',
                  background:'rgba(116,187,101,0.1)',color:'#74BB65',fontWeight:700}}>Custom</span>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'20px'}}>
                {[{l:'Global FDI 2050',v:`$${fdiT}T`,c:'#0A3D62'},{l:'Technology FDI',v:`$${techT}T`,c:'#74BB65'},{l:'Renewable FDI',v:`$${renewT}T`,c:'#1B6CA8'}].map(({l,v,c})=>(
                  <div key={l} style={{textAlign:'center',padding:'16px',borderRadius:'10px',background:'rgba(10,61,98,0.03)'}}>
                    <div style={{fontSize:'26px',fontWeight:900,color:c,fontFamily:'monospace'}}>{v}</div>
                    <div style={{fontSize:'11px',color:'#696969',marginTop:'4px'}}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{marginBottom:'16px'}}>
                <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'10px'}}>Outcome Indicators</div>
                <ScenarioBar label="FDI Volume vs Base" val={Math.round((fdiT/9.2)*100)} max={130} color="#74BB65"/>
                <ScenarioBar label="Technology Share"   val={Math.round(levers.tech)}     max={100} color="#0A3D62"/>
                <ScenarioBar label="Green Economy"      val={Math.round(levers.energy)}   max={100} color="#1B6CA8"/>
              </div>

              <div style={{padding:'12px 16px',borderRadius:'10px',background:'rgba(116,187,101,0.06)',
                border:'1px solid rgba(116,187,101,0.15)',fontSize:'13px'}}>
                <span style={{color:'#696969'}}>Top FDI Winners: </span>
                <span style={{fontWeight:700,color:'#0A3D62'}}>{topWinners}</span>
              </div>

              <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                <button style={{display:'flex',alignItems:'center',gap:'5px',padding:'9px 18px',
                  background:'#0A3D62',border:'none',borderRadius:'8px',color:'white',
                  cursor:'pointer',fontSize:'13px',fontWeight:700}}>
                  <ArrowRight size={14}/> Export Scenario Report
                </button>
              </div>
            </div>
          )}
        </PreviewGate>
      </div>
      <Footer/>
    </div>
  );
}
