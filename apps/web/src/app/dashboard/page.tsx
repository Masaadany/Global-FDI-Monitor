'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Globe4D from '@/components/Globe4D';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import BentoDashboard from '@/components/BentoDashboard';
import InvestmentHeatmap from '@/components/InvestmentHeatmap';

const SECTORS    = ['All Sectors','Technology','Energy','Healthcare','Finance','Logistics','Manufacturing','Agribusiness','Real Estate'];
const INV_TYPES  = ['Greenfield','M&A','Expansion','Joint Venture','VC/PE'];
const REGIONS    = ['All','North America','Europe','MENA','Asia-Pacific','Latin America','Africa'];
const SCI_GRADES = ['Platinum','Gold','Silver','Bronze'];

const SIGNALS = [
  {company:'Microsoft',    amount:'$5.2B', sector:'Technology',    iso:'🇦🇪', country:'UAE',       sci:94, grade:'PLATINUM'},
  {company:'CATL',         amount:'$3.2B', sector:'Manufacturing', iso:'🇮🇩', country:'Indonesia', sci:92, grade:'PLATINUM'},
  {company:'Siemens',      amount:'$2.1B', sector:'Energy',        iso:'🇩🇪', country:'Germany',   sci:88, grade:'GOLD'},
  {company:'BYD',          amount:'$1.8B', sector:'Auto',          iso:'🇸🇦', country:'Saudi Arabia',sci:86,grade:'GOLD'},
  {company:'BlackRock',    amount:'$0.9B', sector:'Finance',       iso:'🇬🇧', country:'UK',        sci:79, grade:'SILVER'},
  {company:'ACWA Power',   amount:'$0.7B', sector:'Energy',        iso:'🇲🇦', country:'Morocco',   sci:74, grade:'SILVER'},
];

const GFR_MOVERS = [
  {flag:'🇸🇬', name:'Singapore',    chg:+2, score:88.5},
  {flag:'🇦🇪', name:'UAE',          chg:+3, score:80.0},
  {flag:'🇸🇦', name:'Saudi Arabia', chg:+8, score:86.2},
  {flag:'🇮🇳', name:'India',        chg:+4, score:82.1},
  {flag:'🇨🇭', name:'Switzerland',  chg:-1, score:87.5},
];

const GRADE_C: Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969',BRONZE:'#9E9E9E'};
const GRADE_BG: Record<string,string> = {PLATINUM:'rgba(10,61,98,0.1)',GOLD:'rgba(116,187,101,0.12)',SILVER:'rgba(105,105,105,0.1)',BRONZE:'rgba(158,158,158,0.1)'};

