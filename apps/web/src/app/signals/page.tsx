'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import SourceBadge from '@/components/SourceBadge';
import ReadOnlyOverlay from '@/components/ReadOnlyOverlay';
import { useTrial } from '@/lib/trialContext';

const API = process.env.NEXT_PUBLIC_API_URL || '';

type Grade = 'PLATINUM'|'GOLD'|'SILVER'|'BRONZE';
const GRADE_C:  Record<Grade,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969',BRONZE:'#9E9E9E'};
const GRADE_BG: Record<Grade,string> = {PLATINUM:'rgba(10,61,98,0.1)',GOLD:'rgba(116,187,101,0.12)',SILVER:'rgba(105,105,105,0.1)',BRONZE:'rgba(158,158,158,0.08)'};

const SIGNALS = [
  {ref:'GFM-SIG-ARE-001',grade:'PLATINUM' as Grade,company:'Microsoft Corporation',eco:'UAE',sector:'Technology',capex:'$5.2B',sci:96.2,z3:true,sha:'a1b2c3d4',source:'fDi Markets',src_ref:'GFM-SRC-000012',date:'2026-03-18',jobs:3500,type:'Greenfield',flag:'🇦🇪'},
  {ref:'GFM-SIG-IDN-002',grade:'PLATINUM' as Grade,company:'CATL',            eco:'Indonesia',sector:'Manufacturing',capex:'$3.2B',sci:94.8,z3:true,sha:'b2c3d4e5',source:'UNCTAD WIR',src_ref:'GFM-SRC-000005',date:'2026-03-17',jobs:5000,type:'Greenfield',flag:'🇮🇩'},
  {ref:'GFM-SIG-SAU-003',grade:'GOLD'     as Grade,company:'Amazon Web Services',eco:'Saudi Arabia',sector:'Technology',capex:'$5.4B',sci:91.3,z3:true,sha:'c3d4e5f6',source:'SEC Filing',src_ref:'GFM-SRC-000031',date:'2026-03-16',jobs:2000,type:'Greenfield',flag:'🇸🇦'},
  {ref:'GFM-SIG-DEU-004',grade:'GOLD'     as Grade,company:'Siemens AG',       eco:'Germany',  sector:'Energy',      capex:'$2.1B',sci:88.5,z3:true,sha:'d4e5f6g7',source:'Annual Report',src_ref:'GFM-SRC-000044',date:'2026-03-15',jobs:1800,type:'Expansion',flag:'🇩🇪'},
  {ref:'GFM-SIG-SGP-005',grade:'GOLD'     as Grade,company:'Google Cloud',     eco:'Singapore',sector:'Technology', capex:'$2.8B',sci:87.1,z3:true,sha:'e5f6g7h8',source:'Press Release',src_ref:'GFM-SRC-000019',date:'2026-03-14',jobs:2200,type:'Greenfield',flag:'🇸🇬'},
  {ref:'GFM-SIG-GBR-006',grade:'GOLD'     as Grade,company:'BlackRock',        eco:'UK',       sector:'Finance',    capex:'$0.9B',sci:85.2,z3:true,sha:'f6g7h8i9',source:'Companies House',src_ref:'GFM-SRC-000028',date:'2026-03-14',jobs:450, type:'M&A',     flag:'🇬🇧'},
  {ref:'GFM-SIG-MAR-007',grade:'SILVER'   as Grade,company:'ACWA Power',       eco:'Morocco',  sector:'Energy',     capex:'$0.7B',sci:74.8,z3:true,sha:'g7h8i9j0',source:'Press Release',src_ref:'GFM-SRC-000019',date:'2026-03-13',jobs:900, type:'Greenfield',flag:'🇲🇦'},
  {ref:'GFM-SIG-IND-008',grade:'SILVER'   as Grade,company:'Apple Inc.',       eco:'India',    sector:'Manufacturing',capex:'$1.5B',sci:72.3,z3:false,sha:'h8i9j0k1',source:'Economic Times',src_ref:'GFM-SRC-000061',date:'2026-03-12',jobs:4500,type:'Expansion',flag:'🇮🇳'},
  {ref:'GFM-SIG-VNM-009',grade:'SILVER'   as Grade,company:'Samsung SDI',      eco:'Vietnam',  sector:'Manufacturing',capex:'$1.2B',sci:71.8,z3:true,sha:'i9j0k1l2',source:'Korea Herald',src_ref:'GFM-SRC-000075',date:'2026-03-11',jobs:3200,type:'Greenfield',flag:'🇻🇳'},
  {ref:'GFM-SIG-POL-010',grade:'BRONZE'   as Grade,company:'Volkswagen',       eco:'Poland',   sector:'Auto',       capex:'$0.4B',sci:62.1,z3:false,sha:'j0k1l2m3',source:'VW AG Report',src_ref:'GFM-SRC-000082',date:'2026-03-10',jobs:800, type:'Expansion',flag:'🇵🇱'},
];

