'use client';
import { TrendingUp, BarChart3, Globe, Activity, Target, Zap, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';

type Scenario = 'optimistic'|'base'|'stress';

const FORECAST_METRICS = [
  {label:'Global FDI 2050',  val:'$9.2T',  sub:'▲114% vs 2025',         color:'#0A3D62'},
  {label:'Technology FDI',   val:'$3.8T',  sub:'▲72% · 41% of total',   color:'#74BB65'},
  {label:'Renewable Energy', val:'$2.2T',  sub:'▲68% · 24% of total',   color:'#1B6CA8'},
  {label:'Asia-Pacific',     val:'$3.1T',  sub:'▲22% CAGR',             color:'#0A3D62'},
  {label:'MENA',             val:'$1.4T',  sub:'▲18% CAGR',             color:'#74BB65'},
  {label:'Europe',           val:'$2.4T',  sub:'▲5% CAGR',              color:'#1B6CA8'},
  {label:'North America',    val:'$2.2T',  sub:'▲6% CAGR',              color:'#696969'},
  {label:'Latin America',    val:'$890B',  sub:'▲8% CAGR',              color:'#9E9E9E'},
];

const TOP10_2050 = [
  {r:1, flag:'🇺🇸', name:'USA',         fdi:'$1.6T'},
  {r:2, flag:'🇨🇳', name:'China',       fdi:'$1.4T'},
  {r:3, flag:'🇩🇪', name:'Germany',     fdi:'$980B'},
  {r:4, flag:'🇬🇧', name:'UK',          fdi:'$920B'},
  {r:5, flag:'🇦🇪', name:'UAE',         fdi:'$890B'},
  {r:6, flag:'🇸🇬', name:'Singapore',   fdi:'$820B'},
  {r:7, flag:'🇯🇵', name:'Japan',       fdi:'$780B'},
  {r:8, flag:'🇫🇷', name:'France',      fdi:'$750B'},
  {r:9, flag:'🇮🇳', name:'India',       fdi:'$720B'},
  {r:10,flag:'🇨🇦', name:'Canada',      fdi:'$680B'},
];

const SCENARIOS: Record<Scenario,{title:string,sub:string,fdi2050:string,techGrowth:string,renewGrowth:string,apacCagr:string,prob:number,color:string}> = {
  optimistic: {title:'Optimistic Scenario',sub:'"Accelerated Global Growth"',fdi2050:'$10.8T',techGrowth:'+85%',renewGrowth:'+78%',apacCagr:'+28%',prob:25,color:'#74BB65'},
  base:       {title:'Base Case Scenario', sub:'"Moderate Growth Continuation"',fdi2050:'$9.2T',techGrowth:'+72%',renewGrowth:'+68%',apacCagr:'+22%',prob:60,color:'#0A3D62'},
  stress:     {title:'Stress Scenario',    sub:'"Geopolitical Fragmentation"',fdi2050:'$6.8T',techGrowth:'+28%',renewGrowth:'+22%',apacCagr:'+12%',prob:15,color:'#E57373'},
};

const YEARS   = [2025,2030,2035,2040,2045,2050];
const BASE_FDI = [4.3, 5.2, 6.4, 7.5, 8.3, 9.2];

function ForecastChart({scenario}: {scenario:Scenario}) {
  const mult = scenario==='optimistic'?1.18:scenario==='stress'?0.74:1;
  const data = BASE_FDI.map(v=>+(v*mult).toFixed(1));
  const max  = Math.max(...data) * 1.1;
  const W=500, H=180, pad=40;
  const pts  = data.map((v,i)=>[pad+i*(W-pad*2)/5, H-pad-(v/max)*(H-pad*2)] as [number,number]);
  const path = `M${pts.map(([x,y])=>`${x},${y}`).join(' L')}`;
  const area = `M${pts[0][0]},${H-pad} L${path.slice(1)} L${pts[pts.length-1][0]},${H-pad} Z`;
  const c    = SCENARIOS[scenario].color;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="FDI forecast chart">
      <defs><linearGradient id={`g${scenario}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity="0.25"/><stop offset="100%" stopColor={c} stopOpacity="0"/></linearGradient></defs>
      <path d={area} fill={`url(#g${scenario})`}/>
      <path d={`M${path.slice(1)}`} stroke={c} strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill={c}/>
          <text x={x} y={y-10} textAnchor="middle" fontSize="11" fill={c} fontWeight="600">${data[i]}T</text>
          <text x={x} y={H-8} textAnchor="middle" fontSize="10" fill="#696969">{YEARS[i]}</text>
        </g>
      ))}
      <line x1={pad} y1={pad} x2={pad} y2={H-pad} stroke="rgba(10,61,98,0.15)" strokeWidth="1"/>
      <line x1={pad} y1={H-pad} x2={W-pad} y2={H-pad} stroke="rgba(10,61,98,0.15)" strokeWidth="1"/>
    </svg>
  );
}



