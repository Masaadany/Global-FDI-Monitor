'use client';
import { useState } from 'react';
import { Mail, FileText, CheckCircle, Edit2, Eye, Send, Linkedin, Download, RefreshCw, AlertCircle, X, Calendar, Clock, Users, Globe, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const CURRENT_ISSUE = {
  number: 47,
  week: 'March 16–22, 2026',
  generated: 'March 23, 2026, 00:32 GMT',
  status: 'PENDING_REVIEW',
  subscribers: 12847,
  schedule: 'Tuesday, March 24, 2026 — 08:00 GMT',
  headline: 'Vietnam, Thailand, Malaysia Form "ASEAN EV Corridor" – $25B Supply Chain Investment',
  sections: {
    topUpdate: {
      headline: 'Vietnam, Thailand, Malaysia Form "ASEAN EV Corridor" – $25B Supply Chain Investment',
      analysis: 'Three Southeast Asian nations have signed a landmark agreement to create an integrated electric vehicle supply chain spanning the region. The pact includes harmonized incentives, cross-border tariff elimination, and joint infrastructure development across Vietnam, Thailand, and Malaysia.',
      sources: [
        {name:'Ministry of Investment Vietnam', verified:true},
        {name:'Thailand BOI',                   verified:true},
        {name:'MITI Malaysia',                  verified:true},
      ],
    },
    regional: [
      {region:'Asia Pacific',        score:78.4, change:'+0.6', eco:'Vietnam',  headline:'New EV battery subsidy approved'},
      {region:'Europe & Middle East', score:74.2, change:'-0.2', eco:'UAE',     headline:'Dubai launches $10B AI fund'},
      {region:'Americas & Africa',    score:69.8, change:'+0.3', eco:'Brazil',  headline:'Amazon announces $5B data center'},
    ],
    sectors: [
      {name:'EV Battery Manufacturing', momentum:92, change:'+12', tier:'HIGH-GROWTH'},
      {name:'AI Data Centers',          momentum:78, change:'+8',  tier:'EMERGING'},
    ],
    signals: [
      {num:1, color:'🔴', type:'POLICY CHANGE',        eco:'Malaysia',  text:'FDI cap in data centers raised to 100%',     pri:'HIGH'},
      {num:2, color:'🟢', type:'NEW INCENTIVE',         eco:'Thailand',  text:'$2B EV battery subsidy package approved',    pri:'HIGH'},
      {num:3, color:'🔵', type:'SECTOR GROWTH',         eco:'Vietnam',   text:'Electronics exports surge 34% YoY',          pri:'MEDIUM'},
      {num:4, color:'🟡', type:'ZONE AVAILABILITY',     eco:'Indonesia', text:'New Batam zone with 200ha ready',             pri:'MEDIUM'},
      {num:5, color:'🔵', type:'COMPETITOR MOVEMENT',   eco:'Indonesia', text:'$15B nickel processing investment',           pri:'HIGH'},
    ],
  },
};

type Status = 'PENDING_REVIEW' | 'APPROVED' | 'DISTRIBUTED';
const STATUS_C: Record<Status,string> = {PENDING_REVIEW:'#FFB347',APPROVED:'#74BB65',DISTRIBUTED:'#0A3D62'};
const STATUS_LABEL: Record<Status,string> = {PENDING_REVIEW:'Pending Review',APPROVED:'Approved',DISTRIBUTED:'Distributed'};

export default function NewsletterPage() {
  const [status,    setStatus]    = useState<Status>('PENDING_REVIEW');
  const [editing,   setEditing]   = useState<string|null>(null);
  const [approving, setApproving] = useState(false);
  const [approved,  setApproved]  = useState(false);
  const [generating,setGenerating]= useState(false);
  const [tab,       setTab]       = useState<'review'|'history'|'settings'>('review');
  const [headline,  setHeadline]  = useState(CURRENT_ISSUE.sections.topUpdate.headline);
  const [showPDF,   setShowPDF]   = useState(false);

  const HISTORY = [
    {num:46,date:'Mar 17, 2026',title:'Saudi Arabia Vision 2030 Accelerates: $18B in Q1 Commitments',  opens:'68%', downloads:2840, linkedin:412},
    {num:45,date:'Mar 10, 2026',title:'Indonesia Emerges as EV Battery Giant: $22B Pipeline Confirmed', opens:'71%', downloads:3120, linkedin:528},
    {num:44,date:'Mar 3,  2026',title:'Africa Rising: $12B FDI Surge in Q4 2025 Defies Global Trends',  opens:'65%', downloads:2610, linkedin:380},
    {num:43,date:'Feb 24, 2026',title:'Singapore Dominates Tech FDI: $8.5B in Data Centre Investments', opens:'73%', downloads:3350, linkedin:591},
  ];

  async function approve() {
    setApproving(true);
    await new Promise(r=>setTimeout(r,2000));
    setStatus('APPROVED');
    setApproved(true);
    setApproving(false);
  }

  async function distribute() {
    setGenerating(true);
    await new Promise(r=>setTimeout(r,3500));
    setStatus('DISTRIBUTED');
    setGenerating(false);
  }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>

      {/* Header */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'28px 24px 0'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'12px',marginBottom:'20px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                <Mail size={16} color="#74BB65"/>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>
                  Newsletter System
                </span>
                <span style={{fontSize:'10px',fontWeight:800,padding:'2px 8px',borderRadius:'8px',
                  background:`${STATUS_C[status]}20`,color:STATUS_C[status]}}>
                  {STATUS_LABEL[status]}
                </span>
              </div>
              <h1 style={{fontSize:'22px',fontWeight:800,color:'white',marginBottom:'3px'}}>
                Weekly Intelligence Brief — Issue #{CURRENT_ISSUE.number}
              </h1>
              <p style={{color:'rgba(226,242,223,0.75)',fontSize:'13px'}}>
                Week of {CURRENT_ISSUE.week} · Generated: {CURRENT_ISSUE.generated}
              </p>
            </div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <button onClick={()=>setShowPDF(true)} style={{display:'flex',alignItems:'center',gap:'6px',
                padding:'9px 16px',border:'1px solid rgba(255,255,255,0.25)',borderRadius:'8px',
                background:'transparent',cursor:'pointer',fontSize:'12px',fontWeight:700,color:'rgba(226,242,223,0.9)'}}>
                <Eye size={13}/> Quick PDF Preview
              </button>
              <a href="/newsletter/preview" target="_blank" style={{display:'flex',alignItems:'center',gap:'6px',
                padding:'9px 16px',border:'1px solid rgba(255,255,255,0.25)',borderRadius:'8px',
                textDecoration:'none',fontSize:'12px',fontWeight:700,color:'rgba(226,242,223,0.9)'}}>
                <FileText size={13}/> Full PDF (4-page)
              </a>
              <a href="/newsletter/email" target="_blank" style={{display:'flex',alignItems:'center',gap:'6px',
                padding:'9px 16px',border:'1px solid rgba(255,255,255,0.25)',borderRadius:'8px',
                textDecoration:'none',fontSize:'12px',fontWeight:700,color:'rgba(226,242,223,0.9)'}}>
                <Mail size={13}/> Email Preview
              </a>
              {status==='PENDING_REVIEW' && !approved && (
                <button onClick={approve} disabled={approving}
                  style={{display:'flex',alignItems:'center',gap:'6px',padding:'9px 18px',
                    background:approving?'rgba(116,187,101,0.5)':'#74BB65',color:'white',border:'none',
                    borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:800,
                    boxShadow:'0 4px 14px rgba(116,187,101,0.35)'}}>
                  {approving
                    ? <><span style={{width:'13px',height:'13px',border:'2px solid white',borderTopColor:'transparent',
                        borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/> Approving…</>
                    : <><CheckCircle size={14}/> Approve & Schedule</>}
                </button>
              )}
              {(status==='APPROVED'||approved) && status!=='DISTRIBUTED' && (
                <button onClick={distribute} disabled={generating}
                  style={{display:'flex',alignItems:'center',gap:'6px',padding:'9px 18px',
                    background:generating?'rgba(10,61,98,0.5)':'#0A3D62',color:'white',border:'none',
                    borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:800}}>
                  {generating
                    ? <><span style={{width:'13px',height:'13px',border:'2px solid white',borderTopColor:'transparent',
                        borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/> Distributing…</>
                    : <><Send size={14}/> Distribute Now</>}
                </button>
              )}
              {status==='DISTRIBUTED' && (
                <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'9px 16px',
                  background:'rgba(116,187,101,0.1)',border:'1px solid rgba(116,187,101,0.3)',
                  borderRadius:'8px',fontSize:'12px',fontWeight:700,color:'#74BB65'}}>
                  <CheckCircle size={13}/> Distributed to {CURRENT_ISSUE.subscribers.toLocaleString()} subscribers
                </div>
              )}
            </div>
          </div>
          <div style={{display:'flex',gap:'0'}}>
            {[{id:'review',label:'Review Content'},{id:'history',label:'Issue History'},{id:'settings',label:'Distribution Settings'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                style={{padding:'10px 18px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  background:'transparent',color:tab===t.id?'white':'rgba(226,242,223,0.65)',
                  borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',transition:'all 0.2s'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'16px'}}>

        {/* PDF PREVIEW MODAL */}
        {showPDF && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:1000,
            display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
            <div style={{background:'white',borderRadius:'16px',maxWidth:'700px',width:'100%',maxHeight:'90vh',overflow:'auto'}}>
              {/* PDF Cover preview */}
              <div style={{background:'linear-gradient(135deg,#1a2c3e 0%,#0A3D62 100%)',
                padding:'48px 40px',textAlign:'center',position:'relative'}}>
                <button onClick={()=>setShowPDF(false)} style={{position:'absolute',top:'16px',right:'16px',
                  background:'rgba(255,255,255,0.1)',border:'none',borderRadius:'8px',cursor:'pointer',
                  padding:'8px',color:'white'}}>
                  <X size={16}/>
                </button>
                <div style={{fontSize:'13px',fontWeight:800,color:'rgba(255,255,255,0.6)',letterSpacing:'0.15em',marginBottom:'16px'}}>
                  GLOBAL FDI MONITOR
                </div>
                <div style={{fontSize:'11px',fontWeight:700,color:'#74BB65',letterSpacing:'0.12em',marginBottom:'24px',textTransform:'uppercase'}}>
                  Weekly Intelligence Brief
                </div>
                <div style={{width:'60px',height:'3px',background:'#74BB65',margin:'0 auto 20px'}}/>
                <div style={{fontSize:'13px',fontWeight:700,color:'rgba(255,255,255,0.7)',marginBottom:'4px'}}>
                  ISSUE #{CURRENT_ISSUE.number}
                </div>
                <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'32px'}}>MARCH 24, 2026</div>
                <div style={{background:'rgba(116,187,101,0.15)',border:'2px solid #74BB65',
                  borderRadius:'12px',padding:'20px 28px',marginBottom:'24px'}}>
                  <div style={{fontSize:'18px',fontWeight:900,color:'white',lineHeight:'1.3'}}>
                    ASEAN EV CORRIDOR: $25B SUPPLY CHAIN<br/>
                    INVESTMENT RESHAPES SOUTHEAST ASIA
                  </div>
                </div>
                <div style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.15)',
                  borderRadius:'10px',padding:'14px 20px',textAlign:'left'}}>
                  {['Top Global Update: ASEAN EV Corridor','Regional Investment Analysis',
                    'Sector Spotlight: EV Battery & AI Data Centers','Top 5 Global Investment Signals',
                    'Executive Summary & Strategic Implications'].map((item,i)=>(
                    <div key={i} style={{fontSize:'12px',color:'rgba(226,242,223,0.75)',
                      padding:'4px 0',display:'flex',gap:'8px',alignItems:'center'}}>
                      <span style={{color:'#74BB65'}}>•</span>{item}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:'24px',fontSize:'11px',color:'rgba(255,255,255,0.35)',letterSpacing:'0.08em'}}>
                  CREATED BY GLOBAL FDI MONITOR
                </div>
              </div>
              {/* PDF page 2 preview */}
              <div style={{padding:'32px 40px',background:'#fafafa',borderTop:'4px solid #74BB65'}}>
                <div style={{fontSize:'13px',fontWeight:900,color:'#0A3D62',textTransform:'uppercase',
                  letterSpacing:'0.1em',marginBottom:'16px',borderBottom:'2px solid #74BB65',paddingBottom:'8px'}}>
                  Executive Summary
                </div>
                <p style={{fontSize:'12px',color:'#333',lineHeight:'1.75',marginBottom:'14px'}}>
                  This week's intelligence confirms a structural shift in global supply chains toward 
                  Southeast Asia. The ASEAN EV Corridor represents the most significant regional 
                  investment integration in a decade.
                </p>
                {[{n:'1',title:'EV BATTERY SUPPLY CHAIN',body:'Vietnam offers fastest land acquisition; Thailand provides strongest incentives; Malaysia delivers most mature semiconductor base. Diversify across all three for supply chain resilience.'},
                  {n:'2',title:'AI DATA CENTERS',body:'Malaysia\'s 100% FDI cap opens immediate opportunities. Power availability is the binding constraint — prioritize locations with committed renewable energy infrastructure.'},
                  {n:'3',title:'REGIONAL DYNAMICS',body:'Asia Pacific continues to outperform (78.4 score, +0.6). Europe & Middle East facing temporary headwinds. Americas & Africa showing steady growth.'},
                ].map(item=>(
                  <div key={item.n} style={{background:'white',border:'1px solid #e0e0e0',borderLeft:'4px solid #74BB65',
                    borderRadius:'4px',padding:'12px 16px',marginBottom:'10px'}}>
                    <div style={{fontSize:'11px',fontWeight:900,color:'#0A3D62',marginBottom:'5px'}}>
                      {item.n}. {item.title}
                    </div>
                    <div style={{fontSize:'11px',color:'#555',lineHeight:'1.6'}}>{item.body}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:'16px 32px',background:'white',borderTop:'1px solid #eee',textAlign:'center',display:'flex',gap:'10px',justifyContent:'center'}}>
                <button style={{padding:'10px 24px',background:'#0A3D62',color:'white',border:'none',
                  borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:700,
                  display:'flex',alignItems:'center',gap:'6px'}}>
                  <Download size={13}/> Download Full PDF
                </button>
                <button onClick={()=>setShowPDF(false)} style={{padding:'10px 18px',border:'1px solid rgba(10,61,98,0.15)',
                  borderRadius:'8px',background:'transparent',cursor:'pointer',fontSize:'13px',color:'#696969'}}>
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {tab==='review' && (
          <>
            {/* Section 1: Top Global Update */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'28px',height:'28px',borderRadius:'8px',background:'rgba(116,187,101,0.1)',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:800,color:'#74BB65'}}>1</div>
                  <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>TOP GLOBAL UPDATE</span>
                  <span style={{fontSize:'10px',padding:'2px 7px',borderRadius:'6px',
                    background:'rgba(116,187,101,0.1)',color:'#74BB65',fontWeight:700}}>VERIFIED ✓</span>
                </div>
                <button onClick={()=>setEditing(editing==='s1'?null:'s1')}
                  style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',
                    border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',background:'transparent',
                    cursor:'pointer',fontSize:'12px',color:'#696969'}}>
                  <Edit2 size={12}/> {editing==='s1'?'Save':'Edit'}
                </button>
              </div>
              {editing==='s1' ? (
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  <div>
                    <label style={{fontSize:'11px',fontWeight:700,color:'#696969',display:'block',marginBottom:'4px'}}>HEADLINE</label>
                    <input value={headline} onChange={e=>setHeadline(e.target.value)}
                      style={{width:'100%',padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.2)',
                        fontSize:'14px',fontWeight:700,color:'#0A3D62',outline:'none'}}/>
                  </div>
                  <div>
                    <label style={{fontSize:'11px',fontWeight:700,color:'#696969',display:'block',marginBottom:'4px'}}>STRATEGIC ANALYSIS</label>
                    <textarea defaultValue={CURRENT_ISSUE.sections.topUpdate.analysis} rows={4}
                      style={{width:'100%',padding:'10px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.2)',
                        fontSize:'13px',color:'#0A3D62',outline:'none',resize:'vertical'}}/>
                  </div>
                </div>
              ) : (
                <>
                  <h3 style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',marginBottom:'8px',lineHeight:'1.4'}}>{headline}</h3>
                  <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.75',marginBottom:'14px'}}>{CURRENT_ISSUE.sections.topUpdate.analysis}</p>
                </>
              )}
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {CURRENT_ISSUE.sections.topUpdate.sources.map(s=>(
                  <div key={s.name} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'11px',
                    padding:'4px 10px',borderRadius:'7px',
                    background:s.verified?'rgba(116,187,101,0.08)':'rgba(229,115,115,0.08)',
                    border:`1px solid ${s.verified?'rgba(116,187,101,0.2)':'rgba(229,115,115,0.2)'}`,
                    color:s.verified?'#74BB65':'#E57373'}}>
                    {s.verified?<CheckCircle size={10}/>:<AlertCircle size={10}/>}
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Regional Updates */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'28px',height:'28px',borderRadius:'8px',background:'rgba(27,108,168,0.1)',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:800,color:'#1B6CA8'}}>2</div>
                  <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>REGIONAL UPDATES</span>
                </div>
                <button onClick={()=>setEditing(editing==='s2'?null:'s2')}
                  style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',
                    border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',background:'transparent',
                    cursor:'pointer',fontSize:'12px',color:'#696969'}}>
                  <Edit2 size={12}/> Edit
                </button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                {CURRENT_ISSUE.sections.regional.map(r=>(
                  <div key={r.region} style={{padding:'16px',borderRadius:'10px',
                    background:'rgba(10,61,98,0.03)',border:'1px solid rgba(10,61,98,0.07)'}}>
                    <div style={{fontSize:'11px',fontWeight:800,color:'#696969',textTransform:'uppercase',
                      letterSpacing:'0.06em',marginBottom:'6px'}}>{r.region}</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:'8px',marginBottom:'4px'}}>
                      <span style={{fontSize:'22px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace'}}>{r.score}</span>
                      <span style={{fontSize:'12px',fontWeight:700,
                        color:r.change.startsWith('+')?'#74BB65':'#E57373'}}>{r.change}</span>
                    </div>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>{r.eco}</div>
                    <div style={{fontSize:'11px',color:'#696969'}}>{r.headline}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Sector Updates */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'28px',height:'28px',borderRadius:'8px',background:'rgba(116,187,101,0.1)',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:800,color:'#74BB65'}}>3</div>
                  <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>SECTOR UPDATES</span>
                </div>
                <button style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',
                  border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',background:'transparent',
                  cursor:'pointer',fontSize:'12px',color:'#696969'}}>
                  <Edit2 size={12}/> Edit
                </button>
              </div>
              <div style={{display:'flex',gap:'14px'}}>
                {CURRENT_ISSUE.sections.sectors.map(s=>(
                  <div key={s.name} style={{flex:1,padding:'16px',borderRadius:'10px',
                    background:`rgba(${s.tier==='HIGH-GROWTH'?'116,187,101':'27,108,168'},0.05)`,
                    border:`1px solid rgba(${s.tier==='HIGH-GROWTH'?'116,187,101':'27,108,168'},0.15)`}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                      <span style={{fontSize:'11px',fontWeight:800,padding:'2px 8px',borderRadius:'8px',
                        background:s.tier==='HIGH-GROWTH'?'rgba(116,187,101,0.1)':'rgba(27,108,168,0.1)',
                        color:s.tier==='HIGH-GROWTH'?'#74BB65':'#1B6CA8'}}>{s.tier}</span>
                    </div>
                    <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>{s.name}</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:'8px'}}>
                      <span style={{fontSize:'24px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace'}}>{s.momentum}</span>
                      <span style={{fontSize:'13px',color:'#74BB65',fontWeight:700}}>▲ {s.change}</span>
                      <span style={{fontSize:'11px',color:'#696969'}}>/100</span>
                    </div>
                    <div style={{height:'6px',borderRadius:'3px',background:'rgba(10,61,98,0.06)',marginTop:'8px'}}>
                      <div style={{height:'100%',borderRadius:'3px',width:`${s.momentum}%`,
                        background:s.tier==='HIGH-GROWTH'?'#74BB65':'#1B6CA8'}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Top 5 Signals */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'28px',height:'28px',borderRadius:'8px',background:'rgba(10,61,98,0.1)',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:800,color:'#0A3D62'}}>4</div>
                  <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>TOP 5 INVESTMENT SIGNALS</span>
                </div>
                <button style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',
                  border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',background:'transparent',
                  cursor:'pointer',fontSize:'12px',color:'#696969'}}>
                  <Edit2 size={12}/> Edit
                </button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {CURRENT_ISSUE.sections.signals.map(sig=>(
                  <div key={sig.num} style={{display:'flex',alignItems:'center',gap:'14px',padding:'12px 16px',
                    borderRadius:'10px',background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.07)',flexWrap:'wrap'}}>
                    <span style={{fontSize:'18px',fontWeight:900,color:'#696969',fontFamily:'monospace',minWidth:'24px'}}>#{sig.num}</span>
                    <span style={{fontSize:'16px'}}>{sig.color}</span>
                    <div style={{flex:1,minWidth:'200px'}}>
                      <span style={{fontSize:'11px',fontWeight:700,color:'#74BB65',marginRight:'6px'}}>{sig.type}</span>
                      <span style={{fontSize:'13px',color:'#0A3D62',fontWeight:600}}>
                        {sig.eco} — {sig.text}
                      </span>
                    </div>
                    <span style={{fontSize:'10px',fontWeight:800,padding:'3px 9px',borderRadius:'8px',flexShrink:0,
                      background:sig.pri==='HIGH'?'rgba(229,115,115,0.1)':'rgba(255,179,71,0.1)',
                      color:sig.pri==='HIGH'?'#E57373':'#FFB347'}}>{sig.pri}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution Settings */}
            <div className="gfm-card" style={{padding:'24px',background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.1)'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Send size={14} color="#74BB65"/> Distribution Settings
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                <div style={{padding:'14px',borderRadius:'10px',background:'white',border:'1px solid rgba(116,187,101,0.2)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'5px'}}>
                    <Mail size={13} color="#74BB65"/>
                    <span style={{fontSize:'12px',fontWeight:700,color:'#0A3D62'}}>Email Subscribers</span>
                  </div>
                  <div style={{fontSize:'20px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{CURRENT_ISSUE.subscribers.toLocaleString()}</div>
                  <div style={{fontSize:'11px',color:'#696969',marginTop:'3px'}}>{CURRENT_ISSUE.schedule}</div>
                </div>
                <div style={{padding:'14px',borderRadius:'10px',background:'white',border:'1px solid rgba(10,61,98,0.1)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'5px'}}>
                    <Linkedin size={13} color="#0A3D62"/>
                    <span style={{fontSize:'12px',fontWeight:700,color:'#0A3D62'}}>LinkedIn Auto-Post</span>
                  </div>
                  <div style={{fontSize:'12px',color:'#696969',lineHeight:'1.5'}}>
                    PDF cover image + caption<br/>Auto-post on approval
                  </div>
                  <div style={{fontSize:'11px',fontWeight:700,color:'#74BB65',marginTop:'5px'}}>✓ Enabled</div>
                </div>
                <div style={{padding:'14px',borderRadius:'10px',background:'white',border:'1px solid rgba(10,61,98,0.1)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'5px'}}>
                    <FileText size={13} color="#0A3D62"/>
                    <span style={{fontSize:'12px',fontWeight:700,color:'#0A3D62'}}>PDF Publication</span>
                  </div>
                  <div style={{fontSize:'12px',color:'#696969',lineHeight:'1.5'}}>
                    4-page A4 PDF<br/>Auto-upload to Publications
                  </div>
                  <div style={{fontSize:'11px',fontWeight:700,color:'#74BB65',marginTop:'5px'}}>✓ Auto-upload</div>
                </div>
              </div>
            </div>
          </>
        )}

        {tab==='history' && (
          <div className="gfm-card" style={{overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(10,61,98,0.06)',
              fontSize:'13px',fontWeight:700,color:'#0A3D62',display:'flex',alignItems:'center',gap:'6px'}}>
              <Calendar size={14} color="#74BB65"/> Past Issues
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'rgba(10,61,98,0.03)'}}>
                  {['Issue','Title','Published','Open Rate','Downloads','LinkedIn'].map(h=>(
                    <th key={h} style={{padding:'10px 16px',fontSize:'11px',fontWeight:700,color:'#696969',
                      textAlign:'left',textTransform:'uppercase',letterSpacing:'0.04em'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORY.map(h=>(
                  <tr key={h.num} style={{borderBottom:'1px solid rgba(10,61,98,0.04)'}}>
                    <td style={{padding:'12px 16px',fontFamily:'monospace',fontWeight:700,color:'#74BB65'}}>#{h.num}</td>
                    <td style={{padding:'12px 16px',fontSize:'13px',color:'#0A3D62',maxWidth:'320px'}}>{h.title}</td>
                    <td style={{padding:'12px 16px',fontSize:'12px',color:'#696969'}}>{h.date}</td>
                    <td style={{padding:'12px 16px',fontFamily:'monospace',fontWeight:700,color:'#74BB65'}}>{h.opens}</td>
                    <td style={{padding:'12px 16px',fontFamily:'monospace',color:'#0A3D62'}}>{h.downloads.toLocaleString()}</td>
                    <td style={{padding:'12px 16px',fontFamily:'monospace',color:'#0A3D62'}}>{h.linkedin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='settings' && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>Newsletter Generation Schedule</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                {[{l:'AI Generation',v:'Monday, 00:00 GMT',desc:'Automated scraping + content generation'},
                  {l:'Review Window',v:'Monday 10:00–16:00 GMT',desc:'Admin review and approval window'},
                  {l:'Email Distribution',v:'Tuesday, 08:00 GMT',desc:'Send to all active subscribers'},
                  {l:'PDF Publication',v:'On approval',desc:'Auto-upload to Publications page'},
                  {l:'LinkedIn Post',v:'On approval',desc:'Auto-post with cover image'},
                  {l:'Analytics Report',v:'Wednesday, 09:00 GMT',desc:'Engagement summary to admin'},
                ].map(({l,v,desc})=>(
                  <div key={l} style={{padding:'14px',borderRadius:'10px',background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.07)'}}>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'3px'}}>{l}</div>
                    <div style={{fontSize:'13px',fontWeight:800,color:'#74BB65',fontFamily:'monospace',marginBottom:'3px'}}>{v}</div>
                    <div style={{fontSize:'11px',color:'#696969'}}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>AI Coverage Scope</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
                {[{i:'🌍',l:'215 Economies',d:'All countries covered'},
                  {i:'⚙',l:'21 ISIC Sectors',d:'Full sector monitoring'},
                  {i:'🏛',l:'300+ Sources',d:'T1-T4 verified sources'},
                  {i:'📡',l:'Real-time scraping',d:'Every 2 seconds'},
                  {i:'🤖',l:'AI generation',d:'GPT-4 powered briefs'},
                  {i:'📊',l:'Signal scoring',d:'SCI-scored signals'},
                ].map(({i,l,d})=>(
                  <div key={l} style={{display:'flex',gap:'10px',padding:'12px',borderRadius:'9px',
                    background:'rgba(116,187,101,0.04)',border:'1px solid rgba(116,187,101,0.15)'}}>
                    <span style={{fontSize:'20px'}}>{i}</span>
                    <div>
                      <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62'}}>{l}</div>
                      <div style={{fontSize:'11px',color:'#696969'}}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
