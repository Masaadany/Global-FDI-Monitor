'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollableSelect from '@/components/ScrollableSelect';
import Link from 'next/link';
import { Zap, RefreshCw, TrendingUp, Download } from 'lucide-react';

const ECONOMIES = ['Vietnam','Malaysia','Thailand','Indonesia','UAE','Saudi Arabia','India','Singapore','South Korea','Morocco','Brazil','Germany'];
const SECTORS = ['EV Battery','Data Centers','Semiconductors','Renewables','Manufacturing','Financial Services','AI & Technology'];
const SIZES = ['$10M','$50M','$100M','$250M','$500M','$1B','$2B','$5B'];
const TIMELINES = ['2 years','3 years','5 years','7 years','10 years'];
const FINANCING = ['100% Equity','70/30 Equity/Debt','50/50 Equity/Debt','30/70 Equity/Debt'];

interface Scenario {
  id: string; name: string;
  economy: string; sector: string; size: string; timeline: string; financing: string;
  gosa: number; irr: number; npv: string; jobs: number; taxRev: string; incentives: string;
}

const GOSA_MAP: Record<string,number> = {Vietnam:79.4,Malaysia:81.2,Thailand:80.7,Indonesia:77.8,UAE:82.1,'Saudi Arabia':79.1,India:73.2,Singapore:88.4,'South Korea':84.1,Morocco:66.8,Brazil:71.3,Germany:83.1};

function calcIRR(gosa: number, size: string, timeline: string, sector: string, financing: string): number {
  const base = (gosa - 60) * 0.3 + 12;
  const sizeAdj: Record<string,number> = {'$10M':2,'$50M':1,'$100M':0,'$250M':-0.5,'$500M':-1,'$1B':-1.5,'$2B':-2,'$5B':-2.5};
  const sectorAdj: Record<string,number> = {'EV Battery':3,'Data Centers':2.5,'AI & Technology':3.5,'Semiconductors':2,'Renewables':1.5,'Manufacturing':-0.5,'Financial Services':1};
  const yearAdj: Record<string,number> = {'2 years':-1,'3 years':0,'5 years':1.5,'7 years':2,'10 years':2.5};
  const finAdj: Record<string,number> = {'100% Equity':0,'70/30 Equity/Debt':1,'50/50 Equity/Debt':1.8,'30/70 Equity/Debt':2.5};
  return Math.max(6, Math.min(42, base + (sizeAdj[size]||0) + (sectorAdj[sector]||0) + (yearAdj[timeline]||0) + (finAdj[financing]||0))).toFixed(1) as unknown as number;
}

function calcNPV(size: string, irr: number, timeline: string): string {
  const inv: Record<string,number> = {'$10M':10,'$50M':50,'$100M':100,'$250M':250,'$500M':500,'$1B':1000,'$2B':2000,'$5B':5000};
  const years: Record<string,number> = {'2 years':2,'3 years':3,'5 years':5,'7 years':7,'10 years':10};
  const i = inv[size]||100; const y = years[timeline]||5;
  const npv = i * ((1 + irr/100) ** y - 1) * 0.6;
  return npv >= 1000 ? `$${(npv/1000).toFixed(1)}B` : `$${Math.round(npv)}M`;
}

function calcJobs(size: string, sector: string): number {
  const base: Record<string,number> = {'$10M':120,'$50M':480,'$100M':850,'$250M':1800,'$500M':3200,'$1B':5500,'$2B':9000,'$5B':18000};
  const mult: Record<string,number> = {'EV Battery':1.4,'Data Centers':0.4,'AI & Technology':0.6,'Semiconductors':0.9,'Manufacturing':1.6,'Renewables':0.8,'Financial Services':0.5};
  return Math.round((base[size]||1000)*(mult[sector]||1));
}