export default function ForecastPage() {
  const [tab,      setTab]      = useState<'foresight'|'scenario'>('foresight');
  const [scenario, setScenario] = useState<Scenario>('base');
  const [gdp,      setGdp]      = useState(2.8);
  const [techAdopt,setTechAdopt]= useState(60);
  const [energyTr, setEnergyTr] = useState(50);
  const [ran,      setRan]      = useState(false);

  const customFDI   = +(9.2 * (1+(gdp-2)/100*0.8) * (1+techAdopt/100*0.3) * (1+energyTr/100*0.2)).toFixed(1);
  const customTech  = +(3.8 * (1+techAdopt/100*0.4)).toFixed(1);
  const customRenew = +(2.2 * (1+energyTr/100*0.5)).toFixed(1);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>Foresight & Scenario Planning · 2050</h1>
          <p style={{color:'rgba(226,242,223,0.8)',marginBottom:'20px',fontSize:'14px'}}>
            Probabilistic FDI forecasts · Optimistic / Base / Stress scenarios · What-if analysis
          </p>
          <div style={{display:'flex',gap:'0'}}>
            {[{id:'foresight',label:'Foresight 2050'},{id:'scenario',label:'Scenario Planning'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                style={{padding:'12px 24px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',
                  background:'transparent',color:tab===t.id?'white':'rgba(226,242,223,0.6)'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'28px 24px'}}>

        {tab==='foresight' && (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* Executive brief */}
            <div className="gfm-card" style={{padding:'24px',borderLeft:'4px solid #74BB65'}}>
              <div style={{fontSize:'12px',fontWeight:700,color:'#74BB65',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Executive Brief</div>
              <p style={{fontSize:'15px',color:'#0A3D62',lineHeight:'1.7',fontWeight:500}}>
                Global FDI is projected to reach <b>$9.2T</b> by 2050, growing at <b>5.8% CAGR</b> from 2025. Technology (+72%) and Renewable Energy (+68%) will account for 65% of total investment growth. Asia-Pacific leads with 22% CAGR, followed by MENA at 18%, driven by sovereign wealth diversification and green transition.
              </p>
            </div>

            {/* Key metrics */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
              {FORECAST_METRICS.map(m=>(
                <div key={m.label} className="gfm-card" style={{padding:'18px',textAlign:'center'}}>
                  <div style={{fontSize:'22px',fontWeight:800,color:m.color,fontFamily:'monospace',marginBottom:'4px'}}>{m.val}</div>
                  <div style={{fontSize:'11px',color:'#696969',marginBottom:'4px'}}>{m.label}</div>
                  <div style={{fontSize:'10px',fontWeight:700,color:'#74BB65'}}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Timeline chart */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>FDI Forecast Timeline · 2025–2050 (Base Case, $T)</div>
                <div style={{display:'flex',gap:'6px'}}>
                  {(['base','optimistic','stress'] as Scenario[]).map(s=>(
                    <button key={s} onClick={()=>setScenario(s)}
                      style={{padding:'5px 12px',borderRadius:'6px',border:'none',fontSize:'11px',fontWeight:700,cursor:'pointer',
                        background:scenario===s?SCENARIOS[s].color:'rgba(10,61,98,0.06)',
                        color:scenario===s?'white':'#0A3D62'}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <ForecastChart scenario={scenario}/>
            </div>

            {/* Top 10 by 2050 */}
            <PreviewGate feature="full_profile">
              <div className="gfm-card" style={{padding:'24px'}}>
                <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>Top 10 Economies by FDI 2050 (Base Case)</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}}>
                  {TOP10_2050.map(e=>(
                    <div key={e.r} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px',
                      borderRadius:'8px',background:'rgba(10,61,98,0.03)'}}>
                      <span style={{fontSize:'13px',fontWeight:800,color:'#74BB65',minWidth:'24px',fontFamily:'monospace'}}>#{e.r}</span>
                      <span style={{fontSize:'20px'}}>{e.flag}</span>
                      <span style={{flex:1,fontSize:'13px',fontWeight:600,color:'#0A3D62'}}>{e.name}</span>
                      <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{e.fdi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PreviewGate>
          </div>
        )}

        {tab==='scenario' && (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* 3 scenario cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
              {(Object.entries(SCENARIOS) as [Scenario,typeof SCENARIOS[Scenario]][]).map(([key,sc])=>(
                <div key={key} className="gfm-card" style={{padding:'22px',
                  borderTop:`4px solid ${sc.color}`,
                  border:scenario===key?`2px solid ${sc.color}`:'1px solid rgba(10,61,98,0.08)'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:sc.color,marginBottom:'3px'}}>{sc.title}</div>
                  <div style={{fontSize:'11px',color:'#696969',marginBottom:'14px',fontStyle:'italic'}}>{sc.sub}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'14px'}}>
                    {[['Global FDI 2050',sc.fdi2050],['Technology Growth',sc.techGrowth],['Renewable Growth',sc.renewGrowth],['Asia-Pacific CAGR',sc.apacCagr]].map(([l,v])=>(
                      <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'12px'}}>
                        <span style={{color:'#696969'}}>{l}</span>
                        <span style={{fontWeight:700,color:sc.color,fontFamily:'monospace'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <div style={{height:'6px',flex:1,borderRadius:'3px',background:'rgba(10,61,98,0.08)'}}>
                      <div style={{height:'100%',borderRadius:'3px',width:`${sc.prob}%`,background:sc.color}}/>
                    </div>
                    <span style={{fontSize:'11px',fontWeight:700,color:sc.color,minWidth:'30px'}}>{sc.prob}%</span>
                  </div>
                  <div style={{fontSize:'10px',color:'#696969',marginTop:'2px'}}>Probability</div>
                </div>
              ))}
            </div>

            {/* What-if analysis */}
            <div className="gfm-card" style={{padding:'28px'}}>
              <h3 style={{fontSize:'15px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>What-If Analysis · Create Your Custom Scenario</h3>
              <p style={{fontSize:'12px',color:'#696969',marginBottom:'20px'}}>Adjust parameters to model your own 2050 FDI projection.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'16px',marginBottom:'20px'}}>
                {[
                  {label:'Global GDP Growth',min:-2,max:6,step:0.1,val:gdp,set:setGdp,unit:'%',left:'−2%',right:'+6%'},
                  {label:'Technology Adoption Rate',min:0,max:100,step:5,val:techAdopt,set:setTechAdopt,unit:'%',left:'Slow',right:'Fast'},
                  {label:'Energy Transition Speed',min:0,max:100,step:5,val:energyTr,set:setEnergyTr,unit:'%',left:'Slow',right:'Fast'},
                ].map(({label,min,max,step,val,set,unit,left,right})=>(
                  <div key={label}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                      <span style={{fontSize:'13px',fontWeight:600,color:'#0A3D62'}}>{label}</span>
                      <span style={{fontSize:'13px',fontWeight:700,color:'#74BB65',fontFamily:'monospace'}}>{typeof val==='number'?val.toFixed(1):val}{unit}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <span style={{fontSize:'10px',color:'#696969',minWidth:'28px'}}>{left}</span>
                      <input type="range" min={min} max={max} step={step} value={val}
                        onChange={e=>set(+e.target.value)}
                        style={{flex:1,accentColor:'#74BB65'}}/>
                      <span style={{fontSize:'10px',color:'#696969',minWidth:'28px',textAlign:'right'}}>{right}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:'10px',marginBottom:ran?'16px':'0'}}>
                <button onClick={()=>setRan(true)} className="gfm-btn-primary" style={{padding:'10px 24px',fontSize:'14px'}}>Run Scenario →</button>
                <button onClick={()=>{setGdp(2.8);setTechAdopt(60);setEnergyTr(50);setRan(false);}}
                  style={{padding:'10px 20px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',
                    background:'transparent',cursor:'pointer',fontSize:'14px',color:'#696969'}}>Reset</button>
              </div>
              {ran && (
                <div style={{padding:'18px',borderRadius:'12px',background:'rgba(116,187,101,0.08)',border:'1px solid rgba(116,187,101,0.2)'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Your Custom Scenario Results · 2050</div>
                  <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                    {[
                      {l:'Global FDI',v:`$${customFDI}T`},
                      {l:'Technology',v:`$${customTech}T`},
                      {l:'Renewable',v:`$${customRenew}T`},
                    ].map(({l,v})=>(
                      <div key={l} style={{textAlign:'center'}}>
                        <div style={{fontSize:'22px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                        <div style={{fontSize:'11px',color:'#696969'}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:'10px',fontSize:'12px',color:'#696969'}}>
                    Top Winners: <b style={{color:'#0A3D62'}}>🇦🇪 UAE (+{+(28*(energyTr/50)).toFixed(0)}%)</b> · <b style={{color:'#0A3D62'}}>🇮🇳 India (+{+(32*(techAdopt/60)).toFixed(0)}%)</b> · <b style={{color:'#0A3D62'}}>🇸🇬 Singapore (+{+(22*(gdp/2.8)).toFixed(0)}%)</b>
                  </div>
                  <button className="gfm-btn-primary" style={{marginTop:'12px',padding:'8px 18px',fontSize:'12px'}}>Export Scenario Report</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