const GRADES: Grade[] = ['PLATINUM','GOLD','SILVER','BRONZE'];
const SECTORS = ['All Sectors','Technology','Energy','Manufacturing','Finance','Auto'];

const SCI_FORMULA = {
  components: [
    {name:'Source Credibility',  weight:25, desc:'Authority, peer-review, official vs. secondary'},
    {name:'Verification Status', weight:20, desc:'Z3 formal proof + cross-source confirmation'},
    {name:'Extraction Accuracy', weight:20, desc:'NLP confidence + structured field match'},
    {name:'Temporal Freshness',  weight:20, desc:'Hours since original announcement'},
    {name:'Publish Reliability', weight:15, desc:'Track record of source for this signal type'},
  ],
};

export default function SignalsPage() {
  const [view,    setView]    = useState<'table'|'cards'>('table');
  const [gradeF,  setGradeF]  = useState<Grade[]>(['PLATINUM','GOLD']);
  const [sectorF, setSectorF] = useState('All Sectors');
  const [search,  setSearch]  = useState('');
  const [live,    setLive]    = useState(true);
  const [ticker,  setTicker]  = useState(0);
  const [sciOpen, setSciOpen] = useState(false);
  const trial = useTrial();

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setTicker(n => (n+1) % SIGNALS.length), 2000);
    return () => clearInterval(t);
  }, [live]);

  const filtered = SIGNALS.filter(s => {
    const mg = gradeF.length === 0 || gradeF.includes(s.grade);
    const ms = sectorF === 'All Sectors' || s.sector === sectorF;
    const mq = !search || s.company.toLowerCase().includes(search.toLowerCase()) ||
               s.eco.toLowerCase().includes(search.toLowerCase());
    return mg && ms && mq;
  });

  function toggleGrade(g: Grade) {
    setGradeF(p => p.includes(g) ? p.filter(x=>x!==g) : [...p,g]);
  }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <div style={{width:'9px',height:'9px',borderRadius:'50%',background:'#74BB65',
                  animation:'livePulse 2s ease-in-out infinite'}}/>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em'}}>LIVE · {SIGNALS.length} ACTIVE SIGNALS</span>
              </div>
              <h1 style={{fontSize:'28px',fontWeight:800,color:'white',lineHeight:'1.2',marginBottom:'6px'}}>
                FDI Signal Intelligence
              </h1>
              <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
                Z3-verified · SHA-256 provenance · 2-second ingestion latency · SCI 0–100
              </p>
            </div>
            <div style={{display:'flex',gap:'16px'}}>
              {[['218+','Total Signals'],['94%','PLATINUM avg SCI'],['2s','Update latency'],['Z3','Verified']].map(([v,l])=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div style={{position:'sticky',top:'128px',zIndex:35,background:'white',
        borderBottom:'1px solid rgba(10,61,98,0.1)',boxShadow:'0 2px 8px rgba(10,61,98,0.05)'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',padding:'10px 24px',
          display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
          {/* Search */}
          <ReadOnlyOverlay feature="search" showUpgrade={false}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="🔍 Search company, economy…"
              style={{padding:'8px 14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                fontSize:'13px',background:'white',color:'#000',outline:'none',minWidth:'200px'}}
              aria-label="Search signals" disabled={trial.isSoftLocked}/>
          </ReadOnlyOverlay>

          {/* Grade filters */}
          <ReadOnlyOverlay feature="filter" showUpgrade={false}>
            <div style={{display:'flex',gap:'4px'}}>
              {GRADES.map(g=>(
                <button key={g} onClick={()=>!trial.isSoftLocked && toggleGrade(g)} disabled={trial.isSoftLocked}
                  style={{padding:'5px 12px',borderRadius:'20px',border:'none',cursor:trial.isSoftLocked?'not-allowed':'pointer',
                    fontSize:'11px',fontWeight:700,transition:'all 0.15s',
                    background: gradeF.includes(g) ? GRADE_C[g] : GRADE_BG[g],
                    color:       gradeF.includes(g) ? 'white'    : GRADE_C[g],
                    opacity:     trial.isSoftLocked ? 0.5 : 1,
                  }}>
                  {g}
                </button>
              ))}
            </div>
          </ReadOnlyOverlay>

          {/* Sector filter */}
          <select value={sectorF} onChange={e=>!trial.isSoftLocked && setSectorF(e.target.value)}
            disabled={trial.isSoftLocked}
            style={{padding:'7px 12px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
              fontSize:'13px',color:'#0A3D62',background:'white',cursor:trial.isSoftLocked?'not-allowed':'pointer'}}>
            {SECTORS.map(s=><option key={s}>{s}</option>)}
          </select>

          <div style={{display:'flex',gap:'4px',marginLeft:'auto'}}>
            {/* LIVE toggle */}
            <button onClick={()=>setLive(l=>!l)}
              style={{display:'flex',alignItems:'center',gap:'5px',padding:'6px 12px',
                borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                background:live?'rgba(116,187,101,0.1)':'transparent',cursor:'pointer',fontSize:'12px',
                color:live?'#74BB65':'#696969',fontWeight:700}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',
                background:live?'#74BB65':'#696969',
                animation:live?'livePulse 2s infinite':'none'}}/>
              {live?'LIVE':'Paused'}
            </button>
            {/* View toggle */}
            {['table','cards'].map(v=>(
              <button key={v} onClick={()=>setView(v as any)}
                style={{padding:'6px 12px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,
                  background:view===v?'#0A3D62':'rgba(10,61,98,0.06)',color:view===v?'white':'#0A3D62'}}>
                {v==='table'?'≡ Table':'⊞ Cards'}
              </button>
            ))}
          </div>

          <span style={{fontSize:'12px',color:'#696969'}}>{filtered.length} signals</span>
        </div>
      </div>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'20px 24px',display:'grid',
        gridTemplateColumns:'1fr 320px',gap:'20px',alignItems:'start'}}>

        {/* Main signal feed */}
        <div>
          {view === 'table' ? (
            <div style={{background:'white',borderRadius:'12px',overflow:'hidden',
              boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
              <table className="gfm-table">
                <thead><tr>
                  <th>Grade</th><th>Company</th><th>Economy</th><th>Sector</th>
                  <th>CapEx</th><th>SCI</th><th>Z3</th><th>Source</th><th>Date</th>
                </tr></thead>
                <tbody>
                  {filtered.map((s,i)=>(
                    <tr key={s.ref}
                      style={{background:i===ticker&&live?'rgba(116,187,101,0.05)':'transparent',transition:'background 0.4s'}}>
                      <td>
                        <span style={{fontSize:'11px',fontWeight:700,padding:'3px 8px',borderRadius:'12px',
                          background:GRADE_BG[s.grade],color:GRADE_C[s.grade]}}>{s.grade}</span>
                      </td>
                      <td style={{fontWeight:600,color:'#0A3D62'}}>{s.company}</td>
                      <td>
                        <span style={{marginRight:'5px'}}>{s.flag}</span>
                        <SourceBadge source={s.source} url="#" date={s.date} accessed="20 Mar 2026" refCode={s.src_ref}>
                          {s.eco}
                        </SourceBadge>
                      </td>
                      <td style={{color:'#696969',fontSize:'12px'}}>{s.sector}</td>
                      <td style={{fontFamily:'monospace',fontWeight:700,color:'#0A3D62'}}>{s.capex}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                          <div style={{width:'36px',height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.08)'}}>
                            <div style={{height:'100%',borderRadius:'3px',width:`${s.sci}%`,background:GRADE_C[s.grade]}}/>
                          </div>
                          <span style={{fontSize:'11px',fontWeight:700,color:GRADE_C[s.grade],fontFamily:'monospace'}}>{s.sci}</span>
                        </div>
                      </td>
                      <td>
                        <span title={s.sha} style={{fontSize:'12px',color:s.z3?'#74BB65':'#E57373',fontWeight:700}}>
                          {s.z3?'✓ Z3':'—'}
                        </span>
                      </td>
                      <td style={{fontSize:'11px',color:'#696969',fontFamily:'monospace'}}>{s.src_ref}</td>
                      <td style={{fontSize:'11px',color:'#696969'}}>{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'12px'}}>
              {filtered.map((s,i)=>(
                <div key={s.ref} style={{background:'white',borderRadius:'12px',padding:'18px',
                  boxShadow:'0 2px 8px rgba(10,61,98,0.06)',
                  borderLeft:`3px solid ${GRADE_C[s.grade]}`,
                  background2:i===ticker&&live?'rgba(116,187,101,0.03)':'white',
                  transition:'background 0.4s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                    <span style={{fontSize:'11px',fontWeight:700,padding:'3px 8px',borderRadius:'10px',
                      background:GRADE_BG[s.grade],color:GRADE_C[s.grade]}}>{s.grade}</span>
                    <span style={{fontSize:'10px',color:'#696969'}}>{s.date}</span>
                  </div>
                  <div style={{fontSize:'15px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>{s.company}</div>
                  <div style={{fontSize:'12px',color:'#696969',marginBottom:'10px'}}>
                    {s.flag} {s.eco} · {s.sector} · {s.type}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'18px',fontWeight:800,color:'#0A3D62',fontFamily:'monospace'}}>{s.capex}</span>
                    <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                      <span style={{fontSize:'10px',color:s.z3?'#74BB65':'#E57373',fontWeight:700}}>{s.z3?'✓ Z3':'—'}</span>
                      <span style={{fontSize:'12px',fontWeight:700,color:GRADE_C[s.grade]}}>{s.sci} SCI</span>
                    </div>
                  </div>
                  <div style={{fontSize:'10px',color:'#696969',marginTop:'8px',fontFamily:'monospace'}}>{s.ref}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side panel: SCI formula */}
        <div style={{display:'flex',flexDirection:'column',gap:'14px',position:'sticky',top:'200px'}}>
          {/* SCI Score explanation */}
          <div style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <button onClick={()=>setSciOpen(o=>!o)}
              style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',
                border:'none',background:'transparent',cursor:'pointer',padding:0}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>Signal Confidence Index (SCI)</div>
              <span style={{color:'#696969'}}>{sciOpen?'▲':'▼'}</span>
            </button>
            {sciOpen && (
              <div style={{marginTop:'12px'}}>
                {SCI_FORMULA.components.map(c=>(
                  <div key={c.name} style={{marginBottom:'10px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                      <span style={{fontSize:'11px',fontWeight:700,color:'#0A3D62'}}>{c.name}</span>
                      <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65'}}>{c.weight}%</span>
                    </div>
                    <div style={{height:'4px',borderRadius:'2px',background:'rgba(10,61,98,0.08)',marginBottom:'2px'}}>
                      <div style={{height:'100%',borderRadius:'2px',width:`${c.weight*4}%`,background:'#74BB65'}}/>
                    </div>
                    <div style={{fontSize:'10px',color:'#696969'}}>{c.desc}</div>
                  </div>
                ))}
                <div style={{paddingTop:'8px',borderTop:'1px solid rgba(10,61,98,0.06)',fontSize:'11px',color:'#696969'}}>
                  Each signal scores 0–100. PLATINUM ≥90 · GOLD ≥75 · SILVER ≥60 · BRONZE ≥40
                </div>
              </div>
            )}
          </div>

          {/* Grade distribution */}
          <div style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Grade Distribution</div>
            {GRADES.map(g=>{
              const cnt = SIGNALS.filter(s=>s.grade===g).length;
              const pct = Math.round(cnt/SIGNALS.length*100);
              return (
                <div key={g} style={{marginBottom:'8px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                    <span style={{fontSize:'11px',fontWeight:700,color:GRADE_C[g]}}>{g}</span>
                    <span style={{fontSize:'11px',color:'#696969'}}>{cnt} ({pct}%)</span>
                  </div>
                  <div style={{height:'6px',borderRadius:'3px',background:'rgba(10,61,98,0.06)'}}>
                    <div style={{height:'100%',borderRadius:'3px',width:`${pct}%`,background:GRADE_C[g]}}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trial quota indicator */}
          {!trial.isProfessional && (
            <div style={{background:'white',borderRadius:'12px',padding:'18px',
              border:'1px solid rgba(116,187,101,0.2)',boxShadow:'0 2px 8px rgba(116,187,101,0.08)'}}>
              <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>Trial Access</div>
              <div style={{display:'flex',flexDirection:'column',gap:'6px',fontSize:'12px'}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:'#696969'}}>Searches used</span>
                  <span style={{fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{trial.searchesUsed}/{trial.searchesMax}</span>
                </div>
                <div style={{height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.08)'}}>
                  <div style={{height:'100%',borderRadius:'3px',background:trial.searchesUsed>=trial.searchesMax?'#E57373':'#74BB65',
                    width:`${(trial.searchesUsed/trial.searchesMax)*100}%`,transition:'width 0.3s'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:'#696969'}}>Reports used</span>
                  <span style={{fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{trial.reportsUsed}/{trial.reportsMax}</span>
                </div>
                <div style={{height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.08)'}}>
                  <div style={{height:'100%',borderRadius:'3px',background:trial.reportsUsed>=trial.reportsMax?'#E57373':'#74BB65',
                    width:`${(trial.reportsUsed/trial.reportsMax)*100}%`,transition:'width 0.3s'}}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