export default function ScenarioPlanner() {
  const [economy, setEconomy] = useState('Vietnam');
  const [sector, setSector] = useState('EV Battery');
  const [size, setSize] = useState('$250M');
  const [timeline, setTimeline] = useState('5 years');
  const [financing, setFinancing] = useState('70/30 Equity/Debt');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [scenarioName, setScenarioName] = useState('');

  const gosa = GOSA_MAP[economy]||75;
  const irr = calcIRR(gosa, size, timeline, sector, financing);
  const npv = calcNPV(size, irr, timeline);
  const jobs = calcJobs(size, sector);

  async function runScenario() {
    setLoading(true);
    await new Promise(r=>setTimeout(r,1200));
    const name = scenarioName || `${economy} ${sector} ${size}`;
    const newScen: Scenario = { id: Date.now().toString(), name, economy, sector, size, timeline, financing, gosa, irr, npv, jobs, taxRev: `$${Math.round(parseFloat(size.replace(/[$MB]/g,''))*(size.endsWith('B')?1000:1)*0.08)}M/yr`, incentives: `$${Math.round(parseFloat(size.replace(/[$MB]/g,''))*(size.endsWith('B')?1000:1)*0.12)}M over 5yr` };
    setScenarios(prev => [newScen, ...prev.slice(0,3)]);
    setScenarioName('');
    setLoading(false);
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#FFFFFF,#060f1a)',padding:'24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'6px',fontFamily:'var(--font-display)'}}>SCENARIO PLANNER</div>
          <h1 style={{fontSize:'26px',fontWeight:900,color:'var(--text-primary)',marginBottom:'4px'}}>What-If Investment Modeller</h1>
          <p style={{fontSize:'13px',color:'var(--text-muted)'}}>Configure parameters · Get live projections · Save and compare up to 4 scenarios</p>
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px',display:'grid',gridTemplateColumns:'380px 1fr',gap:'20px',alignItems:'start'}}>
        {/* Config panel */}
        <div style={{background:'white',border:'1px solid var(--border)',borderRadius:'14px',padding:'22px',position:'sticky',top:'130px'}}>
          <div style={{fontSize:'11px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.1em',marginBottom:'18px',textTransform:'uppercase',fontFamily:'var(--font-display)'}}>Configure Scenario</div>
          {[
            {label:'Target Economy', key:'economy',  val:economy,  setter:setEconomy,  opts:ECONOMIES.map(e=>({value:e,label:e,sub:'GOSA '+(GOSA_MAP[e]||'—')})), accent:'#2ECC71'},
            {label:'Sector',        key:'sector',   val:sector,   setter:setSector,   opts:SECTORS.map(s=>({value:s,label:s})), accent:'#3498DB'},
            {label:'Investment Size',key:'size',    val:size,     setter:setSize,     opts:SIZES.map(s=>({value:s,label:s})), accent:'#ffd700'},
            {label:'Timeline',      key:'timeline', val:timeline, setter:setTimeline, opts:TIMELINES.map(t=>({value:t,label:t})), accent:'#9b59b6'},
            {label:'Financing Mix', key:'financing',val:financing,setter:setFinancing,opts:FINANCING.map(f=>({value:f,label:f})), accent:'#e67e22'},
          ].map(({label,key,val,setter,opts,accent}) => (
            <div key={key} style={{marginBottom:'13px'}}>
              <ScrollableSelect label={label} value={val} onChange={setter} width="100%" options={opts} accentColor={accent}/>
            </div>
          ))}
          <div style={{marginBottom:'14px'}}>
            <label style={{fontSize:'10px',fontWeight:700,color:'#27ae60',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Scenario Name (optional)</label>
            <input value={scenarioName} onChange={e=>setScenarioName(e.target.value)} placeholder={`${economy} ${sector} ${size}`}
              style={{width:'100%',padding:'8px 12px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'12px',color:'var(--text-primary)',outline:'none',fontFamily:'var(--font-ui)'}}/>
          </div>
          <button onClick={runScenario} disabled={loading}
            style={{width:'100%',padding:'12px',background:loading?'rgba(46,204,113,0.08)':'linear-gradient(135deg,#00ffc8,#00c49a)',color:loading?'rgba(232,244,248,0.4)':'var(--primary)',border:'none',borderRadius:'10px',cursor:loading?'not-allowed':'pointer',fontSize:'13px',fontWeight:800,fontFamily:'var(--font-ui)',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all 200ms',boxShadow:loading?'none':'0 4px 16px rgba(0,255,200,0.25)'}}>
            {loading?<><RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/> Modelling...</>:<><Zap size={14}/> Run Scenario</>}
          </button>
        </div>

        {/* Live preview + saved scenarios */}
        <div>
          {/* Live metrics */}
          <div style={{background:'white',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'14px',padding:'20px',marginBottom:'14px',boxShadow:'0 0 0 1px rgba(0,255,200,0.05)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px',flexWrap:'wrap',gap:'8px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'rgba(0,255,200,0.6)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Live Projection Preview</div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{economy} · {sector} · {size} · {timeline}</span>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'14px'}}>
              {[
                ['Projected IRR',     irr+'%',   '(post-incentive)',  '#2ECC71'],
                ['NPV (discounted)',  npv,        `${timeline} horizon`,'#ffd700'],
                ['Direct Jobs',      jobs.toLocaleString(), '+ 2× indirect', '#9b59b6'],
                ['GOSA Score',       gosa,       `${economy} composite`,'#3498DB'],
                ['Tax Revenue',      `$${Math.round(parseFloat(size.replace(/[$MB]/g,''))*(size.endsWith('B')?1000:1)*0.08)}M/yr`,'5-yr avg','#e67e22'],
                ['Incentive Value',  `$${Math.round(parseFloat(size.replace(/[$MB]/g,''))*(size.endsWith('B')?1000:1)*0.12)}M`,'Over 5 years','#2ECC71'],
              ].map(([l,v,s,c]) => (
                <div key={String(l)} style={{padding:'14px',background:'var(--bg-subtle)',borderRadius:'10px',border:'1px solid '+c+'12'}}>
                  <div style={{fontSize:'9px',color:'var(--text-light)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.07em'}}>{l as string}</div>
                  <div style={{fontSize:'24px',fontWeight:900,color:String(c),fontFamily:'var(--font-mono)',textShadow:`0 0 12px ${c}40`}}>{v}</div>
                  <div style={{fontSize:'10px',color:'var(--text-light)',marginTop:'2px'}}>{s as string}</div>
                </div>
              ))}
            </div>
            <div style={{padding:'12px 14px',background:irr>=18?'rgba(0,255,200,0.05)':irr>=12?'rgba(255,215,0,0.05)':'rgba(255,68,102,0.05)',borderRadius:'10px',border:`1px solid ${irr>=18?'rgba(46,204,113,0.12)':irr>=12?'rgba(255,215,0,0.12)':'rgba(255,68,102,0.12)'}`}}>
              <div style={{fontSize:'11px',fontWeight:800,color:irr>=18?'#2ECC71':irr>=12?'#ffd700':'#ff4466',marginBottom:'4px'}}>
                {irr>=20?'🟢 STRONG CASE':irr>=15?'🟡 VIABLE CASE':irr>=10?'🟠 MARGINAL CASE':'🔴 CHALLENGING'}
              </div>
              <div style={{fontSize:'12px',color:'rgba(232,244,248,0.65)',lineHeight:1.65}}>
                {economy} {sector} investment at {size} over {timeline} projects IRR of {irr}% with {jobs.toLocaleString()} direct jobs. {irr>=18?'Strong fundamentals — proceed to site selection.':irr>=12?'Viable case — consider incentive optimisation.':'Review size or location to improve economics.'}
              </div>
            </div>
          </div>

          {/* Saved scenarios comparison */}
          {scenarios.length > 0 && (
            <div style={{background:'white',border:'1px solid var(--border)',borderRadius:'14px',padding:'20px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'14px'}}>Saved Scenarios — Comparison</div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'var(--bg-subtle)'}}>
                      {['Scenario','Economy','Sector','Size','Timeline','GOSA','IRR','NPV','Jobs'].map(h=>(
                        <th key={h} style={{padding:'8px 12px',textAlign:h==='Scenario'?'left':'center',fontWeight:700,color:'var(--text-light)',textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.07em',borderBottom:'1px solid rgba(0,255,200,0.06)',whiteSpace:'nowrap',fontFamily:'var(--font-mono)'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((sc,i) => {
                      const bestIrr = Math.max(...scenarios.map(s=>s.irr));
                      const cols = ['#2ECC71','#3498DB','#ffd700','#9b59b6'];
                      return (
                        <tr key={sc.id} style={{borderBottom:'1px solid rgba(255,255,255,0.025)'}}>
                          <td style={{padding:'10px 12px',fontWeight:700,color:cols[i%4]}}>{sc.name}</td>
                          <td style={{padding:'10px 8px',textAlign:'center',color:'var(--text-secondary)'}}>{sc.economy}</td>
                          <td style={{padding:'10px 8px',textAlign:'center',color:'var(--text-secondary)',fontSize:'11px'}}>{sc.sector}</td>
                          <td style={{padding:'10px 8px',textAlign:'center',color:'var(--text-secondary)',fontFamily:'var(--font-mono)'}}>{sc.size}</td>
                          <td style={{padding:'10px 8px',textAlign:'center',color:'var(--text-muted)',fontSize:'11px'}}>{sc.timeline}</td>
                          <td style={{padding:'10px 8px',textAlign:'center',fontWeight:700,color:'var(--accent-green)',fontFamily:'var(--font-mono)'}}>{sc.gosa}</td>
                          <td style={{padding:'10px 8px',textAlign:'center',fontWeight:sc.irr===bestIrr?900:700,color:sc.irr===bestIrr?'#2ECC71':'rgba(232,244,248,0.6)',fontFamily:'var(--font-mono)'}}>
                            {sc.irr===bestIrr?'★ ':''}{sc.irr}%
                          </td>
                          <td style={{padding:'10px 8px',textAlign:'center',fontWeight:700,color:'#ffd700',fontFamily:'var(--font-mono)'}}>{sc.npv}</td>
                          <td style={{padding:'10px 8px',textAlign:'center',color:'var(--text-secondary)',fontFamily:'var(--font-mono)'}}>{sc.jobs.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
                <Link href="/reports" style={{padding:'8px 18px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'var(--primary)',borderRadius:'9px',textDecoration:'none',fontSize:'12px',fontWeight:800,display:'flex',alignItems:'center',gap:'6px',boxShadow:'0 4px 12px rgba(0,255,200,0.2)'}}>
                  <Download size={13}/> Export Full Report
                </Link>
                <button onClick={()=>setScenarios([])} style={{padding:'8px 16px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'9px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'var(--text-muted)',fontFamily:'var(--font-ui)'}}>
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <Footer/>
    </div>
  );
}