export default function DashboardPage() {
  const [tab,        setTab]        = useState('overview');
  const [filterOpen, setFilterOpen] = useState(true);
  const [sectors,    setSectors]    = useState<string[]>([]);
  const [invTypes,   setInvTypes]   = useState<string[]>(['Greenfield']);
  const [sciGrades,  setSciGrades]  = useState<string[]>(['Platinum','Gold']);
  const [dateFrom,   setDateFrom]   = useState('2025-01-01');
  const [dateTo,     setDateTo]     = useState('2026-03-31');
  const [minInvest,  setMinInvest]  = useState(50);
  const [ticker,     setTicker]     = useState(0);

  useEffect(() => {
    const t = setInterval(()=>setTicker(n=>(n+1)%SIGNALS.length), 2000);
    return ()=>clearInterval(t);
  }, []);

  const TABS = [
    {id:'overview',   label:'Overview'},
    {id:'foresight',  label:'Foresight'},
    {id:'scenario',   label:'Scenario'},
    {id:'benchmark',  label:'Benchmark'},
    {id:'bilateral',  label:'Bilateral'},
    {id:'reports',    label:'Reports'},
  ];

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Sticky tab bar */}
      <div style={{position:'sticky',top:'64px',zIndex:40,background:'white',borderBottom:'1px solid rgba(10,61,98,0.1)',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
        <div style={{maxWidth:'1600px',margin:'0 auto',padding:'0 16px',display:'flex',gap:'0',overflowX:'auto'}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:'14px 18px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,whiteSpace:'nowrap',
                borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',
                background:'transparent',color:tab===t.id?'#0A3D62':'#696969',transition:'all 0.2s'}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1600px',margin:'0 auto',padding:'16px',display:'grid',
        gridTemplateColumns:filterOpen?'260px 1fr 280px':'0px 1fr 280px',gap:'16px',transition:'grid-template-columns 0.3s ease'}}>

        {/* ── LEFT: FILTER PANEL ── */}
        <div style={{overflow:'hidden',transition:'all 0.3s'}}>
          <div style={{background:'white',borderRadius:'12px',boxShadow:'0 2px 12px rgba(10,61,98,0.07)',
            padding:'16px',minWidth:'260px',maxHeight:'calc(100vh - 140px)',overflowY:'auto',position:'sticky',top:'120px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>FILTERS</div>
              <button onClick={()=>setFilterOpen(false)}
                style={{border:'none',background:'rgba(10,61,98,0.06)',borderRadius:'5px',padding:'3px 7px',cursor:'pointer',fontSize:'12px',color:'#696969'}}>
                Hide ‹‹
              </button>
            </div>

            {/* Sectors */}
            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>Sectors</div>
              <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                {SECTORS.map(s=>(
                  <label key={s} style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12px',color:'#0A3D62',cursor:'pointer'}}>
                    <input type="checkbox" checked={sectors.includes(s)||s==='All Sectors'}
                      onChange={()=>setSectors(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}/>
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {/* Investment type */}
            <div style={{marginBottom:'16px',borderTop:'1px solid rgba(10,61,98,0.06)',paddingTop:'12px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>Investment Type</div>
              <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                {INV_TYPES.map(t=>(
                  <label key={t} style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12px',color:'#0A3D62',cursor:'pointer'}}>
                    <input type="checkbox" checked={invTypes.includes(t)}
                      onChange={()=>setInvTypes(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t])}/>
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={{marginBottom:'16px',borderTop:'1px solid rgba(10,61,98,0.06)',paddingTop:'12px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>Duration</div>
              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
                  style={{padding:'5px 8px',borderRadius:'6px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'11px',color:'#0A3D62',background:'white'}}/>
                <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
                  style={{padding:'5px 8px',borderRadius:'6px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'11px',color:'#0A3D62',background:'white'}}/>
              </div>
            </div>

            {/* Investment size */}
            <div style={{marginBottom:'16px',borderTop:'1px solid rgba(10,61,98,0.06)',paddingTop:'12px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'6px'}}>
                Investment Size (USD min)
              </div>
              <input type="range" min={0} max={1000} step={50} value={minInvest}
                onChange={e=>setMinInvest(+e.target.value)}
                style={{width:'100%',accentColor:'#74BB65'}}/>
              <div style={{fontSize:'11px',color:'#0A3D62',fontWeight:700,fontFamily:'monospace'}}>${minInvest}M+</div>
            </div>

            {/* Signal confidence */}
            <div style={{marginBottom:'16px',borderTop:'1px solid rgba(10,61,98,0.06)',paddingTop:'12px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>Signal Confidence</div>
              <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                {SCI_GRADES.map(g=>(
                  <label key={g} style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12px',cursor:'pointer'}}>
                    <input type="checkbox" checked={sciGrades.includes(g)}
                      onChange={()=>setSciGrades(p=>p.includes(g)?p.filter(x=>x!==g):[...p,g])}/>
                    <span style={{color:GRADE_C[g.toUpperCase()],fontWeight:700}}>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{display:'flex',gap:'6px'}}>
              <button className="gfm-btn-primary" style={{flex:1,padding:'8px',fontSize:'12px'}}>Apply</button>
              <button style={{flex:1,padding:'8px',fontSize:'12px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',background:'transparent',color:'#696969',cursor:'pointer'}}>Clear</button>
            </div>
          </div>
        </div>

        {/* ── CENTER: TAB CONTENT ── */}
        <div style={{minWidth:0}}>
          {!filterOpen && (
            <button onClick={()=>setFilterOpen(true)}
              style={{marginBottom:'12px',border:'none',background:'white',borderRadius:'8px',padding:'7px 14px',
                cursor:'pointer',fontSize:'12px',fontWeight:700,color:'#0A3D62',boxShadow:'0 2px 8px rgba(10,61,98,0.07)'}}>
              ›› Filters
            </button>
          )}

          {/* OVERVIEW TAB */}
          {tab==='overview' && (
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {/* Globe + time slider */}
              <div style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'16px',padding:'20px',position:'relative',overflow:'hidden'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                  <div>
                    <div style={{fontSize:'12px',fontWeight:700,color:'rgba(226,242,223,0.7)',textTransform:'uppercase',letterSpacing:'0.06em'}}>4D Globe Visualization</div>
                    <div style={{fontSize:'10px',color:'rgba(226,242,223,0.5)',marginTop:'2px'}}>FDI Flows · Signals · GFR · Sectors · Targets</div>
                  </div>
                  <div style={{display:'flex',gap:'4px'}}>
                    {['FDI Flows','Signals','GFR'].map(l=>(
                      <span key={l} style={{fontSize:'10px',padding:'3px 8px',borderRadius:'10px',background:'rgba(116,187,101,0.2)',color:'#74BB65',fontWeight:700}}>{l}</span>
                    ))}
                  </div>
                </div>
                <div style={{height:'200px',display:'flex',justifyContent:'center',alignItems:'center',position:'relative'}}>
                  <Globe4D/>
                </div>
                <div style={{marginTop:'12px'}}>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)',marginBottom:'4px'}}>Time Slider: 2015 → 2050</div>
                  <input type="range" min={2015} max={2050} defaultValue={2026}
                    style={{width:'100%',accentColor:'#74BB65'}}/>
                </div>
              </div>

              {/* Quick stats */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
                {[
                  {label:'Global FDI',     val:'$3.2T', chg:'▲12% YoY', color:'#74BB65'},
                  {label:'Active Signals', val:'1,234',  chg:'▲8 today',  color:'#0A3D62'},
                  {label:'GFR Composite',  val:'88.5',   chg:'▲2 pts',    color:'#1B6CA8'},
                  {label:'IRES Score',     val:'89.4',   chg:'▲3 pts',    color:'#74BB65'},
                  {label:'IMS Momentum',   val:'94.2',   chg:'▲5 pts',    color:'#0A3D62'},
                  {label:'Projects',       val:'1,234',  chg:'▲15% YoY', color:'#1B6CA8'},
                ].map(({label,val,chg,color})=>(
                  <div key={label} style={{background:'white',borderRadius:'10px',padding:'14px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
                    <div style={{fontSize:'11px',color:'#696969',marginBottom:'4px'}}>{label}</div>
                    <div style={{fontSize:'22px',fontWeight:800,color,fontFamily:'monospace'}}>{val}</div>
                    <div style={{fontSize:'11px',color:'#74BB65',fontWeight:700,marginTop:'2px'}}>{chg}</div>
                  </div>
                ))}
              </div>

              {/* Recent signals table */}
              <div style={{background:'white',borderRadius:'12px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)',overflow:'hidden'}}>
                <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(10,61,98,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>Recent Signals <span style={{fontSize:'10px',color:'#74BB65',fontWeight:700,marginLeft:'6px'}}>● LIVE 2s</span></div>
                  <div style={{display:'flex',gap:'6px'}}>
                    {['LOAD MORE','EXPORT','CREATE ALERT'].map(a=>(
                      <button key={a} style={{fontSize:'10px',padding:'4px 10px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'5px',background:'transparent',cursor:'pointer',color:'#0A3D62',fontWeight:600}}>{a}</button>
                    ))}
                  </div>
                </div>
                <table className="gfm-table">
                  <thead><tr><th>Company</th><th>Amount</th><th>Sector</th><th>Country</th><th>SCI</th></tr></thead>
                  <tbody>
                    {SIGNALS.map((s,i)=>(
                      <tr key={i} style={{background:i===ticker?'rgba(116,187,101,0.04)':'transparent',transition:'background 0.3s'}}>
                        <td style={{fontWeight:600,color:'#0A3D62'}}>{s.company}</td>
                        <td style={{fontFamily:'monospace',fontWeight:700,color:'#0A3D62'}}>{s.amount}</td>
                        <td style={{color:'#696969',fontSize:'12px'}}>{s.sector}</td>
                        <td><span style={{marginRight:'4px'}}>{s.iso}</span>{s.country}</td>
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                            <div style={{width:'48px',height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.08)'}}>
                              <div style={{height:'100%',borderRadius:'3px',width:`${s.sci}%`,background:GRADE_C[s.grade]}}/>
                            </div>
                            <span style={{fontSize:'11px',fontWeight:700,padding:'2px 7px',borderRadius:'10px',
                              background:GRADE_BG[s.grade],color:GRADE_C[s.grade]}}>{s.grade}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <BentoDashboard/>
            </div>
          )}

          {tab==='foresight'  && <AdvancedAnalytics/>}
          {tab==='scenario'   && <InvestmentHeatmap/>}
          {tab==='benchmark'  && <AdvancedAnalytics/>}
          {tab==='bilateral'  && <BentoDashboard/>}
          {tab==='reports'    && (
            <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Generate Intelligence Report</div>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                <select style={{padding:'8px 12px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'13px',color:'#0A3D62'}}>
                  <option>Country Profile</option><option>Sector Deep Dive</option><option>Investment Report</option><option>Mission Dossier</option>
                </select>
                <select style={{padding:'8px 12px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'13px',color:'#0A3D62'}}>
                  <option>🇦🇪 UAE</option><option>🇸🇦 Saudi Arabia</option><option>🇸🇬 Singapore</option>
                </select>
                <button className="gfm-btn-primary" style={{padding:'8px 20px',fontSize:'13px'}}>Generate Report →</button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: INSIGHTS PANEL ── */}
        <div style={{display:'flex',flexDirection:'column',gap:'12px',position:'sticky',top:'120px',maxHeight:'calc(100vh - 140px)',overflowY:'auto'}}>
          {/* Live ticker */}
          <div style={{background:'white',borderRadius:'12px',padding:'14px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'10px'}}>
              ⚡ Live Signal Ticker <span style={{color:'#74BB65',animation:'pulse 2s infinite'}}>●</span>
            </div>
            {SIGNALS.slice(0,4).map((s,i)=>(
              <div key={i} style={{padding:'7px 0',borderBottom:'1px solid rgba(10,61,98,0.04)',fontSize:'11px'}}>
                <div style={{fontWeight:700,color:'#0A3D62'}}>{s.amount} · {s.company}</div>
                <div style={{color:'#696969',marginTop:'1px'}}>{s.iso} {s.country} · {s.sector}</div>
                <span style={{fontSize:'10px',fontWeight:700,padding:'1px 6px',borderRadius:'8px',
                  background:GRADE_BG[s.grade],color:GRADE_C[s.grade]}}>{s.grade} {s.sci}%</span>
              </div>
            ))}
          </div>

          {/* GFR movers */}
          <div style={{background:'white',borderRadius:'12px',padding:'14px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'10px'}}>
              Top Performance (GFR Changes)
            </div>
            {GFR_MOVERS.map(m=>(
              <div key={m.name} style={{display:'flex',alignItems:'center',gap:'7px',padding:'5px 0',borderBottom:'1px solid rgba(10,61,98,0.04)'}}>
                <span style={{fontSize:'16px'}}>{m.flag}</span>
                <span style={{fontSize:'12px',flex:1,color:'#0A3D62',fontWeight:600}}>{m.name}</span>
                <span style={{fontSize:'11px',fontWeight:700,color:m.chg>0?'#74BB65':'#E57373',fontFamily:'monospace'}}>
                  {m.chg>0?`▲+${m.chg}`:`▼${m.chg}`}
                </span>
                <span style={{fontSize:'11px',color:'#696969',fontFamily:'monospace'}}>{m.score}</span>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          <div style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'12px',padding:'14px',color:'white'}}>
            <div style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#74BB65',marginBottom:'10px'}}>AI Insights</div>
            <p style={{fontSize:'11px',lineHeight:'1.6',color:'rgba(226,242,223,0.85)',marginBottom:'8px'}}>
              Technology FDI surged 45% in Q1 2026, driven by cloud and AI infrastructure projects in UAE and Saudi Arabia.
            </p>
            <p style={{fontSize:'11px',lineHeight:'1.6',color:'rgba(226,242,223,0.7)'}}>
              USA-China corridor shows decoupling signals with tech investments down 12% while ASEAN corridor grows 34%.
            </p>
          </div>

          {/* Quick actions */}
          <div style={{background:'white',borderRadius:'12px',padding:'14px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'10px'}}>Quick Actions</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
              {['📄 Generate Report','📊 Export Dashboard','🔔 Create Alert','📧 Share Insights','🗺 Bilateral View','📉 Scenario Planner'].map(a=>(
                <button key={a} style={{padding:'7px 8px',border:'1px solid rgba(10,61,98,0.12)',borderRadius:'7px',
                  background:'rgba(10,61,98,0.02)',cursor:'pointer',fontSize:'10px',color:'#0A3D62',fontWeight:600,textAlign:'left'}}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
